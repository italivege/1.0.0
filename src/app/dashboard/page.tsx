"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface SecurityLog {
  id: string;
  company_id: string;
  hostname: string;
  signature: string;
  category: string;
  severity: number;
  src_ip: string;
  dest_ip: string;
  timestamp: string;
}

interface CompanyTenant {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

export default function DashboardPage() {
  // ავტორიზაციის State-ები
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // მულტი-ტენანტური და ლოგების State-ები
  const [companies, setCompanies] = useState<CompanyTenant[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("italive-core");
  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // UI & Modal State-ები
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [customDeviceName, setCustomDeviceName] = useState<string>("ubuntu-node-01");
  const [copiedDeploy, setCopiedDeploy] = useState<boolean>(false);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // ახალი კომპანიის დამატების State-ები
  const [newCompanyName, setNewCompanyName] = useState<string>("");
  const [newCompanyId, setNewCompanyId] = useState<string>("");
  const [showAddCompany, setShowAddCompany] = useState<boolean>(false);
  const [companyError, setCompanyError] = useState<string>("");

  const verifyAndLoadData = useCallback(
    async (secretToUse: string, companyFilter?: string) => {
      try {
        const targetCompany = companyFilter || selectedCompany;
        const res = await fetch(`/api/logs?company_id=${targetCompany}`, {
          headers: {
            "x-admin-secret": secretToUse,
          },
          cache: "no-store",
        });

        if (res.status === 403) {
          sessionStorage.removeItem("italive_admin_secret");
          setIsAuthenticated(false);
          setAuthError("არასწორი ადმინისტრატორის პაროლი!");
          setIsCheckingAuth(false);
          return false;
        }

        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          if (data.companies && data.companies.length > 0) {
            setCompanies(data.companies);
          }
          setLastUpdated(new Date().toLocaleTimeString());
          setIsAuthenticated(true);
          setAuthError("");
          setIsCheckingAuth(false);
          return true;
        }
      } catch {
        setAuthError("სერვერთან დაკავშირება ვერ მოხერხდა");
      }
      setIsCheckingAuth(false);
      return false;
    },
    [selectedCompany]
  );

  useEffect(() => {
    const savedSecret = sessionStorage.getItem("italive_admin_secret");
    if (savedSecret) {
      setAdminSecret(savedSecret);
      verifyAndLoadData(savedSecret);
    } else {
      setIsCheckingAuth(false);
    }
  }, [verifyAndLoadData]);

  useEffect(() => {
    if (!isAuthenticated || !adminSecret) return;
    const interval = setInterval(() => {
      verifyAndLoadData(adminSecret, selectedCompany);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, adminSecret, selectedCompany, verifyAndLoadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const trimmed = passwordInput.trim();
    if (!trimmed) return;

    const ok = await verifyAndLoadData(trimmed, selectedCompany);
    if (ok) {
      setAdminSecret(trimmed);
      sessionStorage.setItem("italive_admin_secret", trimmed);
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("italive_admin_secret");
    setAdminSecret("");
    setIsAuthenticated(false);
    setLogs([]);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyError("");
    if (!newCompanyName.trim() || !newCompanyId.trim()) return;

    const res = await fetch("/api/logs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ name: newCompanyName, id: newCompanyId }),
    });

    if (res.ok) {
      const data = await res.json();
      setCompanies((prev) => [...prev, data.company]);
      setSelectedCompany(data.company.id);
      setSelectedDevice("ALL");
      setNewCompanyName("");
      setNewCompanyId("");
      setShowAddCompany(false);
    } else {
      const errData = await res.json().catch(() => ({}));
      setCompanyError(errData.error || "კომპანიის შექმნა ვერ მოხერხდა");
    }
  };

  const handleClearLogs = async () => {
    await fetch(`/api/logs?company_id=${selectedCompany}`, {
      method: "DELETE",
      headers: {
        "x-admin-secret": adminSecret,
      },
    });
    setLogs([]);
  };

  const activeCompanyObj =
    companies.find((c) => c.id === selectedCompany) || companies[0];

  // უნიკალური მოწყობილობები და სტატისტიკა
  const devices = Array.from(new Set(logs.map((l) => l.hostname)));
  const criticalCount = logs.filter((l) => l.severity === 1).length;
  const warningCount = logs.filter((l) => l.severity === 2).length;
  const wafBlockedCount = logs.filter((l) =>
    l.signature.toUpperCase().includes("WAF BLOCKED")
  ).length;

  // ფილტრაცია მოწყობილობით, სიმძიმით და საძიებო სიტყვით
  const visibleLogs = logs.filter((log) => {
    const matchesDevice =
      selectedDevice === "ALL" || log.hostname === selectedDevice;
    const matchesSeverity =
      severityFilter === "ALL" || String(log.severity) === severityFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      log.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.src_ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dest_ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDevice && matchesSeverity && matchesSearch;
  });

  const deployCommand = `sudo apt update && sudo apt install -y suricata curl && \\
ACTIVE_IFACE=$(ip route get 8.8.8.8 | awk -- '{printf $5}') && \\
sudo sed -i "s/interface: eth0/interface: $ACTIVE_IFACE/g" /etc/suricata/suricata.yaml && \\
sudo suricata-update && sudo systemctl restart suricata && \\
sudo systemctl stop italive-guardian 2>/dev/null || true && \\
sudo curl -fL https://www.italive.ge/italive-guardian.bin -o /usr/local/bin/italive-guardian && \\
sudo chmod +x /usr/local/bin/italive-guardian && \\
sudo mkdir -p /etc/italive && cat << 'EOF' | sudo tee /etc/italive/guardian.conf > /dev/null
COMPANY_ID="${selectedCompany}"
COMPANY_TOKEN="${activeCompanyObj?.token || "ita_italivecore_default2026token"}"
DEVICE_NAME="${customDeviceName.trim() || "ubuntu-node"}"
API_URL="https://www.italive.ge/api/logs"
SURICATA_LOG="/var/log/suricata/eve.json"
EOF
sudo chmod 600 /etc/italive/guardian.conf && \\
cat << 'EOF' | sudo tee /etc/systemd/system/italive-guardian.service > /dev/null
[Unit]
Description=ITalive Security Telemetry Guardian Agent
After=network.target suricata.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/italive-guardian
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload && sudo systemctl reset-failed italive-guardian 2>/dev/null || true && sudo systemctl enable --now italive-guardian && sudo systemctl restart italive-guardian && sudo journalctl -u italive-guardian -n 10 --no-pager`;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        🔒 მოწმდება უსაფრთხოების სესია...
      </div>
    );
  }

  // ავტორიზაციის ეკრანი
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-2xl mb-3">
              🛡️
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              ITALIVE SIEM CONSOLE
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              წვდომა დაშვებულია მხოლოდ ავტორიზებული ადმინისტრატორისთვის
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="შეიყვანე ადმინისტრატორის პაროლი..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-400 text-xs text-center font-medium">
                ❌ {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-cyan-900/40"
            >
              შესვლა პანელში
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← მთავარ გვერდზე დაბრუნება
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              ← italive.ge
            </Link>
            <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-2">
              🛡️ ITALIVE GUARDIAN{" "}
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                ZERO-TRUST SIEM
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Multi-Tenant Security Telemetry & Active API Protection • განახლდა:{" "}
            <span className="text-cyan-400 font-mono">{lastUpdated || "LIVE"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeployModal(!showDeployModal)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-lg shadow-cyan-900/30"
          >
            ⚡ DEPLOY AGENT
          </button>
          <button
            onClick={handleClearLogs}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2.5 rounded-lg border border-slate-700 transition"
          >
            🗑️ გასუფთავება
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-950/60 hover:bg-red-900/70 text-red-300 text-sm px-4 py-2.5 rounded-lg border border-red-800/60 transition"
          >
            🔒 გასვლა
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase font-semibold">
            სულ ინციდენტები ({activeCompanyObj?.name})
          </div>
          <div className="text-3xl font-bold text-white mt-2">{logs.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            ● რეალურ დროში მონიტორინგი
          </div>
        </div>

        <div className="bg-slate-900 border border-red-900/40 rounded-xl p-4">
          <div className="text-xs text-red-400 uppercase font-semibold">
            კრიტიკული შეტევები (SEV-1)
          </div>
          <div className="text-3xl font-bold text-red-400 mt-2">
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            მაღალი რისკის საფრთხეები
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-4">
          <div className="text-xs text-amber-300 uppercase font-semibold">
            საეჭვო აქტივობა (SEV-2) / WAF
          </div>
          <div className="text-3xl font-bold text-amber-300 mt-2">
            {warningCount} <span className="text-sm text-slate-400 font-normal">(WAF: {wafBlockedCount})</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            დაბლოკილი სკანერები და ზონდირება
          </div>
        </div>

        <div className="bg-slate-900 border border-cyan-900/40 rounded-xl p-4">
          <div className="text-xs text-cyan-400 uppercase font-semibold">
            აქტიური სენსორები / სერვერები
          </div>
          <div className="text-3xl font-bold text-cyan-300 mt-2">
            {devices.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            დაკავშირებული ჰოსტები
          </div>
        </div>
      </div>

      {/* Active Tenant Token Bar */}
      {activeCompanyObj && (
        <div className="max-w-7xl mx-auto mt-4 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">აქტიური ტენანტი:</span>
            <span className="font-bold text-white">{activeCompanyObj.name}</span>
            <span className="bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded">
              ID: {activeCompanyObj.id}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Company Token:</span>
            <code className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-emerald-400 font-mono">
              {showToken
                ? activeCompanyObj.token
                : `${activeCompanyObj.token.slice(0, 10)}••••••••••••`}
            </code>
            <button
              onClick={() => setShowToken(!showToken)}
              className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              {showToken ? "დამალვა" : "ჩვენება"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeCompanyObj.token);
                setCopiedToken(true);
                setTimeout(() => setCopiedToken(false), 2000);
              }}
              className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded font-medium"
            >
              {copiedToken ? "✅ დაკოპირდა" : "📋 Copy Token"}
            </button>
          </div>
        </div>
      )}

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="max-w-7xl mx-auto mt-6 bg-slate-900 border border-cyan-500/40 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-cyan-400">
              ⚡ Linux აგენტის სწრაფი ინსტალაცია ({activeCompanyObj?.name})
            </h2>
            <button
              onClick={() => setShowDeployModal(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✕ დახურვა
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">
              სერვერის სახელი (DEVICE_NAME):
            </label>
            <input
              type="text"
              value={customDeviceName}
              onChange={(e) => setCustomDeviceName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white w-full max-w-xs"
              placeholder="მაგ: itad.signaling"
            />
          </div>
          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-xs text-cyan-300 overflow-x-auto">
            {deployCommand}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(deployCommand);
              setCopiedDeploy(true);
              setTimeout(() => setCopiedDeploy(false), 2000);
            }}
            className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded"
          >
            {copiedDeploy ? "✅ დაკოპირდა!" : "📋 ბრძანების დაკოპირება"}
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Companies & Devices */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                🏢 კომპანიები (Tenants)
              </h3>
              <button
                onClick={() => setShowAddCompany(!showAddCompany)}
                className="text-xs text-cyan-400 hover:underline"
              >
                + დამატება
              </button>
            </div>

            {showAddCompany && (
              <form onSubmit={handleCreateCompany} className="mb-3 space-y-2">
                <input
                  type="text"
                  placeholder="კომპანიის სახელი"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="ID (მაგ: tbc-bank)"
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
                {companyError && (
                  <p className="text-[11px] text-red-400">{companyError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-cyan-600 text-white text-xs py-1.5 rounded font-semibold"
                >
                  შექმნა
                </button>
              </form>
            )}

            <div className="space-y-1.5">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCompany(c.id);
                    setSelectedDevice("ALL");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedCompany === c.id
                      ? "bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 font-semibold"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div>{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.id}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              🖥️ COMPANY DEVICES ({devices.length})
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedDevice("ALL")}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
                  selectedDevice === "ALL"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                🌐 ყველა მოწყობილობა ({logs.length})
              </button>
              {devices.map((dev) => (
                <button
                  key={dev}
                  onClick={() => setSelectedDevice(dev)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    selectedDevice === dev
                      ? "bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span>🟢 {dev}</span>
                  <span className="text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                    {logs.filter((l) => l.hostname === dev).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs Table & Filters */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">
                📡 რეალური დროის უსაფრთხოების ლოგები ({visibleLogs.length})
              </span>
              <span className="text-xs text-emerald-400">
                ● Zero-Trust API Active
              </span>
            </div>

            {/* Search & Severity Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="ძებნა (IP, ჰოსტი, შეტევა)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs">
                <button
                  onClick={() => setSeverityFilter("ALL")}
                  className={`px-2.5 py-1 ${
                    severityFilter === "ALL"
                      ? "bg-cyan-600 text-white font-semibold"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  ყველა
                </button>
                <button
                  onClick={() => setSeverityFilter("1")}
                  className={`px-2.5 py-1 ${
                    severityFilter === "1"
                      ? "bg-red-600 text-white font-semibold"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  SEV-1
                </button>
                <button
                  onClick={() => setSeverityFilter("2")}
                  className={`px-2.5 py-1 ${
                    severityFilter === "2"
                      ? "bg-amber-600 text-white font-semibold"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  SEV-2
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/50">
                  <th className="py-3 px-4">დრო</th>
                  <th className="py-3 px-4">მოწყობილობა</th>
                  <th className="py-3 px-4">დონე</th>
                  <th className="py-3 px-4">ინციდენტი / Signature</th>
                  <th className="py-3 px-4">Source ➔ Target IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {visibleLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      ამ ფილტრით საეჭვო აქტივობა არ მოიძებნა.
                    </td>
                  </tr>
                ) : (
                  visibleLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300">
                        {log.hostname}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.severity === 1
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          SEV-{log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        <div>{log.signature}</div>
                        <div className="text-[11px] text-slate-500">
                          {log.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <span className="text-red-400">{log.src_ip}</span> ➔{" "}
                        <span className="text-emerald-400">{log.dest_ip}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}