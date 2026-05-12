import type { PurposeLens } from "@/data/purposeLens";
import type { ReadingQuality } from "@/types/assessment";
import type {
  AdaptiveGapInsight,
  MicroRoleScore,
  PatternSignatureReport,
} from "@/engine/patternSignature";
import type { MicroRoleId } from "@/data/microRoles";
import { displayMicroRoleName } from "@/utils/displayNames";

export type AdvisoryTone = "teal" | "amber" | "rose" | "slate" | "sky";

export interface AdvisoryTheme {
  id: string;
  title: string;
  shortTitle: string;
  headline: string;
  body: string;
  whyItFits: string;
  healthyUse: string;
  evidence: MicroRoleScore[];
  naturalScore: number;
  strengthScore: number;
  score: number;
  tone: AdvisoryTone;
  onSwitch: string[];
  forOthers: string;
}

export interface AdvisoryVulnerability {
  id: string;
  title: string;
  headline: string;
  body: string;
  support: string;
  triggerWords: string[];
  evidence: MicroRoleScore[];
  naturalScore: number;
  strengthScore: number;
  riskScore: number;
  tone: AdvisoryTone;
}

export interface AdvisoryAdaptive {
  id: string;
  title: string;
  headline: string;
  body: string;
  emotionalNote: string;
  recovery: string;
  evidence: MicroRoleScore[];
  naturalScore: number;
  strengthScore: number;
  gap: number;
  source?: AdaptiveGapInsight;
}

export interface AlignmentReading {
  title: string;
  headline: string;
  body: string;
  alignedCount: number;
  dormantCount: number;
  adaptiveCount: number;
}

export interface SmartResultAdvisory {
  title: string;
  archetype: string;
  mirrorTitle: string;
  mirror: string[];
  sharpSummary: string;
  alignment: AlignmentReading;
  energyThemes: AdvisoryTheme[];
  vulnerabilities: AdvisoryVulnerability[];
  adaptiveThemes: AdvisoryAdaptive[];
  dormantThemes: AdvisoryTheme[];
  onSwitch: string[];
  forOthers: string[];
  resistance: string[];
  recoveryRituals: string[];
  selfCare: string[];
  evidenceLine: string;
  qualityNote: string;
}

interface ThemeRule {
  id: string;
  title: string;
  shortTitle: string;
  roleIds: MicroRoleId[];
  tone: AdvisoryTone;
  headline: string;
  body: string;
  whyItFits: string;
  healthyUse: string;
  dormantBody: string;
  onSwitch: string[];
  forOthers: string;
}

interface VulnerabilityRule {
  id: string;
  title: string;
  roleIds: MicroRoleId[];
  tone: AdvisoryTone;
  headline: string;
  body: string;
  support: string;
  triggerWords: string[];
}

function cleanLanguage(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/\bAnda\b/g, "kamu")
    .replace(/\banda\b/g, "kamu")
    .replace(/rumah energi(?: alami)?(?:mu| kamu)?/gi, "zona kekuatan alami kamu")
    .replace(/sumber energi alamimu/gi, "zona kekuatan alami kamu")
    .replace(/\bundefined\b/gi, "")
    .replace(/social breadth/gi, "relasi sosial yang terlalu melebar")
    .replace(/\.\s+kamu/g, ". Kamu")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanList(values: Array<string | null | undefined>, fallback: string[] = []): string[] {
  const source = values.length > 0 ? values : fallback;
  return [...new Set(source.map(cleanLanguage).filter((item) => item.length > 0))];
}

function cleanTheme(theme: AdvisoryTheme): AdvisoryTheme {
  return {
    ...theme,
    title: cleanLanguage(theme.title),
    shortTitle: cleanLanguage(theme.shortTitle),
    headline: cleanLanguage(theme.headline),
    body: cleanLanguage(theme.body),
    whyItFits: cleanLanguage(theme.whyItFits),
    healthyUse: cleanLanguage(theme.healthyUse),
    onSwitch: cleanList(theme.onSwitch),
    forOthers: cleanLanguage(theme.forOthers),
  };
}

function cleanVulnerability(item: AdvisoryVulnerability): AdvisoryVulnerability {
  return {
    ...item,
    title: cleanLanguage(item.title),
    headline: cleanLanguage(item.headline),
    body: cleanLanguage(item.body),
    support: cleanLanguage(item.support),
    triggerWords: cleanList(item.triggerWords),
  };
}

function cleanAdaptive(item: AdvisoryAdaptive): AdvisoryAdaptive {
  return {
    ...item,
    title: cleanLanguage(item.title),
    headline: cleanLanguage(item.headline),
    body: cleanLanguage(item.body),
    emotionalNote: cleanLanguage(item.emotionalNote),
    recovery: cleanLanguage(item.recovery),
  };
}


