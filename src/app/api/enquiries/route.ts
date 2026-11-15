import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.phone || !body.quantity) {
      return NextResponse.json(
        { error: "Name, phone, and quantity are required" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create(body);
    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry._id,
        message: "Enquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
