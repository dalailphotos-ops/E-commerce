import { BRAND_NAME } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | Asson Clothing Brand",
  description: "Privacy Policy for Asson Clothing Brand, in accordance with India's Digital Personal Data Protection Act, 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">Legal & Data Governance</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">
          Last updated: 31 October 2026 · Compliant with India’s Digital Personal Data Protection Act, 2023 (DPDP Act).
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-8 text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Who We Are</h2>
          <p>
            This website is owned and operated by Asson Clothing Brand (&ldquo;The Clothing Lab&rdquo;), located at Watani Complex, Manjeri Rd, Kizhisseri, Malappuram, Kerala 673641 (&ldquo;Asson&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We act as the Data Fiduciary regarding personal information collected on this website and in our production lab.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Personal Data We Collect</h2>
          <p>We only collect personal information that you provide to us voluntarily to facilitate orders and quotations:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contact & Quotation Inquiries:</strong> Name, phone number, email address, company name, apparel selections, quantities, and project notes submitted via our quote and contact forms.</li>
            <li><strong>Design Studio Files:</strong> Uploaded graphic vector files, artwork images, custom text, and preview mockups saved to your quotation list.</li>
            <li><strong>Fulfillment & Shipping Data:</strong> Consignee name, shipping address, pincode, and contact number provided for pan-India delivery.</li>
            <li><strong>Technical Telemetry:</strong> Standard server access logs, browser user agents, and IP addresses for anti-spam security.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. How We Use Your Data</h2>
          <p>
            Your information is strictly utilized to process price estimations, prepare manufacturing proofs, produce physical apparel, fulfill deliveries, and satisfy Indian tax and accounting obligations (GST records). We do not sell or rent personal information to any third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Third-Party Sharing</h2>
          <p>We share data exclusively with trusted technical and operational infrastructure providers:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Cloud Hosting & Storage:</strong> Secure database and asset servers for saving quote records and design artwork.</li>
            <li><strong>Integrated Logistics Partners:</strong> Courier companies (including Delhivery, Blue Dart, and DTDC) for package transit and live tracking.</li>
            <li><strong>Statutory Authorities:</strong> Indian tax and legal bodies when mandatory under applicable Indian law.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Data Retention & Security</h2>
          <p>
            Order documents and GST records are retained as required by Indian commercial law (up to 8 years). Unordered quote drafts and abandoned mockups are purged regularly. We implement industry-standard encryption protocols to protect your information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Contact & Grievance Redressal</h2>
          <p>
            For privacy inquiries, data rectification, or deletion requests, contact our Grievance Officer:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
            <p><strong>Grievance Officer:</strong> Legal & Compliance Dept, Asson Clothing Brand</p>
            <p><strong>Email:</strong> orders@assonclothing.com</p>
            <p><strong>Phone:</strong> +91 80899 63691</p>
            <p><strong>Address:</strong> Watani Complex, Manjeri Rd, Kizhisseri, Malappuram, Kerala 673641, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
