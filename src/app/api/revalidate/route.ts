import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { paths?: string[] };
  const paths = body.paths && body.paths.length > 0 ? body.paths : ["/"];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: paths,
    timestamp: new Date().toISOString(),
  });
}
