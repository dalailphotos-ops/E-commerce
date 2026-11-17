/**
 * Tier 2 Boundary & Corner Cases: Cart & Quote State Boundaries
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates edge and boundary conditions on quote/cart state:
 * - Empty cart state initialization (itemCount=0, subtotal=0, gst=0, grandTotal=0)
 * - Zero-quantity handling and fallback clamping (cannot have 0 pieces in a valid line item)
 * - Negative inputs rejection or normalization (clamping invalid negative inputs)
 * - Massive volume scale (10,000 pcs): correct Tier 5 calculation, no integer overflow, accurate GST
 * - Extreme single-size allocation (e.g., 500 pcs in XXL only, 0 across all other sizes)
 * - Complete removal down to 0 items resets state and synchronizes empty array to localStorage
 * - Rapid consecutive item mutations and ID integrity
 */

import { assert, assertEqual, assertThrows } from "../harness/assertions.mjs";
import {
  CartSimulator,
  MockLocalStorage,
  STORAGE_KEY,
} from "../harness/state_simulator.mjs";
import { getGarmentUnitPrice } from "../harness/pricing_simulator.mjs";

export default async function (t) {
  await t.test("Cart Boundary 2.1: Empty cart initializes with zero totals and empty storage", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    assertEqual(cart.items.length, 0, "Initial items array must be empty");
    assertEqual(cart.itemCount, 0, "Initial itemCount must be 0");
    assertEqual(cart.subtotal, 0, "Initial subtotal must be 0");
    assertEqual(cart.gst, 0, "Initial GST must be 0");
    assertEqual(cart.grandTotal, 0, "Initial grandTotal must be 0");
  });

  await t.test("Cart Boundary 2.2: 0-quantity input is clamped or normalized to minimum 1 piece", () => {
    const cart = new CartSimulator(new MockLocalStorage());

    // Adding item with 0 quantity
    const added = cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee",
      quantity: 0,
      sizes: { M: 0, L: 0 },
      unitPrice: 290,
    });

    assert(
      added.quantity >= 1,
      `Cart must normalize 0 quantity to at least 1 piece to avoid empty line items, got: ${added.quantity}`
    );
    assertEqual(cart.itemCount, added.quantity, "Cart itemCount must match normalized item quantity");
    assert(cart.subtotal > 0, "Subtotal must be positive for normalized item");
  });

  await t.test("Cart Boundary 2.3: Negative quantity inputs are rejected or clamped to valid positive integers", () => {
    const cart = new CartSimulator(new MockLocalStorage());

    const item = cart.addItem({
      productId: "regular-fit-tee-190-gsm",
      productName: "Regular Fit Tee",
      quantity: -25,
      sizes: { S: -10, L: -15 },
      unitPrice: 220,
    });

    assert(
      item.quantity > 0,
      `Negative quantity must be rejected or clamped to positive number, got: ${item.quantity}`
    );
    assert(cart.subtotal > 0, "Subtotal must not be negative");
    assert(cart.grandTotal > 0, "Grand total must not be negative");
  });

  await t.test("Cart Boundary 2.4: Massive order quantities (10,000 pcs) compute accurately without overflow", () => {
    const cart = new CartSimulator(new MockLocalStorage());
    const prodId = "oversized-tee-250-gsm-french-terry";

    // Tier 5 price for 100+ pcs is ₹250
    const tierUnitPrice = getGarmentUnitPrice(prodId, 10000);
    assertEqual(tierUnitPrice, 250, "Tier 5 unit price must be ₹250 for 10,000 pcs");

    cart.addItem({
      productId: prodId,
      productName: "Oversized Tee — 250 GSM French Terry",
      quantity: 10000,
      sizes: {
        XS: 1000,
        S: 2000,
        M: 3000,
        L: 2000,
        XL: 1500,
        XXL: 500,
      },
      unitPrice: 250,
    });

    assertEqual(cart.itemCount, 10000, "Item count must equal 10,000");
    // 10000 * 250 = 2,500,000
    assertEqual(cart.subtotal, 2500000, "Subtotal must equal ₹25,00,000");
    // 5% GST = 125,000
    assertEqual(cart.gst, 125000, "5% GST on ₹25,00,000 must be ₹1,25,000");
    // Grand total = 2,625,000
    assertEqual(cart.grandTotal, 2625000, "Grand total must be ₹26,25,000");
  });

  await t.test("Cart Boundary 2.5: Extreme single-size allocation (e.g. 500 pcs in XXL only) computes cleanly", () => {
    const cart = new CartSimulator(new MockLocalStorage());

    const item = cart.addItem({
      productId: "acid-wash-oversized-tee-250-gsm",
      productName: "Acid Wash Tee",
      sizes: {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 500,
      },
      unitPrice: 295,
    });

    assertEqual(item.quantity, 500, "Item quantity must equal 500 from XXL count");
    assertEqual(cart.itemCount, 500, "Cart total items must equal 500");
    // 500 * 295 = 147500
    assertEqual(cart.subtotal, 147500, "Subtotal must be ₹1,47,500");
    assertEqual(cart.gst, 7375, "5% GST on ₹1,47,500 must be ₹7,375");
    assertEqual(cart.grandTotal, 154875, "Grand total must be ₹1,54,875");
  });

  await t.test("Cart Boundary 2.6: Removal down to 0 items resets state and syncs empty array to storage", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const item1 = cart.addItem({ productId: "p1", quantity: 10, unitPrice: 200 });
    const item2 = cart.addItem({ productId: "p2", quantity: 20, unitPrice: 300 });
    assertEqual(cart.items.length, 2, "Cart must contain 2 items");

    // Remove first item
    cart.removeItem(item1.id);
    assertEqual(cart.items.length, 1, "Cart must have 1 item left");

    // Remove second item
    cart.removeItem(item2.id);
    assertEqual(cart.items.length, 0, "Cart must have 0 items left");
    assertEqual(cart.itemCount, 0, "itemCount must reset to 0");
    assertEqual(cart.subtotal, 0, "subtotal must reset to 0");
    assertEqual(cart.gst, 0, "gst must reset to 0");
    assertEqual(cart.grandTotal, 0, "grandTotal must reset to 0");

    // Check storage persistence
    const stored = JSON.parse(storage.getItem(STORAGE_KEY));
    assertEqual(stored.length, 0, "localStorage must persist empty array");
  });

  await t.test("Cart Boundary 2.7: Updating non-existent item throws descriptive error without corrupting state", () => {
    const cart = new CartSimulator(new MockLocalStorage());
    cart.addItem({ productId: "p1", quantity: 10, unitPrice: 100 });

    assertThrows(
      () => cart.updateItem("invalid_id_9999", { quantity: 20 }),
      /not found/i,
      "Updating non-existent ID must throw descriptive error"
    );

    // Verify existing state was unaffected
    assertEqual(cart.items.length, 1, "Cart should still have exactly 1 item");
    assertEqual(cart.items[0].quantity, 10, "Original item quantity should be preserved");
  });
}
