import { NextResponse } from "next/server";

const COOKIE_NAME = "cms_admin";

function isSecure() {
  return process.env.NODE_ENV === "production";
}

function getAdminPassword() {
  const value = process.env.CMS_ADMIN_PASSWORD;
  if (!value) {
    throw new Error("Missing required env var: CMS_ADMIN_PASSWORD");
  }
  return value;
}

export async function GET(request) {
  const isAdmin = request.cookies.get(COOKIE_NAME)?.value === "1";
  return NextResponse.json({ isAdmin });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const ok = body?.password && body.password === getAdminPassword();

    if (!ok) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecure(),
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create admin session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure(),
    path: "/",
    maxAge: 0,
  });
  return response;
}
