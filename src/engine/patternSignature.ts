import type { Answers, ClusterReport, Zone } from "@/types/assessment";
import {
  MICRO_ROLE_DEFINITIONS,
  MICRO_ROLE_ITEM_MAP,
  ROLE_FAMILIES,
  type MicroRoleDefinition,
  type MicroRoleId,
  type RoleFamily,
} from "@/data/microRoles";

const SCORE_MIN = 1;
const SCORE_MAX = 7;
const NAT_HI = 62;
const STR_HI = 62;

export interface MicroRoleScore extends MicroRoleDefinition {
  natural: number;
  strength: number;
  naturalItems: number;
  strengthItems: number;
  zone: Zone;
}

export interface RoleFamilyScore {
  family: RoleFamily;
  natural: number;
  strength: number;
  roleCount: number;
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
    title: "Penerjemah Pengetahuan Strategis",
    subtitle: "Mengumpulkan bahan, membaca makna, lalu mengubahnya menjadi penjelasan yang bisa digunakan.",
    roleIds: ["information_collector", "fast_learner", "deep_thinker", "idea_translator", "strategy_designer"],
    visiblePattern:
      "Dari luar Anda dapat terlihat sebagai orang yang banyak tahu, mudah menjelaskan, dan mampu membantu orang lain melihat arah dari informasi yang sebelumnya terasa berserakan.",
    hiddenEnergy:
      "Energi terdalamnya bukan hanya berbicara atau tampil, tetapi memahami bahan yang kompleks, menemukan benang merah, lalu memberi bahasa yang lebih jelas.",
    riskIfMisplaced:
      "Jika terlalu lama ditempatkan hanya pada pekerjaan eksekusi berulang tanpa ruang belajar dan menyusun makna, Anda mungkin tetap bisa menjalankannya, tetapi rasa hidupnya menurun.",
    healthyUse:
      "Gunakan kekuatan ini dalam peran yang melibatkan belajar, menulis, mengajar, menyusun konsep, mempresentasikan ide, atau menjembatani informasi rumit menjadi keputusan.",
  },
  {
    title: "Pemecah Masalah Berbasis Pola",
    subtitle: "Membaca data, menemukan akar masalah, lalu menyusun jalan keluar yang lebih masuk akal.",
    roleIds: ["pattern_reader", "problem_restorer", "strategy_designer", "quality_evaluator", "risk_checker"],
    visiblePattern:
      "Dari luar Anda tampak sebagai orang yang tidak puas pada jawaban permukaan. Anda cenderung bertanya, memeriksa, dan mencari pola sebelum menerima kesimpulan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika ada masalah nyata yang dapat diurai, dibuktikan, dan diperbaiki sampai lebih jelas atau lebih aman.",
    riskIfMisplaced:
      "Jika lingkungan memaksa keputusan cepat tanpa data atau mengabaikan risiko, Anda bisa menjadi tegang, kritis, atau terasa sulit diyakinkan.",
    healthyUse:
      "Tempatkan kekuatan ini sebagai fungsi diagnosis, audit, evaluasi, perbaikan sistem, atau strategi berbasis bukti; sertakan batas waktu agar analisis tidak berubah menjadi penundaan.",
  },
  {
    title: "Penggerak Gagasan Kreatif",
    subtitle: "Mengolah ide menjadi bentuk, pesan, atau arah yang lebih menarik dan dapat menggerakkan orang.",
    roleIds: ["idea_synthesizer", "creative_designer", "idea_translator", "social_connector", "achievement_driver"],
    visiblePattern:
      "Dari luar Anda dapat terlihat sebagai pembawa ide, pembuat konsep, atau orang yang mampu membuat sesuatu terasa lebih menarik untuk diperhatikan.",
    hiddenEnergy:
      "Energi terdalamnya muncul saat Anda boleh menjelajah kemungkinan, merangkai banyak bahan, dan membuat orang lain melihat nilai baru dari sebuah gagasan.",
    riskIfMisplaced:
      "Jika terlalu cepat dibatasi oleh prosedur kaku atau pekerjaan repetitif, kreativitas bisa berubah menjadi gelisah, bosan, atau kehilangan dorongan.",
    healthyUse:
      "Gunakan pada fase eksplorasi, branding, konten, komunikasi, perancangan konsep, dan inovasi; lalu pasangkan dengan ritme eksekusi yang menjaga ide selesai.",
  },
  {
    title: "Penjaga Mutu dan Sistem",
    subtitle: "Menata proses, menjaga komitmen, dan memastikan hasil dapat dipercaya.",
    roleIds: ["commitment_keeper", "system_organizer", "quality_evaluator", "consistency_guardian", "operational_executor"],
    visiblePattern:
      "Dari luar Anda terlihat sebagai orang yang memperhatikan keteraturan, kualitas, tanggung jawab, dan standar kerja yang jelas.",
    hiddenEnergy:
      "Energi terdalam muncul ketika sistem rapi, tugas jelas, dan hasil dapat dipertanggungjawabkan tanpa banyak ketidakpastian.",
    riskIfMisplaced:
      "Jika terlalu sering berhadapan dengan perubahan mendadak, aturan yang tidak konsisten, atau pekerjaan tanpa standar, energi bisa cepat terkuras.",
    healthyUse:
      "Gunakan kekuatan ini untuk membuat prosedur, menjaga mutu, mengelola jadwal, dan merapikan proses; tetap beri ruang fleksibilitas agar sistem tidak terasa kaku.",
  },
  {
    title: "Pendamping Pertumbuhan Manusia",
    subtitle: "Membaca orang, menjaga relasi, dan membantu orang lain bertumbuh dengan lebih aman.",
    roleIds: ["people_developer", "mentor_coach", "emotion_reader", "relationship_keeper", "harmony_keeper"],
    visiblePattern:
      "Dari luar Anda terlihat peka, mudah menangkap kebutuhan orang, dan cenderung ingin membantu orang lain menjadi lebih baik.",
    hiddenEnergy:
      "Energi terdalam muncul ketika relasi terasa tulus dan kontribusi Anda membantu seseorang bertumbuh, merasa dipahami, atau menemukan arah.",
    riskIfMisplaced:
      "Jika terlalu banyak menyerap emosi atau memikul perkembangan orang lain sendirian, kekuatan ini dapat berubah menjadi kelelahan emosional.",
    healthyUse:
      "Gunakan untuk mendampingi, mengajar, membina, memberi feedback, atau membangun kultur yang aman; jaga batas agar tidak semua beban orang lain menjadi beban Anda.",
  },
  {
    title: "Pengarah Momentum dan Keputusan",
    subtitle: "Memberi arah, mengambil posisi, dan mendorong sesuatu bergerak dari wacana menjadi tindakan.",
    roleIds: ["decision_director", "action_mover", "achievement_driver", "strategy_designer", "complexity_arranger"],
    visiblePattern:
      "Dari luar Anda terlihat sebagai orang yang bisa memberi arah, mengambil keputusan, atau mendorong orang keluar dari kebuntuan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika ada tujuan jelas, momentum nyata, dan ruang untuk mengubah arah menjadi langkah.",
    riskIfMisplaced:
      "Jika tidak diberi ruang memengaruhi arah, Anda bisa merasa tertahan; namun jika terlalu cepat bergerak, orang lain bisa merasa tertinggal.",
    healthyUse:
      "Gunakan untuk memimpin keputusan, membuka jalan, mengatur prioritas, dan menjaga momentum; tetap kombinasikan dengan mendengar dan mengecek kesiapan pihak lain.",
  },
  {
    title: "Arsitek Relasi dan Keluarga",
    subtitle: "Membangun kedekatan, rasa aman, dan ruang kelompok yang membuat orang merasa diterima.",
    roleIds: ["relationship_keeper", "social_connector", "group_includer", "emotion_reader", "harmony_keeper"],
    visiblePattern:
      "Dari luar Anda tampak menjaga kedekatan, memperhatikan suasana, dan ingin orang-orang penting tetap merasa dilibatkan.",
    hiddenEnergy:
      "Energi terdalam muncul ketika relasi terasa aman, hangat, dan tidak sekadar transaksional.",
    riskIfMisplaced:
      "Jika relasi terasa dingin, sepihak, atau konflik dibiarkan menggantung, energi emosional Anda dapat cepat terkuras.",
    healthyUse:
      "Gunakan kekuatan ini untuk membangun komunikasi keluarga, merawat kedekatan, dan menjaga iklim kelompok; tetap bicarakan batas dan pembagian peran secara jelas.",
  },
  {
    title: "Perancang Arah Masa Depan",
    subtitle: "Membaca kemungkinan, menyusun visi, dan mengubah gambaran besar menjadi arah yang lebih konkret.",
    roleIds: ["future_mapper", "idea_synthesizer", "strategy_designer", "creative_designer", "meaning_keeper"],
    visiblePattern:
      "Dari luar Anda tampak sering membawa sudut pandang jangka panjang, kemungkinan baru, atau gambaran yang belum dilihat orang lain.",
    hiddenEnergy:
      "Energi terdalam muncul ketika Anda boleh membayangkan masa depan dan menyusun makna atau arah dari kemungkinan tersebut.",
    riskIfMisplaced:
      "Jika terlalu lama dikurung pada detail harian tanpa visi, Anda bisa merasa kehilangan arah atau makna.",
    healthyUse:
      "Gunakan untuk menyusun visi, roadmap, eksperimen pengembangan, dan arah keluarga/karier; turunkan visi menjadi langkah kecil agar tidak berhenti sebagai ide besar.",
  },
];

