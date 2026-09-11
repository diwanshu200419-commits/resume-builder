import { NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/parse-resume";
import { validateResumeBuffer } from "@/lib/validate-resume";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Deep Magic Byte & File Header Validation
    const validation = validateResumeBuffer(buffer, file.name);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || "Invalid file format." }, { status: 400 });
    }

    const text = await parseResumeFile(buffer, file.name);

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Public parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
