import { NextRequest, NextResponse } from "next/server";
import { mockQuery, mockAuthAction, mockAddPaymentRequest, mockApprovePaymentRequest } from "@/lib/mock-db";

export async function POST(request: NextRequest) {
  // SECURITY: This mock DB endpoint is disabled in production.
  // It is only available for local development testing.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, table, method, filters, data, payload } = body;

    if (action === "add_payment_request") {
      const result = mockAddPaymentRequest(payload);
      return NextResponse.json({ data: result, success: true });
    }

    if (action === "approve_payment_request") {
      const result = mockApprovePaymentRequest(payload);
      return NextResponse.json({ data: result, success: true });
    }

    if (action === "auth") {
      const result = mockAuthAction(method, payload);
      const res = NextResponse.json(result);
      
      if (method === "signInWithPassword" || method === "signUp" || method === "verifyOtp") {
        if (result?.data?.session?.token) {
          res.cookies.set("mock-session-id", result.data.session.token, {
            path: "/",
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 365,
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
  const token = request.cookies.get("mock-session-id")?.value;
  const result = mockAuthAction("getUser", { token });
  return NextResponse.json(result);
}
