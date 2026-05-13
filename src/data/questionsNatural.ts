import type { ActionCardQuestionItem, Cluster, SignalContribution } from "@/types/assessment";

type Opt = ["A" | "B" | "C" | "D", string, SignalContribution[]];

function sig(id: string, lane: SignalContribution["lane"] = "natural", weight = 1): SignalContribution {
  return { id, lane, weight };
}

function q(
  number: number,
  patternArea: string,
  cluster: Cluster,
  situation: string,
  options: Opt[],
): ActionCardQuestionItem {
  return {
    id: `natural-${number}`,
    session: "natural",
    number,
    format: "action_cards",
    patternArea,
    cluster,
    situation,
    prompt: "Biasanya kamu lebih mungkin:",
    text: `${situation} Biasanya kamu lebih mungkin...`,
    options: options.map(([id, text, signals]) => ({ id, text, signals })),
  };
}

export const naturalQuestions: ActionCardQuestionItem[] = [
  q(1, "Eksplorasi vs Prioritas", "Thinking", "Kamu sedang mengerjakan tugas utama, lalu menemukan tools atau ilmu baru yang menarik.", [
    ["A", "Mencatat dulu, lalu kembali menyelesaikan tugas utama.", [sig("commitment_keeper"), sig("priority_keeper"), sig("finisher")]],
    ["B", "Mencoba sebentar agar rasa penasaran tidak mengganggu.", [sig("fast_learner"), sig("controlled_curiosity", "adaptive", 0.7)]],
    ["C", "Masuk cukup dalam ke hal baru itu karena terasa lebih hidup.", [sig("fast_learner"), sig("novelty_pull"), sig("priority_leak", "overuse"), sig("unfinished_risk", "overuse", 0.7)]],
    ["D", "Mengecek dulu apakah hal baru itu benar-benar relevan dengan tujuan kerja.", [sig("pattern_reader"), sig("strategy_designer"), sig("commitment_keeper")]],
  ]),
  q(2, "Ide Baru di Tengah Masalah", "Creating", "Tim sedang buntu menghadapi masalah.", [
    ["A", "Mengusulkan cara baru yang belum dicoba.", [sig("idea_synthesizer"), sig("innovation_drive")]],
    ["B", "Mengurai dulu akar masalahnya.", [sig("problem_restorer"), sig("pattern_reader")]],
    ["C", "Menenangkan orang dulu agar bisa berpikir jernih.", [sig("harmony_keeper"), sig("emotion_reader")]],
    ["D", "Membuat langkah kecil yang bisa langsung dijalankan.", [sig("action_mover"), sig("practical_executor")]],
  ]),
  q(3, "Gambaran Besar vs Langkah Awal", "Striving", "Kamu diminta ikut proyek baru yang belum jelas bentuk akhirnya.", [
    ["A", "Melihat tujuan besar dan arah akhirnya dulu.", [sig("future_mapper"), sig("meaning_seeker")]],
    ["B", "Melihat data, alasan, dan batasannya dulu.", [sig("pattern_reader"), sig("risk_checker")]],
    ["C", "Mencoba langkah kecil agar cepat paham medan.", [sig("adaptable_improviser"), sig("experimenter")]],
    ["D", "Menyusun peran, jadwal, dan alur kerja dulu.", [sig("system_organizer"), sig("commitment_keeper")]],
  ]),
  q(4, "Makna Pekerjaan", "Creating", "Kamu mendapat pekerjaan yang secara teknis bisa dilakukan, tetapi terasa tidak jelas manfaatnya.", [
    ["A", "Tetap kerjakan selama tugasnya jelas.", [sig("operational_executor"), sig("consistency_guardian")]],
    ["B", "Ingin tahu dulu kenapa pekerjaan ini penting.", [sig("meaning_keeper"), sig("meaning_seeker")]],
    ["C", "Cari cara agar pekerjaan itu punya hasil yang lebih nyata.", [sig("achievement_driver"), sig("quality_evaluator")]],
    ["D", "Mengerjakan seperlunya, tetapi energi terasa tidak terlalu hidup.", [sig("purpose_drain", "drain"), sig("meaning_keeper", "adaptive", 0.45)]],
  ]),
  q(5, "Keputusan Cepat", "Analyzing", "Orang lain ingin mengambil keputusan cepat, sementara alasan dan datanya belum jelas.", [
    ["A", "Minta alasan atau bukti yang lebih jelas dulu.", [sig("pattern_reader"), sig("clarity_guardian")]],
    ["B", "Ikut jalan dulu asal risikonya kecil.", [sig("adaptable_improviser"), sig("action_mover")]],
    ["C", "Memikirkan dampak buruk yang mungkin muncul.", [sig("risk_checker"), sig("threat_scanner")]],
    ["D", "Menanyakan siapa yang terdampak oleh keputusan itu.", [sig("emotion_reader"), sig("relationship_keeper"), sig("fairness_guardian")]],
  ]),
  q(6, "Masalah Berulang", "Analyzing", "Masalah yang sama muncul lagi, padahal sudah pernah diperbaiki.", [
    ["A", "Mencari pola kenapa masalah itu terus kembali.", [sig("pattern_reader"), sig("problem_restorer")]],
    ["B", "Membuat aturan atau alur baru agar tidak terulang.", [sig("system_organizer"), sig("process_guardian")]],
    ["C", "Memperbaiki langsung bagian yang rusak sekarang.", [sig("problem_restorer"), sig("practical_fixer")]],
    ["D", "Mengecek apakah orang yang menjalankan alurnya sudah paham.", [sig("people_developer"), sig("idea_translator")]],
  ]),
  q(7, "Informasi Campur Aduk", "Thinking", "Kamu menerima banyak informasi yang campur aduk.", [
    ["A", "Mengelompokkan informasi agar lebih mudah dibaca.", [sig("system_organizer"), sig("information_collector")]],
    ["B", "Mencari inti masalahnya dulu.", [sig("problem_restorer"), sig("pattern_reader")]],
    ["C", "Menyimpan banyak bahan karena mungkin berguna nanti.", [sig("information_collector"), sig("resource_keeper"), sig("archive_overload", "overuse", 0.6)]],
    ["D", "Membuat ringkasan agar orang lain cepat paham.", [sig("idea_translator"), sig("mentor_coach")]],
  ]),
  q(8, "Hasil Sudah Cukup Baik", "Analyzing", "Sebuah hasil kerja sudah diterima orang lain sebagai cukup baik.", [
    ["A", "Tetap melihat bagian kecil yang bisa dibuat lebih baik.", [sig("quality_evaluator"), sig("visual_detail_checker")]],
    ["B", "Menganggap cukup, lalu lanjut ke pekerjaan berikutnya.", [sig("commitment_keeper"), sig("priority_keeper")]],
    ["C", "Meminta feedback dulu sebelum memperbaiki lagi.", [sig("emotion_reader"), sig("collaborative_validator", "adaptive", 0.6)]],
    ["D", "Tertarik membuat versi baru yang lebih menarik atau berbeda.", [sig("idea_synthesizer"), sig("creative_designer")]],
  ]),
  q(9, "Banyak Tugas Kecil", "Operating", "Banyak tugas kecil menumpuk di depan kamu.", [
    ["A", "Buat daftar dan urutan prioritas.", [sig("system_organizer"), sig("commitment_keeper")]],
    ["B", "Kerjakan yang paling mudah dulu agar cepat bergerak.", [sig("action_mover"), sig("operational_executor")]],
    ["C", "Kerjakan yang paling penting dulu walau lebih berat.", [sig("achievement_driver"), sig("commitment_keeper")]],
    ["D", "Bingung mulai dari mana jika semuanya terlihat penting.", [sig("priority_overload", "drain"), sig("complexity_arranger", "adaptive", 0.4)]],
  ]),
  q(10, "Hampir Selesai", "Operating", "Pekerjaan sudah hampir selesai, tapi muncul ide baru yang bisa membuat hasilnya lebih bagus.", [
    ["A", "Selesaikan dulu versi saat ini.", [sig("commitment_keeper"), sig("operational_executor")]],
    ["B", "Tambahkan ide baru kalau tidak terlalu mengganggu jadwal.", [sig("quality_evaluator"), sig("balanced_improver", "adaptive")]],
    ["C", "Bongkar lagi karena hasil akhirnya bisa jauh lebih baik.", [sig("quality_evaluator"), sig("perfection_delay", "overuse")]],
    ["D", "Tanyakan dulu apakah perubahan itu benar-benar dibutuhkan.", [sig("pattern_reader"), sig("emotion_reader")]],
  ]),
  q(11, "Alur Kerja Berantakan", "Operating", "Cara kerja tim terasa tidak rapi dan sering membuat orang bingung.", [
    ["A", "Ingin membuat alur atau SOP yang lebih jelas.", [sig("system_organizer"), sig("consistency_guardian")]],
    ["B", "Ingin menjelaskan ulang agar semua orang paham.", [sig("idea_translator"), sig("mentor_coach")]],
    ["C", "Langsung bantu bagian yang paling macet.", [sig("problem_restorer"), sig("people_developer")]],
    ["D", "Mengajak tim bicara agar tidak saling menyalahkan.", [sig("harmony_keeper"), sig("mediator")]],
  ]),
  q(12, "Rutinitas Panjang", "Operating", "Kamu harus menjalankan pekerjaan rutin yang sama dalam waktu lama.", [
    ["A", "Nyaman jika ritmenya jelas dan stabil.", [sig("consistency_guardian"), sig("operational_executor")]],
    ["B", "Mulai mencari cara agar prosesnya lebih efisien.", [sig("quality_evaluator"), sig("system_organizer")]],
    ["C", "Cepat bosan jika tidak ada hal baru.", [sig("fast_learner"), sig("routine_drain", "drain")]],
    ["D", "Bisa menjalankan asal hasilnya terlihat nyata.", [sig("achievement_driver"), sig("commitment_keeper")]],
  ]),
  q(13, "Barang Jarang Dipakai", "Thinking", "Ada barang yang sudah lama tidak dipakai, tapi masih mungkin berguna suatu hari nanti.", [
    ["A", "Menyimpannya dulu, siapa tahu nanti perlu.", [sig("resource_keeper"), sig("preparedness_keeper"), sig("too_much_saving", "overuse", 0.6)]],
    ["B", "Melepasnya agar ruang lebih lega.", [sig("declutterer"), sig("space_simplifier")]],
    ["C", "Menyimpan hanya kalau jelas fungsinya.", [sig("pattern_reader"), sig("operational_executor")]],
    ["D", "Menyimpan kalau ada nilai kenangan atau cerita.", [sig("memory_keeper"), sig("sentimental_connector")]],
  ]),
  q(14, "Ruang Berantakan", "Operating", "Meja atau ruangan terlihat berantakan saat kamu mau bekerja.", [
    ["A", "Rapikan dulu agar pikiran lebih enak.", [sig("order_restorer"), sig("visual_clarity_seeker")]],
    ["B", "Tetap kerja selama berantakannya tidak mengganggu tugas.", [sig("commitment_keeper"), sig("deep_thinker")]],
    ["C", "Rapikan bagian yang paling mengganggu saja.", [sig("system_organizer"), sig("balanced_order", "adaptive", 0.6)]],
    ["D", "Sulit mulai sebelum semuanya terlihat rapi.", [sig("order_restorer"), sig("order_dependency", "overuse")]],
  ]),
  q(15, "Folder Digital Penuh", "Operating", "Folder kerja digital penuh dengan file lama, screenshot, dan catatan campur aduk.", [
    ["A", "Membuat folder dan penamaan yang rapi.", [sig("system_organizer"), sig("information_collector")]],
    ["B", "Menyimpan semuanya karena takut ada yang diperlukan nanti.", [sig("information_collector"), sig("resource_keeper"), sig("archive_overload", "overuse")]],
    ["C", "Menghapus banyak hal supaya ringan.", [sig("declutterer"), sig("space_simplifier")]],
    ["D", "Hanya mencari file saat benar-benar dibutuhkan.", [sig("adaptable_improviser"), sig("operational_executor", "adaptive", 0.5)]],
  ]),
  q(16, "Rencana Terlalu Mulus", "Analyzing", "Sebuah rencana terlihat bagus dan semua orang tampak optimis.", [
    ["A", "Ikut optimis dan mulai bergerak.", [sig("decision_director"), sig("action_mover")]],
    ["B", "Mencari bagian yang mungkin terlewat.", [sig("risk_checker"), sig("threat_scanner")]],
    ["C", "Menyiapkan rencana cadangan.", [sig("preparedness_keeper"), sig("contingency_planner")]],
    ["D", "Menanyakan dampaknya ke orang yang akan menjalankan.", [sig("emotion_reader"), sig("fairness_guardian")]],
  ]),
  q(17, "Peluang Besar", "Striving", "Ada peluang besar, tapi belum semua risikonya jelas.", [
    ["A", "Ambil peluang dulu, risiko bisa ditangani sambil jalan.", [sig("decision_director"), sig("achievement_driver")]],
    ["B", "Mulai dari percobaan kecil yang aman.", [sig("experimenter"), sig("risk_checker", "adaptive", 0.5)]],
    ["C", "Tahan dulu sampai risiko lebih jelas.", [sig("risk_checker"), sig("hesitation_risk", "overuse", 0.6)]],
    ["D", "Cari orang yang lebih berpengalaman untuk validasi.", [sig("collaborative_validator", "adaptive"), sig("relationship_keeper")]],
  ]),
  q(18, "Belum Pasti", "Analyzing", "Ada sesuatu yang belum pasti, dan kamu belum tahu hasil akhirnya.", [
    ["A", "Bisa menunggu sambil menjalani hal lain.", [sig("calm_holder"), sig("consistency_guardian")]],
    ["B", "Menyiapkan beberapa kemungkinan agar lebih tenang.", [sig("preparedness_keeper"), sig("risk_checker")]],
    ["C", "Pikiran berulang memikirkan kemungkinan buruk.", [sig("threat_scanner"), sig("worry_loop", "overuse"), sig("uncertainty_drain", "drain")]],
    ["D", "Mengajak orang bicara agar tidak memikirkan sendiri.", [sig("relationship_keeper"), sig("emotion_reader", "adaptive", 0.6)]],
  ]),
  q(19, "Keputusan Kurang Adil", "Relating", "Ada keputusan yang menguntungkan sebagian orang, tapi terasa kurang adil bagi yang lain.", [
    ["A", "Menanyakan dasar keputusannya.", [sig("fairness_guardian"), sig("pattern_reader")]],
    ["B", "Mencoba memahami posisi semua pihak dulu.", [sig("mediator"), sig("perspective_taker")]],
    ["C", "Menyuarakan keberatan jika terasa tidak benar.", [sig("ethics_guardian"), sig("decision_director")]],
    ["D", "Menghindari konflik kalau bukan tanggung jawab saya.", [sig("boundary_keeper"), sig("conflict_avoidance", "adaptive", 0.5)]],
  ]),
  q(20, "Suasana Kaku", "Influencing", "Kamu masuk ke ruangan yang suasananya kaku dan orang-orang belum saling bicara.", [
    ["A", "Membuka sapaan agar suasana cair.", [sig("warm_connector"), sig("social_spark")]],
    ["B", "Mengamati dulu siapa yang nyaman diajak bicara.", [sig("emotion_reader"), sig("relationship_keeper")]],
    ["C", "Menunggu orang lain memulai.", [sig("social_adaptive", "adaptive"), sig("low_social_initiation", "quality", 0.2)]],
    ["D", "Tetap tenang dan tidak merasa perlu mengubah suasana.", [sig("calm_holder"), sig("deep_thinker")]],
  ]),
  q(21, "Kumpulan Mulai Sepi", "Influencing", "Obrolan kelompok mulai hambar dan orang terlihat bosan.", [
    ["A", "Membuka topik baru agar suasana hidup.", [sig("social_spark"), sig("mood_lifter")]],
    ["B", "Menikmati suasana tenang tanpa perlu mengubahnya.", [sig("calm_holder"), sig("quiet_presence")]],
    ["C", "Mengamati siapa yang terlihat tidak nyaman.", [sig("emotion_reader"), sig("relationship_keeper")]],
    ["D", "Mengajak orang melakukan aktivitas kecil bersama.", [sig("group_energizer"), sig("kinesthetic_mover")]],
  ]),
  q(22, "Ide Belum Dipahami", "Influencing", "Kamu punya ide yang menurutmu penting, tapi orang lain belum melihat nilainya.", [
    ["A", "Menjelaskan dengan contoh agar mudah dipahami.", [sig("idea_translator"), sig("mentor_coach")]],
    ["B", "Meyakinkan orang tentang manfaatnya.", [sig("persuader"), sig("achievement_driver")]],
    ["C", "Membuat demo atau bentuk nyata dari ide itu.", [sig("prototype_builder"), sig("creative_designer")]],
    ["D", "Simpan dulu sampai ada waktu yang lebih tepat.", [sig("strategy_designer"), sig("future_mapper")]],
  ]),
  q(23, "Diskusi Lambat", "Striving", "Diskusi terlalu lama dan belum ada keputusan.", [
    ["A", "Mendorong tim menentukan langkah berikutnya.", [sig("decision_director"), sig("decision_mover")]],
    ["B", "Merangkum pilihan agar keputusan lebih jelas.", [sig("idea_translator"), sig("pattern_reader")]],
    ["C", "Menanyakan apakah semua orang sudah merasa didengar.", [sig("harmony_keeper"), sig("mediator")]],
    ["D", "Menunggu sampai data dan risikonya cukup jelas.", [sig("risk_checker"), sig("pattern_reader")]],
  ]),
  q(24, "Orang Dekat Berubah", "Relating", "Orang dekat kamu terlihat berubah, lebih diam, atau tidak seperti biasanya.", [
    ["A", "Menanyakan kabarnya secara langsung.", [sig("relationship_keeper"), sig("caregiver")]],
    ["B", "Mengamati dulu sebelum bertanya.", [sig("emotion_reader"), sig("sensitive_observer")]],
    ["C", "Memberi ruang sampai dia siap cerita.", [sig("boundary_keeper"), sig("respectful_distance", "adaptive")]],
    ["D", "Mencoba menghibur agar suasana lebih ringan.", [sig("mood_lifter"), sig("social_spark")]],
  ]),
  q(25, "Orang Lain Kesulitan", "Supporting", "Ada orang kesulitan menjalankan sesuatu yang sebenarnya kamu pahami.", [
    ["A", "Membantu langsung agar masalahnya selesai.", [sig("helper"), sig("practical_supporter")]],
    ["B", "Mengajarkan pelan-pelan sampai dia bisa sendiri.", [sig("people_developer"), sig("mentor")]],
    ["C", "Membuat panduan sederhana agar dia bisa mengikuti.", [sig("idea_translator"), sig("system_organizer")]],
    ["D", "Menunggu diminta agar tidak terlalu ikut campur.", [sig("boundary_keeper"), sig("respectful_distance", "adaptive")]],
  ]),
  q(26, "Konflik Kecil", "Relating", "Dua orang mulai salah paham dan suasana menjadi tidak enak.", [
    ["A", "Membantu menenangkan suasana dulu.", [sig("harmony_keeper"), sig("calm_holder")]],
    ["B", "Membantu menjelaskan maksud masing-masing pihak.", [sig("mediator"), sig("perspective_taker")]],
    ["C", "Mencari fakta agar tidak salah menyimpulkan.", [sig("pattern_reader"), sig("fairness_guardian")]],
    ["D", "Menjauh jika konflik itu bukan urusan saya.", [sig("boundary_keeper"), sig("conflict_avoidance", "adaptive", 0.5)]],
  ]),
  q(27, "Hubungan Terasa Berubah", "Relating", "Ada teman atau rekan yang biasanya dekat, lalu tiba-tiba mulai jarang merespons.", [
    ["A", "Menghubungi dan menanyakan kabarnya.", [sig("relationship_keeper"), sig("warm_connector")]],
    ["B", "Memikirkan apakah ada sesuatu yang salah.", [sig("emotion_reader"), sig("relationship_overchecking", "overuse")]],
    ["C", "Membiarkan dulu karena setiap orang punya ruang.", [sig("boundary_keeper"), sig("respectful_distance", "adaptive")]],
    ["D", "Mencari aktivitas bersama agar hubungan cair lagi.", [sig("social_spark"), sig("group_includer")]],
  ]),
  q(28, "Cara Kerja Kaku", "Striving", "Kamu diminta mengerjakan sesuatu dengan cara yang sangat kaku, padahal kamu melihat cara lain yang lebih masuk akal.", [
    ["A", "Ikuti dulu aturan yang diminta.", [sig("consistency_guardian"), sig("commitment_keeper")]],
    ["B", "Usulkan cara lain jika memang lebih efektif.", [sig("strategy_designer"), sig("quality_evaluator")]],
    ["C", "Cari celah agar tetap bisa bekerja dengan gaya sendiri.", [sig("autonomy_seeker"), sig("adaptable_improviser")]],
    ["D", "Tanyakan alasan kenapa caranya harus begitu.", [sig("pattern_reader"), sig("clarity_guardian")]],
  ]),
  q(29, "Diminta Membantu Saat Penuh", "Supporting", "Seseorang meminta bantuan saat kamu sendiri sedang banyak tanggungan.", [
    ["A", "Tetap membantu karena sulit menolak.", [sig("caregiver"), sig("self_neglect_risk", "overuse")]],
    ["B", "Membantu sedikit sesuai kemampuan.", [sig("balanced_helper", "adaptive"), sig("boundary_keeper")]],
    ["C", "Menolak dengan jelas agar pekerjaan utama tidak terganggu.", [sig("boundary_keeper"), sig("commitment_keeper")]],
    ["D", "Mengarahkan dia ke orang atau cara lain.", [sig("people_developer"), sig("practical_supporter")]],
  ]),
  q(30, "Apresiasi", "Influencing", "Hasil kerja kamu diapresiasi orang lain.", [
    ["A", "Merasa lebih hidup dan terdorong membuat hasil lebih besar.", [sig("impact_seeker"), sig("recognition_responsive")]],
    ["B", "Senang, tapi yang penting pekerjaan selesai dengan baik.", [sig("commitment_keeper"), sig("quality_evaluator")]],
    ["C", "Lebih suka apresiasi diberikan ke tim.", [sig("group_includer"), sig("harmony_keeper")]],
    ["D", "Kurang nyaman menjadi pusat perhatian.", [sig("quiet_contributor"), sig("deep_thinker")]],
  ]),
  q(31, "Menjadi Diri Sendiri", "Creating", "Lingkungan sekitar mendorong kamu tampil atau bersikap berbeda dari yang kamu rasa benar.", [
    ["A", "Menyesuaikan diri agar situasi tetap aman.", [sig("harmony_keeper", "adaptive"), sig("risk_checker")]],
    ["B", "Tetap menunjukkan sikap asli walau tidak semua orang suka.", [sig("authenticity_keeper"), sig("decision_director")]],
    ["C", "Diam dulu sambil membaca situasi.", [sig("risk_checker"), sig("emotion_reader")]],
    ["D", "Mencari cara menyampaikan diri tanpa membuat konflik besar.", [sig("mediator"), sig("idea_translator")]],
  ]),
  q(32, "Sesuatu Tidak Bekerja", "Operating", "Ada alat, sistem, atau proses yang tidak berjalan seperti seharusnya.", [
    ["A", "Ingin membongkar atau mencoba memperbaikinya.", [sig("operational_executor"), sig("hands_on_builder")]],
    ["B", "Mencari penyebab logisnya dulu.", [sig("problem_restorer"), sig("pattern_reader")]],
    ["C", "Mencari orang yang lebih ahli agar cepat aman.", [sig("risk_checker"), sig("relationship_keeper", "adaptive", 0.5)]],
    ["D", "Membuat cara sementara agar pekerjaan tetap jalan.", [sig("adaptable_improviser"), sig("workaround_builder")]],
  ]),
  q(33, "Tampilan Kurang Enak", "Creating", "Sebuah desain, ruangan, dokumen, atau tampilan terlihat kurang rapi secara visual.", [
    ["A", "Cepat melihat bagian yang mengganggu mata.", [sig("aesthetic_stylist"), sig("visual_detail_checker")]],
    ["B", "Fokus pada fungsi dulu, tampilan bisa nanti.", [sig("operational_executor"), sig("commitment_keeper")]],
    ["C", "Ingin membuatnya lebih bersih, indah, atau enak dilihat.", [sig("creative_designer"), sig("quality_evaluator")]],
    ["D", "Tidak terlalu terganggu selama orang masih bisa memakainya.", [sig("action_mover"), sig("operational_executor")]],
  ]),
  q(34, "Terlalu Lama Diskusi", "Operating", "Terlalu lama diskusi atau berpikir tanpa ada gerakan nyata.", [
    ["A", "Ingin segera mencoba sesuatu secara langsung.", [sig("kinesthetic_mover"), sig("action_mover")]],
    ["B", "Masih nyaman berpikir sampai konsepnya matang.", [sig("deep_thinker"), sig("meaning_keeper")]],
    ["C", "Minta dibuat langkah kecil agar diskusi tidak menggantung.", [sig("decision_director"), sig("operational_executor")]],
    ["D", "Membuat visual, sketsa, atau contoh agar ide lebih konkret.", [sig("creative_designer"), sig("idea_translator")]],
  ]),
  q(35, "Perubahan Mendadak", "Operating", "Rencana berubah mendadak dan tidak semua hal bisa berjalan sesuai susunan awal.", [
    ["A", "Cepat mencari cara baru agar tetap jalan.", [sig("adaptable_improviser"), sig("workaround_builder")]],
    ["B", "Merasa terganggu karena alur yang disiapkan jadi berubah.", [sig("consistency_guardian"), sig("sudden_change_drain", "drain")]],
    ["C", "Menenangkan orang dulu agar tidak panik.", [sig("calm_holder"), sig("harmony_keeper")]],
    ["D", "Mengecek dampak perubahan itu terhadap risiko dan hasil akhir.", [sig("risk_checker"), sig("future_mapper")]],
  ]),
  q(36, "Tekanan Mendadak", "Operating", "Orang-orang mulai panik karena ada masalah mendadak.", [
    ["A", "Menjadi lebih tenang dan mencari langkah berikutnya.", [sig("calm_holder"), sig("decision_mover")]],
    ["B", "Ikut tegang tapi tetap mencoba membantu.", [sig("helper"), sig("emotion_reader")]],
    ["C", "Mencari penyebab masalah secepat mungkin.", [sig("problem_restorer"), sig("pattern_reader")]],
    ["D", "Mengatur orang agar tidak bergerak sendiri-sendiri.", [sig("system_organizer"), sig("crisis_coordinator")]],
  ]),
  q(37, "Novelty Trap", "Thinking", "Ada hal baru yang menarik muncul saat kamu sedang mengejar target penting.", [
    ["A", "Saya bisa tetap menahan diri sampai target utama selesai.", [sig("commitment_keeper"), sig("priority_keeper")]],
    ["B", "Saya lihat sebentar lalu kembali ke target utama.", [sig("controlled_curiosity", "adaptive"), sig("fast_learner")]],
    ["C", "Saya sering terseret cukup jauh karena penasaran.", [sig("fast_learner"), sig("priority_leak", "overuse")]],
    ["D", "Saya justru merasa hal baru itu lebih menarik daripada target awal.", [sig("novelty_pull"), sig("unfinished_risk", "overuse")]],
  ]),
  q(38, "Sempurna vs Selesai", "Analyzing", "Pekerjaan sudah cukup layak dikirim, tapi kamu masih melihat kekurangan kecil.", [
    ["A", "Kirim dulu, revisi nanti jika diperlukan.", [sig("commitment_keeper"), sig("priority_keeper")]],
    ["B", "Perbaiki bagian yang paling penting saja.", [sig("balanced_improver", "adaptive"), sig("quality_evaluator")]],
    ["C", "Sulit melepas sebelum terasa benar-benar bagus.", [sig("quality_evaluator"), sig("perfection_delay", "overuse")]],
    ["D", "Minta orang lain menentukan apakah sudah cukup.", [sig("collaborative_validator", "adaptive"), sig("emotion_reader")]],
  ]),
  q(39, "Beban Menjaga Suasana", "Influencing", "Suasana kelompok terasa hambar, sementara kamu sedang lelah.", [
    ["A", "Saya biarkan saja, tidak harus selalu saya yang menghidupkan.", [sig("boundary_keeper")]],
    ["B", "Saya bantu sedikit kalau memang perlu.", [sig("social_spark"), sig("balanced_helper", "adaptive", 0.5)]],
    ["C", "Saya tetap mencoba meramaikan walau capek.", [sig("social_spark"), sig("social_responsibility_burden", "overuse")]],
    ["D", "Saya merasa bersalah kalau suasana jadi sepi.", [sig("mood_lifter"), sig("over_responsibility_for_mood", "overuse")]],
  ]),
  q(40, "Batas Saat Menolong", "Supporting", "Orang lain butuh bantuan, tapi kamu juga sedang penuh.", [
    ["A", "Saya jaga batas dan bilang belum bisa.", [sig("boundary_keeper"), sig("commitment_keeper")]],
    ["B", "Saya bantu sedikit tanpa mengorbankan semuanya.", [sig("balanced_helper", "adaptive"), sig("people_developer")]],
    ["C", "Saya sering tetap bantu sampai urusan sendiri tertunda.", [sig("caregiver"), sig("self_neglect_risk", "overuse")]],
    ["D", "Saya merasa tidak enak kalau tidak membantu.", [sig("relationship_keeper"), sig("self_neglect_risk", "overuse", 0.7)]],
  ]),
  q(41, "Putaran Khawatir", "Analyzing", "Ada rencana yang belum pasti hasilnya.", [
    ["A", "Saya bisa menunggu tanpa terlalu terganggu.", [sig("calm_holder")]],
    ["B", "Saya siapkan beberapa antisipasi lalu cukup.", [sig("preparedness_keeper"), sig("risk_checker")]],
    ["C", "Pikiran saya sering memutar kemungkinan buruk.", [sig("threat_scanner"), sig("worry_loop", "overuse")]],
    ["D", "Saya butuh banyak kepastian sebelum bisa tenang.", [sig("risk_checker"), sig("uncertainty_drain", "drain")]],
  ]),
  q(42, "Ketergantungan Keteraturan", "Operating", "Lingkungan sekitar tidak rapi, tapi ada tugas penting yang harus diselesaikan.", [
    ["A", "Saya bisa fokus dulu ke tugas utama.", [sig("commitment_keeper"), sig("priority_keeper")]],
    ["B", "Saya rapikan bagian yang paling mengganggu saja.", [sig("order_restorer"), sig("balanced_order", "adaptive", 0.5)]],
    ["C", "Saya sulit fokus sebelum sekitar terasa rapi.", [sig("order_restorer"), sig("order_dependency", "overuse")]],
    ["D", "Saya bisa kesal kalau orang lain membuatnya berantakan lagi.", [sig("order_restorer"), sig("control_tension", "overuse", 0.8)]],
  ]),
  q(43, "Data Belum Lengkap", "Analyzing", "Keputusan harus segera dibuat, tapi data belum lengkap.", [
    ["A", "Saya ambil keputusan terbaik dari data yang ada.", [sig("decision_director"), sig("action_mover")]],
    ["B", "Saya tetapkan batas waktu untuk mencari data tambahan.", [sig("pattern_reader"), sig("commitment_keeper")]],
    ["C", "Saya sulit bergerak kalau data belum cukup.", [sig("pattern_reader"), sig("analysis_delay", "overuse")]],
    ["D", "Saya lebih memilih menunda daripada salah langkah.", [sig("risk_checker"), sig("hesitation_risk", "overuse")]],
  ]),
  q(44, "Cara Kerja Tim Berbeda", "Striving", "Kamu bekerja dengan tim yang cara kerjanya berbeda dari caramu.", [
    ["A", "Saya bisa menyesuaikan selama tujuannya jelas.", [sig("adaptable_improviser"), sig("harmony_keeper", "adaptive", 0.4)]],
    ["B", "Saya usulkan cara saya jika memang lebih efektif.", [sig("strategy_designer"), sig("quality_evaluator")]],
    ["C", "Saya mudah frustrasi jika harus mengikuti cara yang menurut saya tidak masuk akal.", [sig("autonomy_seeker"), sig("collaboration_drain", "drain")]],
    ["D", "Saya lebih suka mengerjakan sendiri daripada terlalu banyak kompromi.", [sig("deep_thinker"), sig("collaboration_drain", "drain", 0.7)]],
  ]),
];
