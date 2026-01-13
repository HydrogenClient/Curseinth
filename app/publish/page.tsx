'use client';
import { useState, useEffect } from "react";

export default function Publish() {
  const [user, setUser] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modName, setModName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [mcType, setMcType] = useState("Fabric");
  const [message, setMessage] = useState("");

  // Fetch current user
  useEffect(() => {
    fetch("/api/auth/current")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const handlePublish = async () => {
    if (!user) {
      setMessage("You must be logged in to publish a mod.");
      return;
    }

    if (!file || !modName) {
      setMessage("File and Mod Name are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("modName", modName);
    formData.append("description", description || "");
    formData.append("version", version || "");
    formData.append("mcType", mcType);

    try {
      const res = await fetch("/api/mods/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Reset form
        setFile(null);
        setModName("");
        setDescription("");
        setVersion("");
        setMcType("Fabric");
      }
    } catch (err) {
      setMessage("Failed to publish mod.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 40, color: "#fff", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Publish a Mod</h1>

      {!user ? (
        <p>You must <a href="/api/auth/github" style={{ color: "#0f0" }}>log in with GitHub</a> to publish.</p>
      ) : (
        <div>
          <p>Logged in as <strong>{user}</strong></p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            <input
              type="text"
              placeholder="Mod Name"
              value={modName}
              onChange={(e) => setModName(e.target.value)}
              style={{ padding: 10, borderRadius: 6 }}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: 10, borderRadius: 6, minHeight: 80 }}
            />

            <input
              type="text"
              placeholder="Version (e.g., 1.0.0)"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              style={{ padding: 10, borderRadius: 6 }}
            />

            <select
              value={mcType}
              onChange={(e) => setMcType(e.target.value)}
              style={{ padding: 10, borderRadius: 6 }}
            >
              <option value="Fabric">Fabric</option>
              <option value="Forge">Forge</option>
            </select>

            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <button
              onClick={handlePublish}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0f0",
                color: "#000",
                fontWeight: "bold",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Publish Mod
            </button>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
