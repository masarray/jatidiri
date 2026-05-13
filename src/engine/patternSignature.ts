import type { Answers, ClusterReport, QuestionItem, SignalLane, Zone } from "@/types/assessment";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";
import { isAnswerRecord } from "@/engine/scoring";
import { resolveSignalDefinition } from "@/data/patternSignals";
import {
  MICRO_ROLE_DEFINITIONS,
  ROLE_FAMILIES,
  type MicroRoleDefinition,
  type MicroRoleId,
  type RoleFamily,
} from "@/data/microRoles";

const NAT_HI = 62;
const STR_HI = 62;

export type MicroRoleConfidenceLabel = "tinggi" | "sedang" | "indikasi awal";

export interface MicroRoleScore extends MicroRoleDefinition {
  natural: number;
  strength: number;
  naturalRaw: number;
  strengthRaw: number;
  naturalItems: number;
  strengthItems: number;
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

export interface SignalScore {
  id: string;
  label: string;
  lane: SignalLane;
  score: number;
  count: number;
}

export interface EvidenceLine {
  questionId: string;
  selectedOptionId: string;
  situation: string;
  selectedText: string;
  signals: string[];
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
  signalScores?: SignalScore[];
  evidenceLines?: EvidenceLine[];
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
    visiblePattern: "Dari luar kamu dapat terlihat sebagai orang yang banyak tahu, mudah menjelaskan, dan mampu membantu orang lain melihat arah dari informasi yang sebelumnya terasa berserakan.",
    hiddenEnergy: "Energi terdalamnya bukan hanya berbicara atau tampil, tetapi memahami bahan yang kompleks, menemukan benang merah, lalu memberi bahasa yang lebih jelas.",
    riskIfMisplaced: "Jika terlalu lama ditempatkan hanya pada pekerjaan eksekusi berulang tanpa ruang belajar dan menyusun makna, kamu mungkin tetap bisa menjalankannya, tetapi energi kamu cepat turun.",
    healthyUse: "Gunakan kekuatan ini dalam peran yang melibatkan belajar, menulis, mengajar, menyusun konsep, mempresentasikan ide, atau menjembatani informasi rumit menjadi keputusan.",
  },
  {
    title: "Pattern-Based Problem Solver",
    subtitle: "Membaca data, menemukan akar masalah, lalu menyusun jalan keluar yang lebih masuk akal.",
    roleIds: ["pattern_reader", "problem_restorer", "strategy_designer", "quality_evaluator", "risk_checker"],
    visiblePattern: "Dari luar kamu tampak sebagai orang yang tidak puas pada jawaban permukaan. kamu cenderung bertanya, memeriksa, dan mencari pola sebelum menerima kesimpulan.",
    hiddenEnergy: "Energi terdalam muncul ketika ada masalah nyata yang dapat diurai, dibuktikan, dan diperbaiki sampai lebih jelas atau lebih aman.",
    riskIfMisplaced: "Jika lingkungan memaksa keputusan cepat tanpa data atau mengabaikan risiko, kamu bisa menjadi tegang, kritis, atau terasa sulit diyakinkan.",
    healthyUse: "Tempatkan kekuatan ini sebagai fungsi diagnosis, audit, evaluasi, perbaikan sistem, atau strategi berbasis bukti; sertakan batas waktu agar analisis tidak berubah menjadi penundaan.",
  },
  {
    title: "Creative Idea Driver",
    subtitle: "Mengolah ide menjadi bentuk, pesan, atau arah yang lebih menarik dan dapat menggerakkan orang.",
    roleIds: ["idea_synthesizer", "creative_designer", "idea_translator", "social_connector", "achievement_driver"],
    visiblePattern: "Dari luar kamu dapat terlihat sebagai pembawa ide, pembuat konsep, atau orang yang mampu membuat sesuatu terasa lebih menarik untuk diperhatikan.",
    hiddenEnergy: "Energi terdalamnya muncul saat kamu boleh menjelajah kemungkinan, merangkai banyak bahan, dan membuat orang lain melihat nilai baru dari sebuah gagasan.",
    riskIfMisplaced: "Jika terlalu cepat dibatasi oleh prosedur kaku atau pekerjaan repetitif, kreativitas bisa berubah menjadi gelisah, bosan, atau kehilangan dorongan.",
    healthyUse: "Gunakan pada fase eksplorasi, branding, konten, komunikasi, perancangan konsep, dan inovasi; lalu pasangkan dengan ritme eksekusi yang menjaga ide selesai.",
  },
  {
    title: "Quality & System Guardian",
    subtitle: "Menata proses, menjaga komitmen, dan memastikan hasil dapat dipercaya.",
    roleIds: ["commitment_keeper", "system_organizer", "quality_evaluator", "consistency_guardian", "operational_executor"],
    visiblePattern: "Dari luar kamu terlihat sebagai orang yang memperhatikan keteraturan, kualitas, tanggung jawab, dan standar kerja yang jelas.",
    hiddenEnergy: "Energi terdalam muncul ketika sistem rapi, tugas jelas, dan hasil dapat dipertanggungjawabkan tanpa banyak ketidakpastian.",
    riskIfMisplaced: "Jika terlalu sering berhadapan dengan perubahan mendadak, aturan yang tidak konsisten, atau pekerjaan tanpa standar, semangat dan energi kamu dapat cepat turun.",
    healthyUse: "Gunakan kekuatan ini untuk membuat prosedur, menjaga mutu, mengelola jadwal, dan merapikan proses; tetap beri ruang fleksibilitas agar sistem tidak terasa kaku.",
  },
  {
    title: "Human Growth Partner",
    subtitle: "Membaca orang, menjaga relasi, dan membantu orang lain bertumbuh dengan lebih aman.",
    roleIds: ["people_developer", "mentor_coach", "emotion_reader", "relationship_keeper", "harmony_keeper"],
    visiblePattern: "Dari luar kamu terlihat peka, mudah menangkap kebutuhan orang, dan cenderung ingin membantu orang lain menjadi lebih baik.",
    hiddenEnergy: "Energi terdalam muncul ketika relasi terasa tulus dan kontribusi kamu membantu seseorang bertumbuh, merasa dipahami, atau menemukan arah.",
    riskIfMisplaced: "Jika terlalu banyak menyerap emosi atau memikul perkembangan orang lain sendirian, kekuatan ini dapat berubah menjadi kelelahan emosional.",
    healthyUse: "Gunakan untuk mendampingi, mengajar, membina, memberi feedback, atau membangun kultur yang aman; jaga batas agar tidak semua beban orang lain menjadi beban kamu.",
  },
  {
    title: "Momentum & Decision Driver",
    subtitle: "Memberi arah, mengambil posisi, dan mendorong sesuatu bergerak dari wacana menjadi tindakan.",
    roleIds: ["decision_director", "action_mover", "achievement_driver", "strategy_designer", "complexity_arranger"],
    visiblePattern: "Dari luar kamu terlihat sebagai orang yang bisa memberi arah, mengambil keputusan, atau mendorong orang keluar dari kebuntuan.",
    hiddenEnergy: "Energi terdalam muncul ketika ada tujuan jelas, momentum nyata, dan ruang untuk mengubah arah menjadi langkah.",
    riskIfMisplaced: "Jika tidak diberi ruang memengaruhi arah, kamu bisa merasa tertahan; namun jika terlalu cepat bergerak, orang lain bisa merasa tertinggal.",
    healthyUse: "Gunakan untuk memimpin keputusan, membuka jalan, mengatur prioritas, dan menjaga momentum; tetap kombinasikan dengan mendengar dan mengecek kesiapan pihak lain.",
  },
  {
    title: "Relationship & Family Architect",
    subtitle: "Membangun kedekatan, rasa aman, dan ruang kelompok yang membuat orang merasa diterima.",
    roleIds: ["relationship_keeper", "social_connector", "group_includer", "emotion_reader", "harmony_keeper"],
    visiblePattern: "Dari luar kamu tampak menjaga kedekatan, memperhatikan suasana, dan ingin orang-orang penting tetap merasa dilibatkan.",
    hiddenEnergy: "Energi terdalam muncul ketika relasi terasa aman, hangat, dan tidak sekadar transaksional.",
    riskIfMisplaced: "Jika relasi terasa dingin, sepihak, atau konflik dibiarkan menggantung, semangat dan energi emosional kamu dapat cepat turun.",
    healthyUse: "Gunakan kekuatan ini untuk membangun komunikasi keluarga, merawat kedekatan, dan menjaga iklim kelompok; tetap bicarakan batas dan pembagian peran secara jelas.",
  },
  {
    title: "Future Direction Designer",
    subtitle: "Membaca kemungkinan, menyusun visi, dan mengubah gambaran besar menjadi arah yang lebih konkret.",
    roleIds: ["future_mapper", "idea_synthesizer", "strategy_designer", "creative_designer", "meaning_keeper"],
    visiblePattern: "Dari luar kamu tampak sering membawa sudut pandang jangka panjang, kemungkinan baru, atau gambaran yang belum dilihat orang lain.",
    hiddenEnergy: "Energi terdalam muncul ketika kamu boleh membayangkan masa depan dan menyusun makna atau arah dari kemungkinan tersebut.",
    riskIfMisplaced: "Jika terlalu lama dikurung pada detail harian tanpa visi, kamu bisa merasa kehilangan arah atau makna.",
    healthyUse: "Gunakan untuk menyusun visi, roadmap, eksperimen pengembangan, dan arah keluarga/karier; turunkan visi menjadi langkah kecil agar tidak berhenti sebagai ide besar.",
  },
];

