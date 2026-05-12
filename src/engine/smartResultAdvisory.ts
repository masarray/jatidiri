import type { PurposeLens } from "@/data/purposeLens";
import type { ReadingQuality } from "@/types/assessment";
import type {
  AdaptiveGapInsight,
  MicroRoleScore,
  PatternSignatureReport,
} from "@/engine/patternSignature";
import type { MicroRoleId } from "@/data/microRoles";

export interface AdvisoryTheme {
  id: string;
  title: string;
  headline: string;
  body: string;
  evidence: MicroRoleScore[];
  score: number;
}

export interface AdvisoryVulnerability {
  id: string;
  title: string;
  headline: string;
  body: string;
  support: string;
  evidence: MicroRoleScore[];
  score: number;
}

export interface AdvisoryAdaptive {
  id: string;
  title: string;
  body: string;
  emotionalNote: string;
  recovery: string;
  evidence: MicroRoleScore[];
  score: number;
  source?: AdaptiveGapInsight;
}

export interface SmartResultAdvisory {
  title: string;
  archetype: string;
  mirror: string[];
  coreSentence: string;
  energyThemes: AdvisoryTheme[];
  vulnerabilities: AdvisoryVulnerability[];
  adaptiveThemes: AdvisoryAdaptive[];
  dormantThemes: AdvisoryTheme[];
  onSwitch: string[];
  resistance: string[];
  selfCare: string[];
  evidenceLine: string;
  qualityNote: string;
}

interface ThemeRule {
  id: string;
  title: string;
  roleIds: MicroRoleId[];
  minScore?: number;
  headline: (roles: MicroRoleScore[]) => string;
  body: (roles: MicroRoleScore[]) => string;
  dormantBody?: (roles: MicroRoleScore[]) => string;
}

interface VulnerabilityRule {
  id: string;
  title: string;
  roleIds: MicroRoleId[];
  headline: (roles: MicroRoleScore[]) => string;
  body: (roles: MicroRoleScore[]) => string;
  support: (roles: MicroRoleScore[]) => string;
}

