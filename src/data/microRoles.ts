import type { Cluster } from "@/types/assessment";

export type RoleFamily =
  | "Pengarah Peran"
  | "Penghubung Relasi"
  | "Pendamping Manusia"
  | "Pemikir Analitis"
  | "Penalar Masalah"
  | "Pembangun Gagasan"
  | "Pengelola Sistem"
  | "Pelaksana Teknis";

export type MicroRoleId =
  | "information_collector"
  | "fast_learner"
  | "deep_thinker"
  | "idea_translator"
  | "strategy_designer"
  | "idea_synthesizer"
  | "pattern_reader"
  | "problem_restorer"
  | "people_developer"
  | "commitment_keeper"
  | "system_organizer"
  | "action_mover"
  | "social_connector"
  | "harmony_keeper"
  | "decision_director"
  | "quality_evaluator"
  | "operational_executor"
  | "creative_designer"
  | "achievement_driver"
  | "meaning_keeper"
  | "consistency_guardian"
  | "relationship_keeper"
  | "emotion_reader"
  | "group_includer"
  | "complexity_arranger"
  | "mentor_coach"
  | "risk_checker"
  | "future_mapper";

export interface MicroRoleDefinition {
  id: MicroRoleId;
  name: string;
  family: RoleFamily;
  cluster: Cluster;
  tagline: string;
  visible: string;
  energy: string;
  risk: string;
  healthyUse: string;
}

export interface MicroRoleItemMap {
  id: MicroRoleId;
  naturalItemIds: string[];
  strengthItemIds: string[];
}

export const ROLE_FAMILIES: RoleFamily[] = [
  "Pengarah Peran",
  "Penghubung Relasi",
  "Pendamping Manusia",
  "Pemikir Analitis",
  "Penalar Masalah",
  "Pembangun Gagasan",
  "Pengelola Sistem",
  "Pelaksana Teknis",
];

