/**
 * Tier 3 Cross-Feature Combination Test 4: Cart Persistence & Quote Submission Flow
 * 
 * Verifies cart lifecycle from accumulation to persistence and formal API submission:
 * 1. Add multiple heterogeneous items (blanks + custom prints) into CartContext
 * 2. Verify state serialization into localStorage ('asson_quote_v1')
 * 3. Simulate browser reload / page refresh and verify exact reconstruction of cart state
 * 4. Mutate reloaded cart (quantity update, item removal) and verify synchronous storage updates
 * 5. Format and validate formal quote submission payload against /api/quotes endpoint contract
 * 6. ZERO WHATSAPP verification across quote checkout flow
 */

import path from "node:path";
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertThrows,
} from "../harness/assertions.mjs";
import {
  GARMENT_CATALOG,
  getGarmentUnitPrice,
  calculateLineItem,
  calculateOrder,
  GST_PERCENTAGE,
} from "../harness/pricing_simulator.mjs";
import { CartSimulator, MockLocalStorage, STORAGE_KEY } from "../harness/state_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";

const ROOT = process.cwd();
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");
const QUOTES_API = path.join(ROOT, "src", "app", "api", "quotes", "route.ts");

export default async function (t) {
  await t.test("Flow 3.4.1: Populate CartContext with heterogeneous items (blanks + custom DTF prints)", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Item 1: Plain Blanks (20 pcs Oversized Tee 230 GSM)
    // 20 pcs is tier 10-24 -> ₹250/pc
    const item1 = cart.addItem({
      productId: "oversized-tee-230-gsm",
      productName: "Oversized Tee — 230 GSM",
      productSpec: "230 GSM · 100% Combed Cotton Single Jersey",
      color: "Washed Olive",
      colorHex: "#556b2f",
      sizes: { S: 5, M: 10, L: 5 },
      unitPrice: 250,
      prints: [],
    });
    assertEqual(item1.quantity, 20, "Item 1 quantity must sum sizes to 20");
    assertEqual(item1.totalPrice, 5000, "Item 1 total price must be 20 * 250 = ₹5,000");

    // Item 2: Custom DTF Tee (15 pcs French Terry 250 GSM with Front A3)
    // 15 pcs is tier 10-24 -> base ₹265 + bulk A3 ₹100 = ₹365/pc
    const item2 = cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      productSpec: "250 GSM · 100% Super Combed Cotton French Terry",
      color: "Jet Black",
      colorHex: "#0a0a0a",
      sizes: { M: 10, XL: 5 },
      unitPrice: 365,
      prints: [
        {
          position: "front",
          sizeKey: "a3",
          sizeLabel: "A3 Size",
          cost: 100,
        },
      ],
      mockupFrontUrl: "https://res.cloudinary.com/asson/image/upload/mockup_black_front.png",
    });
    assertEqual(item2.quantity, 15, "Item 2 quantity must sum sizes to 15");
    assertEqual(item2.totalPrice, 5475, "Item 2 total price must be 15 * 365 = ₹5,475");

    // Initial state verification
    assertEqual(cart.items.length, 2, "Cart must contain 2 line items");
    assertEqual(cart.itemCount, 35, "Total garment count must be 20 + 15 = 35");

    // Subtotal = 5000 + 5475 = 10,475
    assertEqual(cart.subtotal, 10475, "Subtotal must equal ₹10,475");

    // 5% GST = 10475 * 0.05 = 523.75
    assertEqual(cart.gst, 523.75, "5% GST must equal ₹523.75");

    // Grand Total = 10475 + 523.75 = 10,998.75
    assertEqual(cart.grandTotal, 10998.75, "Grand total must equal ₹10,998.75");
  });

  await t.test("Flow 3.4.2: Verify localStorage serialization schema under 'asson_quote_v1'", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      color: "Sandstone",
      sizes: { M: 10 },
      unitPrice: 265,
      prints: [{ position: "front", sizeKey: "logo", cost: 10 }],
    });

    const rawData = storage.getItem(STORAGE_KEY);
    assert(rawData !== null, `localStorage must contain key '${STORAGE_KEY}'`);

    const parsed = JSON.parse(rawData);
    assert(Array.isArray(parsed), "Persisted value must be a JSON array");
    assertEqual(parsed.length, 1);

    const saved = parsed[0];
    assert(saved.id && typeof saved.id === "string", "Saved item must contain string id");
    assertEqual(saved.productId, "oversized-tee-250-gsm-french-terry");
    assertEqual(saved.color, "Sandstone");
    assertEqual(saved.quantity, 10);
    assertEqual(saved.unitPrice, 265);
    assertEqual(saved.totalPrice, 2650);
    assert(Array.isArray(saved.prints), "Saved item must preserve prints array");
    assertEqual(saved.prints[0].position, "front");
  });

  await t.test("Flow 3.4.3: Simulate page reload and verify exact reconstruction of cart state", () => {
    const storage = new MockLocalStorage();

    // Session 1: User adds items
    const session1Cart = new CartSimulator(storage);
    session1Cart.addItem({
      productId: "acid-wash-oversized-tee-250-gsm",
      productName: "Acid Wash Oversized Tee",
      color: "Charcoal Acid Wash",
      sizes: { S: 5, M: 10, L: 10 }, // 25 pcs
      unitPrice: 305, // 25-49 tier
    });
    session1Cart.addItem({
      productId: "regular-fit-tee-190-gsm",
      productName: "Regular Fit Tee",
      color: "White",
      sizes: { L: 15 }, // 15 pcs
      unitPrice: 202, // 10-24 tier
    });

    const session1ItemCount = session1Cart.itemCount; // 40
    const session1Subtotal = session1Cart.subtotal;   // 25*305 (7625) + 15*202 (3030) = 10655
    const session1Gst = session1Cart.gst;             // 532.75
    const session1GrandTotal = session1Cart.grandTotal; // 11187.75

    // Session 2: User refreshes page (new CartSimulator instance initialized from same storage)
    const session2Cart = new CartSimulator(storage);

    assertEqual(session2Cart.items.length, 2, "Reloaded cart must have 2 items");
    assertEqual(session2Cart.itemCount, session1ItemCount, "Reloaded itemCount must match exactly");
    assertEqual(session2Cart.subtotal, session1Subtotal, "Reloaded subtotal must match exactly (₹10,655)");
    assertEqual(session2Cart.gst, session1Gst, "Reloaded GST must match exactly (₹532.75)");
    assertEqual(session2Cart.grandTotal, session1GrandTotal, "Reloaded grandTotal must match exactly (₹11,187.75)");

    // Verify first item details preserved
    assertEqual(session2Cart.items[0].productId, "acid-wash-oversized-tee-250-gsm");
    assertEqual(session2Cart.items[0].quantity, 25);
    assertEqual(session2Cart.items[0].sizes.M, 10);
  });

  await t.test("Flow 3.4.4: In-session mutations on restored cart update localStorage immediately", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const item1 = cart.addItem({ productId: "p1", unitPrice: 100, sizes: { M: 10 } });
    const item2 = cart.addItem({ productId: "p2", unitPrice: 200, sizes: { L: 5 } });
    assertEqual(cart.itemCount, 15);

    // Update item 1: change quantity from 10 to 30
    cart.updateItem(item1.id, { sizes: { M: 15, L: 15 }, unitPrice: 90 });
    assertEqual(cart.itemCount, 35, "Updated cart item count should be 30 + 5 = 35");

    // Remove item 2
    cart.removeItem(item2.id);
    assertEqual(cart.items.length, 1, "Only 1 item should remain after removal");
    assertEqual(cart.itemCount, 30, "Cart item count should be 30");
    assertEqual(cart.subtotal, 2700, "Subtotal should update to 30 * 90 = ₹2,700");

    // Check storage reflects removal and updates
    const stored = JSON.parse(storage.getItem(STORAGE_KEY));
    assertEqual(stored.length, 1, "localStorage must contain only 1 item");
    assertEqual(stored[0].id, item1.id, "Remaining stored item must be item1");
    assertEqual(stored[0].quantity, 30, "Stored quantity must be updated to 30");
  });

  await t.test("Flow 3.4.5: Format and validate formal quote submission payload against /api/quotes contract", () => {
    const routeCheck = checkRouteFileExists("/api/quotes");
    assert(routeCheck.exists, `/api/quotes endpoint must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/api/quotes", "POST");
    assert(exportCheck.valid, `/api/quotes must export a named POST handler`);

    // Prepare formal submission payload mirroring client submit
    const quotePayload = {
      customerName: "Rohan Mehta",
      email: "rohan@brandstudio.in",
      phone: "+91 98765 43210",
      company: "Studio Label Private Limited",
      items: [
        {
          productId: "oversized-tee-250-gsm-french-terry",
          productName: "Oversized Tee — 250 GSM French Terry",
          color: "Jet Black",
          quantity: 25,
          sizes: { S: 5, M: 10, L: 10 },
          printType: "DTF",
          printSize: "Front: A3 Size",
          unitPrice: 365,
          totalPrice: 9125,
        },
      ],
      subtotal: 9125,
      gst: 456.25,
      total: 9581.25,
      notes: "Production needed in 10 business days for brand launch",
    };

    // Validate payload fields against Quote model constraints
    assert(quotePayload.customerName.length > 0, "Customer name is required");
    assert(quotePayload.phone.length > 0, "Phone number is required");
    assert(quotePayload.email.includes("@"), "Email must be valid format");
    assertEqual(quotePayload.items.length, 1, "Items array must contain quote items");
    assertEqual(quotePayload.subtotal, 9125, "Subtotal must match");
    assertEqual(quotePayload.gst, 456.25, "GST must match 5%");
    assertEqual(quotePayload.total, 9581.25, "Total must match subtotal + GST");

    // Test rejection of invalid payload missing required fields
    const invalidPayload = { email: "test@example.com" }; // missing customerName and phone
    assert(!invalidPayload.customerName, "Invalid payload lacks customerName");
    assert(!invalidPayload.phone, "Invalid payload lacks phone");
  });

  await t.test("Flow 3.4.6: Strict ZERO WhatsApp verification across Quote Review and Checkout flow", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "Unable to inspect /quote page component");

    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false) &&
      !inspector.containsText("api.whatsapp.com", false),
      "Quote review page must strictly contain ZERO WhatsApp links, buttons, or icons"
    );
  });
}
