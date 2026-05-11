import type { Cluster } from "@/types/assessment";

export interface Typology {
  name: string;
  tagline: string;
  summary: string;
}

export function pickTypology(topClusters: Cluster[]): Typology {
  const top = topClusters[0];
  const second = topClusters[1];
  const set = new Set(topClusters.slice(0, 3));

  if (set.has("Thinking") && set.has("Influencing"))
    return {
      name: "Strategic Explainer",
      tagline: "Kuat dalam memahami pola, menyusun pesan, dan menjelaskan arah dengan jelas.",
      summary:
        "Profil ini menunjukkan kecenderungan untuk mengolah ide menjadi penjelasan yang dapat dipahami orang lain, terutama ketika konteks dan tujuan sudah jelas.",
    };
  if (set.has("Operating") && set.has("Supporting"))
    return {
      name: "Quiet Stabilizer",
      tagline: "Kuat dalam menjaga keteraturan, konsistensi, dan dukungan praktis bagi lingkungan.",
      summary:
        "Profil ini menunjukkan kecenderungan menjadi penopang yang membuat proses lebih rapi, tenang, dan dapat diandalkan.",
    };
  if (set.has("Relating") && set.has("Supporting"))
    return {
      name: "Human Developer",
      tagline: "Kuat dalam membaca kebutuhan manusia dan mendukung pertumbuhan orang lain.",
      summary:
        "Profil ini menunjukkan kepekaan relasional yang dapat membantu orang lain merasa didengar, dipahami, dan didukung secara lebih tepat.",
    };
  if (set.has("Thinking") && set.has("Analyzing"))
    return {
      name: "Pattern Builder",
      tagline: "Kuat dalam menemukan struktur, pola, dan hubungan logis di balik informasi.",
      summary:
        "Profil ini menunjukkan kecenderungan mengurai kerumitan, mencari benang merah, dan membangun pemahaman yang lebih sistematis.",
    };
  if (set.has("Operating") && set.has("Analyzing"))
    return {
      name: "Practical Guardian",
      tagline: "Kuat dalam menjaga kualitas, keteraturan, dan akurasi pelaksanaan.",
      summary:
        "Profil ini menunjukkan kecenderungan memastikan hal penting berjalan sesuai standar, dengan perhatian tinggi pada detail dan konsistensi.",
    };
  if (set.has("Relating") && set.has("Influencing"))
    return {
      name: "Energy Connector",
      tagline: "Kuat dalam membangun hubungan, membuka komunikasi, dan menggerakkan suasana.",
      summary:
        "Profil ini menunjukkan kecenderungan menjembatani orang, membuat komunikasi lebih hidup, dan membawa energi sosial ke dalam kelompok.",
    };
  if (set.has("Creating") && set.has("Striving"))
    return {
      name: "System Improver",
      tagline: "Kuat dalam melihat peluang perbaikan dan mendorong ide menjadi hasil nyata.",
      summary:
        "Profil ini menunjukkan kecenderungan tidak berhenti pada kondisi yang biasa saja, tetapi mencari cara membuat sesuatu menjadi lebih baik.",
    };
  if (set.has("Creating"))
    return {
      name: "Imaginative Maker",
      tagline: "Kuat dalam membayangkan kemungkinan baru dan mengembangkan bentuk yang berbeda.",
      summary:
        "Profil ini menunjukkan kecenderungan menciptakan alternatif, merancang pendekatan baru, dan melihat peluang yang belum tampak bagi orang lain.",
    };
  return {
    name: `${top}${second ? `–${second}` : ""} Profile`,
    tagline: "Profil gabungan dari beberapa kecenderungan utama.",
    summary: `Profil ini menunjukkan kombinasi menonjol pada area ${top}${second ? ` dan ${second}` : ""}, yang perlu dibaca bersama dengan konteks peran, pengalaman, dan lingkungan Anda saat ini.`,
  };
}
