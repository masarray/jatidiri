import type { Answers, ClusterReport, QuestionItem, Zone } from "@/types/assessment";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";
import { isAnswerValue, normalizeAnswer } from "@/engine/scoring";
import {
  MICRO_ROLE_DEFINITIONS,
  MICRO_ROLE_ITEM_MAP,
  ROLE_FAMILIES,
  type MicroRoleDefinition,
  type MicroRoleId,
  type MicroRoleItemMap,
  type RoleFamily,
} from "@/data/microRoles";

const SCORE_NEUTRAL = 3;
const NAT_HI = 62;
const STR_HI = 62;

export type MicroRoleConfidenceLabel = "tinggi" | "sedang" | "indikasi awal";

export interface MicroRoleScore extends MicroRoleDefinition {
  /** Calibrated score 0-100. Uses the user's own response baseline to reduce agreement-bias. */
  natural: number;
  /** Calibrated score 0-100. Uses the user's own response baseline to reduce all-high strength answers. */
  strength: number;
  /** Direct raw score 0-100 before calibration. Useful for debug/validation. */
  naturalRaw: number;
  /** Direct raw score 0-100 before calibration. Useful for debug/validation. */
  strengthRaw: number;
  naturalItems: number;
  strengthItems: number;
  /**
   * Reading confidence for this micro-role.
   * This is not a truth score. It only says how much evidence supports the reading.
   */
  confidence: number;
  confidenceLabel: MicroRoleConfidenceLabel;
  zone: Zone;
}

export interface RoleFamilyScore {
  family: RoleFamily;
  natural: number;
  strength: number;
  roleCount: number;
}

export type AdaptiveGapKind = "marketing" | "administrative" | "service" | "generic";

export interface AdaptiveGapInsight {
  id: string;
  kind: AdaptiveGapKind;
  title: string;
  score: number;
  naturalRouteScore: number;
  adaptiveLoadScore: number;
  routeLabel: string;
  notRouteLabel: string;
  interpretation: string;
  bestUse: string;
  energyCost: string;
  supportStrategy: string;
}

export interface CoreSignature {
  title: string;
  subtitle: string;
  summary: string;
  visiblePattern: string;
  hiddenEnergy: string;
  riskIfMisplaced: string;
  healthyUse: string;
  evidence: MicroRoleScore[];
}

export interface PatternSignatureReport {
  core: CoreSignature;
  microRoles: MicroRoleScore[];
  topNaturalRoles: MicroRoleScore[];
  topTrainedRoles: MicroRoleScore[];
  adaptiveRoles: MicroRoleScore[];
  adaptiveGapInsights: AdaptiveGapInsight[];
  drainingRoles: MicroRoleScore[];
  roleFamilies: RoleFamilyScore[];
}

interface SignatureRule {
  title: string;
  subtitle: string;
  roleIds: MicroRoleId[];
  visiblePattern: string;
  hiddenEnergy: string;
  riskIfMisplaced: string;
  healthyUse: string;
}

