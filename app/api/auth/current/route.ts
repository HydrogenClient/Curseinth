import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const username = req.cookies.get("github_user")?.value || null;
  return NextResponse.json({ user: username });
}
