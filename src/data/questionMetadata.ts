import { MICRO_ROLE_ITEM_MAP, type MicroRoleId } from "@/data/microRoles";
import type { Cluster, QuestionItem } from "@/types/assessment";

type MetadataOverride = Partial<Omit<QuestionItem, "id" | "session" | "number" | "text">>;

const SOCIAL_DESIRABILITY_IDS = new Set([
  "natural-47",
  "natural-134",
  "natural-141",
  "natural-160",
  "natural-170",
]);
const DRAIN_IDS = new Set(["natural-38", "natural-110", "natural-163"]);
const TRADEOFF_IDS = new Set([
  "natural-6",
  "natural-16",
  "natural-42",
  "natural-52",
  "natural-75",
  "natural-124",
  "natural-159",
]);
const ENERGY_IDS = new Set([
  "natural-1",
  "natural-9",
  "natural-11",
  "natural-15",
  "natural-23",
  "natural-31",
  "natural-32",
  "natural-37",
  "natural-45",
  "natural-46",
  "natural-51",
  "natural-68",
  "natural-70",
  "natural-71",
  "natural-82",
  "natural-93",
  "natural-117",
  "natural-129",
  "natural-131",
  "natural-138",
  "natural-143",
  "natural-150",
  "natural-153",
  "natural-162",
  "natural-174",
  "natural-175",
  "natural-178",
]);
const THINKING_IDS = new Set([
  "natural-3",
  "natural-7",
  "natural-24",
  "natural-30",
  "natural-31",
  "natural-34",
  "natural-36",
  "natural-50",
  "natural-60",
  "natural-64",
  "natural-65",
  "natural-72",
  "natural-96",
  "natural-101",
  "natural-104",
  "natural-105",
  "natural-106",
  "natural-108",
  "natural-132",
  "natural-137",
  "natural-139",
  "natural-140",
  "natural-144",
  "natural-165",
  "natural-168",
  "natural-173",
  "natural-180",
]);

const ROLE_OVERRIDES: Record<string, MicroRoleId[]> = {
  "natural-5": ["people_developer"],
  "natural-13": ["social_connector", "harmony_keeper"],
  "natural-15": ["action_mover"],
  "natural-17": ["action_mover"],
  "natural-18": ["people_developer", "meaning_keeper"],
  "natural-20": ["meaning_keeper"],
  "natural-23": ["achievement_driver"],
  "natural-28": ["information_collector", "deep_thinker"],
  "natural-29": ["harmony_keeper"],
  "natural-35": ["fast_learner"],
  "natural-41": ["emotion_reader", "people_developer"],
  "natural-48": ["people_developer"],
  "natural-49": ["social_connector"],
  "natural-51": ["action_mover"],
  "natural-53": ["strategy_designer"],
  "natural-54": ["people_developer"],
  "natural-56": ["strategy_designer"],
  "natural-58": ["emotion_reader"],
  "natural-59": ["commitment_keeper"],
  "natural-64": ["pattern_reader"],
  "natural-66": ["commitment_keeper"],
  "natural-77": ["idea_translator", "emotion_reader"],
  "natural-83": ["quality_evaluator", "creative_designer"],
  "natural-84": ["social_connector", "achievement_driver"],
  "natural-85": ["commitment_keeper", "quality_evaluator"],
  "natural-87": ["achievement_driver"],
  "natural-89": ["complexity_arranger"],
  "natural-90": ["people_developer"],
  "natural-92": ["consistency_guardian"],
  "natural-94": ["achievement_driver"],
  "natural-95": ["achievement_driver"],
  "natural-100": ["information_collector"],
  "natural-103": ["group_includer", "consistency_guardian"],
  "natural-113": ["emotion_reader"],
  "natural-119": ["quality_evaluator", "achievement_driver"],
  "natural-120": ["social_connector"],
  "natural-122": ["decision_director"],
  "natural-125": ["action_mover"],
  "natural-126": ["relationship_keeper"],
  "natural-128": ["strategy_designer"],
  "natural-130": ["decision_director"],
  "natural-131": ["achievement_driver"],
  "natural-136": ["deep_thinker", "information_collector"],
  "natural-149": ["emotion_reader"],
  "natural-155": ["achievement_driver"],
  "natural-156": ["people_developer", "social_connector"],
  "natural-161": ["action_mover"],
  "natural-164": ["consistency_guardian", "strategy_designer"],
  "natural-166": ["future_mapper", "risk_checker"],
  "natural-167": ["social_connector", "achievement_driver"],
  "natural-172": ["information_collector", "risk_checker"],
  "strength-57": ["operational_executor", "people_developer"],
  "strength-65": ["social_connector", "achievement_driver"],
  "strength-66": ["idea_translator", "decision_director"],
};

