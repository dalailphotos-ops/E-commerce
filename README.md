# Asson Clothing Brand — Custom Apparel & Print-on-Demand E-Commerce Platform

A production-ready e-commerce, custom apparel manufacturing, and print-on-demand platform inspired by [Looma Apparels](https://loomaapparels.com/). Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB (Mongoose)**, and **Cloudinary**.

---

## 🚀 Features

- **🎨 Interactive Design Studio (`/design`)**: 
  - 5-step customizer pipeline: Select base garment, pick colors, upload custom art/logos directly to Cloudinary, add typography, and choose print technique/dimensions.
  - Front & Back dual-side canvas preview with print zone boundaries.
  - Live per-piece and total quote calculations with 5% GST.
  - Instant **"Send Design on WhatsApp"** and **"Save Design to Database"**.

- **🧮 Live Dynamic Price Estimator (`/price-estimator`)**:
  - Multi-silhouette order builder with tiered volume scaling.
  - Front & Back print size selection: A2, A3, A4, A5, A6, Chest Logo, or None.
  - Subtotal, 5% textile GST slab, and Grand Total.
  - One-click presets and WhatsApp quote sharing.

- **🛍️ Blank Silhouette Catalog (`/shop`, `/shop/[slug]`)**:
  - Filter by Fit (Oversized, Regular) and Fabric Weight (190, 230, 250 GSM).
  - Product detail pages with volume discount tables, color pickers, and XS–XXL size breakdown matrix.

- **📦 Bulk Manufacturing RFQ (`/bulk-orders`)**:
  - Dedicated high-volume inquiry form with Cloudinary file attachment for tech packs and artwork.

- **🖨️ Textile Decoration Guide (`/printing`)**:
  - Detailed specs for Direct-To-Film (DTF), Screen Printing, Computerized Embroidery, and HD Puff printing.

- **📏 Apparel Size Guide (`/size-guide`)**:
  - Measurements for Streetwear Oversized and Classic Regular fits.

- **⚙️ Staff Admin Dashboard (`/admin`)**:
  - View real-time Quotes, Bulk Enquiries, and Studio Designs.
  - 1-click database seeder (`/api/seed`) to populate MongoDB with initial products.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Media & Asset Storage**: [Cloudinary](https://cloudinary.com/)

---

## 🔑 Environment Variables for Vercel Deployment

When deploying to **Vercel**, add the following environment variables under **Project Settings > Environment Variables**:

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/looma_ecommerce?retryWrites=true&w=majority` |
| `CLOUDINARY_URL` | Cloudinary Single Environment URL (API Environment variable) | `cloudinary://<api_key>:<api_secret>@<cloud_name>` *(from Cloudinary Dashboard)* |
| `NEXT_PUBLIC_APP_URL` | Production website URL | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp Number | `918089963691` |

*(Note: If preferred, you can alternatively use `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`).*

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# (Fill in your MongoDB URI and Cloudinary credentials)

# 3. Start local development server
npm run dev

# 4. Open in browser
http://localhost:3000

# 5. Seed the database
# Navigate to http://localhost:3000/admin and click "Seed Catalog into MongoDB", or POST to /api/seed
```