const ALL_QUESTIONS: QuestionItem[] = [...naturalQuestions, ...strengthQuestions];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function classify(natural: number, strength: number): Zone {
  const natHi = natural >= NAT_HI;
  const strHi = strength >= STR_HI;
  if (natHi && strHi) return "Natural & Explored";
  if (natHi && !strHi) return "Natural but Dormant";
  if (!natHi && strHi) return "Adaptive / Survival";
  return "Weak / Draining";
}

function confidenceLabel(value: number): MicroRoleConfidenceLabel {
  if (value >= 72) return "tinggi";
  if (value >= 50) return "sedang";
  return "indikasi awal";
}

function roleFromSignal(id: string): MicroRoleId | undefined {
  const definition = resolveSignalDefinition(id);
  if (definition?.microRoleId) return definition.microRoleId;
  if (id in MICRO_ROLE_DEFINITIONS) return id as MicroRoleId;
  return undefined;
}

function selectedOption(question: QuestionItem, answers: Answers) {
  const answer = answers[question.session][question.id];
  if (!isAnswerRecord(answer) || question.format !== "action_cards" || answer.format !== "action_cards") return null;
  return question.options.find((option) => option.id === answer.optionId) ?? null;
}

function normalizeRoleScores(values: Record<MicroRoleId, { natural: number; strength: number; overuse: number; drain: number; adaptive: number; naturalItems: number; strengthItems: number }>) {
  const maxNatural = Math.max(0.01, ...Object.values(values).map((v) => v.natural + v.overuse * 0.22 + v.drain * 0.12));
  const maxStrength = Math.max(0.01, ...Object.values(values).map((v) => v.strength));

  return Object.entries(MICRO_ROLE_DEFINITIONS).map(([id, definition]) => {
    const roleId = id as MicroRoleId;
    const value = values[roleId] ?? { natural: 0, strength: 0, overuse: 0, drain: 0, adaptive: 0, naturalItems: 0, strengthItems: 0 };
    const naturalRaw = value.natural <= 0 ? 0 : Math.round((value.natural / maxNatural) * 100);
    const strengthRaw = value.strength <= 0 ? 0 : Math.round((value.strength / maxStrength) * 100);
    const natural = value.natural <= 0 ? 0 : Math.round(clampScore(30 + naturalRaw * 0.65));
    const strength = value.strength <= 0 ? 0 : Math.round(clampScore(30 + strengthRaw * 0.65));
    const evidenceItems = value.naturalItems + value.strengthItems;
    const confidence = Math.round(clampScore(24 + Math.min(evidenceItems, 5) * 12 + Math.max(natural, strength) * 0.18));
    return {
      ...definition,
      natural,
      strength,
      naturalRaw,
      strengthRaw,
      naturalItems: value.naturalItems,
      strengthItems: value.strengthItems,
      confidence,
      confidenceLabel: confidenceLabel(confidence),
      zone: classify(natural, strength),
    } satisfies MicroRoleScore;
  });
}

