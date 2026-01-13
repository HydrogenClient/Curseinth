import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect("/");

  // Exchange code for access token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) return NextResponse.redirect("/");

  // Get GitHub username
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const username = userRes.data.login;

  // Set cookie
  const res = NextResponse.redirect("/"); // go to homepage after login
  res.cookies.set("github_user", username, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
