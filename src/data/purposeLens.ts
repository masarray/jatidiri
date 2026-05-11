import type { Cluster, ClusterReport, Identity } from "@/types/assessment";
import { CLUSTER_META } from "@/data/clusterMeta";

export type PurposeKey = "personal" | "relationship_family" | "career" | "team";

export interface PurposeLens {
  key: PurposeKey;
  label: string;
  reportKicker: string;
  summaryTitle: string;
  summaryFrame: string;
  guideTitle: string;
  guideKicker: string;
  guideIntro: string;
  reflectionTitle: string;
  reflectionItems: string[];
}

export function resolvePurpose(identity: Identity | null): PurposeKey {
  const raw = (identity?.purpose ?? "").toLowerCase();
  if (raw.includes("pasangan") || raw.includes("keluarga") || raw.includes("parent")) return "relationship_family";
  if (raw.includes("karier") || raw.includes("career")) return "career";
  if (raw.includes("tim") || raw.includes("team")) return "team";
  return "personal";
}

export function getPurposeLens(identity: Identity | null): PurposeLens {
  const key = resolvePurpose(identity);
  const lenses: Record<PurposeKey, PurposeLens> = {
    personal: {
      key,
      label: "Pribadi",
      reportKicker: "Peta Refleksi Pribadi",
      summaryTitle: "Ringkasan Profil Diri",
      summaryFrame:
        "Hasil ini dibaca sebagai bahan memahami pola energi, cara berpikir, cara bekerja, serta area yang perlu dikelola dalam kehidupan sehari-hari.",
      guideTitle: "Cara Mengelola Diri",
      guideKicker: "Self-Management Notes",
      guideIntro:
        "Bagian ini membantu Anda membaca cara menjaga energi, membuat keputusan, dan membangun rutinitas yang lebih sesuai dengan pola alami.",
      reflectionTitle: "Catatan Refleksi 7 Hari",
      reflectionItems: [
        "Aktivitas apa yang terasa paling memberi energi dalam satu minggu terakhir?",
        "Aktivitas apa yang bisa dilakukan, tetapi membutuhkan pemulihan lebih banyak?",
        "Pola komunikasi seperti apa yang membuat Anda lebih tenang dan mudah bekerja sama?",
      ],
    },
    relationship_family: {
      key,
      label: "Pasangan & Keluarga",
      reportKicker: "Peta Relasi dan Keluarga",
      summaryTitle: "Ringkasan untuk Relasi & Keluarga",
      summaryFrame:
        "Hasil ini dibaca sebagai panduan bagi pasangan atau keluarga untuk memahami cara Anda memproses energi, tekanan, komunikasi, dan kerja sama dalam kehidupan rumah tangga.",
      guideTitle: "Panduan Pasangan & Keluarga",
      guideKicker: "Relationship & Family Notes",
      guideIntro:
        "Bagian ini tidak dimaksudkan untuk menilai siapa yang benar atau salah. Tujuannya adalah membantu pasangan melihat pola komunikasi, dukungan, konflik, dan pengasuhan dengan lebih jernih.",
      reflectionTitle: "Refleksi Pasangan 7 Hari",
      reflectionItems: [
        "Dalam situasi apa pasangan paling mudah merasa didengar dan dihargai?",
        "Saat terjadi tekanan, dukungan apa yang lebih membantu: ruang tenang, bantuan praktis, atau percakapan hangat?",
        "Aturan keluarga atau rutinitas parenting apa yang perlu disepakati agar tidak bergantung pada emosi sesaat?",
      ],
    },
    career: {
      key,
      label: "Karier",
      reportKicker: "Peta Kerja dan Pengembangan Karier",
      summaryTitle: "Ringkasan Profil Kerja",
      summaryFrame:
        "Hasil ini dibaca sebagai bahan memahami gaya kerja, lingkungan yang mendukung, pola kontribusi, serta area yang perlu dikelola agar karier tidak hanya produktif tetapi juga berkelanjutan.",
      guideTitle: "Panduan Kerja & Pengembangan Karier",
      guideKicker: "Career Notes",
      guideIntro:
        "Bagian ini membantu menerjemahkan pola alami menjadi cara bekerja, cara menerima arahan, dan arah pengembangan yang lebih realistis.",
      reflectionTitle: "Refleksi Karier 7 Hari",
      reflectionItems: [
        "Tugas apa yang membuat Anda paling fokus dan merasa bernilai?",
        "Tugas apa yang menguras energi meskipun Anda mampu menyelesaikannya?",
        "Dukungan kerja apa yang perlu dinegosiasikan: kejelasan prioritas, data, ruang ide, ritme kerja, atau kolaborasi?",
      ],
    },
    team: {
      key,
      label: "Tim",
      reportKicker: "Peta Kolaborasi Tim",
      summaryTitle: "Ringkasan Peran dalam Tim",
      summaryFrame:
        "Hasil ini dibaca sebagai bahan memahami kontribusi alami, gaya kolaborasi, cara menerima feedback, dan jenis dukungan tim yang membuat kontribusi menjadi lebih stabil.",
      guideTitle: "Panduan Kolaborasi Tim",
      guideKicker: "Team Collaboration Notes",
      guideIntro:
        "Bagian ini membantu rekan kerja atau leader memahami cara berkolaborasi, memberi arahan, dan membagi peran secara lebih sehat.",
      reflectionTitle: "Refleksi Tim 7 Hari",
      reflectionItems: [
        "Dalam pekerjaan tim, kontribusi apa yang paling natural muncul dari diri Anda?",
        "Jenis meeting atau komunikasi apa yang membuat kerja sama terasa efektif?",
        "Peran apa yang sebaiknya tidak terus-menerus dibebankan kepada Anda tanpa dukungan sistem?",
      ],
    },
  };

  return lenses[key];
}

