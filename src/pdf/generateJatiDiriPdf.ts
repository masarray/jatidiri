import { jsPDF } from "jspdf";
import type { PatternSignatureReport, MicroRoleScore } from "@/engine/patternSignature";
import type { SmartResultAdvisory, AdvisoryAdaptive, AdvisoryTheme, AdvisoryVulnerability } from "@/engine/smartResultAdvisory";
import type { ReadingQuality } from "@/types/assessment";
import { displayMicroRoleName, displayRoleFamilyName } from "@/utils/displayNames";

type PdfReportInput = {
  name: string;
  date: string;
  context: string;
  advisory: SmartResultAdvisory;
  patternReport: PatternSignatureReport;
  readingQuality: ReadingQuality;
};

type Tone = "teal" | "amber" | "rose" | "slate" | "sky";

type RGB = [number, number, number];

const PAGE = {
  w: 210,
  h: 297,
  mx: 16,
  top: 17,
  bottom: 16,
};

const COLOR = {
  ink: "#172033",
  body: "#334155",
  muted: "#667085",
  line: "#E5E7EB",
  soft: "#F8FAFC",
  card: "#FFFFFF",
  teal: "#0F766E",
  tealSoft: "#E6F5F2",
  amber: "#D97706",
  amberSoft: "#FFF4DE",
  rose: "#E11D48",
  roseSoft: "#FFF1F2",
  sky: "#0369A1",
  skySoft: "#EAF6FF",
  slate: "#475569",
  slateSoft: "#F1F5F9",
};

const toneMap: Record<Tone, { accent: string; bg: string }> = {
  teal: { accent: COLOR.teal, bg: COLOR.tealSoft },
  amber: { accent: COLOR.amber, bg: COLOR.amberSoft },
  rose: { accent: COLOR.rose, bg: COLOR.roseSoft },
  slate: { accent: COLOR.slate, bg: COLOR.slateSoft },
  sky: { accent: COLOR.sky, bg: COLOR.skySoft },
};

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

