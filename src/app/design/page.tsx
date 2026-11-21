"use client";

import { useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  SIZES,
  GST_PERCENTAGE,
  GarmentProduct,
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
  Sparkles,
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
  Camera,
  Shirt,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";

type StudioViewSide = "front" | "back" | "left" | "right";

interface ArtworkTransform {
  x: number; // percentage offset from center (-50 to 50)
  y: number; // percentage offset from center (-50 to 50)
  scale: number; // 0.5 to 2.0
  rotation: number; // degrees (-180 to 180)
}

function DesignStudioContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product") || REVERSE_ENGINEERED_PRODUCTS[0].id;
  const initialColorName = searchParams.get("color");

  const { addItem } = useCart();

  // Selected base apparel
  const [selectedProduct, setSelectedProduct] = useState<GarmentProduct>(
    REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === initialProductId) ||
      REVERSE_ENGINEERED_PRODUCTS[0]
  );
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<StudioViewSide>("front");

  // Size matrix breakdown XS - XXL
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>({
    XS: 0,
    S: 5,
    M: 10,
    L: 10,
    XL: 0,
    XXL: 0,
  });

  // Total quantity computed from size breakdown
  const quantity = useMemo(() => {
    const sum = Object.values(sizeBreakdown).reduce((acc, q) => acc + (Number(q) || 0), 0);
    return Math.max(1, sum);
  }, [sizeBreakdown]);

  // Placed prints per location
  const [frontPrintSize, setFrontPrintSize] = useState<string>("a3");
  const [backPrintSize, setBackPrintSize] = useState<string>("none");
  const [leftSleevePrintSize, setLeftSleevePrintSize] = useState<string>("none");
  const [rightSleevePrintSize, setRightSleevePrintSize] = useState<string>("none");

  const [isEmbroidery, setIsEmbroidery] = useState<boolean>(false);
  const [hasNeckLabel, setHasNeckLabel] = useState<boolean>(true);

  // Artwork uploaded per view
  const [frontUploadedImage, setFrontUploadedImage] = useState<string | null>(null);
  const [backUploadedImage, setBackUploadedImage] = useState<string | null>(null);
  const [leftUploadedImage, setLeftUploadedImage] = useState<string | null>(null);
  const [rightUploadedImage, setRightUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  // Transform states per view
  const [transforms, setTransforms] = useState<Record<StudioViewSide, ArtworkTransform>>({
    front: { x: 0, y: 0, scale: 1, rotation: 0 },
    back: { x: 0, y: 0, scale: 1, rotation: 0 },
    left: { x: 0, y: 0, scale: 1, rotation: 0 },
    right: { x: 0, y: 0, scale: 1, rotation: 0 },
  });

  // Custom Typography overlay elements
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
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

  // Dragging and Resizing state on canvas
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const artworkRef = useRef<HTMLDivElement | null>(null);

  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    initScale: number;
    centerX: number;
    centerY: number;
    initialDistance: number;
  }>({
    startX: 0,
    startY: 0,
    initScale: 1,
    centerX: 0,
    centerY: 0,
    initialDistance: 100,
  });

  // Cart / Quote feedback state
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("");

  // Canvas element ref for export / mockup download
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize matching color if query parameter exists
  useEffect(() => {
    if (initialColorName) {
      const idx = selectedProduct.colours.findIndex(
        (c) => c.name.toLowerCase() === initialColorName.toLowerCase()
      );
      if (idx !== -1) setSelectedColorIdx(idx);
    }
  }, [initialColorName, selectedProduct]);

  const [customBlankPhoto, setCustomBlankPhoto] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });
  const [isUploadingBlank, setIsUploadingBlank] = useState(false);

  const currentColor =
    selectedProduct.colours[selectedColorIdx] || selectedProduct.colours[0];

  // Active base garment photo for canvas preview (custom uploaded blank or catalog default)
  const activeGarmentPhoto =
    (activeSide === "back" ? customBlankPhoto.back : customBlankPhoto.front) ||
    (activeSide === "back" ? currentColor.back : currentColor.front);

  const handleUploadCustomBlank = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBlank(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "asson_custom_blanks");

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
      } else {
        alert(result.error || "Failed to upload blank garment image");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload blank");
    } finally {
      setIsUploadingBlank(false);
    }
  };

  // Active uploaded artwork for current view
  const currentActiveImage = useMemo(() => {
    switch (activeSide) {
      case "front":
        return frontUploadedImage;
      case "back":
        return backUploadedImage;
      case "left":
        return leftUploadedImage;
      case "right":
        return rightUploadedImage;
      default:
        return frontUploadedImage;
    }
  }, [activeSide, frontUploadedImage, backUploadedImage, leftUploadedImage, rightUploadedImage]);

  // Set active image helper
  const setCurrentActiveImage = (url: string | null) => {
    if (activeSide === "front") setFrontUploadedImage(url);
    else if (activeSide === "back") setBackUploadedImage(url);
    else if (activeSide === "left") setLeftUploadedImage(url);
    else if (activeSide === "right") setRightUploadedImage(url);
  };

  // Get active print size key for current side
  const activePrintSizeKey = useMemo(() => {
    switch (activeSide) {
      case "front":
        return frontPrintSize;
      case "back":
        return backPrintSize;
      case "left":
        return leftSleevePrintSize;
      case "right":
        return rightSleevePrintSize;
      default:
        return "a3";
    }
  }, [activeSide, frontPrintSize, backPrintSize, leftSleevePrintSize, rightSleevePrintSize]);

  // Update active print size
  const setActivePrintSizeKey = (sizeKey: string) => {
    if (activeSide === "front") setFrontPrintSize(sizeKey);
    else if (activeSide === "back") setBackPrintSize(sizeKey);
    else if (activeSide === "left") setLeftSleevePrintSize(sizeKey);
    else if (activeSide === "right") setRightSleevePrintSize(sizeKey);
  };

  // Update transform for active side
  const updateActiveTransform = (patch: Partial<ArtworkTransform>) => {
    setTransforms((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        ...patch,
      },
    }));
  };

  // Zone coordinates mapping from selectedProduct.zones
  const currentZone = useMemo(() => {
    const defaultZone: [number, number, number, number, number] = [300, 375, 300, 420, 0];
    if (!selectedProduct.zones) return defaultZone;

    if (activeSide === "front") return selectedProduct.zones.front || defaultZone;
    if (activeSide === "back") return selectedProduct.zones.back || defaultZone;
    if (activeSide === "left") return selectedProduct.zones.left || [500, 258, 72, 72, -24];
    if (activeSide === "right") return selectedProduct.zones.right || [100, 258, 72, 72, 24];
    return defaultZone;
  }, [selectedProduct, activeSide]);

  // Calculate pixel bounds & percentages
  const zoneStyle = useMemo(() => {
    const [cx, cy, w, h, rot] = currentZone;
    const leftPct = ((cx - w / 2) / 600) * 100;
    const topPct = ((cy - h / 2) / 600) * 100;
    const widthPct = (w / 600) * 100;
    const heightPct = (h / 600) * 100;

    return {
      left: `${leftPct}%`,
      top: `${topPct}%`,
      width: `${widthPct}%`,
      height: `${heightPct}%`,
      transform: `rotate(${rot}deg)`,
    };
  }, [currentZone]);

  // Live inch calculation based on active print size & transform scale
  const currentInchDimensions = useMemo(() => {
    const printConfig = DTF_PRINTS[activePrintSizeKey];
    if (!printConfig) return '0" × 0"';
    return printConfig.dimensions || printConfig.size || '11" × 16"';
  }, [activePrintSizeKey]);

  // Multi-location Pricing Engine
  const isBulk = quantity >= 10;

  // Base garment price tier lookup
  const baseGarmentPrice = useMemo(() => {
    const tier = [...selectedProduct.prices]
      .sort((a, b) => b.min - a.min)
      .find((t) => quantity >= t.min);
    return tier ? tier.price : selectedProduct.basePrice;
  }, [selectedProduct, quantity]);

  // Check if A2, A3, or A4 print is selected anywhere -> Free neck label rule
  const hasLargePrint = useMemo(() => {
    const largeKeys = ["a2", "a3", "a4"];
    return (
      largeKeys.includes(frontPrintSize) ||
      largeKeys.includes(backPrintSize) ||
      largeKeys.includes(leftSleevePrintSize) ||
      largeKeys.includes(rightSleevePrintSize)
    );
  }, [frontPrintSize, backPrintSize, leftSleevePrintSize, rightSleevePrintSize]);

  // Print placement cost calculations
  const placedPrints = useMemo(() => {
    const list: Array<{
      position: "front" | "back" | "left" | "right" | "neck";
      sizeKey: string;
      sizeLabel: string;
      dimensions: string;
      unitCost: number;
      isWaived: boolean;
    }> = [];

    // Front
    if (frontPrintSize !== "none" && DTF_PRINTS[frontPrintSize]) {
      const p = DTF_PRINTS[frontPrintSize];
      list.push({
        position: "front",
        sizeKey: frontPrintSize,
        sizeLabel: `Front: ${p.label}`,
        dimensions: p.dimensions || p.size,
        unitCost: isBulk ? p.bulk : p.single,
        isWaived: false,
      });
    }

    // Back
    if (backPrintSize !== "none" && DTF_PRINTS[backPrintSize]) {
      const p = DTF_PRINTS[backPrintSize];
      list.push({
        position: "back",
        sizeKey: backPrintSize,
        sizeLabel: `Back: ${p.label}`,
        dimensions: p.dimensions || p.size,
        unitCost: isBulk ? p.bulk : p.single,
        isWaived: false,
      });
    }

    // Left Sleeve
    if (leftSleevePrintSize !== "none" && DTF_PRINTS[leftSleevePrintSize]) {
      const p = DTF_PRINTS[leftSleevePrintSize];
      list.push({
        position: "left",
        sizeKey: leftSleevePrintSize,
        sizeLabel: `Left Sleeve: ${p.label}`,
        dimensions: p.dimensions || p.size,
        unitCost: isBulk ? p.bulk : p.single,
        isWaived: false,
      });
    }

    // Right Sleeve
    if (rightSleevePrintSize !== "none" && DTF_PRINTS[rightSleevePrintSize]) {
      const p = DTF_PRINTS[rightSleevePrintSize];
      list.push({
        position: "right",
        sizeKey: rightSleevePrintSize,
        sizeLabel: `Right Sleeve: ${p.label}`,
        dimensions: p.dimensions || p.size,
        unitCost: isBulk ? p.bulk : p.single,
        isWaived: false,
      });
    }

    // Neck Label
    if (hasNeckLabel) {
      const isWaived = hasLargePrint;
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
  }, [
    frontPrintSize,
    backPrintSize,
    leftSleevePrintSize,
    rightSleevePrintSize,
    hasNeckLabel,
    hasLargePrint,
    isBulk,
  ]);

  const totalPrintsUnitCost = useMemo(() => {
    if (isEmbroidery) {
      return isBulk ? 50 : 70;
    }
    return placedPrints.reduce((sum, p) => sum + p.unitCost, 0);
  }, [isEmbroidery, isBulk, placedPrints]);

  const printUnitCost = totalPrintsUnitCost;
  const unitPrice = baseGarmentPrice + printUnitCost;
  const subtotal = unitPrice * quantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  // File Upload with fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "asson_studio_designs");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setCurrentActiveImage(data.url);
        if (activePrintSizeKey === "none") {
          setActivePrintSizeKey(activeSide === "left" || activeSide === "right" ? "logo" : "a3");
        }
        updateActiveTransform({ scale: 0.85, x: 0, y: 0, rotation: 0 });
      } else {
        throw new Error("No URL returned from upload endpoint");
      }
    } catch (err) {
      console.warn("Upload fallback triggered via FileReader:", err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCurrentActiveImage(uploadEvent.target.result as string);
          if (activePrintSizeKey === "none") {
            setActivePrintSizeKey(activeSide === "left" || activeSide === "right" ? "logo" : "a3");
          }
          updateActiveTransform({ scale: 0.85, x: 0, y: 0, rotation: 0 });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Client-Side Background Removal Tool
  const handleRemoveBackground = () => {
    if (!currentActiveImage) return;

    setIsRemovingBg(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentActiveImage;
    img.onload = () => {
      try {
        const offscreen = document.createElement("canvas");
        offscreen.width = img.width;
        offscreen.height = img.height;
        const ctx = offscreen.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const d = imgData.data;

        // Sample top-left corner color as background key
        const bgR = d[0];
        const bgG = d[1];
        const bgB = d[2];
        const tolerance = 40;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          // Check if pixel is close to sampled background or near white (235+)
          const diffBg = Math.hypot(r - bgR, g - bgG, b - bgB);
          const isWhiteBg = r > 235 && g > 235 && b > 235;

          if (diffBg < tolerance || isWhiteBg) {
            d[i + 3] = 0; // Alpha transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const processedUrl = offscreen.toDataURL("image/png");
        setCurrentActiveImage(processedUrl);
      } catch (err) {
        console.error("Client background removal error:", err);
      } finally {
        setIsRemovingBg(false);
      }
    };
    img.onerror = () => setIsRemovingBg(false);
  };

  // Clear Artwork Action
  const handleClearArt = () => {
    if (activeSide === "front") setFrontUploadedImage(null);
    else if (activeSide === "back") setBackUploadedImage(null);
    else if (activeSide === "left") setLeftUploadedImage(null);
    else if (activeSide === "right") setRightUploadedImage(null);

    setTextElements((prev) => prev.filter((t) => t.side !== activeSide));
    updateActiveTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
  };

  // Custom text overlays
  const handleAddText = () => {
    if (!customText.trim()) return;
    setTextElements((prev) => [
      ...prev,
      {
        id: `text_${Date.now()}`,
        text: customText,
        color: textColor,
        size: textSize,
        side: activeSide,
        x: 0,
        y: 0,
      },
    ]);
    setCustomText("");
  };

  // Interactive Drag & Move on Canvas
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsResizing(false);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initX: transforms[activeSide].x,
      initY: transforms[activeSide].y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-resize-handle]")) return;
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-resize-handle]")) return;
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Start Corner Handle Resize
  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setIsDragging(false);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const rect = artworkRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : clientX;
    const centerY = rect ? rect.top + rect.height / 2 : clientY;
    const initialDistance = Math.hypot(clientX - centerX, clientY - centerY) || 100;

    resizeStartRef.current = {
      startX: clientX,
      startY: clientY,
      initScale: transforms[activeSide].scale,
      centerX,
      centerY,
      initialDistance,
    };
  };

  // Unified Pointer Movement
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isResizing) {
      const { centerX, centerY, initialDistance, initScale } = resizeStartRef.current;
      const currentDistance = Math.hypot(clientX - centerX, clientY - centerY);
      const ratio = currentDistance / initialDistance;
      const newScale = Math.max(0.2, Math.min(2.5, +(initScale * ratio).toFixed(2)));
      updateActiveTransform({ scale: newScale });
      return;
    }

    if (isDragging) {
      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;
      const newX = Math.max(-180, Math.min(180, dragStartRef.current.initX + deltaX));
      const newY = Math.max(-180, Math.min(180, dragStartRef.current.initY + deltaY));
      updateActiveTransform({ x: Math.round(newX), y: Math.round(newY) });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Mouse wheel zoom over artwork
  const handleArtworkWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    const currentScale = transforms[activeSide].scale;
    const newScale = Math.max(0.2, Math.min(2.5, +(currentScale + zoomDelta).toFixed(2)));
    updateActiveTransform({ scale: newScale });
  };

  // Global mouseup / touchend listener
  useEffect(() => {
    const handleGlobalUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  // Client-Side Mockup PNG Download
  const handleDownloadMockup = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background fill
    ctx.fillStyle = "#f6f5f1";
    ctx.fillRect(0, 0, 800, 800);

    // Load garment photo
    const garmentImg = new Image();
    garmentImg.crossOrigin = "anonymous";
    garmentImg.src = activeGarmentPhoto;
    garmentImg.onload = () => {
      ctx.drawImage(garmentImg, 50, 50, 700, 700);

      // Render artwork if exists
      if (currentActiveImage) {
        const artImg = new Image();
        artImg.crossOrigin = "anonymous";
        artImg.src = currentActiveImage;
        artImg.onload = () => {
          const t = transforms[activeSide];
          const artW = 280 * t.scale;
          const artH = 280 * t.scale;
          const posX = 400 + (t.x * 3) - artW / 2;
          const posY = 380 + (t.y * 3) - artH / 2;

          ctx.save();
          ctx.translate(posX + artW / 2, posY + artH / 2);
          ctx.rotate((t.rotation * Math.PI) / 180);
          ctx.drawImage(artImg, -artW / 2, -artH / 2, artW, artH);
          ctx.restore();

          finishDownload();
        };
        artImg.onerror = () => finishDownload();
      } else {
        finishDownload();
      }
    };

    const finishDownload = () => {
      // Tech pack branding stamp
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("ASSON CLOTHING BRAND — TECH PACK SPEC", 60, 760);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText(
        `${selectedProduct.name} · ${currentColor.name} · ${activeSide.toUpperCase()} · ${currentInchDimensions}`,
        60,
        780
      );

      const link = document.createElement("a");
      link.download = `asson-${selectedProduct.slug}-${activeSide}-mockup.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  // Add customized apparel to CartContext
  const handleAddToCart = () => {
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
      mockupFrontUrl: frontUploadedImage || undefined,
      mockupBackUrl: backUploadedImage || undefined,
    });

    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3500);
  };

  // Save to /api/designs and /api/quotes, then open WhatsApp automatically
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);

    const whatsappNum = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918089963691"
    ).replace(/[^0-9]/g, "");

    const sizesText =
      Object.entries(sizeBreakdown)
        .filter(([_, qty]) => (qty as number) > 0)
        .map(([sz, qty]) => `${sz}×${qty}`)
        .join(", ") || `${quantity} pcs`;

    const printsText =
      placedPrints.length > 0
        ? placedPrints.map((p) => p.sizeLabel || p.sizeKey).join(", ")
        : "none (plain t-shirt)";

    const generatedDesignId = `ASSON-${Date.now().toString(36).toUpperCase()}`;

    const appBaseUrl =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "https://asson-cloths.vercel.app";

    // Ensure Mockup images link is always a clean, normal-sized URL (never a raw base64 data URI)
    let mockupImg = "";
    if (
      frontUploadedImage &&
      frontUploadedImage.startsWith("https://res.cloudinary.com") &&
      frontUploadedImage.length < 150
    ) {
      mockupImg = frontUploadedImage;
    } else {
      mockupImg = `${appBaseUrl}/api/mockup/${generatedDesignId}.png`;
    }

    const whatsappMessage = [
      `Hi Asson Clothing Brand! I designed a t-shirt on your website.`,
      ``,
      `Mockup images: ${mockupImg}`,
      `Design ID: ${generatedDesignId}`,
      `T-shirt: ${selectedProduct.name} — ${currentColor.name}`,
      `Prints: ${printsText}`,
      `Sizes: ${sizesText} (${quantity} pcs)`,
      `Neck label: ${hasNeckLabel ? "yes" : "no"}`,
      `Price: ₹${unitPrice}/pc × ${quantity} = ₹${subtotal} (+ GST)`,
      `Total: ${quantity} pcs`,
      `Estimate: ₹${subtotal} + GST ₹${gstAmount} = ₹${total}`,
      `Shipping charges extra.`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    try {
      await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: generatedDesignId,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          colorName: currentColor.name,
          colorHex: currentColor.hex,
          frontPreviewUrl: frontUploadedImage,
          backPreviewUrl: backUploadedImage,
          uploadedAssets: [
            frontUploadedImage,
            backUploadedImage,
            leftUploadedImage,
            rightUploadedImage,
          ].filter(Boolean),
          printType: isEmbroidery ? "Embroidery" : "DTF",
          printSize: frontPrintSize,
          estimatedPrice: total,
          customerPhone,
        }),
      });

      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          email: `${customerPhone}@asson-lead.com`,
          items: [
            {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              color: currentColor.name,
              quantity,
              printType: isEmbroidery ? "Embroidery" : "DTF",
              printSize: frontPrintSize,
              designPreviewUrl: frontUploadedImage || backUploadedImage,
              unitPrice,
              totalPrice: total,
            },
          ],
          subtotal,
          gst: gstAmount,
          total,
          notes: "Generated via Asson Interactive Design Studio",
        }),
      });

      setSubmittedSuccess(true);
      setLastWhatsAppUrl(whatsappUrl);

      // Open WhatsApp automatically
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Quote submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-slate-950">
              <Palette className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Live Mockup & DTF Customizer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Asson Design Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            4-zone interactive canvas, real DTF inch measurements, live volume tiers,
            and free neck label branding.
          </p>
        </div>

        {/* 4-Zone View Switcher Pill */}
        <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSide("front")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "front"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Front View
          </button>
          <button
            onClick={() => setActiveSide("back")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "back"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Back View
          </button>
          <button
            onClick={() => setActiveSide("left")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "left"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Left Sleeve
          </button>
          <button
            onClick={() => setActiveSide("right")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "right"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Right Sleeve
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onMouseMove={handleMouseMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handlePointerUp}
            className="bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden aspect-square relative shadow-inner flex items-center justify-center select-none"
          >
            {/* Garment Base Photo */}
            <img
              src={activeGarmentPhoto}
              alt="Custom Apparel Canvas"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Print Placement Zone (Active boundary derived from selectedProduct.zones) */}
            <div
              className="absolute border-2 border-dashed border-amber-400/80 rounded-lg pointer-events-none flex flex-col items-center justify-center transition-all duration-200"
              style={zoneStyle}
            >
              <span className="absolute top-1 text-[9px] font-bold text-amber-500 bg-black/60 px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                {activeSide.toUpperCase()} PRINT ZONE ({currentInchDimensions})
              </span>

              {/* Uploaded Artwork on Canvas with Drag / Scale / Rotate Transform */}
              {currentActiveImage && (
                <div
                  ref={artworkRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onWheel={handleArtworkWheel}
                  style={{
                    transform: `translate(${transforms[activeSide].x}px, ${transforms[activeSide].y}px) scale(${transforms[activeSide].scale}) rotate(${transforms[activeSide].rotation}deg)`,
                    cursor: isDragging ? "grabbing" : isResizing ? "nwse-resize" : "grab",
                  }}
                  className="relative max-w-[85%] max-h-[85%] overflow-visible pointer-events-auto group select-none"
                >
                  {/* Active selection outline */}
                  <div className="absolute -inset-2 border-2 border-dashed border-amber-500/90 rounded pointer-events-none" />

                  {/* 4 Interactive Corner Drag-to-Resize Handles */}
                  <div
                    data-resize-handle="nw"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    title="Drag to resize artwork"
                    className="absolute -top-3.5 -left-3.5 w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-nwse-resize hover:scale-125 hover:bg-amber-100 transition-transform z-20 flex items-center justify-center pointer-events-auto"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>

                  <div
                    data-resize-handle="ne"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    title="Drag to resize artwork"
                    className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-nesw-resize hover:scale-125 hover:bg-amber-100 transition-transform z-20 flex items-center justify-center pointer-events-auto"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>

                  <div
                    data-resize-handle="sw"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    title="Drag to resize artwork"
                    className="absolute -bottom-3.5 -left-3.5 w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-nesw-resize hover:scale-125 hover:bg-amber-100 transition-transform z-20 flex items-center justify-center pointer-events-auto"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>

                  <div
                    data-resize-handle="se"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    title="Drag to resize artwork"
                    className="absolute -bottom-3.5 -right-3.5 w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-nwse-resize hover:scale-125 hover:bg-amber-100 transition-transform z-20 flex items-center justify-center pointer-events-auto"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>

                  <img
                    src={currentActiveImage}
                    alt="Uploaded Artwork"
                    className="object-contain max-h-56 filter drop-shadow-md pointer-events-none select-none"
                    draggable={false}
                  />

                  <button
                    onClick={handleClearArt}
                    title="Remove artwork"
                    className="absolute -top-3.5 -right-3.5 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-700 z-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Rendered Text Overlays */}
              {textElements
                .filter((t) => t.side === activeSide)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      color: item.color,
                      fontSize: `${item.size}px`,
                    }}
                    className="font-extrabold tracking-wider select-none text-center drop-shadow-md my-1"
                  >
                    {item.text}
                  </div>
                ))}
            </div>

            {/* On-Canvas Floating Action Toolbar for Active Artwork */}
            {currentActiveImage && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 select-none pointer-events-auto max-w-[92%]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateActiveTransform({
                        scale: Math.max(0.2, +(transforms[activeSide].scale - 0.1).toFixed(2)),
                      })
                    }
                    title="Zoom Out / Scale Down (-10%)"
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-1.5 text-center min-w-[46px]">
                    <span className="text-[11px] font-mono font-black text-amber-400 block leading-tight">
                      {Math.round(transforms[activeSide].scale * 100)}%
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-tighter">Scale</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateActiveTransform({
                        scale: Math.min(2.5, +(transforms[activeSide].scale + 0.1).toFixed(2)),
                      })
                    }
                    title="Zoom In / Scale Up (+10%)"
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-700 mx-0.5" />

                {/* Quick Fit Preset */}
                <button
                  type="button"
                  onClick={() =>
                    updateActiveTransform({ scale: 0.8, x: 0, y: 0 })
                  }
                  title="Fit Artwork Inside Print Zone"
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition"
                >
                  Fit
                </button>

                {/* Quick Rotate 90° */}
                <button
                  type="button"
                  onClick={() =>
                    updateActiveTransform({
                      rotation: (transforms[activeSide].rotation + 90) % 360,
                    })
                  }
                  title="Rotate +90°"
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                {/* Reset to Center */}
                <button
                  type="button"
                  onClick={() =>
                    updateActiveTransform({ scale: 1, x: 0, y: 0, rotation: 0 })
                  }
                  title="Reset Position & Scale"
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-slate-700 mx-0.5" />

                {/* Delete Artwork */}
                <button
                  type="button"
                  onClick={handleClearArt}
                  title="Delete / Remove Artwork"
                  className="w-7 h-7 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 hover:text-white flex items-center justify-center transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Canvas Floating Action Tools */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={handleDownloadMockup}
                title="Download Mockup PNG"
                className="bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow border border-slate-200 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-brand-900" /> Export Mockup
              </button>
              {currentActiveImage && (
                <button
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                  title="Remove solid white background"
                  className="bg-white/90 hover:bg-white text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow border border-slate-200 flex items-center gap-1.5 transition"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  {isRemovingBg ? "Removing..." : "Remove BG"}
                </button>
              )}
            </div>

            {/* Clear Button */}
            {(currentActiveImage || textElements.some((t) => t.side === activeSide)) && (
              <button
                onClick={handleClearArt}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow border border-slate-200 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear {activeSide}
              </button>
            )}
          </div>

          {/* Transform Adjuster Bar (Drag, Scale, Rotate) */}
          {currentActiveImage && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-bold flex items-center gap-1">
                    <ZoomIn className="w-3 h-3 text-brand-900" /> Artwork Scale
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600">
                      {Math.round(transforms[activeSide].scale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => updateActiveTransform({ scale: 0.8, x: 0, y: 0 })}
                      className="text-[10px] text-slate-500 hover:text-amber-600 underline font-semibold"
                    >
                      Fit
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.02"
                  value={transforms[activeSide].scale}
                  onChange={(e) =>
                    updateActiveTransform({ scale: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Small (20%)</span>
                  <span>100%</span>
                  <span>Oversized (250%)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-bold flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-brand-900" /> Rotation
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">
                      {transforms[activeSide].rotation}°
                    </span>
                    <button
                      type="button"
                      onClick={() => updateActiveTransform({ rotation: 0 })}
                      className="text-[10px] text-slate-500 hover:text-amber-600 underline font-semibold"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={transforms[activeSide].rotation}
                  onChange={(e) =>
                    updateActiveTransform({ rotation: parseInt(e.target.value) || 0 })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-180°</span>
                  <span>0°</span>
                  <span>+180°</span>
                </div>
              </div>
            </div>
          )}

          {/* Color Swatches bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Colour: <strong className="text-slate-900">{currentColor.name}</strong>
            </span>
            <div className="flex gap-2">
              {selectedProduct.colours.map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  title={col.name}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 rounded-full border border-black/20 transition ${
                    selectedColorIdx === idx
                      ? "ring-2 ring-amber-500 scale-110 shadow"
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Garment Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Base Apparel Silhouette
            </span>
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const p = REVERSE_ENGINEERED_PRODUCTS.find(
                  (prod) => prod.id === e.target.value
                );
                if (p) {
                  setSelectedProduct(p);
                  setSelectedColorIdx(0);
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              {REVERSE_ENGINEERED_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (from ₹{prod.basePrice})
                </option>
              ))}
            </select>

            {/* Custom Blank Upload Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="cursor-pointer text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition">
                <Camera className="w-3.5 h-3.5" />
                <span>
                  {isUploadingBlank
                    ? "Uploading Blank to Cloudinary..."
                    : `Upload Custom Blank Photo (${activeSide.toUpperCase()})`}
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleUploadCustomBlank}
                  className="hidden"
                  disabled={isUploadingBlank}
                />
              </label>

              {(customBlankPhoto.front || customBlankPhoto.back) && (
                <button
                  type="button"
                  onClick={() => setCustomBlankPhoto({ front: null, back: null })}
                  className="text-[11px] text-slate-400 hover:text-red-500 font-semibold"
                >
                  Reset to Catalog Blank
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Upload Artwork & Add Typography */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                2. Upload Artwork to Cloudinary
              </span>
              <span className="text-[11px] text-amber-600 font-semibold uppercase">
                Active: {activeSide} View
              </span>
            </div>

            <div className="flex gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50">
                <Upload className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-700 block">
                  {isUploading ? "Uploading to Cloudinary..." : "Choose PNG / Vector"}
                </span>
                <span className="text-[10px] text-slate-400">
                  Transparent PNG recommended
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Add Custom Text */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Add Custom Typography
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom slogan..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  title="Text color"
                />
                <button
                  type="button"
                  onClick={handleAddText}
                  className="px-3 py-2 bg-brand-900 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Add Text
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Print Technique & Multi-Location Configuration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              3. Printing Technique & Dimensions
            </span>

            {/* Technique Switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsEmbroidery(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  !isEmbroidery
                    ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                High-Definition DTF
              </button>
              <button
                type="button"
                onClick={() => setIsEmbroidery(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  isEmbroidery
                    ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Embroidery
              </button>
            </div>

            {/* Print Dimensions Selection for Active Side */}
            {!isEmbroidery && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-600 font-medium">
                    Dimension for {activeSide.toUpperCase()} print:
                  </label>
                  <span className="font-bold text-slate-800">{currentInchDimensions}</span>
                </div>
                <select
                  value={activePrintSizeKey}
                  onChange={(e) => setActivePrintSizeKey(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="none">No Print on this zone (₹0)</option>
                  {Object.entries(DTF_PRINTS)
                    .filter(([key]) => {
                      if (activeSide === "left" || activeSide === "right") {
                        // Sleeves support pocket logo, A6, A5
                        return ["logo", "a6", "a5"].includes(key);
                      }
                      return key !== "label";
                    })
                    .map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label} ({item.size}) — +₹
                        {isBulk ? item.bulk : item.single} / pc
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Free Neck Label Rule Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNeckLabel}
                  onChange={(e) => setHasNeckLabel(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="flex-1">
                  Include Custom Brand Neck Label
                  {hasLargePrint ? (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      FREE (Waived with A2/A3/A4)
                    </span>
                  ) : (
                    <span className="ml-1.5 text-slate-500 text-[10px]">
                      (+₹15 / pc)
                    </span>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Step 4: Size Matrix Breakdown (XS-XXL) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                4. Order Size Matrix (XS – XXL)
              </span>
              <span className="text-xs font-black text-brand-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Total: {quantity} Pieces
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {SIZES.map((sz) => (
                <div key={sz} className="text-center">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {sz}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={sizeBreakdown[sz] ?? 0}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setSizeBreakdown((prev) => ({ ...prev, [sz]: val }));
                    }}
                    className="w-full text-center p-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  setSizeBreakdown({ XS: 0, S: 5, M: 10, L: 10, XL: 0, XXL: 0 })
                }
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-semibold transition"
              >
                Sample (25 pcs)
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizeBreakdown({ XS: 5, S: 10, M: 15, L: 15, XL: 5, XXL: 0 })
                }
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-semibold transition"
              >
                Wholesale (50 pcs)
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizeBreakdown({ XS: 10, S: 20, M: 35, L: 25, XL: 10, XXL: 0 })
                }
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-semibold transition"
              >
                Brand Drop (100 pcs)
              </button>
            </div>
          </div>

          {/* Step 5: Pricing Summary & Export Actions */}
          <div className="bg-brand-900 text-white rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-brand-200 uppercase">
                  Order Quantity (Pieces)
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {quantity >= 10 ? "Wholesale Bulk Rate" : "Sample Rate"}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={quantity}
                onChange={(e) => {
                  const newTotal = parseInt(e.target.value) || 10;
                  const half = Math.floor(newTotal / 2);
                  setSizeBreakdown({
                    XS: 0,
                    S: 0,
                    M: half,
                    L: newTotal - half,
                    XL: 0,
                    XXL: 0,
                  });
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10 pcs (MOQ)</span>
                <span className="text-white font-extrabold text-sm">
                  {quantity} Pieces
                </span>
                <span>300+ pcs</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-brand-800 space-y-2 text-xs">
              <div className="flex justify-between text-brand-200">
                <span>Base Garment ({quantity} pcs tier):</span>
                <span>₹{baseGarmentPrice} / pc</span>
              </div>
              <div className="flex justify-between text-brand-200">
                <span>Prints / Craft Cost:</span>
                <span>+₹{printUnitCost} / pc</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1">
                <span>Unit Price:</span>
                <span>₹{unitPrice} / pc</span>
              </div>
              <div className="flex justify-between text-brand-300 text-[11px]">
                <span>GST (5%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-800">
                <span className="text-sm font-bold text-brand-100">
                  Total Quote:
                </span>
                <span className="text-2xl font-black text-amber-400">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add to Quote List Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Quote List (Cart)
              </button>

              {addedToCartToast && (
                <div className="p-2.5 bg-emerald-900/90 border border-emerald-600 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Added to Quote List!
                  </span>
                  <Link
                    href="/quote"
                    className="underline text-white font-bold hover:text-amber-300"
                  >
                    View Quote →
                  </Link>
                </div>
              )}
            </div>

            {/* Save to Remote Quote Drawer & WhatsApp Trigger */}
            {submittedSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-2xl space-y-3 text-center">
                <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Design & Quote saved! Opening WhatsApp...
                </div>
                <p className="text-[11px] text-slate-300">
                  If WhatsApp did not launch automatically, tap below to send your design specs:
                </p>
                <a
                  href={lastWhatsAppUrl || `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918089963691").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Open WhatsApp Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="pt-2 border-t border-brand-800 space-y-2">
                <span className="text-[11px] font-bold text-brand-300 uppercase block">
                  Send Design & Get Instant WhatsApp Confirmation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="p-2.5 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="p-2.5 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/30"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Opening WhatsApp..." : "Send Design & Specs to WhatsApp"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs font-semibold text-slate-500">
          Loading Asson Design Studio...
        </div>
      }
    >
      <DesignStudioContent />
    </Suspense>
  );
}
