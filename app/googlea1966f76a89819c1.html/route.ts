import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: googlea1966f76a89819c1.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
