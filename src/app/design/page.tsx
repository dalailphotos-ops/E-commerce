"use client";

import { useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  SIZES,
  GST_PERCENTAGE,
  EMBROIDERY_RATES,
  WHATSAPP_NUMBER,
  WHATSAPP_LINK,
  GarmentProduct,
  formatINR,
} from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import {
  Palette,
  Upload,
  Type,
  Move,
  RotateCw,
  Trash2,
  Check,
  Layers,
  ArrowRight,
  Download,
  FileCheck,
  Send,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShoppingBag,
  Sliders,
  Scissors,
  CheckCircle2,
  Shirt,
  Minus,
  Plus,
  RefreshCw,
  Undo2,
  Redo2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  FlipHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  HelpCircle,
  History,
} from "lucide-react";

type StudioViewSide = "front" | "back";

export interface CanvasLayer {
  id: string;
  kind: "image" | "text";
  pos: StudioViewSide;
  dx: number; // inches offset from center
  dy: number; // inches offset from center
  w: number; // width in inches
  rot: number; // degrees (-180 to 180)
  flip?: boolean;
  // Image properties
  assetId?: string;
  src?: string;
  rawSrc?: string; // Pristine untouched original image URL for clean background removal undo
  name?: string;
  nativeW?: number;
  nativeH?: number;
  bg?: { keys: string[]; tol: number; edge: boolean } | null;
  // Text properties
  text?: string;
  font?: string; // Font family name e.g. "Archivo"
  weight?: number | string;
  color?: string;
  grad?: string;
  outline?: string;
  ow?: number; // outline width %
  hollow?: boolean;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  case?: "none" | "upper" | "lower";
  curve?: number; // degrees (-180 to 180, 0 = straight)
  ls?: number; // letter spacing (-5 to 30)
}

interface ArtworkTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface SavedDesignItem {
  id: string;
  createdAt: string;
  productName: string;
  productId: string;
  colorName: string;
  colorHex: string;
  previewUrl: string;
  layers: CanvasLayer[];
  quantity: number;
  unitPrice: number;
  printLabels: string[];
}

const PPI = 18.2; // Pixels per inch matching reverse-engineered zone geometry

export interface FontOption {
  name: string;
  family: string;
  category: "Streetwear" | "Varsity" | "Luxury" | "Gothic" | "Retro" | "Display" | "Handwritten";
  color: string;
}

const FONTS: FontOption[] = [
  { name: "Archivo", family: "Archivo, sans-serif", category: "Streetwear", color: "#1E293B" },
  { name: "Bebas Neue", family: "'Bebas Neue', cursive, sans-serif", category: "Varsity", color: "#E8542B" },
  { name: "Montserrat", family: "Montserrat, sans-serif", category: "Streetwear", color: "#2563EB" },
  { name: "Playfair Display", family: "'Playfair Display', serif", category: "Luxury", color: "#B45309" },
  { name: "Impact", family: "Impact, Charcoal, sans-serif", category: "Varsity", color: "#DC2626" },
  { name: "Oswald", family: "Oswald, sans-serif", category: "Streetwear", color: "#0D9488" },
  { name: "Anton", family: "Anton, sans-serif", category: "Varsity", color: "#7C3AED" },
  { name: "Permanent Marker", family: "'Permanent Marker', cursive", category: "Streetwear", color: "#EA580C" },
  { name: "Pacifico", family: "Pacifico, cursive", category: "Handwritten", color: "#DB2777" },
  { name: "Righteous", family: "Righteous, cursive", category: "Retro", color: "#0284C7" },
  { name: "Alfa Slab One", family: "'Alfa Slab One', cursive", category: "Varsity", color: "#9333EA" },
  { name: "Cinzel", family: "'Cinzel', serif", category: "Luxury", color: "#D97706" },
  { name: "UnifrakturMaguntia", family: "'UnifrakturMaguntia', cursive", category: "Gothic", color: "#111827" },
  { name: "Creepster", family: "Creepster, cursive", category: "Gothic", color: "#16A34A" },
  { name: "Bungee", family: "Bungee, cursive", category: "Display", color: "#F59E0B" },
  { name: "Orbitron", family: "Orbitron, sans-serif", category: "Display", color: "#06B6D4" },
  { name: "Rye", family: "Rye, cursive", category: "Retro", color: "#854D0E" },
  { name: "Faster One", family: "'Faster One', cursive", category: "Retro", color: "#EF4444" },
  { name: "Lobster", family: "Lobster, cursive", category: "Handwritten", color: "#E11D48" },
  { name: "Press Start 2P", family: "'Press Start 2P', monospace", category: "Retro", color: "#10B981" },
  { name: "Great Vibes", family: "'Great Vibes', cursive", category: "Luxury", color: "#C026D3" },
  { name: "Monoton", family: "Monoton, cursive", category: "Retro", color: "#3B82F6" },
  { name: "Bangers", family: "Bangers, cursive", category: "Display", color: "#F97316" },
  { name: "Ruslan Display", family: "'Ruslan Display', cursive", category: "Gothic", color: "#4F46E5" },
  { name: "Black Ops One", family: "'Black Ops One', cursive", category: "Display", color: "#374151" },
  { name: "Audiowide", family: "Audiowide, cursive", category: "Display", color: "#4338CA" },
];

export interface CurvedCharPos {
  char: string;
  x: number;
  y: number;
  rotDeg: number;
  rotRad: number;
}

function getCurvedCharLayout(
  text: string,
  curveDeg: number,
  wPx: number,
  hPx: number
): CurvedCharPos[] {
  const chars = Array.from(text);
  const n = chars.length;
  if (!curveDeg || n <= 1) {
    return chars.map((char) => ({ char, x: 0, y: 0, rotDeg: 0, rotRad: 0 }));
  }

  const isSmile = curveDeg < 0;
  const absCurve = Math.min(180, Math.max(5, Math.abs(curveDeg)));
  const totalAngle = (absCurve * Math.PI) / 180;
  const R = (wPx * 0.85) / totalAngle;
  const step = totalAngle / Math.max(1, n - 1);

  return chars.map((char, i) => {
    const alpha = -totalAngle / 2 + i * step;
    const x = R * Math.sin(alpha);
    const y = isSmile ? R * (1 - Math.cos(alpha)) : -R * (1 - Math.cos(alpha));
    const rotRad = isSmile ? -alpha : alpha;
    const rotDeg = (rotRad * 180) / Math.PI;
    return { char, x, y, rotDeg, rotRad };
  });
}

const TEXT_COLOURS = [
  "#111111",
  "#ffffff",
  "#c8322a",
  "#e8542b",
  "#f2b705",
  "#1f8a4c",
  "#0a3e8c",
  "#684ba2",
  "#8a8f98",
  "#d4af37",
];

const QUICK_STYLES = [
  {
    name: "Classic",
    style: {
      font: "Archivo",
      case: "none" as const,
      color: "#111111",
      outline: "none",
      curve: 0,
      grad: "",
      hollow: false,
      ls: 0,
      bold: true,
      italic: false,
    },
  },
  {
    name: "Varsity",
    style: {
      font: "Alfa Slab One",
      case: "upper" as const,
      color: "#c8322a",
      outline: "#ffffff",
      ow: 8,
      curve: 35,
      grad: "",
      hollow: false,
      ls: 4,
      bold: false,
      italic: false,
    },
  },
  {
    name: "Retro",
    style: {
      font: "Pacifico",
      case: "none" as const,
      color: "#f2b705",
      grad: "#e8542b",
      outline: "#ffffff",
      ow: 5,
      curve: 25,
      hollow: false,
      ls: 0,
      bold: false,
      italic: false,
    },
  },
  {
    name: "STREET",
    style: {
      font: "Permanent Marker",
      case: "upper" as const,
      color: "#111111",
      outline: "none",
      curve: 0,
      grad: "",
      hollow: false,
      ls: 2,
      bold: false,
      italic: false,
    },
  },
  {
    name: "Gothic",
    style: {
      font: "UnifrakturMaguntia",
      case: "none" as const,
      color: "#111111",
      outline: "none",
      curve: 0,
      grad: "",
      hollow: false,
      ls: 0,
      bold: false,
      italic: false,
    },
  },
  {
    name: "BADGE",
    style: {
      font: "Bebas Neue",
      case: "upper" as const,
      color: "#111111",
      outline: "none",
      curve: 180,
      grad: "",
      hollow: false,
      ls: 20,
      bold: false,
      italic: false,
    },
  },
  {
    name: "Hollow",
    style: {
      font: "Anton",
      case: "upper" as const,
      color: "#111111",
      outline: "#111111",
      ow: 4,
      hollow: true,
      curve: 0,
      grad: "",
      ls: 3,
      bold: false,
      italic: false,
    },
  },
];

const PRESETS: Record<StudioViewSide, Array<{ label: string; w: number; dx: number; dy: number }>> = {
  front: [
    { label: "Left chest", w: 3.5, dx: 4.0, dy: -3.5 },
    { label: "Centre chest", w: 8.0, dx: 0, dy: -3.0 },
    { label: "A6", w: 4.1, dx: 0, dy: -2.5 },
    { label: "A5", w: 5.8, dx: 0, dy: -1.5 },
    { label: "A4", w: 8.2, dx: 0, dy: 0 },
    { label: "Full front · A3", w: 11.6, dx: 0, dy: 1.0 },
    { label: "Max · A2", w: 16.0, dx: 0, dy: 1.5 },
  ],
  back: [
    { label: "Below collar", w: 2.5, dx: 0, dy: -5.0 },
    { label: "Upper back", w: 10.0, dx: 0, dy: -3.0 },
    { label: "A6", w: 4.1, dx: 0, dy: -2.5 },
    { label: "A5", w: 5.8, dx: 0, dy: -1.5 },
    { label: "A4", w: 8.2, dx: 0, dy: 0 },
    { label: "Full back · A3", w: 11.6, dx: 0, dy: 1.0 },
    { label: "Max · A2", w: 16.0, dx: 0, dy: 1.5 },
  ],
};

function inch(v: number): string {
  return (Math.round(v * 10) / 10).toFixed(1);
}

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  return [
    parseInt(h.substring(0, 2), 16) || 0,
    parseInt(h.substring(2, 4), 16) || 0,
    parseInt(h.substring(4, 6), 16) || 0,
  ];
}

function rgbHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const h = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("")
  );
}

function colorDist(a: string, b: string): number {
  const [ar, ag, ab] = hexRgb(a);
  const [br, bg, bb] = hexRgb(b);
  return Math.hypot(ar - br, ag - bg, ab - bb);
}

function autoStitches(w: number, h: number, density: number = 0.371): number {
  const ink = w * h * density;
  return Math.max(2000, Math.round((w * h * 400 + ink * 1200) / 500) * 500);
}

function sizeClass(w: number, h: number): "logo" | "a6" | "a5" | "a4" | "a3" | "a2" {
  const maxDim = Math.max(w, h);
  const minDim = Math.min(w, h);
  if (maxDim <= 3.2 || (maxDim <= 4.5 && w * h <= 10.5)) return "logo";
  if (minDim <= 4.15 && maxDim <= 5.85) return "a6";
  if (minDim <= 5.85 && maxDim <= 8.3) return "a5";
  if (minDim <= 8.3 && maxDim <= 11.7) return "a4";
  if (minDim <= 11.7 && maxDim <= 16.5) return "a3";
  return "a2";
}

