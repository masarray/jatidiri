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

export type QuestionItemType =
  | "energy"
  | "thinking"
  | "habit"
  | "tradeoff"
  | "drain"
  | "social_desirability"
  | "activity"
  | "overuse"
  | "derailer"
  | "strength_proof";

export type QuestionScoreLane =
  | "natural"
  | "strength"
  | "fatigue"
  | "adaptive"
  | "quality"
  | "overuse"
  | "drain";

export type QuestionPolarity = "positive" | "reverse";
export type QuestionBiasRisk = "low" | "medium" | "high";
export type QuestionFormat = "scale" | "choice_pair" | "action_cards";

export type SignalLane = "natural" | "strength" | "overuse" | "drain" | "adaptive" | "quality";

export interface SignalContribution {
  id: string;
  lane: SignalLane;
  weight?: number;
}

export interface ActionCardOption {
  id: "A" | "B" | "C" | "D";
  text: string;
  signals: SignalContribution[];
}

export interface BaseQuestionItem {
  id: string;
  session: AssessmentSession;
  number: number;
  cluster: Cluster;
  microRoles?: string[];
  itemType?: QuestionItemType;
  scoreLane?: QuestionScoreLane;
  polarity?: QuestionPolarity;
  biasRisk?: QuestionBiasRisk;
  weight?: number;
}

export interface ScaleQuestionItem extends BaseQuestionItem {
  format?: "scale" | "choice_pair";
  text: string;
}

export interface ActionCardQuestionItem extends BaseQuestionItem {
  format: "action_cards";
  patternArea: string;
  situation: string;
  prompt: string;
  options: ActionCardOption[];
  /** Legacy text fallback for result/PDF/debug search. */
  text: string;
}

export type QuestionItem = ScaleQuestionItem | ActionCardQuestionItem;

export const ASSESSMENT_SCALE_VERSION = "v5-action-cards";
export const ANSWER_VALUES = [1, 2, 3, 4, 5] as const;
export type AnswerValue = (typeof ANSWER_VALUES)[number];

export type AnswerRecord =
  | { format: "scale"; value: AnswerValue }
  | { format: "choice_pair"; value: AnswerValue }
  | { format: "action_cards"; optionId: ActionCardOption["id"] };

export interface Identity {
  name: string;
  purpose?: string;
  startedAt: string;
}

export interface Answers {
  natural: Record<string, AnswerRecord>;
  strength: Record<string, AnswerRecord>;
}

export interface ClusterScore {
  cluster: Cluster;
  natural: number;
  strength: number;
  naturalRaw: number;
  strengthRaw: number;
  naturalItems: number;
  strengthItems: number;
}

export type Zone =
  | "Natural & Explored"
  | "Natural but Dormant"
  | "Adaptive / Survival"
  | "Weak / Draining";

export interface ClusterReport extends ClusterScore {
  zone: Zone;
}

export type ReadingQualityLevel = "Stabil" | "Cukup Stabil" | "Perlu Dibaca Hati-hati";

export interface ReadingQuality {
  score: number;
  level: ReadingQualityLevel;
  summary: string;
  notes: string[];
  metrics: {
    completionPercent: number;
    variation: number;
    dominantAnswerRatio: number;
    neutralRatio: number;
    extremeHighRatio: number;
    extremeLowRatio: number;
    socialDesirabilityScore: number;
  };
}
