import { NextResponse } from "next/server";

import {
  createWorkInCms,
  isAdminRequest,
  listWorksFromCms,
} from "../../../lib/server/cms";

function validatePayload(body) {
  return Boolean(
    body &&
      body.category &&
      body.title_en &&
      body.summary_en &&
      body.cover
  );
}

export async function GET() {
  try {
    const works = await listWorksFromCms();
    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch works" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!validatePayload(body)) {
      return NextResponse.json(
        { error: "Missing required fields: category/title_en/summary_en/cover" },
        { status: 400 }
      );
    }

    const created = await createWorkInCms(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create work" },
      { status: 500 }
    );
  }
}
