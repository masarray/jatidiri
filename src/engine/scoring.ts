import type {
  AnswerRecord,
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
import { resolveSignalDefinition } from "@/data/patternSignals";

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;
export const SCORE_NEUTRAL = 3;
const NAT_HI = 62;
const STR_HI = 62;

export function questionsFor(session: AssessmentSession): QuestionItem[] {
  return session === "natural" ? naturalQuestions : strengthQuestions;
}

function validQuestionIds(session: AssessmentSession): Set<string> {
  return new Set(questionsFor(session).map((q) => q.id));
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === "number" && value >= SCORE_MIN && value <= SCORE_MAX;
}

export function isAnswerRecord(value: unknown): value is AnswerRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<AnswerRecord>;
  if ((record.format === "scale" || record.format === "choice_pair") && isAnswerValue(record.value)) return true;
  if (record.format === "action_cards") return record.optionId === "A" || record.optionId === "B" || record.optionId === "C" || record.optionId === "D";
  return false;
}

export function normalizeAnswer(value: number): number {
  const clamped = Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
  return ((clamped - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeTo100(value: number): number {
  return Math.round(clamp(normalizeAnswer(value)));
}

function selectedActionOption(question: QuestionItem, answer: AnswerRecord | undefined) {
  if (question.format !== "action_cards" || answer?.format !== "action_cards") return null;
  return question.options.find((option) => option.id === answer.optionId) ?? null;
}

export function legacyNumericValue(answer: AnswerRecord | undefined): AnswerValue | undefined {
  if (!answer) return undefined;
  if (answer.format === "scale" || answer.format === "choice_pair") return answer.value;
  const map: Record<string, AnswerValue> = { A: 2, B: 3, C: 4, D: 5 };
  return map[answer.optionId];
}

function validAnsweredIds(session: AssessmentSession, answers: Answers): string[] {
  const ids = validQuestionIds(session);
  return Object.entries(answers[session])
    .filter(([id, value]) => ids.has(id) && isAnswerRecord(value))
    .map(([id]) => id);
}

function emptyClusterBuckets() {
  const buckets = {} as Record<Cluster, { score: number; items: number }>;
  CLUSTER_LIST.forEach((cluster) => (buckets[cluster] = { score: 0, items: 0 }));
  return buckets;
}

function clusterBucketsFor(session: AssessmentSession, answers: Answers) {
  const buckets = emptyClusterBuckets();
  for (const question of questionsFor(session)) {
    const answer = answers[session][question.id];
    if (!isAnswerRecord(answer)) continue;

    if (question.format === "action_cards") {
      const option = selectedActionOption(question, answer);
      if (!option) continue;
      let counted = false;
      for (const signal of option.signals) {
        const definition = resolveSignalDefinition(signal.id);
        const cluster = definition?.cluster ?? question.cluster;
        const lane = signal.lane;
        const weight = signal.weight ?? definition?.defaultWeight ?? 1;
        if (lane === "natural" || lane === "strength") {
          buckets[cluster].score += weight;
          counted = true;
        }
        if ((lane === "overuse" || lane === "drain") && definition?.cluster) {
          buckets[definition.cluster].score += weight * 0.25;
          counted = true;
        }
      }
      if (counted) buckets[question.cluster].items += 1;
      continue;
    }

    const numeric = legacyNumericValue(answer);
    if (numeric) {
      buckets[question.cluster].score += normalizeAnswer(numeric) / 100;
      buckets[question.cluster].items += 1;
    }
  }
  return buckets;
}

function normalizeClusterBuckets(buckets: Record<Cluster, { score: number; items: number }>) {
  const maxScore = Math.max(0.01, ...Object.values(buckets).map((bucket) => bucket.score));
  const out = {} as Record<Cluster, { adjusted: number; raw: number; items: number }>;
  CLUSTER_LIST.forEach((cluster) => {
    const bucket = buckets[cluster];
    const raw = bucket.score <= 0 ? 0 : Math.round((bucket.score / maxScore) * 100);
    const adjusted = bucket.score <= 0 ? 0 : Math.round(clamp(32 + raw * 0.63));
    out[cluster] = { adjusted, raw, items: bucket.items };
  });
  return out;
}

export function computeClusterScores(answers: Answers): ClusterScore[] {
  const nat = normalizeClusterBuckets(clusterBucketsFor("natural", answers));
  const str = normalizeClusterBuckets(clusterBucketsFor("strength", answers));
  return CLUSTER_LIST.map((cluster) => ({
    cluster,
    natural: nat[cluster].adjusted,
    strength: str[cluster].adjusted,
    naturalRaw: nat[cluster].raw,
    strengthRaw: str[cluster].raw,
    naturalItems: nat[cluster].items,
    strengthItems: str[cluster].items,
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
  return [...reports].sort((a, b) => b.natural - a.natural).slice(0, n).map((r) => r.cluster);
}

export function bottomClusters(reports: ClusterReport[], n = 3): Cluster[] {
  return [...reports].sort((a, b) => a.natural - b.natural).slice(0, n).map((r) => r.cluster);
}

export function progressFor(session: AssessmentSession, answers: Answers) {
  const total = questionsFor(session).length;
  const answered = validAnsweredIds(session, answers).length;
  return { answered, total, percent: total === 0 ? 0 : Math.round((answered / total) * 100), done: total > 0 && answered >= total };
}

export function firstUnansweredIndex(session: AssessmentSession, answers: Answers): number {
  const questions = questionsFor(session);
  const sessionAnswers = answers[session];
  const first = questions.findIndex((q) => !isAnswerRecord(sessionAnswers[q.id]));
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

  if (!natural.done) return { to: "/assessment/$session", session: "natural", index: firstUnansweredIndex("natural", answers) };
  if (strength.answered === 0) return { to: "/instruction/$session", session: "strength" };
  if (!strength.done) return { to: "/assessment/$session", session: "strength", index: firstUnansweredIndex("strength", answers) };
  return { to: "/result" };
}

function allAnswerTokens(answers: Answers): string[] {
  const tokens: string[] = [];
  for (const session of ["natural", "strength"] as const) {
    for (const question of questionsFor(session)) {
      const answer = answers[session][question.id];
      if (!isAnswerRecord(answer)) continue;
      if (answer.format === "action_cards") tokens.push(`${question.id}:${answer.optionId}`);
      else tokens.push(`${question.id}:${answer.value}`);
    }
  }
  return tokens;
}

function dominantTokenRatio(tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const byOption = new Map<string, number>();
  for (const token of tokens) {
    const option = token.split(":")[1] ?? token;
    byOption.set(option, (byOption.get(option) ?? 0) + 1);
  }
  return Math.max(...byOption.values()) / tokens.length;
}

function overuseDrainRatio(answers: Answers): number {
  let selected = 0;
  let risk = 0;
  for (const session of ["natural", "strength"] as const) {
    for (const question of questionsFor(session)) {
      const answer = answers[session][question.id];
      if (!isAnswerRecord(answer) || question.format !== "action_cards") continue;
      const option = selectedActionOption(question, answer);
      if (!option) continue;
      selected += 1;
      if (option.signals.some((signal) => signal.lane === "overuse" || signal.lane === "drain")) risk += 1;
    }
  }
  return selected === 0 ? 0 : risk / selected;
}

function adaptiveRatio(answers: Answers): number {
  let selected = 0;
  let adaptive = 0;
  for (const session of ["natural", "strength"] as const) {
    for (const question of questionsFor(session)) {
      const answer = answers[session][question.id];
      if (!isAnswerRecord(answer) || question.format !== "action_cards") continue;
      const option = selectedActionOption(question, answer);
      if (!option) continue;
      selected += 1;
      if (option.signals.some((signal) => signal.lane === "adaptive")) adaptive += 1;
    }
  }
  return selected === 0 ? 0 : adaptive / selected;
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
  const tokens = allAnswerTokens(answers);
  const dominant = dominantTokenRatio(tokens);
  const riskRatio = overuseDrainRatio(answers);
  const adaptRatio = adaptiveRatio(answers);

  let score = 100;
  const notes: string[] = [];

  if (completionPercent < 100) {
    score -= (100 - completionPercent) * 0.7;
    notes.push("Sebagian item belum terjawab, sehingga pembacaan belum lengkap.");
  }
  if (dominant > 0.46) {
    score -= clamp((dominant - 0.46) * 70, 0, 18);
    notes.push("Ada kecenderungan memilih posisi opsi yang sama cukup sering. Hasil tetap dibaca, tetapi prioritas alami mungkin belum sepenuhnya terbedakan.");
  }
  if (riskRatio > 0.34) {
    score -= clamp((riskRatio - 0.34) * 45, 0, 14);
    notes.push("Cukup banyak pilihan menunjukkan sisi bocor/overuse. Ini bukan label buruk, tetapi tanda hasil perlu dibaca bersama strategi pengelolaan energi.");
  }
  if (adaptRatio > 0.38) {
    score -= clamp((adaptRatio - 0.38) * 30, 0, 10);
    notes.push("Beberapa jawaban condong ke mode adaptif atau aman. Bisa jadi kamu sedang menjawab dari kebiasaan bertahan, bukan sepenuhnya dari dorongan alami.");
  }

  const finalScore = Math.round(clamp(score));
  const level = qualityLevel(finalScore);
  const summary =
    level === "Stabil"
      ? "Pola pilihan aksi cukup bervariasi dan layak digunakan sebagai bahan refleksi."
      : level === "Cukup Stabil"
        ? "Pola pilihan aksi masih dapat dibaca, namun beberapa indikator perlu ditafsirkan dengan hati-hati."
        : "Pola pilihan aksi membutuhkan pembacaan lebih hati-hati. Gunakan hasil ini sebagai titik awal refleksi.";

  return {
    score: finalScore,
    level,
    summary,
    notes: notes.length > 0 ? notes.slice(0, 3) : ["Tidak ditemukan pola respons yang sangat mengganggu pembacaan dasar."],
    metrics: {
      completionPercent,
      variation: Math.round((1 - dominant) * 100),
      dominantAnswerRatio: Math.round(dominant * 100),
      neutralRatio: Math.round(adaptRatio * 100),
      extremeHighRatio: Math.round(riskRatio * 100),
      extremeLowRatio: 0,
      socialDesirabilityScore: 0,
    },
  };
}
