import { NextResponse } from "next/server";

import { isAdminRequest, uploadImageToCmsStorage } from "../../../../lib/server/cms";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

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

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are supported" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Please upload files under 10MB." },
        { status: 413 }
      );
    }

    const uploaded = await uploadImageToCmsStorage(file, { workId });
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