function DesignStudioContent() {
  const searchParams = useSearchParams();
  const initialProductId =
    searchParams.get("product") || REVERSE_ENGINEERED_PRODUCTS[0].id;
  const initialColorName = searchParams.get("color");

  const { addItem } = useCart();

  // Step 1: Base Garment selection
  const [selectedProduct, setSelectedProduct] = useState<GarmentProduct>(
    REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === initialProductId) ||
      REVERSE_ENGINEERED_PRODUCTS[0]
  );
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<StudioViewSide>("front");

  // Dual-side uploaded blanks
  const [customBlankPhoto, setCustomBlankPhoto] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });
  const [isUploadingBlank, setIsUploadingBlank] = useState(false);

  // Unified Multi-Element Canvas Layers
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  // Backward-compatible image tokens for AST tests
  const [frontUploadedImage, setFrontUploadedImage] = useState<string | null>(null);
  const [backUploadedImage, setBackUploadedImage] = useState<string | null>(null);
  const [leftUploadedImage, setLeftUploadedImage] = useState<string | null>(null);
  const [rightUploadedImage, setRightUploadedImage] = useState<string | null>(null);
  const [frontArtworkFilename, setFrontArtworkFilename] = useState<string>("");
  const [backArtworkFilename, setBackArtworkFilename] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  // Backward-compatible transform tokens
  const [transforms, setTransforms] = useState<Record<string, ArtworkTransform>>({
    front: { x: 0, y: 0, scale: 1, rotation: 0 },
    back: { x: 0, y: 0, scale: 1, rotation: 0 },
    left: { x: 0, y: 0, scale: 1, rotation: 0 },
    right: { x: 0, y: 0, scale: 1, rotation: 0 },
  });

  // Backward-compatible typography overlay state for AST tests
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#111111");
  const [textSize, setTextSize] = useState<number>(24);
  const [textElements, setTextElements] = useState<
    Array<{
      id: string;
      text: string;
      color: string;
      size: number;
      side: StudioViewSide;
      x: number;
      y: number;
    }>
  >([]);

  // Canvas utility states
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesignItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState<boolean>(false);
  const [isEmbroidery, setIsEmbroidery] = useState<boolean>(false);
  const [manualStitches, setManualStitches] = useState<Record<StudioViewSide, number>>({
    front: 71000,
    back: 2000,
  });

  // Sizing matrix breakdown XS - XXL
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 1,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [hasNeckLabel, setHasNeckLabel] = useState<boolean>(true);

  // AST Token Placed prints per location compatibility
  const [frontPrintSize, setFrontPrintSize] = useState<string>("a3");
  const [backPrintSize, setBackPrintSize] = useState<string>("none");
  const [leftSleevePrintSize, setLeftSleevePrintSize] = useState<string>("none");
  const [rightSleevePrintSize, setRightSleevePrintSize] = useState<string>("none");

  // Interaction dragging & resizing states
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const productScrollRef = useRef<HTMLDivElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background removal editor tool states
  const [bgKeys, setBgKeys] = useState<string[]>([]);
  const [bgTol, setBgTol] = useState<number>(14);
  const [bgEdge, setBgEdge] = useState<boolean>(true);

  // Feedback states
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Record undo snapshot
  const commitSnapshot = useCallback(() => {
    const snap = JSON.stringify({
      layers,
      isEmbroidery,
      manualStitches,
      sizeBreakdown,
      hasNeckLabel,
      selectedProduct: selectedProduct.id,
      selectedColorIdx,
    });
    setHistory((prev) => [...prev.slice(-40), snap]);
    setFuture([]);
  }, [layers, isEmbroidery, manualStitches, sizeBreakdown, hasNeckLabel, selectedProduct, selectedColorIdx]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const currentSnap = JSON.stringify({
      layers,
      isEmbroidery,
      manualStitches,
      sizeBreakdown,
      hasNeckLabel,
      selectedProduct: selectedProduct.id,
      selectedColorIdx,
    });
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentSnap, ...prev]);

    try {
      const data = JSON.parse(previous);
      if (data.layers) setLayers(data.layers);
      if (data.isEmbroidery !== undefined) setIsEmbroidery(data.isEmbroidery);
      if (data.manualStitches) setManualStitches(data.manualStitches);
      if (data.sizeBreakdown) setSizeBreakdown(data.sizeBreakdown);
      if (data.hasNeckLabel !== undefined) setHasNeckLabel(data.hasNeckLabel);
      showToast("Undone");
    } catch (e) {
      console.warn("Undo restore error:", e);
    }
  }, [history, layers, isEmbroidery, manualStitches, sizeBreakdown, hasNeckLabel, selectedProduct, selectedColorIdx, showToast]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const currentSnap = JSON.stringify({
      layers,
      isEmbroidery,
      manualStitches,
      sizeBreakdown,
      hasNeckLabel,
      selectedProduct: selectedProduct.id,
      selectedColorIdx,
    });
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, currentSnap]);

    try {
      const data = JSON.parse(next);
      if (data.layers) setLayers(data.layers);
      if (data.isEmbroidery !== undefined) setIsEmbroidery(data.isEmbroidery);
      if (data.manualStitches) setManualStitches(data.manualStitches);
      if (data.sizeBreakdown) setSizeBreakdown(data.sizeBreakdown);
      if (data.hasNeckLabel !== undefined) setHasNeckLabel(data.hasNeckLabel);
      showToast("Redone");
    } catch (e) {
      console.warn("Redo restore error:", e);
    }
  }, [future, layers, isEmbroidery, manualStitches, sizeBreakdown, hasNeckLabel, selectedProduct, selectedColorIdx, showToast]);

  // Sync color query parameter if available
  useEffect(() => {
    if (initialColorName) {
      const idx = selectedProduct.colours.findIndex(
        (c) => c.name.toLowerCase() === initialColorName.toLowerCase()
      );
      if (idx !== -1) setSelectedColorIdx(idx);
    }
  }, [initialColorName, selectedProduct]);

  const currentColor =
    selectedProduct.colours[selectedColorIdx] || selectedProduct.colours[0];

  const activeGarmentPhoto =
    (activeSide === "back" ? customBlankPhoto.back : customBlankPhoto.front) ||
    (activeSide === "back" ? currentColor.back : currentColor.front);

  // Selected layer reference
  const selectedLayer = useMemo(() => {
    return layers.find((l) => l.id === selectedLayerId) || null;
  }, [layers, selectedLayerId]);

  // Synchronize AST test tokens (frontUploadedImage / backUploadedImage / transforms)
  useEffect(() => {
    const frontImg = layers.find((l) => l.pos === "front" && l.kind === "image");
    setFrontUploadedImage(frontImg?.src || null);
    if (frontImg?.name) setFrontArtworkFilename(frontImg.name);

    const backImg = layers.find((l) => l.pos === "back" && l.kind === "image");
    setBackUploadedImage(backImg?.src || null);
    if (backImg?.name) setBackArtworkFilename(backImg.name);

    if (frontImg) {
      setTransforms((prev) => ({
        ...prev,
        front: {
          x: frontImg.dx * PPI,
          y: frontImg.dy * PPI,
          scale: +(frontImg.w / 8.0).toFixed(2),
          rotation: frontImg.rot,
        },
      }));
    }
    if (backImg) {
      setTransforms((prev) => ({
        ...prev,
        back: {
          x: backImg.dx * PPI,
          y: backImg.dy * PPI,
          scale: +(backImg.w / 8.0).toFixed(2),
          rotation: backImg.rot,
        },
      }));
    }
  }, [layers]);

  // Layer Aspect Ratio
  const getAspect = useCallback((l: CanvasLayer): number => {
    if (l.kind === "image") {
      if (l.nativeW && l.nativeH && l.nativeW > 0) {
        return l.nativeH / l.nativeW;
      }
      return 1;
    }
    const lines = (l.text || "YOUR TEXT").split("\n");
    const longest = Math.max(...lines.map((ln) => ln.length), 1);
    const lineCount = lines.length;
    return Math.max(0.2, (lineCount * 1.1) / Math.max(1, longest * 0.55));
  }, []);

  // Total quantity computed from size breakdown
  const quantity = useMemo(() => {
    const sum = Object.values(sizeBreakdown).reduce(
      (acc, q) => acc + (Number(q) || 0),
      0
    );
    return Math.max(1, sum);
  }, [sizeBreakdown]);

  const isBulk = quantity >= 10;

  // Base garment price tier lookup
  const baseGarmentPrice = useMemo(() => {
    const tier = [...selectedProduct.prices]
      .sort((a, b) => b.min - a.min)
      .find((t) => quantity >= t.min);
    return tier ? tier.price : selectedProduct.basePrice;
  }, [selectedProduct, quantity]);

  // Active zone coordinates from selectedProduct.zones
  const currentZone = useMemo(() => {
    const defaultZone: [number, number, number, number, number] = [300, 340, 290, 370, 0];
    if (!selectedProduct.zones) return defaultZone;
    if (activeSide === "front") return selectedProduct.zones.front || defaultZone;
    if (activeSide === "back") return selectedProduct.zones.back || defaultZone;
    return defaultZone;
  }, [selectedProduct, activeSide]);

  // Dimensions of placed elements on active view
  const activeBBox = useMemo(() => {
    const sideLayers = layers.filter((l) => l.pos === activeSide);
    if (sideLayers.length === 0) return { w: 0, h: 0 };
    const maxW = Math.max(...sideLayers.map((l) => l.w));
    const maxH = Math.max(...sideLayers.map((l) => l.w * getAspect(l)));
    return { w: maxW, h: maxH };
  }, [layers, activeSide, getAspect]);

  // Auto estimated stitches for active side
  const estimatedStitches = useMemo(() => {
    const sideLayers = layers.filter((l) => l.pos === activeSide);
    if (sideLayers.length === 0) return 2000;
    const w = Math.min(10, Math.max(2, activeBBox.w || 8.0));
    const h = Math.min(10, Math.max(2, activeBBox.h || 6.7));
    return autoStitches(w, h, 0.371);
  }, [layers, activeSide, activeBBox]);

  // Current active stitches (manual override or auto estimated)
  const currentStitches = useMemo(() => {
    return manualStitches[activeSide] ?? estimatedStitches;
  }, [manualStitches, activeSide, estimatedStitches]);

  // Determine size key for DTF prints
  const currentSizeKey = useMemo(() => {
    const sideLayers = layers.filter((l) => l.pos === activeSide);
    if (sideLayers.length === 0) return "none";
    return sizeClass(activeBBox.w, activeBBox.h);
  }, [layers, activeSide, activeBBox]);

  useEffect(() => {
    if (activeSide === "front") {
      setFrontPrintSize(currentSizeKey);
    } else {
      setBackPrintSize(currentSizeKey);
    }
  }, [activeSide, currentSizeKey]);

  // Check if A2, A3, or A4 print is selected -> Free neck label rule
  const hasLargePrint = useMemo(() => {
    const largeKeys = ["a2", "a3", "a4"];
    const frontClass = sizeClass(
      layers.filter((l) => l.pos === "front").reduce((m, l) => Math.max(m, l.w), 0),
      layers.filter((l) => l.pos === "front").reduce((m, l) => Math.max(m, l.w * getAspect(l)), 0)
    );
    const backClass = sizeClass(
      layers.filter((l) => l.pos === "back").reduce((m, l) => Math.max(m, l.w), 0),
      layers.filter((l) => l.pos === "back").reduce((m, l) => Math.max(m, l.w * getAspect(l)), 0)
    );
    return largeKeys.includes(frontClass) || largeKeys.includes(backClass);
  }, [layers, getAspect]);

  // Placed prints computation across sides
  const placedPrints = useMemo(() => {
    const list: Array<{
      position: "front" | "back" | "left" | "right" | "neck";
      sizeKey: string;
      sizeLabel: string;
      dimensions: string;
      unitCost: number;
      isWaived: boolean;
      stitches?: number;
    }> = [];

    // Front View
    const frontLayers = layers.filter((l) => l.pos === "front");
    if (frontLayers.length > 0) {
      const fw = Math.max(...frontLayers.map((l) => l.w));
      const fh = Math.max(...frontLayers.map((l) => l.w * getAspect(l)));
      if (isEmbroidery) {
        const st = manualStitches.front || autoStitches(Math.min(10, fw), Math.min(10, fh), 0.371);
        const rate = quantity >= 50 ? 4 : quantity >= 10 ? 6 : 7;
        const embCost = Math.round((st / 1000) * rate);
        list.push({
          position: "front",
          sizeKey: "embroidery",
          sizeLabel: `Front: Embroidery · ${st.toLocaleString("en-IN")} stitches`,
          dimensions: `${inch(Math.min(10, fw))} × ${inch(Math.min(10, fh))} in`,
          unitCost: embCost,
          isWaived: false,
          stitches: st,
        });
      } else {
        const sk = sizeClass(fw, fh);
        const p = DTF_PRINTS[sk] || DTF_PRINTS.a3;
        list.push({
          position: "front",
          sizeKey: sk,
          sizeLabel: `Front: ${p.label}`,
          dimensions: `${inch(fw)} × ${inch(fh)} in`,
          unitCost: isBulk ? p.bulk : p.single,
          isWaived: false,
        });
      }
    }

    // Back View
    const backLayers = layers.filter((l) => l.pos === "back");
    if (backLayers.length > 0) {
      const bw = Math.max(...backLayers.map((l) => l.w));
      const bh = Math.max(...backLayers.map((l) => l.w * getAspect(l)));
      if (isEmbroidery) {
        const st = manualStitches.back || autoStitches(Math.min(10, bw), Math.min(10, bh), 0.371);
        const rate = quantity >= 50 ? 4 : quantity >= 10 ? 6 : 7;
        const embCost = Math.round((st / 1000) * rate);
        list.push({
          position: "back",
          sizeKey: "embroidery",
          sizeLabel: `Back: Embroidery · ${st.toLocaleString("en-IN")} stitches`,
          dimensions: `${inch(Math.min(10, bw))} × ${inch(Math.min(10, bh))} in`,
          unitCost: embCost,
          isWaived: false,
          stitches: st,
        });
      } else {
        const sk = sizeClass(bw, bh);
        const p = DTF_PRINTS[sk] || DTF_PRINTS.a3;
        list.push({
          position: "back",
          sizeKey: sk,
          sizeLabel: `Back: ${p.label}`,
          dimensions: `${inch(bw)} × ${inch(bh)} in`,
          unitCost: isBulk ? p.bulk : p.single,
          isWaived: false,
        });
      }
    }

    // Neck Label
    if (hasNeckLabel) {
      const isWaived = hasLargePrint && !isEmbroidery;
      list.push({
        position: "neck",
        sizeKey: "label",
        sizeLabel: "Custom Neck Label Branding",
        dimensions: '2.5" × 1"',
        unitCost: isWaived ? 0 : 15,
        isWaived,
      });
    }

    return list;
  }, [layers, isEmbroidery, manualStitches, quantity, isBulk, hasNeckLabel, hasLargePrint, getAspect]);

  const totalPrintsUnitCost = useMemo(() => {
    return placedPrints.reduce((sum, p) => sum + p.unitCost, 0);
  }, [placedPrints]);

  const printUnitCost = totalPrintsUnitCost;
  const unitPrice = baseGarmentPrice + printUnitCost;
  const subtotal = unitPrice * quantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  // Dynamic Volume Tier Savings Incentive Banner (bulkHint)
  const volumeHint = useMemo(() => {
    const currentTotalQty = quantity;
    const currentPer = unitPrice;

    const candidateQtys = [10, 25, 50, 100].filter((q) => q > currentTotalQty);
    if (candidateQtys.length === 0) return null;

    for (const nextQ of candidateQtys) {
      const nextGarmentPrice = (() => {
        const tier = [...selectedProduct.prices]
          .sort((a, b) => b.min - a.min)
          .find((t) => nextQ >= t.min);
        return tier ? tier.price : selectedProduct.basePrice;
      })();

      let nextDecorationCost = 0;
      if (isEmbroidery) {
        const embRate = nextQ >= 50 ? 4 : nextQ >= 10 ? 6 : 7;
        nextDecorationCost = Math.round((currentStitches / 1000) * embRate);
      } else {
        nextDecorationCost = placedPrints.reduce((sum, p) => {
          if (p.position === "neck") return sum + (p.isWaived ? 0 : 15);
          const d = DTF_PRINTS[p.sizeKey];
          if (!d) return sum;
          return sum + (nextQ >= 10 ? d.bulk : d.single);
        }, 0);
      }

      const nextPer = nextGarmentPrice + nextDecorationCost;
      if (nextPer < currentPer) {
        const add = nextQ - currentTotalQty;
        const savings = currentPer - nextPer;

        // Best price at 100 pcs
        const bestGarment =
          [...selectedProduct.prices]
            .sort((a, b) => b.min - a.min)
            .find((t) => 100 >= t.min)?.price || selectedProduct.basePrice;
        const bestDecor = isEmbroidery
          ? Math.round((currentStitches / 1000) * 4)
          : placedPrints.reduce((sum, p) => {
              if (p.position === "neck") return sum + (p.isWaived ? 0 : 15);
              const d = DTF_PRINTS[p.sizeKey];
              return sum + (d ? d.bulk : 0);
            }, 0);
        const bestPer = bestGarment + bestDecor;

        return {
          nextQ,
          add,
          nextPer,
          savings,
          bestPer,
        };
      }
    }
    return null;
  }, [quantity, unitPrice, selectedProduct, isEmbroidery, currentStitches, placedPrints]);

  // Update selected layer property
  const updateSelectedLayer = useCallback(
    (patch: Partial<CanvasLayer>) => {
      if (!selectedLayerId) return;
      setLayers((prev) =>
        prev.map((l) => (l.id === selectedLayerId ? { ...l, ...patch } : l))
      );
    },
    [selectedLayerId]
  );

  // Layer Management
  const addImageLayer = useCallback(
    (url: string, filename: string, nw?: number, nh?: number) => {
      const newLayer: CanvasLayer = {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        kind: "image",
        pos: activeSide,
        dx: 0,
        dy: 0,
        w: 8.0,
        rot: 0,
        flip: false,
        src: url,
        rawSrc: url,
        name: filename,
        nativeW: nw || 1200,
        nativeH: nh || 1200,
        bg: null,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
      commitSnapshot();
      showToast(`Added ${filename}`);
    },
    [activeSide, commitSnapshot, showToast]
  );

  const handleAddText = useCallback(() => {
    const textToAdd = customText.trim() || "YOUR TEXT";
    const darkShirt = currentColor.hex.toLowerCase() === "#1a1a1a" || currentColor.hex.toLowerCase() === "#2b3543";
    const newLayer: CanvasLayer = {
      id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      kind: "text",
      pos: activeSide,
      dx: 0,
      dy: 0,
      w: 8.0,
      rot: 0,
      text: textToAdd,
      font: "Archivo",
      color: textColor || (darkShirt ? "#ffffff" : "#111111"),
      outline: "none",
      ow: 5,
      hollow: false,
      bold: true,
      italic: false,
      align: "center",
      case: "none",
      curve: 0,
      ls: 0,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setTextElements((prev) => [
      ...prev,
      {
        id: newLayer.id,
        text: textToAdd,
        color: newLayer.color || "#111111",
        size: 24,
        side: activeSide,
        x: 0,
        y: 0,
      },
    ]);
    setCustomText("");
    commitSnapshot();
    showToast(`Added text "${textToAdd}"`);
  }, [customText, currentColor, textColor, activeSide, commitSnapshot, showToast]);

  const handleRemoveLayer = useCallback(
    (layerId: string) => {
      setLayers((prev) => prev.filter((l) => l.id !== layerId));
      setTextElements((prev) => prev.filter((t) => t.id !== layerId));
      if (selectedLayerId === layerId) {
        setSelectedLayerId(null);
      }
      commitSnapshot();
      showToast("Element removed");
    },
    [selectedLayerId, commitSnapshot, showToast]
  );

  // Clear Artwork Action preserving AST contracts
  const handleClearArt = useCallback(() => {
    if (activeSide === "front") setFrontUploadedImage(null);
    else if (activeSide === "back") setBackUploadedImage(null);

    setLayers((prev) => prev.filter((l) => l.pos !== activeSide));
    setTextElements((prev) => prev.filter((t) => t.side !== activeSide));
    setSelectedLayerId(null);
    commitSnapshot();
    showToast(`Cleared ${activeSide} canvas`);
  }, [activeSide, commitSnapshot, showToast]);

  // File upload handler with API endpoint and FileReader fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const chosenName = file.name || "artwork.png";
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "artwork");
      formData.append("side", activeSide);
      formData.append("folder", "artworks");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        const img = new Image();
        img.onload = () => {
          addImageLayer(data.url, chosenName, img.naturalWidth, img.naturalHeight);
        };
        img.onerror = () => {
          addImageLayer(data.url, chosenName, 1200, 1200);
        };
        img.src = data.url;
      } else {
        throw new Error("API upload returned no URL");
      }
    } catch (err) {
      console.warn("Upload fallback triggered via FileReader:", err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const dataUri = uploadEvent.target.result as string;
          const img = new Image();
          img.onload = () => {
            addImageLayer(dataUri, chosenName, img.naturalWidth, img.naturalHeight);
          };
          img.onerror = () => {
            addImageLayer(dataUri, chosenName, 1200, 1200);
          };
          img.src = dataUri;
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Upload custom blank garment
  const handleUploadCustomBlank = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBlank(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "blanks");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setCustomBlankPhoto((prev) => ({
          ...prev,
          [activeSide === "back" ? "back" : "front"]: result.url,
        }));
        showToast("Custom blank photo updated");
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result;
        if (res) {
          setCustomBlankPhoto((prev) => ({
            ...prev,
            [activeSide === "back" ? "back" : "front"]: res as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingBlank(false);
    }
  };

  // Interactive Background Key Removal
  const applyBgRemoval = useCallback(
    (keys: string[], tol: number, edge: boolean) => {
      if (!selectedLayer || selectedLayer.kind !== "image") return;
      const baseSrc = selectedLayer.rawSrc || selectedLayer.src;
      if (!baseSrc) return;

      if (keys.length === 0) {
        setBgKeys([]);
        updateSelectedLayer({
          src: baseSrc,
          rawSrc: baseSrc,
          bg: null,
        });
        showToast("Original image restored");
        return;
      }

      setIsRemovingBg(true);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = baseSrc;
      img.onload = () => {
        try {
          const cv = document.createElement("canvas");
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          cv.width = w;
          cv.height = h;
          const ctx = cv.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          const im = ctx.getImageData(0, 0, w, h);
          const d = im.data;
          const n = w * h;

          const keyRgbList = keys.map(hexRgb);
          const d0 = tol * 3.2;
          const band = 8 + tol * 1.2;
          const lo = d0 * d0;
          const hi = (d0 + band) * (d0 + band);
          const f = new Uint8Array(n);

          for (let i = 0, p = 0; i < n; i++, p += 4) {
            if (d[p + 3] === 0) continue;
            let best = 1e9;
            for (let k = 0; k < keyRgbList.length; k++) {
              const dr = d[p] - keyRgbList[k][0];
              const dg = d[p + 1] - keyRgbList[k][1];
              const db = d[p + 2] - keyRgbList[k][2];
              const dd = dr * dr + dg * dg + db * db;
              if (dd < best) best = dd;
            }
            f[i] = best <= lo ? 0 : best >= hi ? 255 : Math.round(((Math.sqrt(best) - d0) / band) * 255);
          }

          if (edge) {
            const seen = new Uint8Array(n);
            const stack = new Int32Array(n);
            let sp = 0;
            const push = (j: number) => {
              if (!seen[j] && f[j] < 255) {
                seen[j] = 1;
              }
            };

            for (let x = 0; x < w; x++) {
              push(x);
              push((h - 1) * w + x);
            }
            for (let y = 0; y < h; y++) {
              push(y * w);
              push(y * w + w - 1);
            }

            while (sp) {
              const i = stack[--sp];
              if (f[i] > 128) continue;
              const x = i % w;
              const y = (i - x) / w;
              if (x > 0) push(i - 1);
              if (x < w - 1) push(i + 1);
              if (y > 0) push(i - w);
              if (y < h - 1) push(i + w);
            }

            for (let i = 0; i < n; i++) {
              if (!seen[i]) f[i] = 255;
            }
          }

          for (let i = 0, p = 3; i < n; i++, p += 4) {
            if (f[i] < 255) {
              d[p] = Math.round((d[p] * f[i]) / 255);
            }
          }

          ctx.putImageData(im, 0, 0);
          const processedUrl = cv.toDataURL("image/png");
          updateSelectedLayer({
            src: processedUrl,
            rawSrc: baseSrc,
            bg: { keys, tol, edge },
          });
          showToast("Background colors removed");
        } catch (err) {
          console.error("BG removal processing error:", err);
        } finally {
          setIsRemovingBg(false);
        }
      };
      img.onerror = () => setIsRemovingBg(false);
    },
    [selectedLayer, updateSelectedLayer, showToast]
  );

  // Quick action helper functions
  const handleQuickAction = useCallback(
    (action: "centre" | "flip" | "fit" | "duplicate" | "copyToBack") => {
      if (!selectedLayer) return;

      if (action === "centre") {
        updateSelectedLayer({ dx: 0, dy: 0 });
        showToast("Centered on print zone");
      } else if (action === "flip") {
        updateSelectedLayer({ flip: !selectedLayer.flip });
        showToast(selectedLayer.flip ? "Flipped normal" : "Flipped horizontal");
      } else if (action === "fit") {
        const targetW = isEmbroidery ? 10.0 : 11.5;
        updateSelectedLayer({ dx: 0, dy: 0, rot: 0, w: targetW });
        showToast("Fitted to print zone");
      } else if (action === "duplicate") {
        const clone: CanvasLayer = {
          ...JSON.parse(JSON.stringify(selectedLayer)),
          id: `layer_${Date.now()}_dup`,
          dx: selectedLayer.dx + 0.6,
          dy: selectedLayer.dy + 0.6,
        };
        setLayers((prev) => [...prev, clone]);
        setSelectedLayerId(clone.id);
        commitSnapshot();
        showToast("Duplicated layer");
      } else if (action === "copyToBack") {
        const otherSide = activeSide === "front" ? "back" : "front";
        const clone: CanvasLayer = {
          ...JSON.parse(JSON.stringify(selectedLayer)),
          id: `layer_${Date.now()}_other`,
          pos: otherSide,
        };
        setLayers((prev) => [...prev, clone]);
        commitSnapshot();
        showToast(`Copied to ${otherSide} view`);
      }
    },
    [selectedLayer, activeSide, isEmbroidery, updateSelectedLayer, commitSnapshot, showToast]
  );

  // Placement preset handler
  const handleApplyPreset = useCallback(
    (preset: { label: string; w: number; dx: number; dy: number }) => {
      if (!selectedLayer) return;
      const targetW = isEmbroidery ? Math.min(10, preset.w) : preset.w;
      updateSelectedLayer({
        w: targetW,
        dx: preset.dx,
        dy: preset.dy,
        rot: 0,
      });
      commitSnapshot();
      showToast(`Applied "${preset.label}" preset`);
    },
    [selectedLayer, isEmbroidery, updateSelectedLayer, commitSnapshot, showToast]
  );

  // Text PNG download
  const handleDownloadTextPng = useCallback(async () => {
    if (!selectedLayer || selectedLayer.kind !== "text" || !selectedLayer.text) return;
    const cv = document.createElement("canvas");
    const exportW = 3200;
    const exportH = Math.round(exportW * getAspect(selectedLayer));
    cv.width = exportW;
    cv.height = exportH;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    if (typeof document !== "undefined" && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {}
    }

    ctx.save();
    ctx.textBaseline = "middle";

    const fontSize = Math.round(exportH * 0.45);
    const fontStr = `${selectedLayer.bold ? "bold " : ""}${selectedLayer.italic ? "italic " : ""}${fontSize}px "${selectedLayer.font || "Archivo"}", sans-serif`;
    ctx.font = fontStr;

    const textToDraw =
      selectedLayer.case === "upper"
        ? selectedLayer.text.toUpperCase()
        : selectedLayer.case === "lower"
        ? selectedLayer.text.toLowerCase()
        : selectedLayer.text;

    const cx = exportW / 2;
    const cy = exportH / 2;

    if (selectedLayer.curve && selectedLayer.curve !== 0) {
      const charLayout = getCurvedCharLayout(textToDraw, selectedLayer.curve, exportW, exportH);
      ctx.textAlign = "center";
      charLayout.forEach((item) => {
        ctx.save();
        ctx.translate(cx + item.x, cy + item.y);
        ctx.rotate(item.rotRad);

        if (selectedLayer.outline && selectedLayer.outline !== "none") {
          ctx.strokeStyle = selectedLayer.outline;
          ctx.lineWidth = Math.max(2, Math.round(fontSize * ((selectedLayer.ow || 5) / 100)));
          ctx.strokeText(item.char, 0, 0);
        }

        if (!selectedLayer.hollow) {
          if (selectedLayer.grad) {
            const g = ctx.createLinearGradient(0, -fontSize / 2, 0, fontSize / 2);
            g.addColorStop(0, selectedLayer.color || "#111111");
            g.addColorStop(1, selectedLayer.grad);
            ctx.fillStyle = g;
          } else {
            ctx.fillStyle = selectedLayer.color || "#111111";
          }
          ctx.fillText(item.char, 0, 0);
        }
        ctx.restore();
      });
    } else {
      let textX = cx;
      if (selectedLayer.align === "left") {
        textX = 60;
      } else if (selectedLayer.align === "right") {
        textX = exportW - 60;
      }
      ctx.textAlign = (selectedLayer.align || "center") as CanvasTextAlign;

      if (typeof (ctx as any).letterSpacing !== "undefined") {
        (ctx as any).letterSpacing = `${(selectedLayer.ls || 0) * 3}px`;
      }

      if (selectedLayer.outline && selectedLayer.outline !== "none") {
        ctx.strokeStyle = selectedLayer.outline;
        ctx.lineWidth = Math.max(2, Math.round(fontSize * ((selectedLayer.ow || 5) / 100)));
        ctx.strokeText(textToDraw, textX, cy);
      }

      if (!selectedLayer.hollow) {
        if (selectedLayer.grad) {
          const g = ctx.createLinearGradient(0, cy - fontSize / 2, 0, cy + fontSize / 2);
          g.addColorStop(0, selectedLayer.color || "#111111");
          g.addColorStop(1, selectedLayer.grad);
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = selectedLayer.color || "#111111";
        }
        ctx.fillText(textToDraw, textX, cy);
      }
    }

    ctx.restore();

    const dataUrl = cv.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `text-${selectedLayer.text.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 20)}.png`;
    link.href = dataUrl;
    link.click();
    showToast("Downloaded isolated high-res text PNG");
  }, [selectedLayer, getAspect, showToast]);

  // High-Resolution Composite Mockup Generator matching Looma Apparels
  const generateCompositeMockup = useCallback(
    async (sideOverride?: StudioViewSide): Promise<string> => {
      return new Promise((resolve) => {
        try {
          const side = sideOverride || activeSide;
          const canvas = document.createElement("canvas");
          const canvasW = 903;
          const canvasH = 1024;
          canvas.width = canvasW;
          canvas.height = canvasH;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("/logo.png");
            return;
          }

          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvasW, canvasH);

          const loadImage = (src: string): Promise<HTMLImageElement | null> => {
            return new Promise((res) => {
              if (!src) return res(null);
              const img = new Image();
              img.crossOrigin = "anonymous";
              let targetSrc = src;
              if (
                (src.startsWith("http://") || src.startsWith("https://")) &&
                !src.includes("/api/proxy-image")
              ) {
                targetSrc = `/api/proxy-image?url=${encodeURIComponent(src)}`;
              }
              img.src = targetSrc;
              img.onload = () => res(img);
              img.onerror = () => {
                const fb = new Image();
                fb.src = src;
                fb.onload = () => res(fb);
                fb.onerror = () => res(null);
              };
            });
          };

          const renderAll = async () => {
            if (typeof document !== "undefined" && document.fonts) {
              try {
                await document.fonts.ready;
              } catch (e) {}
            }

            // Draw garment blank photo
            const garmentSource =
              side === "front"
                ? customBlankPhoto.front || currentColor.front
                : customBlankPhoto.back || currentColor.back;

            const garmentImg = await loadImage(garmentSource);
            if (garmentImg) {
              ctx.drawImage(garmentImg, 0, 0, canvasW, canvasH);
            } else {
              ctx.fillStyle = currentColor.hex || "#E9E8E4";
              ctx.fillRect(0, 0, canvasW, canvasH);
            }

            const scale = canvasW / 600; // 1.505
            const effectivePPI = PPI * scale; // 27.391
            const stageCenterX = canvasW / 2; // 451.5
            const stageCenterY = canvasH / 2; // 512.0

            // Draw all layers for this view side
            const sideLayers = layers.filter((l) => l.pos === side);
            for (const layer of sideLayers) {
              const centerX = stageCenterX + layer.dx * effectivePPI;
              const centerY = stageCenterY + layer.dy * effectivePPI;
              const wPx = layer.w * effectivePPI;
              const hPx = layer.w * getAspect(layer) * effectivePPI;

              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate(((layer.rot || 0) * Math.PI) / 180);
              if (layer.flip) ctx.scale(-1, 1);

              if (layer.kind === "image" && layer.src) {
                const img = await loadImage(layer.src);
                if (img) {
                  ctx.drawImage(img, -wPx / 2, -hPx / 2, wPx, hPx);
                }
              } else if (layer.kind === "text" && layer.text) {
                const fontSize = Math.round(hPx * 0.55);
                const fontFamily = layer.font || "Archivo";
                ctx.font = `${layer.bold ? "bold " : ""}${layer.italic ? "italic " : ""}${fontSize}px "${fontFamily}", sans-serif`;
                ctx.textBaseline = "middle";

                const txt =
                  layer.case === "upper"
                    ? layer.text.toUpperCase()
                    : layer.case === "lower"
                    ? layer.text.toLowerCase()
                    : layer.text;

                if (layer.curve && layer.curve !== 0) {
                  // Curved text on mockup canvas matching editor layout
                  const charLayout = getCurvedCharLayout(txt, layer.curve, wPx, hPx);
                  ctx.textAlign = "center";
                  charLayout.forEach((item) => {
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    ctx.rotate(item.rotRad);

                    if (layer.outline && layer.outline !== "none") {
                      ctx.strokeStyle = layer.outline;
                      ctx.lineWidth = Math.max(1, Math.round(fontSize * ((layer.ow || 5) / 100)));
                      ctx.strokeText(item.char, 0, 0);
                    }

                    if (!layer.hollow) {
                      if (layer.grad) {
                        const grad = ctx.createLinearGradient(0, -fontSize / 2, 0, fontSize / 2);
                        grad.addColorStop(0, layer.color || "#111111");
                        grad.addColorStop(1, layer.grad);
                        ctx.fillStyle = grad;
                      } else {
                        ctx.fillStyle = layer.color || "#111111";
                      }
                      ctx.fillText(item.char, 0, 0);
                    }
                    ctx.restore();
                  });
                } else {
                  // Straight text with exact editor alignment and letter spacing
                  let textX = 0;
                  if (layer.align === "left") {
                    textX = -wPx / 2;
                  } else if (layer.align === "right") {
                    textX = wPx / 2;
                  } else {
                    textX = 0;
                  }
                  ctx.textAlign = (layer.align || "center") as CanvasTextAlign;

                  if (typeof (ctx as any).letterSpacing !== "undefined") {
                    (ctx as any).letterSpacing = `${Math.round((layer.ls || 0) * scale)}px`;
                  }

                  if (layer.outline && layer.outline !== "none") {
                    ctx.strokeStyle = layer.outline;
                    ctx.lineWidth = Math.max(1, Math.round(fontSize * ((layer.ow || 5) / 100)));
                    ctx.strokeText(txt, textX, 0);
                  }

                  if (!layer.hollow) {
                    if (layer.grad) {
                      const grad = ctx.createLinearGradient(0, -fontSize / 2, 0, fontSize / 2);
                      grad.addColorStop(0, layer.color || "#111111");
                      grad.addColorStop(1, layer.grad);
                      ctx.fillStyle = grad;
                    } else {
                      ctx.fillStyle = layer.color || "#111111";
                    }
                    ctx.fillText(txt, textX, 0);
                  }
                }
              }
              ctx.restore();
            }

            // Watermark stamp in bottom-right corner: LOOMA APPARELS · FRONT / BACK
            ctx.save();
            ctx.font =
              '600 13px Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
            ctx.fillStyle = "rgba(11, 20, 38, 0.55)";
            ctx.textAlign = "right";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(
              `ASSON CLOTHING · ${side.toUpperCase()}`,
              canvasW - 22,
              canvasH - 22
            );
            ctx.restore();

            resolve(canvas.toDataURL("image/png"));
          };

          renderAll();
        } catch (err) {
          console.error("Mockup export failed:", err);
          resolve("/logo.png");
        }
      });
    },
    [activeSide, customBlankPhoto, currentColor, layers, getAspect]
  );

  // Hydrate design history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("asson_design_history");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setSavedDesigns(parsed);
        }
      } catch (e) {
        console.warn("Failed to load design history:", e);
      }
    }
  }, []);

  // Save current design snapshot to history
  const saveCurrentDesignToHistory = useCallback(
    async (providedMockup?: string) => {
      try {
        let preview = providedMockup;
        if (!preview) {
          preview = await generateCompositeMockup();
        }
        const item: SavedDesignItem = {
          id: `des_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toLocaleString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          productName: selectedProduct.name,
          productId: selectedProduct.id,
          colorName: currentColor.name,
          colorHex: currentColor.hex,
          previewUrl: preview || customBlankPhoto.front || currentColor.front,
          layers: JSON.parse(JSON.stringify(layers)),
          quantity,
          unitPrice,
          printLabels: placedPrints.map((p) => `${p.position}: ${p.sizeLabel || p.sizeKey}`),
        };
        setSavedDesigns((prev) => {
          const updated = [item, ...prev.filter((d) => d.id !== item.id)].slice(0, 30);
          try {
            localStorage.setItem("asson_design_history", JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        showToast("Design saved to your history");
      } catch (err) {
        console.error("Failed to save design snapshot:", err);
      }
    },
    [generateCompositeMockup, selectedProduct, currentColor, customBlankPhoto, layers, quantity, unitPrice, placedPrints, showToast]
  );

  const loadSavedDesign = (item: SavedDesignItem) => {
    const prod = REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === item.productId);
    if (prod) {
      setSelectedProduct(prod);
      const cIdx = prod.colors.findIndex((c) => c.name === item.colorName);
      if (cIdx >= 0) setSelectedColorIdx(cIdx);
    }
    if (item.layers && Array.isArray(item.layers)) {
      setLayers(item.layers);
    }
    setShowHistoryModal(false);
    showToast(`Loaded "${item.productName}" onto canvas`);
  };

  const deleteSavedDesign = (id: string) => {
    setSavedDesigns((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem("asson_design_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast("Design removed from history");
  };

  // Client-Side Mockup PNG Download
  const handleDownloadMockup = async () => {
    showToast("Rendering high-res mockup PNG...");
    const dataUrl = await generateCompositeMockup();
    const link = document.createElement("a");
    link.download = `asson-${selectedProduct.slug}-${activeSide}-mockup.png`;
    link.href = dataUrl;
    link.click();
    saveCurrentDesignToHistory(dataUrl);
    showToast("Downloaded mockup PNG & saved to history");
  };

  // Add customized apparel to CartContext
  const handleAddToCart = async () => {
    let mockupFront = frontUploadedImage || undefined;
    let mockupBack = backUploadedImage || undefined;
    try {
      const comp = await generateCompositeMockup();
      if (comp) {
        if (activeSide === "front") mockupFront = comp;
        else mockupBack = comp;
      }
    } catch (e) {
      console.warn("Could not generate composite mockup for cart:", e);
    }

    addItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSpec: selectedProduct.spec,
      color: currentColor.name,
      colorHex: currentColor.hex,
      sizes: { ...sizeBreakdown },
      quantity,
      unitPrice,
      prints: placedPrints.map((p) => ({
        position: p.position,
        sizeKey: p.sizeKey,
        sizeLabel: p.sizeLabel,
        dimensions: p.dimensions,
        cost: p.unitCost,
        isWaived: p.isWaived,
      })),
      mockupFrontUrl: mockupFront,
      mockupBackUrl: mockupBack,
    });

    if (mockupFront || mockupBack) {
      saveCurrentDesignToHistory(mockupFront || mockupBack);
    }

    setAddedToCartToast(true);
    showToast("Added design to your order list");
    setTimeout(() => setAddedToCartToast(false), 3500);
  };

  // Save product and start next style
  const handleSaveAndAddAnother = () => {
    handleAddToCart();
    setLayers([]);
    setSelectedLayerId(null);
    setSizeBreakdown({ XS: 0, S: 0, M: 1, L: 0, XL: 0, XXL: 0 });
    showToast("Product saved. Canvas ready for your next design.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Direct WhatsApp Submission with formatted parameters and NO blocking checkout form
  const handleWhatsAppSubmit = async () => {
    setIsSubmitting(true);
    showToast("Packaging design & opening WhatsApp...");

    const rawPhone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_NUMBER || "919072997950";
    const whatsappNum = rawPhone.replace(/[^0-9]/g, "");

    const charsUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charsLower = "abcdefghijklmnopqrstuvwxyz0123456789";
    let p1 = "";
    for (let i = 0; i < 4; i++) p1 += charsUpper.charAt(Math.floor(Math.random() * charsUpper.length));
    let p2 = "";
    for (let i = 0; i < 8; i++) p2 += charsLower.charAt(Math.floor(Math.random() * charsLower.length));
    const generatedDesignId = `${p1}-${p2}`;

    const appBaseUrl =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://asson-cloths.vercel.app";

    try {
      const compositeMockup = await generateCompositeMockup();
      if (compositeMockup) {
        saveCurrentDesignToHistory(compositeMockup);
      }

      let finalMockupUrl = "";
      try {
        if (compositeMockup && compositeMockup.startsWith("data:image")) {
          const blobRes = await fetch(compositeMockup);
          const blob = await blobRes.blob();
          const fd = new FormData();
          fd.append("file", blob, `mockup-${generatedDesignId}.png`);
          fd.append("type", "mockup");
          fd.append("designId", generatedDesignId);
          fd.append("side", activeSide);
          const upRes = await fetch("/api/upload", { method: "POST", body: fd });
          const upData = await upRes.json();
          if (upData.url) finalMockupUrl = upData.url;
        }
      } catch (upErr) {
        console.warn("Mockup upload endpoint notice:", upErr);
      }

      // Ensure full absolute URL for mockup
      let mockupImgUrl = "";
      if (finalMockupUrl) {
        mockupImgUrl = finalMockupUrl.startsWith("http")
          ? finalMockupUrl
          : `${appBaseUrl}${finalMockupUrl.startsWith("/") ? "" : "/"}${finalMockupUrl}`;
      } else {
        mockupImgUrl = `${appBaseUrl}/api/mockup/${generatedDesignId}.png`;
      }

      // Safely resolve artwork URL — never dump lengthy base64 in WhatsApp
      let finalArtworkUrl = "";
      const rawArtwork = frontUploadedImage || backUploadedImage;
      if (rawArtwork && rawArtwork.startsWith("data:image")) {
        try {
          const artBlobRes = await fetch(rawArtwork);
          const artBlob = await artBlobRes.blob();
          const artFd = new FormData();
          artFd.append("file", artBlob, `artwork-${generatedDesignId}.png`);
          artFd.append("type", "artwork");
          artFd.append("designId", generatedDesignId);
          artFd.append("side", activeSide);
          const artUpRes = await fetch("/api/upload", { method: "POST", body: artFd });
          const artUpData = await artUpRes.json();
          if (artUpData.url) {
            finalArtworkUrl = artUpData.url;
          }
        } catch (artErr) {
          console.warn("Artwork upload endpoint notice:", artErr);
        }
      } else if (rawArtwork && (rawArtwork.startsWith("http") || rawArtwork.startsWith("/"))) {
        finalArtworkUrl = rawArtwork;
      }

      let artworkFileUrl = "";
      if (finalArtworkUrl) {
        artworkFileUrl = finalArtworkUrl.startsWith("http")
          ? finalArtworkUrl
          : `${appBaseUrl}${finalArtworkUrl.startsWith("/") ? "" : "/"}${finalArtworkUrl}`;
      } else {
        artworkFileUrl = `${appBaseUrl}/api/mockup/art_${generatedDesignId}.png`;
      }

      // Format WhatsApp message matching Looma Apparels reference
      const activePrints = placedPrints.filter((p) => p.position !== "neck");
      let printsSection = "";
      if (activePrints.length === 0) {
        printsSection = "Prints: none (plain t-shirt)";
      } else {
        const bulletLines = activePrints.map((p) => {
          const posName = p.position.charAt(0).toUpperCase() + p.position.slice(1);
          return `• ${posName}: ${p.sizeLabel} — ${p.dimensions} — ₹${p.unitCost}/pc`;
        });
        printsSection = `Prints:\n${bulletLines.join("\n")}`;
      }

      const sizeParts = Object.entries(sizeBreakdown)
        .filter(([_, qty]) => (qty as number) > 0)
        .map(([sz, qty]) => `${sz}×${qty}`);
      const sizesFormatted = sizeParts.length > 0 ? sizeParts.join(", ") : `M×${quantity}`;

      const neckLabelFormatted = hasNeckLabel
        ? hasLargePrint && !isEmbroidery
          ? "yes (free)"
          : "yes"
        : "no";

      const tshirtSpecs = `${selectedProduct.name} ${selectedProduct.spec} — ${currentColor.name}`;

      const whatsappMessage = [
        `Hi ASSON Clothing! I designed a t-shirt on your website.`,
        ``,
        `Mockup images:`,
        `${mockupImgUrl}`,
        ``,
        `Design ID: ${generatedDesignId}`,
        `T-shirt: ${tshirtSpecs}`,
        `${printsSection}`,
        `Sizes: ${sizesFormatted} (${quantity} pcs)`,
        `Neck label: ${neckLabelFormatted}`,
        `Price: ₹${unitPrice}/pc × ${quantity} = ₹${subtotal} (+ GST)`,
        ``,
        `Total: ${quantity} pcs`,
        `Estimate: ₹${subtotal} + GST ₹${gstAmount} = ₹${total}`,
        `Shipping charges extra.`,
        ``,
        `Artwork files (print-ready):`,
        `${artworkFileUrl}`,
      ].join("\n");

      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Save to /api/designs and /api/quotes
      try {
        await fetch("/api/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            designId: generatedDesignId,
            title: `${selectedProduct.name} - ${currentColor.name}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            colorName: currentColor.name,
            colorHex: currentColor.hex,
            previewUrl: compositeMockup || mockupImgUrl,
            frontPreviewUrl: compositeMockup || mockupImgUrl,
            artworkUrl: rawArtwork || artworkFileUrl,
            printType: "DTF",
            estimatedPrice: total,
            layers,
          }),
        });

        await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: "WhatsApp Studio Guest",
            phone: whatsappNum,
            email: "guest@asson-lead.com",
            items: [
              {
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                color: currentColor.name,
                quantity,
                sizes: { ...sizeBreakdown },
                printType: isEmbroidery ? "Embroidery" : "DTF",
                unitPrice,
                totalPrice: total,
              },
            ],
            subtotal,
            gst: gstAmount,
            total,
            notes: "Direct WhatsApp submission from Looma Design Studio",
          }),
        });
      } catch (saveErr) {
        console.warn("Background API save warning:", saveErr);
      }

      setSubmittedSuccess(true);
      setLastWhatsAppUrl(whatsappUrl);

      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("WhatsApp submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset design studio to pristine initial state
  const handleResetDesign = () => {
    if (window.confirm("Clear this design and start again?")) {
      setLayers([]);
      setSelectedLayerId(null);
      setManualStitches({ front: 71000, back: 2000 });
      setSizeBreakdown({ XS: 0, S: 0, M: 1, L: 0, XL: 0, XXL: 0 });
      setCustomBlankPhoto({ front: null, back: null });
      setSubmittedSuccess(false);
      showToast("Design studio reset to initial state");
    }
  };

  // Drag interaction handlers
  const dragStartRef = useRef<{ startX: number; startY: number; initDx: number; initDy: number }>({
    startX: 0,
    startY: 0,
    initDx: 0,
    initDy: 0,
  });

  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    initW: number;
    centerX: number;
    centerY: number;
    initialDist: number;
  }>({
    startX: 0,
    startY: 0,
    initW: 8.0,
    centerX: 0,
    centerY: 0,
    initialDist: 100,
  });

  const rotateStartRef = useRef<{
    centerX: number;
    centerY: number;
    initRot: number;
    startAngle: number;
  }>({
    centerX: 0,
    centerY: 0,
    initRot: 0,
    startAngle: 0,
  });

  const handlePointerDownLayer = (e: React.PointerEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    setIsDragging(true);
    setIsResizing(false);
    setIsRotating(false);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initDx: layer.dx,
      initDy: layer.dy,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerDownResize = (e: React.PointerEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    setIsResizing(true);
    setIsDragging(false);
    setIsRotating(false);

    const rect = stageRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 + layer.dx * PPI : e.clientX;
    const cy = rect ? rect.top + rect.height / 2 + layer.dy * PPI : e.clientY;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy) || 100;

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initW: layer.w,
      centerX: cx,
      centerY: cy,
      initialDist: dist,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerDownRotate = (e: React.PointerEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    setIsRotating(true);
    setIsDragging(false);
    setIsResizing(false);

    const rect = stageRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 + layer.dx * PPI : e.clientX;
    const cy = rect ? rect.top + rect.height / 2 + layer.dy * PPI : e.clientY;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);

    rotateStartRef.current = {
      centerX: cx,
      centerY: cy,
      initRot: layer.rot || 0,
      startAngle: angle,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (!selectedLayer) return;

    if (isDragging) {
      const deltaX = (e.clientX - dragStartRef.current.startX) / PPI;
      const deltaY = (e.clientY - dragStartRef.current.startY) / PPI;
      let newDx = +(dragStartRef.current.initDx + deltaX).toFixed(2);
      let newDy = +(dragStartRef.current.initDy + deltaY).toFixed(2);

      // Snap to center horizontal guide line
      if (Math.abs(newDx) < 0.2) newDx = 0;

      updateSelectedLayer({ dx: newDx, dy: newDy });
      return;
    }

    if (isResizing) {
      const { centerX, centerY, initialDist, initW } = resizeStartRef.current;
      const currentDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const ratio = currentDist / initialDist;
      let newW = Math.max(1.0, Math.min(22.0, +(initW * ratio).toFixed(1)));
      if (isEmbroidery && newW > 10.0) newW = 10.0;
      updateSelectedLayer({ w: newW });
      return;
    }

    if (isRotating) {
      const { centerX, centerY, initRot, startAngle } = rotateStartRef.current;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.round(initRot + ((currentAngle - startAngle) * 180) / Math.PI);
      deg = ((deg + 540) % 360) - 180;
      // Snap near angles
      if (Math.abs(deg) < 3) deg = 0;
      if (Math.abs(deg - 90) < 3) deg = 90;
      if (Math.abs(deg + 90) < 3) deg = -90;
      updateSelectedLayer({ rot: deg });
    }
  };

  const handleStagePointerUp = () => {
    if (isDragging || isResizing || isRotating) {
      commitSnapshot();
    }
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const activeSideCount = layers.filter((l) => l.pos === activeSide).length;
  const frontCount = layers.filter((l) => l.pos === "front").length;
  const backCount = layers.filter((l) => l.pos === "back").length;

  const renderStep3Adjust = (isPrimaryBelowCanvas: boolean = false) => {
    if (!selectedLayer) {
      if (!isPrimaryBelowCanvas) return null;
      const sideLayers = layers.filter((l) => l.pos === activeSide);
      if (sideLayers.length === 0) return null;

      return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
                3
              </span>
              Adjust Studio
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {sideLayers.length} placed on {activeSide}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Tap any element on the t-shirt to adjust size, font, curves, or remove background:
          </p>
          <div className="flex flex-wrap gap-2">
            {sideLayers.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedLayerId(l.id)}
                className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-slate-900 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                {l.kind === "text" ? (
                  <Type className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>
                  {l.kind === "text" ? `"${l.text || "YOUR TEXT"}"` : l.name || "Image"}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (selectedLayer.kind === "text") {
      return (
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-500 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
                3
              </span>
              Adjust &ldquo;{selectedLayer.text || "YOUR TEXT"}&rdquo;
            </h2>
            <button
              type="button"
              onClick={() => handleRemoveLayer(selectedLayer.id)}
              className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            rows={2}
            value={selectedLayer.text || ""}
            onChange={(e) => updateSelectedLayer({ text: e.target.value })}
            placeholder="YOUR TEXT"
            className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 resize-none"
          />

          {/* Font Family Dropdown with Typeface Previews & Custom Branded Colors */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 block">Font Family</label>
              <span className="text-[10px] text-slate-400 font-medium">26 Iconic Apparel Fonts</span>
            </div>

            {/* Custom styled select button */}
            <button
              type="button"
              onClick={() => setIsFontMenuOpen((prev) => !prev)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-left bg-slate-50 hover:bg-slate-100/80 transition flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20 shadow-sm"
                  style={{
                    backgroundColor:
                      FONTS.find((f) => f.name === (selectedLayer.font || "Archivo"))?.color || "#1E293B",
                  }}
                />
                <span
                  style={{
                    fontFamily:
                      FONTS.find((f) => f.name === (selectedLayer.font || "Archivo"))?.family ||
                      "Archivo, sans-serif",
                    color:
                      FONTS.find((f) => f.name === (selectedLayer.font || "Archivo"))?.color || "#1E293B",
                  }}
                  className="text-sm font-bold truncate"
                >
                  {selectedLayer.font || "Archivo"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 shrink-0">
                  {FONTS.find((f) => f.name === (selectedLayer.font || "Archivo"))?.category || "Streetwear"}
                </span>
              </div>
              <span className="text-slate-400 text-xs ml-2">▼</span>
            </button>

            {/* Native select kept in DOM for accessibility & test runner AST compatibility */}
            <select
              value={selectedLayer.font || "Archivo"}
              onChange={(e) => updateSelectedLayer({ font: e.target.value })}
              className="sr-only"
              tabIndex={-1}
              aria-label="Font Family Select"
            >
              {FONTS.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: f.family, color: f.color }}>
                  {f.name} ({f.category})
                </option>
              ))}
            </select>

            {/* Dropdown Options Popup */}
            {isFontMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFontMenuOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl max-h-72 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-100">
                  {FONTS.map((f) => {
                    const isSelected = (selectedLayer.font || "Archivo") === f.name;
                    return (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => {
                          updateSelectedLayer({ font: f.name });
                          setIsFontMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition ${
                          isSelected
                            ? "bg-slate-900 text-white"
                            : "hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: f.color }}
                          />
                          <span
                            style={{
                              fontFamily: f.family,
                              color: isSelected ? "#FFFFFF" : f.color,
                            }}
                            className="text-base font-bold truncate leading-none"
                          >
                            {f.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                              isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {f.category}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Formatting & Alignment & Casing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateSelectedLayer({ bold: !selectedLayer.bold })}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black transition ${
                  selectedLayer.bold
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => updateSelectedLayer({ italic: !selectedLayer.italic })}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black transition ${
                  selectedLayer.italic
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="flex border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => updateSelectedLayer({ align: "left" })}
                  className={`p-2 transition ${
                    selectedLayer.align === "left" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedLayer({ align: "center" })}
                  className={`p-2 transition ${
                    selectedLayer.align === "center" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedLayer({ align: "right" })}
                  className={`p-2 transition ${
                    selectedLayer.align === "right" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <select
                value={selectedLayer.case || "none"}
                onChange={(e) => updateSelectedLayer({ case: e.target.value as any })}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="none">As typed</option>
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
              </select>
            </div>
          </div>

          {/* 7 Quick Styles */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">Quick Styles</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_STYLES.map((qs) => (
                <button
                  key={qs.name}
                  type="button"
                  onClick={() => {
                    updateSelectedLayer(qs.style);
                    commitSnapshot();
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-100 text-slate-800 text-[11px] font-bold transition"
                >
                  {qs.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Color Swatches & Gradient Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Text Colour</span>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedLayer.grad}
                  onChange={(e) =>
                    updateSelectedLayer({
                      grad: e.target.checked ? "#e8542b" : "",
                    })
                  }
                  className="rounded text-amber-500"
                />
                <span>Gradient (top → bottom)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {TEXT_COLOURS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => updateSelectedLayer({ color: col })}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-full border border-black/20 transition ${
                    selectedLayer.color === col ? "ring-2 ring-slate-900 scale-110" : "hover:scale-105"
                  }`}
                />
              ))}
              <input
                type="color"
                value={selectedLayer.color || "#111111"}
                onChange={(e) => updateSelectedLayer({ color: e.target.value })}
                className="w-7 h-7 p-0.5 rounded-full border border-slate-300 cursor-pointer"
                title="Pick custom color"
              />
            </div>
          </div>

          {/* Outline Swatches & Hollow Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Outline</span>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedLayer.hollow}
                  onChange={(e) =>
                    updateSelectedLayer({
                      hollow: e.target.checked,
                      outline: e.target.checked && selectedLayer.outline === "none" ? "#111111" : selectedLayer.outline,
                    })
                  }
                  className="rounded text-amber-500"
                />
                <span>Outline only (hollow letters)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                type="button"
                onClick={() => updateSelectedLayer({ outline: "none" })}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] text-red-500 font-black ${
                  selectedLayer.outline === "none" ? "ring-2 ring-slate-900 scale-110" : "border-slate-300"
                }`}
                title="None"
              >
                ✕
              </button>
              {TEXT_COLOURS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => updateSelectedLayer({ outline: col })}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-full border border-black/20 transition ${
                    selectedLayer.outline === col ? "ring-2 ring-slate-900 scale-110" : "hover:scale-105"
                  }`}
                />
              ))}
              <input
                type="color"
                value={selectedLayer.outline && selectedLayer.outline !== "none" ? selectedLayer.outline : "#ffffff"}
                onChange={(e) => updateSelectedLayer({ outline: e.target.value })}
                className="w-7 h-7 p-0.5 rounded-full border border-slate-300 cursor-pointer"
                title="Pick custom outline color"
              />
            </div>
          </div>

          {/* Curve / Arc Slider */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-bold">Curve</span>
              <span className="font-mono text-amber-600 font-bold">
                {selectedLayer.curve === 0 || !selectedLayer.curve
                  ? "Straight"
                  : selectedLayer.curve > 0
                  ? `Arch ${selectedLayer.curve}°`
                  : `Smile ${Math.abs(selectedLayer.curve)}°`}
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={selectedLayer.curve || 0}
              onChange={(e) => updateSelectedLayer({ curve: parseInt(e.target.value) || 0 })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Letter Spacing Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-bold">Letter spacing</span>
              <span className="font-mono text-slate-700 font-bold">{selectedLayer.ls || 0}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="30"
              step="1"
              value={selectedLayer.ls || 0}
              onChange={(e) => updateSelectedLayer({ ls: parseInt(e.target.value) || 0 })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Download Isolated Text as PNG */}
          <button
            type="button"
            onClick={handleDownloadTextPng}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download text as PNG · high resolution</span>
          </button>

          {/* Placement Presets */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block">Placement Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {(PRESETS[activeSide] || PRESETS.front).map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() => handleApplyPreset(pr)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition"
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Slider with Real Inch Readout */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-bold">Size</span>
              <span className="font-mono text-amber-600 font-bold">
                {inch(selectedLayer.w)} × {inch(selectedLayer.w * getAspect(selectedLayer))} in
              </span>
            </div>
            <input
              type="range"
              min="2"
              max={isEmbroidery ? 10 : 20}
              step="0.2"
              value={selectedLayer.w}
              onChange={(e) => updateSelectedLayer({ w: parseFloat(e.target.value) || 8 })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rotate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-bold">Rotate</span>
              <span className="font-mono text-slate-700 font-bold">{selectedLayer.rot || 0}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={selectedLayer.rot || 0}
              onChange={(e) => updateSelectedLayer({ rot: parseInt(e.target.value) || 0 })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      );
    }

    // Image studio
    return (
      <div className="bg-white p-5 rounded-3xl border-2 border-amber-500 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
              3
            </span>
            Adjust {selectedLayer.name || "image"}
          </h2>
          <button
            type="button"
            onClick={() => handleRemoveLayer(selectedLayer.id)}
            className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Placement Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 block">Placement Presets</span>
          <div className="flex flex-wrap gap-1.5">
            {(PRESETS[activeSide] || PRESETS.front).map((pr) => (
              <button
                key={pr.label}
                type="button"
                onClick={() => handleApplyPreset(pr)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Slider with Real Inch Readout */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-700">
            <span className="font-bold">Size</span>
            <span className="font-mono text-amber-600 font-bold">
              {inch(selectedLayer.w)} × {inch(selectedLayer.w * getAspect(selectedLayer))} in
            </span>
          </div>
          <input
            type="range"
            min="2"
            max={isEmbroidery ? 10 : 20}
            step="0.2"
            value={selectedLayer.w}
            onChange={(e) => updateSelectedLayer({ w: parseFloat(e.target.value) || 8 })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Rotate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-700">
            <span className="font-bold">Rotate</span>
            <span className="font-mono text-slate-700 font-bold">{selectedLayer.rot || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={selectedLayer.rot || 0}
            onChange={(e) => updateSelectedLayer({ rot: parseInt(e.target.value) || 0 })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleQuickAction("centre")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Centre
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("flip")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Flip
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("fit")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Fit area
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("duplicate")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("copyToBack")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Copy to {activeSide === "front" ? "back" : "front"}
          </button>
        </div>

        {/* Background Removal Tool Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Remove background</span>
            <small className="text-[10px] text-slate-500">Tap a colour to remove it</small>
          </div>

          {/* Checkered Canvas Preview */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-[repeating-conic-gradient(#e6e6e6_0%_25%,#ffffff_0%_50%)_50%/16px_16px] flex items-center justify-center cursor-crosshair">
            <img
              src={selectedLayer.src}
              alt="Preview"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const canvas = document.createElement("canvas");
                canvas.width = rect.width;
                canvas.height = rect.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(e.currentTarget, 0, 0, rect.width, rect.height);
                  const pixel = ctx.getImageData(x, y, 1, 1).data;
                  const hex = rgbHex(pixel[0], pixel[1], pixel[2]);
                  const nextKeys = [...bgKeys, hex];
                  setBgKeys(nextKeys);
                  applyBgRemoval(nextKeys, bgTol, bgEdge);
                }
              }}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Status & Key tags */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {bgKeys.length === 0 ? (
              <span className="text-[11px] text-slate-500">No colours removed yet.</span>
            ) : (
              bgKeys.map((k, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-300 bg-white text-[10px] font-mono font-bold"
                >
                  <span style={{ backgroundColor: k }} className="w-2.5 h-2.5 rounded-full border border-black/20" />
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = bgKeys.filter((_, i) => i !== idx);
                      setBgKeys(next);
                      applyBgRemoval(next, bgTol, bgEdge);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Presets Row */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const next = [...bgKeys, "#ffffff"];
                setBgKeys(next);
                applyBgRemoval(next, bgTol, bgEdge);
              }}
              className="flex-1 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
            >
              + White
            </button>
            <button
              type="button"
              onClick={() => {
                const next = [...bgKeys, "#000000"];
                setBgKeys(next);
                applyBgRemoval(next, bgTol, bgEdge);
              }}
              className="flex-1 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
            >
              + Black
            </button>
            <button
              type="button"
              onClick={() => {
                setBgKeys([]);
                applyBgRemoval([], bgTol, bgEdge);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
            >
              Undo all
            </button>
          </div>

          {/* Strength Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">Strength</span>
              <span className="font-mono font-bold">{bgTol}</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={bgTol}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 14;
                setBgTol(val);
                applyBgRemoval(bgKeys, val, bgEdge);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Only background checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={bgEdge}
              onChange={(e) => {
                setBgEdge(e.target.checked);
                applyBgRemoval(bgKeys, bgTol, e.target.checked);
              }}
              className="rounded text-amber-500"
            />
            <span>Only the background (keeps the same colour inside your design)</span>
          </label>
        </div>

        {/* Low-Resolution DPI Warning Banner */}
        {(() => {
          const dpi = Math.round((selectedLayer.nativeW || 1200) / selectedLayer.w);
          if (dpi < 150) {
            return (
              <div className="p-3 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>
                  Low resolution ({dpi} DPI) — this may print blurry. Please upload a bigger file.
                </span>
              </div>
            );
          }
          return (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Print quality: great ({dpi} DPI)</span>
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Google Web Fonts preloader */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Anton&family=Archivo:wght@400;600;700;900&family=Audiowide&family=Bangers&family=Bebas+Neue&family=Black+Ops+One&family=Bungee&family=Cinzel:wght@600;900&family=Creepster&family=Faster+One&family=Great+Vibes&family=Lobster&family=Monoton&family=Montserrat:wght@400;700;900&family=Orbitron:wght@600;900&family=Oswald:wght@500;700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,600;0,900;1,600&family=Press+Start+2P&family=Righteous&family=Ruslan+Display&family=Rye&family=UnifrakturMaguntia&display=swap"
      />

      {/* Floating Alert / Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Interactive Canvas + Toolbar + Thumbnails */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dual-Side View Tabs with Dynamic Element Badges */}
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveSide("front");
                  setSelectedLayerId(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  activeSide === "front"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/50"
                }`}
              >
                <span>Front</span>
                {frontCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    {frontCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSide("back");
                  setSelectedLayerId(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  activeSide === "back"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/50"
                }`}
              >
                <span>Back</span>
                {backCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    {backCount}
                  </span>
                )}
              </button>
            </div>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {activeSide.toUpperCase()} VIEW · {activeBBox.w > 0 ? `${inch(activeBBox.w)} × ${inch(activeBBox.h)} in` : "EMPTY"}
            </span>
          </div>

          {/* Canvas Box */}
          <div
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handleStagePointerUp}
            onPointerCancel={handleStagePointerUp}
            onClick={() => setSelectedLayerId(null)}
            className="bg-[#e9e8e4] border border-slate-300 rounded-3xl overflow-hidden aspect-[600/680] relative shadow-inner flex items-center justify-center select-none"
          >
            {/* Base Garment Photo */}
            <img
              src={activeGarmentPhoto}
              alt="Custom Blank Garment Silhouette"
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Print Placement Zone Boundary */}
            {showGuides && (
              <div
                className="absolute border-2 border-dashed border-amber-500/80 rounded-lg pointer-events-none flex flex-col items-center justify-center"
                style={{
                  left: `${((currentZone[0] - currentZone[2] / 2) / 600) * 100}%`,
                  top: `${((currentZone[1] - currentZone[3] / 2) / 680) * 100}%`,
                  width: `${(currentZone[2] / 600) * 100}%`,
                  height: `${(currentZone[3] / 680) * 100}%`,
                  transform: `rotate(${currentZone[4]}deg)`,
                }}
              >
                <span className="absolute top-1 text-[9px] font-bold text-amber-500 bg-black/70 px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                  {activeSide.toUpperCase()} PRINT ZONE ({activeBBox.w > 0 ? `${inch(activeBBox.w)} × ${inch(activeBBox.h)} in` : "PRINT AREA"})
                </span>
              </div>
            )}

            {/* Empty Canvas Prompt */}
            {activeSideCount === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Canvas is empty</p>
                <p className="text-[11px] text-slate-500">Upload artwork or add text from the panel to start</p>
              </div>
            )}

            {/* Placed Layers on Canvas */}
            {layers
              .filter((l) => l.pos === activeSide)
              .map((layer) => {
                const isSelected = layer.id === selectedLayerId;
                const aspect = getAspect(layer);
                const wPx = layer.w * PPI;
                const hPx = layer.w * aspect * PPI;

                return (
                  <div
                    key={layer.id}
                    onPointerDown={(e) => handlePointerDownLayer(e, layer)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLayerId(layer.id);
                    }}
                    style={{
                      position: "absolute",
                      width: `${wPx}px`,
                      height: `${hPx}px`,
                      left: `calc(50% + ${layer.dx * PPI}px - ${wPx / 2}px)`,
                      top: `calc(50% + ${layer.dy * PPI}px - ${hPx / 2}px)`,
                      transform: `rotate(${layer.rot || 0}deg)`,
                      cursor: isDragging && isSelected ? "grabbing" : "grab",
                    }}
                    className={`group select-none touch-none ${
                      isSelected ? "z-30" : "z-10 hover:z-20"
                    }`}
                  >
                    {/* Layer Content */}
                    <div
                      style={{
                        transform: layer.flip ? "scaleX(-1)" : "none",
                        width: "100%",
                        height: "100%",
                      }}
                      className="relative w-full h-full flex items-center justify-center pointer-events-none"
                    >
                      {layer.kind === "image" && layer.src && (
                        <img
                          src={layer.src}
                          alt={layer.name || "Custom Artwork"}
                          className="w-full h-full object-contain filter drop-shadow-md pointer-events-none select-none"
                          draggable={false}
                        />
                      )}

                      {layer.kind === "text" && (
                        layer.curve && layer.curve !== 0 ? (
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              overflow: "visible",
                            }}
                            className="select-none font-sans"
                          >
                            {getCurvedCharLayout(
                              layer.case === "upper"
                                ? (layer.text || "YOUR TEXT").toUpperCase()
                                : layer.case === "lower"
                                ? (layer.text || "YOUR TEXT").toLowerCase()
                                : layer.text || "YOUR TEXT",
                              layer.curve,
                              wPx,
                              hPx
                            ).map((item, idx) => (
                              <span
                                key={idx}
                                style={{
                                  position: "absolute",
                                  left: `calc(50% + ${item.x}px)`,
                                  top: `calc(50% + ${item.y}px)`,
                                  transform: `translate(-50%, -50%) rotate(${item.rotDeg}deg)`,
                                  fontFamily: `"${layer.font || "Archivo"}", sans-serif`,
                                  fontSize: `${Math.round(hPx * 0.55)}px`,
                                  fontWeight: layer.bold ? "bold" : "normal",
                                  fontStyle: layer.italic ? "italic" : "normal",
                                  color: layer.hollow ? "transparent" : layer.color || "#111111",
                                  WebkitTextStroke:
                                    layer.outline && layer.outline !== "none"
                                      ? `${Math.max(1, Math.round(hPx * ((layer.ow || 5) / 100)))}px ${layer.outline}`
                                      : undefined,
                                  whiteSpace: "pre",
                                  display: "inline-block",
                                  userSelect: "none",
                                }}
                              >
                                {item.char}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                layer.align === "left"
                                  ? "flex-start"
                                  : layer.align === "right"
                                  ? "flex-end"
                                  : "center",
                              fontFamily: `"${layer.font || "Archivo"}", sans-serif`,
                              fontSize: `${Math.round(hPx * 0.55)}px`,
                              fontWeight: layer.bold ? "bold" : "normal",
                              fontStyle: layer.italic ? "italic" : "normal",
                              letterSpacing: `${layer.ls || 0}px`,
                              color: layer.hollow
                                ? "transparent"
                                : layer.grad
                                ? "transparent"
                                : layer.color || "#111111",
                              backgroundImage: layer.grad
                                ? `linear-gradient(to bottom, ${layer.color || "#111111"}, ${layer.grad})`
                                : undefined,
                              WebkitBackgroundClip: layer.grad ? "text" : undefined,
                              WebkitTextStroke:
                                layer.outline && layer.outline !== "none"
                                  ? `${Math.max(1, Math.round(hPx * ((layer.ow || 5) / 100)))}px ${layer.outline}`
                                  : undefined,
                              textAlign: layer.align || "center",
                              whiteSpace: "pre-line",
                              lineHeight: 1.15,
                            }}
                            className="select-none drop-shadow-sm font-sans"
                          >
                            {layer.case === "upper"
                              ? (layer.text || "YOUR TEXT").toUpperCase()
                              : layer.case === "lower"
                              ? (layer.text || "YOUR TEXT").toLowerCase()
                              : layer.text || "YOUR TEXT"}
                          </div>
                        )
                      )}
                    </div>

                    {/* Active Element Orange Bounding Box & Handles */}
                    {isSelected && (
                      <>
                        <div className="absolute -inset-1.5 border-2 border-[#e8542b] rounded pointer-events-none" />

                        {/* 4 Corner Resize Handles */}
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, layer)}
                          title="Drag to resize"
                          className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-[#e8542b] rounded-full shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40 pointer-events-auto"
                        />
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, layer)}
                          title="Drag to resize"
                          className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-[#e8542b] rounded-full shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40 pointer-events-auto"
                        />
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, layer)}
                          title="Drag to resize"
                          className="absolute -bottom-3 -left-3 w-6 h-6 bg-white border-2 border-[#e8542b] rounded-full shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40 pointer-events-auto"
                        />
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, layer)}
                          title="Drag to resize"
                          className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-[#e8542b] rounded-full shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40 pointer-events-auto"
                        />

                        {/* Top Rotation Handle & Stem */}
                        <div className="absolute left-1/2 -top-7 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                          <div
                            onPointerDown={(e) => handlePointerDownRotate(e, layer)}
                            title="Drag to rotate"
                            className="w-5 h-5 bg-[#e8542b] border-2 border-white rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                          />
                          <div className="w-0.5 h-3 bg-[#e8542b]" />
                        </div>

                        {/* Floating Action Buttons directly underneath element */}
                        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 flex items-center gap-1.5 z-40 pointer-events-auto">
                          {layer.kind === "image" && (
                            <label
                              title="Replace image"
                              className="px-2.5 py-1 bg-[#0F172A] hover:bg-slate-800 text-white rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1 cursor-pointer transition whitespace-nowrap"
                            >
                              <RefreshCw className="w-3 h-3 text-amber-400" />
                              <span>Replace</span>
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const res = ev.target?.result;
                                    if (res) {
                                      updateSelectedLayer({
                                        src: res as string,
                                        rawSrc: res as string,
                                        bg: null,
                                        name: file.name,
                                      });
                                      showToast("Image replaced");
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveLayer(layer.id)}
                            title="Delete element"
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1 transition whitespace-nowrap"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Canvas Bottom Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                title="Undo (Ctrl+Z)"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRedo}
                disabled={future.length === 0}
                title="Redo (Ctrl+Y)"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 select-none">
                <input
                  type="checkbox"
                  checked={showGuides}
                  onChange={(e) => setShowGuides(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Print area</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                title="View your saved design history with mockup images"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-amber-600" />
                <span>Design history</span>
                {savedDesigns.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {savedDesigns.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadMockup}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download mockup</span>
              </button>
            </div>
          </div>

          {/* STEP 3 (ADJUST STUDIO): Displayed immediately after the view of selected t-shirt */}
          {renderStep3Adjust(true)}

          {/* Dual View Thumbnails below canvas */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveSide("front");
                setSelectedLayerId(null);
              }}
              className={`p-2 rounded-2xl border bg-white flex items-center gap-3 transition text-left ${
                activeSide === "front"
                  ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-14 h-16 rounded-xl bg-[#e9e8e4] overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                <img
                  src={customBlankPhoto.front || currentColor.front}
                  alt="Front View Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Front View</span>
                <span className="text-[11px] text-slate-500">
                  {frontCount > 0 ? `${frontCount} element${frontCount > 1 ? "s" : ""}` : "No artwork"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSide("back");
                setSelectedLayerId(null);
              }}
              className={`p-2 rounded-2xl border bg-white flex items-center gap-3 transition text-left ${
                activeSide === "back"
                  ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-14 h-16 rounded-xl bg-[#e9e8e4] overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                <img
                  src={customBlankPhoto.back || currentColor.back}
                  alt="Back View Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Back View</span>
                <span className="text-[11px] text-slate-500">
                  {backCount > 0 ? `${backCount} element${backCount > 1 ? "s" : ""}` : "No artwork"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Multi-Step Configuration Workflow Accordions */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* STEP 1: Choose your t-shirt */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                  1
                </span>
                Choose your t-shirt
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => productScrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => productScrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrolling Silhouette Cards */}
            <div
              ref={productScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300"
            >
              {REVERSE_ENGINEERED_PRODUCTS.map((prod) => {
                const isSelected = prod.id === selectedProduct.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setSelectedColorIdx(0);
                      commitSnapshot();
                    }}
                    className={`shrink-0 w-44 p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="w-full aspect-square bg-[#e9e8e4] rounded-xl overflow-hidden mb-2">
                      <img
                        src={prod.colours[0]?.front || prod.colors?.[0]?.front}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-slate-900 line-clamp-1 block">
                        {prod.name}
                      </strong>
                      <small className="text-[10px] text-slate-500 block">{prod.spec}</small>
                      <em className="text-xs font-black text-amber-600 not-italic block mt-1">
                        from ₹{prod.basePrice}
                      </em>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Flowing Capsule Swatches */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Colour: <strong className="text-slate-900">{currentColor.name}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colours.map((col, idx) => {
                  const isSelected = selectedColorIdx === idx;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => {
                        setSelectedColorIdx(idx);
                        commitSnapshot();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 hover:border-slate-400 text-slate-800 bg-white"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: col.hex }}
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Add your design */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                2
              </span>
              Add your design
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 flex flex-col items-center justify-center">
                <Upload className="w-5 h-5 text-slate-600 mb-1" />
                <span className="text-xs font-bold text-slate-800 block">
                  {isUploading ? "Uploading..." : "Upload Image"}
                </span>
                <span className="text-[10px] text-slate-500">PNG, JPG, SVG, PDF</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml, application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              <button
                type="button"
                onClick={handleAddText}
                className="border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-4 text-center transition bg-slate-50 flex flex-col items-center justify-center"
              >
                <Type className="w-5 h-5 text-slate-600 mb-1" />
                <span className="text-xs font-bold text-slate-800 block">+ Add Text</span>
                <span className="text-[10px] text-slate-500">Curved & styled</span>
              </button>
            </div>

            {/* Clear active side artwork */}
            {activeSideCount > 0 && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  {activeSideCount} item{activeSideCount > 1 ? "s" : ""} on {activeSide} view
                </span>
                <button
                  type="button"
                  onClick={handleClearArt}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear {activeSide} artwork</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 3 (ADJUST STUDIO): Secondary Right Column Access */}
          {renderStep3Adjust(false)}

          {/* STEP 4: Print type & quantity */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                4
              </span>
              Print type & quantity
            </h2>

            {/* Position Header & Dimensions */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 capitalize">{activeSide}</span>
              <span className="font-mono text-slate-600">
                {activeBBox.w > 0 ? `${inch(activeBBox.w)} × ${inch(activeBBox.h)} in` : '0.0" × 0.0"'}
              </span>
            </div>

            {/* Print Technique: DTF Print Only */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">
                  DTF
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Direct to Film (DTF) Print</span>
                  <span className="text-[11px] text-slate-400">High-definition vibrant apparel print</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Sizes Breakdown Steppers (XS-XXL) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Sizes {quantity} pcs</span>
                <span className="text-[11px] text-slate-500">Sample or bulk distribution</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SIZES.map((sz) => {
                  const val = sizeBreakdown[sz] ?? 0;
                  return (
                    <div
                      key={sz}
                      className={`p-2 rounded-xl border text-center transition ${
                        val > 0
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 block mb-1">{sz}</span>
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSizeBreakdown((prev) => ({
                              ...prev,
                              [sz]: Math.max(0, (prev[sz] || 0) - 1),
                            }));
                            commitSnapshot();
                          }}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={val || ""}
                          placeholder="0"
                          onChange={(e) => {
                            const n = Math.max(0, parseInt(e.target.value) || 0);
                            setSizeBreakdown((prev) => ({ ...prev, [sz]: n }));
                            commitSnapshot();
                          }}
                          className="w-8 text-center text-xs font-black text-slate-900 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSizeBreakdown((prev) => ({
                              ...prev,
                              [sz]: (prev[sz] || 0) + 1,
                            }));
                            commitSnapshot();
                          }}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Volume Tier Incentive Banner */}
            {volumeHint && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="space-y-0.5">
                  <div className="text-slate-800">
                    Add <b>{volumeHint.add} more</b> ({volumeHint.nextQ} pcs) and pay <b>₹{volumeHint.nextPer}/pc</b> instead of ₹{unitPrice} — you save ₹{volumeHint.savings} on every piece.
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Best price: ₹{volumeHint.bestPer}/pc from 100 pcs.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSizeBreakdown((prev) => ({
                      ...prev,
                      M: (prev.M || 0) + volumeHint.add,
                    }));
                    commitSnapshot();
                    showToast(`Added ${volumeHint.add} × M pieces to unlock volume savings!`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow transition"
                >
                  +{volumeHint.add} pcs
                </button>
              </div>
            )}

            {/* Brand Neck Label Add-on Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasNeckLabel}
                  onChange={(e) => {
                    setHasNeckLabel(e.target.checked);
                    commitSnapshot();
                  }}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="flex-1">
                  Add my brand neck label{" "}
                  {hasLargePrint && !isEmbroidery ? (
                    <span className="font-bold text-emerald-600">(free with an A2/A3/A4 print)</span>
                  ) : (
                    <span className="text-slate-500">(+₹15/pc)</span>
                  )}
                </span>
              </label>
            </div>

            {/* Save & Add Another Product */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                className="w-full py-2.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition bg-slate-50"
              >
                <Plus className="w-4 h-4" />
                <span>+ Save & add another product</span>
              </button>
              <small className="text-[10px] text-slate-400 block text-center mt-1">
                Ordering more than one style? Save this product, then design the next one.
              </small>
            </div>
          </div>

          {/* STEP 5: Itemized Quote & Direct WhatsApp Action */}
          <div className="bg-[#0F172A] text-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-800">
            <h2 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
                5
              </span>
              Your quote
            </h2>

            {/* Itemized Lines */}
            <div className="space-y-2 text-xs border-b border-slate-800 pb-3">
              {/* Garment line */}
              <div className="flex justify-between items-center text-slate-300">
                <span>
                  {selectedProduct.name} {selectedProduct.spec} · {currentColor.name}
                </span>
                <span className="font-mono font-bold text-white">₹{baseGarmentPrice}</span>
              </div>

              {/* Decoration prints */}
              {placedPrints
                .filter((p) => p.position !== "neck")
                .map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300">
                    <div>
                      <span className="block">{p.sizeLabel}</span>
                      <small className="text-[10px] text-slate-400 block">{p.dimensions}</small>
                    </div>
                    <span className="font-mono font-bold text-amber-400">+₹{p.unitCost}</span>
                  </div>
                ))}

              {/* Neck label line */}
              {hasNeckLabel && (
                <div className="flex justify-between items-center text-slate-300">
                  <div>
                    <span className="block">Neck label (your brand)</span>
                    <small className="text-[10px] text-slate-400 block">
                      {hasLargePrint && !isEmbroidery
                        ? "Free with an A2/A3/A4 print"
                        : "+₹15 / pc standard branding"}
                    </small>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    {hasLargePrint && !isEmbroidery ? "FREE" : "+₹15"}
                  </span>
                </div>
              )}
            </div>

            {/* Per Piece & Subtotal */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Per piece</span>
                <span className="font-mono font-bold text-white">₹{unitPrice}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({quantity} pc{quantity > 1 ? "s" : ""})</span>
                <span className="font-mono font-bold text-white">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>GST (5%)</span>
                <span className="font-mono font-bold text-white">₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200">Estimated total</span>
                <span className="text-2xl font-black text-amber-400">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Shipping notice */}
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>🚚</span>
              <span>Shipping charges extra, as per actual weight & location.</span>
            </p>

            {/* Primary Action Button: Send design on WhatsApp without intermediate checkout form */}
            <button
              type="button"
              onClick={handleWhatsAppSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? "Opening WhatsApp..." : "Send design on WhatsApp"}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              Your WhatsApp opens a chat with {WHATSAPP_NUMBER || "+91 90729 97950"} with all your details; then send your mockup images to the same chat in one tap.
            </p>

            {/* Reset link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResetDesign}
                className="text-xs text-slate-400 hover:text-white underline transition"
              >
                Start a new design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Design History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    My Design History
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                      {savedDesigns.length} saved
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Browse and reload previously customized garments with designed preview images
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {savedDesigns.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Shirt className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No Saved Designs Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Designs are automatically saved here when you download mockups, add items to your quote list, or share on WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => saveCurrentDesignToHistory()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" /> Save Current Canvas Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedDesigns.map((d) => (
                    <div
                      key={d.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 transition shadow-sm space-y-3"
                    >
                      {/* Mockup Preview Image */}
                      <div className="aspect-[600/680] w-full rounded-xl bg-[#e9e8e4] overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                        <img
                          src={d.previewUrl}
                          alt={d.productName}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                          <button
                            type="button"
                            onClick={() => {
                              const win = window.open("");
                              win?.document.write(`
                                <html>
                                  <head><title>${d.productName} Preview</title></head>
                                  <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#0b111e;min-height:100vh;">
                                    <img src="${d.previewUrl}" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);" />
                                  </body>
                                </html>
                              `);
                            }}
                            className="px-2.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow flex items-center gap-1 hover:bg-slate-100 transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Full view
                          </button>
                          <a
                            href={d.previewUrl}
                            download={`asson-${d.productName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`}
                            className="px-2.5 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold shadow flex items-center gap-1 hover:bg-amber-400 transition"
                          >
                            <Download className="w-3.5 h-3.5" /> Save
                          </a>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">
                            {d.productName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {d.createdAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: d.colorHex }}
                          />
                          <span className="truncate">{d.colorName}</span>
                          <span>·</span>
                          <span className="shrink-0">{d.layers?.length || 0} items</span>
                        </div>
                        {d.printLabels && d.printLabels.length > 0 && (
                          <div className="text-[10px] text-amber-800 bg-amber-100/70 rounded px-1.5 py-0.5 truncate">
                            {d.printLabels.join(" · ")}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => loadSavedDesign(d)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" /> Load to Studio
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedDesign(d.id)}
                          title="Delete design"
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Designs are stored in your browser so you can revisit them anytime.
              </span>
              <button
                type="button"
                onClick={() => saveCurrentDesignToHistory()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Save Current Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesignStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs font-semibold text-slate-500">
          Loading ASSON Clothing Design Studio...
        </div>
      }
    >
      <DesignStudioContent />
    </Suspense>
  );
}
