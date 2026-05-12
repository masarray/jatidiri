import type { MicroRoleId, RoleFamily } from "@/data/microRoles";
import type { MicroRoleScore } from "@/engine/patternSignature";

const MICRO_ROLE_LABELS: Record<MicroRoleId, string> = {
  information_collector: "Pengumpul Informasi",
  fast_learner: "Pembelajar Cepat",
  deep_thinker: "Pemikir Mendalam",
  idea_translator: "Penerjemah Ide",
  strategy_designer: "Perancang Strategi",
  idea_synthesizer: "Pengolah Ide",
  pattern_reader: "Pembaca Pola",
  problem_restorer: "Pemecah Masalah",
  people_developer: "Pengembang Orang",
  commitment_keeper: "Penjaga Komitmen",
  system_organizer: "Penata Sistem",
  action_mover: "Penggerak Tindakan",
  social_connector: "Penghubung Sosial",
  harmony_keeper: "Penjaga Harmoni",
  decision_director: "Pengarah Keputusan",
  quality_evaluator: "Penjaga Mutu",
  operational_executor: "Pelaksana Operasional",
  creative_designer: "Perancang Kreatif",
  achievement_driver: "Pengejar Capaian",
  meaning_keeper: "Penjaga Makna",
  consistency_guardian: "Penjaga Konsistensi",
  relationship_keeper: "Penjaga Relasi",
  emotion_reader: "Pembaca Emosi",
  group_includer: "Perangkul Kelompok",
  complexity_arranger: "Penata Kerumitan",
  mentor_coach: "Pembimbing Pengembang",
  risk_checker: "Penjaga Risiko",
  future_mapper: "Pembaca Arah Masa Depan",
};

const MICRO_ROLE_NAME_FALLBACK: Record<string, string> = {
  "Information Collector": "Pengumpul Informasi",
  "Fast Learner": "Pembelajar Cepat",
  "Deep Thinker": "Pemikir Mendalam",
  "Knowledge Translator": "Penerjemah Ide",
  "Strategic Designer": "Perancang Strategi",
  "Idea Synthesizer": "Pengolah Ide",
  "Pattern Analyst": "Pembaca Pola",
  "Problem Solver": "Pemecah Masalah",
  "People Developer": "Pengembang Orang",
  "Commitment Keeper": "Penjaga Komitmen",
  "System Organizer": "Penata Sistem",
  "Action Driver": "Penggerak Tindakan",
  "Social Connector": "Penghubung Sosial",
  "Harmony Builder": "Penjaga Harmoni",
  "Decision Driver": "Pengarah Keputusan",
  "Quality Evaluator": "Penjaga Mutu",
  "Operational Executor": "Pelaksana Operasional",
  "Creative Designer": "Perancang Kreatif",
  "Achievement Driver": "Pengejar Capaian",
  "Meaning Maker": "Penjaga Makna",
  "Consistency Guardian": "Penjaga Konsistensi",
  "Relationship Builder": "Penjaga Relasi",
  "Emotional Reader": "Pembaca Emosi",
  "Inclusion Builder": "Perangkul Kelompok",
  "Complexity Organizer": "Penata Kerumitan",
  "Mentor Coach": "Pembimbing Pengembang",
  "Risk Assessor": "Penjaga Risiko",
  "Future Mapper": "Pembaca Arah Masa Depan",
};

export const ROLE_FAMILY_LABELS: Record<RoleFamily | string, string> = {
  "Direction & Leadership": "Arah & Kepemimpinan",
  "Connection & Influence": "Koneksi & Pengaruh",
  "Human Support": "Dukungan Manusia",
  "Analytical Thinking": "Analisis & Pola",
  "Problem Reasoning": "Pemecahan Masalah",
  "Idea Generation": "Ide & Kreativitas",
  "System Management": "Sistem & Keteraturan",
  "Technical Execution": "Eksekusi Teknis",
};

export function displayMicroRoleName(role: Pick<MicroRoleScore, "id" | "name"> | MicroRoleId | string): string {
  if (typeof role === "string") {
    return MICRO_ROLE_LABELS[role as MicroRoleId] ?? MICRO_ROLE_NAME_FALLBACK[role] ?? role;
  }
  return MICRO_ROLE_LABELS[role.id as MicroRoleId] ?? MICRO_ROLE_NAME_FALLBACK[role.name] ?? role.name;
}

export function displayRoleFamilyName(family: RoleFamily | string): string {
  return ROLE_FAMILY_LABELS[family] ?? family;
}