export function purposeSummaryText(lens: PurposeLens, topNatural: Cluster[], topActivity: Cluster[], bottom: Cluster[]): string {
  const naturalText = topNatural.map((c) => CLUSTER_META[c].label).join(", ");
  const activityText = topActivity.map((c) => CLUSTER_META[c].label).join(", ");
  const bottomText = bottom.map((c) => CLUSTER_META[c].label).join(", ");

  if (lens.key === "relationship_family") {
    return `Dalam konteks pasangan dan keluarga, area ${naturalText} tampak sebagai sumber energi alami yang perlu dipahami oleh pasangan. Area aktivitas ${activityText} menunjukkan kemampuan yang relatif sudah terlatih. Area ${bottomText} sebaiknya tidak dijadikan sumber tuntutan utama tanpa dukungan, karena berpotensi memicu kelelahan atau reaksi defensif.`;
  }

  if (lens.key === "career") {
    return `Dalam konteks karier, area ${naturalText} tampak sebagai kecenderungan alami yang dapat menjadi modal kerja utama. Area aktivitas ${activityText} menunjukkan kemampuan yang sudah relatif sering digunakan. Area ${bottomText} perlu dikelola melalui prioritas, bantuan sistem, atau kolaborasi agar tidak menjadi sumber kelelahan kerja.`;
  }

  if (lens.key === "team") {
    return `Dalam konteks tim, area ${naturalText} tampak sebagai kontribusi alami yang mudah muncul ketika lingkungan memberi ruang yang sesuai. Area aktivitas ${activityText} menunjukkan bentuk kontribusi yang sudah lebih terlatih. Area ${bottomText} perlu dibaca sebagai area yang membutuhkan dukungan tim atau pembagian peran yang lebih sadar.`;
  }

  return `Berdasarkan pola jawaban, area ${naturalText} tampak sebagai kecenderungan alami yang paling menonjol. Pada sisi aktivitas, area ${activityText} tampak sebagai kekuatan yang relatif lebih sering atau lebih percaya diri dijalani. Area ${bottomText} perlu dikelola dengan lebih sadar agar tidak menjadi sumber kelelahan utama.`;
}

