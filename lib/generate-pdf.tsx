import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// ─── Sanitize: strip any leaked internal AI/prompt text from resume content ──
// This is a last-line-of-defence guard. The primary fix is in gemini.ts fallback.
function sanitizeResumeContent(text: string): string {
  // Strip [FAANG Optimized Skills]: ... blocks (single or multi-line until next section)
  let clean = text.replace(/\[FAANG Optimized Skills\][^\n]*/gi, "");
  // Strip any other [Internal ...]: patterns
  clean = clean.replace(/\[[A-Z][^\]]*\]:\s*[^\n]*/g, "");
  // Strip raw job description injection markers
  clean = clean.replace(/key responsibilities[,:]?\s*/gi, "");
  // Collapse triple+ newlines
  clean = clean.replace(/\n{3,}/g, "\n\n");
  return clean.trim();
}

// ─── Section header detection ────────────────────────────────────────────────
const SECTION_HEADERS = [
  "professional summary",
  "summary",
  "objective",
  "work experience",
  "experience",
  "employment",
  "education",
  "skills",
  "technical skills",
  "projects",
  "certifications",
  "awards",
  "publications",
  "languages",
  "interests",
  "volunteer",
  "references",
  "contact",
];

function isSectionHeader(line: string): boolean {
  const normalized = line.trim().toLowerCase().replace(/[:•\-–]/g, "").trim();
  return SECTION_HEADERS.some((h) => normalized === h || normalized.startsWith(h));
}

function isBullet(line: string): boolean {
  return /^[\s]*[-•·▪▸*]\s/.test(line) || /^[\s]*\d+\.\s/.test(line);
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.45,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
    paddingBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  tagline: {
    fontSize: 9,
    color: "#555",
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    paddingBottom: 2,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    paddingLeft: 10,
    color: "#222",
    lineHeight: 1.5,
  },
  body: {
    fontSize: 10,
    marginBottom: 3,
    color: "#222",
    lineHeight: 1.5,
  },
});

// ─── Document Component ───────────────────────────────────────────────────────
function ResumeDocument({ content, candidateName, jobTitle }: {
  content: string;
  candidateName: string;
  jobTitle: string;
}) {
  const sanitized = sanitizeResumeContent(content);
  const lines = sanitized.split("\n").filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{candidateName}</Text>
          <Text style={styles.tagline}>
            {jobTitle} — Prepared by VayloAI
          </Text>
        </View>

        {/* Body lines */}
        {lines.map((line, i) => {
          if (isSectionHeader(line)) {
            return (
              <Text key={i} style={styles.sectionHeader}>
                {line.replace(/[:]/g, "").trim()}
              </Text>
            );
          }
          if (isBullet(line)) {
            return (
              <Text key={i} style={styles.bullet}>
                {"• " + line.replace(/^[\s\-•·▪▸*]\s*/, "").trim()}
              </Text>
            );
          }
          return (
            <Text key={i} style={styles.body}>
              {line}
            </Text>
          );
        })}
      </Page>
    </Document>
  );
}

// ─── Cover Letter Document ───────────────────────────────────────────────────
function CoverLetterDocument({ content, title, candidateName }: {
  content: string;
  title: string;
  candidateName: string;
}) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{candidateName}</Text>
          <Text style={styles.tagline}>Cover Letter — {title}</Text>
        </View>
        {paragraphs.map((para, i) => (
          <Text key={i} style={{ ...styles.body, marginBottom: 10 }}>
            {para.trim()}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

// ─── Exported generators ─────────────────────────────────────────────────────
export async function generateResumePDF(
  content: string,
  filename: string
): Promise<Buffer> {
  // Parse candidate name + job title from filename: "John-Software-Engineer-Resume.pdf"
  const parts = filename.replace(/\.pdf$/i, "").split("-");
  const candidateName = parts[0] || "Candidate";
  const jobTitle = parts.slice(1, -1).join(" ") || "Resume";

  const doc = (
    <ResumeDocument
      content={content}
      candidateName={candidateName}
      jobTitle={jobTitle}
    />
  );
  const blob = await pdf(doc).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateCoverLetterPDF(
  content: string,
  title: string,
  candidateName = "Candidate"
): Promise<Buffer> {
  const doc = (
    <CoverLetterDocument
      content={content}
      title={title}
      candidateName={candidateName}
    />
  );
  const blob = await pdf(doc).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
