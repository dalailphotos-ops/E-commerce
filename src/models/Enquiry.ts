import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  apparelType: string;
  quantity: number;
  printingType?: string;
  details: string;
  attachments?: string[]; // Cloudinary URLs
  status: "new" | "in_progress" | "quoted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    apparelType: { type: String, required: true },
    quantity: { type: Number, required: true },
    printingType: { type: String },
    details: { type: String, required: true },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["new", "in_progress", "quoted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Enquiry as Model<IEnquiry>) ||
  mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
