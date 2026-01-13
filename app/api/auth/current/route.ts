import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // ✅ Await cookies() because it's a Promise
  const cookieStore = await cookies();
  const username = cookieStore.get("github_user")?.value || null;

  return NextResponse.json({ user: username });
}
