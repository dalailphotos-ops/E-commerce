import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricingTier {
  min: number;
  label: string;
  price: number;
}

export interface IGarmentColour {
  name: string;
  hex: string;
  front: string;
  back: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  spec: string;
  gsm: string;
  fit: string;
  basePrice: number;
  prices: IPricingTier[];
  colours: IGarmentColour[];
  sizes: string[];
  zones?: {
    front: number[];
    back: number[];
  };
  featured: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    spec: { type: String, required: true },
    gsm: { type: String, required: true },
    fit: { type: String, required: true },
    basePrice: { type: Number, required: true },
    prices: [
      {
        min: { type: Number, required: true },
        label: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    colours: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        front: { type: String, required: true },
        back: { type: String, required: true },
      },
    ],
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL", "XXL"] },
    zones: {
      front: { type: [Number], default: [300, 375, 300, 420, 0] },
      back: { type: [Number], default: [300, 375, 300, 420, 0] },
    },
    featured: { type: Boolean, default: true },
    stock: { type: Number, default: 500 },
  },
  { timestamps: true }
);

export default (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
