
import type { PatternSignatureReport, SignalScore } from "@/engine/patternSignature";

export type PatternInsightTone = "teal" | "amber" | "rose" | "slate" | "sky";
export type PatternInsightKind = "drive" | "overuse" | "drain" | "adaptive";

export interface PatternInsight {
  id: string;
  kind: PatternInsightKind;
  title: string;
  shortTitle: string;
  headline: string;
  body: string;
  support: string;
  mirrorLine: string;
  summaryLine: string;
  tone: PatternInsightTone;
  score: number;
  matchedSignals: string[];
  evidence: string[];
}

interface Rule {
  id: string;
  kind: PatternInsightKind;
  tone: PatternInsightTone;
  title: string;
  shortTitle: string;
  headline: string;
  body: string;
  support: string;
  mirrorLine: string;
  summaryLine: string;
  signals: string[];
  minMatched: number;
  minScore: number;
}

const RULES: Rule[] = [
  {
    id: "explorer_priority_leak",
    kind: "overuse",
    tone: "amber",
    title: "Eksplorasi kuat yang perlu pagar prioritas",
    shortTitle: "Eksplorasi vs Prioritas",
    headline: "Rasa ingin tahu kamu bisa cepat menyala, tetapi perlu pagar agar tidak menggeser tugas utama.",
    body: "Hal baru, tools baru, atau kemungkinan baru bisa terasa lebih hidup daripada pekerjaan yang sedang berjalan. Ini sumber belajar cepat, tetapi juga bisa membuat energi berpindah sebelum tugas utama selesai.",
    support: "Gunakan sistem parkir ide: catat, beri batas waktu eksplorasi, lalu kembali ke tugas utama. Eksplorasi paling sehat ketika terikat pada output nyata.",
    mirrorLine: "Ada sinyal bahwa rasa ingin tahu dan hal baru mudah menyalakan kamu. Kekuatan ini bagus, tetapi perlu pagar prioritas agar tidak berubah menjadi banyak mulai dan sedikit selesai.",
    summaryLine: "rasa ingin tahu tinggi perlu diikat dengan prioritas dan batas waktu eksplorasi",
    signals: ["fast_learner", "novelty_pull", "priority_leak", "unfinished_risk", "routine_drain"],
    minMatched: 2,
    minScore: 1.7,
  },
  {
    id: "quality_perfection_delay",
    kind: "overuse",
    tone: "slate",
    title: "Kualitas tinggi yang bisa menunda selesai",
    shortTitle: "Mutu vs Selesai",
    headline: "Kamu bisa cepat melihat bagian yang perlu dibuat lebih baik, tetapi perlu menjaga batas cukup-selesai.",
    body: "Sisi terangnya: hasil bisa naik level. Sisi bocornya: pekerjaan yang sebenarnya sudah layak bisa tertunda karena masih terasa belum sempurna.",
    support: "Tentukan definisi selesai sebelum mulai memperbaiki. Pisahkan perbaikan wajib, perbaikan bagus-jika-sempat, dan ide untuk versi berikutnya.",
    mirrorLine: "Ada dorongan menjaga kualitas dan melihat celah perbaikan. Ini aset besar, selama tidak membuat kamu terlalu lama menahan pekerjaan yang sebenarnya sudah cukup layak.",
    summaryLine: "dorongan meningkatkan kualitas perlu dipasangkan dengan definisi selesai",
    signals: ["quality_evaluator", "visual_detail_checker", "balanced_improver", "perfection_delay"],
    minMatched: 2,
    minScore: 1.5,
  },
  {
    id: "risk_worry_loop",
    kind: "overuse",
    tone: "rose",
    title: "Penjaga risiko yang perlu membatasi putaran khawatir",
    shortTitle: "Risiko vs Khawatir",
    headline: "Kamu peka melihat hal yang mungkin salah, tetapi perlu membedakan antisipasi sehat dan khawatir berulang.",
    body: "Sisi kuatnya adalah tidak mudah lengah. Namun jika sinyal ini terlalu tinggi, pikiran bisa berputar pada kemungkinan buruk tanpa berubah menjadi rencana yang menenangkan.",
    support: "Ubah kekhawatiran menjadi daftar antisipasi: risiko apa, tanda awalnya apa, tindakan kecilnya apa. Setelah itu beri batas: cukup dipikirkan sampai ada langkah cadangan.",
    mirrorLine: "Kamu mungkin punya radar risiko yang cukup aktif. Jika radar ini tidak diberi batas, ia bisa berubah menjadi putaran khawatir yang menguras energi.",
    summaryLine: "radar risiko perlu diubah menjadi rencana cadangan, bukan diputar terus di kepala",
    signals: ["risk_checker", "threat_scanner", "preparedness_keeper", "worry_loop", "uncertainty_drain", "hesitation_risk"],
    minMatched: 2,
    minScore: 1.6,
  },
  {
    id: "order_dependency",
    kind: "overuse",
    tone: "teal",
    title: "Keteraturan yang menenangkan, tapi bisa mengambil alih fokus",
    shortTitle: "Rapi vs Fokus",
    headline: "Kamu bisa merasa lebih tenang ketika ruang, file, atau alur terlihat rapi.",
    body: "Keteraturan memberi rasa lega dan kejernihan. Namun kalau dorongan merapikan terlalu kuat, energi bisa habis untuk menata sekitar sebelum pekerjaan utama benar-benar bergerak.",
    support: "Pakai aturan dua menit: rapikan bagian yang paling mengganggu saja, lalu kembali ke tugas utama. Rapi adalah pendukung fokus, bukan pengganti prioritas.",
    mirrorLine: "Ada sinyal bahwa keteraturan visual atau alur yang rapi ikut memengaruhi kenyamanan berpikir kamu. Ini membantu, tetapi jangan sampai rapi mengalahkan tugas utama.",
    summaryLine: "kebutuhan rapi sebaiknya menjadi pendukung fokus, bukan pengambil alih prioritas",
    signals: ["order_restorer", "visual_clarity_seeker", "order_dependency", "balanced_order", "control_tension"],
    minMatched: 2,
    minScore: 1.5,
  },
  {
    id: "resource_keeper_overload",
    kind: "overuse",
    tone: "sky",
    title: "Penyimpan sumber daya yang perlu ruang seleksi",
    shortTitle: "Simpan vs Lega",
    headline: "Kamu mungkin mudah melihat nilai guna pada barang, file, referensi, atau catatan.",
    body: "Sisi terangnya adalah kesiapan dan kekayaan referensi. Sisi bocornya: terlalu banyak yang disimpan bisa membuat ruang fisik atau mental terasa penuh.",
    support: "Buat tiga kategori: sering dipakai, mungkin berguna, dan arsip/lepas. Menyimpan akan lebih sehat jika ada sistem seleksi dan tanggal evaluasi ulang.",
    mirrorLine: "Ada pola menyimpan sumber daya atau referensi karena melihat kemungkinan manfaatnya. Ini bisa menjadi aset, tetapi perlu sistem agar tidak berubah menjadi beban ruang dan pikiran.",
    summaryLine: "kebiasaan menyimpan perlu ditemani sistem seleksi agar tidak menjadi beban mental",
    signals: ["resource_keeper", "information_collector", "preparedness_keeper", "archive_overload", "too_much_saving"],
    minMatched: 2,
    minScore: 1.5,
  },
  {
    id: "social_spark_burden",
    kind: "overuse",
    tone: "amber",
    title: "Penghidup suasana yang tidak harus selalu menjadi sumber energi",
    shortTitle: "Rame vs Lelah",
    headline: "Kehadiran kamu bisa membuat suasana lebih cair, tetapi kamu tidak harus selalu bertanggung jawab atas mood kelompok.",
    body: "Sisi terangnya: orang merasa lebih cair. Sisi bocornya: kamu bisa merasa bersalah saat suasana sepi, walau sebenarnya kamu juga butuh istirahat.",
    support: "Bedakan kemampuan menghidupkan suasana dengan kewajiban menghibur. Kamu boleh hadir tenang tanpa harus selalu menjadi pemantik energi kelompok.",
    mirrorLine: "Ada sinyal sosial yang hangat: kamu bisa menghidupkan suasana atau membuka koneksi. Tetap jaga agar peran ini tidak berubah menjadi kewajiban selalu meramaikan.",
    summaryLine: "kemampuan menghidupkan suasana perlu batas agar tidak menjadi beban sosial",
    signals: ["social_spark", "warm_connector", "mood_lifter", "group_energizer", "social_responsibility_burden", "over_responsibility_for_mood"],
    minMatched: 2,
    minScore: 1.5,
  },
  {
    id: "purposeful_communication_drain",
    kind: "drain",
    tone: "sky",
    title: "Komunikasi bertujuan, bukan basa-basi panjang",
    shortTitle: "Komunikasi Bertujuan",
    headline: "Kamu bisa kuat berkomunikasi saat ada isi atau tujuan yang jelas, tetapi obrolan ringan yang panjang bisa cepat menguras energi.",
    body: "Pola ini membedakan kemampuan komunikasi dari energi sosial. Kamu mungkin bisa menjelaskan, mengarahkan topik, atau membuat orang paham, tetapi bukan berarti kamu selalu hidup dari basa-basi atau harus terus membuka percakapan.",
    support: "Beri konteks pada interaksi sosial: tujuan apa, topik apa, dan batas waktunya. Komunikasi akan lebih sehat ketika ada arah, bukan sekadar menjaga obrolan tetap menyala.",
    mirrorLine: "Ada sinyal bahwa komunikasi kamu lebih kuat saat ada isi, tujuan, atau nilai yang jelas. Basa-basi panjang atau kewajiban menjaga obrolan tetap hidup bisa menjadi titik lelah.",
    summaryLine: "kemampuan komunikasi perlu dibedakan dari energi basa-basi sosial",
    signals: ["purposeful_communicator", "topic_structurer", "small_talk_drain", "social_energy_drain", "conversation_maintenance_burden", "low_social_responsibility", "deep_connection_preference"],
    minMatched: 2,
    minScore: 1.35,
  },
  {
    id: "adaptive_marketing_value_framing",
    kind: "adaptive",
    tone: "teal",
    title: "Marketing berbasis nilai, bukan sekadar social spark",
    shortTitle: "Marketing Adaptif",
    headline: "Kamu bisa menjual ide atau solusi lewat nilai, bukti, dan framing manfaat, meski itu belum tentu berasal dari energi sosial yang ringan.",
    body: "Ini membaca kemampuan memengaruhi yang lebih strategis: menjelaskan manfaat, menunjukkan bukti, membuat demo, atau membuat orang melihat kegunaan sesuatu. Kalau sinyal sosial-drain ikut muncul, kemampuan ini lebih tepat dibaca sebagai kekuatan adaptif/terlatih, bukan otomatis bakat basa-basi alami.",
    support: "Pakai jalur marketing yang cocok: demo, tulisan, contoh, bukti, dan narasi manfaat. Jangan memaksa diri menjadi orang yang harus selalu meramaikan obrolan jika energi sosialmu cepat terkuras.",
    mirrorLine: "Ada indikasi kemampuan marketing atau persuasi yang bekerja melalui substansi dan framing nilai. Ini berbeda dari tipe yang hidup dari obrolan sosial ringan terus-menerus.",
    summaryLine: "marketing kamu lebih kuat saat membawa isi, bukti, dan nilai yang jelas",
    signals: ["strategic_marketer", "value_framer", "persuasion_skill", "adaptive_influencer", "content_seller", "proof_builder", "credibility_builder", "credibility_based_marketing", "small_talk_drain", "social_energy_drain"],
    minMatched: 2,
    minScore: 1.4,
  },
  {
    id: "helper_boundary",
    kind: "overuse",
    tone: "rose",
    title: "Kepedulian yang perlu batas sehat",
    shortTitle: "Menolong vs Batas",
    headline: "Kamu bisa cepat terdorong membantu, tetapi perlu menjaga agar kebutuhanmu sendiri tidak hilang.",
    body: "Sisi kuatnya adalah hangat, peduli, dan praktis membantu. Sisi bocornya muncul ketika bantuan diberikan terlalu cepat atau terlalu banyak sampai pekerjaan atau energi pribadi tertunda.",
    support: "Gunakan kalimat batas yang tetap hangat: ‘Aku bisa bantu bagian ini, tapi tidak bisa ambil semuanya.’ Bantuan yang sehat tetap menyisakan ruang untuk diri sendiri.",
    mirrorLine: "Ada sinyal kepedulian dan dorongan membantu. Ini kekuatan yang manusiawi, tetapi perlu batas agar tidak berubah menjadi mengabaikan diri sendiri.",
    summaryLine: "kepedulian perlu batas agar tidak berubah menjadi self-neglect",
    signals: ["caregiver", "helper", "practical_supporter", "people_developer", "balanced_helper", "self_neglect_risk"],
    minMatched: 2,
    minScore: 1.5,
  },
  {
    id: "analysis_delay",
    kind: "overuse",
    tone: "slate",
    title: "Kejelasan yang perlu batas waktu berpikir",
    shortTitle: "Analisis vs Bergerak",
    headline: "Kamu bisa butuh alasan, bukti, atau pola yang jelas sebelum bergerak.",
    body: "Sisi kuatnya adalah keputusan lebih matang dan tidak asal. Sisi bocornya muncul ketika kebutuhan memahami membuat langkah awal tertunda terlalu lama.",
    support: "Tetapkan batas berpikir: cari tiga informasi utama, lalu ambil langkah kecil yang bisa diuji. Tidak semua keputusan butuh kepastian penuh.",
    mirrorLine: "Ada sinyal kuat pada kejelasan, bukti, dan pembacaan pola. Ini membuat keputusan lebih matang, tetapi perlu batas agar tidak berubah menjadi analisis yang menunda gerak.",
    summaryLine: "kebutuhan bukti dan kejelasan perlu dibatasi agar tidak menunda langkah awal",
    signals: ["pattern_reader", "clarity_guardian", "analysis_delay", "hesitation_risk"],
    minMatched: 2,
    minScore: 1.4,
  },
  {
    id: "action_momentum",
    kind: "drive",
    tone: "amber",
    title: "Momentum cepat yang perlu ritme bersama",
    shortTitle: "Gerak Cepat",
    headline: "Kamu bisa menjadi orang yang mengubah diskusi menjadi langkah nyata.",
    body: "Sisi kuatnya adalah momentum. Kamu dapat membantu orang keluar dari kebuntuan dan mulai bergerak. Yang perlu dijaga adalah tempo, karena orang lain mungkin perlu lebih banyak konteks sebelum ikut jalan.",
    support: "Sebelum mendorong langkah, ringkas tujuan, risiko, dan langkah pertama. Dengan begitu energimu menggerakkan, bukan membuat orang tertinggal.",
    mirrorLine: "Ada sinyal gerak dan keputusan. Kamu bisa membantu sesuatu mulai berjalan, selama tempo kamu tetap disambungkan dengan kesiapan orang lain.",
    summaryLine: "momentum cepat akan lebih efektif jika disambungkan dengan konteks dan kesiapan orang lain",
    signals: ["action_mover", "decision_mover", "decision_director", "practical_executor", "kinesthetic_mover", "crisis_coordinator"],
    minMatched: 2,
    minScore: 1.5,
  },
];