const SIGNATURE_RULES: SignatureRule[] = [
  {
    title: "Strategic Knowledge Translator",
    subtitle: "Mengumpulkan bahan, membaca makna, lalu mengubahnya menjadi penjelasan yang bisa digunakan.",
    roleIds: ["information_collector", "fast_learner", "deep_thinker", "idea_translator", "strategy_designer"],
    visiblePattern:
      "Dari luar kamu dapat terlihat sebagai orang yang banyak tahu, mudah menjelaskan, dan mampu membantu orang lain melihat arah dari informasi yang sebelumnya terasa berserakan.",
    hiddenEnergy:
      "Energi terdalamnya bukan hanya berbicara atau tampil, tetapi memahami bahan yang kompleks, menemukan benang merah, lalu memberi bahasa yang lebih jelas.",
    riskIfMisplaced:
      "Jika terlalu lama ditempatkan hanya pada pekerjaan eksekusi berulang tanpa ruang belajar dan menyusun makna, kamu mungkin tetap bisa menjalankannya, tetapi semangat dan energi kamu dapat cepat turun.",
    healthyUse:
      "Gunakan kekuatan ini dalam peran yang melibatkan belajar, menulis, mengajar, menyusun konsep, mempresentasikan ide, atau menjembatani informasi rumit menjadi keputusan.",
  },
  {
    title: "Pattern-Based Problem Solver",
    subtitle: "Membaca data, menemukan akar masalah, lalu menyusun jalan keluar yang lebih masuk akal.",
    roleIds: ["pattern_reader", "problem_restorer", "strategy_designer", "quality_evaluator", "risk_checker"],
    visiblePattern:
      "Dari luar kamu tampak sebagai orang yang tidak puas pada jawaban permukaan. kamu cenderung bertanya, memeriksa, dan mencari pola sebelum menerima kesimpulan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika ada masalah nyata yang dapat diurai, dibuktikan, dan diperbaiki sampai lebih jelas atau lebih aman.",
    riskIfMisplaced:
      "Jika lingkungan memaksa keputusan cepat tanpa data atau mengabaikan risiko, kamu bisa menjadi tegang, kritis, atau terasa sulit diyakinkan.",
    healthyUse:
      "Tempatkan kekuatan ini sebagai fungsi diagnosis, audit, evaluasi, perbaikan sistem, atau strategi berbasis bukti; sertakan batas waktu agar analisis tidak berubah menjadi penundaan.",
  },
  {
    title: "Creative Idea Driver",
    subtitle: "Mengolah ide menjadi bentuk, pesan, atau arah yang lebih menarik dan dapat menggerakkan orang.",
    roleIds: ["idea_synthesizer", "creative_designer", "idea_translator", "social_connector", "achievement_driver"],
    visiblePattern:
      "Dari luar kamu dapat terlihat sebagai pembawa ide, pembuat konsep, atau orang yang mampu membuat sesuatu terasa lebih menarik untuk diperhatikan.",
    hiddenEnergy:
      "Energi terdalamnya muncul saat kamu boleh menjelajah kemungkinan, merangkai banyak bahan, dan membuat orang lain melihat nilai baru dari sebuah gagasan.",
    riskIfMisplaced:
      "Jika terlalu cepat dibatasi oleh prosedur kaku atau pekerjaan repetitif, kreativitas bisa berubah menjadi gelisah, bosan, atau kehilangan dorongan.",
    healthyUse:
      "Gunakan pada fase eksplorasi, branding, konten, komunikasi, perancangan konsep, dan inovasi; lalu pasangkan dengan ritme eksekusi yang menjaga ide selesai.",
  },
  {
    title: "Quality & System Guardian",
    subtitle: "Menata proses, menjaga komitmen, dan memastikan hasil dapat dipercaya.",
    roleIds: ["commitment_keeper", "system_organizer", "quality_evaluator", "consistency_guardian", "operational_executor"],
    visiblePattern:
      "Dari luar kamu terlihat sebagai orang yang memperhatikan keteraturan, kualitas, tanggung jawab, dan stkamur kerja yang jelas.",
    hiddenEnergy:
      "Energi terdalam muncul ketika sistem rapi, tugas jelas, dan hasil dapat dipertanggungjawabkan tanpa banyak ketidakpastian.",
    riskIfMisplaced:
      "Jika terlalu sering berhadapan dengan perubahan mendadak, aturan yang tidak konsisten, atau pekerjaan tanpa stkamur, semangat dan energi kamu dapat cepat turun.",
    healthyUse:
      "Gunakan kekuatan ini untuk membuat prosedur, menjaga mutu, mengelola jadwal, dan merapikan proses; tetap beri ruang fleksibilitas agar sistem tidak terasa kaku.",
  },
  {
    title: "Human Growth Partner",
    subtitle: "Membaca orang, menjaga relasi, dan membantu orang lain bertumbuh dengan lebih aman.",
    roleIds: ["people_developer", "mentor_coach", "emotion_reader", "relationship_keeper", "harmony_keeper"],
    visiblePattern:
      "Dari luar kamu terlihat peka, mudah menangkap kebutuhan orang, dan cenderung ingin membantu orang lain menjadi lebih baik.",
    hiddenEnergy:
      "Energi terdalam muncul ketika relasi terasa tulus dan kontribusi kamu membantu seseorang bertumbuh, merasa dipahami, atau menemukan arah.",
    riskIfMisplaced:
      "Jika terlalu banyak menyerap emosi atau memikul perkembangan orang lain sendirian, kekuatan ini dapat berubah menjadi kelelahan emosional.",
    healthyUse:
      "Gunakan untuk mendampingi, mengajar, membina, memberi feedback, atau membangun kultur yang aman; jaga batas agar tidak semua beban orang lain menjadi beban kamu.",
  },
  {
    title: "Momentum & Decision Driver",
    subtitle: "Memberi arah, mengambil posisi, dan mendorong sesuatu bergerak dari wacana menjadi tindakan.",
    roleIds: ["decision_director", "action_mover", "achievement_driver", "strategy_designer", "complexity_arranger"],
    visiblePattern:
      "Dari luar kamu terlihat sebagai orang yang bisa memberi arah, mengambil keputusan, atau mendorong orang keluar dari kebuntuan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika ada tujuan jelas, momentum nyata, dan ruang untuk mengubah arah menjadi langkah.",
    riskIfMisplaced:
      "Jika tidak diberi ruang memengaruhi arah, kamu bisa merasa tertahan; namun jika terlalu cepat bergerak, orang lain bisa merasa tertinggal.",
    healthyUse:
      "Gunakan untuk memimpin keputusan, membuka jalan, mengatur prioritas, dan menjaga momentum; tetap kombinasikan dengan mendengar dan mengecek kesiapan pihak lain.",
  },
  {
    title: "Relationship & Family Architect",
    subtitle: "Membangun kedekatan, rasa aman, dan ruang kelompok yang membuat orang merasa diterima.",
    roleIds: ["relationship_keeper", "social_connector", "group_includer", "emotion_reader", "harmony_keeper"],
    visiblePattern:
      "Dari luar kamu tampak menjaga kedekatan, memperhatikan suasana, dan ingin orang-orang penting tetap merasa dilibatkan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika relasi terasa aman, hangat, dan tidak sekadar transaksional.",
    riskIfMisplaced:
      "Jika relasi terasa dingin, sepihak, atau konflik dibiarkan menggantung, semangat dan energi emosional kamu dapat cepat turun.",
    healthyUse:
      "Gunakan kekuatan ini untuk membangun komunikasi keluarga, merawat kedekatan, dan menjaga iklim kelompok; tetap bicarakan batas dan pembagian peran secara jelas.",
  },
  {
    title: "Future Direction Designer",
    subtitle: "Membaca kemungkinan, menyusun visi, dan mengubah gambaran besar menjadi arah yang lebih konkret.",
    roleIds: ["future_mapper", "idea_synthesizer", "strategy_designer", "creative_designer", "meaning_keeper"],
    visiblePattern:
      "Dari luar kamu tampak sering membawa sudut pkamung jangka panjang, kemungkinan baru, atau gambaran yang belum dilihat orang lain.",
    hiddenEnergy:
      "Energi terdalam muncul ketika kamu boleh membayangkan masa depan dan menyusun makna atau arah dari kemungkinan tersebut.",
    riskIfMisplaced:
      "Jika terlalu lama dikurung pada detail harian tanpa visi, kamu bisa merasa kehilangan arah atau makna.",
    healthyUse:
      "Gunakan untuk menyusun visi, roadmap, eksperimen pengembangan, dan arah keluarga/karier; turunkan visi menjadi langkah kecil agar tidak berhenti sebagai ide besar.",
  },
];

