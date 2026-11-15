import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Design from "@/models/Design";

export async function GET() {
  try {
    await connectToDatabase();
    const designs = await Design.find().sort({ createdAt: -1 });
    return NextResponse.json(designs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const design = await Design.create(body);
    return NextResponse.json(
      {
        success: true,
        designId: design._id,
        message: "Design saved successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
