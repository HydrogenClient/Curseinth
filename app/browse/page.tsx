'use client';
import { useEffect, useState } from "react";

export default function Browse() {
  const [mods, setMods] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchMods = async () => {
    const res = await fetch("/api/mods/list");
    const data = await res.json();
    setMods(data.mods);
  };

  useEffect(() => {
    fetchMods();
  }, []);

  const filtered = mods.filter((mod) =>
    mod.modName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h2>Browse Mods</h2>
      <input
        type="text"
        placeholder="Search mods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ marginTop: 20 }}>
        {filtered.map((mod) => (
          <div key={mod.id} style={{ border: "1px solid #fff", padding: 10, margin: 10 }}>
            <strong>{mod.modName}</strong> ({mod.mcType}) <br />
            Version: {mod.version} <br />
            Author: {mod.author} <br />
            Description: {mod.description} <br />
            File: {mod.fileName}
          </div>
        ))}
      </div>
    </div>
  );
}
