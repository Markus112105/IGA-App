import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/passwords";

async function createSupabaseAuthUser(supabase, { email, password, firstName, lastName }) {
  const normalizedEmail = email.toLowerCase();

  const { data, error } = await supabase.auth.admin.createUser({
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
      return { error: "duplicate" };
    }

    if (error.status === 403 || error.code === "not_admin") {
      console.warn(
        "/api/signup supabase auth createUser skipped: service role key missing admin privileges"
      );
      return { error: "not_admin" };
    }

    console.error("/api/signup supabase auth createUser error", error);
    return { error };
  }

  return { user: data?.user || null };
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const { firstName, lastName, email, age, password, schoolOrWork, location } = body || {};

    // Basic validation
    if (!firstName || !lastName || !email || !age || !password || !schoolOrWork || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 4) {
      return NextResponse.json({ error: "Invalid age" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const authResult = await createSupabaseAuthUser(supabase, {
      email,
      password,
      firstName,
      lastName,
    });

    let warning;
    if (authResult.error) {
      if (authResult.error === "duplicate") {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      if (authResult.error === "not_admin") {
        warning = "Supabase service role key lacks admin privileges; password reset emails will be unavailable.";
      } else {
        return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
      }
    }

    const { hash, salt } = hashPassword(password);

    const { data, error: supabaseError } = await supabase
      .from('users')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          age: ageNum,
          school_or_work: schoolOrWork,
          location,
          password_hash: hash,
          password_salt: salt,
        },
      ])
      .select('id, email, created_at')
      .single();

    if (supabaseError) {
      if (authResult.user?.id) {
        try {
          await supabase.auth.admin.deleteUser(authResult.user.id);
        } catch (deleteErr) {
          console.error("/api/signup cleanup auth user error", deleteErr);
        }
      }

      if (
        supabaseError.code === '23505' ||
        (supabaseError.details && supabaseError.details.includes('users_email_lower_idx'))
      ) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      console.error("/api/signup supabase error", supabaseError);
      return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
    }

    return NextResponse.json({ user: data, warning }, { status: 201 });
  } catch (err) {
    console.error("/api/signup error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
