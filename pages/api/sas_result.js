import getPool from "../../lib/db.js";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function pickSingle(v) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method Not Allowed" });

  try {
    const idRaw = pickSingle(req.query?.id);
    const id = idRaw ? String(idRaw).trim() : "";
    if (!id) return json(res, 400, { error: "Missing id" });

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      const [rows] = await conn.query(
        `
        SELECT
          a.id,
          a.raw_score,
          a.standard_score,
          a.level
        FROM assessments a
        WHERE a.id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!rows || rows.length === 0) return json(res, 404, { error: "Not found" });

      const r = rows[0];

      // 给前端统一结构
      return json(res, 200, {
        ok: true,
        assessmentId: r.id,
        score: { raw: r.raw_score, standard: r.standard_score, level: r.level },
      });
    } finally {
      conn.release();
    }
  } catch (e) {
    return json(res, 500, { error: String(e.message || e) });
  }
}