function cleanText(text: string | null | undefined): string {
  return String(text ?? "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/\bAnda\b/g, "kamu")
    .replace(/\banda\b/g, "kamu")
    .replace(/rumah energi(?: alami)?(?:mu| kamu)?/gi, "zona kekuatan alami kamu")
    .replace(/sumber energi alamimu/gi, "zona kekuatan alami kamu")
    .replace(/\bundefined\b/gi, "")
    .replace(/social breadth/gi, "relasi sosial yang terlalu melebar")
    .replace(/\.\s+kamu/g, ". Kamu")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueClean(items: Array<string | null | undefined>): string[] {
  return [...new Set(items.map(cleanText).filter((item) => item.length > 0))];
}


class PdfWriter {
  private doc: jsPDF;
  private y = PAGE.top;
  private page = 1;
  private readonly title = "Peta Jati Diri";
  private readonly userName: string;
  private readonly reportDate: string;

  constructor(doc: jsPDF, userName: string, reportDate: string) {
    this.doc = doc;
    this.userName = userName;
    this.reportDate = reportDate;
  }

  get currentY() {
    return this.y;
  }

  setY(value: number) {
    this.y = value;
  }

  color(hex: string, mode: "text" | "fill" | "draw" = "text") {
    const [r, g, b] = hexToRgb(hex);
    if (mode === "text") this.doc.setTextColor(r, g, b);
    if (mode === "fill") this.doc.setFillColor(r, g, b);
    if (mode === "draw") this.doc.setDrawColor(r, g, b);
  }

  footer() {
    const y = PAGE.h - 10;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7.5);
    this.color(COLOR.muted, "text");
    this.doc.text(`${this.title} · ${this.userName}`, PAGE.mx, y);
    this.doc.text(`Hal. ${this.page}`, PAGE.w - PAGE.mx, y, { align: "right" });
  }

  header() {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7.5);
    this.color(COLOR.muted, "text");
    this.doc.text(this.title, PAGE.mx, 9);
    this.doc.text(this.reportDate, PAGE.w - PAGE.mx, 9, { align: "right" });
    this.color(COLOR.line, "draw");
    this.doc.setLineWidth(0.2);
    this.doc.line(PAGE.mx, 12, PAGE.w - PAGE.mx, 12);
  }

  newPage() {
    this.footer();
    this.doc.addPage();
    this.page += 1;
    this.header();
    this.y = PAGE.top;
  }

  ensure(height: number) {
    if (this.y + height > PAGE.h - PAGE.bottom) this.newPage();
  }

  addSection(kicker: string, title: string) {
    this.ensure(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(7.5);
    this.color(COLOR.teal, "text");
    this.doc.text(kicker.toUpperCase(), PAGE.mx, this.y);
    this.y += 5;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(14);
    this.color(COLOR.ink, "text");
    this.doc.text(cleanText(title), PAGE.mx, this.y);
    this.y += 9;
  }

  split(text: string, width: number, fontSize = 10) {
    this.doc.setFontSize(fontSize);
    return this.doc.splitTextToSize(cleanText(text), width) as string[];
  }

  paragraph(text: string, opts?: { fontSize?: number; color?: string; width?: number; lineH?: number; bold?: boolean }) {
    const fontSize = opts?.fontSize ?? 9.8;
    const width = opts?.width ?? PAGE.w - PAGE.mx * 2;
    const lineH = opts?.lineH ?? fontSize * 0.48;
    const lines = this.split(text, width, fontSize);
    this.ensure(lines.length * lineH + 3);
    this.doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    this.doc.setFontSize(fontSize);
    this.color(opts?.color ?? COLOR.body, "text");
    lines.forEach((line) => {
      this.doc.text(line, PAGE.mx, this.y);
      this.y += lineH;
    });
    this.y += 2.5;
  }

  pill(text: string, x: number, y: number, tone: Tone = "teal") {
    const t = toneMap[tone];
    const width = Math.min(70, this.doc.getTextWidth(cleanText(text)) + 9);
    this.color(t.bg, "fill");
    this.color(t.accent, "draw");
    this.doc.setLineWidth(0.15);
    this.doc.roundedRect(x, y - 4.5, width, 7, 3.5, 3.5, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(6.8);
    this.color(t.accent, "text");
    this.doc.text(cleanText(text).slice(0, 36), x + 4.5, y);
  }

  card(title: string, body: string | string[], opts?: { tone?: Tone; subtitle?: string; minHeight?: number }) {
    const tone = opts?.tone ?? "teal";
    const t = toneMap[tone];
    const x = PAGE.mx;
    const w = PAGE.w - PAGE.mx * 2;
    const titleLines = this.split(title, w - 18, 10.5);
    const bodyLines = (Array.isArray(body) ? body : [body]).flatMap((p) => this.split(p, w - 18, 9));
    const subtitleLines = opts?.subtitle ? this.split(opts.subtitle, w - 18, 8.5) : [];
    const h = Math.max(opts?.minHeight ?? 0, 15 + titleLines.length * 5 + subtitleLines.length * 4.5 + bodyLines.length * 4.3 + 9);

    this.ensure(h + 4);
    this.color(t.bg, "fill");
    this.color(t.accent, "draw");
    this.doc.setLineWidth(0.18);
    this.doc.roundedRect(x, this.y, w, h, 5, 5, "FD");
    this.color(t.accent, "fill");
    this.doc.roundedRect(x + 4, this.y + 5, 2.2, h - 10, 1.2, 1.2, "F");

    let cy = this.y + 9;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10.5);
    this.color(COLOR.ink, "text");
    titleLines.forEach((line) => {
      this.doc.text(line, x + 10, cy);
      cy += 5;
    });
    if (subtitleLines.length) {
      cy += 1;
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8.5);
      this.color(COLOR.muted, "text");
      subtitleLines.forEach((line) => {
        this.doc.text(line, x + 10, cy);
        cy += 4.2;
      });
    }
    cy += 2;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.color(COLOR.body, "text");
    bodyLines.forEach((line) => {
      this.doc.text(line, x + 10, cy);
      cy += 4.3;
    });

    this.y += h + 5;
  }

  twoColumnCards(items: { title: string; body: string; tone?: Tone }[]) {
    const gap = 6;
    const colW = (PAGE.w - PAGE.mx * 2 - gap) / 2;
    for (let i = 0; i < items.length; i += 2) {
      const row = items.slice(i, i + 2);
      const heights = row.map((item) => {
        const titleLines = this.split(item.title, colW - 16, 9.6);
        const bodyLines = this.split(item.body, colW - 16, 8.2);
        return 14 + titleLines.length * 4.7 + bodyLines.length * 4 + 7;
      });
      const h = Math.max(...heights, 32);
      this.ensure(h + 5);
      row.forEach((item, col) => {
        const tone = toneMap[item.tone ?? "teal"];
        const x = PAGE.mx + col * (colW + gap);
        this.color(tone.bg, "fill");
        this.color(tone.accent, "draw");
        this.doc.setLineWidth(0.15);
        this.doc.roundedRect(x, this.y, colW, h, 4.5, 4.5, "FD");
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(9.6);
        this.color(COLOR.ink, "text");
        let cy = this.y + 8;
        this.split(item.title, colW - 16, 9.6).forEach((line) => {
          this.doc.text(line, x + 8, cy);
          cy += 4.7;
        });
        cy += 2;
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(8.2);
        this.color(COLOR.body, "text");
        this.split(item.body, colW - 16, 8.2).forEach((line) => {
          this.doc.text(line, x + 8, cy);
          cy += 4;
        });
      });
      this.y += h + 5;
    }
  }

  scoreBar(label: string, value: number, color = COLOR.teal) {
    const x = PAGE.mx;
    const w = PAGE.w - PAGE.mx * 2;
    this.ensure(13);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.4);
    this.color(COLOR.body, "text");
    this.doc.text(cleanText(label), x, this.y);
    this.color(COLOR.muted, "text");
    this.doc.text(`${Math.round(value)}`, PAGE.w - PAGE.mx, this.y, { align: "right" });
    this.y += 3;
    this.color(COLOR.line, "fill");
    this.doc.roundedRect(x, this.y, w, 2.7, 1.35, 1.35, "F");
    this.color(color, "fill");
    this.doc.roundedRect(x, this.y, Math.max(2, (w * Math.max(0, Math.min(100, value))) / 100), 2.7, 1.35, 1.35, "F");
    this.y += 7;
  }

  listCard(title: string, items: string[], opts?: { tone?: Tone; prefix?: "number" | "bullet" }) {
    const cleaned = uniqueClean(items);
    if (cleaned.length === 0) return;
    const body = cleaned.map((item, index) => `${opts?.prefix === "bullet" ? "•" : `${index + 1}.`} ${item}`);
    this.card(title, body, { tone: opts?.tone ?? "teal" });
  }

  roleFamilyComparison(label: string, natural: number, strength: number) {
    const x = PAGE.mx;
    const w = PAGE.w - PAGE.mx * 2;
    this.ensure(22);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8.5);
    this.color(COLOR.ink, "text");
    this.doc.text(cleanText(label), x, this.y);
    this.y += 4;

    const barW = w - 28;
    const rows: Array<[string, number, string]> = [
      ["Alami", natural, COLOR.teal],
      ["Terlatih", strength, COLOR.amber],
    ];
    rows.forEach(([name, value, color]) => {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.color(COLOR.muted, "text");
      this.doc.text(name, x, this.y + 2.2);
      this.color(COLOR.line, "fill");
      this.doc.roundedRect(x + 18, this.y, barW, 2.8, 1.4, 1.4, "F");
      this.color(color, "fill");
      this.doc.roundedRect(x + 18, this.y, Math.max(2, (barW * Math.max(0, Math.min(100, value))) / 100), 2.8, 1.4, 1.4, "F");
      this.color(COLOR.muted, "text");
      this.doc.text(`${Math.round(value)}`, x + 18 + barW + 3, this.y + 2.2);
      this.y += 5.2;
    });
    this.y += 2.5;
  }

  cover(input: PdfReportInput) {
    this.color("#F6FBFA", "fill");
    this.doc.rect(0, 0, PAGE.w, PAGE.h, "F");
    this.color(COLOR.tealSoft, "fill");
    this.doc.circle(180, 28, 42, "F");
    this.color("#FFF7ED", "fill");
    this.doc.circle(26, 270, 48, "F");

    this.y = 46;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.color(COLOR.teal, "text");
    this.doc.text("PETA JATI DIRI", PAGE.mx, this.y);
    this.y += 10;
    this.doc.setFontSize(26);
    this.color(COLOR.ink, "text");
    this.doc.text("Laporan Pembacaan", PAGE.mx, this.y);
    this.y += 10;
    this.doc.text("Energi Diri", PAGE.mx, this.y);
    this.y += 18;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10.5);
    this.color(COLOR.body, "text");
    this.doc.text("Disusun sebagai alat refleksi diri, bukan diagnosis klinis atau alat seleksi kerja.", PAGE.mx, this.y);
    this.y += 22;

    this.color(COLOR.card, "fill");
    this.color(COLOR.line, "draw");
    this.doc.roundedRect(PAGE.mx, this.y, PAGE.w - PAGE.mx * 2, 64, 6, 6, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.color(COLOR.ink, "text");
    this.doc.text(cleanText(input.name), PAGE.mx + 9, this.y + 15);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.color(COLOR.muted, "text");
    this.doc.text(`Tanggal asesmen: ${input.date}`, PAGE.mx + 9, this.y + 27);
    this.doc.text(`Konteks pembacaan: ${input.context}`, PAGE.mx + 9, this.y + 36);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9.5);
    this.color(COLOR.teal, "text");
    const archetypeLines = this.split(input.advisory.archetype, PAGE.w - PAGE.mx * 2 - 18, 9.5).slice(0, 2);
    let ay = this.y + 48;
    archetypeLines.forEach((line) => {
      this.doc.text(line, PAGE.mx + 9, ay);
      ay += 4.5;
    });

    this.y = 240;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.color(COLOR.muted, "text");
    this.doc.text("Data disimpan di perangkat/browser kamu kecuali kamu menghubungkannya ke layanan lain.", PAGE.mx, this.y);
    this.doc.text("Baca hasil ini sebagai cermin refleksi dan bahan percakapan yang lebih sehat.", PAGE.mx, this.y + 5);
    this.newPage();
  }
}

