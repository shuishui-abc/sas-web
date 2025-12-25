module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/Desktop/sas/sas-web/pages/result.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResultPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/sas/sas-web/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
function pickSingle(v) {
    return Array.isArray(v) ? v[0] : v;
}
function levelText(level) {
    if (!level) return "";
    const s = String(level);
    // 兼容：轻度焦虑 / 中度焦虑 / 重度焦虑 / 轻度 / 中度 / 重度
    if (s.includes("轻")) return "轻度";
    if (s.includes("中")) return "中度";
    if (s.includes("重")) return "重度";
    return s;
}
function levelIndex(level) {
    const t = levelText(level);
    if (t === "轻度") return 0;
    if (t === "中度") return 1;
    if (t === "重度") return 2;
    return 0;
}
function adviceByLevel(level) {
    const t = levelText(level);
    if (t === "重度") {
        return {
            title: "建议（重度：优先级最高）",
            bullets: [
                "建议尽快（48小时内）寻求专业帮助（家庭医生/精神心理专科/心理服务）。",
                "等待就医期间：减少独处，让可信任的人知晓并陪伴；规律进食与睡眠。",
                "若出现强烈绝望感/冲动行为/严重胸痛或呼吸困难等，请立即急诊/急救。"
            ]
        };
    }
    if (t === "中度") {
        return {
            title: "建议（中度：建议尽快获得支持）",
            bullets: [
                "优先稳住最影响生活的1–2个症状：睡眠、心悸、反复担心、惊恐等。",
                "连续2周：每天固定“放松训练 + 轻运动”。",
                "建议1周内联系专业支持（家庭医生/心理咨询）做进一步评估与干预（如CBT等）。",
                "减少刺激源：咖啡因、熬夜、酒精、过度信息摄入。"
            ]
        };
    }
    // 默认轻度（或正常也给轻度建议）
    return {
        title: "建议（轻度：7天行动版）",
        bullets: [
            "每天10–15分钟：腹式呼吸/渐进性肌肉放松（PMR）或拉伸。",
            "每周≥3次：快走/骑行/瑜伽等20–30分钟。",
            "睡前1小时减少刷手机、咖啡因、酒精；尽量固定入睡时间。",
            "用1分钟记录：触发点—想法—感受—应对（找出最常见诱因）。",
            "建议1–2周后复测，观察变化。"
        ]
    };
}
const DISCLAIMER = "重要提示：本测评为焦虑自评量表（SAS），用于了解最近一周焦虑症状水平变化，适合初步筛查与自我监测；结果受主观感受等影响，不能替代医学诊断或用药依据。如症状持续、加重或已影响睡眠/工作学习/日常生活，建议寻求专业医疗或心理支持。";
function ResultPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$sas$2f$sas$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // ✅ 关键：等 router.isReady 再读取 query，避免 hydration mismatch
    const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!router.isReady) return null;
        const v = pickSingle(router.query?.id);
        return v ? String(v).trim() : null;
    }, [
        router.isReady,
        router.query
    ]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!router.isReady) return;
        if (!id) return;
        let cancelled = false;
        (async ()=>{
            try {
                setErr("");
                setLoading(true);
                setData(null);
                // ✅ 相对路径：会自动跟随当前端口（3000/3001）
                const r = await fetch(`/api/sas_result?id=${encodeURIComponent(id)}`);
                const j = await r.json().catch(()=>({}));
                if (!r.ok) {
                    throw new Error(j?.error || "获取结果失败");
                }
                if (!cancelled) setData(j);
            } catch (e) {
                if (!cancelled) setErr(String(e.message || e));
            } finally{
                if (!cancelled) setLoading(false);
            }
        })();
        return ()=>{
            cancelled = true;
        };
    }, [
        router.isReady,
        id
    ]);
    // ✅ SSR 首屏固定输出：避免 hydration 错
    if (!router.isReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h1",
                        children: "测评结果"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "p",
                        children: "加载中…"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                lineNumber: 119,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
            lineNumber: 118,
            columnNumber: 7
        }, this);
    }
    if (!id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h1",
                        children: "测评结果"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "p",
                        children: "缺少结果 id（请从提交完成后自动跳转进入）"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "row",
                        style: {
                            marginTop: 14
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "btn",
                            onClick: ()=>router.push("/"),
                            children: "返回量表"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                lineNumber: 130,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
            lineNumber: 129,
            columnNumber: 7
        }, this);
    }
    // ✅ 兼容你现在 API：data.score.raw / standard / level
    const score = data?.score || null;
    const raw = score?.raw ?? "-";
    const standard = score?.standard ?? "-";
    const level = score?.level ?? "";
    const idx = levelIndex(level);
    const adv = adviceByLevel(level);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "h1",
                    children: "测评结果"
                }, void 0, false, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 154,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "row",
                    style: {
                        marginTop: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "badge",
                            children: [
                                "评估ID：",
                                id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "badge",
                            children: [
                                "原始分：",
                                raw
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "badge",
                            children: [
                                "标准分：",
                                standard
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "qtitle",
                            children: "焦虑分级"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "levelBar",
                            style: {
                                marginTop: 8
                            },
                            children: [
                                "轻度",
                                "中度",
                                "重度"
                            ].map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "levelSeg " + (i === idx ? "active" : ""),
                                    children: t
                                }, t, false, {
                                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 166,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "p",
                            style: {
                                marginTop: 8
                            },
                            children: [
                                "当前分级：",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                    children: level ? String(level) : "—"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                                    lineNumber: 175,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "p",
                    children: "加载中…"
                }, void 0, false, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 179,
                    columnNumber: 21
                }, this),
                err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "p",
                    style: {
                        color: "crimson"
                    },
                    children: err
                }, void 0, false, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 181,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "qtitle",
                            children: adv.title
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                            className: "p",
                            style: {
                                marginTop: 8,
                                paddingLeft: 18
                            },
                            children: adv.bullets.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                    style: {
                                        marginBottom: 6
                                    },
                                    children: b
                                }, b, false, {
                                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 187,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "qtitle",
                            children: "免责声明"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "p",
                            style: {
                                opacity: 0.85
                            },
                            children: DISCLAIMER
                        }, void 0, false, {
                            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "row",
                    style: {
                        marginTop: 14
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "btn",
                        onClick: ()=>router.push("/"),
                        children: "返回量表"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
                    lineNumber: 206,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/sas/sas-web/pages/result.js",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__78a730e5._.js.map