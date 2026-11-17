import { BRAND_NAME } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service | Asson Clothing Brand",
  description: "Terms and conditions for purchasing blank and custom printed apparel from Asson Clothing Brand.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">Commercial Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">
          Last updated: 31 October 2026 · Governing blank and custom apparel manufacturing with Asson Clothing Brand.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-8 text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Agreement to Terms</h2>
          <p>
            These Terms of Service govern orders for blank and custom printed apparel placed with Asson Clothing Brand (&ldquo;Asson&rdquo;, &ldquo;The Clothing Lab&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), located at Watani Complex, Manjeri Rd, Kizhisseri, Malappuram, Kerala 673641, whether submitted through this website, formal quotation, or direct written agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Minimum Order Quantity (MOQ) Policy</h2>
          <p>
            To accommodate businesses of all scales, Asson enforces a transparent tiered Minimum Order Quantity (MOQ) structure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Bulk Custom Orders:</strong> Standard Minimum Order Quantity (MOQ) starts at 10 pieces per silhouette/design. Wholesale price tiers activate at 10-49 pcs, 50-99 pcs, and 100+ pcs.</li>
            <li><strong>Print-On-Demand (POD) & Sample Runs:</strong> Minimum Order Quantity (MOQ) is 1 piece for registered dropshipping partners and initial physical sample approval runs.</li>
            <li><strong>Blank Stock Wholesale:</strong> Low MOQ of 10 pieces across mixed sizes for unprinted ready-stock apparel.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Pricing, GST & Payment Terms</h2>
          <p>
            All listed prices are denominated in Indian Rupees (INR) per piece and exclude applicable 5% Goods and Services Tax (GST) and courier shipping costs unless expressly designated in a formal proforma quote. Custom production begins following receipt of advance payment; full outstanding balance must be cleared prior to courier dispatch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Manufacturing, Print Tolerances & Color Variations</h2>
          <p>Textile manufacturing involves inherent physical properties and variables:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Measurement Tolerance:</strong> Garment dimensions may exhibit a manufacturing tolerance of +/- 0.5 inches against the published size guide.</li>
            <li><strong>Print Placement Tolerance:</strong> Graphical artwork positioning allows a placement variance tolerance of +/- 0.5 inches across differing size garments.</li>
            <li><strong>Color Variation:</strong> Colors viewed on digital RGB screens can vary slightly from cured textile pigment inks (CMYK). Minor shade variations between fabric dye batches (+/- 5%) are industry standard.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Garment Washing & Care Instructions</h2>
          <p>
            To preserve 100% bio-washed cotton and ensure maximum longevity for DTF prints, screen prints, and embroidery, customer must strictly observe recommended washing care:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Always machine wash inside-out using cold water (30°C or below) with mild liquid detergent.</li>
            <li>Do NOT iron directly over printed graphics, puff typography, or embroidery; iron inside-out on low heat setting.</li>
            <li>Do NOT bleach, dry clean, or tumble dry on high heat. Hang dry in shade.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Defect Reporting, Replacements & Returns Policy</h2>
          <p>
            Custom printed or embroidered garments are manufactured to order based on digital proofs approved by the client and cannot be returned for buyer remorse or size miscalculations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Defect Inspection Window:</strong> Any shipment defect, transit damage, or missing item must be reported within 48 hours of delivery to orders@assonclothing.com accompanied by clear unboxing photos or video evidence.</li>
            <li><strong>Resolution & Refund:</strong> Confirmed manufacturing defects or print errors deviating from approved proofs will be reprinted, replaced, or refunded within 7 working days.</li>
            <li><strong>Plain Blanks Returns:</strong> Unprinted, unworn blanks in original polybag packaging may be returned or exchanged within 7 days, subject to return shipping costs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">7. Jurisdiction & Applicable Law</h2>
          <p>
            These terms are governed by the laws of the Republic of India. Any legal dispute or controversy arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts at Malappuram, Kerala.
          </p>
        </section>
      </div>
    </div>
  );
}
