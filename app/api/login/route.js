import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyPassword } from "@/lib/passwords";

async function ensureSupabaseAuthUser(supabase, { email, password, firstName, lastName }) {
  try {
    const normalizedEmail = email.toLowerCase();
    const { error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
      },
    });

    if (error) {
      if (error.status === 422 || /already/iu.test(error.message || "")) {
        return;
      }

      if (error.status === 403 || error.code === "not_admin") {
        console.warn(
          "/api/login ensureSupabaseAuthUser skipped: service role key missing admin privileges"
        );
        return;
      }

      console.error("/api/login ensureSupabaseAuthUser error", error);
    }
  } catch (err) {
    console.error("/api/login ensureSupabaseAuthUser unexpected error", err);
  }
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: user, error: supabaseError } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, password_hash, password_salt"
      )
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (supabaseError) {
      console.error("/api/login supabase error", supabaseError);
      return NextResponse.json({ error: "Unable to process login" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.password_hash, user.password_salt);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await ensureSupabaseAuthUser(supabase, {
      email: user.email,
      password,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    // Return user info (without password hash/salt)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      }
    }, { status: 200 });
  } catch (err) {
    console.error("/api/login error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
