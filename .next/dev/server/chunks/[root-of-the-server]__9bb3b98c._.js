module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/Desktop/sas/sas-web/lib/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>getPool
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$node_modules$2f$mysql2$29$__ = __turbopack_context__.i("[externals]/mysql2/promise [external] (mysql2/promise, cjs, [project]/Desktop/sas/sas-web/node_modules/mysql2)");
;
let pool;
function getPool() {
    if (!pool) {
        pool = __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$node_modules$2f$mysql2$29$__["default"].createPool({
            host: process.env.MYSQL_HOST || "127.0.0.1",
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "002025",
            database: process.env.MYSQL_DATABASE || "sas_app",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            timezone: "Z"
        });
    }
    return pool;
}
}),
"[project]/Desktop/sas/sas-web/lib/score.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/score.js
__turbopack_context__.s([
    "scoreSAS",
    ()=>scoreSAS
]);
function scoreSAS(answersById) {
    const reverseIds = new Set([
        5,
        9,
        13,
        17,
        19
    ]);
    let raw = 0;
    for(let i = 1; i <= 20; i++){
        const v = Number(answersById[i]);
        if (![
            1,
            2,
            3,
            4
        ].includes(v)) {
            throw new Error(`Invalid answer for Q${i}: ${answersById[i]}`);
        }
        raw += reverseIds.has(i) ? 5 - v : v;
    }
    const standard = Math.round(raw * 1.25);
    let level = "正常";
    if (standard >= 70) level = "重度焦虑";
    else if (standard >= 60) level = "中度焦虑";
    else if (standard >= 50) level = "轻度焦虑";
    return {
        raw,
        standard,
        level
    };
}
}),
"[project]/Desktop/sas/sas-web/pages/api/sas_submit.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/sas/sas-web/lib/db.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$score$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/sas/sas-web/lib/score.js [api] (ecmascript)");
;
;
;
function json(res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end(JSON.stringify(data));
}
async function readJson(req) {
    if (req.body && typeof req.body === "object" && (Object.prototype.hasOwnProperty.call(req.body, "phone") || Object.prototype.hasOwnProperty.call(req.body, "answers"))) {
        return req.body;
    }
    if (typeof req.body === "string") {
        const raw = req.body.replace(/^\uFEFF/, "").trim();
        if (!raw) return {};
        if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
        return JSON.parse(raw);
    }
    const chunks = [];
    for await (const chunk of req)chunks.push(chunk);
    let raw = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat(chunks).toString("utf8");
    raw = raw.replace(/^\uFEFF/, "").trim();
    if (!raw) return {};
    if (!(raw.startsWith("{") || raw.startsWith("["))) throw new Error("Invalid JSON");
    return JSON.parse(raw);
}
function normalizeSex(v) {
    if (v == null) return null;
    const s = String(v).trim().toLowerCase();
    if (!s) return null;
    if ([
        "m",
        "male",
        "man",
        "男",
        "1"
    ].includes(s)) return "M";
    if ([
        "f",
        "female",
        "woman",
        "女",
        "0",
        "2"
    ].includes(s)) return "F";
    return "U";
}
function normalizeAge(v) {
    if (v == null || v === "") return null;
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    if (n < 0 || n > 120) return null;
    return Math.floor(n);
}
async function handler(req, res) {
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
        if (!phone || typeof phone !== "string" || !phone.trim()) {
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
        const nameNorm = name == null ? null : String(name).trim() || null;
        const sexNorm = normalizeSex(sex);
        const ageNorm = normalizeAge(age);
        // 1..20 强制齐全且为 1..4
        const normAnswers = {};
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
        // 计分（raw/standard/level）——仍然以 score.js 为准
        const { raw, standard, level } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$score$2e$js__$5b$api$5d$__$28$ecmascript$29$__["scoreSAS"])(normAnswers);
        const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // users：phone 唯一，允许 name null（你已改表）
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
            if (!uRows?.length) throw new Error("User upsert failed");
            const userId = uRows[0].id;
            // assessments：你已加 scale 列
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
            // assessment_answers：用你真实列名 answer_value / scored_value
            // 你的表里已经有 question_id、question_no、answer_value、scored_value
            const rows = [];
            for(let q = 1; q <= 20; q++){
                const answerValue = normAnswers[q];
                // 先把 scored_value 暂时等于 answer_value（不做反向；反向可以以后统一在 score.js 或 SQL 更新）
                const scoredValue = answerValue;
                rows.push([
                    assessmentId,
                    q,
                    q,
                    answerValue,
                    scoredValue
                ]);
            }
            await conn.query(`
        INSERT INTO assessment_answers
          (assessment_id, question_id, question_no, answer_value, scored_value)
        VALUES ?
        `, [
                rows
            ]);
            await conn.commit();
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9bb3b98c._.js.map