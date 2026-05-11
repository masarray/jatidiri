import type { MicroRoleScore } from "@/engine/patternSignature";
import type { PurposeKey } from "@/data/purposeLens";
import type { MicroRoleId } from "@/data/microRoles";

export interface CommunicationSwitchProfile {
  id: string;
  title: string;
  summary: string;
  onSwitch: string[];
  resistanceTrigger: string[];
  reframeExample: {
    raw: string;
    better: string;
  };
  partnerNote: string;
  parentingNote?: string;
}

interface SwitchRule {
  id: string;
  priority: number;
  roleIds: MicroRoleId[];
  title: string;
  summary: string;
  onSwitch: string[];
  resistanceTrigger: string[];
  reframeExample: {
    raw: string;
    better: string;
  };
  partnerNote: string;
  parentingNote?: string;
}

const SWITCH_RULES: SwitchRule[] = [
  {
    id: "strategy_concept",
    priority: 100,
    roleIds: ["strategy_designer", "idea_synthesizer", "idea_translator", "information_collector", "pattern_reader", "deep_thinker", "future_mapper"],
    title: "Strategy & Concept Switch",
    summary:
      "Orang dengan pola ini biasanya lebih cepat hidup ketika diajak masuk lewat strategi, sistem, kemungkinan, konsep, atau makna di balik sebuah aktivitas. Aktivitas yang sama bisa terasa berat bila dibungkus sebagai instruksi rutin, tetapi menjadi menarik ketika dibuka sebagai problem yang perlu dirancang solusinya.",
    onSwitch: [
      "Mulai dengan pertanyaan strategi: “Menurutmu cara paling efisien supaya ini berjalan apa?”",
      "Beri konteks sebelum meminta tindakan: alasan, tujuan, dan pola besarnya.",
      "Ajak ia merancang sistem, alur, atau konsep; bukan hanya menjalankan instruksi.",
      "Gunakan kalimat seperti: “Boleh bantu pikirkan cara supaya ini lebih ringan untuk kita?”",
    ],
    resistanceTrigger: [
      "Instruksi kaku tanpa konteks: “Pokoknya kerjakan dulu.”",
      "Tugas repetitif yang terasa tidak punya makna atau strategi.",
      "Memotong ide sebelum ia selesai menjelaskan pola pikirnya.",
      "Menilai ia lambat hanya karena sedang memetakan masalah terlebih dahulu.",
    ],
    reframeExample: {
      raw: "Ayo beberes sekarang.",
      better: "Gimana strategi supaya rumah ini lebih rapi tanpa kita capek terus? Bisa bantu bikin sistemnya?",
    },
    partnerNote:
      "Pasangan sebaiknya tidak hanya meminta tindakan, tetapi membuka pintu lewat strategi. Ketika ia diajak berpikir tentang sistem, arah, dan solusi, aktivitas yang semula terasa rutin bisa berubah menjadi ruang kontribusi yang membuatnya lebih hidup.",
    parentingNote:
      "Dalam parenting, libatkan pola ini untuk menyusun aturan rumah, alur rutinitas, dan cara menjelaskan alasan kepada anak. Ia biasanya lebih kuat saat membangun sistem pengasuhan daripada sekadar merespons kekacauan harian secara spontan.",
  },
  {
    id: "safety_care",
    priority: 95,
    roleIds: ["commitment_keeper", "people_developer", "mentor_coach", "relationship_keeper", "harmony_keeper", "emotion_reader", "meaning_keeper"],
    title: "Safety & Care Switch",
    summary:
      "Orang dengan pola ini lebih mudah menerima masukan ketika merasa dihargai, aman, dan tidak sedang disudutkan. Ia bisa sangat kuat dalam tanggung jawab, pelayanan, dan menjaga relasi; tetapi masukan yang terlalu tajam dapat terdengar seperti menyalahkan, bukan membantu.",
    onSwitch: [
      "Mulai dengan pengakuan: “Aku tahu kamu sebenarnya ingin yang terbaik.”",
      "Bangun rasa aman sebelum memberi masukan: “Aku mau cerita pelan-pelan, bukan menyalahkan.”",
      "Hubungkan masukan dengan tujuan bersama: “Supaya kita sama-sama lebih ringan.”",
      "Gunakan nada hangat, bertahap, dan beri ruang ia menjelaskan niatnya.",
    ],
    resistanceTrigger: [
      "Koreksi mentah: “Kamu salah di sini.”",
      "Bahasa logika yang terasa menghakimi: “Harusnya kan begini.”",
      "Masukan yang datang tanpa penghargaan atas usaha yang sudah dilakukan.",
      "Nada tinggi, menyudutkan, atau membuat ia merasa tidak cukup baik.",
    ],
    reframeExample: {
      raw: "Kamu salah. Harusnya begini.",
      better: "Aku paham kamu ingin yang terbaik. Boleh aku cerita sudut pandangku supaya kita sama-sama lebih ringan?",
    },
    partnerNote:
      "Pasangan sebaiknya masuk lewat rasa aman, narasi, dan makna. Setelah ia merasa dihargai dan tidak disalahkan, masukan biasanya lebih mudah diterima dan tidak berubah menjadi defensif.",
    parentingNote:
      "Dalam parenting, pola ini kuat untuk membangun rasa aman anak. Namun pasangan perlu memastikan beban emosi keluarga tidak dipikul sendirian. Sepakati dukungan praktis, jeda, dan pembagian peran yang jelas.",
  },
  {
    id: "structure_clarity",
    priority: 80,
    roleIds: ["system_organizer", "quality_evaluator", "consistency_guardian", "risk_checker", "operational_executor"],
    title: "Structure & Clarity Switch",
    summary:
      "Orang dengan pola ini lebih mudah bergerak ketika alur, batas, standar, dan prioritas terlihat jelas. Ia bisa resistan bukan karena tidak mau, tetapi karena instruksi terasa kabur, berubah-ubah, atau tidak punya ukuran selesai.",
    onSwitch: [
      "Jelaskan prioritas, batas waktu, dan standar selesai.",
      "Gunakan checklist, pembagian tugas, atau alur sederhana.",
      "Sampaikan perubahan dengan alasan yang jelas, bukan mendadak tanpa konteks.",
      "Tanyakan: “Agar rapi dan tidak bolak-balik, alur terbaiknya bagaimana?”",
    ],
    resistanceTrigger: [
      "Instruksi ambigu: “Terserah, yang penting beres.”",
      "Perubahan mendadak tanpa alasan.",
      "Ekspektasi yang tidak dijelaskan tetapi nanti disalahkan.",
      "Situasi terlalu cair tanpa batas peran.",
    ],
    reframeExample: {
      raw: "Tolong urus ini ya, terserah caranya.",
      better: "Targetnya ini, batas waktunya ini, dan standar selesainya begini. Menurutmu alur yang paling aman apa?",
    },
    partnerNote:
      "Pasangan sebaiknya membantu dengan kejelasan dan pembagian peran, bukan kode-kode emosional yang harus ditebak. Kejelasan sering terasa seperti bentuk perhatian bagi pola ini.",
    parentingNote:
      "Dalam parenting, pola ini membantu membangun rutinitas, aturan, dan konsistensi. Agar tidak kaku, gabungkan struktur dengan kehangatan dan ruang mendengar emosi anak.",
  },
  {
    id: "action_challenge",
    priority: 75,
    roleIds: ["action_mover", "decision_director", "achievement_driver", "complexity_arranger"],
    title: "Challenge & Momentum Switch",
    summary:
      "Orang dengan pola ini lebih hidup ketika ada tujuan, tantangan, momentum, dan ruang mengambil keputusan. Ia bisa cepat turun energi ketika terlalu lama berada di diskusi tanpa keputusan atau situasi yang tidak bergerak.",
    onSwitch: [
      "Buka dengan tujuan dan tantangan yang jelas.",
      "Beri ruang mengambil peran atau menentukan langkah pertama.",
      "Gunakan pertanyaan: “Langkah paling cepat dan aman dari sini apa?”",
      "Ajak membuat keputusan kecil agar situasi mulai bergerak.",
    ],
    resistanceTrigger: [
      "Terlalu lama berputar tanpa keputusan.",
      "Membatasi gerak tanpa memberi alternatif.",
      "Mengkritik inisiatif sebelum arah besarnya dipahami.",
      "Menunda semua hal sampai sempurna.",
    ],
    reframeExample: {
      raw: "Jangan mulai dulu. Tunggu saja.",
      better: "Kita sepakati batas amannya dulu. Setelah itu, langkah pertama yang paling masuk akal apa?",
    },
    partnerNote:
      "Pasangan sebaiknya memberi ruang kontribusi nyata, bukan hanya meminta ia menunggu. Namun keputusan tetap perlu dicek agar tidak membuat orang lain tertinggal.",
    parentingNote:
      "Dalam parenting, pola ini berguna untuk membangun arah dan keberanian mengambil keputusan. Seimbangkan dengan mendengar emosi anak agar target tidak terasa seperti tekanan performa.",
  },
  {
    id: "relational_warmth",
    priority: 70,
    roleIds: ["social_connector", "group_includer", "relationship_keeper", "emotion_reader", "harmony_keeper"],
    title: "Warmth & Belonging Switch",
    summary:
      "Orang dengan pola ini lebih mudah terbuka ketika merasa diterima, dilibatkan, dan tidak diperlakukan secara dingin. Hubungan dan suasana emosional sering menjadi pintu masuk sebelum pesan utama bisa diterima.",
    onSwitch: [
      "Mulai dengan kedekatan: tanyakan keadaan, bukan langsung masuk ke tuntutan.",
      "Gunakan bahasa yang menunjukkan ia tetap diterima walau ada hal yang perlu dibahas.",
      "Libatkan ia dalam keputusan yang berdampak pada relasi atau keluarga.",
      "Sampaikan masukan dengan nada menjaga hubungan, bukan memenangkan argumen.",
    ],
    resistanceTrigger: [
      "Bahasa dingin, transaksional, atau terasa mengabaikan perasaan.",
      "Membuat keputusan sepihak tanpa melibatkan dirinya.",
      "Menganggap kebutuhan emosional sebagai drama atau kelemahan.",
      "Menghindari konflik terlalu lama sampai rasa aman menurun.",
    ],
    reframeExample: {
      raw: "Nggak usah baper, ini cuma urusan teknis.",
      better: "Aku tahu ini bisa terasa tidak enak. Aku tetap ingin kita baik-baik, jadi boleh kita bahas pelan-pelan?",
    },
    partnerNote:
      "Pasangan sebaiknya menjaga suasana aman sebelum masuk ke pembahasan sulit. Untuk pola ini, cara menyampaikan sering sama pentingnya dengan isi pesan.",
    parentingNote:
      "Dalam parenting, pola ini kuat untuk membangun kelekatan dan rasa diterima. Tetap perlu batas yang jelas agar kehangatan tidak berubah menjadi sulit berkata tidak.",
  },
];

