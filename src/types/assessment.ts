export type AssessmentSession = "natural" | "strength";

export type Cluster =
  | "Thinking"
  | "Striving"
  | "Relating"
  | "Influencing"
  | "Creating"
  | "Operating"
  | "Supporting"
  | "Analyzing";

export interface QuestionItem {
  id: string;
  session: AssessmentSession;
  number: number;
  text: string;
  cluster: Cluster;
}

export type AnswerValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Identity {
  name: string;
  purpose?: string;
  startedAt: string;
}

export interface Answers {
  natural: Record<string, AnswerValue>;
  strength: Record<string, AnswerValue>;
}

export interface ClusterScore {
  cluster: Cluster;
  natural: number; // 0-100
  strength: number; // 0-100
}

export type Zone =
  | "Natural & Explored"
  | "Natural but Dormant"
  | "Adaptive / Survival"
  | "Weak / Draining";

export interface ClusterReport extends ClusterScore {
  zone: Zone;
}