const CLUSTER_OVERRIDES: Record<string, Cluster> = {
  "natural-14": "Relating",
  "natural-16": "Influencing",
  "natural-72": "Thinking",
  "natural-104": "Creating",
  "natural-173": "Analyzing",
};

const ITEM_OVERRIDES: Record<string, MetadataOverride> = {
  "natural-38": {
    itemType: "drain",
    scoreLane: "fatigue",
    biasRisk: "medium",
    weight: 0.55,
    microRoles: ["emotion_reader"],
  },
  "natural-110": {
    itemType: "drain",
    scoreLane: "fatigue",
    biasRisk: "medium",
    weight: 0.6,
    microRoles: ["emotion_reader"],
  },
  "natural-163": {
    itemType: "drain",
    scoreLane: "fatigue",
    biasRisk: "medium",
    weight: 0.7,
    microRoles: ["system_organizer"],
  },
};

function buildRoleLookup(): Map<string, MicroRoleId[]> {
  const lookup = new Map<string, MicroRoleId[]>();

  const add = (id: string, roleId: MicroRoleId) => {
    const existing = lookup.get(id) ?? [];
    if (!existing.includes(roleId)) existing.push(roleId);
    lookup.set(id, existing);
  };

  for (const map of MICRO_ROLE_ITEM_MAP) {
    map.naturalItemIds.forEach((id) => add(id, map.id));
    map.strengthItemIds.forEach((id) => add(id, map.id));
  }

  for (const [id, roleIds] of Object.entries(ROLE_OVERRIDES)) {
    roleIds.forEach((roleId) => add(id, roleId));
  }

  return lookup;
}

const ROLE_LOOKUP = buildRoleLookup();

function inferNaturalItemType(id: string): QuestionItem["itemType"] {
  if (SOCIAL_DESIRABILITY_IDS.has(id)) return "social_desirability";
  if (DRAIN_IDS.has(id)) return "drain";
  if (TRADEOFF_IDS.has(id)) return "tradeoff";
  if (ENERGY_IDS.has(id)) return "energy";
  if (THINKING_IDS.has(id)) return "thinking";
  return "habit";
}

function defaultMetadata(question: QuestionItem): MetadataOverride {
  if (question.session === "strength") {
    return {
      microRoles: ROLE_LOOKUP.get(question.id),
      itemType: question.itemType ?? "activity",
      scoreLane: question.scoreLane ?? "strength",
      polarity: question.polarity ?? "positive",
      biasRisk: question.biasRisk ?? "low",
      weight: question.weight ?? 1,
    };
  }

  const itemType = question.itemType ?? inferNaturalItemType(question.id);
  return {
    cluster: CLUSTER_OVERRIDES[question.id] ?? question.cluster,
    microRoles: ROLE_LOOKUP.get(question.id),
    itemType,
    scoreLane:
      question.scoreLane ??
      (itemType === "drain"
        ? "fatigue"
        : itemType === "social_desirability"
          ? "quality"
          : "natural"),
    polarity: question.polarity ?? "positive",
    biasRisk:
      question.biasRisk ??
      (itemType === "social_desirability"
        ? "high"
        : itemType === "drain" || itemType === "tradeoff"
          ? "medium"
          : "low"),
    weight:
      question.weight ??
      (itemType === "social_desirability" ? 0.35 : itemType === "drain" ? 0.6 : 1),
  };
}

export function withQuestionMetadata(question: QuestionItem): QuestionItem {
  const defaults = defaultMetadata(question);
  const override = ITEM_OVERRIDES[question.id] ?? {};

  return {
    ...question,
    ...defaults,
    ...override,
    cluster: override.cluster ?? defaults.cluster ?? question.cluster,
    microRoles: override.microRoles ?? question.microRoles ?? defaults.microRoles,
  } as QuestionItem;
}

export function withQuestionBankMetadata(questions: QuestionItem[]): QuestionItem[] {
  return questions.map(withQuestionMetadata);
}
