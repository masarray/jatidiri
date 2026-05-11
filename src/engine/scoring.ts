import type {
  Answers,
  Cluster,
  ClusterReport,
  ClusterScore,
  QuestionItem,
  AssessmentSession,
  Zone,
} from "@/types/assessment";
import { CLUSTER_LIST } from "@/data/clusterMeta";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";

export function questionsFor(session: AssessmentSession): QuestionItem[] {
  return session === "natural" ? naturalQuestions : strengthQuestions;
}

function validQuestionIds(session: AssessmentSession): Set<string> {
  return new Set(questionsFor(session).map((q) => q.id));
}

function validAnsweredIds(session: AssessmentSession, answers: Answers): string[] {
  const ids = validQuestionIds(session);
  return Object.entries(answers[session])
    .filter(([id, value]) => ids.has(id) && typeof value === "number" && value >= 1 && value <= 7)
    .map(([id]) => id);
}

function avgPerCluster(
  questions: QuestionItem[],
  values: Record<string, number>,
): Record<Cluster, number> {
  const sums: Record<string, { sum: number; n: number }> = {};
  CLUSTER_LIST.forEach((c) => (sums[c] = { sum: 0, n: 0 }));

  for (const q of questions) {
    const v = values[q.id];
    if (typeof v === "number" && v >= 1 && v <= 7) {
      sums[q.cluster].sum += v;
      sums[q.cluster].n += 1;
    }
  }

  const out = {} as Record<Cluster, number>;
  CLUSTER_LIST.forEach((c) => {
    const { sum, n } = sums[c];
    // Map 1..7 -> 0..100. Reverse scoring will be added in Engine V2.
    out[c] = n === 0 ? 0 : Math.round(((sum / n - 1) / 6) * 100);
  });
  return out;
}

export function computeClusterScores(answers: Answers): ClusterScore[] {
  const nat = avgPerCluster(naturalQuestions, answers.natural);
  const str = avgPerCluster(strengthQuestions, answers.strength);
  return CLUSTER_LIST.map((c) => ({ cluster: c, natural: nat[c], strength: str[c] }));
}

function classify(natural: number, strength: number): Zone {
  const NAT_HI = 60;
  const STR_HI = 60;
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
  const first = questions.findIndex((q) => typeof sessionAnswers[q.id] !== "number");
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
