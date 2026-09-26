import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";

// ─── Sanitize: strip any leaked internal AI/prompt text ──────────────────────
function sanitizeResumeContent(text: string): string {
  let clean = text.replace(/\[FAANG Optimized Skills\][^\n]*/gi, "");
  clean = clean.replace(/\[[A-Z][^\]]*\]:\s*[^\n]*/g, "");
  clean = clean.replace(/key responsibilities[,:]?\s*/gi, "");
  clean = clean.replace(/\n{3,}/g, "\n\n");
  return clean.trim();
}

// ─── Section header detection ────────────────────────────────────────────────
const SECTION_HEADERS = [
  "professional summary", "summary", "objective", "work experience",
  "experience", "employment", "education", "skills", "technical skills",
  "projects", "certifications", "awards", "publications", "languages",
  "interests", "volunteer", "references", "contact",
];

function isSectionHeader(line: string): boolean {
  const normalized = line.trim().toLowerCase().replace(/[:•\-–]/g, "").trim();
  return SECTION_HEADERS.some((h) => normalized === h || normalized.startsWith(h));
}

function isBullet(line: string): boolean {
  return /^[\s]*[-•·▪▸*]\s/.test(line) || /^[\s]*\d+\.\s/.test(line);
}

// ─── Exported generators ─────────────────────────────────────────────────────
export async function generateResumeDOCX(content: string, title: string): Promise<Buffer> {
  const sanitized = sanitizeResumeContent(content);
  const lines = sanitized.split("\n").filter(Boolean);

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 32, color: "1a1a2e" })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Prepared by VayloAI", italics: true, size: 18, color: "555555" })],
      spacing: { after: 240 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "1a1a2e" },
      },
    }),
    ...lines.map((line) => {
      if (isSectionHeader(line)) {
        return new Paragraph({
          children: [
            new TextRun({
              text: line.replace(/[:]/g, "").trim().toUpperCase(),
              bold: true,
              size: 22,
              color: "1a1a2e",
            }),
          ],
          spacing: { before: 240, after: 80 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "cccccc" },
          },
        });
      }
      if (isBullet(line)) {
        return new Paragraph({
          children: [
            new TextRun({
              text: "• " + line.replace(/^[\s\-•·▪▸*]\s*/, "").trim(),
              size: 20,
              color: "222222",
            }),
          ],
          indent: { left: 200 },
          spacing: { after: 60 },
        });
      }
      return new Paragraph({
        children: [new TextRun({ text: line, size: 20, color: "222222" })],
        spacing: { after: 80 },
      });
    }),
  ];

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

export async function generateCoverLetterDOCX(
  content: string,
  title: string,
  candidateName = "Candidate"
): Promise<Buffer> {
  const paragraphBlocks = content.split("\n\n").filter(Boolean);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: candidateName, bold: true, size: 32, color: "1a1a2e" })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Cover Letter — ${title}`, italics: true, size: 18, color: "555555" })],
            spacing: { after: 240 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "1a1a2e" },
            },
          }),
          ...paragraphBlocks.map(
            (p) =>
              new Paragraph({
                children: [new TextRun({ text: p.trim(), size: 22 })],
                spacing: { after: 200 },
                alignment: AlignmentType.LEFT,
              })
          ),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
