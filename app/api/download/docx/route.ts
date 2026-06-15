import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { canDownloadDOCX } from "@/lib/plans";
import { generateResumeDOCX, generateCoverLetterDOCX } from "@/lib/generate-docx";
import { downloadSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canDownloadDOCX(profile)) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
    }

    const body = await request.json();
    const validation = downloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { analysisId, jobTitle, type } = validation.data;
    const supabase = await createClient();
    const serviceSupabase = await createServiceClient();

    const { data: analysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", profile.id)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Track download using Service Role to bypass RLS
    await serviceSupabase
      .from("profiles")
      .update({ total_resume_downloads: (profile.total_resume_downloads || 0) + 1 })
      .eq("id", profile.id);

    const title = jobTitle || analysis.job_title || "Resume";
    const name = profile.full_name?.split(" ")[0] || "Resume";
    const filename = `${name}-${title.replace(/\s+/g, "-")}-ResumeAI.docx`;

    let buffer: Buffer;
    if (type === "cover-letter") {
      const content = analysis.cover_letter || "";
      buffer = await generateCoverLetterDOCX(content, title);
    } else {
      const content = analysis.optimized_resume_text || analysis.original_resume_text;
      buffer = await generateResumeDOCX(content, title);
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("DOCX download error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
