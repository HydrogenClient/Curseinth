'use client';

export default function Login() {
  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h2>Sign in to Curseinth to publish mods</h2>
      <a
        href="/api/auth/github"
        style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '10px 20px',
          background: '#fff',
          color: '#000',
          borderRadius: 6,
        }}
      >
        Sign in with GitHub
      </a>
    </div>
  );
}
