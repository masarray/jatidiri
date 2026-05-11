import type { Cluster } from "@/types/assessment";

export const CLUSTER_LIST: Cluster[] = [
  "Thinking",
  "Striving",
  "Relating",
  "Influencing",
  "Creating",
  "Operating",
  "Supporting",
  "Analyzing",
];

export const CLUSTER_META: Record<
  Cluster,
  {
    label: string;
    tagline: string;
    observable: string;
    recharge: string;
    trigger: string;
    blindspot: string;
    drain: string;
    compensate: string;
    commGood: string;
    commBad: string;
    critique: string;
  }
> = {
  Thinking: {
    label: "Pemikir & Penjelajah Ide",
    tagline: "Hidup ketika bisa memahami pola dan menghubungkan ide.",
    observable: "Sering merenung, suka menjelaskan hal rumit jadi sederhana, gemar membaca dan bertanya.",
    recharge: "Waktu sendirian untuk berpikir, percakapan mendalam, belajar hal baru.",
    trigger: "Diskusi konseptual, pertanyaan 'kenapa' dan 'bagaimana'.",
    blindspot: "Bisa tenggelam dalam analisis hingga lambat bertindak.",
    drain: "Rutinitas mekanis tanpa makna, tugas yang menuntut respons cepat tanpa konteks.",
    compensate: "Pasangkan dengan rekan eksekutor yang siap menerjemahkan ide ke aksi.",
    commGood: "Beri konteks dulu, lalu detail. Hargai ruang berpikir sebelum minta jawaban.",
    commBad: "Memaksa keputusan instan, instruksi tanpa alasan.",
    critique: "Sampaikan dengan logika dan bukti, bukan emosi.",
  },
  Striving: {
    label: "Pendorong & Pencapai",
    tagline: "Hidup ketika ada tujuan yang menantang untuk dikejar.",
    observable: "Disiplin, fokus pada hasil, sulit berhenti sebelum target tercapai.",
    recharge: "Pencapaian terlihat, progress harian, pengakuan atas usaha.",
    trigger: "Target jelas, kompetisi sehat, deadline.",
    blindspot: "Mengabaikan istirahat dan hubungan demi hasil.",
    drain: "Lingkungan tanpa arah, tugas tanpa ujung yang jelas.",
    compensate: "Buat sistem milestone dan ritual jeda agar tidak burnout.",
    commGood: "Langsung ke poin, sebut dampak dan hasil.",
    commBad: "Bertele-tele, menunda keputusan tanpa alasan.",
    critique: "Fokus pada hasil dan bagaimana memperbaikinya, bukan menyerang usaha.",
  },
  Relating: {
    label: "Penghubung Hati",
    tagline: "Hidup ketika hubungan terasa tulus dan hangat.",
    observable: "Mudah akrab, memperhatikan perasaan orang, menjadi tempat curhat.",
    recharge: "Waktu berkualitas dengan orang dekat, percakapan jujur.",
    trigger: "Diakui, didengarkan, diperlakukan sebagai pribadi bukan fungsi.",
    blindspot: "Menyerap emosi orang lain hingga lelah sendiri.",
    drain: "Konflik dingin, lingkungan transaksional.",
    compensate: "Jaga batasan emosional dan jadwalkan waktu pemulihan sosial.",
    commGood: "Hangat, personal, tunjukkan bahwa Anda peduli pada orangnya.",
    commBad: "Kritik di depan publik, nada dingin, mengabaikan perasaan.",
    critique: "Sampaikan privat dengan empati, mulai dari niat baik.",
  },
  Influencing: {
    label: "Penggerak & Pemengaruh",
    tagline: "Hidup ketika bisa menggerakkan orang lain ke arah yang lebih baik.",
    observable: "Berani bicara, mengambil inisiatif, suka memimpin diskusi.",
    recharge: "Panggung, audiens, pengaruh terlihat.",
    trigger: "Tantangan untuk meyakinkan, ruang menyampaikan ide.",
    blindspot: "Bisa terlihat mendominasi atau memaksakan.",
    drain: "Lingkungan pasif yang menolak gagasan baru.",
    compensate: "Latih kemampuan mendengar dan berikan ruang bagi suara lain.",
    commGood: "Berikan tantangan dan kepercayaan untuk memimpin.",
    commBad: "Mengabaikan ide atau memotong saat sedang menyampaikan.",
    critique: "Tantang dengan data, bukan otoritas.",
  },
  Creating: {
    label: "Pencipta & Pembayang",
    tagline: "Hidup ketika bisa membayangkan dan mewujudkan sesuatu yang baru.",
    observable: "Banyak ide, suka eksperimen, sering melihat kemungkinan baru.",
    recharge: "Ruang bebas berkreasi, eksposur ke hal baru.",
    trigger: "Pertanyaan 'bagaimana kalau...?', proyek terbuka.",
    blindspot: "Sulit menyelesaikan, mudah bosan saat sudah jadi rutinitas.",
    drain: "Tugas berulang dengan aturan kaku.",
    compensate: "Pasangkan dengan eksekutor yang menjaga proyek sampai selesai.",
    commGood: "Beri ruang eksplorasi sebelum mengevaluasi ide.",
    commBad: "Menutup ide terlalu cepat dengan kata 'tidak mungkin'.",
    critique: "Bahas ide, bukan pribadinya. Tanyakan, jangan vonis.",
  },
  Operating: {
    label: "Penjaga Sistem",
    tagline: "Hidup ketika segala sesuatu rapi, jelas, dan berjalan sesuai rencana.",
    observable: "Teratur, konsisten, andal dalam menjaga proses tetap berjalan.",
    recharge: "Lingkungan rapi, jadwal yang jelas, tugas tuntas.",
    trigger: "Sistem, prosedur, peran yang jelas.",
    blindspot: "Bisa kaku menghadapi perubahan mendadak.",
    drain: "Ambiguitas, perubahan rencana tanpa alasan.",
    compensate: "Beri waktu adaptasi dan komunikasi jelas saat ada perubahan.",
    commGood: "Jelas, terstruktur, beri konteks dan tenggat waktu.",
    commBad: "Instruksi mendadak, perubahan tanpa pemberitahuan.",
    critique: "Spesifik dan terstruktur, sertakan langkah perbaikan konkret.",
  },
  Supporting: {
    label: "Pendukung & Pelayan",
    tagline: "Hidup ketika kehadirannya membuat orang lain lebih mudah bertumbuh.",
    observable: "Sigap membantu, sering jadi 'tangan kanan', tulus melayani.",
    recharge: "Melihat orang yang dibantu berhasil dan berterima kasih.",
    trigger: "Kepercayaan, ruang untuk berkontribusi di belakang layar.",
    blindspot: "Mengabaikan kebutuhan diri sendiri.",
    drain: "Lingkungan yang menganggap kontribusinya remeh.",
    compensate: "Pastikan ada apresiasi rutin dan ruang untuk istirahat.",
    commGood: "Tunjukkan apresiasi tulus dan beri kepercayaan.",
    commBad: "Menganggap kontribusinya 'sudah seharusnya'.",
    critique: "Mulai dari apresiasi, lalu sampaikan area perbaikan secara lembut.",
  },
  Analyzing: {
    label: "Penelaah & Pemeriksa",
    tagline: "Hidup ketika bisa menemukan kebenaran melalui data dan bukti.",
    observable: "Teliti, hati-hati, suka memverifikasi sebelum memutuskan.",
    recharge: "Waktu untuk meneliti, akses ke data lengkap, kesimpulan yang tepat.",
    trigger: "Pertanyaan tajam, fakta, kasus untuk dipecahkan.",
    blindspot: "Bisa terlalu lama memutuskan menunggu data sempurna.",
    drain: "Tekanan memutuskan tanpa data, asumsi tanpa bukti.",
    compensate: "Beri tenggat berpikir yang jelas agar tidak overanalisis.",
    commGood: "Sertakan data dan logika. Beri ruang untuk verifikasi.",
    commBad: "Memaksa kesimpulan tanpa bukti.",
    critique: "Tunjukkan dengan data spesifik, bukan opini umum.",
  },
};
