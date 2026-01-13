import { NextResponse } from "next/server";
import { mods } from "../_mods";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const username = req.cookies.get("github_user")?.value;
  if (!username) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const modName = formData.get("modName") as string;
  const description = formData.get("description") as string;
  const version = formData.get("version") as string;
  const mcType = formData.get("mcType") as string;

  if (!file || !modName) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

  // Save the file in public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  mods.push({
    id: mods.length + 1,
    modName,
    description,
    version,
    mcType,
    author: username,
    fileName: file.name,
    downloadUrl: `/uploads/${encodeURIComponent(file.name)}`,
    uploadedAt: new Date().toISOString(),
  });

  return NextResponse.json({ message: "Mod published successfully!" });
}
