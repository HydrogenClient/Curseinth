import { NextResponse } from "next/server";
import { mods } from "../_mods";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // ✅ Await cookies
  const cookieStore = await cookies();
  const username = cookieStore.get("github_user")?.value;
  if (!username) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  // Get form data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const modName = formData.get("modName") as string;
  const description = formData.get("description") as string;
  const version = formData.get("version") as string;
  const mcType = formData.get("mcType") as string;

  if (!file || !modName) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

  // Save the file
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // Avoid overwriting files: add timestamp to filename
  const timestamp = Date.now();
  const safeFileName = `${timestamp}-${file.name}`;
  const filePath = path.join(uploadsDir, safeFileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Add mod to in-memory list
  mods.push({
    id: mods.length + 1,
    modName,
    description,
    version,
    mcType,
    author: username,
    fileName: safeFileName,
    downloadUrl: `/uploads/${encodeURIComponent(safeFileName)}`,
    uploadedAt: new Date().toISOString(),
  });

  return NextResponse.json({ message: "Mod published successfully!" });
}