function scoreRule(rule: SwitchRule, roles: MicroRoleScore[]): number {
  return roles.slice(0, 8).reduce((total, role, index) => {
    if (!rule.roleIds.includes(role.id)) return total;
    const rankBonus = Math.max(0, 8 - index) * 2;
    return total + role.natural + rankBonus;
  }, 0);
}

export function buildCommunicationSwitchProfiles(
  roles: MicroRoleScore[],
  purpose: PurposeKey,
): CommunicationSwitchProfile[] {
  const ranked = SWITCH_RULES
    .map((rule) => ({ rule, score: scoreRule(rule, roles) + rule.priority }))
    .filter((item) => item.score > item.rule.priority)
    .sort((a, b) => b.score - a.score)
    .slice(0, purpose === "relationship_family" ? 3 : 2)
    .map(({ rule }) => ({
      id: rule.id,
      title: rule.title,
      summary: rule.summary,
      onSwitch: rule.onSwitch,
      resistanceTrigger: rule.resistanceTrigger,
      reframeExample: rule.reframeExample,
      partnerNote: rule.partnerNote,
      parentingNote: rule.parentingNote,
    }));

  if (ranked.length > 0) return ranked;

  return [
    {
      id: "general",
      title: "Context & Respect Switch",
      summary:
        "Pola komunikasi yang paling aman adalah memberi konteks, menunjukkan niat baik, lalu menyampaikan permintaan secara spesifik. Ini membantu orang merasa diajak bekerja sama, bukan sekadar diperintah atau dikoreksi.",
      onSwitch: [
        "Jelaskan tujuan sebelum meminta tindakan.",
        "Gunakan bahasa spesifik dan tenang.",
        "Tanyakan cara terbaik agar tugas terasa lebih ringan.",
      ],
      resistanceTrigger: [
        "Instruksi mendadak tanpa konteks.",
        "Koreksi tajam yang terdengar menyalahkan.",
        "Ekspektasi yang berubah-ubah tetapi tidak dijelaskan.",
      ],
      reframeExample: {
        raw: "Pokoknya lakukan sekarang.",
        better: "Aku butuh bantuanmu untuk ini. Tujuannya supaya beban kita lebih ringan. Menurutmu cara paling enak mulai dari mana?",
      },
      partnerNote:
        "Pasangan sebaiknya mencari pintu masuk komunikasi yang membuat orang merasa dihargai, punya ruang, dan paham alasan di balik permintaan.",
      parentingNote:
        "Dalam parenting, gunakan komunikasi yang hangat, jelas, dan konsisten: validasi dulu, beri batas, lalu ajak mencari solusi.",
    },
  ];
}
