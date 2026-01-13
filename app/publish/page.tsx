'use client';
import { useState, useEffect } from "react";

export default function Publish() {
  const [user, setUser] = useState<string | null>(null);
  const [modName, setModName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [mcType, setMcType] = useState("Fabric");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("github_user="))
      ?.split("=")[1];
    if (username) setUser(decodeURIComponent(username));
  }, []);

  const handlePublish = async () => {
    if (!file || !modName || !user) return setMessage("Please fill all fields and login");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("modName", modName);
    formData.append("description", description);
    formData.append("version", version);
    formData.append("mcType", mcType);
    formData.append("author", user);

    const res = await fetch("/api/mods/upload", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h2>Publish a Mod {user ? `(Logged in as ${user})` : "(Not logged in)"}</h2>
      <input type="text" placeholder="Mod Name" value={modName} onChange={(e) => setModName(e.target.value)} />
      <br />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <br />
      <input type="text" placeholder="Version" value={version} onChange={(e) => setVersion(e.target.value)} />
      <br />
      <select value={mcType} onChange={(e) => setMcType(e.target.value)}>
        <option value="Fabric">Fabric</option>
        <option value="Forge">Forge</option>
      </select>
      <br />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <br />
      <button onClick={handlePublish}>Publish Mod</button>
      <p>{message}</p>
    </div>
  );
}
