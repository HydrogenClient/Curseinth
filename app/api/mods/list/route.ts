import { NextResponse } from "next/server";
import { mods } from "../_mods";

export async function GET() {
  return NextResponse.json({ mods });
}
