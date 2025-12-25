module.exports = [
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/Desktop/sas/sas-web/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
(()=>{
    const e = new Error("Cannot find module '../../lib/db.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../lib/score.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
/* ---------- 工具函数 ---------- */ function json(res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end(JSON.stringify(data));
}
/**
 * 稳定读取 JSON
 * - 只有当 req.body 明确包含 phone / answers 时才信任
 * - 否则一律从原始 stream 读取
 */ async function readJson(req) {
    // 1) Next 已解析，且字段齐全
    if (req.body && typeof req.body === "object" && (Object.prototype.hasOwnProperty.call(req.body, "phone") || Object.prototype.hasOwnProperty.call(req.body, "answers"))) {
        return req.body;
    }
    // 2) body 是字符串
    if (typeof req.body === "string") {
        const raw = req.body.replace(/^\uFEFF/, "").trim();
        if (!raw) return {};
        if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
        return JSON.parse(raw);
    }
    // 3) 兜底：从原始请求流读取
    const chunks = [];
    for await (const chunk of req)chunks.push(chunk);
    let raw = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat(chunks).toString("utf8");
    raw = raw.replace(/^\uFEFF/, "").trim();
    if (!raw) return {};
    if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
    return JSON.parse(raw);
}
/* ---------- 规范化工具 ---------- */ function normalizeSex(v) {
    if (v == null) return null;
    const s = String(v).trim().toLowerCase();
    if (!s) return null;
    // 男
    if ([
        "m",
        "male",
        "man",
        "男",
        "1"
    ].includes(s)) return "M";
    // 女
    if ([
        "f",
        "female",
        "woman",
        "女",
        "0",
        "2"
    ].includes(s)) return "F";
    // 未知/其他
    if ([
        "u",
        "unknown",
        "其他",
        "未知",
        "不详",
        "na",
        "n/a"
    ].includes(s)) return "U";
    // 兜底：首字符
    const c = s[0];
    if (c === "m") return "M";
    if (c === "f") return "F";
    return "U";
}
function normalizeAge(v) {
    if (v == null || v === "") return null;
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    // 可按需调整范围
    if (n < 0 || n > 120) return null;
    return Math.floor(n);
}
async function handler(req, res) {
    // 忽略 Expect: 100-continue（某些环境下会导致 undici 报错）
    try {
        if (req.headers && req.headers.expect) delete req.headers.expect;
    } catch  {}
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return json(res, 405, {
        error: "Method Not Allowed"
    });
    try {
        const body = await readJson(req);
        const { name, sex, age, phone, answers } = body || {};
        /* ---------- 基础校验 ---------- */ if (!phone || typeof phone !== "string" || !phone.trim()) {
            return json(res, 400, {
                error: "phone is required"
            });
        }
        if (!answers || typeof answers !== "object") {
            return json(res, 400, {
                error: "answers is required"
            });
        }
        const phoneNorm = phone.trim();
        const sexNorm = normalizeSex(sex);
        const ageNorm = normalizeAge(age);
        const nameNorm = name == null ? null : String(name).trim() || null;
        /* ---------- 标准化 answers：强制 1..20 ---------- */ const normAnswers = {};
        for(let i = 1; i <= 20; i++){
            const v = answers[i] ?? answers[String(i)];
            if (v == null) return json(res, 400, {
                error: `answer ${i} is required`
            });
            const num = Number(v);
            if (![
                1,
                2,
                3,
                4
            ].includes(num)) {
                return json(res, 400, {
                    error: `answer ${i} must be 1..4`
                });
            }
            normAnswers[i] = num;
        }
        /* ---------- 计分 ---------- */ const { raw, standard, level } = scoreSAS(normAnswers);
        /* ---------- 写数据库（事务） ---------- */ const pool = getPool();
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // users（按 phone 去重）
            await conn.query(`
        INSERT INTO users (name, sex, age, phone)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          sex  = VALUES(sex),
          age  = VALUES(age)
        `, [
                nameNorm,
                sexNorm,
                ageNorm,
                phoneNorm
            ]);
            const [uRows] = await conn.query(`SELECT id FROM users WHERE phone = ? LIMIT 1`, [
                phoneNorm
            ]);
            if (!uRows || uRows.length === 0) throw new Error("User upsert failed");
            const userId = uRows[0].id;
            // assessments
            const [assessRes] = await conn.query(`
        INSERT INTO assessments (user_id, scale, raw_score, standard_score, level)
        VALUES (?, 'SAS', ?, ?, ?)
        `, [
                userId,
                raw,
                standard,
                level
            ]);
            const assessmentId = assessRes.insertId;
            // answers（批量插入）
            const rows = [];
            for(let i = 1; i <= 20; i++)rows.push([
                assessmentId,
                i,
                normAnswers[i]
            ]);
            await conn.query(`
        INSERT INTO assessment_answers (assessment_id, question_id, answer)
        VALUES ?
        `, [
                rows
            ]);
            await conn.commit();
            // ✅ 返回 id 供前端跳转 /result?id=...
            return json(res, 200, {
                ok: true,
                id: assessmentId,
                assessmentId,
                score: {
                    raw,
                    standard,
                    level
                }
            });
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally{
            conn.release();
        }
    } catch (err) {
        return json(res, 500, {
            error: String(err.message || err)
        });
    }
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__46728727._.js.map