import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log({ body });
    return NextResponse.json({ received: body });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
}
