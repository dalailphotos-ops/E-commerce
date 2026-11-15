import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    // Try MongoDB
    try {
      await connectToDatabase();
      if (slug) {
        const item = await Product.findOne({ slug });
        if (item) return NextResponse.json(item);
      } else {
        const items = await Product.find().sort({ basePrice: -1 });
        if (items && items.length > 0) return NextResponse.json(items);
      }
    } catch (dbErr) {
      console.warn("MongoDB not reachable, using in-memory dataset:", dbErr);
    }

    // Fallback to our reverse-engineered dataset
    if (slug) {
      const match = REVERSE_ENGINEERED_PRODUCTS.find((p) => p.slug === slug);
      if (match) return NextResponse.json(match);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(REVERSE_ENGINEERED_PRODUCTS);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