export const MICRO_ROLE_DEFINITIONS: Record<MicroRoleId, MicroRoleDefinition> = {
  information_collector: {
    id: "information_collector",
    name: "Pengumpul Informasi",
    family: "Pemikir Analitis",
    cluster: "Thinking",
    tagline: "Tertarik mengumpulkan bahan, referensi, dan sudut pandang sebelum menyimpulkan.",
    visible: "Sering bertanya, mencari referensi, dan menyimpan hal yang menurutnya berguna.",
    energy: "Hidup ketika mendapat bahan baru untuk dipelajari, dibandingkan hanya mengulang jawaban lama.",
    risk: "Bisa merasa belum siap bergerak ketika informasi terasa belum lengkap.",
    healthyUse: "Gunakan sebagai kekuatan riset awal, lalu tetapkan batas kapan informasi cukup untuk bertindak.",
  },
  fast_learner: {
    id: "fast_learner",
    name: "Pembelajar Cepat",
    family: "Pemikir Analitis",
    cluster: "Thinking",
    tagline: "Mudah hidup ketika ada ruang belajar, memahami hal baru, dan menaikkan kapasitas diri.",
    visible: "Cepat tertarik pada pengetahuan, metode, atau bidang baru yang memberi rasa berkembang.",
    energy: "Mendapat energi dari proses belajar, bukan hanya dari hasil akhirnya.",
    risk: "Bisa cepat kehilangan energi saat berada terlalu lama di pola kerja yang tidak memberi pembelajaran.",
    healthyUse: "Sediakan target belajar kecil yang terhubung dengan pekerjaan, relasi, atau pengembangan diri.",
  },
  deep_thinker: {
    id: "deep_thinker",
    name: "Pemikir Mendalam",
    family: "Pemikir Analitis",
    cluster: "Thinking",
    tagline: "Cenderung memproses sesuatu melalui perenungan, makna, dan pemahaman yang lebih dalam.",
    visible: "Tidak selalu langsung merespons, tetapi sering membawa sudut pandang yang lebih matang setelah berpikir.",
    energy: "Membutuhkan ruang hening untuk menyusun makna, bukan hanya menerima instruksi cepat.",
    risk: "Bisa tampak terlalu lama berpikir ketika lingkungan menuntut respons instan.",
    healthyUse: "Beri ruang refleksi, lalu ubah hasil pemikiran menjadi catatan, konsep, atau keputusan yang jelas.",
  },
  idea_translator: {
    id: "idea_translator",
    name: "Penerjemah Gagasan",
    family: "Pembangun Gagasan",
    cluster: "Influencing",
    tagline: "Mengubah hal yang rumit menjadi penjelasan yang lebih mudah dipahami orang lain.",
    visible: "Mampu menjelaskan, mempresentasikan, atau memberi bahasa pada ide yang sebelumnya terasa abstrak.",
    energy: "Hidup ketika dapat membantu orang lain mengerti arah, makna, atau nilai sebuah gagasan.",
    risk: "Bisa frustrasi ketika diminta hanya menyampaikan tanpa diberi ruang memahami konteksnya.",
    healthyUse: "Tempatkan pada peran menjelaskan, menulis, mengajar, mempresentasikan, atau menyusun pesan.",
  },
  strategy_designer: {
    id: "strategy_designer",
    name: "Penyusun Strategi",
    family: "Pengarah Peran",
    cluster: "Striving",
    tagline: "Mencari jalan terbaik, alternatif rute, dan prioritas menuju tujuan.",
    visible: "Cepat membaca opsi, konsekuensi, dan kemungkinan jalan keluar saat orang lain masih melihat kebuntuan.",
    energy: "Hidup ketika diberi masalah terbuka dan ruang memilih pendekatan yang paling masuk akal.",
    risk: "Bisa tidak sabar pada proses yang terasa tidak punya arah atau tidak punya alasan strategis.",
    healthyUse: "Gunakan untuk membuat arah, skenario, dan prioritas; tetap cek realitas eksekusi bersama orang lain.",
  },
  idea_synthesizer: {
    id: "idea_synthesizer",
    name: "Pengolah Ide",
    family: "Pembangun Gagasan",
    cluster: "Creating",
    tagline: "Menggabungkan informasi dan ide menjadi bentuk baru yang lebih utuh.",
    visible: "Sering melihat hubungan antaride dan menawarkan bentuk baru dari bahan yang sudah ada.",
    energy: "Hidup ketika dapat membuat konsep, menyusun kemungkinan, atau menemukan cara baru melihat sesuatu.",
    risk: "Bisa terlalu banyak membuka kemungkinan sehingga penyelesaian tertunda.",
    healthyUse: "Pasangkan eksplorasi ide dengan batas waktu dan kriteria keputusan yang jelas.",
  },
  pattern_reader: {
    id: "pattern_reader",
    name: "Pembaca Pola",
    family: "Penalar Masalah",
    cluster: "Analyzing",
    tagline: "Melihat hubungan, data, dan pola yang menjadi dasar kesimpulan.",
    visible: "Sering mempertanyakan data, mencari bukti, dan tidak puas dengan jawaban yang terlalu umum.",
    energy: "Hidup ketika dapat membedah fakta dan menemukan struktur di balik situasi yang tampak acak.",
    risk: "Bisa menahan keputusan terlalu lama bila bukti belum terasa cukup.",
    healthyUse: "Gunakan sebagai fungsi penjernih keputusan, bukan sebagai alasan untuk terus menunda tindakan.",
  },
  problem_restorer: {
    id: "problem_restorer",
    name: "Pemulih Masalah",
    family: "Penalar Masalah",
    cluster: "Operating",
    tagline: "Tertarik menemukan penyebab masalah dan mengembalikan sesuatu ke kondisi yang lebih baik.",
    visible: "Cenderung mencari akar masalah, memperbaiki, dan membuat sesuatu yang rusak kembali berjalan.",
    energy: "Hidup ketika ada masalah nyata yang bisa diurai dan diselesaikan.",
    risk: "Bisa terlalu lama berada dalam mode memperbaiki sampai lupa memilih mana yang layak diperbaiki.",
    healthyUse: "Pilih masalah yang berdampak tinggi dan tetapkan batas perbaikan yang cukup.",
  },
  people_developer: {
    id: "people_developer",
    name: "Pengembang Orang",
    family: "Pendamping Manusia",
    cluster: "Supporting",
    tagline: "Mendapat energi ketika melihat orang lain bertumbuh dan lebih mampu.",
    visible: "Mudah melihat potensi, memberi dorongan, dan membantu orang lain naik kapasitas.",
    energy: "Hidup ketika kontribusinya membuat orang lain lebih percaya diri atau lebih berkembang.",
    risk: "Bisa memikul perkembangan orang lain terlalu banyak dan mengabaikan batas dirinya.",
    healthyUse: "Bantu orang bertumbuh, tetapi tetap bedakan antara mendampingi dan mengambil alih tanggung jawab.",
  },
  commitment_keeper: {
    id: "commitment_keeper",
    name: "Penjaga Komitmen",
    family: "Pengelola Sistem",
    cluster: "Striving",
    tagline: "Menjaga janji, kualitas, dan tanggung jawab agar tidak mudah meleset.",
    visible: "Terlihat dapat diandalkan, serius pada kewajiban, dan tidak nyaman jika hasil asal selesai.",
    energy: "Hidup ketika tanggung jawabnya jelas dan ada standar yang bisa dijaga.",
    risk: "Bisa merasa bersalah berlebihan atau sulit berhenti ketika standar belum terpenuhi.",
    healthyUse: "Tetapkan standar mutu, tetapi izinkan prioritas dan batas energi tetap manusiawi.",
  },
  system_organizer: {
    id: "system_organizer",
    name: "Penata Sistem",
    family: "Pengelola Sistem",
    cluster: "Operating",
    tagline: "Menyukai keteraturan, jadwal, struktur, dan proses yang dapat diikuti.",
    visible: "Membuat hal yang berantakan menjadi lebih rapi, tertata, dan mudah dijalankan.",
    energy: "Hidup ketika sistem jelas, peran jelas, dan proses tidak berubah tanpa alasan.",
    risk: "Bisa terganggu oleh perubahan mendadak atau situasi yang terlalu cair.",
    healthyUse: "Gunakan untuk membuat alur kerja, rutinitas, dan sistem pendukung yang memudahkan orang lain.",
  },
  action_mover: {
    id: "action_mover",
    name: "Penggerak Aksi",
    family: "Pengarah Peran",
    cluster: "Influencing",
    tagline: "Cenderung bergerak cepat setelah arah dianggap cukup jelas.",
    visible: "Mendorong keputusan menjadi tindakan dan tidak betah terlalu lama di tahap wacana.",
    energy: "Hidup ketika ada momentum, tantangan, dan ruang mengambil langkah nyata.",
    risk: "Bisa bergerak terlalu cepat sebelum semua pihak siap atau data cukup lengkap.",
    healthyUse: "Gunakan sebagai pemicu momentum, tetapi tetap libatkan check point sebelum keputusan besar.",
  },
  social_connector: {
    id: "social_connector",
    name: "Penghubung Sosial",
    family: "Penghubung Relasi",
    cluster: "Relating",
    tagline: "Mudah membuka percakapan, menjembatani orang, dan membuat suasana lebih hidup.",
    visible: "Terlihat mudah menyapa, membangun jejaring, dan membuat orang merasa diterima.",
    energy: "Hidup ketika interaksi terasa hangat, terbuka, dan memberi ruang saling mengenal.",
    risk: "Bisa terlalu banyak membuka pintu relasi hingga energi sosial cepat habis.",
    healthyUse: "Gunakan untuk membangun koneksi penting, lalu tetap sediakan waktu pemulihan sosial.",
  },
  harmony_keeper: {
    id: "harmony_keeper",
    name: "Penjaga Harmoni",
    family: "Penghubung Relasi",
    cluster: "Relating",
    tagline: "Mencari titik temu, menurunkan konflik, dan menjaga agar perbedaan tetap bisa dibicarakan.",
    visible: "Cenderung menenangkan suasana dan mencari alasan yang dapat diterima berbagai pihak.",
    energy: "Hidup ketika komunikasi dapat kembali jernih dan relasi tidak rusak oleh konflik.",
    risk: "Bisa menghindari ketegasan agar suasana tetap tenang.",
    healthyUse: "Jaga harmoni, tetapi tetap beri ruang untuk keputusan yang jelas dan batas yang sehat.",
  },
  decision_director: {
    id: "decision_director",
    name: "Pengarah Keputusan",
    family: "Pengarah Peran",
    cluster: "Influencing",
    tagline: "Berani mengambil posisi, memberi arah, dan menghadapi keputusan sulit.",
    visible: "Terlihat tegas, terus terang, dan tidak takut masuk ke percakapan yang menentukan arah.",
    energy: "Hidup ketika diberi kepercayaan untuk menentukan arah atau memimpin keputusan.",
    risk: "Bisa terlihat terlalu keras bila tidak disertai ruang mendengar.",
    healthyUse: "Gunakan ketegasan untuk memberi kejelasan, bukan untuk menutup masukan.",
  },
  quality_evaluator: {
    id: "quality_evaluator",
    name: "Penilai Kualitas",
    family: "Penalar Masalah",
    cluster: "Analyzing",
    tagline: "Memastikan sesuatu benar, layak, aman, dan dapat dipertanggungjawabkan.",
    visible: "Teliti memeriksa, membandingkan, dan mencari bagian yang belum sesuai.",
    energy: "Hidup ketika kualitas, bukti, dan akurasi menjadi penting.",
    risk: "Bisa terlalu fokus pada kesalahan sehingga orang lain merasa terus dinilai.",
    healthyUse: "Tempatkan sebagai penjaga mutu, dengan bahasa feedback yang spesifik dan tidak menyerang.",
  },
  operational_executor: {
    id: "operational_executor",
    name: "Pelaksana Operasional",
    family: "Pelaksana Teknis",
    cluster: "Operating",
    tagline: "Menjalankan proses, prosedur, dan pekerjaan teknis agar hasil nyata terjadi.",
    visible: "Cenderung mampu menjaga pekerjaan tetap berjalan dan memastikan hal praktis terselesaikan.",
    energy: "Hidup ketika tugas jelas, alat tersedia, dan hasilnya dapat dilihat.",
    risk: "Bisa lelah bila terus menjadi eksekutor tanpa ruang makna, perbaikan, atau pengembangan.",
    healthyUse: "Gunakan untuk menjaga implementasi, tetapi tetap hubungkan pekerjaan teknis dengan tujuan yang lebih besar.",
  },
  creative_designer: {
    id: "creative_designer",
    name: "Perancang Kreatif",
    family: "Pembangun Gagasan",
    cluster: "Creating",
    tagline: "Menggunakan imajinasi, bentuk, dan rasa untuk menciptakan sesuatu yang baru atau menarik.",
    visible: "Mudah membayangkan kemungkinan, tampilan, cerita, atau bentuk baru.",
    energy: "Hidup ketika ada ruang eksplorasi visual, konsep, cerita, atau rancangan.",
    risk: "Bisa kurang nyaman pada batasan yang terlalu kaku sejak awal.",
    healthyUse: "Beri fase eksplorasi sebelum evaluasi, lalu pilih ide terbaik untuk diselesaikan.",
  },
  achievement_driver: {
    id: "achievement_driver",
    name: "Pendorong Prestasi",
    family: "Pengarah Peran",
    cluster: "Striving",
    tagline: "Terdorong oleh kemajuan, standar tinggi, dan hasil yang terlihat.",
    visible: "Sering menaikkan target, mengejar hasil, dan tidak mudah puas pada yang biasa-biasa saja.",
    energy: "Hidup ketika ada capaian, tantangan, dan ukuran kemajuan.",
    risk: "Bisa mengabaikan pemulihan dan relasi karena terlalu fokus pada hasil.",
    healthyUse: "Jaga target yang menantang, tetapi pisahkan ambisi sehat dari tekanan membuktikan diri terus-menerus.",
  },
  meaning_keeper: {
    id: "meaning_keeper",
    name: "Penjaga Makna",
    family: "Pendamping Manusia",
    cluster: "Supporting",
    tagline: "Menghubungkan tindakan dengan nilai, manfaat, dan tujuan yang lebih besar.",
    visible: "Sering mencari hikmah, manfaat, nilai, atau alasan moral di balik tindakan.",
    energy: "Hidup ketika pekerjaan dan relasi terasa bermakna, bukan sekadar tuntutan luar.",
    risk: "Bisa sulit bergerak bila aktivitas terasa tidak selaras dengan nilai yang dipegang.",
    healthyUse: "Gunakan nilai sebagai kompas, sambil tetap membuka ruang dialog dan realitas praktis.",
  },
  consistency_guardian: {
    id: "consistency_guardian",
    name: "Penjaga Konsistensi",
    family: "Pengelola Sistem",
    cluster: "Operating",
    tagline: "Menjaga aturan, keadilan proses, dan perlakuan yang konsisten.",
    visible: "Cenderung memperhatikan aturan, fairness, dan perlakuan yang tidak berubah-ubah.",
    energy: "Hidup ketika sistem terasa adil, jelas, dan tidak penuh pengecualian yang membingungkan.",
    risk: "Bisa tampak kaku bila situasi membutuhkan fleksibilitas tinggi.",
    healthyUse: "Gunakan untuk menjaga keadilan proses, sambil membedakan prinsip utama dan detail yang bisa dinegosiasikan.",
  },
  relationship_keeper: {
    id: "relationship_keeper",
    name: "Perawat Relasi",
    family: "Penghubung Relasi",
    cluster: "Relating",
    tagline: "Menjaga kedekatan, kepercayaan, dan hubungan yang sudah terbangun.",
    visible: "Ingin tahu keadaan orang dekat, menjaga kontak, dan memperdalam hubungan yang berarti.",
    energy: "Hidup ketika relasi terasa tulus, aman, dan saling hadir.",
    risk: "Bisa kecewa ketika relasi terasa sepihak atau tidak dihargai.",
    healthyUse: "Jaga relasi penting, tetapi hindari menjadikan kedekatan sebagai beban sepihak.",
  },
  emotion_reader: {
    id: "emotion_reader",
    name: "Pembaca Emosi",
    family: "Pendamping Manusia",
    cluster: "Relating",
    tagline: "Peka menangkap perasaan, nada, atau kebutuhan emosional yang tidak selalu diucapkan.",
    visible: "Mudah merasakan suasana, memahami emosi orang, dan menangkap hal yang tidak dikatakan langsung.",
    energy: "Hidup ketika kepekaan digunakan untuk memahami dan menolong secara tepat.",
    risk: "Bisa menyerap emosi sekitar sampai lelah atau terlalu ikut memikul beban orang lain.",
    healthyUse: "Gunakan empati dengan batas: pahami emosi orang lain tanpa mengambil seluruh tanggung jawabnya.",
  },
  group_includer: {
    id: "group_includer",
    name: "Penyambut Kelompok",
    family: "Penghubung Relasi",
    cluster: "Relating",
    tagline: "Membuat orang merasa diterima, dilibatkan, dan tidak diabaikan.",
    visible: "Cenderung memperhatikan siapa yang tersisih dan berusaha membuat ruang lebih inklusif.",
    energy: "Hidup ketika kelompok terasa aman, ramah, dan tidak ada orang yang sengaja diabaikan.",
    risk: "Bisa kesulitan membuat batas karena ingin semua orang merasa diterima.",
    healthyUse: "Gunakan untuk membangun iklim kelompok, sambil tetap menjaga kapasitas dan prioritas.",
  },
  complexity_arranger: {
    id: "complexity_arranger",
    name: "Pengatur Kompleksitas",
    family: "Pengelola Sistem",
    cluster: "Operating",
    tagline: "Mampu mengatur banyak bagian agar menjadi susunan yang lebih dapat dijalankan.",
    visible: "Mudah melihat siapa/apa ditempatkan di mana agar kerja menjadi lebih efektif.",
    energy: "Hidup ketika dapat mengubah kerumitan menjadi susunan kerja yang lebih jelas.",
    risk: "Bisa mengambil terlalu banyak variabel untuk diatur sendiri.",
    healthyUse: "Gunakan untuk menyusun peran dan prioritas, tetapi delegasikan detail eksekusi bila memungkinkan.",
  },
  mentor_coach: {
    id: "mentor_coach",
    name: "Pembimbing Praktis",
    family: "Pendamping Manusia",
    cluster: "Supporting",
    tagline: "Memberi arahan, bimbingan, dan langkah belajar yang membantu orang lain berkembang.",
    visible: "Mampu menasihati, mengajarkan, atau mendampingi orang sampai lebih mampu bergerak.",
    energy: "Hidup ketika pengetahuan atau pengalaman diri dapat membantu orang lain naik kelas.",
    risk: "Bisa terlalu sering memberi solusi saat orang lain sebenarnya hanya perlu didengarkan.",
    healthyUse: "Tanyakan dulu kebutuhan orang: didengarkan, dibantu berpikir, atau diberi arahan praktis.",
  },
  risk_checker: {
    id: "risk_checker",
    name: "Pemeriksa Risiko",
    family: "Penalar Masalah",
    cluster: "Analyzing",
    tagline: "Mengantisipasi dampak negatif sebelum keputusan atau tindakan diambil.",
    visible: "Cenderung hati-hati, mempertimbangkan konsekuensi, dan melihat potensi masalah sejak awal.",
    energy: "Hidup ketika perannya menjaga keputusan tetap aman dan tidak gegabah.",
    risk: "Bisa dianggap menghambat bila cara menyampaikan risiko terlalu berat atau terlalu sering.",
    healthyUse: "Sampaikan risiko bersama opsi mitigasi, bukan hanya daftar kekhawatiran.",
  },
  future_mapper: {
    id: "future_mapper",
    name: "Pembaca Arah Masa Depan",
    family: "Pembangun Gagasan",
    cluster: "Creating",
    tagline: "Membayangkan kemungkinan masa depan dan menyusun arah yang lebih jauh.",
    visible: "Sering membicarakan visi, kemungkinan, dan gambaran yang belum terjadi.",
    energy: "Hidup ketika boleh melihat jauh ke depan dan menyusun gambaran masa depan.",
    risk: "Bisa sulit bertahan pada detail harian bila visi besar terasa tertahan.",
    healthyUse: "Terjemahkan visi menjadi eksperimen kecil agar masa depan tidak hanya berhenti sebagai imajinasi.",
  },
};

