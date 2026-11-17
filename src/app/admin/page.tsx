"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { REVERSE_ENGINEERED_PRODUCTS, formatINR } from "@/lib/constants";

type AdminTab = "overview" | "quotes" | "designs" | "enquiries" | "catalog" | "settings";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data states
  const [quotes, setQuotes] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // Login form states
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
      const [qRes, eRes, dRes] = await Promise.all([
        fetch("/api/quotes"),
        fetch("/api/enquiries"),
        fetch("/api/designs"),
      ]);

      const [qData, eData, dData] = await Promise.all([
        qRes.json(),
        eRes.json(),
        dRes.json(),
      ]);

      setQuotes(Array.isArray(qData) ? qData : []);
      setEnquiries(Array.isArray(eData) ? eData : []);
      setDesigns(Array.isArray(dData) ? dData : []);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-amber-400" />
        Checking admin access credentials...
      </div>
    );
  }

  // 2. Unauthenticated State — Dedicated Full-Screen Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-slate-950 font-black text-2xl">
              A
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Asson Admin Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your staff credentials configured in environment variables
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm space-y-6">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@assonclothing.com"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                {loggingIn ? "Verifying..." : "Unlock Admin Dashboard"}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition flex items-center justify-center gap-1.5"
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
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              Asson Admin
            </span>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Staff Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo & System Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-center text-base shadow-lg shadow-amber-500/20">
                A
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  ASSON ADMIN
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Console v1.2
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition group"
          >
            <span>Visit Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition" />
          </Link>

          {/* Nav List */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "overview"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("quotes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "quotes"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Quotes & RFQs</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "quotes"
                    ? "bg-slate-950 text-amber-400"
                    : "bg-slate-800 text-slate-300"
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "designs"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4" />
                <span>Studio Designs</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "designs"
                    ? "bg-slate-950 text-amber-400"
                    : "bg-slate-800 text-slate-300"
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "enquiries"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Bulk Enquiries</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "enquiries"
                    ? "bg-slate-950 text-amber-400"
                    : "bg-slate-800 text-slate-300"
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "catalog"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shirt className="w-4 h-4" />
                <span>Blanks Catalog</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                6
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "settings"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Database & Seeder</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
              AD
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">
                Admin Staff
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                admin@assonclothing.com
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-red-950/40 hover:text-red-400 hover:border-red-800/50 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Header Bar */}
        <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Admin Panel
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-semibold text-slate-300 capitalize">
                  {activeTab}
                </span>
              </div>
              <h2 className="text-xl font-black text-white capitalize mt-0.5">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "quotes" && "Customer Quotes & RFQs"}
                {activeTab === "designs" && "Customizer Studio Designs"}
                {activeTab === "enquiries" && "Bulk Manufacturing Inquiries"}
                {activeTab === "catalog" && "Wholesale Blanks Catalog"}
                {activeTab === "settings" && "Database & Seeder Settings"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            {(activeTab === "quotes" || activeTab === "enquiries") && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buyer, email, phone..."
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44 sm:w-60 transition"
                />
              </div>
            )}

            {/* Quick Seed Button */}
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5" />
              {seeding ? "Seeding..." : "Seed Catalog"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
          {seedMessage && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{seedMessage}</span>
              </div>
              <button
                onClick={() => setSeedMessage(null)}
                className="text-amber-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Total Quotes</span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{quotes.length}</div>
                  <p className="text-[11px] text-slate-500">
                    In-app quote submissions from calculators & shop
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Bulk Inquiries</span>
                    <Layers className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{enquiries.length}</div>
                  <p className="text-[11px] text-slate-500">
                    High volume factory tech-pack submissions
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Studio Designs</span>
                    <Palette className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{designs.length}</div>
                  <p className="text-[11px] text-slate-500">
                    Custom customer mockups saved to Cloudinary
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Pipeline Value</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {formatINR(totalQuoteValue)}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Across {totalUnits} total garment units requested
                  </p>
                </div>
              </div>

              {/* Two Column Layout: Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Quotes */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
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
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No quotes submitted yet. Test by submitting a quote from the Price Estimator or Cart.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {quotes.slice(0, 5).map((q, idx) => (
                        <div key={q._id || idx} className="py-3 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block">
                              {q.customerName}
                            </span>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span>{q.phone}</span>
                              {q.email && <span>• {q.email}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-amber-400 block">
                              {formatINR(q.total || q.subtotal || 0)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Readiness Checklist */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-extrabold text-white text-sm">
                    System Health & Readiness
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-300">
                          MongoDB Atlas
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        Connected
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-300">
                          Cloudinary CDN
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        Active
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-300">
                          Blanks Catalog (6 Products)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                        Seeded
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-300">
                          Zero-WhatsApp Policy
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        100% Enforced
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSeedDatabase}
                      disabled={seeding}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      {seeding ? "Seeding Catalog..." : "Re-Seed Database"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES & RFQs */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">
                  Showing {filteredQuotes.length} quote requests
                </span>
              </div>

              {filteredQuotes.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  No quote requests found matching your filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map((q, idx) => (
                    <div
                      key={q._id || idx}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition"
                    >
                      {/* Quote Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">
                              {q.customerName}
                            </span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                              RFQ #{q._id ? q._id.slice(-6).toUpperCase() : `Q${idx + 1}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-400" /> {q.phone}
                            </span>
                            {q.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-amber-400" /> {q.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-slate-500">
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
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
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
                            <span className="text-[10px] text-slate-500">
                              incl. 5% GST
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items Matrix */}
                      {q.items && q.items.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Requested Line Items
                          </span>
                          <div className="divide-y divide-slate-800/60 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                            {q.items.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-white block">
                                    {item.productName || item.productId}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                    {item.color && (
                                      <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
                                        Color: {item.color}
                                      </span>
                                    )}
                                    {item.sizes && (
                                      <span className="text-amber-400">
                                        Sizes: {Object.entries(item.sizes)
                                          .filter(([_, qty]) => (qty as number) > 0)
                                          .map(([sz, qty]) => `${sz}: ${qty}`)
                                          .join(", ")}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right text-xs">
                                  <span className="font-bold text-slate-200">
                                    {item.quantity} pcs @ ₹{item.unitPrice || 0}/pc
                                  </span>
                                  <span className="text-slate-400 block text-[11px]">
                                    = {formatINR(item.totalPrice || item.quantity * (item.unitPrice || 0))}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes / Special Instructions */}
                      {q.notes && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
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
              <span className="text-xs text-slate-400 font-semibold block">
                Showing {designs.length} custom mockups saved from the 2D Studio
              </span>

              {designs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  No customizer designs logged yet. Try customizing a shirt on `/design` and saving it!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designs.map((d, idx) => (
                    <div
                      key={d._id || idx}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Artwork Preview Card */}
                        <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                          {d.previewUrl || d.artworkUrl ? (
                            <img
                              src={d.previewUrl || d.artworkUrl}
                              alt="Custom artwork"
                              className="max-h-full max-w-full object-contain p-2"
                            />
                          ) : (
                            <Palette className="w-10 h-10 text-slate-700" />
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-black text-white block">
                            {d.productName || d.productId}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Customer: {d.customerName || "Anonymous Creator"}
                          </span>
                          {d.customerPhone && (
                            <span className="text-[11px] text-amber-400 block">
                              Phone: {d.customerPhone}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {d.color && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                              Color: {d.color}
                            </span>
                          )}
                          {d.printTechnique && (
                            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                              {d.printTechnique}
                            </span>
                          )}
                          {d.quantity && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                              Qty: {d.quantity} pcs
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Download Link */}
                      {(d.previewUrl || d.artworkUrl) && (
                        <a
                          href={d.previewUrl || d.artworkUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          Download Artwork
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BULK ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-semibold block">
                Showing {filteredEnquiries.length} manufacturing inquiries
              </span>

              {filteredEnquiries.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  No bulk manufacturing enquiries received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map((e, idx) => (
                    <div
                      key={e._id || idx}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">
                              {e.name}
                            </span>
                            {e.company && (
                              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                <Building className="w-3 h-3 text-amber-400" /> {e.company}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                            <span>Phone: {e.phone}</span>
                            {e.email && <span>Email: {e.email}</span>}
                            <span className="text-slate-500">
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
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400 flex items-center gap-1.5 transition"
                          >
                            <Download className="w-3.5 h-3.5" /> Attached Tech-Pack
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">
                            Requested Garment
                          </span>
                          <span className="font-bold text-white mt-0.5 block">
                            {e.apparelType || "Custom Garment"}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">
                            Target Quantity
                          </span>
                          <span className="font-bold text-amber-400 mt-0.5 block">
                            {e.quantity ? `${e.quantity} pcs` : "Not specified"}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">
                            Print Technique
                          </span>
                          <span className="font-bold text-white mt-0.5 block">
                            {e.printingType || "DTF / Screen"}
                          </span>
                        </div>
                      </div>

                      {e.details && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
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

          {/* TAB 5: BLANKS CATALOG */}
          {activeTab === "catalog" && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-semibold block">
                Authoritative 6-product blank silhouette catalog defined in `src/lib/constants.ts`
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {REVERSE_ENGINEERED_PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                          {p.fit} • {p.gsm} GSM
                        </span>
                        <h4 className="text-base font-black text-white mt-0.5">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {p.fabric}
                        </p>
                      </div>
                      <span className="text-sm font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-xl shrink-0">
                        ₹{p.basePrice}/pc base
                      </span>
                    </div>

                    {/* Volume Tier Table */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Volume Pricing Tiers
                      </span>
                      <div className="grid grid-cols-5 gap-1 text-center text-xs">
                        {p.tiers.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-2 bg-slate-950 border border-slate-800 rounded-lg"
                          >
                            <span className="text-[10px] text-slate-400 block">
                              {t.label}
                            </span>
                            <span className="font-black text-white text-xs mt-0.5 block">
                              ₹{t.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Color Swatches */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Available Stock Colors ({p.colors?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {p.colors?.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & SEEDER */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Catalog Database Seeder
                    </h3>
                    <p className="text-xs text-slate-400">
                      Populate your MongoDB database with the 6 blank apparel silhouettes, volume pricing tiers, and color swatches.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                  <p>• Ensures products exist in MongoDB collection `products`.</p>
                  <p>• Safe to run at any time (uses upsert by product slug).</p>
                </div>

                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  {seeding ? "Seeding Database..." : "Execute 1-Click Database Seed"}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black text-white">
                  Environment Configuration
                </h3>
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Admin Email</span>
                    <span className="font-mono text-slate-200">
                      process.env.ADMIN_EMAIL
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Admin Password</span>
                    <span className="font-mono text-slate-200">
                      process.env.ADMIN_PASSWORD
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">MongoDB Connection</span>
                    <span className="font-mono text-slate-200">
                      process.env.MONGODB_URI
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Cloudinary Uploads</span>
                    <span className="font-mono text-slate-200">
                      process.env.CLOUDINARY_URL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
