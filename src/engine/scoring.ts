import type {
  Answers,
  AssessmentSession,
  Cluster,
  ClusterReport,
  ClusterScore,
  QuestionItem,
  ReadingQuality,
  ReadingQualityLevel,
  Zone,
} from "@/types/assessment";
import { CLUSTER_LIST } from "@/data/clusterMeta";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";

const SCORE_MIN = 1;
const SCORE_MAX = 7;
const NAT_HI = 62;
const STR_HI = 62;

/**
 * Items that are useful for detecting ideal-self / social desirability response patterns.
 * They are not treated as "wrong" answers. They are simply given lower scoring weight
 * and used to produce a reading-quality note when many of them are answered very high.
 */
const SOCIAL_DESIRABILITY_ITEM_IDS = new Set([
  "natural-10", // tidak pernah iri
  "natural-29", // selalu dapat mengendalikan emosi
  "natural-47", // tidak pernah membicarakan keburukan orang
  "natural-66", // selalu tepat waktu tanpa pengecualian
  "natural-85", // tidak pernah melakukan kesalahan
  "natural-122", // tidak pernah menyesali keputusan
  "natural-134", // tidak ingin memanfaatkan orang
  "natural-141", // selalu mengatakan jujur meski merugikan
  "natural-160", // tidak pernah merasa malas
  "natural-170", // tidak ingin mengganggu/menyakiti orang
]);

const LOW_WEIGHT_ITEM_IDS = SOCIAL_DESIRABILITY_ITEM_IDS;

export function questionsFor(session: AssessmentSession): QuestionItem[] {
  return session === "natural" ? naturalQuestions : strengthQuestions;
}

function validQuestionIds(session: AssessmentSession): Set<string> {
  return new Set(questionsFor(session).map((q) => q.id));
}

function isAnswerValue(value: unknown): value is 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  return typeof value === "number" && value >= SCORE_MIN && value <= SCORE_MAX;
}

