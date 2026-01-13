import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const username = cookieStore.get("github_user")?.value || null;
  return NextResponse.json({ user: username });
}
