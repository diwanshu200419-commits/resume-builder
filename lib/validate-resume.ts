export function validateResumeFile(file: File): string | null {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
    return "Please upload a PDF, DOCX, or TXT file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File size must be under 5MB.";
  }

  return null;
}
