import { NextResponse } from "next/server";
import axios from "axios";

// In-memory store for the currently logged-in user
let currentUser: string | null = null;

export { currentUser }; // export to use on homepage/publish

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL('/', req.url));

  // Exchange code for access token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_REDIRECT_URI,
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) return NextResponse.redirect(new URL('/', req.url));

  // Get GitHub username
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const username = userRes.data.login;
  currentUser = username;

  console.log("Logged in GitHub user:", username);

  // Redirect to homepage
  return NextResponse.redirect(new URL('/', req.url));
}