function themeBody(theme: AdvisoryTheme) {
  return `${theme.headline} ${theme.body} Pakai sehatnya: ${theme.healthyUse}`;
}

function vulnerabilityBody(item: AdvisoryVulnerability) {
  return `${item.headline} ${item.body} Cara mengelola: ${item.support}`;
}

function adaptiveBody(item: AdvisoryAdaptive) {
  return `${item.headline} ${item.body} ${item.emotionalNote} Saran pemulihan: ${item.recovery}`;
}

function roleBody(role: MicroRoleScore, mode: "natural" | "strength") {
  const score = mode === "natural" ? role.natural : role.strength;
  return `${displayMicroRoleName(role)} (${score}). ${role.visible} ${role.healthyUse}`;
}

export async function generateJatiDiriPdf(input: PdfReportInput) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pdf = new PdfWriter(doc, input.name, input.date);

  pdf.cover(input);

  pdf.addSection("pembacaan utama", "Cermin Jati Diri");
  input.advisory.mirror.forEach((line) => pdf.paragraph(line, { fontSize: 10.3, lineH: 5.2 }));
  pdf.card("Kalimat paling ringkas", input.advisory.sharpSummary, { tone: "amber" });
  pdf.card("Terbaca dari pola jawaban", input.advisory.evidenceLine, { tone: "slate" });

  pdf.addSection("alignment", "Seberapa Kamu Selaras dengan Zona Kekuatan Alami");
  pdf.card(input.advisory.alignment.title, [input.advisory.alignment.headline, input.advisory.alignment.body], { tone: "teal" });
  pdf.twoColumnCards([
    { title: `Selaras: ${input.advisory.alignment.alignedCount}`, body: "Zona kekuatan alami yang juga sudah sering kamu gunakan sebagai kekuatan nyata.", tone: "teal" },
    { title: `Belum hidup: ${input.advisory.alignment.dormantCount}`, body: "Potensi yang punya sinyal alami, tetapi belum banyak menjadi aktivitas utama.", tone: "amber" },
    { title: `Adaptif: ${input.advisory.alignment.adaptiveCount}`, body: "Kemampuan yang bisa kamu lakukan karena tuntutan hidup/peran, namun perlu recovery.", tone: "rose" },
    { title: `Kualitas baca: ${input.readingQuality.score}/100`, body: input.readingQuality.summary, tone: "slate" },
  ]);

  pdf.addSection("sumber energi", "Kenapa Kamu Menyala");
  input.advisory.energyThemes.forEach((theme, idx) => {
    pdf.card(`${idx + 1}. ${theme.title}`, themeBody(theme), { tone: theme.tone });
  });

  pdf.addSection("titik rentan", "Kenapa Kamu Bisa Lelah");
  pdf.paragraph(
    "Kelelahan emosi tidak selalu muncul karena kamu tidak mampu. Kadang justru karena kamu mampu menjalankan banyak peran, tetapi terlalu lama berada di area yang bukan zona kekuatan alami kamu.",
    { fontSize: 9.7 },
  );
  input.advisory.vulnerabilities.forEach((item, idx) => {
    pdf.card(`${idx + 1}. ${item.title}`, vulnerabilityBody(item), { tone: item.tone });
  });

  if (input.advisory.adaptiveThemes.length > 0) {
    pdf.addSection("mode adaptif", "Kemampuan yang Bisa, Tapi Bisa Menguras");
    pdf.paragraph(
      "Area ini mungkin sudah kamu eksplorasi cukup jauh karena pekerjaan, tanggung jawab, atau tuntutan hidup. Kamu bisa melakukannya, tetapi belum tentu menjadi zona kekuatan alami kamu.",
      { fontSize: 9.7 },
    );
    input.advisory.adaptiveThemes.forEach((item, idx) => {
      pdf.card(`${idx + 1}. ${item.title}`, adaptiveBody(item), { tone: "amber" });
    });
  }

  if (input.advisory.dormantThemes.length > 0) {
    pdf.addSection("potensi", "Potensi yang Belum Banyak Kamu Hidupkan");
    input.advisory.dormantThemes.forEach((theme, idx) => {
      pdf.card(`${idx + 1}. ${theme.title}`, themeBody(theme), { tone: theme.tone });
    });
  }

  pdf.addSection("komunikasi", "Kalimat yang Menyalakan Energi Kamu");
  pdf.listCard("Kamu biasanya lebih ON ketika orang bertanya:", input.advisory.onSwitch.map((item) => `"${item}"`), { tone: "teal" });

  pdf.addSection("catatan relasi", "Untuk Pasangan / Rekan Kerja");
  pdf.card("Cara masuk yang lebih sehat", uniqueClean(input.advisory.forOthers.slice(0, 4)), { tone: "sky" });
  pdf.card("Yang bisa membuat kamu berat", uniqueClean(input.advisory.resistance.slice(0, 4)), { tone: "rose" });

  pdf.addSection("pemulihan", "Cara Merawat Diri");
  pdf.listCard("Langkah pemulihan yang disarankan", input.advisory.recoveryRituals, { tone: "teal" });
  input.advisory.selfCare.forEach((item) => pdf.paragraph(item, { fontSize: 9.4 }));

  pdf.addSection("detail peta", "Skor Pendukung");
  pdf.card("Cara membaca bagian ini", "Bagian ini adalah pendukung teknis. Pembacaan utama tetap ada pada Cermin Jati Diri, sumber energi, titik lelah, dan mode adaptif.", { tone: "slate" });

  pdf.addSection("alami", "Top Zona Kekuatan Alami");
  input.patternReport.topNaturalRoles.slice(0, 8).forEach((role) => pdf.scoreBar(displayMicroRoleName(role), role.natural, COLOR.teal));

  pdf.addSection("terlatih", "Kekuatan Aktivitas yang Sudah Terlihat");
  input.patternReport.topTrainedRoles.slice(0, 8).forEach((role) => pdf.scoreBar(displayMicroRoleName(role), role.strength, COLOR.amber));

  pdf.addSection("wilayah peran", "Peta Wilayah Peran");
  input.patternReport.roleFamilies.slice(0, 8).forEach((family) => {
    pdf.roleFamilyComparison(displayRoleFamilyName(family.family), family.natural, family.strength);
  });

  pdf.addSection("catatan", "Batas Pembacaan");
  pdf.card(
    "Bukan diagnosis klinis",
    "Laporan ini adalah alat refleksi diri berbasis jawaban asesmen. Gunakan sebagai bahan memahami pola energi, komunikasi, dan pengembangan diri. Jangan gunakan sebagai diagnosis klinis atau satu-satunya dasar keputusan penting.",
    { tone: "slate" },
  );
  pdf.card("Kualitas pembacaan", `Scale: 5-point. Raw answer: 1-5. Normalized score: 0-100. ${input.readingQuality.summary} ${(input.readingQuality.notes ?? []).join(" ")}`, { tone: "slate" });

  // ensure footer on final page
  pdf.footer();

  const fileName = `Peta-Jati-Diri-${cleanText(input.name).replace(/[^a-zA-Z0-9]+/g, "-") || "report"}.pdf`;
  doc.save(fileName);
}