function signalScore(signalScores: SignalScore[] | undefined, signalId: string): number {
  return (signalScores ?? []).filter((item) => item.id === signalId).reduce((sum, item) => sum + item.score, 0);
}

function evidenceFor(report: PatternSignatureReport, signalIds: string[], limit = 3): string[] {
  const selected = new Set<string>();
  for (const line of report.evidenceLines ?? []) {
    if (!line.signals.some((signal) => signalIds.includes(signal))) continue;
    const text = line.selectedText.replace(/\s+/g, " ").trim();
    if (text) selected.add(text);
    if (selected.size >= limit) break;
  }
  return [...selected];
}

function composeInsight(report: PatternSignatureReport, rule: Rule): PatternInsight | null {
  const matchedSignals = rule.signals.filter((id) => signalScore(report.signalScores, id) > 0);
  const score = rule.signals.reduce((sum, id) => sum + signalScore(report.signalScores, id), 0);
  if (matchedSignals.length < rule.minMatched && score < rule.minScore) return null;
  return {
    id: rule.id,
    kind: rule.kind,
    title: rule.title,
    shortTitle: rule.shortTitle,
    headline: rule.headline,
    body: rule.body,
    support: rule.support,
    mirrorLine: rule.mirrorLine,
    summaryLine: rule.summaryLine,
    tone: rule.tone,
    score: Math.round(score * 10) / 10,
    matchedSignals,
    evidence: evidenceFor(report, rule.signals),
  };
}

export function buildPatternInsights(report: PatternSignatureReport, limit = 4): PatternInsight[] {
  return RULES
    .map((rule) => composeInsight(report, rule))
    .filter((item): item is PatternInsight => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildEvidenceHighlights(report: PatternSignatureReport, insights: PatternInsight[], limit = 4): string[] {
  const selected = new Set<string>();
  for (const insight of insights) {
    for (const item of insight.evidence) {
      selected.add(item);
      if (selected.size >= limit) return [...selected];
    }
  }
  for (const line of report.evidenceLines ?? []) {
    const text = line.selectedText.replace(/\s+/g, " ").trim();
    if (text) selected.add(text);
    if (selected.size >= limit) break;
  }
  return [...selected];
}