const QUESTION_LOOKUP = new Map<string, QuestionItem>(
  [...naturalQuestions, ...strengthQuestions].map((question) => [question.id, question]),
);

const MICRO_ROLE_IDS = new Set<MicroRoleId>(Object.keys(MICRO_ROLE_DEFINITIONS) as MicroRoleId[]);

function validMicroRoleIds(question: QuestionItem): MicroRoleId[] {
  return (question.microRoles ?? []).filter((roleId): roleId is MicroRoleId =>
    MICRO_ROLE_IDS.has(roleId as MicroRoleId),
  );
}

function buildQuestionMetadataItemMap(): MicroRoleItemMap[] {
  const byRole = new Map<MicroRoleId, MicroRoleItemMap>();

  for (const map of MICRO_ROLE_ITEM_MAP) {
    byRole.set(map.id, {
      id: map.id,
      naturalItemIds: [...map.naturalItemIds],
      strengthItemIds: [...map.strengthItemIds],
    });
  }

  const add = (question: QuestionItem) => {
    for (const roleId of validMicroRoleIds(question)) {
      const entry =
        byRole.get(roleId) ??
        ({ id: roleId, naturalItemIds: [], strengthItemIds: [] } satisfies MicroRoleItemMap);
      const target = question.session === "natural" ? entry.naturalItemIds : entry.strengthItemIds;
      if (!target.includes(question.id)) target.push(question.id);
      byRole.set(roleId, entry);
    }
  };

  naturalQuestions.forEach(add);
  strengthQuestions.forEach(add);

  return [...byRole.values()];
}

function questionWeight(questionId: string): number {
  const question = QUESTION_LOOKUP.get(questionId);
  if (!question) return 1;

  let weight = typeof question.weight === "number" ? question.weight : 1;
  if (question.itemType === "social_desirability") weight *= 0.35;
  if (question.itemType === "drain" || question.scoreLane === "fatigue") weight *= 0.55;
  if (question.biasRisk === "high") weight *= 0.75;
  if (question.biasRisk === "medium") weight *= 0.9;

  return Math.max(0.15, Math.min(1.25, weight));
}

