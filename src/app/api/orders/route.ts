import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_ORDERS_URL;
const SECRET = process.env.REVALIDATE_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  try {
    const { items, ...rest } = body as { items?: Array<{ slug: string; cantidad: number }> };
    const itemsData = (items ?? []).map(({ slug, cantidad }) => ({ slug, cantidad }));

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, items, itemsData, action: "save_order", secret: SECRET }),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: true };
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[orders] Error al contactar Apps Script:", err);
    return NextResponse.json({ ok: false, error: "upstream_error" }, { status: 502 });
  }
}
