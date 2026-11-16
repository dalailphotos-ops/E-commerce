"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Database,
  FileText,
  Palette,
  RefreshCw,
  CheckCircle2,
  Lock,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"quotes" | "enquiries" | "designs">("quotes");
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

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <div className="max-w-md mx-auto my-32 p-8 text-center text-xs font-semibold text-slate-500">
        Checking admin access credentials...
      </div>
    );
  }

  // 2. Unauthenticated State — Show Login Card
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Asson Staff Admin
            </h1>
            <p className="text-xs text-slate-500">
              Enter the admin email and password configured in your environment.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@assonclothing.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {loggingIn ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            Backoffice Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Asson Clothing Brand Staff Admin
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time MongoDB documents & Cloudinary artwork storage management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Database className="w-3.5 h-3.5" />
            {seeding ? "Seeding..." : "Seed Catalog into MongoDB"}
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {seedMessage && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("quotes")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "quotes"
              ? "bg-brand-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" /> Quotes ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "enquiries"
              ? "bg-brand-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" /> Bulk Enquiries ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("designs")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "designs"
              ? "bg-brand-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Palette className="w-4 h-4" /> Studio Designs ({designs.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "quotes" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {quotes.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No quotes logged in MongoDB yet. Submit a quote from Design Studio
              or Price Estimator to see it appear here!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Items / Garments</th>
                    <th className="p-4">Total (₹)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">
                        {q.customerName}
                      </td>
                      <td className="p-4 text-slate-600">{q.phone}</td>
                      <td className="p-4 text-slate-600">
                        {q.items?.map((it: any, i: number) => (
                          <div key={i} className="text-[11px]">
                            • {it.quantity}x {it.productName} ({it.printType || "Blank"})
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        ₹{q.total?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          {q.status || "pending"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "enquiries" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {enquiries.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No bulk enquiries logged in MongoDB yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Company / Name</th>
                    <th className="p-4">Apparel</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Attachment (Cloudinary)</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.map((e) => (
                    <tr key={e._id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">
                        {e.company ? `${e.company} (${e.name})` : e.name}
                      </td>
                      <td className="p-4 text-slate-600">{e.apparelType}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {e.quantity} pcs
                      </td>
                      <td className="p-4 text-slate-600">
                        {e.phone} · {e.email}
                      </td>
                      <td className="p-4">
                        {e.attachments && e.attachments.length > 0 ? (
                          <a
                            href={e.attachments[0]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent hover:underline flex items-center gap-1 font-semibold"
                          >
                            View File <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {e.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "designs" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {designs.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No studio designs saved yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {designs.map((d) => (
                <div
                  key={d._id}
                  className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50"
                >
                  <div className="h-44 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                    {d.frontPreviewUrl ? (
                      <img
                        src={d.frontPreviewUrl}
                        alt="Design preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Palette className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {d.productName} ({d.colorName})
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Print: {d.printType} ({d.printSize})
                    </p>
                    <p className="text-[11px] font-bold text-amber-600 mt-1">
                      Est. Total: ₹{d.estimatedPrice?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Client Phone: {d.customerPhone || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