export const MICRO_ROLE_ITEM_MAP: MicroRoleItemMap[] = [
  { id: "information_collector", naturalItemIds: ["natural-33", "natural-69", "natural-105", "natural-140", "natural-176"], strengthItemIds: ["strength-63", "strength-71", "strength-111", "strength-114"] },
  { id: "fast_learner", naturalItemIds: ["natural-71", "natural-107", "natural-143", "natural-178"], strengthItemIds: ["strength-55", "strength-92", "strength-93", "strength-112"] },
  { id: "deep_thinker", naturalItemIds: ["natural-34", "natural-70", "natural-106", "natural-142", "natural-177"], strengthItemIds: ["strength-6", "strength-94", "strength-112"] },
  { id: "idea_translator", naturalItemIds: ["natural-1", "natural-37", "natural-73", "natural-109", "natural-145"], strengthItemIds: ["strength-4", "strength-6", "strength-8", "strength-79", "strength-81", "strength-92"] },
  { id: "strategy_designer", naturalItemIds: ["natural-36", "natural-72", "natural-108", "natural-144", "natural-180"], strengthItemIds: ["strength-1", "strength-41", "strength-42", "strength-43", "strength-45", "strength-90"] },
  { id: "idea_synthesizer", naturalItemIds: ["natural-32", "natural-68", "natural-104", "natural-139", "natural-175"], strengthItemIds: ["strength-48", "strength-49", "strength-50"] },
  { id: "pattern_reader", naturalItemIds: ["natural-24", "natural-60", "natural-96", "natural-132", "natural-168"], strengthItemIds: ["strength-94", "strength-102", "strength-103", "strength-107", "strength-111", "strength-112", "strength-114"] },
  { id: "problem_restorer", naturalItemIds: ["natural-21", "natural-57", "natural-93", "natural-129", "natural-165"], strengthItemIds: ["strength-25", "strength-59", "strength-61", "strength-75", "strength-107"] },
  { id: "people_developer", naturalItemIds: ["natural-11", "natural-46", "natural-82", "natural-118", "natural-154"], strengthItemIds: ["strength-54", "strength-58", "strength-61", "strength-85", "strength-86", "strength-87", "strength-88", "strength-89", "strength-90", "strength-91", "strength-92", "strength-93"] },
  { id: "commitment_keeper", naturalItemIds: ["natural-7", "natural-43", "natural-79", "natural-115", "natural-151"], strengthItemIds: ["strength-9", "strength-12", "strength-13", "strength-23", "strength-98"] },
  { id: "system_organizer", naturalItemIds: ["natural-19", "natural-55", "natural-91", "natural-127", "natural-163"], strengthItemIds: ["strength-10", "strength-11", "strength-12", "strength-13", "strength-97", "strength-98"] },
  { id: "action_mover", naturalItemIds: ["natural-16", "natural-52", "natural-88", "natural-124", "natural-159"], strengthItemIds: ["strength-19", "strength-24", "strength-73", "strength-76"] },
  { id: "social_connector", naturalItemIds: ["natural-14", "natural-50", "natural-86", "natural-121", "natural-157"], strengthItemIds: ["strength-56", "strength-67", "strength-78", "strength-83", "strength-84"] },
  { id: "harmony_keeper", naturalItemIds: ["natural-3", "natural-39", "natural-75", "natural-111", "natural-147"], strengthItemIds: ["strength-70", "strength-75", "strength-78"] },
  { id: "decision_director", naturalItemIds: ["natural-8", "natural-22", "natural-44", "natural-80", "natural-116", "natural-152"], strengthItemIds: ["strength-73", "strength-77", "strength-82", "strength-90"] },
  { id: "quality_evaluator", naturalItemIds: ["natural-12", "natural-24", "natural-60", "natural-101", "natural-137"], strengthItemIds: ["strength-20", "strength-101", "strength-102", "strength-103", "strength-104", "strength-110"] },
  { id: "operational_executor", naturalItemIds: ["natural-25", "natural-97", "natural-123", "natural-158"], strengthItemIds: ["strength-23", "strength-24", "strength-97", "strength-98", "strength-105", "strength-106", "strength-108", "strength-109"] },
  { id: "creative_designer", naturalItemIds: ["natural-31", "natural-67", "natural-102", "natural-138", "natural-174"], strengthItemIds: ["strength-31", "strength-48", "strength-50", "strength-51", "strength-52", "strength-53", "strength-96"] },
  { id: "achievement_driver", naturalItemIds: ["natural-9", "natural-45", "natural-81", "natural-117", "natural-153"], strengthItemIds: ["strength-27", "strength-46", "strength-69", "strength-86", "strength-89"] },
  { id: "meaning_keeper", naturalItemIds: ["natural-26", "natural-62", "natural-98", "natural-134", "natural-162", "natural-179"], strengthItemIds: ["strength-54", "strength-58", "strength-60"] },
  { id: "consistency_guardian", naturalItemIds: ["natural-27", "natural-63", "natural-99", "natural-135", "natural-171"], strengthItemIds: ["strength-9", "strength-38", "strength-105", "strength-106"] },
  { id: "relationship_keeper", naturalItemIds: ["natural-6", "natural-42", "natural-78", "natural-114", "natural-150"], strengthItemIds: ["strength-83", "strength-87", "strength-88"] },
  { id: "emotion_reader", naturalItemIds: ["natural-2", "natural-38", "natural-74", "natural-110", "natural-146"], strengthItemIds: ["strength-61", "strength-62"] },
  { id: "group_includer", naturalItemIds: ["natural-4", "natural-40", "natural-76", "natural-112", "natural-148"], strengthItemIds: ["strength-56", "strength-78", "strength-84"] },
  { id: "complexity_arranger", naturalItemIds: ["natural-61", "natural-97", "natural-133", "natural-169"], strengthItemIds: ["strength-77", "strength-97"] },
  { id: "mentor_coach", naturalItemIds: ["natural-82", "natural-118", "natural-154"], strengthItemIds: ["strength-85", "strength-86", "strength-88", "strength-90", "strength-91", "strength-92", "strength-93"] },
  { id: "risk_checker", naturalItemIds: ["natural-30", "natural-65", "natural-101", "natural-137", "natural-173"], strengthItemIds: ["strength-101", "strength-104", "strength-105", "strength-106", "strength-110"] },
  { id: "future_mapper", naturalItemIds: ["natural-31", "natural-67", "natural-102", "natural-138", "natural-174"], strengthItemIds: ["strength-1", "strength-41", "strength-43"] },
];
