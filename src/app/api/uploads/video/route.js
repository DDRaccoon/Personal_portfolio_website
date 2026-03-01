import { NextResponse } from "next/server";

import { isAdminRequest, uploadVideoToCmsStorage } from "../../../../lib/server/cms";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const workId = String(formData.get("workId") || "draft");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type?.startsWith("video/")) {
      return NextResponse.json({ error: "Only video files are supported" }, { status: 400 });
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Video is too large. Please upload files under 100MB." },
        { status: 413 }
      );
    }

    const uploaded = await uploadVideoToCmsStorage(file, { workId });
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to upload video" },
      { status: 500 }
    );
  }
}
