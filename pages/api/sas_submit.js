import { Buffer } from "buffer";
import getPool from "../../lib/db.js";
import { scoreSAS } from "../../lib/score.js";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  if (
    req.body &&
    typeof req.body === "object" &&
    (Object.prototype.hasOwnProperty.call(req.body, "phone") ||
      Object.prototype.hasOwnProperty.call(req.body, "answers"))
  ) {
    return req.body;
  }

  if (typeof req.body === "string") {
    const raw = req.body.replace(/^\uFEFF/, "").trim();
    if (!raw) return {};
    if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
    return JSON.parse(raw);
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  let raw = Buffer.concat(chunks).toString("utf8");
  raw = raw.replace(/^\uFEFF/, "").trim();
  if (!raw) return {};
  if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
  return JSON.parse(raw);
}

function normalizeSex(v) {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  if (!s) return null;
  if (["m", "male", "man", "男", "1"].includes(s)) return "M";
  if (["f", "female", "woman", "女", "0", "2"].includes(s)) return "F";
  return "U";
}

function normalizeAge(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 120) return null;
  return Math.floor(n);
}

export default async function handler(req, res) {
  try {
    if (req.headers && req.headers.expect) delete req.headers.expect;
  } catch {}

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return json(res, 405, { error: "Method Not Allowed" });

  try {
    const body = await readJson(req);
    const { name, sex, age, phone, answers } = body || {};

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return json(res, 400, { error: "phone is required" });
    }
    if (!answers || typeof answers !== "object") {
      return json(res, 400, { error: "answers is required" });
    }

    const phoneNorm = phone.trim();
    const nameNorm = name == null ? null : String(name).trim() || null;
    const sexNorm = normalizeSex(sex);
    const ageNorm = normalizeAge(age);

    // 1..20 强制齐全且为 1..4
    const normAnswers = {};
    for (let i = 1; i <= 20; i++) {
      const v = answers[i] ?? answers[String(i)];
      if (v == null) return json(res, 400, { error: `answer ${i} is required` });

      const num = Number(v);
      if (![1, 2, 3, 4].includes(num)) {
        return json(res, 400, { error: `answer ${i} must be 1..4` });
      }
      normAnswers[i] = num;
    }

    // 计分（raw/standard/level）——仍然以 score.js 为准
    const { raw, standard, level } = scoreSAS(normAnswers);

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // users：phone 唯一，允许 name null（你已改表）
      await conn.query(
        `
        INSERT INTO users (name, sex, age, phone)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          sex  = VALUES(sex),
          age  = VALUES(age)
        `,
        [nameNorm, sexNorm, ageNorm, phoneNorm]
      );

      const [uRows] = await conn.query(
        `SELECT id FROM users WHERE phone = ? LIMIT 1`,
        [phoneNorm]
      );
      if (!uRows?.length) throw new Error("User upsert failed");
      const userId = uRows[0].id;

      // assessments：你已加 scale 列
      const [assessRes] = await conn.query(
        `
        INSERT INTO assessments (user_id, scale, raw_score, standard_score, level)
        VALUES (?, 'SAS', ?, ?, ?)
        `,
        [userId, raw, standard, level]
      );
      const assessmentId = assessRes.insertId;

      // assessment_answers：用你真实列名 answer_value / scored_value
      // 你的表里已经有 question_id、question_no、answer_value、scored_value
      const rows = [];
      for (let q = 1; q <= 20; q++) {
        const answerValue = normAnswers[q];
        // 先把 scored_value 暂时等于 answer_value（不做反向；反向可以以后统一在 score.js 或 SQL 更新）
        const scoredValue = answerValue;

        rows.push([assessmentId, q, q, answerValue, scoredValue]);
      }

      await conn.query(
        `
        INSERT INTO assessment_answers
          (assessment_id, question_id, question_no, answer_value, scored_value)
        VALUES ?
        `,
        [rows]
      );

      await conn.commit();

      return json(res, 200, {
        ok: true,
        id: assessmentId,
        assessmentId,
        score: { raw, standard, level },
      });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) {
    return json(res, 500, { error: String(err.message || err) });
  }
}


