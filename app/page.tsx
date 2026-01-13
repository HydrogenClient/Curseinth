'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [mods, setMods] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Fetch the current user from the backend
  useEffect(() => {
    fetch("/api/auth/current")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  // Fetch mods list
  useEffect(() => {
    fetch("/api/mods/list")
      .then((res) => res.json())
      .then((data) => setMods(data.mods));
  }, []);

  const filtered = mods.filter((mod) =>
    mod.modName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      {!user ? (
        <a
          href="/api/auth/github"
          style={{
            background: "#fff",
            color: "#000",
            padding: 10,
            borderRadius: 6,
            display: "inline-block",
            marginBottom: 20,
          }}
        >
          Sign in with GitHub
        </a>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <p>Logged in as {user}</p>
          <a
            href="/publish"
            style={{
              background: "#0f0",
              color: "#000",
              padding: 10,
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            Publish a Mod
          </a>
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Browse Mods</h2>
      <input
        type="text"
        placeholder="Search mods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 6, marginTop: 10, width: "100%", maxWidth: 400 }}
      />

      <div style={{ marginTop: 20 }}>
        {filtered.map((mod) => (
          <div
            key={mod.id}
            style={{
              border: "1px solid #fff",
              padding: 10,
              margin: 10,
              borderRadius: 6,
            }}
          >
            <strong>{mod.modName}</strong> ({mod.mcType}) <br />
            Version: {mod.version} <br />
            Author: {mod.author} <br />
            Description: {mod.description} <br />
            File:{" "}
            <a
              href={mod.downloadUrl}
              download
              style={{ color: "#0ff", textDecoration: "underline" }}
            >
              {mod.fileName}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
