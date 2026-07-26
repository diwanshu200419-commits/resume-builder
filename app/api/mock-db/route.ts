import { NextRequest, NextResponse } from "next/server";
import { mockQuery, mockAuthAction } from "@/lib/mock-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, table, method, filters, data, payload } = body;

    if (action === "auth") {
      const result = mockAuthAction(method, payload);
      const res = NextResponse.json(result);
      
      // Set session cookie on login/signup or clear on signout
      if (method === "signInWithPassword" || method === "signUp") {
        if (result?.data?.session?.token) {
          res.cookies.set("mock-session-id", result.data.session.token, {
            path: "/",
            httpOnly: false, // Set to false so client-side code can read it if needed
            maxAge: 60 * 60 * 24 * 365, // 1 year
          });
        }
      } else if (method === "signOut") {
        res.cookies.delete("mock-session-id");
      }
      
      return res;
    }

    if (action === "query") {
      const result = mockQuery(table, method, filters || [], data);
      return NextResponse.json(result);
    }

    return NextResponse.json({ data: null, error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    console.error("Error in mock DB API", e);
    return NextResponse.json({ data: null, error: e.message || "Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Helper to read the current session from cookie directly
  const token = request.cookies.get("mock-session-id")?.value;
  const result = mockAuthAction("getUser", { token });
  return NextResponse.json(result);
}
