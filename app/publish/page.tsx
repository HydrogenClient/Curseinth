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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !modName || !user) return setMessage("Please fill all fields and login");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("modName", modName);
    formData.append("description", description);
    formData.append("version", version);
    formData.append("mcType", mcType);

    const res = await fetch("/api/mods/upload", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(data.message);
  };

  if (!user) return <p>You must log in to publish mods</p>;

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "auto", color: "#fff" }}>
      <h2>Publish a Mod (Logged in as {user})</h2>
      <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          placeholder="Mod Name"
          value={modName}
          onChange={(e) => setModName(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6 }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, height: 80 }}
        />
        <input
          type="text"
          placeholder="Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6 }}
        />
        <select value={mcType} onChange={(e) => setMcType(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="Fabric">Fabric</option>
          <option value="Forge">Forge</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <button
          type="submit"
          style={{
            background: "#0f0",
            color: "#000",
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Publish Mod
        </button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
