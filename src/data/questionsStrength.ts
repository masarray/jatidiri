import type { ActionCardQuestionItem, SignalContribution } from "@/types/assessment";

function sig(id: string, lane: SignalContribution["lane"] = "strength", weight = 1): SignalContribution {
  return { id, lane, weight };
}

export const strengthQuestions: ActionCardQuestionItem[] = [
  {
    id: "strength-1",
    session: "strength",
    number: 1,
    format: "action_cards",
    patternArea: "Bukti Menjelaskan",
    cluster: "Influencing",
    situation: "Orang lain tidak memahami hal yang kamu pahami.",
    prompt: "Dalam pengalaman nyata, biasanya kamu:",
    text: "Orang lain tidak memahami hal yang kamu pahami. Dalam pengalaman nyata, biasanya kamu...",
    options: [
      { id: "A", text: "Bisa menjelaskan ulang dengan bahasa sederhana.", signals: [sig("idea_translator"), sig("strength_proof")] },
      { id: "B", text: "Paham sendiri, tapi sulit menjelaskannya.", signals: [sig("deep_thinker"), sig("communication_gap", "adaptive", 0.5)] },
      { id: "C", text: "Lebih nyaman membuat contoh atau visual.", signals: [sig("creative_designer"), sig("prototype_builder")] },
      { id: "D", text: "Biasanya arahkan ke sumber yang lebih lengkap.", signals: [sig("information_collector"), sig("resource_keeper")] },
    ],
  },
  {
    id: "strength-2",
    session: "strength",
    number: 2,
    format: "action_cards",
    patternArea: "Bukti Menuntaskan",
    cluster: "Operating",
    situation: "Ada pekerjaan yang harus selesai sampai benar-benar beres.",
    prompt: "Dalam pengalaman nyata, biasanya kamu:",
    text: "Ada pekerjaan yang harus selesai sampai benar-benar beres. Dalam pengalaman nyata, biasanya kamu...",
    options: [
      { id: "A", text: "Kuat menjaga sampai selesai.", signals: [sig("commitment_keeper"), sig("operational_executor"), sig("strength_proof")] },
      { id: "B", text: "Cepat hidup di awal, tapi butuh sistem agar tetap kuat sampai akhir.", signals: [sig("action_mover"), sig("unfinished_risk", "overuse", 0.8), sig("structure_need", "adaptive", 0.55)] },
      { id: "C", text: "Kuat kalau ada struktur dan tenggat jelas.", signals: [sig("system_organizer"), sig("consistency_guardian"), sig("adaptive", "adaptive", 0.4)] },
      { id: "D", text: "Lebih kuat memperbaiki daripada menyelesaikan dari nol.", signals: [sig("quality_evaluator"), sig("problem_restorer")] },
    ],
  },
  {
    id: "strength-3",
    session: "strength",
    number: 3,
    format: "action_cards",
    patternArea: "Bukti Relasi",
    cluster: "Relating",
    situation: "Ada hubungan atau tim yang mulai renggang.",
    prompt: "Dalam pengalaman nyata, biasanya kamu:",
    text: "Ada hubungan atau tim yang mulai renggang. Dalam pengalaman nyata, biasanya kamu...",
    options: [
      { id: "A", text: "Cukup kuat membuka komunikasi lagi.", signals: [sig("relationship_keeper"), sig("warm_connector"), sig("strength_proof")] },
      { id: "B", text: "Peka, tapi sering menunggu orang lain mulai.", signals: [sig("emotion_reader"), sig("social_adaptive", "adaptive", 0.6)] },
      { id: "C", text: "Lebih nyaman menyelesaikan lewat tindakan nyata.", signals: [sig("people_developer"), sig("practical_supporter")] },
      { id: "D", text: "Cenderung menjaga jarak agar tidak makin rumit.", signals: [sig("boundary_keeper"), sig("respectful_distance", "adaptive", 0.7)] },
    ],
  },
  {
    id: "strength-4",
    session: "strength",
    number: 4,
    format: "action_cards",
    patternArea: "Bukti Mengatur Sistem",
    cluster: "Operating",
    situation: "Pekerjaan atau data perlu dibuat lebih rapi.",
    prompt: "Dalam pengalaman nyata, biasanya kamu:",
    text: "Pekerjaan atau data perlu dibuat lebih rapi. Dalam pengalaman nyata, biasanya kamu...",
    options: [
      { id: "A", text: "Kuat membuat struktur dan alurnya.", signals: [sig("system_organizer"), sig("strength_proof")] },
      { id: "B", text: "Bisa menjalankan kalau strukturnya sudah ada.", signals: [sig("operational_executor"), sig("consistency_guardian")] },
      { id: "C", text: "Lebih kuat menemukan masalah daripada merapikan sistem.", signals: [sig("problem_restorer"), sig("pattern_reader")] },
      { id: "D", text: "Lebih hidup saat sistem itu langsung membantu pekerjaan nyata, bukan hanya administrasi.", signals: [sig("impact_seeker", "strength", 0.75), sig("purposeful_communicator", "strength", 0.55), sig("admin_drain", "drain")] },
    ],
  },
  {
    id: "strength-5",
    session: "strength",
    number: 5,
    format: "action_cards",
    patternArea: "Bukti Marketing dan Persuasi",
    cluster: "Influencing",
    situation: "Kamu harus mempromosikan ide, produk, atau solusi yang kamu yakini.",
    prompt: "Dalam pengalaman nyata, biasanya kamu:",
    text: "Kamu harus mempromosikan ide, produk, atau solusi yang kamu yakini. Dalam pengalaman nyata, biasanya kamu...",
    options: [
      { id: "A", text: "Cukup kuat menjelaskan nilainya, walau setelah itu terasa menguras energi.", signals: [sig("adaptive_influencer", "strength"), sig("value_framer", "strength"), sig("social_energy_drain", "drain")] },
      { id: "B", text: "Menikmati bertemu orang dan membangun ketertarikan lewat obrolan.", signals: [sig("social_spark", "strength"), sig("persuader", "strength"), sig("strength_proof")] },
      { id: "C", text: "Lebih suka membuat materi, demo, atau tulisan yang menjual tanpa terlalu banyak basa-basi.", signals: [sig("strategic_marketer", "strength"), sig("content_seller", "strength"), sig("small_talk_drain", "drain", 0.6)] },
      { id: "D", text: "Lebih nyaman kalau orang tertarik karena sudah melihat bukti atau hasilnya.", signals: [sig("proof_builder", "strength"), sig("credibility_based_marketing", "strength"), sig("persuasion_skill", "strength", 0.5)] },
    ],
  },

];