function normalizeTo100(value: number): number {
  return Math.round(((value - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100);
}

function weightForQuestion(questionId: string): number {
  if (LOW_WEIGHT_ITEM_IDS.has(questionId)) return 0.35;
  return 1;
}

function validAnsweredIds(session: AssessmentSession, answers: Answers): string[] {
  const ids = validQuestionIds(session);
  return Object.entries(answers[session])
    .filter(([id, value]) => ids.has(id) && isAnswerValue(value))
    .map(([id]) => id);
}

function avgPerCluster(
  questions: QuestionItem[],
  values: Record<string, number>,
): Record<Cluster, { adjusted: number; raw: number; items: number }> {
  const adjustedSums: Record<string, { sum: number; weight: number; rawSum: number; n: number }> = {};
  CLUSTER_LIST.forEach((c) => (adjustedSums[c] = { sum: 0, weight: 0, rawSum: 0, n: 0 }));

  for (const q of questions) {
    const v = values[q.id];
    if (isAnswerValue(v)) {
      const weight = weightForQuestion(q.id);
      adjustedSums[q.cluster].sum += v * weight;
      adjustedSums[q.cluster].weight += weight;
      adjustedSums[q.cluster].rawSum += v;
      adjustedSums[q.cluster].n += 1;
    }
  }

  const out = {} as Record<Cluster, { adjusted: number; raw: number; items: number }>;
  CLUSTER_LIST.forEach((c) => {
    const { sum, weight, rawSum, n } = adjustedSums[c];
    out[c] = {
      adjusted: n === 0 || weight === 0 ? 0 : normalizeTo100(sum / weight),
      raw: n === 0 ? 0 : normalizeTo100(rawSum / n),
      items: n,
    };
  });
  return out;
}

export function computeClusterScores(answers: Answers): ClusterScore[] {
  const nat = avgPerCluster(naturalQuestions, answers.natural);
  const str = avgPerCluster(strengthQuestions, answers.strength);
  return CLUSTER_LIST.map((c) => ({
    cluster: c,
    natural: nat[c].adjusted,
    strength: str[c].adjusted,
    naturalRaw: nat[c].raw,
    strengthRaw: str[c].raw,
    naturalItems: nat[c].items,
    strengthItems: str[c].items,
  }));
}

function classify(natural: number, strength: number): Zone {
  const natHi = natural >= NAT_HI;
  const strHi = strength >= STR_HI;
  if (natHi && strHi) return "Natural & Explored";
  if (natHi && !strHi) return "Natural but Dormant";
  if (!natHi && strHi) return "Adaptive / Survival";
  return "Weak / Draining";
}

export function buildClusterReports(answers: Answers): ClusterReport[] {
  return computeClusterScores(answers).map((s) => ({ ...s, zone: classify(s.natural, s.strength) }));
}

export function topClusters(reports: ClusterReport[], n = 3): Cluster[] {
  return [...reports]
    .sort((a, b) => b.natural - a.natural)
    .slice(0, n)
    .map((r) => r.cluster);
}

export function bottomClusters(reports: ClusterReport[], n = 3): Cluster[] {
  return [...reports]
    .sort((a, b) => a.natural - b.natural)
    .slice(0, n)
    .map((r) => r.cluster);
}

export function progressFor(session: AssessmentSession, answers: Answers) {
  const total = questionsFor(session).length;
  const answered = validAnsweredIds(session, answers).length;
  return {
    answered,
    total,
    percent: total === 0 ? 0 : Math.round((answered / total) * 100),
    done: total > 0 && answered >= total,
  };
}

export function firstUnansweredIndex(session: AssessmentSession, answers: Answers): number {
  const questions = questionsFor(session);
  const sessionAnswers = answers[session];
  const first = questions.findIndex((q) => !isAnswerValue(sessionAnswers[q.id]));
  return first === -1 ? Math.max(0, questions.length - 1) : first;
}

export function isAssessmentComplete(answers: Answers): boolean {
  return progressFor("natural", answers).done && progressFor("strength", answers).done;
}

export function getNextAssessmentTarget(answers: Answers):
  | { to: "/assessment/$session"; session: AssessmentSession; index: number }
  | { to: "/instruction/$session"; session: AssessmentSession }
  | { to: "/result" } {
  const natural = progressFor("natural", answers);
  const strength = progressFor("strength", answers);

  if (!natural.done) {
    return { to: "/assessment/$session", session: "natural", index: firstUnansweredIndex("natural", answers) };
  }

  if (strength.answered === 0) {
    return { to: "/instruction/$session", session: "strength" };
  }

  if (!strength.done) {
    return { to: "/assessment/$session", session: "strength", index: firstUnansweredIndex("strength", answers) };
  }

  return { to: "/result" };
}

function allValidAnswers(answers: Answers): number[] {
  const naturalIds = validQuestionIds("natural");
  const strengthIds = validQuestionIds("strength");
  const values: number[] = [];

  for (const [id, value] of Object.entries(answers.natural)) {
    if (naturalIds.has(id) && isAnswerValue(value)) values.push(value);
  }
  for (const [id, value] of Object.entries(answers.strength)) {
    if (strengthIds.has(id) && isAnswerValue(value)) values.push(value);
  }
  return values;
}

function ratio(values: number[], predicate: (value: number) => boolean): number {
  if (values.length === 0) return 0;
  return values.filter(predicate).length / values.length;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function dominantAnswerRatio(values: number[]): number {
  if (values.length === 0) return 0;
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Math.max(...counts.values()) / values.length;
}

function socialDesirabilityScore(answers: Answers): number {
  const values = [...SOCIAL_DESIRABILITY_ITEM_IDS]
    .map((id) => answers.natural[id])
    .filter(isAnswerValue);
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return normalizeTo100(mean);
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function qualityLevel(score: number): ReadingQualityLevel {
  if (score >= 82) return "Stabil";
  if (score >= 64) return "Cukup Stabil";
  return "Perlu Dibaca Hati-hati";
}

export function computeReadingQuality(answers: Answers): ReadingQuality {
  const natural = progressFor("natural", answers);
  const strength = progressFor("strength", answers);
  const totalItems = natural.total + strength.total;
  const answeredItems = natural.answered + strength.answered;
  const completionPercent = totalItems === 0 ? 0 : Math.round((answeredItems / totalItems) * 100);
  const values = allValidAnswers(answers);

  const variation = standardDeviation(values);
  const dominant = dominantAnswerRatio(values);
  const neutral = ratio(values, (v) => v === 4);
  const extremeHigh = ratio(values, (v) => v >= 6);
  const extremeLow = ratio(values, (v) => v <= 2);
  const socialScore = socialDesirabilityScore(answers);

  let score = 100;
  const notes: string[] = [];

  if (completionPercent < 100) {
    score -= (100 - completionPercent) * 0.7;
    notes.push("Sebagian item belum terjawab, sehingga pembacaan belum lengkap.");
  }

  if (variation < 0.85) {
    const penalty = clamp((0.85 - variation) * 28, 0, 24);
    score -= penalty;
    notes.push("Variasi jawaban relatif sempit. Hasil sebaiknya dibaca sebagai indikasi awal, bukan kesimpulan final.");
  }

  if (dominant > 0.42) {
    const penalty = clamp((dominant - 0.42) * 80, 0, 18);
    score -= penalty;
    notes.push("Ada kecenderungan memilih nilai yang sama cukup sering. Perbedaan antar-area mungkin terlihat lebih datar.");
  }

  if (neutral > 0.35) {
    const penalty = clamp((neutral - 0.35) * 60, 0, 14);
    score -= penalty;
    notes.push("Jawaban netral cukup banyak. Beberapa area mungkin belum dapat dibedakan dengan tajam.");
  }

  if (extremeHigh > 0.68) {
    const penalty = clamp((extremeHigh - 0.68) * 50, 0, 12);
    score -= penalty;
    notes.push("Banyak jawaban berada di sisi sangat kuat/sangat sesuai. Perlu dibedakan antara kecenderungan alami dan ideal diri.");
  }

  if (extremeLow > 0.55) {
    const penalty = clamp((extremeLow - 0.55) * 40, 0, 10);
    score -= penalty;
    notes.push("Banyak jawaban berada di sisi rendah. Periksa apakah kondisi lelah atau kurang percaya diri ikut memengaruhi respons.");
  }

  if (socialScore > 78) {
    const penalty = clamp((socialScore - 78) * 0.55, 0, 14);
    score -= penalty;
    notes.push("Beberapa item ideal-diri dijawab sangat tinggi. Hasil tetap dapat dibaca, namun perlu kehati-hatian pada tema moral/perilaku sempurna.");
  }

  const finalScore = Math.round(clamp(score));
  const level = qualityLevel(finalScore);
  const summary =
    level === "Stabil"
      ? "Pola jawaban cukup bervariasi dan relatif layak digunakan sebagai bahan refleksi."
      : level === "Cukup Stabil"
        ? "Pola jawaban masih dapat dibaca, namun beberapa indikator perlu ditafsirkan dengan hati-hati."
        : "Pola jawaban membutuhkan pembacaan lebih hati-hati. Sebaiknya gunakan hasil ini sebagai titik awal refleksi.";

  return {
    score: finalScore,
    level,
    summary,
    notes: notes.length > 0 ? notes.slice(0, 3) : ["Tidak ditemukan pola respons yang sangat mengganggu pembacaan dasar."],
    metrics: {
      completionPercent,
      variation: Number(variation.toFixed(2)),
      dominantAnswerRatio: Math.round(dominant * 100),
      neutralRatio: Math.round(neutral * 100),
      extremeHighRatio: Math.round(extremeHigh * 100),
      extremeLowRatio: Math.round(extremeLow * 100),
      socialDesirabilityScore: Math.round(socialScore),
    },
  };
}
