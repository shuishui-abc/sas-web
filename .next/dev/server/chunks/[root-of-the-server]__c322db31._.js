module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

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
"[project]/Desktop/sas/sas-web/pages/api/sas_result.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/sas/sas-web/lib/db.js [api] (ecmascript)");
;
function json(res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(data));
}
function pickSingle(v) {
    return Array.isArray(v) ? v[0] : v;
}
async function handler(req, res) {
    if (req.method !== "GET") return json(res, 405, {
        error: "Method Not Allowed"
    });
    try {
        const idRaw = pickSingle(req.query?.id);
        const id = idRaw ? String(idRaw).trim() : "";
        if (!id) return json(res, 400, {
            error: "Missing id"
        });
        const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(`
        SELECT
          a.id,
          a.raw_score,
          a.standard_score,
          a.level
        FROM assessments a
        WHERE a.id = ?
        LIMIT 1
        `, [
                id
            ]);
            if (!rows || rows.length === 0) return json(res, 404, {
                error: "Not found"
            });
            const r = rows[0];
            // 给前端统一结构
            return json(res, 200, {
                ok: true,
                assessmentId: r.id,
                score: {
                    raw: r.raw_score,
                    standard: r.standard_score,
                    level: r.level
                }
            });
        } finally{
            conn.release();
        }
    } catch (e) {
        return json(res, 500, {
            error: String(e.message || e)
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c322db31._.js.map