const ENERGY_RULES: ThemeRule[] = [
  {
    id: "strategy_pattern",
    title: "Membaca pola dan menyusun strategi",
    roleIds: ["strategy_designer", "pattern_reader", "information_collector", "deep_thinker", "risk_checker"],
    headline: () => "Kamu lebih hidup ketika diberi masalah yang perlu dibaca polanya, bukan sekadar disuruh menjalankan instruksi.",
    body: () =>
      "Ada bagian dalam dirimu yang mencari alasan, arah, dan pola sebelum bergerak. Ketika orang bertanya ‘strategi terbaiknya apa?’ atau ‘jalan paling masuk akal yang mana?’, energi berpikirmu biasanya lebih cepat menyala.",
    dormantBody: () =>
      "Kamu punya sinyal alami untuk membaca pola dan strategi, tetapi belum tentu sudah cukup sering diberi ruang untuk memakainya. Jika diberi proyek kecil untuk menyusun arah, konsep, atau perbaikan sistem, area ini bisa cepat hidup.",
  },
  {
    id: "knowledge_translation",
    title: "Mengolah pengetahuan menjadi penjelasan",
    roleIds: ["idea_translator", "information_collector", "fast_learner", "deep_thinker", "mentor_coach"],
    headline: () => "Kamu bukan hanya suka tahu; kamu ingin sesuatu yang rumit bisa dipahami dengan lebih jernih.",
    body: () =>
      "Energi muncul ketika kamu bisa mengumpulkan bahan, memahami konteks, lalu mengubahnya menjadi bahasa yang lebih sederhana. Kamu bisa terasa sangat hidup saat menjelaskan, menulis, mengajar, membuat demo, atau menerjemahkan ide menjadi sesuatu yang bisa dipakai orang lain.",
    dormantBody: () =>
      "Ada potensi untuk menjadi penerjemah ide atau pengajar yang kuat. Kalau belum banyak terlihat, mungkin bukan karena tidak mampu, tetapi karena belum ada ruang yang tepat untuk mengubah pengetahuan menjadi karya yang dibaca, didengar, atau dipakai orang lain.",
  },
  {
    id: "idea_creation",
    title: "Membuat ide dan kemungkinan baru",
    roleIds: ["idea_synthesizer", "creative_designer", "future_mapper", "strategy_designer", "idea_translator"],
    headline: () => "Kamu lebih mudah bersemangat ketika ada ruang membayangkan kemungkinan baru.",
    body: () =>
      "Kamu cenderung tidak puas hanya menerima bentuk yang sudah ada. Ada dorongan untuk menggabungkan ide, membuat konsep, melihat masa depan, dan mencari cara agar sesuatu terasa lebih menarik atau lebih bermakna.",
    dormantBody: () =>
      "Imajinasi dan kemampuan membuat konsep mungkin ada, tetapi belum selalu menjadi aktivitas rutin. Mulailah dari eksperimen kecil: satu tulisan, satu konsep, satu prototype, atau satu ide yang selesai dibentuk.",
  },
  {
    id: "problem_quality",
    title: "Mendiagnosis masalah dan menjaga kualitas",
    roleIds: ["problem_restorer", "quality_evaluator", "pattern_reader", "risk_checker", "commitment_keeper"],
    headline: () => "Kamu lebih tenang ketika sesuatu bisa diuji, diperiksa, dan dikembalikan ke kondisi yang lebih benar.",
    body: () =>
      "Kamu punya energi untuk mencari akar masalah, memeriksa kualitas, dan memastikan keputusan tidak hanya terasa cepat tetapi juga cukup benar. Orang lain mungkin melihatmu kritis; sebenarnya kamu sedang menjaga agar sesuatu tidak asal jalan.",
    dormantBody: () =>
      "Kemampuan mendiagnosis dan menjaga kualitas bisa menjadi kekuatan besar jika diberi ruang yang jelas. Jangan hanya dipakai saat krisis; pakai juga untuk membuat sistem pencegahan.",
  },
  {
    id: "system_reliability",
    title: "Menata sistem, janji, dan keteraturan",
    roleIds: ["system_organizer", "commitment_keeper", "consistency_guardian", "quality_evaluator", "operational_executor"],
    headline: () => "Kamu lebih mudah bergerak ketika alur, standar, dan tanggung jawab terlihat jelas.",
    body: () =>
      "Kekuatan ini membuatmu ingin sesuatu tidak tercecer: janji dijaga, prosedur jelas, hasil bisa dipercaya. Jika lingkungan terlalu kacau atau ekspektasi berubah tanpa alasan, energi mentalmu bisa cepat terkuras.",
    dormantBody: () =>
      "Ada potensi membangun keteraturan, tetapi belum tentu sudah dipakai sebagai kekuatan utama. Cobalah membuat sistem kecil yang meringankan hidupmu, bukan sistem besar yang justru menambah beban.",
  },
  {
    id: "human_growth",
    title: "Membantu orang bertumbuh",
    roleIds: ["people_developer", "mentor_coach", "relationship_keeper", "emotion_reader", "harmony_keeper"],
    headline: () => "Kamu bisa menyala ketika melihat seseorang menjadi lebih mampu, lebih tenang, atau lebih percaya diri.",
    body: () =>
      "Kekuatan ini bukan sekadar baik hati. Kamu cenderung menangkap potensi orang dan merasa bermakna ketika kontribusimu membuat orang lain bertumbuh. Namun kamu tetap perlu batas agar tidak semua beban orang lain kamu bawa pulang.",
    dormantBody: () =>
      "Ada potensi mendampingi orang, tetapi mungkin belum kamu bentuk sebagai peran yang jelas. Mulailah dari mendengar, memberi feedback kecil, atau membantu satu orang bertumbuh tanpa mengambil alih hidupnya.",
  },
  {
    id: "warm_relationship",
    title: "Membangun kehangatan dan rasa diterima",
    roleIds: ["relationship_keeper", "social_connector", "group_includer", "emotion_reader", "harmony_keeper"],
    headline: () => "Kamu lebih mudah terbuka ketika hubungan terasa aman, hangat, dan tidak menghakimi.",
    body: () =>
      "Bagi pola ini, suasana hubungan sering menjadi pintu masuk sebelum pesan bisa diterima. Kamu dapat menjadi penghangat relasi, penjaga kedekatan, atau orang yang membuat orang lain merasa tidak sendirian.",
    dormantBody: () =>
      "Potensi relasional ada, tetapi mungkin belum selalu diekspresikan. Bangun lewat percakapan kecil yang konsisten, bukan harus selalu menjadi orang paling ramai.",
  },
  {
    id: "momentum_action",
    title: "Mengubah arah menjadi tindakan",
    roleIds: ["action_mover", "decision_director", "achievement_driver", "complexity_arranger", "strategy_designer"],
    headline: () => "Kamu lebih hidup ketika ada tujuan yang jelas dan sesuatu perlu segera digerakkan.",
    body: () =>
      "Energi muncul ketika keputusan tidak berhenti sebagai wacana. Kamu bisa menjadi pendorong momentum, pembuka jalan, atau orang yang membuat situasi mulai bergerak. Tantangannya adalah memastikan orang lain tidak tertinggal oleh tempo gerakmu.",
    dormantBody: () =>
      "Ada potensi menggerakkan, tetapi mungkin belum selalu percaya diri mengambil posisi. Mulailah dari keputusan kecil yang jelas, bukan menunggu semua hal sempurna.",
  },
  {
    id: "meaning_values",
    title: "Bergerak karena makna dan nilai",
    roleIds: ["meaning_keeper", "commitment_keeper", "people_developer", "consistency_guardian", "future_mapper"],
    headline: () => "Kamu lebih kuat ketika tahu bahwa yang kamu lakukan punya makna dan manfaat.",
    body: () =>
      "Kamu bisa kehilangan energi jika suatu aktivitas terasa kosong, tidak sesuai nilai, atau hanya mengejar hasil tanpa alasan yang bermakna. Sebaliknya, ketika tujuan terasa benar, kamu bisa jauh lebih tahan berjuang.",
    dormantBody: () =>
      "Nilai dan makna bisa menjadi kompas besar. Tuliskan alasan kenapa sebuah peran penting bagimu, agar energi tidak hanya bergantung pada mood harian.",
  },
];

