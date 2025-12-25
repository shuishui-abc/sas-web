import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

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
        "若出现强烈绝望感/冲动行为/严重胸痛或呼吸困难等，请立即急诊/急救。",
      ],
    };
  }

  if (t === "中度") {
    return {
      title: "建议（中度：建议尽快获得支持）",
      bullets: [
        "优先稳住最影响生活的1–2个症状：睡眠、心悸、反复担心、惊恐等。",
        "连续2周：每天固定“放松训练 + 轻运动”。",
        "建议1周内联系专业支持（家庭医生/心理咨询）做进一步评估与干预（如CBT等）。",
        "减少刺激源：咖啡因、熬夜、酒精、过度信息摄入。",
      ],
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
      "建议1–2周后复测，观察变化。",
    ],
  };
}

const DISCLAIMER =
  "重要提示：本测评为焦虑自评量表（SAS），用于了解最近一周焦虑症状水平变化，适合初步筛查与自我监测；结果受主观感受等影响，不能替代医学诊断或用药依据。如症状持续、加重或已影响睡眠/工作学习/日常生活，建议寻求专业医疗或心理支持。本末源健康管理温馨提示";

export default function ResultPage() {
  const router = useRouter();

  // ✅ 关键：等 router.isReady 再读取 query，避免 hydration mismatch
  const id = useMemo(() => {
    if (!router.isReady) return null;
    const v = pickSingle(router.query?.id);
    return v ? String(v).trim() : null;
  }, [router.isReady, router.query]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        setErr("");
        setLoading(true);
        setData(null);

        // ✅ 相对路径：会自动跟随当前端口（3000/3001）
        const r = await fetch(`/api/sas_result?id=${encodeURIComponent(id)}`);
        const j = await r.json().catch(() => ({}));

        if (!r.ok) {
          throw new Error(j?.error || "获取结果失败");
        }

        if (!cancelled) setData(j);
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  // ✅ SSR 首屏固定输出：避免 hydration 错
  if (!router.isReady) {
    return (
      <div className="container">
        <div className="card">
          <div className="h1">测评结果</div>
          <p className="p">加载中…</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="container">
        <div className="card">
          <div className="h1">测评结果</div>
          <p className="p">缺少结果 id（请从提交完成后自动跳转进入）</p>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" onClick={() => router.push("/")}>
              返回量表
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 兼容你现在 API：data.score.raw / standard / level
  const score = data?.score || null;
  const raw = score?.raw ?? "-";
  const standard = score?.standard ?? "-";
  const level = score?.level ?? "";
  const idx = levelIndex(level);
  const adv = adviceByLevel(level);

  return (
    <div className="container">
      <div className="card">
        <div className="h1">测评结果</div>

        <div className="row" style={{ marginTop: 10 }}>
          <span className="badge">评估ID：{id}</span>
          <span className="badge">原始分：{raw}</span>
          <span className="badge">标准分：{standard}</span>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="qtitle">焦虑分级</div>

          {/* 绿色分级条（需要你 style.css 里有 levelBar/levelSeg/active） */}
          <div className="levelBar" style={{ marginTop: 8 }}>
            {["轻度", "中度", "重度"].map((t, i) => (
              <div key={t} className={"levelSeg " + (i === idx ? "active" : "")}>
                {t}
              </div>
            ))}
          </div>

          <p className="p" style={{ marginTop: 8 }}>
            当前分级：<b>{level ? String(level) : "—"}</b>
          </p>
        </div>

        {loading && <p className="p">加载中…</p>}
        {err && (
          <p className="p" style={{ color: "crimson" }}>
            {err}
          </p>
        )}

        {/* 建议 */}
        <div style={{ marginTop: 16 }}>
          <div className="qtitle">{adv.title}</div>
          <ul className="p" style={{ marginTop: 8, paddingLeft: 18 }}>
            {adv.bullets.map((b) => (
              <li key={b} style={{ marginBottom: 6 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* 免责声明 */}
        <div style={{ marginTop: 16 }}>
          <div className="qtitle">免责声明</div>
          <p className="p" style={{ opacity: 0.85 }}>
            {DISCLAIMER}
          </p>
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn" onClick={() => router.push("/")}>
            返回量表
          </button>
        </div>
      </div>
    </div>
  );
}


