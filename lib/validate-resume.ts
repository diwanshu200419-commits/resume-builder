export function validateResumeFile(file: File): string | null {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return "Please upload a PDF (.pdf), DOCX (.docx), or TXT (.txt) file.";
  }

  if (file.type && !allowedTypes.includes(file.type) && file.type !== "application/octet-stream") {
    return "Invalid file format detected.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File size must be under 5MB.";
  }

  return null;
}

/**
 * Validates uploaded file buffer headers against magic bytes to prevent forged files.
 */
export function validateResumeBuffer(
  buffer: Buffer,
  filename: string
): { valid: boolean; error?: string } {
  const ext = "." + filename.split(".").pop()?.toLowerCase();
  const allowedExtensions = [".pdf", ".docx", ".txt"];

  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: "Unsupported file extension. Only .pdf, .docx, and .txt are accepted." };
  }

  if (buffer.length === 0) {
    return { valid: false, error: "Uploaded file is empty." };
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return { valid: false, error: "File exceeds 5MB limit." };
  }

  // 1. PDF Magic Byte Validation: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
  if (ext === ".pdf") {
    const header = buffer.subarray(0, 5).toString("ascii");
    if (header !== "%PDF-") {
      return { valid: false, error: "Invalid PDF structure: magic bytes mismatch." };
    }
  }

  // 2. DOCX (ZIP Container) Magic Byte Validation: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
  if (ext === ".docx") {
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b ||
      buffer[2] !== 0x03 ||
      buffer[3] !== 0x04
    ) {
      return { valid: false, error: "Invalid DOCX structure: corrupted or forged archive signature." };
    }
  }

  // 3. Plain Text Validation: Prevent binary/executable payload masquerading
  if (ext === ".txt") {
    // Check for DOS/PE Executable (MZ)
    if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
      return { valid: false, error: "Executable binaries are not permitted." };
    }
    // Check for ELF Executable (\x7fELF)
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x7f &&
      buffer[1] === 0x45 &&
      buffer[2] === 0x4c &&
      buffer[3] === 0x46
    ) {
      return { valid: false, error: "Binary executable files are not permitted." };
    }
    // Check for Mach-O binaries
    if (
      buffer.length >= 4 &&
      ((buffer[0] === 0xfe && buffer[1] === 0xed && buffer[2] === 0xfa && buffer[3] === 0xce) ||
        (buffer[0] === 0xcf && buffer[1] === 0xfa && buffer[2] === 0xed && buffer[3] === 0xfe) ||
        (buffer[0] === 0xca && buffer[1] === 0xfe && buffer[2] === 0xba && buffer[3] === 0xbe))
    ) {
      return { valid: false, error: "Binary executable files are not permitted." };
    }
    // Inspect sample bytes for NULL characters indicating binary format
    const sample = buffer.subarray(0, Math.min(buffer.length, 1024));
    for (let i = 0; i < sample.length; i++) {
      if (sample[i] === 0x00) {
        return { valid: false, error: "Binary content detected in text file." };
      }
    }
  }

  return { valid: true };
}

