import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// ── Color palette ──
const Colors = {
  ink: "#1A1A1A",
  inkSoft: "#3D3D3D",
  inkMuted: "#8C8C8C",
  paper: "#FBF7F2",
  paperWarm: "#F5F0E8",
  white: "#FFFFFF",
  terracotta: "#C4704F",
  terracottaLight: "#F0DED5",
  terracottaDark: "#A05A3E",
  border: "#E5E0D8",
  borderStrong: "#D5CFC5",
  surface: "#F5F0E8",
  tableHead: "#1A1A1A",
  tableHeadText: "#FBF7F2",
  coverBg: "#FFFFFF",
};

// ── Font base64 for inline embedding ──
const fontsDir = path.join(process.cwd(), "fonts");

function fontFace(name: string, weight: number, file: string): string {
  const data = fs.readFileSync(path.join(fontsDir, file)).toString("base64");
  return `@font-face {
    font-family: '${name}';
    src: url(data:font/ttf;base64,${data}) format('truetype');
    font-weight: ${weight};
    font-style: normal;
  }`;
}

// ── Markdown → HTML ──
function isH1(l: string) { return /^## /.exec(l); }
function isH2(l: string) { return /^### /.exec(l); }
function isBullet(l: string) { return /^[—\-]\s/.exec(l); }
function isTable(l: string) { return l.startsWith("|"); }
function isBlank(l: string) { return l.trim() === ""; }
function isHR(l: string) { return l.trim() === "---"; }
function isWhyChooseMe(l: string) { return /^Why Choose Me$/.exec(l.trim()); }
function isExpectedOutcomes(l: string) { return /^Expected Outcomes$/.exec(l.trim()); }
function isDisclaimer(l: string) { return /^\*\*Disclaimer/.exec(l); }
function isTier(l: string) { return /^### Tier \d/.exec(l); }

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderContent(body: string): string {
  const lines = body.split("\n");
  let html = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line) || isHR(line) || isDisclaimer(line)) { i++; continue; }

    // Feature block (Why Choose Me / Expected Outcomes)
    if (isWhyChooseMe(line) || isExpectedOutcomes(line)) {
      const heading = escapeHtml(line.replace(/^## /, ""));
      const items: string[] = [];
      i++;
      while (i < lines.length && isBullet(lines[i])) {
        items.push(escapeHtml(lines[i].replace(/^[—\-]\s*/, "")));
        i++;
      }
      html += `<div class="feature-box"><div class="feature-title">${heading}</div>`;
      for (const item of items) {
        html += `<div class="feature-body">${item}</div>`;
      }
      html += `</div>`;
      continue;
    }

    // H1 heading
    if (isH1(line)) {
      html += `<h1 class="section-heading">${escapeHtml(line.replace(/^## /, ""))}</h1>`;
      i++; continue;
    }

    // H2 heading
    if (isH2(line)) {
      html += `<h2 class="sub-heading">${formatBold(escapeHtml(line.replace(/^### /, "")))}</h2>`;
      i++; continue;
    }

    // Bullet list
    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^[—\-]\s*/, ""));
        i++;
      }
      html += `<ul>`;
      for (const item of items) {
        html += `<li>${formatBold(escapeHtml(item))}</li>`;
      }
      html += `</ul>`;
      continue;
    }

    // Table
    if (isTable(line)) {
      const tbl: string[] = [];
      while (i < lines.length && isTable(lines[i])) { tbl.push(lines[i]); i++; }
      if (tbl.length >= 2) {
        const parse = (l: string) => l.split("|").map(c => c.trim()).filter(Boolean);
        const hdr = parse(tbl[0]);
        const rows = tbl.slice(2).map(parse).filter(r => r.length > 0);
        html += `<table>`;
        html += `<thead><tr>${hdr.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
        html += `<tbody>`;
        for (const row of rows) {
          html += `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`;
        }
        html += `</tbody></table>`;
      }
      continue;
    }

    // Regular paragraph
    html += `<p>${formatBold(escapeHtml(line))}</p>`;
    i++;
  }

  return html;
}

function buildHtml(args: {
  client: string;
  title: string;
  today: string;
  proposalBody: string;
  sowBody: string;
  quoteBody: string;
}): string {
  const { client, title, today, proposalBody, sowBody, quoteBody } = args;
  const coverSubtitle = "Agency-grade proposal package";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  ${fontFace("Playfair Display", 400, "PlayfairDisplay-Regular.ttf")}
  ${fontFace("Playfair Display", 700, "PlayfairDisplay-Bold.ttf")}
  ${fontFace("DM Sans", 400, "DMSans-Regular.ttf")}
  ${fontFace("DM Sans", 700, "DMSans-Bold.ttf")}

  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page {
    size: A4;
    margin: 60pt 52pt 52pt 52pt;
    @bottom-center {
      content: counter(page);
      font-family: 'DM Sans';
      font-size: 8pt;
      color: ${Colors.inkMuted};
    }
  }
  @page:first {
    margin: 0;
    @bottom-center { content: none; }
  }

  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'DM Sans'; font-size: 10pt; color: ${Colors.inkSoft}; line-height: 1.55; }

  /* ══════ COVER ══════ */
  .cover {
    background: ${Colors.coverBg};
    color: ${Colors.ink};
    padding: 72pt 64pt;
    height: 297mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    page-break-after: always;
    position: relative;
  }
  .cover-accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6pt;
    background: ${Colors.terracotta};
  }
  .cover-eyebrow {
    font-size: 9pt;
    font-family: 'DM Sans';
    color: ${Colors.terracotta};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 24pt;
  }
  .cover-title {
    font-size: 36pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.ink};
    line-height: 1.15;
    margin-bottom: 12pt;
  }
  .cover-subtitle {
    font-size: 16pt;
    font-family: 'Playfair Display';
    font-weight: 400;
    color: ${Colors.inkMuted};
    font-style: italic;
    margin-bottom: 40pt;
  }
  .cover-divider {
    width: 40pt;
    height: 2pt;
    background: ${Colors.terracotta};
    margin-bottom: 40pt;
  }
  .cover-meta-row { display: flex; gap: 40pt; }
  .cover-meta-col { display: flex; flex-direction: column; gap: 4pt; }
  .cover-meta-label {
    font-size: 8pt;
    font-family: 'DM Sans';
    color: ${Colors.inkMuted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cover-meta-value {
    font-size: 14pt;
    font-family: 'Playfair Display';
    color: ${Colors.ink};
  }
  .cover-footer {
    position: absolute;
    bottom: 40pt;
    left: 64pt;
    right: 64pt;
    font-size: 8pt;
    font-family: 'DM Sans';
    color: ${Colors.inkMuted};
    border-top: 1pt solid ${Colors.border};
    padding-top: 12pt;
  }

  /* ══════ CONTENT ══════ */
  .section-label {
    font-size: 10pt;
    font-family: 'DM Sans';
    color: ${Colors.terracotta};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 24pt;
    padding-bottom: 8pt;
    border-bottom: 1pt solid ${Colors.border};
    margin-top: 12pt;
  }

  h1.section-heading {
    font-size: 18pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.ink};
    margin-top: 20pt;
    margin-bottom: 12pt;
    padding-bottom: 8pt;
    border-bottom: 1pt solid ${Colors.border};
  }
  h2.sub-heading {
    font-size: 12pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.ink};
    margin-top: 14pt;
    margin-bottom: 4pt;
  }
  p {
    margin-bottom: 2pt;
    color: ${Colors.inkSoft};
  }
  ul {
    margin: 3pt 0;
    padding-left: 14pt;
    list-style: none;
  }
  ul li {
    margin-bottom: 1.5pt;
    color: ${Colors.inkSoft};
  }
  ul li::before { content: "•  "; }

  /* Feature box */
  .feature-box {
    background: ${Colors.surface};
    border-left: 3pt solid ${Colors.terracotta};
    padding: 12pt 16pt;
    margin: 12pt 0;
  }
  .feature-title {
    font-size: 12pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.ink};
    margin-bottom: 6pt;
  }
  .feature-body {
    font-size: 9.5pt;
    font-family: 'DM Sans';
    color: ${Colors.inkSoft};
    line-height: 1.5;
    margin-bottom: 2pt;
  }

  /* Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
  }
  thead th {
    font-family: 'DM Sans';
    font-weight: 700;
    font-size: 9pt;
    color: ${Colors.tableHeadText};
    background: ${Colors.tableHead};
    padding: 7pt 12pt;
    text-align: left;
  }
  tbody td {
    font-size: 9pt;
    font-family: 'DM Sans';
    color: ${Colors.inkSoft};
    padding: 6pt 12pt;
    border-bottom: 0.5pt solid ${Colors.border};
  }
  tbody tr:nth-child(even) td { background: ${Colors.surface}; }

  /* Tier cards */
  .tier-card {
    border: 1pt solid ${Colors.border};
    border-radius: 4pt;
    padding: 16pt;
    margin-bottom: 10pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .tier-card.featured {
    border: 1.5pt solid ${Colors.terracotta};
    background: ${Colors.terracottaLight};
  }
  .tier-name {
    font-size: 14pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.ink};
    margin-bottom: 2pt;
  }
  .tier-price {
    font-size: 20pt;
    font-family: 'Playfair Display';
    font-weight: 700;
    color: ${Colors.terracotta};
    margin-bottom: 6pt;
  }
  .tier-desc {
    font-size: 9pt;
    font-family: 'DM Sans';
    color: ${Colors.inkMuted};
    margin-bottom: 8pt;
  }
  .tier-features {
    padding-left: 8pt;
    list-style: none;
  }
  .tier-features li {
    font-size: 9.5pt;
    font-family: 'DM Sans';
    color: ${Colors.inkSoft};
    line-height: 1.5;
    margin-bottom: 2pt;
  }
  .tier-features li::before { content: "— "; }
  .tier-note {
    font-size: 8.5pt;
    color: ${Colors.inkMuted};
    margin-top: 6pt;
  }

  /* Disclaimer */
  .disclaimer {
    font-size: 7.5pt;
    font-family: 'DM Sans';
    color: ${Colors.inkMuted};
    line-height: 1.4;
    margin-top: 10pt;
  }

  strong { font-weight: 700; }

  .doc-break { page-break-before: always; }
</style>
</head>
<body>
  <div class="cover">
    <div class="cover-accent-bar"></div>
    <div class="cover-eyebrow">Proposal, SOW &amp; Quote</div>
    <div class="cover-title">${escapeHtml(title)} Proposal</div>
    <div class="cover-subtitle">${escapeHtml(coverSubtitle)}</div>
    <div class="cover-divider"></div>
    <div class="cover-meta-row">
      <div class="cover-meta-col">
        <div class="cover-meta-label">Prepared for</div>
        <div class="cover-meta-value">${escapeHtml(client)}</div>
      </div>
      <div class="cover-meta-col">
        <div class="cover-meta-label">Date</div>
        <div class="cover-meta-value">${today}</div>
      </div>
    </div>
    <div class="cover-footer">Generated by ProposeKit</div>
  </div>

  <!-- PROPOSAL -->
  <div class="doc-break">
    <div class="section-label">Proposal</div>
    ${renderContent(proposalBody)}
  </div>

  <!-- STATEMENT OF WORK -->
  <div class="doc-break">
    <div class="section-label">Statement of Work</div>
    ${renderContent(sowBody)}
  </div>

  <!-- QUOTE -->
  <div class="doc-break">
    <div class="section-label">Quote</div>
    ${renderContent(quoteBody)}
  </div>
</body>
</html>`;
}

// ── Render HTML to PDF via Puppeteer ──
const LOCAL_CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser?.isConnected()) return browser;

  // 1. Explicit CHROME_PATH env var
  if (process.env.CHROME_PATH) {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-gpu"],
    });
    return browser;
  }

  // 2. Local macOS dev
  if (fs.existsSync(LOCAL_CHROME_PATH)) {
    browser = await puppeteer.launch({
      executablePath: LOCAL_CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-gpu"],
    });
    return browser;
  }

  // 3. Serverless fallback (Netlify / AWS Lambda)
  browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
}

export async function generatePdf(args: {
  client: string;
  title: string;
  today: string;
  proposalBody: string;
  sowBody: string;
  quoteBody: string;
}): Promise<Uint8Array> {
  const html = buildHtml(args);
  const b = await getBrowser();
  const page = await b.newPage();
  await page.setContent(html, { waitUntil: "load" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    preferCSSPageSize: true,
  });

  await page.close();
  return new Uint8Array(pdf);
}
