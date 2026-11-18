# Asson Clothing Brand — Custom Apparel & Print-on-Demand E-Commerce Platform

A production-ready e-commerce, custom apparel manufacturing, and print-on-demand platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB (Mongoose)**, and **Cloudinary**.

---

## 🚀 Features

- **🎨 Interactive Design Studio (`/design`)**: 
  - 5-step customizer pipeline: Select base garment, pick colors, upload custom art/logos directly to Cloudinary, add typography, and choose print technique/dimensions.
  - Front & Back dual-side canvas preview with print zone boundaries.
  - Live per-piece and total quote calculations with 5% GST.
  - Instant direct in-app quote request saved to MongoDB.

- **🧮 Live Dynamic Price Estimator (`/price-estimator`)**:
  - Multi-silhouette order builder with tiered volume scaling.
  - Front & Back print size selection: A2, A3, A4, A5, A6, Chest Logo, or None.
  - Subtotal, 5% textile GST slab, and Grand Total.
  - Copy structured quote summary to clipboard or submit directly for formal proforma invoice.

- **🛍️ Blank Silhouette Catalog (`/shop`, `/shop/[slug]`)**:
  - Filter by Fit (Oversized, Regular) and Fabric Weight (190, 230, 250 GSM).
  - Product detail pages with volume discount tables, color pickers, and XS–XXL size breakdown matrix.
  - In-app quote generation and RFQ submission.

- **📦 Bulk Manufacturing RFQ (`/bulk-orders`)**:
  - Dedicated high-volume inquiry form with Cloudinary file attachment for tech packs and artwork.

- **🖨️ Textile Decoration Guide (`/printing`)**:
  - Detailed specs for Direct-To-Film (DTF), Screen Printing, Computerized Embroidery, and HD Puff printing.

- **📏 Apparel Size Guide (`/size-guide`)**:
  - Measurements for Streetwear Oversized and Classic Regular fits.

- **⚙️ Secure Staff Admin Portal (`/admin`)**:
  - Protected behind email & password authentication configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
  - Secure session tracking with HTTP-only cookies (`admin_token`).
  - View real-time Quotes, Bulk Enquiries, and Studio Designs submitted by customers.
  - 1-click database seeder (`/api/seed`) to populate MongoDB with initial products.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Media & Asset Storage**: [Cloudinary](https://cloudinary.com/) (Single `CLOUDINARY_URL` supported)

---

## 🔑 Environment Variables for Vercel Deployment

When deploying to **Vercel**, add the following environment variables under **Project Settings > Environment Variables**:

| Variable | Required | Description | Example / Note |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | **Yes** | MongoDB connection string (Atlas recommended) | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/asson_ecommerce?retryWrites=true&w=majority` |
| `CLOUDINARY_URL` | **Yes** | Single Cloudinary Connection URL | `cloudinary://<api_key>:<api_secret>@<cloud_name>` *(from Cloudinary Dashboard)* |
| `ADMIN_EMAIL` | **Yes** | Staff Admin Email (Quotes, Inquiries, Studio Designs, Blank Uploads) | `admin@assonclothing.com` (default) |
| `ADMIN_PASSWORD` | **Yes** | Staff Admin Password | Choose any secure password |
| `SUPERADMIN_EMAIL` | Optional | Superadmin Email (Developer Console, Seeder, Backups) | `superadmin@assonclothing.com` (default) |
| `SUPERADMIN_PASSWORD` | Optional | Superadmin Password | Choose any secure password |
| `NEXT_PUBLIC_APP_URL` | Optional | Production website URL | `https://asson-cloths.vercel.app` (defaults to current host) |

*(Note: In Cloudinary Dashboard, copy the single `CLOUDINARY_URL` under Dashboard > Product Environment Credentials > API Environment variable).*

---

## 👥 Admin Roles: Staff Admin vs Superadmin

The admin portal at `/admin` includes role-based access control (RBAC):

1. **Staff Admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)**:
   - Clean, executive operational dashboard.
   - Day-to-day business operations: view & manage Quotes, Bulk Enquiries, Studio Designs, and Blank T-Shirt photo uploads.
   - All developer-related texts, seed buttons, and raw database/environment diagnostics are completely hidden.

2. **Superadmin (`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`)**:
   - Unlocks the **Superadmin Developer Console**.
   - Includes 1-Click Database Catalog Seeder (`/api/seed`), Quotes JSON Data Export/Backup, Collection metrics, and System Diagnostics.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# (Fill in your MongoDB URI, Cloudinary URL, and ADMIN_EMAIL / ADMIN_PASSWORD)

# 3. Start local development server
npm run dev

# 4. Open in browser
http://localhost:3000

# 5. Access the Admin Portal
# Navigate to http://localhost:3000/admin
# Log in using the ADMIN_EMAIL and ADMIN_PASSWORD configured in .env.local
# Click "Seed Catalog into MongoDB" to load all reverse-engineered blanks
```
