import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";

export async function POST() {
  try {
    await connectToDatabase();
    for (const p of REVERSE_ENGINEERED_PRODUCTS) {
      await Product.findOneAndUpdate(
        { slug: p.slug },
        { ...p },
        { upsert: true, new: true }
      );
    }
    const count = await Product.countDocuments();
    return NextResponse.json({
      success: true,
      message: `Database seeded with ${count} products.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
