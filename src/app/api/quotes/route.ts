import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();
    const quotes = await Quote.find().sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.customerName || !body.phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    const quote = await Quote.create(body);
    return NextResponse.json(
      {
        success: true,
        quoteId: quote._id,
        message: "Quote request received successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
