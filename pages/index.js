import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const OPTIONS = [
  { v: 1, t: "很少或没有" },
  { v: 2, t: "有时" },
  { v: 3, t: "经常" },
  { v: 4, t: "几乎总是" },
];

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // key 一律 String(id)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");

  // 拉题库
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sas_questions");
        const text = await res.text();
        let data = {};
        try { data = JSON.parse(text); } catch {}

        if (!res.ok) throw new Error(`sas_questions ${res.status}: ${text.slice(0, 300)}`);

        setQuestions(Array.isArray(data?.questions) ? data.questions : []);
      } catch (e) {
        console.error(e);
        alert(`题目加载失败：${e.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 完成度 & 临时分数（最终分数以后端为准）
  const { rawScore, standardScore, finishedCount, allDone } = useMemo(() => {
    const ids = questions.map((q) => q.id);
    let sum = 0;
    let cnt = 0;

    for (const id of ids) {
      const key = String(id);
      const val = answers[key];
      if (val != null) {
        sum += Number(val);
        cnt += 1;
      }
    }

    return {
      rawScore: sum,
      standardScore: Math.round(sum * 1.25),
      finishedCount: cnt,
      allDone: ids.length > 0 && cnt === ids.length,
    };
  }, [answers, questions]);

  function onPick(qid, val) {
    const key = String(qid);
    setAnswers((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit() {
    if (!allDone) return alert("请先完成所有题目");
    if (!phone.trim()) return alert("请填写手机号（必填，用于识别同一用户）");

    setSubmitting(true);
    try {
      // 转成 {1: v, 2: v...}
      const answersForServer = {};
      for (const q of questions) {
        answersForServer[q.id] = answers[String(q.id)];
      }

      const payload = {
        name: name.trim() || null,
        sex: sex || null,
        age: age ? Number(age) : null,
        phone: phone.trim(),
        answers: answersForServer,
      };

      const res = await fetch("/api/sas_submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) throw new Error(data?.error || `sas_submit ${res.status}: ${text.slice(0, 300)}`);

      const id = data?.id ?? data?.assessmentId;
      if (!id) throw new Error("后端未返回 id");

      window.location.href = `/result?id=${encodeURIComponent(id)}`;
    } catch (e) {
      console.error(e);
      alert(`提交失败：${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>SAS 焦虑自评量表</title>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>

      <div className="container">
        <div className="card">
          <div className="h1">SAS 焦虑自评量表</div>
          <p className="p">请根据最近一周的真实感受作答。完成后自动计算原始分与标准分。</p>

          <div className="row">
            <span className="badge">已完成 {finishedCount}/{questions.length || 20}</span>
            <span className="badge">原始分：{rawScore}</span>
            <span className="badge">标准分：{standardScore}</span>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="qtitle">基本信息</div>

            <div className="row" style={{ alignItems: "stretch" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input className="input" placeholder="姓名（可选）" value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input className="input" placeholder="手机号（必填，用于识别同一用户）" value={phone}
                  onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="row" style={{ alignItems: "stretch" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input className="input" placeholder="性别（可选，如：女/男）" value={sex}
                  onChange={(e) => setSex(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input className="input" placeholder="年龄（可选）" value={age}
                  onChange={(e) => setAge(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            {loading ? (
              <p className="p">题目加载中…</p>
            ) : questions.length === 0 ? (
              <p className="p">没有题目数据。请检查 /api/sas_questions 输出。</p>
            ) : (
              questions.map((q) => {
                const key = String(q.id);
                return (
                  <div className="q" key={q.id}>
                    <div className="qtitle">
                      {q.id}. {q.text}
                      {q.reverse ? <span className="badge" style={{ marginLeft: 8 }}>反向计分</span> : null}
                    </div>

                    <div className="options">
                      {OPTIONS.map((op) => (
                        <label key={op.v} className={`opt ${answers[key] === op.v ? "optSelected" : ""}`}>
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={op.v}
                            checked={answers[key] === op.v}
                            onChange={() => onPick(q.id, op.v)}
                          />
                          <span>{op.v} - {op.t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="row">
            <button className="btn" onClick={onSubmit} disabled={!allDone || submitting}>
              {submitting ? "提交中…" : "提交并查看结果"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
