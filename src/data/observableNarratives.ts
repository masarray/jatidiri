import type { MicroRoleDefinition, MicroRoleId } from "@/data/microRoles";
import type { MicroRoleScore } from "@/engine/patternSignature";

export interface MicroRoleNarrative {
  observable: string[];
  dailyHabits: string[];
  underPressure: string[];
  communicationOn: string[];
  communicationResistance: string[];
  analogy: string;
  blindSpot: string;
}

const NARRATIVES: Partial<Record<MicroRoleId, MicroRoleNarrative>> = {
  information_collector: {
    observable: [
      "Sering merasa perlu mengumpulkan bahan, referensi, atau konteks sebelum merasa cukup yakin.",
      "Lebih mudah percaya pada penjelasan yang punya dasar, bukan hanya kesan umum.",
    ],
    dailyHabits: [
      "Menyimpan catatan, link, foto, barang, atau informasi karena merasa suatu saat bisa berguna.",
      "Sering bertanya detail tambahan sebelum mengambil kesimpulan.",
    ],
    underPressure: [
      "Saat terdesak, cenderung mencari data tambahan atau mengumpulkan konteks agar keputusan tidak terasa kosong.",
    ],
    communicationOn: ["Ajak dengan pertanyaan berbasis data, contoh nyata, dan ruang untuk mengecek konteks."],
    communicationResistance: ["Jangan memaksa keputusan cepat sambil menutup akses pada informasi yang dianggap penting."],
    analogy: "Seperti perpustakaan berjalan: banyak bahan disimpan bukan untuk dipamerkan, tetapi agar bisa dipakai saat dibutuhkan.",
    blindSpot: "Bisa terlalu lama menunggu informasi terasa lengkap sebelum bergerak.",
  },
  fast_learner: {
    observable: [
      "Mudah tertarik pada hal baru yang membuat kapasitas diri naik.",
      "Cepat hidup ketika ada tantangan belajar atau kesempatan memahami sesuatu lebih dalam.",
    ],
    dailyHabits: ["Mencari tutorial, penjelasan, kursus, atau referensi ketika menemukan bidang baru.", "Mudah bosan jika hanya diminta mengulang pola yang tidak memberi pembelajaran."],
    underPressure: ["Saat tertekan, cenderung mencoba memahami cepat apa yang belum diketahui agar bisa mengejar situasi."],
    communicationOn: ["Beri ruang belajar, alasan, dan kesempatan berkembang; bukan hanya instruksi kaku."],
    communicationResistance: ["Jangan meremehkan rasa ingin tahunya atau memaksa rutinitas tanpa makna belajar."],
    analogy: "Seperti mesin yang menyala ketika diberi bahan bakar pengetahuan baru.",
    blindSpot: "Bisa terlalu sering pindah minat jika tidak ada prioritas yang jelas.",
  },
  deep_thinker: {
    observable: ["Tidak selalu langsung bereaksi, tetapi sering membawa pemikiran yang lebih matang setelah diberi waktu.", "Mencari makna, filosofi, atau alasan lebih dalam di balik sebuah peristiwa."],
    dailyHabits: ["Merenung sendiri, menulis catatan, atau memutar ulang percakapan untuk memahami maknanya.", "Butuh jeda sebelum memberi jawaban penting."],
    underPressure: ["Saat tertekan, cenderung masuk ke dalam pikiran untuk menyusun makna sebelum merespons."],
    communicationOn: ["Beri waktu memproses; ajukan pertanyaan yang membuka refleksi, bukan hanya tuntutan respons cepat."],
    communicationResistance: ["Jangan menganggap diam sebagai tidak peduli; bisa jadi ia sedang menyusun pemahaman."],
    analogy: "Seperti sumur dalam: tidak selalu ramai di permukaan, tetapi menyimpan kedalaman yang bisa diambil ketika waktunya tepat.",
    blindSpot: "Bisa tampak jauh atau lambat merespons saat orang lain butuh keputusan segera.",
  },
  idea_translator: {
    observable: ["Mampu membuat hal rumit terdengar lebih sederhana dan bisa dipahami orang lain.", "Sering menjadi jembatan antara ide, bahasa, dan pemahaman orang."],
    dailyHabits: ["Menjelaskan ulang sesuatu dengan bahasa sendiri.", "Membuat analogi, contoh, atau alur penjelasan agar orang lain lebih cepat menangkap maksud."],
    underPressure: ["Saat tertekan, cenderung mencoba menjelaskan posisi, alasan, atau pola pikir agar situasi menjadi lebih jernih."],
    communicationOn: ["Tanya pendapatnya tentang cara menjelaskan, menyusun pesan, atau membuat orang lain mengerti."],
    communicationResistance: ["Jangan memotong penjelasannya terlalu cepat sebelum pola pikirnya selesai tersusun."],
    analogy: "Seperti penerjemah ruangan: mengambil ide yang masih berantakan lalu memberi bahasa yang bisa dimengerti bersama.",
    blindSpot: "Bisa terlalu banyak menjelaskan ketika orang lain sebenarnya hanya butuh keputusan singkat.",
  },
  strategy_designer: {
    observable: ["Cepat membaca beberapa kemungkinan jalan dan mencari rute yang paling masuk akal.", "Lebih tertarik pada arah, prioritas, dan kemungkinan daripada sekadar menjalankan rutinitas."],
    dailyHabits: ["Sering bertanya: opsi terbaiknya apa, risikonya apa, jalan lainnya apa?", "Mudah tertarik pada skenario, peta jalan, dan solusi alternatif."],
    underPressure: ["Saat terdesak, cenderung makin aktif mencari celah, strategi, dan jalan keluar."],
    communicationOn: ["Ajak bicara soal strategi, kemungkinan, trade-off, dan arah keputusan."],
    communicationResistance: ["Jangan langsung mengunci pilihan tanpa memberi ruang melihat opsi lain."],
    analogy: "Seperti navigator: bukan hanya melihat jalan di depan, tetapi mencari rute paling masuk akal menuju tujuan.",
    blindSpot: "Bisa tidak sabar pada proses yang terasa tanpa arah atau terlalu administratif.",
  },
  idea_synthesizer: {
    observable: ["Sering menghubungkan banyak ide menjadi bentuk baru yang lebih utuh.", "Mudah melihat hubungan antarhal yang bagi orang lain tampak terpisah."],
    dailyHabits: ["Menggabungkan referensi, pengalaman, dan ide menjadi konsep baru.", "Membuat rangkuman atau kerangka baru dari banyak informasi."],
    underPressure: ["Saat tertekan, cenderung merangkai ulang informasi untuk menemukan gambaran baru yang lebih masuk akal."],
    communicationOn: ["Beri ruang brainstorming, peta konsep, dan diskusi kemungkinan."],
    communicationResistance: ["Jangan terlalu cepat membunuh ide sebelum bentuknya sempat matang."],
    analogy: "Seperti dapur ide: bahan-bahan berbeda diolah menjadi menu baru yang lebih bermakna.",
    blindSpot: "Bisa membuka terlalu banyak kemungkinan sehingga keputusan tertunda.",
  },
  pattern_reader: {
    observable: ["Tidak mudah puas dengan jawaban permukaan; ingin melihat data, pola, dan hubungan sebab-akibat.", "Sering menemukan struktur di balik situasi yang tampak acak."],
    dailyHabits: ["Membandingkan angka, fakta, pola kejadian, atau bukti sebelum menerima kesimpulan.", "Menyukai penjelasan yang logis dan dapat ditelusuri."],
    underPressure: ["Saat terdesak, cenderung mengurai fakta dan mencari pola yang bisa dipercaya."],
    communicationOn: ["Beri data, alasan, dan struktur berpikir yang jelas."],
    communicationResistance: ["Jangan memakai alasan 'pokoknya' atau 'sudah biasa begitu' untuk keputusan penting."],
    analogy: "Seperti analis sinyal: mencari pola yang tersembunyi di balik noise.",
    blindSpot: "Bisa terlihat kritis atau sulit diyakinkan ketika bukti belum cukup.",
  },
  problem_restorer: {
    observable: ["Tertarik mencari penyebab masalah dan membuat sesuatu kembali berjalan.", "Lebih hidup ketika ada kerusakan, kekacauan, atau error yang bisa diperbaiki."],
    dailyHabits: ["Mencari akar masalah, mencoba solusi, lalu mengecek apakah sistem kembali normal.", "Sulit membiarkan masalah menggantung tanpa usaha perbaikan."],
    underPressure: ["Saat tertekan, cenderung masuk ke mode troubleshooting: apa penyebabnya, apa yang harus diperbaiki dulu?"],
    communicationOn: ["Ajak dengan problem statement yang jelas dan beri ruang menganalisis akar masalah."],
    communicationResistance: ["Jangan hanya menyuruh menerima kondisi rusak tanpa kesempatan memperbaiki."],
    analogy: "Seperti teknisi pemulih: tenang ketika bisa menemukan titik gangguan dan mengembalikan fungsi.",
    blindSpot: "Bisa terlalu fokus memperbaiki sesuatu yang sebenarnya tidak perlu diselamatkan.",
  },
  people_developer: {
    observable: ["Mudah melihat potensi orang lain dan senang ketika ada orang yang bertumbuh.", "Sering memberi dorongan, feedback, atau dukungan agar orang lebih mampu."],
    dailyHabits: ["Menyadari kemajuan kecil orang lain.", "Memberi semangat atau arahan agar orang tidak menyerah terlalu cepat."],
    underPressure: ["Saat tertekan, cenderung tetap memikirkan bagaimana orang lain bisa dibantu atau dinaikkan kapasitasnya."],
    communicationOn: ["Bicarakan perkembangan, proses belajar, dan dampak positif pada orang lain."],
    communicationResistance: ["Jangan membuatnya merasa usahanya membantu orang tidak dihargai."],
    analogy: "Seperti tukang kebun manusia: memperhatikan tunas kecil dan ingin melihatnya tumbuh.",
    blindSpot: "Bisa terlalu memikul proses tumbuh orang lain sampai lupa batas diri.",
  },
  system_organizer: {
    observable: ["Merasa lebih lega ketika ruang, barang, jadwal, atau proses menjadi rapi dan bisa diprediksi.", "Mudah melihat bagian yang berantakan dan ingin menatanya."],
    dailyHabits: ["Membuat daftar, merapikan file, mengatur ruang, atau membuat sistem agar mudah dicari.", "Merasa terganggu jika sesuatu sering berubah tanpa alasan jelas."],
    underPressure: ["Saat tertekan, cenderung mencari struktur: apa urutannya, siapa melakukan apa, kapan selesai?"],
    communicationOn: ["Berikan kejelasan langkah, jadwal, dan tanggung jawab."],
    communicationResistance: ["Jangan membuat perubahan mendadak tanpa konteks atau aturan baru yang jelas."],
    analogy: "Seperti penata ruang kontrol: semua indikator harus jelas agar sistem bisa dijalankan dengan tenang.",
    blindSpot: "Bisa tampak kaku saat situasi memang membutuhkan improvisasi.",
  },
  commitment_keeper: {
    observable: ["Serius memegang janji, tanggung jawab, dan kualitas hasil.", "Tidak nyaman jika pekerjaan dibuat asal selesai."],
    dailyHabits: ["Mengingat kewajiban, memperbaiki kesalahan, dan merasa perlu menuntaskan yang sudah dijanjikan.", "Sulit santai jika ada tanggung jawab yang belum beres."],
    underPressure: ["Saat tertekan, cenderung memikul lebih banyak karena merasa harus bertanggung jawab."],
    communicationOn: ["Bicarakan komitmen, kepercayaan, standar mutu, dan pembagian tanggung jawab yang adil."],
    communicationResistance: ["Jangan menggampangkan janji atau membuatnya merasa sendirian memikul beban."],
    analogy: "Seperti jangkar: menjaga agar komitmen tidak mudah hanyut oleh keadaan.",
    blindSpot: "Bisa merasa bersalah berlebihan atau sulit mendelegasikan." ,
  },
  social_connector: {
    observable: ["Mudah membuka percakapan dan membuat suasana lebih hidup.", "Kehadirannya dapat membuat kelompok terasa lebih ramai, cair, atau terbuka."],
    dailyHabits: ["Menyapa orang, membuka obrolan, atau menghubungkan satu orang dengan orang lain.", "Merasa penasaran dengan orang baru atau suasana sosial baru."],
    underPressure: ["Saat tertekan, bisa mencoba mencairkan suasana agar ketegangan tidak terlalu berat."],
    communicationOn: ["Mulai dengan sapaan hangat, cerita ringan, dan ruang interaksi yang manusiawi."],
    communicationResistance: ["Jangan membuat relasi terasa dingin, formal berlebihan, atau hanya transaksional."],
    analogy: "Seperti pemantik suasana: ruangan yang datar bisa terasa lebih hidup saat ia hadir.",
    blindSpot: "Bisa menghabiskan energi sosial jika terlalu banyak membuka koneksi tanpa batas." ,
  },
  harmony_keeper: {
    observable: ["Mencari titik temu dan menurunkan ketegangan agar hubungan tidak rusak.", "Lebih nyaman ketika perbedaan bisa dibicarakan dengan tenang."],
    dailyHabits: ["Menghindari kata-kata yang terlalu menusuk.", "Mencari kalimat tengah agar kedua pihak tidak merasa diserang."],
    underPressure: ["Saat tertekan, cenderung berusaha menenangkan konflik atau menunda ledakan emosi."],
    communicationOn: ["Gunakan nada tenang, akui sudut pandangnya, lalu ajak mencari jalan tengah."],
    communicationResistance: ["Jangan menyerang secara frontal atau mempermalukan di depan orang lain."],
    analogy: "Seperti peredam getaran: membantu sistem tetap stabil saat gesekan mulai naik.",
    blindSpot: "Bisa terlalu lama menghindari keputusan tegas demi menjaga suasana." ,
  },
  decision_director: {
    observable: ["Berani mengambil posisi, menghadapi percakapan sulit, dan memberi arah.", "Tidak nyaman jika keputusan penting terus digantung."],
    dailyHabits: ["Langsung bertanya inti masalah atau arah keputusan.", "Lebih suka kejelasan daripada terlalu banyak basa-basi."],
    underPressure: ["Saat terdesak, cenderung mengambil kontrol dan menentukan arah agar situasi tidak melebar."],
    communicationOn: ["Bicarakan tujuan, batas, keputusan, dan konsekuensi secara jelas."],
    communicationResistance: ["Jangan membuatnya merasa diputar-putar tanpa kejelasan posisi."],
    analogy: "Seperti kemudi darurat: ketika situasi kabur, ia ingin segera menentukan arah." ,
    blindSpot: "Bisa terasa terlalu keras jika ketegasan tidak diimbangi ruang mendengar." ,
  },
  quality_evaluator: {
    observable: ["Teliti melihat ketidaksesuaian, kekurangan, atau risiko mutu.", "Tidak mudah puas sebelum sesuatu terasa benar, aman, dan layak."],
    dailyHabits: ["Memeriksa ulang dokumen, angka, detail, atau prosedur.", "Mudah melihat bagian kecil yang dilewatkan orang lain."],
    underPressure: ["Saat tertekan, cenderung memperketat pemeriksaan agar kesalahan tidak lolos."],
    communicationOn: ["Beri kriteria kualitas, bukti, dan ruang untuk menguji hasil."],
    communicationResistance: ["Jangan menganggap pertanyaan detail sebagai serangan; sering kali itu cara menjaga mutu."],
    analogy: "Seperti quality gate: memastikan sesuatu layak lewat sebelum dipakai lebih luas.",
    blindSpot: "Bisa terlalu fokus pada yang belum benar sehingga apresiasi kurang terdengar." ,
  },
  creative_designer: {
    observable: ["Mudah membayangkan bentuk, cerita, visual, atau konsep baru.", "Sering membuat sesuatu terasa lebih menarik atau punya rasa."],
    dailyHabits: ["Menyukai referensi visual, desain, musik, cerita, atau bentuk presentasi yang punya karakter.", "Mencoba versi baru dari sesuatu yang biasa."],
    underPressure: ["Saat tertekan, bisa mencari cara kreatif agar situasi tidak buntu."],
    communicationOn: ["Beri ruang eksplorasi, referensi, dan izin membuat versi yang lebih menarik."],
    communicationResistance: ["Jangan terlalu cepat membatasi bentuk sebelum proses eksplorasinya terlihat."],
    analogy: "Seperti studio kecil di kepala: hal sederhana bisa diolah menjadi bentuk yang punya rasa." ,
    blindSpot: "Bisa kehilangan energi jika terlalu lama dipaksa mengikuti format kaku." ,
  },
};

