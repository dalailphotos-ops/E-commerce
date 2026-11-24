import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAsset extends Document {
  assetId: string;
  filename: string;
  contentType: string;
  size: number;
  dataBase64: string;
  type: string; // "mockup" | "artwork" | "blank"
  designId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    assetId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, default: 0 },
    dataBase64: { type: String, required: true },
    type: { type: String, default: "artwork" },
    designId: { type: String, index: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Asset as Model<IAsset>) ||
  mongoose.model<IAsset>("Asset", AssetSchema);
