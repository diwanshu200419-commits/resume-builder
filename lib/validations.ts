import { z } from "zod";

export const analyzeSchema = z.object({
  resumeText: z.string().min(100, "Resume text is too short").max(50000, "Resume text is too long"),
  jobDescription: z.string().min(50, "Job description is too short").max(20000, "Job description is too long"),
  jobTitle: z.string().max(100).optional().nullable(),
});

export const upiSubmitSchema = z.object({
  paymentId: z.string().uuid(),
  utr: z.string().trim().min(4, "Enter a valid transaction ID").max(40),
  customerName: z.string().trim().min(2, "Enter your full name").max(100),
  customerEmail: z.string().trim().email("Enter a valid email"),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20),
});

export const downloadSchema = z.object({
  analysisId: z.string().uuid(),
  jobTitle: z.string().max(100).optional().nullable(),
  type: z.enum(["resume", "cover-letter"]).optional(),
});

export const parseSchema = z.object({
  // File validation is usually done via formData, but we can validate the metadata
  maxSize: z.number().max(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).refine((types) => 
    types.every(t => ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(t))
  ),
});
