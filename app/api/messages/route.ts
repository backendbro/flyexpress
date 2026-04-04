import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET all messages
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Update message status (read/unread)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { error } = await supabase
      .from("messages")
      .update({ status: body.status })
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

// Submit new message (handles both enquiry modal & contact form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Build insert object with all possible fields
    const insertData: any = {
      name: body.name,
      email: body.email,
      status: "unread",
    };

    // Optional fields
    if (body.phone) insertData.phone = body.phone;
    if (body.company) insertData.company = body.company;
    if (body.pickup) insertData.pickup = body.pickup;
    if (body.delivery) insertData.delivery = body.delivery;
    if (body.weight) insertData.weight = body.weight;
    if (body.content) insertData.content_type = body.content;

    // Message content: priority notes (enquiry) -> comments (contact) -> message
    if (body.notes) insertData.message = body.notes;
    else if (body.comments) insertData.message = body.comments;
    else if (body.message) insertData.message = body.message;
    else insertData.message = "No message provided";

    const { error } = await supabase.from("messages").insert([insertData]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}