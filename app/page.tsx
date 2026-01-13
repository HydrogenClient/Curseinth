'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [mods, setMods] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [mcFilter, setMcFilter] = useState("All");

  // Read user from cookie
  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("github_user="))
      ?.split("=")[1];
    if (username) setUser(decodeURIComponent(username));
  }, []);

  // Fetch mods list
  useEffect(() => {
    fetch("/api/mods/list")
      .then((res) => res.json())
      .then((data) => setMods(data.mods));
  }, []);

  // Filter mods by search and MC type
  const filtered = mods.filter((mod) => {
    const matchesSearch = mod.modName.toLowerCase().includes(search.toLowerCase());
    const matchesMC = mcFilter === "All" || mod.mcType === mcFilter;
    return matchesSearch && matchesMC;
  });

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "auto", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      {/* Login / Publish */}
      {!user ? (
        <a
          href="/api/auth/github"
          style={{
            background: "#fff",
            color: "#000",
            padding: "10px 20px",
            borderRadius: 6,
            display: "inline-block",
            marginBottom: 20,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign in with GitHub
        </a>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <p>Logged in as <strong>{user}</strong></p>
          <a
            href="/publish"
            style={{
              background: "#0f0",
              color: "#000",
              padding: "10px 20px",
              borderRadius: 6,
              display: "inline-block",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Publish a Mod
          </a>
        </div>
      )}

      {/* Search & Filter */}
      <div style={{ marginTop: 20, marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search mods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 6, flexGrow: 1, minWidth: 200 }}
        />
        <select
          value={mcFilter}
          onChange={(e) => setMcFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="All">All</option>
          <option value="Fabric">Fabric</option>
          <option value="Forge">Forge</option>
        </select>
      </div>

      {/* Mods Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20
      }}>
        {filtered.map((mod) => (
          <div key={mod.id} style={{
            background: "#222",
            padding: 15,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: 5 }}>{mod.modName}</h3>
              <small>Author: {mod.author}</small><br/>
              <small>MC Type: {mod.mcType} | Version: {mod.version}</small>
              <p>{mod.description}</p>
            </div>
            <a href={mod.downloadUrl} download style={{
              marginTop: 10,
              background: "#0ff",
              color: "#000",
              textDecoration: "none",
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 6,
              fontWeight: "bold"
            }}>
              Download
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p style={{ marginTop: 20 }}>No mods found.</p>}
    </div>
  );
}
