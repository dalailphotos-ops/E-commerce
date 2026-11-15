import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuoteItem {
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  sizes: Record<string, number>;
  printType?: string;
  printSize?: string;
  designPreviewUrl?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface IQuote extends Document {
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  items: IQuoteItem[];
  subtotal: number;
  gst: number;
  total: number;
  notes?: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        sizes: { type: Map, of: Number, default: {} },
        printType: { type: String },
        printSize: { type: String },
        designPreviewUrl: { type: String },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Quote as Model<IQuote>) ||
  mongoose.model<IQuote>("Quote", QuoteSchema);