const VULNERABILITY_RULES: VulnerabilityRule[] = [
  {
    id: "social_breadth_drain",
    title: "Basa-basi sosial yang terlalu panjang",
    roleIds: ["social_connector", "group_includer", "relationship_keeper", "emotion_reader"],
    headline: () => "Kamu mungkin bisa berinteraksi, tetapi belum tentu terisi oleh relasi yang terlalu melebar dan dangkal.",
    body: () =>
      "Jika area sosial tidak menjadi sumber energi alami, tuntutan untuk selalu menyapa, ramah, follow-up, atau menjaga suasana banyak orang bisa terasa cepat melelahkan. Kamu mungkin lebih kuat menjelaskan nilai daripada terus menjaga basa-basi.",
    support: () =>
      "Gunakan template komunikasi, batasi jumlah interaksi intensif, dan beri waktu pemulihan setelah aktivitas sosial panjang.",
  },
  {
    id: "routine_admin_drain",
    title: "Rutinitas administratif yang berulang",
    roleIds: ["system_organizer", "operational_executor", "consistency_guardian", "quality_evaluator"],
    headline: () => "Kamu bisa menjalankan tugas rutin, tetapi jangan sampai seluruh hidupmu hanya menjadi daftar pekerjaan kecil.",
    body: () =>
      "Jika keteraturan operasional bukan sumber energi utama, laporan, file, input data, jadwal, dan detail berulang bisa menghabiskan tenaga diam-diam. Kamu tetap bisa disiplin karena tanggung jawab, tetapi perlu sistem agar energi terbaikmu tidak habis di sini.",
    support: () =>
      "Pakai checklist, batching, reminder, template, delegasi, atau partner yang lebih natural di area detail dan rutinitas.",
  },
  {
    id: "emotion_absorption_drain",
    title: "Menampung emosi terlalu banyak",
    roleIds: ["emotion_reader", "harmony_keeper", "people_developer", "relationship_keeper"],
    headline: () => "Kamu tidak harus selalu menjadi tempat semua orang menaruh beban emosinya.",
    body: () =>
      "Kalau kepekaan emosional tidak menjadi sumber energi utama, tuntutan untuk selalu peka, menenangkan, atau menjaga perasaan semua orang dapat membuatmu lelah. Membantu orang tetap baik, tetapi memikul seluruh emosinya bukan kewajibanmu.",
    support: () =>
      "Beri batas bantuan, gunakan kalimat validasi sederhana, lalu sepakati langkah praktis agar kamu tidak terserap terlalu dalam.",
  },
  {
    id: "fast_action_drain",
    title: "Keputusan cepat tanpa cukup konteks",
    roleIds: ["action_mover", "decision_director", "achievement_driver", "risk_checker"],
    headline: () => "Kamu bisa tegang ketika dipaksa bergerak cepat sebelum arah dan risikonya cukup jelas.",
    body: () =>
      "Jika kamu butuh memahami pola dulu, instruksi yang terlalu mendadak bisa terasa menekan. Orang lain mungkin melihatmu lambat, padahal otakmu sedang mencari struktur agar tindakan tidak asal jalan.",
    support: () =>
      "Minta konteks minimum: tujuan, batas waktu, risiko terbesar, dan definisi selesai. Setelah itu, batasi waktu berpikir agar tidak berubah menjadi penundaan.",
  },
  {
    id: "conflict_directness_drain",
    title: "Konflik langsung dan tekanan suara tinggi",
    roleIds: ["decision_director", "harmony_keeper", "emotion_reader", "risk_checker"],
    headline: () => "Cara bicara yang terlalu keras bisa membuat isi pesan kalah oleh rasa tertekan.",
    body: () =>
      "Jika kamu tidak natural di konflik frontal, nada tinggi, instruksi tajam, atau perdebatan menang-kalah bisa cepat menguras energi. Kamu mungkin tetap bisa menghadapi, tetapi butuh jeda agar tidak menjadi defensif.",
    support: () =>
      "Minta pesan disampaikan lebih spesifik, lebih tenang, dan fokus pada masalah, bukan menyudutkan pribadi.",
  },
  {
    id: "unstructured_chaos_drain",
    title: "Situasi yang kacau tanpa alur",
    roleIds: ["complexity_arranger", "system_organizer", "strategy_designer", "risk_checker"],
    headline: () => "Kamu bisa lelah saat semua hal bercampur tanpa prioritas, alur, atau pemilik tugas yang jelas.",
    body: () =>
      "Kalau energi alamimu butuh struktur atau strategi, situasi yang terlalu cair dapat membuatmu menghabiskan banyak tenaga hanya untuk memahami ‘sebenarnya ini arahnya ke mana’. Kelelahannya bukan karena tidak mau, tetapi karena terlalu banyak noise.",
    support: () =>
      "Pisahkan masalah, pilih prioritas, tentukan pemilik tugas, dan buat keputusan kecil yang bisa segera diuji.",
  },
  {
    id: "physical_operational_drain",
    title: "Pekerjaan teknis-fisik yang tidak memberi makna",
    roleIds: ["operational_executor", "problem_restorer", "quality_evaluator", "creative_designer"],
    headline: () => "Aktivitas praktis bisa terasa berat jika tidak terhubung dengan makna, sistem, atau hasil yang kamu pedulikan.",
    body: () =>
      "Ada pekerjaan yang sebenarnya sederhana, tetapi terasa berat karena tidak menyentuh sumber energi alamimu. Bukan berarti kamu tidak bisa; hanya saja area ini butuh alasan, sistem, atau pembagian peran agar tidak menjadi beban psikologis.",
    support: () =>
      "Ubah tugas menjadi sistem kecil, pasangkan dengan tujuan yang jelas, atau bagi peran dengan orang yang lebih ringan menjalankannya.",
  },
];

