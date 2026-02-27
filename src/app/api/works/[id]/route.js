import { NextResponse } from "next/server";

import {
  deleteWorkInCms,
  getWorkByIdFromCms,
  isAdminRequest,
  updateWorkInCms,
} from "../../../../lib/server/cms";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    const work = await getWorkByIdFromCms(id);
    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }
    return NextResponse.json(work);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch work" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateWorkInCms(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update work" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteWorkInCms(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete work" },
      { status: 500 }
    );
  }
}