function isAnswerValue(value: unknown): value is 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  return typeof value === "number" && value >= SCORE_MIN && value <= SCORE_MAX;
}

function normalizeTo100(value: number): number {
  return Math.round(((value - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100);
}

function scoreFromIds(values: Record<string, number>, ids: string[]): { score: number; items: number } {
  const valid = ids.map((id) => values[id]).filter(isAnswerValue);
  if (valid.length === 0) return { score: 0, items: 0 };
  const mean = valid.reduce((sum, value) => sum + value, 0) / valid.length;
  return { score: normalizeTo100(mean), items: valid.length };
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
    summary: `Pola inti Anda tampak berada pada kombinasi ${primary.name}, ${secondary.name}, dan ${tertiary.name}. Artinya, hasil ini tidak hanya dibaca sebagai satu kekuatan tunggal, tetapi sebagai cara kerja yang muncul dari beberapa kecenderungan yang saling menguatkan.`,
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
    summary: `Pola inti yang terbaca adalah ${bestRule.rule.title.toLowerCase()}. Ini tidak berarti Anda hanya memiliki satu sisi, tetapi kombinasi beberapa kekuatan mikro yang saling menguatkan: ${evidence.map((role) => role.name).join(", ")}.`,
    visiblePattern: bestRule.rule.visiblePattern,
    hiddenEnergy: bestRule.rule.hiddenEnergy,
    riskIfMisplaced: bestRule.rule.riskIfMisplaced,
    healthyUse: bestRule.rule.healthyUse,
    evidence,
  };
}

export function buildMicroRoleScores(answers: Answers): MicroRoleScore[] {
  return MICRO_ROLE_ITEM_MAP.map((map) => {
    const definition = MICRO_ROLE_DEFINITIONS[map.id];
    const natural = scoreFromIds(answers.natural, map.naturalItemIds);
    const strength = scoreFromIds(answers.strength, map.strengthItemIds);
    return {
      ...definition,
      natural: natural.score,
      strength: strength.score,
      naturalItems: natural.items,
      strengthItems: strength.items,
      zone: classify(natural.score, strength.score),
    };
  });
}

export function buildRoleFamilyScores(roles: MicroRoleScore[]): RoleFamilyScore[] {
  return ROLE_FAMILIES.map((family) => {
    const selected = roles.filter((role) => role.family === family);
    const natural = selected.length === 0 ? 0 : Math.round(selected.reduce((sum, role) => sum + role.natural, 0) / selected.length);
    const strength = selected.length === 0 ? 0 : Math.round(selected.reduce((sum, role) => sum + role.strength, 0) / selected.length);
    return { family, natural, strength, roleCount: selected.length };
  }).sort((a, b) => b.natural - a.natural);
}

export function buildPatternSignatureReport(answers: Answers, reports: ClusterReport[]): PatternSignatureReport {
  const roles = buildMicroRoleScores(answers);
  const topNaturalRoles = [...roles]
    .filter((role) => role.naturalItems > 0)
    .sort((a, b) => b.natural - a.natural)
    .slice(0, 7);
  const topTrainedRoles = [...roles]
    .filter((role) => role.strengthItems > 0)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 7);
  const adaptiveRoles = [...roles]
    .filter((role) => role.strength >= STR_HI && role.natural < NAT_HI)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);
  const drainingRoles = [...roles]
    .filter((role) => role.naturalItems > 0)
    .sort((a, b) => a.natural - b.natural)
    .slice(0, 5);

  // Keep reports parameter in the signature for future bridge with cluster-level engine.
  void reports;

  return {
    core: pickCoreSignature(roles),
    microRoles: roles,
    topNaturalRoles,
    topTrainedRoles,
    adaptiveRoles,
    drainingRoles,
    roleFamilies: buildRoleFamilyScores(roles),
  };
}
