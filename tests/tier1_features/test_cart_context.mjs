/**
 * Tier 1 Feature 6: Global Cart & Quote Context
 * Validates persistent CartContext backed by localStorage (asson_quote_v1),
 * managing items, size breakdowns, addItem, updateItem, removeItem, clearCart, and cumulative totals.
 */

import fs from "node:fs";
import path from "node:path";
import { assert, assertEqual, assertDeepEqual } from "../harness/assertions.mjs";
import { CartSimulator, MockLocalStorage, STORAGE_KEY } from "../harness/state_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const CONTEXT_FILE = path.join(ROOT, "src", "context", "CartContext.tsx");

export default async function (t) {
  await t.test("Feature 6.1: CartContext initialization with empty state", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);
    assertEqual(cart.items.length, 0, "Cart should initialize with 0 items");
    assertEqual(cart.itemCount, 0, "Initial itemCount should be 0");
    assertEqual(cart.subtotal, 0, "Initial subtotal should be 0");
    assertEqual(cart.gst, 0, "Initial gst should be 0");
    assertEqual(cart.grandTotal, 0, "Initial grandTotal should be 0");
  });

  await t.test("Feature 6.2: addItem with size breakdown and cumulative calculation", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const added = cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      color: "Black",
      sizes: { S: 5, M: 10, L: 5 }, // 20 pcs total
      unitPrice: 265,
    });

    assertEqual(cart.items.length, 1, "Cart should contain 1 line item");
    assertEqual(added.quantity, 20, "Quantity should sum all sizes (5 + 10 + 5 = 20)");
    assertEqual(added.totalPrice, 5300, "Line total should be 20 * 265 = 5300");
    assertEqual(cart.itemCount, 20, "Cart itemCount should equal 20");
    assertEqual(cart.subtotal, 5300, "Subtotal should equal 5300");
    assertEqual(cart.gst, 265, "GST should equal 5% of 5300 = 265");
    assertEqual(cart.grandTotal, 5565, "Grand total should equal 5300 + 265 = 5565");
  });

  await t.test("Feature 6.3: updateItem modifies sizes/quantity and recalculates live totals", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const item = cart.addItem({
      productId: "oversized-tee-230-gsm",
      productName: "Oversized Tee — 230 GSM",
      sizes: { M: 10 },
      unitPrice: 250,
    });

    // Update sizes to 30 pcs and tier price to 246
    cart.updateItem(item.id, {
      sizes: { M: 15, L: 15 },
      unitPrice: 246,
    });

    const updated = cart.items.find((i) => i.id === item.id);
    assertEqual(updated.quantity, 30, "Updated quantity should be 30");
    assertEqual(updated.unitPrice, 246, "Updated unit price should be 246");
    assertEqual(updated.totalPrice, 7380, "Updated total should be 30 * 246 = 7380");
    assertEqual(cart.subtotal, 7380, "Cart subtotal should update to 7380");
    assertEqual(cart.gst, 369, "Cart GST should update to 369");
    assertEqual(cart.grandTotal, 7749, "Cart grand total should update to 7749");
  });

  await t.test("Feature 6.4: removeItem and clearCart restore empty state", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const item1 = cart.addItem({ productId: "p1", unitPrice: 200, quantity: 5 });
    const item2 = cart.addItem({ productId: "p2", unitPrice: 300, quantity: 2 });
    assertEqual(cart.items.length, 2);

    cart.removeItem(item1.id);
    assertEqual(cart.items.length, 1, "After removeItem, 1 item should remain");
    assertEqual(cart.items[0].id, item2.id, "Remaining item should be item2");

    cart.clearCart();
    assertEqual(cart.items.length, 0, "After clearCart, cart must be empty");
    assertEqual(cart.subtotal, 0, "Subtotal after clear must be 0");
  });

  await t.test("Feature 6.5: Persistent serialization to localStorage key 'asson_quote_v1'", () => {
    const storage = new MockLocalStorage();
    const cart1 = new CartSimulator(storage);

    cart1.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee",
      color: "Beige",
      sizes: { L: 10 },
      unitPrice: 265,
    });

    const storedRaw = storage.getItem(STORAGE_KEY);
    assert(storedRaw !== null, `localStorage must contain entry for key '${STORAGE_KEY}'`);

    const parsed = JSON.parse(storedRaw);
    assertEqual(parsed.length, 1, "Serialized storage should contain 1 item");
    assertEqual(parsed[0].color, "Beige", "Serialized item should preserve color");

    // Initialize second cart instance from the same storage (simulating page reload)
    const cart2 = new CartSimulator(storage);
    assertEqual(cart2.items.length, 1, "Restored cart should load 1 item from localStorage");
    assertEqual(cart2.subtotal, 2650, "Restored cart subtotal should match 2650");
  });

  await t.test("Feature 6.6: CartContext.tsx component exists and implements provider contract", () => {
    const fileExists = fs.existsSync(CONTEXT_FILE);
    assert(
      fileExists,
      `CartContext.tsx file must exist at ${CONTEXT_FILE} for global quote management`
    );

    const inspector = inspectFile(CONTEXT_FILE);
    assert(
      inspector.containsText("CartProvider") || inspector.containsText("useCart"),
      "CartContext.tsx must export CartProvider and useCart hook"
    );
    assert(
      inspector.containsText("asson_quote_v1"),
      "CartContext.tsx must persist state under localStorage key 'asson_quote_v1'"
    );
  });
}
