import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDesign extends Document {
  title?: string;
  productId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  frontCanvasJson?: string;
  backCanvasJson?: string;
  frontPreviewUrl?: string; // Cloudinary secure URL
  backPreviewUrl?: string; // Cloudinary secure URL
  uploadedAssets: string[]; // Cloudinary secure URLs of logos/artwork
  printType: string;
  printSize: string;
  estimatedPrice?: number;
  customerEmail?: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema = new Schema<IDesign>(
  {
    title: { type: String, default: "Custom Design" },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    colorName: { type: String, required: true },
    colorHex: { type: String, required: true },
    frontCanvasJson: { type: String },
    backCanvasJson: { type: String },
    frontPreviewUrl: { type: String },
    backPreviewUrl: { type: String },
    uploadedAssets: { type: [String], default: [] },
    printType: { type: String, default: "DTF" },
    printSize: { type: String, default: "a3" },
    estimatedPrice: { type: Number },
    customerEmail: { type: String },
    customerPhone: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.Design as Model<IDesign>) ||
  mongoose.model<IDesign>("Design", DesignSchema);
