import { NextResponse } from "next/server";
import { currentUser } from "../github/callback/route";

export async function GET() {
  return NextResponse.json({ user: currentUser });
}