function byId(roles: MicroRoleScore[], id: MicroRoleId) {
  return roles.find((role) => role.id === id);
}

function roleScore(roles: MicroRoleScore[], ids: MicroRoleId[], mode: "natural" | "strength" = "natural") {
  const selected = ids.map((id) => byId(roles, id)).filter((role): role is MicroRoleScore => Boolean(role));
  if (selected.length === 0) return 0;
  const weighted = selected.reduce((sum, role) => sum + role[mode], 0) / selected.length;
  const topBonus = selected.some((role) => role[mode] >= 70) ? 6 : 0;
  return Math.round(weighted + topBonus);
}

function selectedRoles(roles: MicroRoleScore[], ids: MicroRoleId[], mode: "natural" | "strength" = "natural") {
  return ids
    .map((id) => byId(roles, id))
    .filter((role): role is MicroRoleScore => Boolean(role))
    .sort((a, b) => b[mode] - a[mode])
    .slice(0, 4);
}

function buildEnergyThemes(report: PatternSignatureReport): AdvisoryTheme[] {
  return ENERGY_RULES
    .map((rule) => {
      const evidence = selectedRoles(report.microRoles, rule.roleIds, "natural");
      const score = roleScore(report.microRoles, rule.roleIds, "natural");
      return {
        id: rule.id,
        title: rule.title,
        headline: rule.headline(evidence),
        body: rule.body(evidence),
        evidence,
        score,
      };
    })
    .filter((theme) => theme.score >= 48 && theme.evidence.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildDormantThemes(report: PatternSignatureReport, energyIds: Set<string>): AdvisoryTheme[] {
  return ENERGY_RULES
    .map((rule) => {
      const evidence = selectedRoles(report.naturalDormantRoles.length > 0 ? report.naturalDormantRoles : report.microRoles, rule.roleIds, "natural");
      const score = roleScore(report.microRoles, rule.roleIds, "natural") - roleScore(report.microRoles, rule.roleIds, "strength");
      return {
        id: rule.id,
        title: rule.title,
        headline: `Potensi ini ada, tetapi belum tentu sudah sering kamu pakai sebagai kekuatan nyata.`,
        body: rule.dormantBody?.(evidence) ?? rule.body(evidence),
        evidence,
        score,
      };
    })
    .filter((theme) => !energyIds.has(theme.id) && theme.score >= 8 && theme.evidence.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildVulnerabilities(report: PatternSignatureReport): AdvisoryVulnerability[] {
  return VULNERABILITY_RULES
    .map((rule) => {
      const evidence = selectedRoles(report.microRoles, rule.roleIds, "natural");
      const averageNatural = roleScore(report.microRoles, rule.roleIds, "natural");
      const averageStrength = roleScore(report.microRoles, rule.roleIds, "strength");
      const lowNaturalSignal = Math.max(0, 62 - averageNatural);
      const adaptivePressure = Math.max(0, averageStrength - averageNatural);
      const score = Math.round(lowNaturalSignal + adaptivePressure * 0.75);
      return {
        id: rule.id,
        title: rule.title,
        headline: rule.headline(evidence),
        body: rule.body(evidence),
        support: rule.support(evidence),
        evidence,
        score,
      };
    })
    .filter((item) => item.score >= 18 && item.evidence.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildAdaptiveAdvisories(report: PatternSignatureReport): AdvisoryAdaptive[] {
  const specific = report.adaptiveGapInsights.slice(0, 2).map((insight) => {
    const evidence = report.adaptiveRoles.slice(0, 4);
    return {
      id: insight.id,
      title: insight.title.replace("Concept-Led Marketing", "Promosi lewat konsep, bukan basa-basi").replace("Administrative Responsibility Load", "Administrasi karena tanggung jawab").replace("Service Through Duty & Values", "Membantu karena nilai dan tanggung jawab"),
      body: insight.interpretation,
      emotionalNote:
        "Jika bagian ini membuatmu lelah, itu bukan berarti kamu lemah. Bisa jadi kamu sedang menjalankan kemampuan yang sudah terlatih karena hidup menuntutmu, tetapi bukan rumah energi alamimu.",
      recovery:
        "Berikan jeda pemulihan setelah menjalankan peran ini. Pakai sistem, template, partner, atau pembagian peran agar kamu tidak terus-menerus memakai mode adaptif.",
      evidence,
      score: insight.score,
      source: insight,
    };
  });

  const existing = new Set(specific.map((item) => item.id));
  const generic = report.adaptiveRoles
    .filter((role) => !existing.has(role.id))
    .slice(0, Math.max(0, 3 - specific.length))
    .map((role) => ({
      id: role.id,
      title: `${role.name} yang terbentuk karena tuntutan peran`,
      body: `Kamu tampak cukup mampu menjalankan area ${role.name}. Namun jarak antara kekuatan aktivitas dan energi alaminya menunjukkan bahwa area ini kemungkinan lebih banyak terbentuk karena pengalaman, pekerjaan, tanggung jawab, atau kebutuhan lingkungan.`,
      emotionalNote:
        "Kamu boleh mengakui bahwa area ini melelahkan, meskipun orang lain melihat kamu bisa melakukannya.",
      recovery:
        "Jangan jadikan area ini sebagai pusat hidup tanpa kompensasi. Beri ruang kembali ke sumber energi utama setelah periode tuntutan selesai.",
      evidence: [role],
      score: role.strength,
    }));

  return [...specific, ...generic].slice(0, 3);
}

function names(roles: MicroRoleScore[], limit = 3) {
  const selected = roles.slice(0, limit).map((role) => role.name);
  if (selected.length === 0) return "beberapa pola energi utama";
  if (selected.length === 1) return selected[0];
  if (selected.length === 2) return `${selected[0]} dan ${selected[1]}`;
  return `${selected.slice(0, -1).join(", ")}, dan ${selected[selected.length - 1]}`;
}

function buildArchetype(themes: AdvisoryTheme[]) {
  const ids = new Set(themes.slice(0, 3).map((theme) => theme.id));
  if (ids.has("strategy_pattern") && ids.has("knowledge_translation")) return "Pembaca Pola yang Mengubah Ide Menjadi Arah";
  if (ids.has("human_growth") && ids.has("warm_relationship")) return "Penjaga Tumbuh dan Rasa Aman";
  if (ids.has("system_reliability") && ids.has("problem_quality")) return "Penjaga Kualitas dan Keteraturan";
  if (ids.has("idea_creation") && ids.has("future_vision")) return "Perancang Kemungkinan Baru";
  if (ids.has("momentum_action")) return "Penggerak Arah Menjadi Tindakan";
  return themes[0]?.title ?? "Pola Energi Personal";
}

function buildMirror(report: PatternSignatureReport, energyThemes: AdvisoryTheme[], vulnerabilities: AdvisoryVulnerability[], adaptive: AdvisoryAdaptive[]) {
  const top = report.topNaturalRoles;
  const strongest = names(top, 3);
  const firstTheme = energyThemes[0];
  const secondTheme = energyThemes[1];
  const mainDrain = vulnerabilities[0];
  const mainAdaptive = adaptive[0];

  const lines = [
    `Kamu tampak sebagai orang yang lebih mudah menyala ketika berada di wilayah ${strongest}.`,
    firstTheme
      ? firstTheme.headline
      : "Energi kamu lebih mudah muncul ketika aktivitas terasa punya arah, alasan, dan ruang untuk memakai kekuatan yang natural.",
    secondTheme
      ? secondTheme.body
      : "Ketika lingkungan memberi cara masuk yang tepat, kamu bisa bergerak lebih ringan dan tidak terlalu merasa dipaksa menjadi orang lain.",
  ];

  if (mainDrain) {
    lines.push(`Yang perlu dijaga: ${mainDrain.headline}`);
  }

  if (mainAdaptive) {
    lines.push(
      `Ada juga area yang mungkin sudah kamu kuasai karena tuntutan hidup. Kamu bisa terlihat mampu di sana, tetapi bukan berarti area itu selalu mengisi energi batinmu.`,
    );
  }

  return lines;
}

function buildOnSwitch(themes: AdvisoryTheme[], topRoles: MicroRoleScore[]) {
  const ids = new Set(themes.map((theme) => theme.id));
  const lines: string[] = [];

  if (ids.has("strategy_pattern")) {
    lines.push("“Menurut kamu strategi terbaiknya apa?”");
    lines.push("“Kalau dibuat lebih efektif, sistemnya seperti apa?”");
  }
  if (ids.has("knowledge_translation")) lines.push("“Bisa bantu jelaskan ini supaya lebih mudah dipahami?”");
  if (ids.has("idea_creation")) lines.push("“Apa ide kamu supaya ini lebih menarik atau lebih hidup?”");
  if (ids.has("problem_quality")) lines.push("“Menurutmu akar masalahnya di mana?”");
  if (ids.has("system_reliability")) lines.push("“Biar rapi dan tidak bolak-balik, alur paling aman bagaimana?”");
  if (ids.has("human_growth")) lines.push("“Menurutmu cara membantu orang ini bertumbuh apa?”");
  if (ids.has("momentum_action")) lines.push("“Langkah pertama yang paling masuk akal apa?”");

  if (lines.length === 0 && topRoles[0]) lines.push(`“Menurutmu cara terbaik memakai kekuatan ${topRoles[0].name} ini bagaimana?”`);
  return [...new Set(lines)].slice(0, 5);
}

function buildResistance(vulnerabilities: AdvisoryVulnerability[]) {
  const lines = vulnerabilities.map((item) => item.headline);
  if (lines.length === 0) {
    lines.push("Instruksi yang datang tiba-tiba tanpa konteks bisa membuat energi turun sebelum kamu sempat bergerak.");
  }
  return lines.slice(0, 4);
}

function buildSelfCare(vulnerabilities: AdvisoryVulnerability[], adaptive: AdvisoryAdaptive[]) {
  const lines = [
    "Saat lelah, jangan langsung menyimpulkan bahwa kamu malas atau kurang kuat. Tanyakan dulu: apakah aku terlalu lama hidup di area yang bukan sumber energi alamiku?",
  ];

  if (adaptive.length > 0) {
    lines.push(
      "Kalau kamu sedang banyak memakai kemampuan adaptif, jadwalkan pemulihan yang nyata: tidur cukup, jeda dari tuntutan sosial, ruang berpikir, atau aktivitas kecil yang membuatmu kembali merasa menjadi diri sendiri.",
    );
  }

  if (vulnerabilities[0]) lines.push(vulnerabilities[0].support);

  lines.push("Kekuatan yang sehat bukan berarti kamu harus kuat di semua area. Justru kamu perlu tahu mana rumah energimu dan mana area yang perlu sistem pendukung.");

  return lines.slice(0, 4);
}

function buildQualityNote(quality: ReadingQuality) {
  if (quality.level === "Stabil") return "Pola jawaban cukup stabil untuk dibaca sebagai refleksi diri yang relatif konsisten.";
  if (quality.level === "Cukup Stabil") return "Pola jawaban cukup bisa dibaca, tetapi beberapa area sebaiknya dianggap sebagai sinyal awal, bukan kesimpulan mutlak.";
  return "Pola jawaban perlu dibaca hati-hati. Gunakan hasil ini sebagai bahan refleksi, bukan label final tentang diri.";
}

export function buildSmartResultAdvisory(
  report: PatternSignatureReport,
  quality: ReadingQuality,
  lens: PurposeLens,
): SmartResultAdvisory {
  const energyThemes = buildEnergyThemes(report);
  const energyIds = new Set(energyThemes.map((theme) => theme.id));
  const vulnerabilities = buildVulnerabilities(report);
  const adaptiveThemes = buildAdaptiveAdvisories(report);
  const dormantThemes = buildDormantThemes(report, energyIds);
  const archetype = buildArchetype(energyThemes);
  const mirror = buildMirror(report, energyThemes, vulnerabilities, adaptiveThemes);

  const purposeFrame = lens.key === "relationship_family"
    ? "Hasil ini dibaca dari sudut diri kamu terlebih dahulu. Bagian pasangan nanti sebaiknya memakai dua profil agar tidak menebak sepihak."
    : lens.summaryFrame;

  return {
    title: lens.summaryTitle,
    archetype,
    mirror,
    coreSentence: purposeFrame,
    energyThemes,
    vulnerabilities,
    adaptiveThemes,
    dormantThemes,
    onSwitch: buildOnSwitch(energyThemes, report.topNaturalRoles),
    resistance: buildResistance(vulnerabilities),
    selfCare: buildSelfCare(vulnerabilities, adaptiveThemes),
    evidenceLine: `Pembacaan ini terutama terlihat dari kombinasi ${names(report.topNaturalRoles, 4)}. Detail skor tetap tersedia di bagian peta pendukung di bawah.`,
    qualityNote: buildQualityNote(quality),
  };
}
