import type { Cluster } from "@/types/assessment";

export interface Typology {
  name: string;
  tagline: string;
  experience: string;
  alive: string;
}

export function pickTypology(topClusters: Cluster[]): Typology {
  const top = topClusters[0];
  const second = topClusters[1];
  const set = new Set(topClusters.slice(0, 3));

  if (set.has("Thinking") && set.has("Influencing"))
    return {
      name: "Strategic Explainer",
      tagline: "Penerjemah ide rumit jadi gerakan nyata.",
      experience: "Anda terlihat seperti orang yang mampu menyederhanakan kerumitan dan membuat orang lain mengangguk.",
      alive: "Saat bisa menjelaskan, meyakinkan, dan melihat ide Anda mulai dijalankan.",
    };
  if (set.has("Operating") && set.has("Supporting"))
    return {
      name: "Quiet Stabilizer",
      tagline: "Penjaga ritme yang membuat semuanya tetap utuh.",
      experience: "Anda terlihat seperti fondasi diam-diam yang membuat tim tidak runtuh.",
      alive: "Saat sistem berjalan rapi dan orang-orang bisa bekerja dengan tenang.",
    };
  if (set.has("Relating") && set.has("Supporting"))
    return {
      name: "Human Developer",
      tagline: "Penumbuh manusia di balik layar.",
      experience: "Anda terlihat seperti orang yang membuat orang lain merasa lebih kuat setelah bicara dengan Anda.",
      alive: "Saat melihat orang yang Anda bantu bertumbuh.",
    };
  if (set.has("Thinking") && set.has("Analyzing"))
    return {
      name: "Pattern Builder",
      tagline: "Pencari pola di balik kebisingan.",
      experience: "Anda terlihat seperti orang yang bisa menemukan benang merah saat orang lain hanya melihat kekacauan.",
      alive: "Saat menemukan struktur tersembunyi dan bisa menjelaskannya.",
    };
  if (set.has("Operating") && set.has("Analyzing"))
    return {
      name: "Practical Guardian",
      tagline: "Penjaga kualitas yang teliti dan andal.",
      experience: "Anda terlihat seperti orang yang membuat hal penting tidak meleset.",
      alive: "Saat detail terjaga dan hasilnya bisa dipercaya.",
    };
  if (set.has("Relating") && set.has("Influencing"))
    return {
      name: "Energy Connector",
      tagline: "Penghubung yang menghidupkan ruangan.",
      experience: "Anda terlihat seperti orang yang membuat orang asing merasa seperti teman lama.",
      alive: "Saat menjadi jembatan antara orang-orang yang sebelumnya tidak terhubung.",
    };
  if (set.has("Creating") && set.has("Striving"))
    return {
      name: "System Improver",
      tagline: "Pemberani yang terus mendorong perbaikan.",
      experience: "Anda terlihat seperti orang yang tidak puas pada 'cukup baik' dan terus menaikkan standar.",
      alive: "Saat melihat sesuatu yang biasa berubah menjadi lebih baik karena tangan Anda.",
    };
  if (set.has("Creating"))
    return {
      name: "Imaginative Maker",
      tagline: "Pencipta yang melihat kemungkinan sebelum yang lain.",
      experience: "Anda terlihat seperti orang yang membawa rasa baru ke ruangan.",
      alive: "Saat ide menjadi sesuatu yang nyata dan bisa dirasakan.",
    };
  return {
    name: `${top} ${second ?? ""} Synthesizer`.trim(),
    tagline: "Perpaduan unik dari beberapa kekuatan.",
    experience: `Anda terlihat seperti orang yang menggabungkan kekuatan ${top}${second ? ` dan ${second}` : ""} dengan cara yang khas.`,
    alive: `Saat bisa menggunakan kombinasi ${top}${second ? ` + ${second}` : ""} dalam satu peran.`,
  };
}
