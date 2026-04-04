import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the auth_token cookie by setting it to expire immediately
  response.cookies.set({
    name: "auth_token",
    value: "",
    maxAge: -1, // forces deletion
    path: "/",
  });

  return response;
}