export function getMicroRoleNarrative(role: MicroRoleDefinition): MicroRoleNarrative {
  return (
    NARRATIVES[role.id] ?? {
      observable: [role.visible],
      dailyHabits: [role.tagline],
      underPressure: [`Saat tertekan, kecenderungan ${role.name.toLowerCase()} dapat muncul sebagai cara menjaga kontrol dan memahami situasi.`],
      communicationOn: [`Masuk lewat bahasa yang sesuai dengan ${role.name.toLowerCase()}: beri konteks, ruang, dan alasan yang jelas.`],
      communicationResistance: [role.risk],
      analogy: role.tagline,
      blindSpot: role.risk,
    }
  );
}

function unique(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items) {
    if (!item || seen.has(item)) continue;
    seen.add(item);
    output.push(item);
    if (output.length >= limit) break;
  }
  return output;
}

export function buildObservablePatterns(roles: MicroRoleScore[], limit = 5): string[] {
  return unique(roles.flatMap((role) => getMicroRoleNarrative(role).observable), limit);
}

export function buildDailyHabits(roles: MicroRoleScore[], limit = 5): string[] {
  return unique(roles.flatMap((role) => getMicroRoleNarrative(role).dailyHabits), limit);
}

export function buildPressurePatterns(roles: MicroRoleScore[], limit = 4): string[] {
  return unique(roles.flatMap((role) => getMicroRoleNarrative(role).underPressure), limit);
}

export function buildCommunicationOn(roles: MicroRoleScore[], limit = 4): string[] {
  return unique(roles.flatMap((role) => getMicroRoleNarrative(role).communicationOn), limit);
}

export function buildCommunicationResistance(roles: MicroRoleScore[], limit = 4): string[] {
  return unique(roles.flatMap((role) => getMicroRoleNarrative(role).communicationResistance), limit);
}

export function buildAnalogies(roles: MicroRoleScore[], limit = 3): string[] {
  return unique(roles.map((role) => getMicroRoleNarrative(role).analogy), limit);
}

export function buildBlindSpots(roles: MicroRoleScore[], limit = 4): string[] {
  return unique(roles.map((role) => getMicroRoleNarrative(role).blindSpot), limit);
}