export function buildPurposeGuidance(lens: PurposeLens, top: Cluster[], bottom: Cluster[], reports: ClusterReport[]) {
  const primary = top[0];
  const secondary = top[1] ?? top[0];
  const vulnerable = bottom[0];
  const primaryMeta = CLUSTER_META[primary];
  const secondaryMeta = CLUSTER_META[secondary];
  const vulnerableMeta = CLUSTER_META[vulnerable];
  const adaptive = [...reports].filter((r) => r.zone === "Adaptive / Survival").sort((a, b) => b.strength - a.strength)[0];
  const adaptiveMeta = adaptive ? CLUSTER_META[adaptive.cluster] : undefined;

  if (lens.key === "relationship_family") {
    return [
      {
        title: "Cara pasangan sebaiknya memahami Anda",
        body: `Pasangan sebaiknya melihat Anda melalui pola energi utama: ${primaryMeta.label} dan ${secondaryMeta.label}. Anda cenderung lebih mudah terbuka ketika ${primaryMeta.commGood.toLowerCase()} Dalam relasi, hal ini berarti pasangan perlu memahami cara Anda memproses situasi sebelum menuntut respons yang terlalu cepat.`,
      },
      {
        title: "Cara berkomunikasi yang lebih tepat",
        body: `${primaryMeta.commGood} Saat ada perbedaan pendapat, gunakan kalimat yang spesifik, tenang, dan tidak menyudutkan. Hindari pola yang membuat Anda defensif: ${primaryMeta.commBad.toLowerCase()}`,
      },
      {
        title: "Saat konflik atau tekanan",
        body: `Area ${vulnerableMeta.label} tampak perlu dikelola lebih hati-hati. Ketika area ini menjadi tuntutan utama, Anda bisa lebih cepat lelah. Pasangan dapat membantu dengan ${vulnerableMeta.compensate.toLowerCase()}`,
      },
      {
        title: "Strategi parenting bersama Anda",
        body: buildParentingHint(top, bottom),
      },
      {
        title: "Visi keluarga yang lebih sesuai",
        body: `Bangun visi keluarga dengan menggabungkan kehangatan, struktur, dan pembagian peran yang realistis. Anda tidak perlu menjadi kuat di semua area. Yang penting adalah pasangan memahami area yang menghidupkan, area yang menguras, dan cara saling menutup kelemahan tanpa saling menyalahkan.`,
      },
    ];
  }

  if (lens.key === "career") {
    return [
      {
        title: "Lingkungan kerja yang mendukung",
        body: `Anda cenderung bekerja lebih baik ketika kekuatan ${primaryMeta.label} diberi ruang. Lingkungan yang memberi konteks, tujuan, dan cara komunikasi yang jelas akan membantu energi kerja lebih stabil.`,
      },
      {
        title: "Cara atasan memberi arahan",
        body: `${primaryMeta.commGood} Feedback paling efektif diberikan secara spesifik, berbasis contoh, dan diarahkan pada perbaikan kerja, bukan penilaian pribadi.`,
      },
      {
        title: "Arah pengembangan karier",
        body: `Gunakan area ${primaryMeta.label} dan ${secondaryMeta.label} sebagai pusat pengembangan. Area ini lebih layak dijadikan diferensiasi profesional dibanding memaksa diri menjadi kuat di semua jenis pekerjaan.`,
      },
      {
        title: "Risiko kelelahan kerja",
        body: `Area ${vulnerableMeta.label} perlu dibantu dengan sistem, partner kerja, atau batasan peran. Bila area ini terus menjadi tuntutan utama, performa mungkin tetap terlihat berjalan, tetapi energi pemulihan akan lebih besar.`,
      },
      adaptiveMeta
        ? {
            title: "Kemampuan adaptif yang perlu dijaga",
            body: `Area ${adaptiveMeta.label} tampak dapat dijalankan dengan cukup baik, tetapi kemungkinan tidak selalu menjadi sumber energi alami. Gunakan sebagai kemampuan profesional, namun beri ruang pemulihan setelah periode intensif.`,
          }
        : {
            title: "Ritme kerja yang sehat",
            body: `Jaga ritme kerja dengan membedakan pekerjaan yang memberi energi dan pekerjaan yang hanya wajib diselesaikan. Keduanya penting, tetapi tidak perlu mendapat porsi energi yang sama.`,
          },
    ];
  }

  if (lens.key === "team") {
    return [
      {
        title: "Kontribusi alami dalam tim",
        body: `Dalam tim, kontribusi Anda paling mudah terlihat melalui ${primaryMeta.label}. Anda cenderung lebih efektif ketika peran memberi ruang untuk ${primaryMeta.observable.toLowerCase()}`,
      },
      {
        title: "Cara berkolaborasi",
        body: `${primaryMeta.commGood} Rekan kerja sebaiknya tidak hanya memberi tugas, tetapi juga memberi konteks, ekspektasi, dan ruang untuk menyampaikan cara kerja yang paling efektif.`,
      },
      {
        title: "Cara memberi feedback",
        body: `${primaryMeta.critique} Feedback yang terlalu umum, emosional, atau disampaikan tanpa konteks berisiko membuat pesan sulit diterima.`,
      },
      {
        title: "Pembagian peran yang sehat",
        body: `Area ${vulnerableMeta.label} sebaiknya tidak menjadi beban utama terus-menerus. Tim dapat membantu dengan ${vulnerableMeta.compensate.toLowerCase()}`,
      },
      {
        title: "Risiko dinamika tim",
        body: `Perhatikan potensi blind spot: ${primaryMeta.blindspot.toLowerCase()} Jika disadari sejak awal, tim dapat mengubahnya menjadi kekuatan melalui struktur kerja dan komunikasi yang lebih jelas.`,
      },
    ];
  }

  return [
    {
      title: "Cara menjaga energi pribadi",
      body: `Area ${primaryMeta.label} dan ${secondaryMeta.label} tampak menjadi sumber energi alami. Beri ruang yang cukup untuk aktivitas yang sejalan dengan area ini agar hidup tidak hanya berisi kewajiban yang menguras.`,
    },
    {
      title: "Cara mengambil keputusan",
      body: `${primaryMeta.commGood} Ketika keputusan terasa berat, gunakan pola yang sesuai dengan energi alami Anda, bukan meniru cara orang lain secara penuh.`,
    },
    {
      title: "Area yang perlu dibatasi",
      body: `Area ${vulnerableMeta.label} bukan berarti tidak bisa dilakukan, tetapi perlu batas, bantuan sistem, atau jeda pemulihan. ${vulnerableMeta.compensate}`,
    },
    {
      title: "Cara menerima masukan",
      body: `${primaryMeta.critique} Pola ini membantu Anda tetap terbuka tanpa merasa diserang secara pribadi.`,
    },
    {
      title: "Eksperimen pengembangan diri",
      body: `Pilih satu aktivitas kecil yang menguatkan ${primaryMeta.label} selama tujuh hari. Amati apakah aktivitas itu membuat Anda lebih fokus, lebih ringan, atau lebih mudah kembali berenergi.`,
    },
  ];
}

