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
    label: "Berpikir Konseptual",
    tagline: "Cenderung kuat ketika perlu memahami pola, makna, dan hubungan antar-ide.",
    observable: "Tampak nyaman merenung, bertanya, membaca situasi, dan menjelaskan hal kompleks secara lebih sederhana.",
    recharge: "Ruang berpikir yang cukup, diskusi mendalam, pembelajaran baru, dan kesempatan menyusun pemahaman secara utuh.",
    trigger: "Pertanyaan yang menantang cara berpikir, konteks yang jelas, dan ruang untuk memahami alasan di balik keputusan.",
    blindspot: "Dapat terlalu lama berada di tahap analisis sehingga keputusan atau tindakan menjadi tertunda.",
    drain: "Tugas mekanis yang berulang, instruksi tanpa konteks, atau tuntutan respons cepat tanpa kesempatan memahami masalah.",
    compensate: "Gunakan catatan, kerangka kerja, atau rekan eksekutor agar gagasan lebih cepat diterjemahkan menjadi tindakan.",
    commGood: "Berikan konteks, tujuan, dan alasan. Sediakan waktu singkat untuk berpikir sebelum meminta keputusan.",
    commBad: "Instruksi mendadak tanpa alasan, keputusan yang dipaksakan, atau komunikasi yang hanya menekankan kecepatan.",
    critique: "Gunakan data, struktur, dan contoh konkret. Hindari kritik yang terlalu emosional atau tidak jelas dasarnya.",
  },
  Striving: {
    label: "Dorongan & Pencapaian",
    tagline: "Cenderung kuat ketika ada target, arah, dan ukuran kemajuan yang jelas.",
    observable: "Tampak fokus pada hasil, berusaha menyelesaikan tugas, dan terdorong ketika melihat kemajuan yang nyata.",
    recharge: "Target yang jelas, progres yang terlihat, penyelesaian tugas, dan pengakuan atas usaha yang konsisten.",
    trigger: "Tantangan yang sehat, tenggat waktu yang masuk akal, dan ruang untuk menunjukkan kualitas kerja.",
    blindspot: "Dapat mengabaikan istirahat, ritme emosi, atau kebutuhan relasi karena terlalu fokus pada capaian.",
    drain: "Lingkungan tanpa arah, tugas yang tidak selesai-selesai, atau perubahan prioritas yang tidak dijelaskan.",
    compensate: "Buat milestone kecil, batas waktu kerja, dan jeda pemulihan agar energi tidak terkuras oleh target terus-menerus.",
    commGood: "Langsung pada tujuan, dampak, ukuran keberhasilan, dan langkah yang perlu dilakukan.",
    commBad: "Pembahasan yang bertele-tele, keputusan yang terus ditunda, atau target yang berubah tanpa penjelasan.",
    critique: "Arahkan pada perbaikan hasil dan standar kerja. Pisahkan kritik terhadap output dari penilaian terhadap pribadi.",
  },
  Relating: {
    label: "Relasi & Kepekaan Sosial",
    tagline: "Cenderung kuat ketika hubungan, kepercayaan, dan suasana interpersonal menjadi bagian penting dari pekerjaan.",
    observable: "Tampak memperhatikan perasaan orang, menjaga hubungan, dan lebih mudah bekerja ketika suasana terasa aman.",
    recharge: "Percakapan yang tulus, apresiasi personal, waktu berkualitas, dan lingkungan yang menghargai hubungan manusiawi.",
    trigger: "Rasa dipercaya, didengarkan, dan diperlakukan sebagai pribadi, bukan hanya sebagai fungsi atau peran.",
    blindspot: "Dapat terlalu menyerap emosi orang lain atau menunda keputusan sulit demi menjaga suasana.",
    drain: "Konflik dingin, komunikasi transaksional, kritik kasar, atau lingkungan yang mengabaikan aspek emosional.",
    compensate: "Tetapkan batas emosi yang sehat dan bedakan antara membantu orang lain dengan mengambil seluruh bebannya.",
    commGood: "Mulai dengan nada hangat, tunjukkan niat baik, dan beri ruang untuk menyampaikan perasaan atau keberatan.",
    commBad: "Kritik di depan publik, nada dingin, sarkasme, atau mengabaikan dampak emosional dari keputusan.",
    critique: "Sampaikan secara privat, spesifik, dan tetap menjaga martabat. Awali dengan tujuan perbaikan, bukan kesalahan personal.",
  },
  Influencing: {
    label: "Pengaruh & Komunikasi",
    tagline: "Cenderung kuat ketika perlu menyampaikan gagasan, menggerakkan orang, atau memengaruhi arah percakapan.",
    observable: "Tampak berani berbicara, mengambil inisiatif, menjelaskan gagasan, dan mengajak orang melihat suatu arah.",
    recharge: "Audiens yang responsif, ruang menyampaikan ide, negosiasi sehat, dan dampak komunikasi yang terlihat.",
    trigger: "Kesempatan memimpin percakapan, mempresentasikan gagasan, atau meyakinkan orang terhadap suatu solusi.",
    blindspot: "Dapat terlihat terlalu dominan bila tidak memberi ruang yang cukup bagi perspektif lain.",
    drain: "Lingkungan pasif, ide yang diabaikan tanpa dibahas, atau forum yang tidak memberi ruang kontribusi.",
    compensate: "Gunakan struktur mendengar aktif dan validasi pendapat orang lain sebelum mengarahkan keputusan.",
    commGood: "Beri ruang menyampaikan pendapat, tantangan yang jelas, dan kesempatan menjelaskan alasan di balik gagasan.",
    commBad: "Memotong pembicaraan, meremehkan ide, atau menutup diskusi sebelum argumen dipahami.",
    critique: "Tantang gagasan dengan data dan pertanyaan yang kuat. Hindari pendekatan yang hanya bertumpu pada otoritas.",
  },
  Creating: {
    label: "Kreasi & Imajinasi",
    tagline: "Cenderung kuat ketika perlu membayangkan kemungkinan baru dan mengubah ide menjadi bentuk yang berbeda.",
    observable: "Tampak memiliki banyak gagasan, senang mengeksplorasi alternatif, dan mudah melihat kemungkinan yang belum terlihat.",
    recharge: "Ruang eksplorasi, referensi baru, eksperimen, dan proyek yang memberi kebebasan merancang pendekatan.",
    trigger: "Pertanyaan terbuka, tantangan membuat sesuatu yang lebih baik, dan kesempatan mencoba format baru.",
    blindspot: "Dapat cepat bosan pada tahap rutin, detail administrasi, atau proses yang terlalu membatasi kreativitas.",
    drain: "Pekerjaan berulang, aturan kaku tanpa ruang improvisasi, atau ide yang ditolak terlalu cepat tanpa eksplorasi.",
    compensate: "Pasangkan kreativitas dengan sistem eksekusi, batas waktu, dan orang yang kuat menjaga penyelesaian.",
    commGood: "Beri ruang eksplorasi terlebih dahulu, lalu bantu menajamkan prioritas dan batasan kerja.",
    commBad: "Menutup ide sejak awal dengan penilaian terlalu cepat seperti ‘tidak mungkin’ atau ‘jangan aneh-aneh’. ",
    critique: "Bahas kelayakan ide secara objektif. Gunakan pertanyaan pengarah, bukan vonis yang mematikan eksplorasi.",
  },
  Operating: {
    label: "Keteraturan & Operasional",
    tagline: "Cenderung kuat ketika sistem, alur kerja, dan tanggung jawab perlu dibuat jelas serta konsisten.",
    observable: "Tampak rapi, bertanggung jawab menjaga proses, dan nyaman ketika peran serta prosedur tersusun jelas.",
    recharge: "Jadwal yang jelas, lingkungan tertata, proses yang stabil, dan tugas yang dapat diselesaikan secara tuntas.",
    trigger: "Instruksi yang terstruktur, standar kerja yang jelas, dan ekspektasi yang tidak berubah-ubah tanpa alasan.",
    blindspot: "Dapat terasa kaku ketika menghadapi perubahan cepat atau keputusan yang belum memiliki struktur lengkap.",
    drain: "Ambiguitas, perubahan mendadak, pekerjaan kacau, atau tanggung jawab yang tidak didefinisikan dengan baik.",
    compensate: "Berikan buffer adaptasi, checklist, dan komunikasi perubahan yang jelas agar transisi tidak terasa mengganggu.",
    commGood: "Sampaikan langkah, prioritas, tenggat waktu, dan kriteria selesai secara eksplisit.",
    commBad: "Instruksi berubah-ubah, permintaan mendadak, atau komunikasi yang terlalu abstrak tanpa tindakan berikutnya.",
    critique: "Gunakan poin yang spesifik, tunjukkan standar yang diharapkan, dan berikan langkah koreksi yang konkret.",
  },
  Supporting: {
    label: "Dukungan & Pelayanan",
    tagline: "Cenderung kuat ketika kontribusinya membantu orang lain bekerja, tumbuh, atau menjalankan perannya lebih baik.",
    observable: "Tampak sigap membantu, menjaga kebutuhan orang lain, dan sering menjadi pendukung penting di balik layar.",
    recharge: "Apresiasi yang tulus, melihat orang terbantu, dan mengetahui kontribusinya memiliki dampak nyata.",
    trigger: "Kepercayaan, ruang berkontribusi, dan permintaan bantuan yang jelas serta dihargai.",
    blindspot: "Dapat mengabaikan kebutuhan diri sendiri karena terlalu cepat mengambil beban orang lain.",
    drain: "Kontribusi yang dianggap biasa saja, permintaan bantuan tanpa batas, atau lingkungan yang kurang menghargai peran pendukung.",
    compensate: "Tetapkan batas kapasitas, definisikan peran, dan pastikan ada penghargaan serta waktu pemulihan.",
    commGood: "Sampaikan apresiasi secara jelas, beri kepercayaan, dan tunjukkan dampak dari bantuan yang diberikan.",
    commBad: "Menganggap bantuan sebagai kewajiban, memberi beban tambahan tanpa ucapan terima kasih, atau meremehkan peran pendukung.",
    critique: "Awali dengan apresiasi, lalu jelaskan perbaikan yang diperlukan secara spesifik dan tetap menghargai niat baiknya.",
  },
  Analyzing: {
    label: "Analisis & Verifikasi",
    tagline: "Cenderung kuat ketika perlu memeriksa fakta, membuktikan kesesuaian, dan menjaga kualitas keputusan.",
    observable: "Tampak teliti, hati-hati, suka memverifikasi data, dan tidak mudah menerima kesimpulan tanpa dasar yang jelas.",
    recharge: "Akses data yang lengkap, waktu menelaah, standar yang jelas, dan kesimpulan yang dapat dipertanggungjawabkan.",
    trigger: "Kasus yang perlu dipecahkan, data yang perlu dibaca, atau masalah yang membutuhkan ketelitian.",
    blindspot: "Dapat terlalu lama menunggu kepastian atau data tambahan sebelum bergerak.",
    drain: "Keputusan berbasis asumsi, tekanan mengambil kesimpulan tanpa data, atau lingkungan yang mengabaikan kualitas bukti.",
    compensate: "Tetapkan batas waktu analisis dan definisikan tingkat bukti yang cukup agar keputusan tetap berjalan.",
    commGood: "Sertakan data, sumber, batasan, dan alasan. Beri ruang untuk bertanya atau memverifikasi.",
    commBad: "Meminta persetujuan tanpa bukti, menolak pertanyaan klarifikasi, atau menganggap kehati-hatian sebagai hambatan.",
    critique: "Tunjukkan bukti yang spesifik, jelaskan standar yang belum terpenuhi, dan ajak mencari akar masalah.",
  },
};
