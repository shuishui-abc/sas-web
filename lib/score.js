// lib/score.js
export function scoreSAS(answersById) {
  const reverseIds = new Set([5, 9, 13, 17, 19]);

  let raw = 0;
  for (let i = 1; i <= 20; i++) {
    const v = Number(answersById[i]);
    if (![1, 2, 3, 4].includes(v)) {
      throw new Error(`Invalid answer for Q${i}: ${answersById[i]}`);
    }
    raw += reverseIds.has(i) ? (5 - v) : v;
  }

  const standard = Math.round(raw * 1.25);

  let level = "正常";
  if (standard >= 70) level = "重度焦虑";
  else if (standard >= 60) level = "中度焦虑";
  else if (standard >= 50) level = "轻度焦虑";

  return { raw, standard, level };
}
