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
  AnswerValue,
} from "@/types/assessment";
import { CLUSTER_LIST } from "@/data/clusterMeta";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";
import { withQuestionBankMetadata, withQuestionMetadata } from "@/data/questionMetadata";

const SCORE_MIN = 1;
const SCORE_MAX = 5;
const SCORE_NEUTRAL = 3;
const NAT_HI = 62;
const STR_HI = 62;

/**
 * Items that are useful for detecting ideal-self / social desirability response patterns.
 * They are not treated as "wrong" answers. They are simply given lower scoring weight
 * and used to produce a reading-quality note when many of them are answered very high.
 */
const SOCIAL_DESIRABILITY_ITEM_IDS = new Set([
  // V2: item ini tetap berguna sebagai indikator standar-diri/ideal-self.
  // Mereka tidak dianggap salah, hanya diberi bobot lebih rendah dan dipakai untuk quality note.
  "natural-47",
  "natural-134",
  "natural-141",
  "natural-160",
  "natural-170",
]);

export function questionsFor(session: AssessmentSession): QuestionItem[] {
  return session === "natural"
    ? withQuestionBankMetadata(naturalQuestions)
    : withQuestionBankMetadata(strengthQuestions);
}

function validQuestionIds(session: AssessmentSession): Set<string> {
  return new Set(questionsFor(session).map((q) => q.id));
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === "number" && value >= SCORE_MIN && value <= SCORE_MAX;
}

