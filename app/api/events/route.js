import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { eventname, date, time, location, user_email } = body;

    if (!eventname || !user_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("events")
      .insert([{ eventname, date, time, location, user_email }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to add event signup" }, { status: 500 });
    }

    return NextResponse.json({ message: "Event signup recorded!", data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/event-signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