const THEME_RULES: ThemeRule[] = [
  {
    id: "strategy_pattern",
    title: "Membaca pola dan mencari strategi",
    shortTitle: "Pola & Strategi",
    roleIds: ["strategy_designer", "pattern_reader", "information_collector", "deep_thinker", "risk_checker"],
    tone: "teal",
    headline:
      "Kamu lebih mudah menyala saat diberi masalah yang perlu dibaca polanya, bukan sekadar disuruh menjalankan instruksi.",
    body:
      "Kamu cenderung ingin memahami arah, alasan, risiko, dan kemungkinan jalan keluar sebelum bergerak. Saat orang lain melihat masalah sebagai tugas, kamu sering membacanya sebagai pola yang perlu disusun ulang.",
    whyItFits:
      "Pola ini biasanya terlihat dari dorongan mengumpulkan bahan, mencari bukti, memikirkan alternatif, lalu memilih jalan yang paling masuk akal.",
    healthyUse:
      "Pakai kekuatan ini untuk membuat strategi, prioritas, roadmap, konsep perbaikan, atau keputusan yang butuh pembacaan situasi.",
    dormantBody:
      "Sinyal strategimu ada, tetapi mungkin belum cukup sering diberi panggung. Cobalah ambil satu masalah kecil, susun peta pilihan, lalu ubah menjadi rekomendasi singkat.",
    onSwitch: [
      "Menurut kamu strategi terbaiknya apa?",
      "Kalau dibuat lebih efektif, sistemnya seperti apa?",
      "Menurutmu pola masalahnya di mana?",
    ],
    forOthers:
      "Lebih mudah mengajak kamu bergerak jika dimulai dari tujuan, alasan, dan pilihan strategi — bukan instruksi pendek tanpa konteks.",
  },
  {
    id: "knowledge_translation",
    title: "Mengubah pengetahuan menjadi penjelasan",
    shortTitle: "Belajar & Menjelaskan",
    roleIds: ["idea_translator", "information_collector", "fast_learner", "deep_thinker", "mentor_coach"],
    tone: "sky",
    headline: "Kamu bukan hanya ingin tahu. Kamu ingin hal yang rumit menjadi lebih jernih dan bisa dipahami.",
    body:
      "Energi kamu muncul ketika bisa mengumpulkan bahan, memahami konteks, lalu memberi bahasa yang lebih sederhana. Kamu bisa terlihat hidup saat menjelaskan, menulis, mengajar, membuat demo, atau menerjemahkan ide menjadi sesuatu yang praktis.",
    whyItFits:
      "Pola ini sering muncul pada orang yang menyimpan banyak referensi, cepat belajar, dan merasa puas saat orang lain akhirnya mengerti.",
    healthyUse:
      "Tempatkan diri pada peran edukasi, dokumentasi, presentasi, mentoring, konten, atau bridge antara informasi teknis dan pemahaman orang lain.",
    dormantBody:
      "Potensi menjelaskan mungkin ada, tetapi belum selalu menjadi karya. Mulailah dari catatan pendek, tulisan, video singkat, atau penjelasan 1 halaman.",
    onSwitch: [
      "Bisa bantu jelaskan ini supaya lebih mudah dipahami?",
      "Kalau ini harus dijelaskan ke orang awam, kalimatnya bagaimana?",
      "Bisa bantu susun bahan ini jadi lebih rapi?",
    ],
    forOthers:
      "Minta kamu menjelaskan atau merapikan pemahaman sering lebih efektif daripada langsung menyuruh menyelesaikan detail teknis kecil.",
  },
  {
    id: "idea_creation",
    title: "Membuat ide dan kemungkinan baru",
    shortTitle: "Ide & Kemungkinan",
    roleIds: ["idea_synthesizer", "creative_designer", "future_mapper", "strategy_designer", "idea_translator"],
    tone: "amber",
    headline: "Kamu lebih bersemangat ketika ada ruang membayangkan kemungkinan baru, bukan hanya mengulang pola lama.",
    body:
      "Kamu cenderung melihat bahwa sesuatu bisa dibuat lebih menarik, lebih bermakna, atau lebih efektif. Rutinitas yang terlalu sempit dapat membuat energi kreatifmu terasa terkunci.",
    whyItFits:
      "Ini terbaca dari pola mencari hubungan antaride, membuat konsep, membayangkan masa depan, dan mengubah bahan biasa menjadi gagasan baru.",
    healthyUse:
      "Gunakan untuk brainstorming, desain konsep, inovasi, storytelling, produk, konten, atau perbaikan cara kerja.",
    dormantBody:
      "Ide kamu mungkin banyak, tetapi belum semuanya diberi wadah selesai. Pilih satu ide kecil, beri bentuk, lalu selesaikan sebelum membuka terlalu banyak kemungkinan baru.",
    onSwitch: [
      "Apa ide kamu supaya ini lebih hidup?",
      "Kalau dibuat versi yang lebih menarik, bentuknya seperti apa?",
      "Kemungkinan lain yang belum kita lihat apa?",
    ],
    forOthers:
      "Kamu cenderung lebih hidup saat diberi ruang alternatif. Terlalu cepat menutup ide bisa membuatmu merasa tidak dilibatkan.",
  },
  {
    id: "problem_quality",
    title: "Mendiagnosis masalah dan menjaga kualitas",
    shortTitle: "Masalah & Mutu",
    roleIds: ["problem_restorer", "quality_evaluator", "pattern_reader", "risk_checker", "commitment_keeper"],
    tone: "slate",
    headline: "Kamu lebih tenang ketika sesuatu bisa diuji, diperiksa, dan dikembalikan ke kondisi yang lebih benar.",
    body:
      "Kamu mungkin tidak mudah puas dengan jawaban permukaan. Ada dorongan untuk mencari akar masalah, memastikan kualitas, dan mencegah keputusan yang asal cepat tetapi rapuh.",
    whyItFits:
      "Pola ini muncul ketika jawaban tinggi berkumpul pada bukti, pemeriksaan, risiko, akar masalah, dan tanggung jawab terhadap hasil.",
    healthyUse:
      "Gunakan sebagai fungsi audit, review, troubleshooting, testing, quality control, atau penjaga keputusan penting.",
    dormantBody:
      "Naluri memperbaiki dan mengecek kualitas bisa menjadi aset besar. Jangan hanya dipakai saat krisis; jadikan sistem pencegahan sederhana.",
    onSwitch: [
      "Menurutmu akar masalahnya di mana?",
      "Bagian mana yang perlu dicek dulu supaya aman?",
      "Apa risiko yang paling harus kita antisipasi?",
    ],
    forOthers:
      "Jangan anggap pertanyaan kritismu sebagai penolakan. Sering kali kamu sedang menjaga agar keputusan tidak asal jalan.",
  },
  {
    id: "system_reliability",
    title: "Menjaga alur, janji, dan keteraturan",
    shortTitle: "Sistem & Tanggung Jawab",
    roleIds: ["system_organizer", "commitment_keeper", "consistency_guardian", "quality_evaluator", "operational_executor"],
    tone: "teal",
    headline: "Kamu lebih ringan bergerak ketika alur, standar, dan tanggung jawab terlihat jelas.",
    body:
      "Kamu bisa merasa terganggu saat banyak hal berubah tanpa alasan, janji tidak jelas, atau tugas tercecer. Keteraturan bukan sekadar rapi; bagi pola ini, keteraturan memberi rasa aman.",
    whyItFits:
      "Ini terlihat dari perhatian pada jadwal, janji, aturan, konsistensi, kualitas, dan proses yang bisa diikuti.",
    healthyUse:
      "Pakai untuk membuat checklist, SOP ringan, jadwal, pembagian peran, dan sistem yang mengurangi chaos.",
    dormantBody:
      "Ada potensi menata hidup dan proses, tetapi hati-hati: sistem dibuat untuk meringankan, bukan menambah beban perfeksionis.",
    onSwitch: [
      "Biar tidak bolak-balik, alur paling aman bagaimana?",
      "Pembagian peran yang paling jelas menurut kamu apa?",
      "Apa standar minimum supaya ini rapi?",
    ],
    forOthers:
      "Kamu akan lebih mudah membantu jika ekspektasi dan definisi selesai dibuat jelas di awal.",
  },
  {
    id: "human_growth",
    title: "Membantu orang bertumbuh",
    shortTitle: "Tumbuh & Membimbing",
    roleIds: ["people_developer", "mentor_coach", "relationship_keeper", "emotion_reader", "harmony_keeper"],
    tone: "rose",
    headline: "Kamu bisa menyala saat melihat seseorang menjadi lebih mampu, lebih tenang, atau lebih percaya diri.",
    body:
      "Kekuatan ini bukan sekadar baik hati. Kamu cenderung menangkap potensi orang dan merasa bermakna ketika kehadiranmu membuat orang lain bertumbuh.",
    whyItFits:
      "Ini terbaca dari pola membantu, membimbing, merawat relasi, membaca kebutuhan orang, dan merasa puas melihat perkembangan kecil.",
    healthyUse:
      "Gunakan untuk mentoring, coaching, parenting, teaching, pelayanan, atau membangun lingkungan yang membuat orang lebih aman berkembang.",
    dormantBody:
      "Potensi mendampingi orang ada, tetapi mungkin belum dibentuk sebagai peran yang jelas. Mulailah dari membantu satu orang tanpa mengambil alih semua bebannya.",
    onSwitch: [
      "Menurutmu cara membantu orang ini bertumbuh apa?",
      "Apa dukungan yang paling dibutuhkan orang ini?",
      "Bagaimana cara membuat dia lebih percaya diri?",
    ],
    forOthers:
      "Kamu akan lebih hidup ketika kontribusimu terlihat membantu manusia, bukan hanya mengejar angka atau tugas kosong.",
  },
  {
    id: "warm_relationship",
    title: "Membangun rasa aman dalam hubungan",
    shortTitle: "Relasi & Rasa Aman",
    roleIds: ["relationship_keeper", "social_connector", "group_includer", "emotion_reader", "harmony_keeper"],
    tone: "rose",
    headline: "Kamu lebih mudah terbuka ketika hubungan terasa aman, hangat, dan tidak menghakimi.",
    body:
      "Bagi pola ini, relasi bukan dekorasi. Suasana hubungan sering menentukan apakah pesan dapat diterima dengan ringan atau terasa seperti tekanan.",
    whyItFits:
      "Ini muncul dari pola menjaga kedekatan, menyapa, melibatkan orang, membaca emosi, dan mencari titik temu.",
    healthyUse:
      "Pakai untuk membangun komunikasi keluarga, kerja tim, komunitas, dan ruang diskusi yang membuat orang merasa diterima.",
    dormantBody:
      "Potensi relasional bisa tumbuh lewat konsistensi kecil, bukan harus selalu menjadi orang paling ramai atau paling ekspresif.",
    onSwitch: [
      "Aku ingin dengar perasaan kamu dulu.",
      "Kita cari cara yang enak untuk semua pihak ya.",
      "Menurut kamu, siapa yang perlu dilibatkan?",
    ],
    forOthers:
      "Kamu lebih mudah menerima masukan jika rasa aman dan niat baik dibangun dulu sebelum masuk ke koreksi.",
  },
  {
    id: "momentum_action",
    title: "Mengubah arah menjadi tindakan",
    shortTitle: "Aksi & Momentum",
    roleIds: ["action_mover", "decision_director", "achievement_driver", "complexity_arranger", "strategy_designer"],
    tone: "amber",
    headline: "Kamu lebih hidup ketika ada tujuan yang jelas dan sesuatu perlu mulai digerakkan.",
    body:
      "Kamu bisa menjadi pemicu momentum: mengubah wacana menjadi langkah. Yang perlu dijaga adalah tempo, karena tidak semua orang bergerak secepat energimu.",
    whyItFits:
      "Ini terbaca dari dorongan mengambil tindakan, memimpin keputusan, mengejar hasil, mengatur kompleksitas, dan menentukan langkah pertama.",
    healthyUse:
      "Gunakan untuk memulai proyek, menjaga momentum, membuat keputusan awal, dan mengeksekusi prioritas yang sudah cukup jelas.",
    dormantBody:
      "Potensi menggerakkan ada, tetapi mungkin butuh ruang aman untuk mengambil posisi. Mulailah dari keputusan kecil yang jelas dan bisa diuji.",
    onSwitch: [
      "Langkah pertama yang paling masuk akal apa?",
      "Apa keputusan kecil yang bisa kita ambil sekarang?",
      "Kalau harus mulai hari ini, mulai dari mana?",
    ],
    forOthers:
      "Kamu cenderung lebih mudah bergerak ketika tujuan dan batas waktunya jelas, bukan ketika semua hal masih menggantung.",
  },
  {
    id: "meaning_values",
    title: "Bergerak karena makna dan nilai",
    shortTitle: "Makna & Nilai",
    roleIds: ["meaning_keeper", "commitment_keeper", "people_developer", "future_mapper", "consistency_guardian"],
    tone: "teal",
    headline: "Kamu lebih kuat ketika tahu bahwa yang kamu lakukan punya makna dan manfaat.",
    body:
      "Jika aktivitas terasa kosong, sekadar rutinitas, atau tidak sesuai nilai, energimu bisa turun walaupun kamu tetap mampu menyelesaikannya. Sebaliknya, tujuan yang terasa benar bisa membuatmu tahan berjuang.",
    whyItFits:
      "Pola ini terlihat dari orientasi nilai, manfaat, komitmen, masa depan, dan keinginan memberi dampak yang lebih besar.",
    healthyUse:
      "Hubungkan tugas harian dengan alasan yang lebih bermakna. Jika makna hilang, energi biasanya ikut menurun.",
    dormantBody:
      "Makna bisa menjadi kompas. Tulis alasan kenapa peran ini penting bagimu agar energi tidak hanya bergantung pada mood harian.",
    onSwitch: [
      "Apa manfaat terbesar dari hal ini?",
      "Kenapa ini penting untuk kita jalankan?",
      "Nilai apa yang ingin kamu jaga di sini?",
    ],
    forOthers:
      "Kamu lebih mudah menerima ajakan jika tahu nilai dan manfaatnya, bukan hanya karena ‘harus’. ",
  },
];

