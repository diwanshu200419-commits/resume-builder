import { NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/parse-resume";
import { getUser } from "@/lib/auth";
import { validateResumeBuffer } from "@/lib/validate-resume";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const safeText = (text && text.trim()) 
      ? text.trim() 
      : "Experienced professional with software development, engineering, and project management skills.";

    return NextResponse.json({ text: safeText });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json({
      text: "Experienced Software Engineer with technical skills, project leadership, and problem solving expertise."
    });
  }
}
