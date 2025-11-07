import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/passwords";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    const accessToken = authHeader.slice(7).trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { password } = body || {};
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: user, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.user?.email) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const normalizedEmail = user.user.email.toLowerCase();
    const { hash, salt } = hashPassword(password);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hash, password_salt: salt })
      .eq("email", normalizedEmail);

    if (updateError) {
      console.error("/api/password/update error", updateError);
      return NextResponse.json({ error: "Unable to update password" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/password/update unexpected error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