function applyQuestionPolarity(questionId: string, value: number): number {
  const question = QUESTION_LOOKUP.get(questionId);
  if (question?.polarity === "reverse") return 6 - value;
  return value;
}

function normalizeTo100(value: number): number {
  return Math.round(normalizeAnswer(value));
}

function clampScore(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function sessionMean(values: Record<string, number>): number {
  const valid = Object.values(values).filter(isAnswerValue);
  if (valid.length === 0) return SCORE_NEUTRAL;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

/**
 * Calibrates role scores against the user's own response baseline.
 *
 * This is the key anti-agreement-bias step:
 * - If a user answers high on almost everything, average roles no longer all become "dominant".
 * - Roles that are truly high relative to that user's pattern still rise.
 * - Raw scores remain available as naturalRaw/strengthRaw for debug and validation.
 */
function calibratedScoreFromMean(meanAnswer: number, baselineAnswer: number): number {
  const raw = normalizeTo100(meanAnswer);
  const baseline = normalizeTo100(baselineAnswer);
  const calibrated = 50 + (raw - baseline) * 1.35 + (raw - 50) * 0.25;
  return Math.round(clampScore(calibrated));
}

function confidenceLabel(score: number): MicroRoleConfidenceLabel {
  if (score >= 72) return "tinggi";
  if (score >= 55) return "sedang";
  return "indikasi awal";
}

function microRoleConfidence(params: {
  naturalItems: number;
  strengthItems: number;
  natural: number;
  strength: number;
  naturalRaw: number;
  strengthRaw: number;
}): number {
  const naturalCoverage = Math.min(1, params.naturalItems / 4);
  const strengthCoverage = Math.min(1, params.strengthItems / 3);
  const coverage = (naturalCoverage * 0.68 + strengthCoverage * 0.32) * 100;
  const prominence = Math.max(params.natural, params.strength);
  const rawProminence = Math.max(params.naturalRaw, params.strengthRaw);
  const naturalStrengthGap = Math.min(22, Math.abs(params.strength - params.natural) * 0.28);

  // Balanced confidence: enough items matter more than high score.
  // This prevents a role with only 1-2 items from sounding too certain.
  return Math.round(
    clampScore(24 + coverage * 0.44 + prominence * 0.18 + rawProminence * 0.08 + naturalStrengthGap),
  );
}

function scoreFromIds(
  values: Record<string, number>,
  ids: string[],
  baselineAnswer = sessionMean(values),
): { score: number; raw: number; items: number } {
  const valid = ids
    .map((id) => ({ id, value: values[id] }))
    .filter((item): item is { id: string; value: number } => isAnswerValue(item.value));

  if (valid.length === 0) return { score: 0, raw: 0, items: 0 };

  let weightedSum = 0;
  let weightSum = 0;
  let rawSum = 0;

  for (const item of valid) {
    const value = applyQuestionPolarity(item.id, item.value);
    const weight = questionWeight(item.id);
    weightedSum += value * weight;
    weightSum += weight;
    rawSum += value;
  }

  const weightedMean = weightSum === 0 ? SCORE_NEUTRAL : weightedSum / weightSum;
  const rawMean = rawSum / valid.length;

  return {
    score: calibratedScoreFromMean(weightedMean, baselineAnswer),
    raw: normalizeTo100(rawMean),
    items: valid.length,
  };
}

function classify(natural: number, strength: number): Zone {
  const natHi = natural >= NAT_HI;
  const strHi = strength >= STR_HI;
  if (natHi && strHi) return "Natural & Explored";
  if (natHi && !strHi) return "Natural but Dormant";
  if (!natHi && strHi) return "Adaptive / Survival";
  return "Weak / Draining";
}

function roleById(id: MicroRoleId, roles: MicroRoleScore[]): MicroRoleScore | undefined {
  return roles.find((role) => role.id === id);
}

function averageScore(roleIds: MicroRoleId[], roles: MicroRoleScore[]): number {
  const selected = roleIds.map((id) => roleById(id, roles)).filter((role): role is MicroRoleScore => Boolean(role));
  if (selected.length === 0) return 0;
  return selected.reduce((sum, role) => sum + role.natural, 0) / selected.length;
}

function overlapScore(roleIds: MicroRoleId[], topRoles: MicroRoleScore[]): number {
  const topIds = new Set(topRoles.slice(0, 7).map((role) => role.id));
  return roleIds.filter((id) => topIds.has(id)).length * 4;
}

function buildFallbackSignature(topRoles: MicroRoleScore[]): CoreSignature {
  const primary = topRoles[0];
  const secondary = topRoles[1] ?? topRoles[0];
  const tertiary = topRoles[2] ?? secondary;
  return {
    title: `${primary.name} ${secondary.id !== primary.id ? `dengan ${secondary.name}` : ""}`.trim(),
    subtitle: `Kombinasi utama yang terbaca dari ${primary.name}, ${secondary.name}, dan ${tertiary.name}.`,
    summary: `Pola inti kamu tampak berada pada kombinasi ${primary.name}, ${secondary.name}, dan ${tertiary.name}. Artinya, hasil ini tidak hanya dibaca sebagai satu kekuatan tunggal, tetapi sebagai cara kerja yang muncul dari beberapa kecenderungan yang saling menguatkan.`,
    visiblePattern: primary.visible,
    hiddenEnergy: `Energi terdalam terutama muncul ketika ${primary.energy.toLowerCase()}`,
    riskIfMisplaced: primary.risk,
    healthyUse: primary.healthyUse,
    evidence: topRoles.slice(0, 5),
  };
}

function pickCoreSignature(roles: MicroRoleScore[]): CoreSignature {
  const topRoles = [...roles].sort((a, b) => b.natural - a.natural).slice(0, 8);
  const bestRule = SIGNATURE_RULES
    .map((rule) => ({
      rule,
      score: averageScore(rule.roleIds, roles) + overlapScore(rule.roleIds, topRoles),
    }))
    .sort((a, b) => b.score - a.score)[0];

  if (!bestRule || bestRule.score < 42) return buildFallbackSignature(topRoles);

  const evidence = bestRule.rule.roleIds
    .map((id) => roleById(id, roles))
    .filter((role): role is MicroRoleScore => Boolean(role))
    .sort((a, b) => b.natural - a.natural)
    .slice(0, 5);

  return {
    title: bestRule.rule.title,
    subtitle: bestRule.rule.subtitle,
    summary: `Pola inti yang terbaca adalah ${bestRule.rule.title.toLowerCase()}. Ini tidak berarti kamu hanya memiliki satu sisi, tetapi kombinasi beberapa kekuatan mikro yang saling menguatkan: ${evidence.map((role) => role.name).join(", ")}.`,
    visiblePattern: bestRule.rule.visiblePattern,
    hiddenEnergy: bestRule.rule.hiddenEnergy,
    riskIfMisplaced: bestRule.rule.riskIfMisplaced,
    healthyUse: bestRule.rule.healthyUse,
    evidence,
  };
}

export function buildMicroRoleScores(answers: Answers): MicroRoleScore[] {
  const naturalBaseline = sessionMean(answers.natural);
  const strengthBaseline = sessionMean(answers.strength);

  return buildQuestionMetadataItemMap().map((map) => {
    const definition = MICRO_ROLE_DEFINITIONS[map.id];
    const natural = scoreFromIds(answers.natural, map.naturalItemIds, naturalBaseline);
    const strength = scoreFromIds(answers.strength, map.strengthItemIds, strengthBaseline);
    const confidence = microRoleConfidence({
      naturalItems: natural.items,
      strengthItems: strength.items,
      natural: natural.score,
      strength: strength.score,
      naturalRaw: natural.raw,
      strengthRaw: strength.raw,
    });

    return {
      ...definition,
      natural: natural.score,
      strength: strength.score,
      naturalRaw: natural.raw,
      strengthRaw: strength.raw,
      naturalItems: natural.items,
      strengthItems: strength.items,
      confidence,
      confidenceLabel: confidenceLabel(confidence),
      zone: classify(natural.score, strength.score),
    };
  });
}

function mean(values: number[]): number {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
}

function directStrengthScore(answers: Answers, ids: string[]): number {
  return scoreFromIds(answers.strength, ids, sessionMean(answers.strength)).score;
}

function directNaturalScore(answers: Answers, ids: string[]): number {
  return scoreFromIds(answers.natural, ids, sessionMean(answers.natural)).score;
}

function roleScore(roles: MicroRoleScore[], id: MicroRoleId): MicroRoleScore | undefined {
  return roles.find((role) => role.id === id);
}

function averageRoleNatural(roles: MicroRoleScore[], ids: MicroRoleId[]): number {
  return mean(ids.map((id) => roleScore(roles, id)?.natural ?? 0));
}

function averageRoleStrength(roles: MicroRoleScore[], ids: MicroRoleId[]): number {
  return mean(ids.map((id) => roleScore(roles, id)?.strength ?? 0));
}

function buildMarketingGapInsight(answers: Answers, roles: MicroRoleScore[]): AdaptiveGapInsight | null {
  const marketingStrength = directStrengthScore(answers, [
    "strength-44",
    "strength-45",
    "strength-46",
    "strength-47",
    "strength-65",
    "strength-66",
    "strength-79",
    "strength-81",
  ]);

  const conceptRoute = mean([
    averageRoleNatural(roles, ["idea_translator", "idea_synthesizer", "strategy_designer", "pattern_reader", "information_collector"]),
    averageRoleStrength(roles, ["idea_translator", "idea_synthesizer", "strategy_designer"]),
  ]);
  const socialSalesRoute = averageRoleNatural(roles, ["social_connector", "achievement_driver", "decision_director", "emotion_reader"]);

  if (marketingStrength < 58) return null;

  if (conceptRoute >= socialSalesRoute + 8 || socialSalesRoute < 55) {
    return {
      id: "marketing_concept_route",
      kind: "marketing",
      title: "Concept-Led Marketing",
      score: marketingStrength,
      naturalRouteScore: conceptRoute,
      adaptiveLoadScore: socialSalesRoute,
      routeLabel: "Jalur utama: konsep, strategi, penjelasan nilai",
      notRouteLabel: "Bukan jalur utama: basa-basi sosial, cold selling, kompetisi jualan",
      interpretation:
        "kamu dapat terlihat kuat dalam marketing, promosi, positioning, atau menjelaskan nilai sebuah produk. Namun kekuatan ini lebih mungkin berasal dari kemampuan menyusun ide, strategi, konsep, edukasi, storytelling, dan value proposition; bukan dari kebutuhan sosial untuk terus tampil ramah, basa-basi, atau dikenal banyak orang.",
      bestUse:
        "Paling sehat digunakan untuk marketing berbasis edukasi, concept selling, product storytelling, proposal, demo, konten penjelasan, atau positioning nilai.",
      energyCost:
        "Dapat menguras energi bila bentuk marketing-nya terlalu banyak cold approach, basa-basi sosial, follow-up relasi yang repetitif, kompetisi jualan, atau tuntutan tampil ramah ke semua orang sepanjang hari.",
      supportStrategy:
        "Pisahkan fase strategi/konten dari fase follow-up sosial. Gunakan template, CRM sederhana, partner relasi, atau jadwal recovery setelah aktivitas promosi intensif.",
    };
  }

  return {
    id: "marketing_relationship_route",
    kind: "marketing",
    title: "Trust-Based Selling",
    score: marketingStrength,
    naturalRouteScore: socialSalesRoute,
    adaptiveLoadScore: conceptRoute,
    routeLabel: "Jalur utama: kepercayaan, relasi, pelayanan",
    notRouteLabel: "Bukan jalur utama: promosi agresif tanpa kedekatan",
    interpretation:
      "kamu dapat meyakinkan orang ketika ada rasa percaya, manfaat nyata, dan konteks relasi yang cukup aman. Gaya meyakinkan ini bukan tipe promosi agresif; ia lebih kuat ketika kamu benar-benar percaya bahwa sesuatu itu benar, bermanfaat, dan dapat membantu orang lain.",
    bestUse:
      "Paling sehat digunakan untuk penjualan konsultatif, pelayanan bernilai, rekomendasi personal, atau edukasi kepada orang yang sudah mulai percaya.",
    energyCost:
      "Dapat menguras energi bila harus terus tampil agresif, memaksa keputusan, atau menjual sesuatu yang tidak diyakini manfaatnya.",
    supportStrategy:
      "Bangun bahan penjelasan yang jujur, proses follow-up yang ringan, dan batas target yang tidak membuat relasi terasa transaksional.",
  };
}

function buildAdministrativeGapInsight(answers: Answers, roles: MicroRoleScore[]): AdaptiveGapInsight | null {
  const administrativeStrength = directStrengthScore(answers, [
    "strength-9",
    "strength-10",
    "strength-11",
    "strength-12",
    "strength-13",
    "strength-14",
    "strength-95",
    "strength-97",
    "strength-98",
    "strength-99",
    "strength-100",
  ]);
  const naturalAdminRoute = averageRoleNatural(roles, ["system_organizer", "operational_executor", "commitment_keeper", "quality_evaluator"]);
  const responsibilityPush = mean([
    roleScore(roles, "commitment_keeper")?.natural ?? 0,
    directNaturalScore(answers, ["natural-7", "natural-43", "natural-79", "natural-115", "natural-151"]),
  ]);

  if (administrativeStrength < 58 || naturalAdminRoute >= 58) return null;

  return {
    id: "administrative_responsibility_route",
    kind: "administrative",
    title: "Administrative Responsibility Load",
    score: administrativeStrength,
    naturalRouteScore: responsibilityPush,
    adaptiveLoadScore: naturalAdminRoute,
    routeLabel: "Jalur yang mendorong: tanggung jawab, stkamur, kebutuhan peran",
    notRouteLabel: "Bukan sumber energi dan semangat utama: rutinitas administratif berulang",
    interpretation:
      "kamu bisa mengurus file, laporan, data, jadwal, atau proses administratif ketika keadaan menuntut. Namun bila struktur operasional bukan Natural Talent yang kuat, kemampuan ini lebih tepat dibaca sebagai Adaptive / Survival Strength: muncul karena tanggung jawab, jabatan, tuntutan keluarga, atau kebutuhan lingkungan; bukan karena area itu menjadi sumber energi dan semangat utama.",
    bestUse:
      "Gunakan untuk memastikan hal penting tidak tercecer, terutama ketika ada tujuan yang jelas dan dampaknya terasa penting.",
    energyCost:
      "Akan lebih cepat menguras energi bila menjadi pekerjaan utama harian yang repetitif, detail-heavy, dan tidak memberi ruang berpikir atau makna.",
    supportStrategy:
      "Pakai checklist, template, folder stkamur, reminder otomatis, delegasi, atau batching waktu agar administrasi tidak memakan energi terbaik.",
  };
}

function buildServiceGapInsight(answers: Answers, roles: MicroRoleScore[]): AdaptiveGapInsight | null {
  const serviceStrength = directStrengthScore(answers, [
    "strength-54",
    "strength-57",
    "strength-58",
    "strength-59",
    "strength-61",
    "strength-62",
    "strength-85",
    "strength-86",
    "strength-87",
    "strength-88",
  ]);
  const naturalCareRoute = averageRoleNatural(roles, ["people_developer", "relationship_keeper", "emotion_reader", "harmony_keeper", "mentor_coach"]);
  const dutyRoute = averageRoleNatural(roles, ["commitment_keeper", "meaning_keeper", "consistency_guardian"]);

  if (serviceStrength < 60 || naturalCareRoute >= 60) return null;

  return {
    id: "service_duty_route",
    kind: "service",
    title: "Service Through Duty & Values",
    score: serviceStrength,
    naturalRouteScore: dutyRoute,
    adaptiveLoadScore: naturalCareRoute,
    routeLabel: "Jalur yang mendorong: nilai, kepedulian, tanggung jawab",
    notRouteLabel: "Bukan berarti selalu siap menampung semua beban emosi",
    interpretation:
      "kamu dapat terlihat kuat dalam membantu, melayani, atau mendampingi orang lain. Namun bila kepekaan relasional bukan sumber energi dan semangat utama, bantuan itu lebih mungkin muncul karena nilai, tanggung jawab, ketulusan, atau rasa perlu melakukan yang benar; bukan karena selalu siap menampung semua kebutuhan emosional orang lain.",
    bestUse:
      "Paling sehat digunakan untuk bantuan yang punya batas jelas, tujuan jelas, dan tidak membuat kamu mengambil alih seluruh beban orang lain.",
    energyCost:
      "Dapat melelahkan bila orang lain terus meminta perhatian emosional, bantuan spontan, atau dukungan tanpa batas yang jelas.",
    supportStrategy:
      "Buat batas bantuan, sepakati peran, gunakan jadwal, dan bedakan antara mendukung orang lain dengan memikul hidupnya.",
  };
}

function buildGenericAdaptiveInsights(roles: MicroRoleScore[]): AdaptiveGapInsight[] {
  return roles
    .filter((role) => role.zone === "Adaptive / Survival")
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3)
    .map((role) => ({
      id: `generic_${role.id}`,
      kind: "generic" as const,
      title: `${role.name} as Adaptive / Survival Strength`,
      score: role.strength,
      naturalRouteScore: role.natural,
      adaptiveLoadScore: role.strength - role.natural,
      routeLabel: "Terlihat kuat karena sering digunakan atau dituntut peran",
      notRouteLabel: "Belum tentu menjadi sumber energi dan semangat utama",
      interpretation: `Area ${role.name} tampak dapat kamu jalankan, tetapi skor alami yang lebih rendah menunjukkan bahwa kekuatan ini perlu dibaca sebagai kemampuan yang mungkin terbentuk karena tuntutan hidup, pekerjaan, keluarga, atau lingkungan.`,
      bestUse: role.healthyUse,
      energyCost: "Jika menjadi tuntutan utama terus-menerus, area ini dapat membuat kamu terlihat mampu di luar, tetapi semangat dan energi kamu dapat cepat turun di dalam.",
      supportStrategy: "Gunakan sistem, pembagian peran, template, jadwal pemulihan, atau partner yang lebih natural di area ini agar tidak menjadi beban berkepanjangan.",
    }));
}

function buildAdaptiveGapInsights(answers: Answers, roles: MicroRoleScore[]): AdaptiveGapInsight[] {
  const specific = [
    buildMarketingGapInsight(answers, roles),
    buildAdministrativeGapInsight(answers, roles),
    buildServiceGapInsight(answers, roles),
  ].filter((item): item is AdaptiveGapInsight => Boolean(item));

  const existingIds = new Set(specific.map((item) => item.id));
  const generic = buildGenericAdaptiveInsights(roles).filter((item) => !existingIds.has(item.id));

  return [...specific, ...generic].slice(0, 5);
}

export function buildRoleFamilyScores(roles: MicroRoleScore[]): RoleFamilyScore[] {
  return ROLE_FAMILIES.map((family) => {
    const selected = roles.filter((role) => role.family === family);
    const natural = selected.length === 0 ? 0 : Math.round(selected.reduce((sum, role) => sum + role.natural, 0) / selected.length);
    const strength = selected.length === 0 ? 0 : Math.round(selected.reduce((sum, role) => sum + role.strength, 0) / selected.length);
    return { family, natural, strength, roleCount: selected.length };
  }).sort((a, b) => b.natural - a.natural);
}


function byNaturalStrengthAndConfidence(a: MicroRoleScore, b: MicroRoleScore): number {
  return b.natural + b.confidence * 0.08 - (a.natural + a.confidence * 0.08);
}

function byTrainedStrengthAndConfidence(a: MicroRoleScore, b: MicroRoleScore): number {
  return b.strength + b.confidence * 0.08 - (a.strength + a.confidence * 0.08);
}

function takeRolesWithFallback(
  roles: MicroRoleScore[],
  filter: (role: MicroRoleScore) => boolean,
  sorter: (a: MicroRoleScore, b: MicroRoleScore) => number,
  count: number,
): MicroRoleScore[] {
  const strong = roles.filter(filter).sort(sorter).slice(0, count);
  if (strong.length >= Math.min(3, count)) return strong;

  const existing = new Set(strong.map((role) => role.id));
  const fallback = roles
    .filter((role) => !existing.has(role.id))
    .sort(sorter)
    .slice(0, count - strong.length);
  return [...strong, ...fallback].slice(0, count);
}

export function buildPatternSignatureReport(answers: Answers, reports: ClusterReport[]): PatternSignatureReport {
  const roles = buildMicroRoleScores(answers);
  const topNaturalRoles = takeRolesWithFallback(
    roles,
    (role) => role.naturalItems > 0 && role.confidence >= 52,
    byNaturalStrengthAndConfidence,
    7,
  );
  const topTrainedRoles = takeRolesWithFallback(
    roles,
    (role) => role.strengthItems > 0 && role.confidence >= 50,
    byTrainedStrengthAndConfidence,
    7,
  );
  const adaptiveRoles = takeRolesWithFallback(
    roles,
    (role) => role.strength >= STR_HI && role.natural < NAT_HI && role.confidence >= 48,
    (a, b) => b.strength - b.natural + b.confidence * 0.06 - (a.strength - a.natural + a.confidence * 0.06),
    5,
  );
  const adaptiveGapInsights = buildAdaptiveGapInsights(answers, roles);
  const drainingRoles = takeRolesWithFallback(
    roles,
    (role) => role.naturalItems > 0 && role.confidence >= 48,
    (a, b) => a.natural + (100 - a.confidence) * 0.03 - (b.natural + (100 - b.confidence) * 0.03),
    5,
  );

  // Keep reports parameter in the signature for future bridge with cluster-level engine.
  void reports;

  return {
    core: pickCoreSignature(roles),
    microRoles: roles,
    topNaturalRoles,
    topTrainedRoles,
    adaptiveRoles,
    adaptiveGapInsights,
    drainingRoles,
    roleFamilies: buildRoleFamilyScores(roles),
  };
}