function buildParentingHint(top: Cluster[], bottom: Cluster[]): string {
  const has = (cluster: Cluster) => top.includes(cluster);
  const low = (cluster: Cluster) => bottom.includes(cluster);

  const strategies: string[] = [];

  if (has("Thinking") || has("Analyzing")) {
    strategies.push(
      "Libatkan Anda dalam menyusun alasan, aturan, dan evaluasi pola anak. Anda cenderung lebih kuat ketika parenting tidak hanya reaktif, tetapi memiliki konteks dan prinsip yang jelas.",
    );
  }

  if (has("Relating") || has("Supporting")) {
    strategies.push(
      "Gunakan kekuatan empati dan kedekatan untuk membangun rasa aman, tetapi jangan biarkan satu orang memikul seluruh beban emosi keluarga sendirian.",
    );
  }

  if (has("Operating")) {
    strategies.push(
      "Bangun rutinitas rumah, batasan, dan pembagian tugas yang jelas. Struktur yang konsisten akan membantu keluarga lebih stabil.",
    );
  }

  if (has("Striving") || has("Influencing")) {
    strategies.push(
      "Gunakan dorongan dan kepemimpinan untuk membangun arah keluarga, namun hati-hati agar target parenting tidak berubah menjadi tekanan performa bagi pasangan atau anak.",
    );
  }

  if (has("Creating")) {
    strategies.push(
      "Manfaatkan kreativitas untuk membuat proses belajar, aturan, dan komunikasi keluarga terasa lebih hidup dan tidak kaku.",
    );
  }

  if (low("Relating") || low("Supporting")) {
    strategies.push(
      "Jika percakapan emosional panjang terasa menguras, sepakati teknik sederhana: jeda singkat, validasi perasaan, lalu bahas solusi ketika situasi sudah lebih tenang.",
    );
  }

  if (low("Operating")) {
    strategies.push(
      "Jika rutinitas detail terasa menguras, gunakan alat bantu seperti jadwal visual, checklist, pembagian tugas pasangan, atau reminder keluarga.",
    );
  }

  const selected = strategies.slice(0, 3);
  selected.push(
    "Prinsip dasarnya: hangat dalam respons, jelas dalam batas, dan kompak dalam visi. Anak lebih mudah merasa aman ketika orang tua tidak saling bertabrakan dalam arah pengasuhan.",
  );

  return selected.join(" ");
}
