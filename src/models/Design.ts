import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDesign extends Document {
  designId?: string;
  title?: string;
  productId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  frontCanvasJson?: string;
  backCanvasJson?: string;
  previewUrl?: string; // Composite mockup preview URL or data URI
  frontPreviewUrl?: string; // Front mockup preview URL or data URI
  backPreviewUrl?: string; // Back mockup preview URL or data URI
  artworkUrl?: string; // Raw artwork or custom blank URL
  uploadedAssets: string[]; // Cloudinary secure URLs of logos/artwork/custom blanks
  printType: string;
  printSize: string;
  estimatedPrice?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  transforms?: Record<string, { x: number; y: number; scale: number; rotation: number }>;
  techPack?: {
    viewSide?: string;
    printSizeKey?: string;
    nominalSizeLabel?: string;
    nominalDimensions?: string;
    scalePercent?: number;
    rotationDegrees?: number;
    realDimensionsInches?: string;
    realDimensionsCm?: string;
    offsetX?: number;
    offsetY?: number;
    technique?: string;
    textElements?: Array<{ text: string; color: string; size: number }>;
  };
  textElements?: Array<any>;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema = new Schema<IDesign>(
  {
    designId: { type: String, index: true },
    title: { type: String, default: "Custom Design" },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    colorName: { type: String, required: true },
    colorHex: { type: String, required: true },
    frontCanvasJson: { type: String },
    backCanvasJson: { type: String },
    previewUrl: { type: String },
    frontPreviewUrl: { type: String },
    backPreviewUrl: { type: String },
    artworkUrl: { type: String },
    uploadedAssets: { type: [String], default: [] },
    printType: { type: String, default: "DTF" },
    printSize: { type: String, default: "a3" },
    estimatedPrice: { type: Number },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    transforms: { type: Schema.Types.Mixed },
    techPack: { type: Schema.Types.Mixed },
    textElements: { type: Schema.Types.Mixed },
  },
  { timestamps: true, strict: false }
);

export default (mongoose.models.Design as Model<IDesign>) ||
  mongoose.model<IDesign>("Design", DesignSchema);