function buildSignalScores(signalTotals: Record<string, Record<SignalLane, { score: number; count: number }>>): SignalScore[] {
  const rows: SignalScore[] = [];
  for (const [id, lanes] of Object.entries(signalTotals)) {
    const definition = resolveSignalDefinition(id);
    for (const [lane, bucket] of Object.entries(lanes) as Array<[SignalLane, { score: number; count: number }]>) {
      if (bucket.score <= 0) continue;
      rows.push({ id, label: definition?.label ?? id, lane, score: Math.round(bucket.score * 10) / 10, count: bucket.count });
    }
  }
  return rows.sort((a, b) => b.score - a.score);
}

export function buildMicroRoleScores(answers: Answers): MicroRoleScore[] {
  const report = accumulateActionSignals(answers);
  return normalizeRoleScores(report.roles);
}

function accumulateActionSignals(answers: Answers) {
  const roles = {} as Record<MicroRoleId, { natural: number; strength: number; overuse: number; drain: number; adaptive: number; naturalItems: number; strengthItems: number }>;
  const signalTotals: Record<string, Record<SignalLane, { score: number; count: number }>> = {};
  const evidenceLines: EvidenceLine[] = [];

  for (const question of ALL_QUESTIONS) {
    const option = selectedOption(question, answers);
    if (!option) continue;
    const signals = option.signals.map((signal) => signal.id);
    evidenceLines.push({ questionId: question.id, selectedOptionId: option.id, situation: question.format === "action_cards" ? question.situation : question.text, selectedText: option.text, signals });

    for (const signal of option.signals) {
      const definition = resolveSignalDefinition(signal.id);
      const roleId = roleFromSignal(signal.id);
      const lane = signal.lane ?? definition?.defaultLane ?? "natural";
      const weight = signal.weight ?? definition?.defaultWeight ?? 1;

      signalTotals[signal.id] ??= {} as Record<SignalLane, { score: number; count: number }>;
      signalTotals[signal.id][lane] ??= { score: 0, count: 0 };
      signalTotals[signal.id][lane].score += weight;
      signalTotals[signal.id][lane].count += 1;

      if (!roleId) continue;
      roles[roleId] ??= { natural: 0, strength: 0, overuse: 0, drain: 0, adaptive: 0, naturalItems: 0, strengthItems: 0 };
      if (lane === "natural" || lane === "strength" || lane === "overuse" || lane === "drain" || lane === "adaptive") roles[roleId][lane] += weight;
      if (lane === "natural") roles[roleId].naturalItems += 1;
      if (lane === "strength") roles[roleId].strengthItems += 1;
      if (lane === "overuse") roles[roleId].natural += weight * 0.2;
      if (lane === "drain") roles[roleId].natural += weight * 0.12;
      if (lane === "adaptive") roles[roleId].natural += weight * 0.28;
    }
  }

  return { roles, signalScores: buildSignalScores(signalTotals), evidenceLines };
}