export function normalizeAnswer(value: number): number {
  const clamped = Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
  return ((clamped - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;
}

function normalizeTo100(value: number): number {
  return Math.round(normalizeAnswer(value));
}

/**
 * Agreement-bias guardrail.
 *
 * Raw 1-5 averages are useful, but when a user tends to answer "sesuai/kuat"
 * on almost every item, absolute scores become too generous. This calibrated score
 * keeps the personal ranking sharper by comparing each area to the user's own
 * response baseline.
 */
function calibratedScoreFromMean(meanAnswer: number, sessionMeanAnswer: number): number {
  const raw = normalizeTo100(meanAnswer);
  const baseline = normalizeTo100(sessionMeanAnswer);
  const calibrated = 50 + (raw - baseline) * 1.35 + (raw - 50) * 0.25;
  return Math.round(clamp(calibrated));
}

function contributesToCapabilityScore(question: Pick<QuestionItem, "scoreLane" | "itemType">): boolean {
  return (
    question.scoreLane !== "fatigue" &&
    question.scoreLane !== "quality" &&
    question.itemType !== "drain" &&
    question.itemType !== "social_desirability"
  );
}

type QuestionSide = "A" | "B";

interface CapabilityContribution {
  id: string;
  cluster: Cluster;
  value: number;
  weight: number;
}

function isChoicePair(question: QuestionItem): boolean {
  return question.format === "choice_pair" && Boolean(question.choiceA && question.choiceB);
}

function choicePairValue(value: number, side: QuestionSide): number {
  // A/B trade-off is stored as one 1-5 answer:
  // 1 = strong A, 3 = balanced, 5 = strong B.
  return side === "A" ? 6 - value : value;
}

function applyQuestionPolarity(question: QuestionItem, value: number): number {
  return question.polarity === "reverse" ? 6 - value : value;
}

function metadataWeight(question: Pick<QuestionItem, "id" | "weight" | "itemType" | "biasRisk">): number {
  let weight = typeof question.weight === "number" ? question.weight : 1;

  if (SOCIAL_DESIRABILITY_ITEM_IDS.has(question.id) || question.itemType === "social_desirability")
    weight *= 0.35;
  if (question.itemType === "drain") weight *= 0.55;
  if (question.biasRisk === "high") weight *= 0.75;
  if (question.biasRisk === "medium") weight *= 0.9;

  return Math.max(0.15, Math.min(1.25, weight));
}

function weightForQuestion(question: QuestionItem | string): number {
  if (typeof question !== "string") return metadataWeight(question);

  const found = [...naturalQuestions, ...strengthQuestions].find((q) => q.id === question);
  if (found) return metadataWeight(withQuestionMetadata(found));
  if (SOCIAL_DESIRABILITY_ITEM_IDS.has(question)) return 0.35;
  return 1;
}

function capabilityContributionsForQuestion(
  question: QuestionItem,
  rawValue: unknown,
): CapabilityContribution[] {
  if (!isAnswerValue(rawValue)) return [];

  if (isChoicePair(question) && question.choiceA && question.choiceB) {
    const baseWeight = weightForQuestion(question);
    const sides = [
      { side: "A" as const, choice: question.choiceA },
      { side: "B" as const, choice: question.choiceB },
    ];

    return sides
      .filter(({ choice }) =>
        contributesToCapabilityScore({
          scoreLane: choice.scoreLane ?? question.scoreLane,
          itemType: choice.itemType ?? question.itemType,
        }),
      )
      .map(({ side, choice }) => ({
        id: `${question.id}::${side}`,
        cluster: choice.cluster,
        value: choicePairValue(rawValue, side),
        weight: Math.max(0.15, Math.min(1.25, baseWeight * (choice.weight ?? 1))),
      }));
  }

  if (!contributesToCapabilityScore(question)) return [];

  return [
    {
      id: question.id,
      cluster: question.cluster,
      value: applyQuestionPolarity(question, rawValue),
      weight: weightForQuestion(question),
    },
  ];
}

function weightedSessionMean(questions: QuestionItem[], values: Record<string, number>): number {
  let sum = 0;
  let weightSum = 0;

  for (const q of questions) {
    for (const contribution of capabilityContributionsForQuestion(q, values[q.id])) {
      sum += contribution.value * contribution.weight;
      weightSum += contribution.weight;
    }
  }

  return weightSum === 0 ? SCORE_NEUTRAL : sum / weightSum;
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
  const sessionMean = weightedSessionMean(questions, values);
  const adjustedSums: Record<string, { sum: number; weight: number; rawSum: number; n: number }> =
    {};
  CLUSTER_LIST.forEach((c) => (adjustedSums[c] = { sum: 0, weight: 0, rawSum: 0, n: 0 }));

  for (const q of questions) {
    const contributions = capabilityContributionsForQuestion(q, values[q.id]);
    for (const contribution of contributions) {
      adjustedSums[contribution.cluster].sum += contribution.value * contribution.weight;
      adjustedSums[contribution.cluster].weight += contribution.weight;
      adjustedSums[contribution.cluster].rawSum += contribution.value;
      adjustedSums[contribution.cluster].n += 1;
    }
  }

  const out = {} as Record<Cluster, { adjusted: number; raw: number; items: number }>;
  CLUSTER_LIST.forEach((c) => {
    const { sum, weight, rawSum, n } = adjustedSums[c];
    const mean = n === 0 || weight === 0 ? SCORE_NEUTRAL : sum / weight;
    out[c] = {
      adjusted: n === 0 || weight === 0 ? 0 : calibratedScoreFromMean(mean, sessionMean),
      raw: n === 0 ? 0 : normalizeTo100(rawSum / n),
      items: n,
    };
  });
  return out;
}

export function computeClusterScores(answers: Answers): ClusterScore[] {
  const nat = avgPerCluster(questionsFor("natural"), answers.natural);
  const str = avgPerCluster(questionsFor("strength"), answers.strength);
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
  return computeClusterScores(answers).map((s) => ({
    ...s,
    zone: classify(s.natural, s.strength),
  }));
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

export function getNextAssessmentTarget(
  answers: Answers,
):
  | { to: "/assessment/$session"; session: AssessmentSession; index: number }
  | { to: "/instruction/$session"; session: AssessmentSession }
  | { to: "/result" } {
  const natural = progressFor("natural", answers);
  const strength = progressFor("strength", answers);

  if (!natural.done) {
    return {
      to: "/assessment/$session",
      session: "natural",
      index: firstUnansweredIndex("natural", answers),
    };
  }

  if (strength.answered === 0) {
    return { to: "/instruction/$session", session: "strength" };
  }

  if (!strength.done) {
    return {
      to: "/assessment/$session",
      session: "strength",
      index: firstUnansweredIndex("strength", answers),
    };
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
  const ids = new Set([
    ...SOCIAL_DESIRABILITY_ITEM_IDS,
    ...questionsFor("natural")
      .filter((q) => q.itemType === "social_desirability" || q.scoreLane === "quality")
      .map((q) => q.id),
  ]);
  const values = [...ids].map((id) => answers.natural[id]).filter(isAnswerValue);
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
  const neutral = ratio(values, (v) => v === SCORE_NEUTRAL);
  const extremeHigh = ratio(values, (v) => v >= 4);
  const extremeLow = ratio(values, (v) => v <= 2);
  const socialScore = socialDesirabilityScore(answers);

  let score = 100;
  const notes: string[] = [];

  if (completionPercent < 100) {
    score -= (100 - completionPercent) * 0.7;
    notes.push("Sebagian item belum terjawab, sehingga pembacaan belum lengkap.");
  }

  if (variation < 0.95) {
    const penalty = clamp((0.95 - variation) * 30, 0, 26);
    score -= penalty;
    notes.push(
      "Variasi jawaban relatif sempit. Engine akan lebih mengandalkan ranking relatif agar hasil tidak terlalu dipengaruhi kecenderungan sesuai/kuat pada banyak item.",
    );
  }

  if (dominant > 0.42) {
    const penalty = clamp((dominant - 0.42) * 80, 0, 18);
    score -= penalty;
    notes.push(
      "Ada kecenderungan memilih nilai yang sama cukup sering. Perbedaan antar-area mungkin terlihat lebih datar.",
    );
  }

  if (neutral > 0.35) {
    const penalty = clamp((neutral - 0.35) * 60, 0, 14);
    score -= penalty;
    notes.push(
      "Jawaban netral cukup banyak. Beberapa area mungkin belum dapat dibedakan dengan tajam.",
    );
  }

  if (extremeHigh > 0.55) {
    const penalty = clamp((extremeHigh - 0.55) * 55, 0, 16);
    score -= penalty;
    notes.push(
      "Banyak jawaban berada di sisi sesuai/kuat. Skor dibaca secara relatif terhadap pola jawaban pribadi, bukan sebagai angka absolut semata.",
    );
  }

  if (extremeLow > 0.55) {
    const penalty = clamp((extremeLow - 0.55) * 40, 0, 10);
    score -= penalty;
    notes.push(
      "Banyak jawaban berada di sisi rendah. Periksa apakah kondisi lelah atau kurang percaya diri ikut memengaruhi respons.",
    );
  }

  if (socialScore > 74) {
    const penalty = clamp((socialScore - 74) * 0.6, 0, 16);
    score -= penalty;
    notes.push(
      "Beberapa item ideal-diri dijawab sangat tinggi. Hasil tetap dapat dibaca, namun perlu kehati-hatian pada tema moral/perilaku sempurna.",
    );
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
    notes:
      notes.length > 0
        ? notes.slice(0, 3)
        : ["Tidak ditemukan pola respons yang sangat mengganggu pembacaan dasar."],
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
