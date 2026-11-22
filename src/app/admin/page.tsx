"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Palette,
  Layers,
  Shirt,
  Database,
  RefreshCw,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Copy,
  Check,
  Download,
  AlertCircle,
  Menu,
  X,
  ShieldCheck,
  Lock,
  ChevronRight,
  TrendingUp,
  Building,
  Calendar,
  Upload,
  Camera,
  Plus,
  Image as ImageIcon,
  Terminal,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";
import { REVERSE_ENGINEERED_PRODUCTS, formatINR, BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

type AdminTab = "overview" | "quotes" | "designs" | "enquiries" | "catalog" | "developer";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "superadmin">("admin");
  const [userEmail, setUserEmail] = useState<string>("admin@assonclothing.com");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data states
  const [quotes, setQuotes] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<any[]>(REVERSE_ENGINEERED_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // Blank T-Shirt Upload Modal State
  const [selectedProductForUpload, setSelectedProductForUpload] = useState<any | null>(null);
  const [uploadColorIdx, setUploadColorIdx] = useState<number>(0);
  const [frontBlankUrl, setFrontBlankUrl] = useState<string>("");
  const [backBlankUrl, setBackBlankUrl] = useState<string>("");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [savingBlank, setSavingBlank] = useState(false);
  const [blankSaveSuccess, setBlankSaveSuccess] = useState<string | null>(null);

  // Full Mockup Lightbox Modal State
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    customer?: string;
    phone?: string;
    designId?: string;
    design?: any;
  } | null>(null);

  // Open mockup safely (handles data URIs, blob URLs, and clean HTTP routes without browser block)
  const openMockupSafe = (imageUrl: string, designId?: string) => {
    if (!imageUrl) return;

    if (designId) {
      window.open(`/api/mockup/${designId}.png`, "_blank");
      return;
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      window.open(imageUrl, "_blank");
      return;
    }

    if (imageUrl.startsWith("data:image")) {
      try {
        const parts = imageUrl.split(",");
        const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
        return;
      } catch (err) {
        console.error("Failed to convert data URI to blob:", err);
      }
    }

    window.open(imageUrl, "_blank");
  };

  // Download mockup safely (handles data URIs and HTTP links)
  const downloadMockupSafe = (imageUrl: string, filename = "mockup.png") => {
    if (!imageUrl) return;
    try {
      const a = document.createElement("a");
      a.download = filename;
      if (imageUrl.startsWith("data:image")) {
        const parts = imageUrl.split(",");
        const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      } else {
        a.href = imageUrl;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Download factory print tech pack spec (.txt)
  const downloadTechPackSpec = (design: any) => {
    if (!design) return;
    const tp = design.techPack || {};
    const nominal = tp.nominalDimensions || "11\" × 16\"";
    const realIn = tp.realDimensionsInches || nominal;
    const realCm = tp.realDimensionsCm || "Standard";
    const scale = tp.scalePercent ? `${tp.scalePercent}%` : "100%";
    const rot = tp.rotationDegrees !== undefined ? `${tp.rotationDegrees}°` : "0°";
    const zone = (tp.viewSide || "front").toUpperCase();
    const offX = tp.offsetX !== undefined ? `${tp.offsetX}px` : "0px (Centered)";
    const offY = tp.offsetY !== undefined ? `${tp.offsetY}px` : "0px (Centered)";
    const tech = tp.technique || design.printType || "High-Definition DTF";

    const textLines = (tp.textElements || design.textElements || [])
      .map((t: any, idx: number) => `Text Line ${idx + 1}       : "${t.text}" (Color: ${t.color}, Font Size: ${t.size}pt)`)
      .join("\n");

    const content = `==============================================================
ASSON CLOTHING BRAND — FACTORY PRINT PRODUCTION TECH PACK
==============================================================
Design ID            : ${design.designId || design._id || "N/A"}
Created Date         : ${design.createdAt ? new Date(design.createdAt).toLocaleString() : new Date().toLocaleString()}
Customer Name        : ${design.customerName || "Customer"}
Customer Phone       : ${design.customerPhone || "N/A"}
Garment Silhouette   : ${design.productName || design.productId || "Custom Blank"}
Garment Color        : ${design.colorName || design.color || "Standard"} (${design.colorHex || ""})

--------------------------------------------------------------
PRINT MEASUREMENTS & RIP SPECIFICATIONS
--------------------------------------------------------------
Print Location Zone  : ${zone} VIEW
Print Technique      : ${tech}
Nominal Template     : ${tp.nominalSizeLabel || design.printSize?.toUpperCase() || "A3"} (${nominal})
User Scaling Ratio   : ${scale}
REAL PRINT WIDTH     : ${realIn.split("×")[0]?.trim() || realIn}
REAL PRINT HEIGHT    : ${realIn.split("×")[1]?.trim() || ""}
METRIC PRINT SIZE    : ${realCm}
ROTATION ANGLE       : ${rot} clockwise
ZONE OFFSET          : X: ${offX}, Y: ${offY}

${textLines ? `--------------------------------------------------------------\nCUSTOM TYPOGRAPHY / SLOGANS\n--------------------------------------------------------------\n${textLines}\n` : ""}
==============================================================
FACTORY RIP OPERATOR INSTRUCTIONS:
1. Import customer artwork file into RIP software (Digital Factory / AcroRIP).
2. Set target output print dimensions to: ${realIn} (${realCm}).
3. Apply rotation of ${rot} clockwise.
4. Position artwork on garment template at: ${zone} chest zone.
5. DTF heat press parameters: 160°C for 15 seconds, warm peel, 5 sec post-press.
==============================================================
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `tech-pack-${design.designId || design._id || "spec"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
  };

  // Login form states
  const [loginTab, setLoginTab] = useState<"admin" | "superadmin">("admin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Check auth session on load
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUserRole(data.role || "admin");
        setUserEmail(data.email || "admin@assonclothing.com");
        fetchData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUserRole(data.role || "admin");
        setUserEmail(data.email || loginEmail);
        fetchData();
      } else {
        setLoginError(data.error || "Invalid email or password");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUserRole("admin");
      setQuotes([]);
      setEnquiries([]);
      setDesigns([]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, eRes, dRes, pRes] = await Promise.all([
        fetch("/api/quotes"),
        fetch("/api/enquiries"),
        fetch("/api/designs"),
        fetch("/api/products"),
      ]);

      const [qData, eData, dData, pData] = await Promise.all([
        qRes.json(),
        eRes.json(),
        dRes.json(),
        pRes.json(),
      ]);

      setQuotes(Array.isArray(qData) ? qData : []);
      setEnquiries(Array.isArray(eData) ? eData : []);
      setDesigns(Array.isArray(dData) ? dData : []);
      if (Array.isArray(pData) && pData.length > 0) {
        setCatalogProducts(pData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedMessage(data.message || "Database seeded successfully!");
      fetchData();
    } catch (err: any) {
      setSeedMessage(`Error seeding database: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const openBlankUploadModal = (product: any, colorIdx: number = 0) => {
    setSelectedProductForUpload(product);
    setUploadColorIdx(colorIdx);
    const rawColours = product.colours || product.colors || [];
    const color = rawColours[colorIdx] || {};
    setFrontBlankUrl(color.front || color.photoFront || "");
    setBackBlankUrl(color.back || color.photoBack || "");
    setBlankSaveSuccess(null);
  };

  const handleColorChange = (idx: number) => {
    if (!selectedProductForUpload) return;
    setUploadColorIdx(idx);
    const rawColours = selectedProductForUpload.colours || selectedProductForUpload.colors || [];
    const color = rawColours[idx] || {};
    setFrontBlankUrl(color.front || color.photoFront || "");
    setBackBlankUrl(color.back || color.photoBack || "");
  };

  const handleUploadBlankImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === "front") setUploadingFront(true);
    else setUploadingBack(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "asson_blanks");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (side === "front") setFrontBlankUrl(data.url);
        else setBackBlankUrl(data.url);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      if (side === "front") setUploadingFront(false);
      else setUploadingBack(false);
    }
  };

  const handleSaveBlankImages = async () => {
    if (!selectedProductForUpload) return;
    setSavingBlank(true);
    setBlankSaveSuccess(null);

    try {
      const rawColours = selectedProductForUpload.colours || selectedProductForUpload.colors || [];
      const updatedColours = rawColours.map((c: any, idx: number) => {
        if (idx === uploadColorIdx) {
          return {
            ...c,
            front: frontBlankUrl || c.front || c.photoFront,
            back: backBlankUrl || c.back || c.photoBack,
            photoFront: frontBlankUrl || c.photoFront || c.front,
            photoBack: backBlankUrl || c.photoBack || c.back,
          };
        }
        return c;
      });

      const payload = {
        id: selectedProductForUpload.id,
        slug: selectedProductForUpload.slug,
        colours: updatedColours,
        colors: updatedColours,
      };

      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setBlankSaveSuccess("Blank images uploaded to Cloudinary & saved to Catalog!");
        setCatalogProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProductForUpload.id
              ? { ...p, colours: updatedColours, colors: updatedColours }
              : p
          )
        );
        setTimeout(() => {
          setSelectedProductForUpload(null);
          setBlankSaveSuccess(null);
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update product in database");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setSavingBlank(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export Quotes as JSON backup (Superadmin feature)
  const handleExportQuotesBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `asson_quotes_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculations for Overview KPIs
  const totalQuoteValue = quotes.reduce((acc, q) => acc + (q.total || q.subtotal || 0), 0);
  const totalUnits = quotes.reduce((acc, q) => {
    const itemsUnits = q.items?.reduce((iAcc: number, item: any) => iAcc + (item.quantity || 0), 0) || 0;
    return acc + itemsUnits;
  }, 0);

  // Filtered lists
  const filteredQuotes = quotes.filter((q) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.customerName?.toLowerCase().includes(query) ||
      q.email?.toLowerCase().includes(query) ||
      q.phone?.toLowerCase().includes(query)
    );
  });

  const filteredEnquiries = enquiries.filter((e) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.name?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.company?.toLowerCase().includes(query) ||
      e.phone?.toLowerCase().includes(query)
    );
  });

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-neutral-400 text-xs font-mono uppercase tracking-wider font-semibold">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-white" />
        Checking access credentials...
      </div>
    );
  }

  // 2. Unauthenticated State — Dedicated Full-Screen Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Large Watermark Background */}
        <div
          aria-hidden="true"
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none select-none opacity-[0.04] overflow-hidden flex items-center justify-center z-0"
        >
          <Image
            src="/logo-white.svg"
            alt=""
            width={1000}
            height={320}
            className="w-full max-w-3xl h-auto object-contain"
          />
        </div>

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-white.svg"
                alt={BRAND_NAME}
                width={160}
                height={52}
                className="h-11 sm:h-12 w-auto object-contain mx-auto transition-transform group-hover:scale-105"
                priority
              />
              <span className="sr-only">{BRAND_NAME}</span>
            </Link>
            <div>
              <h1 className="text-xl font-heading font-black text-white tracking-tight uppercase">
                Management Console
              </h1>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mt-1">
                {BRAND_TAGLINE}
              </p>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-2xl backdrop-blur-sm space-y-6">
            {/* Role Tab Toggle (Staff vs Superadmin) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0A0A0A] rounded-xl border border-[#222222] text-xs font-mono uppercase tracking-wider font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginTab("admin");
                  setLoginEmail("");
                  setLoginPassword("");
                  setLoginError(null);
                }}
                className={`py-2 rounded-lg transition ${
                  loginTab === "admin"
                    ? "bg-white text-black shadow"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Staff Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginTab("superadmin");
                  setLoginEmail("");
                  setLoginPassword("");
                  setLoginError(null);
                }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  loginTab === "superadmin"
                    ? "bg-white text-black shadow"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Superadmin
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-bold">
                  {loginTab === "superadmin" ? "Superadmin Email" : "Admin Email"}
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={
                    loginTab === "superadmin"
                      ? "superadmin@assonclothing.com"
                      : "admin@assonclothing.com"
                  }
                  className="w-full p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                {loggingIn
                  ? "Verifying..."
                  : loginTab === "superadmin"
                  ? "Unlock Superadmin Console"
                  : "Unlock Staff Dashboard"}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-neutral-200 flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#121212] border-b border-[#222222] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt={BRAND_NAME}
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <div className="border-l border-neutral-800 pl-2.5">
            <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block">
              {userRole === "superadmin" ? "Superadmin" : "Staff Portal"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#1E1E1E] text-neutral-200 hover:bg-[#282828] transition border border-[#2C2C2C]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-[#222222] flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo & Role Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="shrink-0">
                <Image
                  src="/logo-white.svg"
                  alt={BRAND_NAME}
                  width={110}
                  height={36}
                  className="h-7 sm:h-8 w-auto object-contain"
                  priority
                />
              </Link>
              <div className="border-l border-neutral-800 pl-2.5">
                <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {userRole === "superadmin" ? "Superadmin" : "Portal"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#2C2C2C] text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white hover:border-neutral-500 transition group"
          >
            <span>Visit Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition" />
          </Link>

          {/* Nav List */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition ${
                activeTab === "overview"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("quotes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition ${
                activeTab === "quotes"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Quotes & Orders</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "quotes"
                    ? "bg-black text-white"
                    : "bg-[#222222] text-neutral-300"
                }`}
              >
                {quotes.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("designs");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition ${
                activeTab === "designs"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4" />
                <span>Studio Designs</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "designs"
                    ? "bg-black text-white"
                    : "bg-[#222222] text-neutral-300"
                }`}
              >
                {designs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("enquiries");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition ${
                activeTab === "enquiries"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Bulk Inquiries</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "enquiries"
                    ? "bg-black text-white"
                    : "bg-[#222222] text-neutral-300"
                }`}
              >
                {enquiries.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("catalog");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition ${
                activeTab === "catalog"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shirt className="w-4 h-4" />
                <span>Blanks Catalog</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#222222] text-neutral-300">
                {catalogProducts.length}
              </span>
            </button>

            {/* SUPERADMIN-ONLY TAB */}
            {userRole === "superadmin" && (
              <button
                onClick={() => {
                  setActiveTab("developer");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition border ${
                  activeTab === "developer"
                    ? "bg-white text-black border-white shadow-md"
                    : "text-neutral-300 border-neutral-700 hover:bg-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4" />
                  <span>Developer Console</span>
                </div>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">
                  Dev
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-[#222222] bg-[#0E0E0E] space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                userRole === "superadmin"
                  ? "bg-white text-black border-white shadow"
                  : "bg-[#1E1E1E] text-neutral-300 border-neutral-700"
              }`}
            >
              {userRole === "superadmin" ? "SA" : "AD"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-mono font-bold text-white block truncate flex items-center gap-1.5">
                {userRole === "superadmin" ? "Superadmin" : "Staff Admin"}
                {userRole === "superadmin" && (
                  <Zap className="w-3 h-3 text-white shrink-0" />
                )}
              </span>
              <span className="text-[10px] text-neutral-400 block truncate font-mono">
                {userEmail}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-[#1A1A1A] hover:bg-red-950/40 hover:text-red-400 hover:border-red-800/50 text-neutral-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition border border-[#2B2B2B]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0E0E0E] relative overflow-hidden">
        {/* Top Header Bar */}
        {/* Subtle Watermark in Main Area */}
        <div
          aria-hidden="true"
          className="fixed -bottom-10 right-0 w-[550px] pointer-events-none select-none opacity-[0.025] overflow-hidden flex items-center justify-center z-0"
        >
          <Image
            src="/logo-white.svg"
            alt=""
            width={800}
            height={260}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Top Header Bar */}
        <header className="bg-[#121212]/90 border-b border-[#222222] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {userRole === "superadmin" ? "Superadmin Console" : "Store Management"}
                </span>
                <span className="text-neutral-600">/</span>
                <span className="text-xs font-semibold text-neutral-300 capitalize">
                  {activeTab === "developer" ? "Developer Tools" : activeTab}
                </span>
              </div>
              <h2 className="text-xl font-black text-white capitalize mt-0.5">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "quotes" && "Customer Quotes & Orders"}
                {activeTab === "designs" && "Customizer Studio Designs"}
                {activeTab === "enquiries" && "Bulk Manufacturing Inquiries"}
                {activeTab === "catalog" && "Wholesale Blanks Catalog"}
                {activeTab === "developer" && "Superadmin Developer Console"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            {(activeTab === "quotes" || activeTab === "enquiries") && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buyer, email, phone..."
                  className="pl-8 pr-3 py-1.5 bg-[#0E0E0E] border border-[#222222] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44 sm:w-60 transition"
                />
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-neutral-300 hover:text-white transition border border-[#2A2A2A]"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#141414] border border-[#242424] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold">Total Quotes</span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{quotes.length}</div>
                  <p className="text-[11px] text-neutral-500">
                    In-app quote submissions from calculators & shop
                  </p>
                </div>

                <div className="bg-[#141414] border border-[#242424] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold">Bulk Inquiries</span>
                    <Layers className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{enquiries.length}</div>
                  <p className="text-[11px] text-neutral-500">
                    High volume factory tech-pack submissions
                  </p>
                </div>

                <div className="bg-[#141414] border border-[#242424] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold">Studio Designs</span>
                    <Palette className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{designs.length}</div>
                  <p className="text-[11px] text-neutral-500">
                    Customer mockups created in 2D Studio
                  </p>
                </div>

                <div className="bg-[#141414] border border-[#242424] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold">Order Pipeline</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {formatINR(totalQuoteValue)}
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Across {totalUnits} total garment units requested
                  </p>
                </div>
              </div>

              {/* Recent Quotes List */}
              <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">
                    Recent Quote Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab("quotes")}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    View All Quotes →
                  </button>
                </div>

                {quotes.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    No quotes submitted yet. Orders from the Price Estimator, Shop, and Cart will appear here.
                  </div>
                ) : (
                  <div className="divide-y divide-[#242424]">
                    {quotes.slice(0, 5).map((q, idx) => (
                      <div key={q._id || idx} className="py-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">
                            {q.customerName}
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span>{q.phone}</span>
                            {q.email && <span>• {q.email}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-amber-400 block">
                            {formatINR(q.total || q.subtotal || 0)}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES & RFQs */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              <span className="text-xs text-neutral-400 font-semibold block">
                Showing {filteredQuotes.length} customer quote requests
              </span>

              {filteredQuotes.length === 0 ? (
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-12 text-center text-neutral-500 text-xs">
                  No quote requests found matching your filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map((q, idx) => (
                    <div
                      key={q._id || idx}
                      className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4 hover:border-[#2A2A2A] transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424]/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">
                              {q.customerName}
                            </span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                              RFQ #{q._id ? q._id.slice(-6).toUpperCase() : `Q${idx + 1}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-400" /> {q.phone}
                            </span>
                            {q.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-amber-400" /> {q.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-neutral-500">
                              <Calendar className="w-3 h-3" />{" "}
                              {q.createdAt
                                ? new Date(q.createdAt).toLocaleString()
                                : "Recent"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `Customer: ${q.customerName}\nPhone: ${q.phone}\nEmail: ${q.email || "N/A"}\nAmount: ₹${q.total || q.subtotal}`,
                                q._id || String(idx)
                              )
                            }
                            className="p-2 rounded-lg bg-[#1E1E1E] hover:bg-[#282828] text-neutral-300 text-xs font-semibold flex items-center gap-1 border border-[#2A2A2A] transition"
                            title="Copy Contact Info"
                          >
                            {copiedId === (q._id || String(idx)) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <div className="text-right">
                            <span className="text-lg font-black text-amber-400 block">
                              {formatINR(q.total || q.subtotal || 0)}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              incl. 5% GST
                            </span>
                          </div>
                        </div>
                      </div>

                      {q.items && q.items.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Requested Line Items
                          </span>
                          <div className="divide-y divide-[#242424]/60 bg-[#0E0E0E]/60 border border-[#242424] rounded-xl p-3">
                            {q.items.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-white block">
                                      {item.productName || item.productId}
                                    </span>
                                    {item.color && (
                                      <span className="px-2 py-0.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-md text-neutral-200 text-[11px] font-medium">
                                        Color: {item.color}
                                      </span>
                                    )}
                                    {item.printType && (
                                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-300 text-[10px] font-bold">
                                        {item.printType} {item.printSize ? `(${item.printSize.toUpperCase()})` : ""}
                                      </span>
                                    )}
                                  </div>

                                  {/* PROMINENT SIZE BREAKDOWN BADGES */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider mr-1">
                                      Sizes Breakdown:
                                    </span>
                                    {(() => {
                                      const rawSizes = item.sizes;
                                      let entries: [string, number][] = [];
                                      if (rawSizes) {
                                        if (typeof rawSizes === "string") {
                                          try {
                                            const parsed = JSON.parse(rawSizes);
                                            if (typeof parsed === "object" && parsed !== null) {
                                              entries = Object.entries(parsed)
                                                .map(([k, v]) => [k, Number(v)] as [string, number])
                                                .filter(([_, qty]) => qty > 0);
                                            }
                                          } catch {
                                            const matches = Array.from(rawSizes.matchAll(/([A-Z0-9]+)\s*[:×xX-]\s*(\d+)/gi));
                                            for (const m of matches) {
                                              if (Number(m[2]) > 0) entries.push([m[1].toUpperCase(), Number(m[2])]);
                                            }
                                          }
                                        } else if (rawSizes instanceof Map) {
                                          entries = Array.from(rawSizes.entries())
                                            .map(([k, v]) => [k, Number(v)] as [string, number])
                                            .filter(([_, qty]) => qty > 0);
                                        } else if (typeof rawSizes === "object") {
                                          entries = Object.entries(rawSizes)
                                            .map(([k, v]) => [k, Number(v)] as [string, number])
                                            .filter(([_, qty]) => qty > 0);
                                        }
                                      }

                                      if (entries.length > 0) {
                                        return entries.map(([sizeName, qty]) => (
                                          <span
                                            key={sizeName}
                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black shadow-xs"
                                          >
                                            <span className="text-amber-200">{sizeName}</span>
                                            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black text-[10px]">
                                              {qty} pcs
                                            </span>
                                          </span>
                                        ));
                                      }

                                      return (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#1E1E1E] text-neutral-300 text-xs font-semibold">
                                          {item.quantity ? `${item.quantity} pcs (Assorted / Standard)` : "Standard"}
                                        </span>
                                      );
                                    })()}

                                    {item.designPreviewUrl && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPreviewModal({
                                            isOpen: true,
                                            imageUrl: item.designPreviewUrl,
                                            title: `${item.productName || "Custom Garment"} (${item.color || "Design"})`,
                                            customer: q.customerName,
                                            phone: q.phone,
                                            designId: q._id,
                                          });
                                        }}
                                        className="ml-2 text-amber-400 hover:text-amber-300 underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        View Mockup
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right text-xs">
                                  <span className="font-bold text-neutral-200">
                                    {item.quantity} pcs @ ₹{item.unitPrice || 0}/pc
                                  </span>
                                  <span className="text-neutral-400 block text-[11px]">
                                    = {formatINR(item.totalPrice || item.quantity * (item.unitPrice || 0))}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.notes && (
                        <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222]/80 text-xs text-neutral-300">
                          <span className="font-bold text-amber-400 block mb-0.5">
                            Customer Notes:
                          </span>
                          {q.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STUDIO DESIGNS */}
          {activeTab === "designs" && (
            <div className="space-y-4">
              <span className="text-xs text-neutral-400 font-semibold block">
                Showing {designs.length} custom mockups saved from the 2D Studio
              </span>

              {designs.length === 0 ? (
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-12 text-center text-neutral-500 text-xs">
                  No customizer designs logged yet. Try customizing a shirt on `/design` and saving it!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designs.map((d, idx) => (
                    <div
                      key={d._id || idx}
                      className="bg-[#141414] border border-[#242424] rounded-2xl p-5 space-y-3 hover:border-[#2A2A2A] transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-full h-44 rounded-xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-center overflow-hidden relative group">
                          {(() => {
                            const candidateImg =
                              d.previewUrl ||
                              d.frontPreviewUrl ||
                              d.artworkUrl ||
                              d.backPreviewUrl ||
                              (d.uploadedAssets && d.uploadedAssets[0]) ||
                              (d.designId ? `/api/mockup/${d.designId}.jpg` : "/blanks/oversized-tee-250-gsm-french-terry-beige.jpg");

                            return (
                              <img
                                src={candidateImg}
                                alt={d.title || d.productName || "Custom design"}
                                className="max-h-full max-w-full object-contain p-2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/blanks/oversized-tee-250-gsm-french-terry-beige.jpg";
                                }}
                              />
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() => {
                              const img =
                                d.previewUrl ||
                                d.frontPreviewUrl ||
                                d.artworkUrl ||
                                d.backPreviewUrl ||
                                (d.uploadedAssets && d.uploadedAssets[0]) ||
                                (d.designId ? `/api/mockup/${d.designId}.jpg` : "/blanks/oversized-tee-250-gsm-french-terry-beige.jpg");
                              setPreviewModal({
                                isOpen: true,
                                imageUrl: img,
                                title: d.title || d.productName || "Custom Studio Design",
                                customer: d.customerName || "Customer",
                                phone: d.customerPhone,
                                designId: d.designId || d._id,
                                design: d,
                              });
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-white transition backdrop-blur-xs cursor-pointer z-10"
                          >
                            <span className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                              <ExternalLink className="w-4 h-4" />
                            </span>
                            <span>Open Full Mockup ↗</span>
                          </button>
                        </div>

                        <div>
                          <span className="text-xs font-black text-white block">
                            {d.productName || d.productId}
                          </span>
                          <span className="text-[11px] text-neutral-400 block">
                            Customer: {d.customerName || "Customer"}
                          </span>
                          {d.customerPhone && (
                            <span className="text-[11px] text-amber-400 block">
                              Phone: {d.customerPhone}
                            </span>
                          )}
                        </div>

                        {/* Production Tech Pack Specs Badge */}
                        <div className="p-2.5 rounded-xl bg-[#0E0E0E]/80 border border-[#242424] space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-amber-400 flex items-center gap-1">
                              <span>📐 Real Size:</span>
                              <span className="text-white">
                                {d.techPack?.realDimensionsInches || (d.printSize ? `${d.printSize.toUpperCase()} (11" × 16")` : '11" × 16"')}
                              </span>
                            </span>
                            <span className="text-neutral-400 text-[10px]">
                              {d.techPack?.realDimensionsCm || "DTF Standard"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-[#1E1E1E] text-amber-300 font-mono font-bold">
                              Scale: {d.techPack?.scalePercent ? `${d.techPack.scalePercent}%` : "100%"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#1E1E1E] text-cyan-300 font-mono font-bold">
                              Rot: {d.techPack?.rotationDegrees !== undefined ? `${d.techPack.rotationDegrees}°` : "0°"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#1E1E1E] text-neutral-300 capitalize">
                              Zone: {d.techPack?.viewSide || "Front"}
                            </span>
                            {d.techPack?.offsetX !== undefined && (
                              <span className="px-1.5 py-0.5 rounded bg-[#1E1E1E] text-neutral-400 font-mono">
                                Offset: X:{d.techPack.offsetX} Y:{d.techPack.offsetY}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {d.colorName && (
                            <span className="px-2 py-0.5 rounded bg-[#1E1E1E] text-neutral-300 font-semibold">
                              Color: {d.colorName}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                            {d.printType || "DTF Printing"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Download Artwork + Download Tech Pack */}
                      <div className="space-y-1.5 pt-1">
                        {(d.previewUrl || d.artworkUrl || d.frontPreviewUrl) && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const imgUrl = d.artworkUrl || d.previewUrl || d.frontPreviewUrl || (d.uploadedAssets && d.uploadedAssets[0]);
                                downloadMockupSafe(imgUrl, `artwork-${d.designId || d._id || "asset"}.png`);
                              }}
                              className="w-full py-2 px-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-[11px] font-bold text-white transition flex items-center justify-center gap-1 border border-[#2A2A2A] cursor-pointer"
                              title="Download customer artwork file"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              <span>Artwork</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => downloadTechPackSpec(d)}
                              className="w-full py-2 px-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-[11px] font-bold text-amber-400 hover:text-amber-300 transition flex items-center justify-center gap-1 border border-[#2A2A2A] cursor-pointer"
                              title="Download production RIP tech pack (.txt)"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>Tech Pack</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BULK ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              <span className="text-xs text-neutral-400 font-semibold block">
                Showing {filteredEnquiries.length} manufacturing inquiries
              </span>

              {filteredEnquiries.length === 0 ? (
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-12 text-center text-neutral-500 text-xs">
                  No bulk manufacturing enquiries received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map((e, idx) => (
                    <div
                      key={e._id || idx}
                      className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4 hover:border-[#2A2A2A] transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424]/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">
                              {e.name}
                            </span>
                            {e.company && (
                              <span className="text-[11px] bg-[#1E1E1E] text-neutral-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                <Building className="w-3 h-3 text-amber-400" /> {e.company}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                            <span>Phone: {e.phone}</span>
                            {e.email && <span>Email: {e.email}</span>}
                            <span className="text-neutral-500">
                              {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </div>

                        {e.fileUrl && (
                          <a
                            href={e.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="px-3.5 py-1.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] border border-[#2A2A2A] text-xs font-bold text-amber-400 flex items-center gap-1.5 transition"
                          >
                            <Download className="w-3.5 h-3.5" /> Attached Tech-Pack
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-[#0E0E0E] border border-[#222222] rounded-xl">
                          <span className="text-neutral-500 text-[10px] uppercase font-bold block">
                            Requested Garment
                          </span>
                          <span className="font-bold text-white mt-0.5 block">
                            {e.apparelType || "Custom Garment"}
                          </span>
                        </div>
                        <div className="p-3 bg-[#0E0E0E] border border-[#222222] rounded-xl">
                          <span className="text-neutral-500 text-[10px] uppercase font-bold block">
                            Target Quantity
                          </span>
                          <span className="font-bold text-amber-400 mt-0.5 block">
                            {e.quantity ? `${e.quantity} pcs` : "Not specified"}
                          </span>
                        </div>
                        <div className="p-3 bg-[#0E0E0E] border border-[#222222] rounded-xl">
                          <span className="text-neutral-500 text-[10px] uppercase font-bold block">
                            Print Technique
                          </span>
                          <span className="font-bold text-white mt-0.5 block">
                            {e.printingType || "DTF / Screen"}
                          </span>
                        </div>
                      </div>

                      {e.details && (
                        <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] text-xs text-neutral-300">
                          <span className="font-bold text-amber-400 block mb-0.5">
                            Order Details:
                          </span>
                          {e.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BLANKS CATALOG & IMAGE UPLOAD */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Wholesale Blank Silhouettes & Image Management
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    View and upload official blank t-shirt photos (Front & Back) directly to Cloudinary for your live catalog.
                  </p>
                </div>
                {catalogProducts.length > 0 && (
                  <button
                    onClick={() => openBlankUploadModal(catalogProducts[0], 0)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition self-start sm:self-auto"
                  >
                    <Camera className="w-4 h-4" />
                    Upload Blank T-Shirt Images
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {catalogProducts.map((p) => {
                  const pColors = p.colours || p.colors || [];
                  const activeColor = pColors[0] || {};
                  const frontImg = activeColor.front || activeColor.photoFront;
                  const backImg = activeColor.back || activeColor.photoBack;

                  return (
                    <div
                      key={p.id}
                      className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-5 hover:border-[#2A2A2A] transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                            {p.fit} • {p.gsm} GSM
                          </span>
                          <h4 className="text-base font-black text-white mt-0.5">
                            {p.name}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1">{p.fabric}</p>
                        </div>
                        <span className="text-sm font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-xl shrink-0">
                          ₹{p.basePrice}/pc base
                        </span>
                      </div>

                      {/* Blank Photos Preview Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            Blank Garment Photos ({activeColor.name || "Default"})
                          </span>
                          <button
                            onClick={() => openBlankUploadModal(p, 0)}
                            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload / Change Photos
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-36 rounded-xl bg-[#0E0E0E] border border-[#222222]/80 p-2 flex flex-col items-center justify-center relative group overflow-hidden">
                            {frontImg ? (
                              <img
                                src={frontImg}
                                alt={`${p.name} Front`}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-center text-neutral-600 text-xs">
                                <Camera className="w-6 h-6 mx-auto mb-1 text-neutral-700" />
                                No Front Image
                              </div>
                            )}
                            <span className="absolute bottom-1 left-2 text-[9px] font-bold uppercase tracking-wider bg-[#141414]/80 text-neutral-300 px-1.5 py-0.5 rounded">
                              Front
                            </span>
                          </div>

                          <div className="h-36 rounded-xl bg-[#0E0E0E] border border-[#222222]/80 p-2 flex flex-col items-center justify-center relative group overflow-hidden">
                            {backImg ? (
                              <img
                                src={backImg}
                                alt={`${p.name} Back`}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-center text-neutral-600 text-xs">
                                <Camera className="w-6 h-6 mx-auto mb-1 text-neutral-700" />
                                No Back Image
                              </div>
                            )}
                            <span className="absolute bottom-1 left-2 text-[9px] font-bold uppercase tracking-wider bg-[#141414]/80 text-neutral-300 px-1.5 py-0.5 rounded">
                              Back
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Volume Tier Table */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                          Volume Pricing Tiers
                        </span>
                        <div className="grid grid-cols-5 gap-1 text-center text-xs">
                          {(p.tiers || p.prices || []).map((t: any, tIdx: number) => (
                            <div
                              key={tIdx}
                              className="p-2 bg-[#0E0E0E] border border-[#222222] rounded-lg"
                            >
                              <span className="text-[10px] text-neutral-400 block">
                                {t.label}
                              </span>
                              <span className="font-black text-white text-xs mt-0.5 block">
                                ₹{t.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Available Colors */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                          Available Colors ({pColors.length}) — Click to upload photos:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {pColors.map((c: any, cIdx: number) => (
                            <button
                              key={cIdx}
                              onClick={() => openBlankUploadModal(p, cIdx)}
                              title={`Click to edit photos for ${c.name}`}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E0E0E] border border-[#222222] text-[11px] text-neutral-300 hover:border-amber-400 hover:text-white transition group"
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-[#2A2A2A] shrink-0"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                              <Upload className="w-2.5 h-2.5 text-neutral-500 group-hover:text-amber-400 transition ml-0.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SUPERADMIN-ONLY DEVELOPER CONSOLE */}
          {activeTab === "developer" && userRole === "superadmin" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      Superadmin Developer Console
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        Full Access
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Technical utilities, database seeder, Cloudinary sync, and system diagnostics.
                    </p>
                  </div>
                </div>
              </div>

              {seedMessage && (
                <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{seedMessage}</span>
                  </div>
                  <button onClick={() => setSeedMessage(null)} className="text-amber-400 hover:text-white">
                    ✕
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Seeder Control */}
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-white">
                      MongoDB Catalog Seeder
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Safely populates or synchronizes the 6 authoritative blank silhouettes, volume discount tiers, and print zones into your MongoDB collection `products`.
                  </p>
                  <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] text-[11px] text-neutral-400 space-y-1">
                    <p>• Uses upsert logic based on product slug (safe to re-run anytime).</p>
                    <p>• Does not overwrite customer quotes or uploaded artwork.</p>
                  </div>
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    {seeding ? "Executing Database Seed..." : "Execute 1-Click Database Seed"}
                  </button>
                </div>

                {/* Backups & Data Export */}
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-black text-white">
                      Data Export & Backups
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Download complete snapshot backups of customer quotes, custom designs, and inquiries for bookkeeping or external invoicing.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#0E0E0E] border border-[#222222] text-center">
                      <span className="text-neutral-500 text-[10px] block">Quotes Logged</span>
                      <span className="font-black text-white text-base mt-0.5 block">{quotes.length}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0E0E0E] border border-[#222222] text-center">
                      <span className="text-neutral-500 text-[10px] block">Designs Saved</span>
                      <span className="font-black text-white text-base mt-0.5 block">{designs.length}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleExportQuotesBackup}
                    className="w-full py-3 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#2A2A2A] transition"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    Export Quotes to JSON File
                  </button>
                </div>

                {/* System Environment Check */}
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-white">
                      Environment Architecture & Status
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-between">
                      <span className="text-neutral-400">Database Engine</span>
                      <span className="font-mono text-emerald-400 font-bold">MongoDB Atlas</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-between">
                      <span className="text-neutral-400">Media CDN Storage</span>
                      <span className="font-mono text-emerald-400 font-bold">Cloudinary v2 API</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-between">
                      <span className="text-neutral-400">Admin Account</span>
                      <span className="font-mono text-neutral-300">process.env.ADMIN_EMAIL</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-between">
                      <span className="text-neutral-400">Superadmin Account</span>
                      <span className="font-mono text-amber-400 font-bold">process.env.SUPERADMIN_EMAIL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Blank T-Shirt Image Upload */}
          {selectedProductForUpload && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-[#141414] border border-[#242424] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative my-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Cloudinary Asset Manager
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">
                      Upload Blank T-Shirt Images
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {selectedProductForUpload.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProductForUpload(null)}
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {blankSaveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{blankSaveSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 block">
                    Target Color Variant
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProductForUpload.colours || selectedProductForUpload.colors || []).map(
                      (c: any, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleColorChange(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                            uploadColorIdx === idx
                              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                              : "bg-[#0E0E0E] text-neutral-300 border-[#242424] hover:bg-[#1E1E1E]"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Front View</span>
                      {frontBlankUrl && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>

                    <div className="h-40 rounded-xl bg-[#141414] border border-[#242424] flex items-center justify-center overflow-hidden p-2 relative group">
                      {frontBlankUrl ? (
                        <img
                          src={frontBlankUrl}
                          alt="Front Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-neutral-600 text-xs">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 text-neutral-700" />
                          Select front photo
                        </div>
                      )}
                    </div>

                    <label className="w-full py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-bold text-white text-center cursor-pointer transition flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploadingFront ? "Uploading to Cloudinary..." : "Select Front Photo"}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => handleUploadBlankImage(e, "front")}
                        className="hidden"
                        disabled={uploadingFront}
                      />
                    </label>
                  </div>

                  <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Back View</span>
                      {backBlankUrl && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>

                    <div className="h-40 rounded-xl bg-[#141414] border border-[#242424] flex items-center justify-center overflow-hidden p-2 relative group">
                      {backBlankUrl ? (
                        <img
                          src={backBlankUrl}
                          alt="Back Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-neutral-600 text-xs">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 text-neutral-700" />
                          Select back photo
                        </div>
                      )}
                    </div>

                    <label className="w-full py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-bold text-white text-center cursor-pointer transition flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploadingBack ? "Uploading to Cloudinary..." : "Select Back Photo"}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => handleUploadBlankImage(e, "back")}
                        className="hidden"
                        disabled={uploadingBack}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveBlankImages}
                    disabled={savingBlank || (!frontBlankUrl && !backBlankUrl)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Database className="w-4 h-4 text-slate-950" />
                    {savingBlank ? "Saving to Database..." : "Save Blank Photos to Cloudinary & Catalog"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Full Mockup Lightbox Inspection Modal */}
          {previewModal && (
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={() => setPreviewModal(null)}
            >
              <div
                className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-5 sm:p-6 max-w-3xl w-full space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Customizer High-Resolution Preview
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                      {previewModal.title || "Custom Studio Design"}
                    </h3>
                    {(previewModal.customer || previewModal.phone) && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Customer: <span className="text-neutral-200 font-semibold">{previewModal.customer || "Customer"}</span>
                        {previewModal.phone && (
                          <span className="text-amber-400 ml-2">({previewModal.phone})</span>
                        )}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewModal(null)}
                    className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-[#1E1E1E] transition cursor-pointer"
                    title="Close preview (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Mockup Image Container */}
                <div className="w-full max-h-[55vh] min-h-[240px] rounded-2xl bg-[#0E0E0E] border border-[#222222] flex items-center justify-center overflow-hidden p-3 relative group">
                  <img
                    src={previewModal.imageUrl}
                    alt={previewModal.title || "Custom mockup full view"}
                    className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-lg select-none"
                  />
                </div>

                {/* Factory Production Tech Pack Spec Panel */}
                <div className="rounded-2xl bg-[#0E0E0E] border border-[#222222] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Factory Print Tech Pack & RIP Measurements</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ID: {previewModal.designId || "Custom"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-tight block">Real Printable Size</span>
                      <span className="font-bold text-white text-sm block">
                        {previewModal.design?.techPack?.realDimensionsInches || "11\" × 16\""}
                      </span>
                      <span className="text-[10px] text-amber-400 block font-semibold">
                        {previewModal.design?.techPack?.realDimensionsCm || "27.9 × 40.6 cm"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-tight block">Scaling Ratio</span>
                      <span className="font-bold text-amber-300 text-sm block font-mono">
                        {previewModal.design?.techPack?.scalePercent ? `${previewModal.design.techPack.scalePercent}%` : "100%"}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        Template: {previewModal.design?.techPack?.nominalSizeLabel || previewModal.design?.printSize?.toUpperCase() || "A3"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-tight block">Rotation Angle</span>
                      <span className="font-bold text-cyan-300 text-sm block font-mono">
                        {previewModal.design?.techPack?.rotationDegrees !== undefined ? `${previewModal.design.techPack.rotationDegrees}°` : "0°"}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">Clockwise</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-tight block">Zone & Alignment</span>
                      <span className="font-bold text-neutral-200 text-xs block capitalize">
                        {previewModal.design?.techPack?.viewSide || "Front"} View
                      </span>
                      <span className="text-[10px] text-neutral-500 block font-mono">
                        X:{previewModal.design?.techPack?.offsetX || 0}px Y:{previewModal.design?.techPack?.offsetY || 0}px
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        downloadMockupSafe(
                          previewModal.imageUrl,
                          `mockup-${previewModal.designId || "custom"}.png`
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download PNG Mockup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadTechPackSpec(
                          previewModal.design || {
                            designId: previewModal.designId,
                            title: previewModal.title,
                            customerName: previewModal.customer,
                            customerPhone: previewModal.phone,
                          }
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] border border-[#2A2A2A] text-amber-400 hover:text-amber-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Tech Pack (.txt)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openMockupSafe(previewModal.imageUrl, previewModal.designId)}
                      className="px-4 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] border border-[#2A2A2A] text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                      <span>Open in New Tab</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-neutral-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
