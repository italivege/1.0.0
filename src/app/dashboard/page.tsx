"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface Company {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

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

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("italive-core");
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [selectedHostname, setSelectedHostname] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [customDeviceName, setCustomDeviceName] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [newCompName, setNewCompName] = useState<string>("");
  const [newCompId, setNewCompId] = useState<string>("");

  const fetchDashboardData = useCallback(async (compId: string) => {
    try {
      const res = await fetch(`/api/logs?company_id=${encodeURIComponent(compId)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
        const strictCompanyLogs = (data.logs || []).filter(
          (l: SecurityLog) => l.company_id === compId
        );
        setLogs(strictCompanyLogs);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLogs([]);
    setSelectedHostname("ALL");
    setLoading(true);

    fetchDashboardData(selectedCompany);
    const interval = setInterval(() => {
      fetchDashboardData(selectedCompany);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedCompany, fetchDashboardData]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newCompId) return;

    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_company",
        name: newCompName,
        id: newCompId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCompanies(data.companies);
      setSelectedCompany(newCompId.toLowerCase().replace(/[^a-z0-9-_]/g, "-"));
      setNewCompName("");
      setNewCompId("");
      setShowAddModal(false);
    }
  };

  const companyUniqueLogs = useMemo(() => {
    const seen = new Set<string>();
    return logs.filter((log) => {
      if (log.company_id !== selectedCompany) return false;
      const key = `${log.hostname}|${log.signature}|${log.src_ip}|${log.dest_ip}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [logs, selectedCompany]);

  const uniqueHostnames = useMemo(() => {
    return Array.from(new Set(companyUniqueLogs.map((l) => l.hostname)));
  }, [companyUniqueLogs]);

  const filteredLogs = useMemo(() => {
    if (selectedHostname === "ALL") return companyUniqueLogs;
    return companyUniqueLogs.filter((l) => l.hostname === selectedHostname);
  }, [companyUniqueLogs, selectedHostname]);

  const criticalCount = filteredLogs.filter((l) => l.severity === 1).length;
  const activeCompanyObj = companies.find((c) => c.id === selectedCompany);

  // 1-ხაზიანი საინსტალაციო ბრძანება კონკრეტული კომპანიისა და მოწყობილობისთვის
// სრული 1-ხაზიანი ავტო-ინსტალატორი ნებისმიერი ახალი Ubuntu სერვერისთვის
const deployCommand = `sudo apt update && sudo apt install -y suricata curl && \\
sudo suricata-update && sudo systemctl restart suricata && \\
sudo systemctl stop italive-guardian 2>/dev/null || true && \\
sudo curl -fL https://www.italive.ge/italive-guardian.bin -o /usr/local/bin/italive-guardian && \\
sudo chmod +x /usr/local/bin/italive-guardian && \\
sudo mkdir -p /etc/italive && cat << 'EOF' | sudo tee /etc/italive/guardian.conf > /dev/null
COMPANY_ID="${selectedCompany}"
COMPANY_TOKEN="${activeCompanyObj?.token || ""}"
DEVICE_NAME="${customDeviceName.trim()}"
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
sudo systemctl daemon-reload && sudo systemctl reset-failed italive-guardian 2>/dev/null || true && sudo systemctl enable --now italive-guardian && sudo systemctl restart italive-guardian && sudo systemctl status italive-guardian --no-pager`;

  const copyCommand = () => {
    navigator.clipboard.writeText(deployCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-2 tracking-widest uppercase">
            SIEM // MULTI-TENANT GUARDIAN
          </div>
          <h1 className="text-3xl md:text-4xl font-[var(--font-orbitron)] font-bold text-white">
            SECURITY <span className="neon-text">DASHBOARD</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setShowDeployModal(!showDeployModal);
              setShowAddModal(false);
            }}
            className="btn-neon btn-solid text-xs py-2.5 px-5"
          >
            ⚡ DEPLOY AGENT ({selectedCompany})
          </button>
          <button
            onClick={() => {
              setShowAddModal(!showAddModal);
              setShowDeployModal(false);
            }}
            className="btn-neon text-xs py-2.5 px-5"
          >
            + ADD COMPANY
          </button>
        </div>
      </div>

      {/* მოწყობილობაზე აგენტის დაყენების გენერატორი */}
      {showDeployModal && (
        <div className="tech-panel p-6 neon-border mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-[var(--font-orbitron)] text-cyan-400 text-sm uppercase">
                DEPLOY GUARDIAN NODE FOR: <span className="text-white">{activeCompanyObj?.name}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                ეს კონფიგურაცია იყენებს მხოლოდ ამ კომპანიის დაცულ ტოკენს. სხვა კომპანიის ლოგებთან წვდომა შეუძლებელია.
              </p>
            </div>
            <button onClick={() => setShowDeployModal(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-cyan-400 font-[var(--font-orbitron)] mb-1">
                CUSTOM DEVICE HOSTNAME (არასავალდებულო)
              </label>
              <input
                type="text"
                placeholder="მაგ: branch-router-01 (ცარიელი = სისტემური /etc/hostname)"
                className="tech-input font-mono text-xs"
                value={customDeviceName}
                onChange={(e) => setCustomDeviceName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-cyan-400 font-[var(--font-orbitron)] mb-1">
                UNIQUE COMPANY TOKEN
              </label>
              <input
                type="text"
                readOnly
                value={activeCompanyObj?.token || ""}
                className="tech-input font-mono text-xs text-green-400"
              />
            </div>
          </div>

          <div className="bg-[#02060d] border border-cyan-500/30 rounded p-4 font-mono text-xs text-cyan-300 overflow-x-auto relative">
            <pre className="whitespace-pre-wrap">{deployCommand}</pre>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={copyCommand} className="btn-neon btn-solid text-xs py-2 px-6">
              {copied ? "✓ COPIED TO CLIPBOARD!" : "COPY CONFIGURATION COMMAND"}
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="tech-panel p-6 neon-border mb-8">
          <h3 className="font-[var(--font-orbitron)] text-cyan-400 text-sm mb-4 uppercase">
            REGISTER NEW SUB-COMPANY (TENANT)
          </h3>
          <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-400 font-[var(--font-orbitron)] mb-1">
                COMPANY NAME
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: TBC Leasing"
                className="tech-input"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-[var(--font-orbitron)] mb-1">
                COMPANY ID
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: tbc-leasing"
                className="tech-input font-mono"
                value={newCompId}
                onChange={(e) => setNewCompId(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-neon btn-solid py-3 px-6 w-full">
                CREATE NODE
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-neon py-3 px-4"
              >
                ✕
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="tech-panel p-5 neon-border">
            <h3 className="font-[var(--font-orbitron)] text-xs text-cyan-400 tracking-wider uppercase mb-4 border-b border-cyan-900/50 pb-2">
              ORGANIZATIONS ({companies.length})
            </h3>
            <div className="space-y-2">
              {companies.map((comp) => {
                const isSelected = comp.id === selectedCompany;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompany(comp.id)}
                    className={`w-full text-left p-3 rounded border transition-all flex flex-col gap-1 ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,243,255,0.3)]"
                        : "bg-[#050c17] border-cyan-900/40 text-gray-400 hover:border-cyan-500/50 hover:text-white"
                    }`}
                  >
                    <span className="font-[var(--font-orbitron)] text-sm font-bold">
                      {comp.name}
                    </span>
                    <span className="font-mono text-xs text-cyan-400/80">
                      ID: {comp.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tech-panel p-5 neon-border">
            <h3 className="font-[var(--font-orbitron)] text-xs text-cyan-400 tracking-wider uppercase mb-1">
              COMPANY DEVICES ({uniqueHostnames.length})
            </h3>
            <p className="font-mono text-[11px] text-gray-500 mb-4 border-b border-cyan-900/50 pb-2">
              Tenant: {selectedCompany}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedHostname("ALL")}
                className={`w-full text-left px-3 py-2 rounded font-mono text-xs border ${
                  selectedHostname === "ALL"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                🌐 ALL COMPANY DEVICES ({companyUniqueLogs.length})
              </button>

              {uniqueHostnames.length === 0 ? (
                <div className="text-xs font-mono text-gray-500 py-3 px-2">
                  ამ კომპანიაზე მოწყობილობა ჯერ არ ფიქსირდება.
                </div>
              ) : (
                uniqueHostnames.map((host) => (
                  <button
                    key={host}
                    onClick={() => setSelectedHostname(host)}
                    className={`w-full text-left px-3 py-2 rounded font-mono text-xs border flex justify-between items-center ${
                      selectedHostname === host
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "border-cyan-900/30 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🖥️ {host}</span>
                    <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-400">
                      {companyUniqueLogs.filter((l) => l.hostname === host).length}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="tech-panel p-5 neon-border">
              <span className="text-xs font-[var(--font-orbitron)] text-gray-400 block mb-1">
                ACTIVE INFRASTRUCTURE
              </span>
              <span className="text-xl font-[var(--font-orbitron)] font-bold text-white truncate block">
                {activeCompanyObj?.name || selectedCompany}
              </span>
              <span className="font-mono text-xs text-cyan-400 mt-1 block">
                company_id: &quot;{selectedCompany}&quot;
              </span>
            </div>

            <div className="tech-panel p-5 neon-border">
              <span className="text-xs font-[var(--font-orbitron)] text-gray-400 block mb-1">
                COMPANY DEVICES
              </span>
              <span className="text-3xl font-mono font-bold text-cyan-400">
                {uniqueHostnames.length}
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                Active Hostnames in {selectedCompany}
              </span>
            </div>

            <div className="tech-panel p-5 neon-border">
              <span className="text-xs font-[var(--font-orbitron)] text-gray-400 block mb-1">
                UNIQUE ALERTS
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-mono font-bold text-white">
                  {filteredLogs.length}
                </span>
                {criticalCount > 0 && (
                  <span className="text-xs font-mono text-red-400 animate-pulse">
                    ({criticalCount} HIGH)
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 block mt-1">
                Deduplicated Events
              </span>
            </div>
          </div>

          <div className="tech-panel neon-border overflow-hidden">
            <div className="bg-[#050d1a] px-6 py-4 border-b border-cyan-500/30 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-mono text-xs text-cyan-400 ml-2">
                  STREAM // {selectedCompany.toUpperCase()} // HOST: {selectedHostname}
                </span>
              </div>
              <span className="font-mono text-xs text-gray-500">
                SHOWING {filteredLogs.length} UNIQUE EVENTS
              </span>
            </div>

            <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
              {loading && filteredLogs.length === 0 ? (
                <div className="text-center py-16 font-mono text-cyan-400 animate-pulse">
                  &gt; SYNCHRONIZING TELEMETRY STREAM...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <p className="font-[var(--font-orbitron)] text-gray-400 text-lg">
                    NO ALERTS DETECTED FOR {activeCompanyObj?.name.toUpperCase() || selectedCompany.toUpperCase()}
                  </p>
                  <p className="font-mono text-xs text-gray-500">
                    დააჭირე ზემოთ &quot;⚡ DEPLOY AGENT&quot; ღილაკს ამ კომპანიის მოწყობილობის დასაკავშირებლად.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-cyan-900/60 text-cyan-400 font-[var(--font-orbitron)] text-[11px]">
                      <th className="py-3 px-3">TIME</th>
                      <th className="py-3 px-3">HOSTNAME (DEVICE)</th>
                      <th className="py-3 px-3">SEVERITY</th>
                      <th className="py-3 px-3">THREAT SIGNATURE</th>
                      <th className="py-3 px-3">SOURCE IP ➔ TARGET IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-950/60">
                    {filteredLogs.map((log) => {
                      const timeStr = new Date(log.timestamp).toLocaleTimeString();
                      const sevBadge =
                        log.severity === 1
                          ? "bg-red-950/80 text-red-400 border-red-500/50"
                          : log.severity === 2
                          ? "bg-yellow-950/80 text-yellow-400 border-yellow-500/50"
                          : "bg-cyan-950/80 text-cyan-400 border-cyan-500/50";

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-cyan-500/5 transition-colors"
                        >
                          <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                            {timeStr}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="bg-[#0c1d36] border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded font-bold">
                              🖥️ {log.hostname}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded border text-[10px] ${sevBadge}`}>
                              SEV-{log.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-white font-semibold">
                            {log.signature}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-red-400">{log.src_ip}</span>
                            <span className="text-gray-600 mx-2">➔</span>
                            <span className="text-green-400">{log.dest_ip}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}