const VULNERABILITY_RULES: VulnerabilityRule[] = [
  {
    id: "instruction_without_context",
    title: "Instruksi pendek tanpa konteks",
    roleIds: ["strategy_designer", "deep_thinker", "pattern_reader", "risk_checker"],
    tone: "amber",
    headline: "Kamu bisa berat bergerak jika hanya disuruh tanpa tahu alasan, arah, atau konteksnya.",
    body:
      "Ini bukan selalu malas. Pada pola ini, energi sering baru menyala setelah otak memahami ‘kenapa’, ‘untuk apa’, dan ‘jalur terbaiknya apa’. Instruksi yang terlalu mentah bisa membuatmu diam dulu, bukan karena menolak, tetapi karena sedang mencari pegangan berpikir.",
    support: "Minta konteks minimum: tujuan, batas waktu, alasan, dan definisi selesai. Setelah itu, ambil satu langkah kecil agar tidak terjebak berpikir terlalu lama.",
    triggerWords: ["cepat", "pokoknya", "langsung saja", "nggak usah banyak mikir"],
  },
  {
    id: "routine_admin_drain",
    title: "Rutinitas administratif yang berulang",
    roleIds: ["system_organizer", "operational_executor", "consistency_guardian", "quality_evaluator"],
    tone: "slate",
    headline: "Kamu bisa mengerjakan hal rutin, tetapi energi terbaikmu bisa habis jika terlalu lama hidup di detail kecil yang berulang.",
    body:
      "Tugas administrasi, input data, file, jadwal, dan follow-up kecil bisa terlihat sederhana, tetapi secara psikologis tetap menyedot energi jika bukan zona kekuatan alami. Kamu mungkin tetap melakukannya karena tanggung jawab, bukan karena itu membuatmu hidup.",
    support: "Pakai template, batching, reminder, checklist, dan pembagian peran. Jangan biarkan energi inti habis hanya untuk menjaga detail yang bisa disistemkan.",
    triggerWords: ["rapikan sekarang", "isi data", "ulang lagi", "detail kecil"],
  },
  {
    id: "social_breadth_drain",
    title: "Relasi melebar yang terlalu basa-basi",
    roleIds: ["social_connector", "group_includer", "relationship_keeper", "emotion_reader"],
    tone: "rose",
    headline: "Kamu mungkin bisa berinteraksi, tetapi belum tentu terisi oleh komunikasi yang terlalu banyak basa-basi.",
    body:
      "Jika social breadth bukan energi utama, tuntutan untuk selalu ramah, menyapa, follow-up, atau menjaga suasana banyak orang bisa membuatmu cepat kosong. Kamu mungkin lebih kuat menjelaskan nilai daripada terus menjaga hubungan dangkal.",
    support: "Pilih relasi penting, gunakan pesan singkat yang tulus, dan beri jeda setelah aktivitas sosial panjang. Kualitas relasi lebih sehat daripada jumlah interaksi.",
    triggerWords: ["kenalan semua", "ramahin aja", "follow-up terus", "basa-basi dulu"],
  },
  {
    id: "emotion_absorption_drain",
    title: "Interaksi emosional yang terlalu panjang",
    roleIds: ["emotion_reader", "harmony_keeper", "people_developer", "relationship_keeper"],
    tone: "rose",
    headline: "Kamu bisa cepat lelah jika percakapan terlalu lama berada di beban emosi tanpa arah yang jelas.",
    body:
      "Ini bukan berarti kamu tidak peduli. Sebagian orang lebih kuat membantu lewat struktur, penjelasan, solusi, atau batas yang jernih daripada terus-menerus menampung rasa. Jika interaksi emosional terlalu panjang, kamu bisa merasa kosong walaupun niatmu baik.",
    support: "Validasi secukupnya, lalu buat batas yang hangat. Kamu boleh berkata: ‘Aku dengerin, tapi aku perlu jeda supaya bisa bantu dengan lebih jernih.’",
    triggerWords: ["dengerin terus", "semua harus nyaman", "jangan bikin kecewa"],
  },
  {
    id: "fast_action_drain",
    title: "Keputusan cepat tanpa cukup bahan",
    roleIds: ["action_mover", "decision_director", "achievement_driver", "risk_checker"],
    tone: "amber",
    headline: "Kamu bisa tegang jika dipaksa bergerak cepat sebelum bahan dan risikonya cukup jelas.",
    body:
      "Sebagian orang merasa aman setelah bertindak. Sebagian lain merasa aman setelah memahami. Kalau kamu tipe yang butuh pola dulu, keputusan terlalu cepat bisa terasa seperti tekanan mental.",
    support: "Buat aturan: pahami 3 hal utama, lalu bergerak. Jangan menunggu sempurna, tetapi jangan juga memaksa diri bergerak tanpa pegangan.",
    triggerWords: ["sekarang juga", "langsung putuskan", "nggak usah data"],
  },
  {
    id: "conflict_directness_drain",
    title: "Nada tinggi dan konflik frontal",
    roleIds: ["decision_director", "harmony_keeper", "emotion_reader", "risk_checker"],
    tone: "rose",
    headline: "Cara bicara yang terlalu keras bisa membuat isi pesan kalah oleh rasa tertekan.",
    body:
      "Bagi sebagian orang, nada tegas terasa normal. Bagi yang lain, nada itu terasa seperti amarah. Jika kamu sensitif pada tekanan suara atau konflik langsung, kamu bisa defensif bukan karena tidak mau mendengar, tetapi karena tubuhmu membaca situasi sebagai ancaman.",
    support: "Minta percakapan diturunkan volumenya: ‘Aku mau dengar, tapi tolong pakai nada yang lebih tenang supaya aku bisa paham.’",
    triggerWords: ["harus", "pokoknya", "kamu selalu", "kamu tidak pernah"],
  },
  {
    id: "chaos_drain",
    title: "Situasi kacau tanpa prioritas",
    roleIds: ["complexity_arranger", "system_organizer", "strategy_designer", "risk_checker"],
    tone: "slate",
    headline: "Kamu mudah lelah saat semua hal bercampur tanpa prioritas, pemilik tugas, atau arah yang jelas.",
    body:
      "Kelelahan muncul karena terlalu banyak noise. Kamu menghabiskan energi hanya untuk memahami apa yang sebenarnya penting, siapa mengerjakan apa, dan kapan sesuatu dianggap selesai.",
    support: "Pisahkan masalah, pilih satu prioritas, tentukan pemilik tugas, lalu sepakati langkah paling kecil yang bisa diuji.",
    triggerWords: ["semuanya penting", "nanti lihat saja", "belum tahu siapa"],
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function byId(roles: MicroRoleScore[], id: MicroRoleId) {
  return roles.find((role) => role.id === id);
}

function selectedRoles(roles: MicroRoleScore[], ids: MicroRoleId[], mode: "natural" | "strength" = "natural") {
  return ids
    .map((id) => byId(roles, id))
    .filter((role): role is MicroRoleScore => Boolean(role))
    .sort((a, b) => b[mode] - a[mode])
    .slice(0, 5);
}

function averageScore(roles: MicroRoleScore[], ids: MicroRoleId[], mode: "natural" | "strength") {
  const values = ids
    .map((id) => byId(roles, id))
    .filter((role): role is MicroRoleScore => Boolean(role))
    .map((role) => role[mode]);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function combinedScore(natural: number, strength: number) {
  return Math.round(natural * 0.72 + strength * 0.28);
}

function buildEnergyThemes(report: PatternSignatureReport): AdvisoryTheme[] {
  return THEME_RULES
    .map((rule) => {
      const naturalScore = averageScore(report.microRoles, rule.roleIds, "natural");
      const strengthScore = averageScore(report.microRoles, rule.roleIds, "strength");
      const evidence = selectedRoles(report.microRoles, rule.roleIds, "natural");
      const score = combinedScore(naturalScore, strengthScore);
      return {
        id: rule.id,
        title: rule.title,
        shortTitle: rule.shortTitle,
        headline: rule.headline,
        body: rule.body,
        whyItFits: rule.whyItFits,
        healthyUse: rule.healthyUse,
        evidence,
        naturalScore,
        strengthScore,
        score,
        tone: rule.tone,
        onSwitch: rule.onSwitch,
        forOthers: rule.forOthers,
      };
    })
    .filter((theme) => theme.score >= 46 && theme.evidence.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function buildDormantThemes(report: PatternSignatureReport, usedThemeIds: Set<string>): AdvisoryTheme[] {
  return THEME_RULES
    .map((rule) => {
      const naturalScore = averageScore(report.microRoles, rule.roleIds, "natural");
      const strengthScore = averageScore(report.microRoles, rule.roleIds, "strength");
      const evidence = selectedRoles(report.microRoles, rule.roleIds, "natural");
      const gap = naturalScore - strengthScore;
      return {
        id: rule.id,
        title: rule.title,
        shortTitle: rule.shortTitle,
        headline: "Sinyal alami ini ada, tetapi belum tentu sudah sering menjadi aktivitas nyata.",
        body: rule.dormantBody,
        whyItFits: rule.whyItFits,
        healthyUse: rule.healthyUse,
        evidence,
        naturalScore,
        strengthScore,
        score: gap,
        tone: rule.tone,
        onSwitch: rule.onSwitch,
        forOthers: rule.forOthers,
      };
    })
    .filter((theme) => !usedThemeIds.has(theme.id) && theme.naturalScore >= 50 && theme.score >= 9 && theme.evidence.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

function buildVulnerabilities(report: PatternSignatureReport, energyThemeIds: Set<string>): AdvisoryVulnerability[] {
  return VULNERABILITY_RULES
    .map((rule) => {
      const naturalScore = averageScore(report.microRoles, rule.roleIds, "natural");
      const strengthScore = averageScore(report.microRoles, rule.roleIds, "strength");
      const evidence = selectedRoles(report.microRoles, rule.roleIds, "natural");
      const lowNatural = Math.max(0, 58 - naturalScore);
      const pressureGap = Math.max(0, strengthScore - naturalScore);
      const energyConflictBonus = rule.roleIds.some((id) => Array.from(energyThemeIds).some((themeId) => THEME_RULES.find((theme) => theme.id === themeId)?.roleIds.includes(id))) ? 4 : 0;
      const riskScore = Math.round(lowNatural + pressureGap * 0.9 + energyConflictBonus);
      return {
        id: rule.id,
        title: rule.title,
        headline: rule.headline,
        body: rule.body,
        support: rule.support,
        triggerWords: rule.triggerWords,
        evidence,
        naturalScore,
        strengthScore,
        riskScore,
        tone: rule.tone,
      };
    })
    .filter((item) => item.riskScore >= 14 && item.evidence.length > 0)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);
}

function transformSpecificAdaptive(insight: AdaptiveGapInsight, evidence: MicroRoleScore[]): AdvisoryAdaptive {
  const title = insight.title
    .replace("Concept-Led Marketing", "Promosi lewat konsep, bukan basa-basi")
    .replace("Administrative Responsibility Load", "Administrasi karena tanggung jawab")
    .replace("Service Through Duty & Values", "Membantu karena nilai dan tanggung jawab");

  return {
    id: insight.id,
    title,
    headline: "Kamu tampak mampu di area ini, tetapi energi asalnya belum tentu dari sana.",
    body: insight.interpretation,
    emotionalNote:
      "Kalau area ini membuatmu cepat jenuh atau lelah secara emosi, itu bukan berarti kamu lemah. Bisa jadi kamu sedang memakai kemampuan yang terbentuk karena tuntutan hidup, bukan karena itu zona kekuatan alami kamu.",
    recovery:
      "Setelah menjalankan peran ini, beri ruang pulih yang nyata. Kembali sebentar ke aktivitas yang membuatmu hidup: berpikir, berkarya, membantu, menata, atau belajar — sesuai zona kekuatan alami kamu.",
    evidence,
    naturalScore: insight.naturalRouteScore,
    strengthScore: insight.adaptiveLoadScore,
    gap: insight.adaptiveLoadScore - insight.naturalRouteScore,
    source: insight,
  };
}

function buildAdaptiveAdvisories(report: PatternSignatureReport): AdvisoryAdaptive[] {
  const specific = report.adaptiveGapInsights.slice(0, 2).map((insight) => {
    const evidence = report.adaptiveRoles.slice(0, 4);
    return transformSpecificAdaptive(insight, evidence);
  });

  const used = new Set(specific.flatMap((item) => item.evidence.map((role) => role.id)));
  const generic = report.adaptiveRoles
    .filter((role) => !used.has(role.id))
    .filter((role) => role.strength - role.natural >= 12 || role.strength >= 58)
    .slice(0, Math.max(0, 3 - specific.length))
    .map((role) => ({
      id: role.id,
      title: `${displayMicroRoleName(role)} yang sudah terbentuk karena pengalaman`,
      headline: "Kamu bisa menjalankan area ini, tetapi perlu jujur apakah ini mengisi atau menguras energi.",
      body: `Area ${displayMicroRoleName(role)} tampak cukup terlatih dalam hidupmu. Namun jika skor aktivitasnya jauh lebih tinggi daripada zona kekuatan alaminya, kemungkinan area ini berkembang karena pekerjaan, keluarga, tanggung jawab, atau kebutuhan lingkungan.`,
      emotionalNote:
        "Kamu boleh merasa capek setelah menjalankan peran ini. Mampu melakukan sesuatu tidak selalu berarti itu zona kekuatan alami.",
      recovery:
        "Jangan jadikan area ini pusat tuntutan tanpa sistem pendukung. Pakai template, batas waktu, partner, atau jeda pemulihan.",
      evidence: [role],
      naturalScore: role.natural,
      strengthScore: role.strength,
      gap: role.strength - role.natural,
    }));

  return [...specific, ...generic].slice(0, 3);
}

function names(roles: MicroRoleScore[], limit = 3) {
  const selected = roles.slice(0, limit).map((role) => displayMicroRoleName(role));
  if (selected.length === 0) return "beberapa pola energi utama";
  if (selected.length === 1) return selected[0];
  if (selected.length === 2) return `${selected[0]} dan ${selected[1]}`;
  return `${selected.slice(0, -1).join(", ")}, dan ${selected[selected.length - 1]}`;
}

function buildArchetype(energyThemes: AdvisoryTheme[]) {
  const ids = new Set(energyThemes.map((theme) => theme.id));
  if (ids.has("strategy_pattern") && ids.has("knowledge_translation")) return "Pembaca Pola yang Mengubah Pengetahuan Menjadi Arah";
  if (ids.has("strategy_pattern") && ids.has("idea_creation")) return "Perancang Strategi dan Kemungkinan Baru";
  if (ids.has("problem_quality") && ids.has("system_reliability")) return "Penjaga Mutu, Risiko, dan Keteraturan";
  if (ids.has("human_growth") && ids.has("warm_relationship")) return "Penjaga Tumbuh dan Rasa Aman";
  if (ids.has("momentum_action") && ids.has("strategy_pattern")) return "Penggerak Arah Menjadi Tindakan";
  if (ids.has("meaning_values")) return "Penggerak Makna dan Nilai";
  return energyThemes[0]?.title ?? "Pola Energi Personal";
}

function buildMirror(
  report: PatternSignatureReport,
  energyThemes: AdvisoryTheme[],
  vulnerabilities: AdvisoryVulnerability[],
  adaptive: AdvisoryAdaptive[],
) {
  const first = energyThemes[0];
  const second = energyThemes[1];
  const third = energyThemes[2];
  const mainDrain = vulnerabilities[0];
  const mainAdaptive = adaptive[0];
  const alignedCount = report.microRoles.filter((role) => role.natural >= 60 && role.strength >= 55).length;

  const lines: string[] = [];

  if (alignedCount >= 6) {
    lines.push(
      "Kamu tampak sudah cukup mengenal zona kekuatan alami kamu. Banyak potensi alami bukan hanya muncul sebagai bakat, tetapi sudah berubah menjadi kekuatan nyata dalam aktivitas hidupmu.",
    );
  } else {
    lines.push(
      "Hasil ini membaca peta energi kamu: bagian yang membuatmu menyala, bagian yang masih bisa diberi ruang, dan bagian yang perlu batas agar tidak menguras tenaga.",
    );
  }

  if (first && second) {
    lines.push(
      `Kamu adalah tipe orang yang lebih hidup ketika ${first.shortTitle.toLowerCase()} bertemu dengan ${second.shortTitle.toLowerCase()}. Kamu tidak sekadar ingin menyelesaikan tugas; kamu ingin melihat arah, makna, dan bentuk yang lebih jelas dari sesuatu.`,
    );
  } else if (first) {
    lines.push(first.headline);
  }

  if (first) {
    lines.push(
      `${first.body} Di titik terbaikmu, pengetahuan, pengalaman, dan ide tidak berhenti di kepala; kamu ingin mengubahnya menjadi penjelasan, arah, atau karya yang bisa dipakai orang lain.`,
    );
  }

  if (third) {
    lines.push(`Pola lain yang ikut memberi warna adalah ${third.title.toLowerCase()}. Area ini bisa menjadi jalur tambahan agar hidup dan pekerjaan tidak hanya terasa sebagai kewajiban, tetapi juga ruang bertumbuh.`);
  }

  if (mainAdaptive) {
    lines.push(
      `Ada area adaptif yang sudah kamu kuasai karena tuntutan hidup, terutama ${mainAdaptive.title.toLowerCase()}. Kamu bisa terlihat mampu di sana, tetapi tetap perlu ruang pulih karena area itu belum tentu menjadi zona kekuatan alami kamu.`,
    );
  }

  if (mainDrain) {
    lines.push(`Yang perlu dijaga: kamu bisa cepat lelah jika terlalu lama berada di pola ${mainDrain.title.toLowerCase()}.`);
  }

  return cleanList(lines).slice(0, 5);
}

function buildSharpSummary(energyThemes: AdvisoryTheme[], vulnerabilities: AdvisoryVulnerability[]) {
  const energy = energyThemes[0]?.shortTitle.toLowerCase() ?? "zona kekuatan alami kamu";
  const drain = vulnerabilities[0]?.title.toLowerCase() ?? "tuntutan yang tidak selaras dengan caramu bekerja";
  return `Intinya: kamu lebih hidup ketika masuk lewat ${energy}. Kamu lebih mudah lelah ketika terlalu lama dipaksa berada di ${drain}.`;
}

function buildAlignment(report: PatternSignatureReport, adaptiveThemes: AdvisoryAdaptive[], dormantThemes: AdvisoryTheme[]): AlignmentReading {
  const alignedCount = report.microRoles.filter((role) => role.natural >= 60 && role.strength >= 55).length;
  const dormantCount = dormantThemes.length || ((report as { naturalDormantRoles?: unknown[] }).naturalDormantRoles?.length ?? 0);
  const adaptiveCount = adaptiveThemes.length || report.adaptiveRoles.length;

  if (alignedCount >= 6 && adaptiveCount <= 1) {
    return {
      title: "Kamu sudah cukup dekat dengan zona kekuatan alami kamu",
      headline: "Banyak potensi alami sudah berubah menjadi kekuatan nyata dalam aktivitas hidupmu.",
      body:
        dormantCount > 0
          ? "Ini tanda yang sehat: kamu bukan hanya punya bakat, tetapi juga sudah cukup sering menggunakannya. Masih ada beberapa potensi yang bisa diberi panggung lebih luas, tetapi fondasi jati dirimu sudah mulai terbaca cukup selaras."
          : "Ini tanda yang sehat: kamu bukan hanya punya bakat, tetapi juga sudah cukup sering menggunakannya. Pertahankan area ini sebagai zona kekuatan alami kamu, terutama saat hidup terasa berat atau terlalu penuh tuntutan.",
      alignedCount,
      dormantCount,
      adaptiveCount,
    };
  }

  if (adaptiveCount >= 2) {
    return {
      title: "Kamu banyak mengembangkan kemampuan adaptif",
      headline: "Ini menunjukkan daya tahan yang kuat, tetapi juga bisa menjelaskan kenapa kamu merasa lelah meski terlihat produktif.",
      body:
        "Sebagian kekuatan yang tampak dari luar kemungkinan terbentuk karena pekerjaan, tanggung jawab, atau kebutuhan hidup. Ini patut dihargai, tetapi jangan lupa mengisi ulang tenaga dari zona kekuatan alami kamu.",
      alignedCount,
      dormantCount,
      adaptiveCount,
    };
  }

  if (dormantCount >= 2) {
    return {
      title: "Ada potensi alami yang belum sepenuhnya kamu hidupkan",
      headline: "Kamu mungkin punya zona kekuatan alami yang belum banyak diberi panggung dalam aktivitas sehari-hari.",
      body:
        "Jika akhir-akhir ini kamu merasa biasa saja atau kurang menyala, bukan selalu karena tidak punya kemampuan. Bisa jadi ada area alami yang belum cukup sering kamu pakai.",
      alignedCount,
      dormantCount,
      adaptiveCount,
    };
  }

  return {
    title: "Pola kamu masih campuran dan perlu dibaca sebagai peta awal",
    headline: "Ada beberapa sinyal kekuatan, tetapi hasil ini sebaiknya dipakai sebagai bahan refleksi, bukan label final.",
    body:
      "Amati selama 7 hari: aktivitas apa yang membuatmu lebih menyala, dan aktivitas apa yang membuatmu cepat habis. Dari situ peta diri akan terasa lebih nyata.",
    alignedCount,
    dormantCount,
    adaptiveCount,
  };
}

function buildOnSwitch(energyThemes: AdvisoryTheme[]) {
  const lines = energyThemes.flatMap((theme) => theme.onSwitch).filter(Boolean);
  const fallback = [
    "Menurut kamu, pola masalahnya di mana?",
    "Kalau dibuat lebih efektif, sistemnya seperti apa?",
    "Apa ide kamu supaya ini bisa berjalan lebih baik?",
  ];
  const result = [...new Set(lines.length > 0 ? lines : fallback)].filter(Boolean);
  return result.slice(0, 6);
}

function buildForOthers(energyThemes: AdvisoryTheme[], vulnerabilities: AdvisoryVulnerability[]) {
  const lines = energyThemes
    .slice(0, 3)
    .map((theme) => theme.forOthers)
    .filter(Boolean);

  const firstRisk = vulnerabilities[0];
  const triggerWords = firstRisk?.triggerWords ?? [];

  if (firstRisk && triggerWords.length > 0) {
    lines.push(
      `Hindari memulai dengan pola yang membuatnya berat: ${triggerWords.slice(0, 2).join(" / ")}. Masuklah dengan konteks dan kalimat yang lebih tenang.`,
    );
  } else if (firstRisk) {
    lines.push(
      "Hindari memulai dengan tekanan atau instruksi yang terlalu mendadak. Masuklah dengan konteks, alasan, dan kalimat yang lebih tenang.",
    );
  }

  return [...new Set(lines)].slice(0, 4);
}

function buildResistance(vulnerabilities: AdvisoryVulnerability[]) {
  if (vulnerabilities.length === 0) return ["Instruksi mendadak tanpa konteks bisa membuat energi turun sebelum kamu sempat bergerak."];
  return vulnerabilities.slice(0, 4).map((item) => item.headline);
}

function buildRecoveryRituals(energyThemes: AdvisoryTheme[], adaptiveThemes: AdvisoryAdaptive[]) {
  const rituals = [
    "Ambil jeda singkat setelah peran yang menguras. Jangan langsung menilai diri malas; cek dulu apakah kamu terlalu lama memakai mode adaptif.",
  ];

  if (energyThemes[0]) rituals.push(`Kembalikan tenaga lewat zona kekuatan alami: ${energyThemes[0].shortTitle.toLowerCase()}. Jadikan ini sebagai aktivitas pemulihan kecil, bukan target berat.`);
  if (energyThemes[1]) rituals.push(`Sisihkan waktu mingguan untuk ${energyThemes[1].shortTitle.toLowerCase()} agar hidup tidak hanya berisi tuntutan.`);
  if (adaptiveThemes[0]) rituals.push(adaptiveThemes[0].recovery);

  rituals.push("Kamu tidak harus hebat di semua area. Kekuatan yang sehat dimulai dari mengenali mana zona kekuatan alami, mana area yang perlu sistem pendukung.");

  return [...new Set(rituals)].slice(0, 4);
}

function buildQualityNote(quality: ReadingQuality) {
  if (quality.level === "Stabil") return "Pola jawaban cukup stabil untuk dibaca sebagai refleksi diri yang relatif konsisten.";
  if (quality.level === "Cukup Stabil") return "Pola jawaban cukup bisa dibaca, tetapi beberapa area tetap sebaiknya dianggap sebagai sinyal refleksi, bukan label final.";
  return "Pola jawaban perlu dibaca hati-hati. Gunakan hasil ini sebagai bahan obrolan dengan diri sendiri, bukan sebagai vonis kepribadian.";
}

export function buildSmartResultAdvisory(
  report: PatternSignatureReport,
  quality: ReadingQuality,
  lens: PurposeLens,
): SmartResultAdvisory {
  const rawEnergyThemes = buildEnergyThemes(report);
  const energyThemeIds = new Set(rawEnergyThemes.map((theme) => theme.id));
  const rawVulnerabilities = buildVulnerabilities(report, energyThemeIds);
  const rawAdaptiveThemes = buildAdaptiveAdvisories(report);
  const rawDormantThemes = buildDormantThemes(report, energyThemeIds);

  const energyThemes = rawEnergyThemes.map(cleanTheme);
  const vulnerabilities = rawVulnerabilities.map(cleanVulnerability);
  const adaptiveThemes = rawAdaptiveThemes.map(cleanAdaptive);
  const dormantThemes = rawDormantThemes.map(cleanTheme);
  const archetype = cleanLanguage(buildArchetype(energyThemes));
  const mirror = buildMirror(report, energyThemes, vulnerabilities, adaptiveThemes);
  const alignment = buildAlignment(report, adaptiveThemes, dormantThemes);

  const contextPrefix = cleanLanguage(
    lens.key === "relationship_family"
      ? "Untuk konteks pasangan atau keluarga, hasil ini dibaca dari profil kamu dulu. Insight dua arah akan jauh lebih akurat jika pasangan juga mengisi asesmen."
      : lens.summaryFrame,
  );

  return {
    title: cleanLanguage(lens.summaryTitle),
    archetype,
    mirrorTitle: "Kamu itu orang yang...",
    mirror: cleanList(mirror),
    sharpSummary: cleanLanguage(buildSharpSummary(energyThemes, vulnerabilities)),
    alignment: {
      ...alignment,
      title: cleanLanguage(alignment.title),
      headline: cleanLanguage(alignment.headline),
      body: cleanLanguage(alignment.body),
    },
    energyThemes,
    vulnerabilities,
    adaptiveThemes,
    dormantThemes,
    onSwitch: cleanList(buildOnSwitch(energyThemes), [
      "Menurut kamu, pola masalahnya di mana?",
      "Kalau dibuat lebih efektif, sistemnya seperti apa?",
      "Apa ide kamu supaya ini bisa berjalan lebih baik?",
    ]),
    forOthers: cleanList(buildForOthers(energyThemes, vulnerabilities)),
    resistance: cleanList(buildResistance(vulnerabilities)),
    recoveryRituals: cleanList(buildRecoveryRituals(energyThemes, adaptiveThemes)),
    selfCare: cleanList([
      contextPrefix,
      alignment.body,
      "Kalau hasil ini terasa menampar pelan, jadikan ia peta, bukan penjara. Kamu tetap bisa bertumbuh, tetapi lebih sehat jika bertumbuh dari zona kekuatan alami kamu.",
    ]),
    evidenceLine: cleanLanguage(`Pembacaan ini terutama terlihat dari kombinasi ${names(report.topNaturalRoles, 4)}. Angka detail tetap tersedia di bagian peta pendukung, tetapi makna utamanya dibaca dari kombinasi pola, bukan skor tunggal.`),
    qualityNote: cleanLanguage(buildQualityNote(quality)),
  };
}
