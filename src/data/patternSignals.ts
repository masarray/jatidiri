import type { Cluster, SignalLane } from "@/types/assessment";
import type { MicroRoleId, RoleFamily } from "@/data/microRoles";
import { MICRO_ROLE_DEFINITIONS } from "@/data/microRoles";

export type SignalKind = "microRole" | "drive" | "overuse" | "drain" | "adaptive" | "strengthProof" | "quality";

export interface PatternSignalDefinition {
  id: string;
  label: string;
  kind: SignalKind;
  cluster?: Cluster;
  family?: RoleFamily;
  microRoleId?: MicroRoleId;
  defaultLane: SignalLane;
  defaultWeight: number;
}

function roleSignal(id: MicroRoleId, label?: string): PatternSignalDefinition {
  const role = MICRO_ROLE_DEFINITIONS[id];
  return {
    id,
    label: label ?? role.name,
    kind: "microRole",
    microRoleId: id,
    cluster: role.cluster,
    family: role.family,
    defaultLane: "natural",
    defaultWeight: 1,
  };
}

const ROLE_SIGNALS = Object.keys(MICRO_ROLE_DEFINITIONS).map((id) => roleSignal(id as MicroRoleId));

const EXTRA_SIGNALS: PatternSignalDefinition[] = [
  { id: "controlled_curiosity", label: "Rasa ingin tahu yang terkendali", kind: "adaptive", microRoleId: "fast_learner", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "novelty_pull", label: "Tarikan kuat pada hal baru", kind: "drive", microRoleId: "fast_learner", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "priority_leak", label: "Prioritas mudah bocor", kind: "overuse", microRoleId: "fast_learner", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "overuse", defaultWeight: 1 },
  { id: "unfinished_risk", label: "Risiko tidak selesai", kind: "overuse", microRoleId: "commitment_keeper", cluster: "Operating", family: "System Management", defaultLane: "overuse", defaultWeight: 0.9 },
  { id: "innovation_drive", label: "Dorongan inovasi", kind: "drive", microRoleId: "idea_synthesizer", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 1 },
  { id: "practical_executor", label: "Eksekusi praktis", kind: "microRole", microRoleId: "operational_executor", cluster: "Operating", family: "Technical Execution", defaultLane: "natural", defaultWeight: 1 },
  { id: "experimenter", label: "Mencoba kecil untuk belajar", kind: "drive", microRoleId: "action_mover", cluster: "Operating", family: "Technical Execution", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "meaning_seeker", label: "Mencari makna", kind: "microRole", microRoleId: "meaning_keeper", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 1 },
  { id: "purpose_drain", label: "Lelah saat tidak bermakna", kind: "drain", microRoleId: "meaning_keeper", cluster: "Creating", family: "Idea Generation", defaultLane: "drain", defaultWeight: 1 },
  { id: "clarity_guardian", label: "Menjaga kejelasan", kind: "drive", microRoleId: "pattern_reader", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "process_guardian", label: "Menjaga proses", kind: "drive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "archive_overload", label: "Arsip berlebihan", kind: "overuse", microRoleId: "information_collector", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "overuse", defaultWeight: 0.9 },
  { id: "balanced_improver", label: "Perbaikan seimbang", kind: "adaptive", microRoleId: "quality_evaluator", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "adaptive", defaultWeight: 0.7 },
  { id: "perfection_delay", label: "Terlalu lama menyempurnakan", kind: "overuse", microRoleId: "quality_evaluator", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "overuse", defaultWeight: 1 },
  { id: "routine_drain", label: "Lelah karena rutinitas", kind: "drain", microRoleId: "fast_learner", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "drain", defaultWeight: 1 },
  { id: "resource_keeper", label: "Penyimpan sumber daya", kind: "drive", microRoleId: "information_collector", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "natural", defaultWeight: 1 },
  { id: "preparedness_keeper", label: "Penjaga kesiapan", kind: "drive", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.95 },
  { id: "too_much_saving", label: "Terlalu banyak menyimpan", kind: "overuse", microRoleId: "information_collector", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "overuse", defaultWeight: 1 },
  { id: "declutterer", label: "Pelepas barang / penyederhana ruang", kind: "drive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "space_simplifier", label: "Penyederhana ruang", kind: "drive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "memory_keeper", label: "Penjaga kenangan", kind: "drive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "sentimental_connector", label: "Terhubung lewat kenangan", kind: "drive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "order_restorer", label: "Pemulih keteraturan", kind: "drive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 1 },
  { id: "visual_clarity_seeker", label: "Mencari kejernihan visual", kind: "drive", microRoleId: "quality_evaluator", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "order_dependency", label: "Sulit fokus sebelum rapi", kind: "overuse", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "overuse", defaultWeight: 1 },
  { id: "threat_scanner", label: "Cepat membaca potensi masalah", kind: "drive", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 1 },
  { id: "contingency_planner", label: "Menyusun cadangan", kind: "drive", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "worry_loop", label: "Putaran khawatir", kind: "overuse", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "overuse", defaultWeight: 1 },
  { id: "uncertainty_drain", label: "Lelah karena ketidakpastian", kind: "drain", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "drain", defaultWeight: 1 },
  { id: "fairness_guardian", label: "Penjaga keadilan", kind: "drive", microRoleId: "harmony_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "ethics_guardian", label: "Penjaga nilai benar", kind: "drive", microRoleId: "commitment_keeper", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "social_spark", label: "Penghidup suasana", kind: "drive", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 1 },
  { id: "warm_connector", label: "Penyapa hangat", kind: "drive", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.95 },
  { id: "mood_lifter", label: "Penaik suasana", kind: "drive", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 1 },
  { id: "social_adaptive", label: "Sosial adaptif", kind: "adaptive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "quiet_presence", label: "Kehadiran tenang", kind: "drive", microRoleId: "deep_thinker", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "natural", defaultWeight: 0.65 },
  { id: "group_energizer", label: "Penggerak kelompok", kind: "drive", microRoleId: "group_includer", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "persuader", label: "Meyakinkan orang", kind: "drive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "prototype_builder", label: "Membuat contoh nyata", kind: "drive", microRoleId: "creative_designer", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "decision_mover", label: "Mendorong keputusan", kind: "drive", microRoleId: "decision_director", cluster: "Striving", family: "Direction & Leadership", defaultLane: "natural", defaultWeight: 1 },
  { id: "caregiver", label: "Penolong yang peduli", kind: "drive", microRoleId: "people_developer", cluster: "Supporting", family: "Human Support", defaultLane: "natural", defaultWeight: 0.95 },
  { id: "sensitive_observer", label: "Pengamat peka", kind: "drive", microRoleId: "emotion_reader", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "respectful_distance", label: "Memberi ruang", kind: "adaptive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.6 },
  { id: "helper", label: "Penolong praktis", kind: "drive", microRoleId: "people_developer", cluster: "Supporting", family: "Human Support", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "practical_supporter", label: "Dukungan nyata", kind: "drive", microRoleId: "people_developer", cluster: "Supporting", family: "Human Support", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "mentor", label: "Mentor", kind: "microRole", microRoleId: "mentor_coach", cluster: "Supporting", family: "Human Support", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "mediator", label: "Penengah", kind: "drive", microRoleId: "harmony_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.95 },
  { id: "perspective_taker", label: "Melihat dari berbagai pihak", kind: "drive", microRoleId: "harmony_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "relationship_overchecking", label: "Terlalu memikirkan perubahan relasi", kind: "overuse", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "overuse", defaultWeight: 1 },
  { id: "autonomy_seeker", label: "Mencari ruang mandiri", kind: "drive", microRoleId: "strategy_designer", cluster: "Striving", family: "Direction & Leadership", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "boundary_keeper", label: "Menjaga batas", kind: "drive", microRoleId: "commitment_keeper", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "self_neglect_risk", label: "Risiko mengabaikan diri", kind: "overuse", microRoleId: "people_developer", cluster: "Supporting", family: "Human Support", defaultLane: "overuse", defaultWeight: 1 },
  { id: "impact_seeker", label: "Mencari dampak", kind: "drive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "recognition_responsive", label: "Menyala oleh apresiasi", kind: "drive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.65 },
  { id: "quiet_contributor", label: "Kontributor tenang", kind: "drive", microRoleId: "deep_thinker", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "natural", defaultWeight: 0.65 },
  { id: "authenticity_keeper", label: "Menjaga keaslian diri", kind: "drive", microRoleId: "meaning_keeper", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "hands_on_builder", label: "Pembuat langsung", kind: "drive", microRoleId: "operational_executor", cluster: "Operating", family: "Technical Execution", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "practical_fixer", label: "Memperbaiki langsung", kind: "drive", microRoleId: "problem_restorer", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "workaround_builder", label: "Membuat jalan sementara", kind: "drive", microRoleId: "complexity_arranger", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "aesthetic_stylist", label: "Peka estetika", kind: "drive", microRoleId: "creative_designer", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "visual_detail_checker", label: "Pemeriksa detail visual", kind: "drive", microRoleId: "quality_evaluator", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "kinesthetic_mover", label: "Butuh bergerak/mencoba", kind: "drive", microRoleId: "action_mover", cluster: "Operating", family: "Technical Execution", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "adaptable_improviser", label: "Improviser adaptif", kind: "drive", microRoleId: "complexity_arranger", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "sudden_change_drain", label: "Lelah karena perubahan mendadak", kind: "drain", microRoleId: "consistency_guardian", cluster: "Operating", family: "System Management", defaultLane: "drain", defaultWeight: 1 },
  { id: "calm_holder", label: "Penjaga tenang", kind: "drive", microRoleId: "harmony_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "crisis_coordinator", label: "Koordinator saat krisis", kind: "drive", microRoleId: "complexity_arranger", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "balanced_helper", label: "Menolong dengan batas", kind: "adaptive", microRoleId: "people_developer", cluster: "Supporting", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.75 },
  { id: "social_responsibility_burden", label: "Merasa harus menjaga suasana", kind: "overuse", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "overuse", defaultWeight: 1 },
  { id: "over_responsibility_for_mood", label: "Terlalu bertanggung jawab atas mood kelompok", kind: "overuse", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "overuse", defaultWeight: 1 },
  { id: "analysis_delay", label: "Analisis membuat lambat bergerak", kind: "overuse", microRoleId: "pattern_reader", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "overuse", defaultWeight: 1 },
  { id: "hesitation_risk", label: "Risiko ragu terlalu lama", kind: "overuse", microRoleId: "risk_checker", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "overuse", defaultWeight: 0.9 },
  { id: "collaboration_drain", label: "Lelah terlalu banyak kompromi", kind: "drain", microRoleId: "strategy_designer", cluster: "Striving", family: "Direction & Leadership", defaultLane: "drain", defaultWeight: 0.85 },

  { id: "structure_need", label: "Butuh struktur agar kuat selesai", kind: "adaptive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "timing_reader", label: "Membaca waktu yang tepat", kind: "adaptive", microRoleId: "strategy_designer", cluster: "Striving", family: "Direction & Leadership", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "strategic_patience", label: "Sabar menunggu momentum", kind: "adaptive", microRoleId: "strategy_designer", cluster: "Striving", family: "Direction & Leadership", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "strategic_marketer", label: "Marketing berbasis nilai", kind: "drive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.95 },
  { id: "value_framer", label: "Membingkai manfaat", kind: "drive", microRoleId: "idea_translator", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "persuasion_skill", label: "Kemampuan persuasi", kind: "drive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "strength", defaultWeight: 0.85 },
  { id: "adaptive_influencer", label: "Influencer adaptif", kind: "adaptive", microRoleId: "achievement_driver", cluster: "Influencing", family: "Connection & Influence", defaultLane: "adaptive", defaultWeight: 0.9 },
  { id: "purposeful_communicator", label: "Komunikatif saat ada tujuan", kind: "drive", microRoleId: "idea_translator", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.85 },
  { id: "topic_structurer", label: "Mengarahkan obrolan ke topik jelas", kind: "drive", microRoleId: "idea_translator", cluster: "Influencing", family: "Connection & Influence", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "content_seller", label: "Menjual lewat materi atau konten", kind: "strengthProof", microRoleId: "idea_translator", cluster: "Influencing", family: "Connection & Influence", defaultLane: "strength", defaultWeight: 0.85 },
  { id: "proof_builder", label: "Membangun bukti nyata", kind: "drive", microRoleId: "creative_designer", cluster: "Creating", family: "Idea Generation", defaultLane: "natural", defaultWeight: 0.8 },
  { id: "credibility_builder", label: "Membangun kepercayaan dengan bukti", kind: "drive", microRoleId: "pattern_reader", cluster: "Analyzing", family: "Problem Reasoning", defaultLane: "natural", defaultWeight: 0.8 },
  { id: "credibility_based_marketing", label: "Marketing berbasis bukti", kind: "strengthProof", microRoleId: "pattern_reader", cluster: "Influencing", family: "Connection & Influence", defaultLane: "strength", defaultWeight: 0.85 },
  { id: "small_talk_drain", label: "Lelah oleh basa-basi", kind: "drain", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "drain", defaultWeight: 1 },
  { id: "social_energy_drain", label: "Energi terkuras oleh interaksi sosial", kind: "drain", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "drain", defaultWeight: 1 },
  { id: "conversation_maintenance_burden", label: "Lelah menjaga obrolan tetap hidup", kind: "drain", microRoleId: "social_connector", cluster: "Influencing", family: "Connection & Influence", defaultLane: "drain", defaultWeight: 1 },
  { id: "deep_connection_preference", label: "Lebih nyaman koneksi mendalam", kind: "drive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "natural", defaultWeight: 0.75 },
  { id: "low_social_responsibility", label: "Tidak merasa wajib menghidupkan suasana", kind: "quality", microRoleId: "deep_thinker", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "quality", defaultWeight: 0.25 },
  { id: "approval_pressure", label: "Tidak enak mengecewakan orang", kind: "overuse", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "overuse", defaultWeight: 0.9 },
  { id: "self_regulation", label: "Mengatur pikiran agar lebih tenang", kind: "adaptive", microRoleId: "consistency_guardian", cluster: "Operating", family: "System Management", defaultLane: "adaptive", defaultWeight: 0.6 },
  { id: "relationship_checker", label: "Mencari kepastian lewat orang lain", kind: "adaptive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.55 },
  { id: "admin_drain", label: "Lelah oleh administrasi yang tidak terasa berguna", kind: "drain", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "drain", defaultWeight: 0.85 },
  { id: "strength_proof", label: "Bukti kemampuan nyata", kind: "strengthProof", cluster: "Operating", defaultLane: "strength", defaultWeight: 1 },

  { id: "priority_keeper", label: "Menjaga prioritas", kind: "drive", microRoleId: "commitment_keeper", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "finisher", label: "Penyelesai", kind: "drive", microRoleId: "commitment_keeper", cluster: "Operating", family: "System Management", defaultLane: "natural", defaultWeight: 0.9 },
  { id: "collaborative_validator", label: "Mengecek bersama orang lain", kind: "adaptive", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "balanced_order", label: "Menata secukupnya", kind: "adaptive", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "adaptive", defaultWeight: 0.65 },
  { id: "control_tension", label: "Tegang saat keteraturan rusak", kind: "overuse", microRoleId: "system_organizer", cluster: "Operating", family: "System Management", defaultLane: "overuse", defaultWeight: 0.85 },
  { id: "priority_overload", label: "Beban memilih prioritas", kind: "drain", microRoleId: "complexity_arranger", cluster: "Operating", family: "System Management", defaultLane: "drain", defaultWeight: 0.85 },
  { id: "conflict_avoidance", label: "Menghindari konflik", kind: "adaptive", microRoleId: "harmony_keeper", cluster: "Relating", family: "Human Support", defaultLane: "adaptive", defaultWeight: 0.55 },
  { id: "low_social_initiation", label: "Inisiasi sosial rendah", kind: "quality", microRoleId: "relationship_keeper", cluster: "Relating", family: "Human Support", defaultLane: "quality", defaultWeight: 0.2 },
  { id: "communication_gap", label: "Paham sendiri tapi sulit menjelaskan", kind: "adaptive", microRoleId: "deep_thinker", cluster: "Thinking", family: "Analytical Thinking", defaultLane: "adaptive", defaultWeight: 0.5 },
  { id: "adaptive", label: "Kemampuan adaptif", kind: "adaptive", cluster: "Operating", defaultLane: "adaptive", defaultWeight: 0.4 },
];

export const PATTERN_SIGNAL_DEFINITIONS: Record<string, PatternSignalDefinition> = Object.fromEntries(
  [...ROLE_SIGNALS, ...EXTRA_SIGNALS].map((signal) => [signal.id, signal]),
);

export function resolveSignalDefinition(id: string): PatternSignalDefinition | undefined {
  return PATTERN_SIGNAL_DEFINITIONS[id];
}

export function microRoleForSignal(id: string): MicroRoleId | undefined {
  return resolveSignalDefinition(id)?.microRoleId;
}