function roleById(id: MicroRoleId, roles: MicroRoleScore[]): MicroRoleScore | undefined {
  return roles.find((role) => role.id === id);
}

function mean(values: number[]): number {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
}

function averageRoleNatural(roles: MicroRoleScore[], ids: MicroRoleId[]): number {
  return mean(ids.map((id) => roleById(id, roles)?.natural ?? 0));
}

function overlapScore(roleIds: MicroRoleId[], topRoles: MicroRoleScore[]): number {
  const topIds = new Set(topRoles.slice(0, 7).map((role) => role.id));
  return roleIds.filter((id) => topIds.has(id)).length * 4;
}

function buildFallbackSignature(topRoles: MicroRoleScore[]): CoreSignature {
  const primary = topRoles[0] ?? Object.values(MICRO_ROLE_DEFINITIONS)[0];
  const secondary = topRoles[1] ?? topRoles[0] ?? primary;
  const tertiary = topRoles[2] ?? secondary;
  return {
    title: `${primary.name}${secondary.id !== primary.id ? ` dengan ${secondary.name}` : ""}`,
    subtitle: `Kombinasi utama yang terbaca dari ${primary.name}, ${secondary.name}, dan ${tertiary.name}.`,
    summary: `Pola inti kamu tampak berada pada kombinasi ${primary.name}, ${secondary.name}, dan ${tertiary.name}. Hasil ini dibaca dari respons pilihan aksi, bukan dari skor setuju/tidak setuju.`,
    visiblePattern: primary.visible,
    hiddenEnergy: `Energi terdalam terutama muncul ketika ${primary.energy.toLowerCase()}`,
    riskIfMisplaced: primary.risk,
    healthyUse: primary.healthyUse,
    evidence: topRoles.slice(0, 5),
  };
}

