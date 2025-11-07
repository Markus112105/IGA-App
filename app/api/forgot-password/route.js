import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email } = body || {};
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const supabase = getSupabaseAdmin();

    const { data: user, error: userLookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (userLookupError) {
      console.error("/api/forgot-password lookup error", userLookupError);
      return NextResponse.json({ error: "Unable to start password reset" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ message: "If that email exists, you'll receive reset instructions shortly." }, { status: 200 });
    }

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const redirectTo = `${origin.replace(/\/$/, "")}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });

    if (resetError) {
      console.error("/api/forgot-password reset error", resetError);
      return NextResponse.json({ error: "Unable to start password reset" }, { status: 500 });
    }

    return NextResponse.json({ message: "Check your email for a password reset link." });
  } catch (err) {
    console.error("/api/forgot-password error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
