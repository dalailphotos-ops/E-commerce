/**
 * In-Memory CartContext and localStorage Simulator
 * Faithfully mirrors src/context/CartContext.tsx and asson_quote_v1 persistence.
 */

export const STORAGE_KEY = "asson_quote_v1";

/**
 * In-Memory mock of browser localStorage.
 */
export class MockLocalStorage {
  constructor(initialData = {}) {
    this.store = new Map(Object.entries(initialData));
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  get length() {
    return this.store.size;
  }
}

/**
 * Cart State Simulator implementing CartContextValue contracts.
 */
export class CartSimulator {
  constructor(storage = new MockLocalStorage()) {
    this.storage = storage;
    this.items = [];
    this._idCounter = 0;
    this.loadFromStorage();
  }

  _generateId() {
    this._idCounter += 1;
    return `item_${Date.now()}_${this._idCounter}`;
  }

  /**
   * Recalculates item quantity from sizes map if sizes are specified.
   */
  _computeQuantity(sizes, fallbackQty) {
    if (sizes && typeof sizes === "object") {
      const sum = Object.values(sizes).reduce((acc, n) => acc + (Number(n) || 0), 0);
      if (sum > 0) return sum;
    }
    return Math.max(1, Number(fallbackQty) || 1);
  }

  /**
   * Computes unitPrice * quantity for a line item.
   */
  _computeTotalPrice(unitPrice, quantity) {
    return Math.round((Number(unitPrice) || 0) * (Number(quantity) || 1) * 100) / 100;
  }

  /**
   * Adds an item to the quote cart.
   * @param {Object} item - CartItem without id / totalPrice
   */
  addItem(item) {
    const id = item.id || this._generateId();
    const quantity = this._computeQuantity(item.sizes, item.quantity);
    const unitPrice = Number(item.unitPrice) || 0;
    const totalPrice = this._computeTotalPrice(unitPrice, quantity);

    const newItem = {
      id,
      productId: item.productId || "unknown",
      productName: item.productName || "Unnamed Garment",
      productSpec: item.productSpec || "",
      color: item.color || "Black",
      colorHex: item.colorHex || "#000000",
      sizes: item.sizes ? { ...item.sizes } : { M: quantity },
      quantity,
      prints: Array.isArray(item.prints) ? [...item.prints] : [],
      mockupFrontUrl: item.mockupFrontUrl || "",
      mockupBackUrl: item.mockupBackUrl || "",
      unitPrice,
      totalPrice,
    };

    this.items.push(newItem);
    this.saveToStorage();
    return newItem;
  }

  /**
   * Updates an existing cart item by ID.
   */
  updateItem(id, updates) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`CartItem with ID ${id} not found`);
    }

    const current = this.items[index];
    const newSizes = updates.sizes !== undefined ? { ...updates.sizes } : current.sizes;
    const newQuantity = updates.quantity !== undefined
      ? Number(updates.quantity)
      : this._computeQuantity(newSizes, current.quantity);
    const newUnitPrice = updates.unitPrice !== undefined ? Number(updates.unitPrice) : current.unitPrice;
    const newTotalPrice = this._computeTotalPrice(newUnitPrice, newQuantity);

    this.items[index] = {
      ...current,
      ...updates,
      sizes: newSizes,
      quantity: newQuantity,
      unitPrice: newUnitPrice,
      totalPrice: newTotalPrice,
    };

    this.saveToStorage();
    return this.items[index];
  }

  /**
   * Removes an item by ID.
   */
  removeItem(id) {
    const initialLen = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    if (this.items.length !== initialLen) {
      this.saveToStorage();
    }
  }

  /**
   * Clears all items in the cart.
   */
  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Total number of garment units in the cart.
   */
  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Subtotal of all items.
   */
  get subtotal() {
    const raw = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return Math.round(raw * 100) / 100;
  }

  /**
   * 5% GST computation.
   */
  get gst() {
    return Math.round(this.subtotal * 0.05 * 100) / 100;
  }

  /**
   * Grand total including GST.
   */
  get grandTotal() {
    return Math.round((this.subtotal + this.gst) * 100) / 100;
  }

  /**
   * Serializes current items to localStorage under 'asson_quote_v1'.
   */
  saveToStorage() {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }

  /**
   * Deserializes items from localStorage under 'asson_quote_v1'.
   */
  loadFromStorage() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.items = parsed;
        }
      }
    } catch (err) {
      console.error("Failed to load from localStorage:", err);
      this.items = [];
    }
  }
}

export default {
  STORAGE_KEY,
  MockLocalStorage,
  CartSimulator,
};