function pickCoreSignature(roles: MicroRoleScore[]): CoreSignature {
  const topRoles = [...roles].sort((a, b) => b.natural - a.natural).slice(0, 8);
  const bestRule = SIGNATURE_RULES.map((rule) => ({ rule, score: averageRoleNatural(roles, rule.roleIds) + overlapScore(rule.roleIds, topRoles) })).sort((a, b) => b.score - a.score)[0];
  if (!bestRule || bestRule.score < 42) return buildFallbackSignature(topRoles);

  const evidence = bestRule.rule.roleIds
    .map((id) => roleById(id, roles))
    .filter((role): role is MicroRoleScore => Boolean(role))
    .sort((a, b) => b.natural - a.natural)
    .slice(0, 5);

  return {
    title: bestRule.rule.title,
    subtitle: bestRule.rule.subtitle,
    summary: `Pola inti yang terbaca adalah ${bestRule.rule.title.toLowerCase()}. Ini tidak berarti kamu hanya memiliki satu sisi, tetapi kombinasi beberapa pilihan aksi menunjukkan kecenderungan: ${evidence.map((role) => role.name).join(", ")}.`,
    visiblePattern: bestRule.rule.visiblePattern,
    hiddenEnergy: bestRule.rule.hiddenEnergy,
    riskIfMisplaced: bestRule.rule.riskIfMisplaced,
    healthyUse: bestRule.rule.healthyUse,
    evidence,
  };
}

function buildRoleFamilyScores(roles: MicroRoleScore[]): RoleFamilyScore[] {
  return ROLE_FAMILIES.map((family) => {
    const selected = roles.filter((role) => role.family === family);
    return { family, natural: mean(selected.map((role) => role.natural)), strength: mean(selected.map((role) => role.strength)), roleCount: selected.length };
  }).sort((a, b) => b.natural - a.natural);
}

function buildAdaptiveGapInsights(roles: MicroRoleScore[]): AdaptiveGapInsight[] {
  return roles
    .filter((role) => role.zone === "Adaptive / Survival")
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2)
    .map((role) => ({
      id: `adaptive_${role.id}`,
      kind: "generic" as const,
      title: `${role.name} sebagai mode adaptif`,
      score: role.strength,
      naturalRouteScore: role.natural,
      adaptiveLoadScore: role.strength,
      routeLabel: `Terlihat kuat saat dibutuhkan: ${role.name}`,
      notRouteLabel: "Belum tentu menjadi zona kekuatan alami utama",
      interpretation: `Kamu tampak bisa menjalankan pola ${role.name}, tetapi skor naturalnya tidak setinggi kekuatan aktivitasnya. Ini bisa berarti kemampuan tersebut muncul karena tuntutan situasi, tanggung jawab, atau kebiasaan adaptif.`,
      bestUse: role.healthyUse,
      energyCost: role.risk,
      supportStrategy: "Gunakan dengan batas, ritme recovery, dan jangan jadikan satu-satunya peran utama jika terasa menguras.",
    }));
}

export function buildPatternSignatureReport(answers: Answers, _reports: ClusterReport[]): PatternSignatureReport {
  const accumulated = accumulateActionSignals(answers);
  const microRoles = normalizeRoleScores(accumulated.roles);
  const topNaturalRoles = [...microRoles].sort((a, b) => b.natural - a.natural).slice(0, 8);
  const topTrainedRoles = [...microRoles].sort((a, b) => b.strength - a.strength).slice(0, 8);
  const adaptiveRoles = microRoles.filter((role) => role.zone === "Adaptive / Survival").sort((a, b) => b.strength - a.strength).slice(0, 6);
  const drainingRoles = microRoles
    .filter((role) => role.natural < 52 && role.strength < 52)
    .sort((a, b) => a.natural + a.strength - (b.natural + b.strength))
    .slice(0, 6);

  return {
    core: pickCoreSignature(microRoles),
    microRoles,
    topNaturalRoles,
    topTrainedRoles,
    adaptiveRoles,
    adaptiveGapInsights: buildAdaptiveGapInsights(microRoles),
    drainingRoles,
    roleFamilies: buildRoleFamilyScores(microRoles),
    signalScores: accumulated.signalScores,
    evidenceLines: accumulated.evidenceLines,
  };
}
