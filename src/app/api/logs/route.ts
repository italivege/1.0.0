import { NextResponse } from "next/server";

export interface SecurityLog {
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

export interface CompanyTenant {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

const ADMIN_SECRET = process.env.ITALIVE_ADMIN_SECRET || "itadesk2026admin";

const globalStore = globalThis as unknown as {
  italiveLogs: SecurityLog[];
  italiveCompanies: CompanyTenant[];
};

if (!globalStore.italiveCompanies) {
  globalStore.italiveCompanies = [
    {
      id: "italive-core",
      name: "ITalive Core Infrastructure",
      token: "ita_italivecore_default2026token",
      createdAt: new Date().toISOString(),
    },
  ];
}

if (!globalStore.italiveLogs) {
  globalStore.italiveLogs = [];
}

function isAuthorizedAdmin(request: Request): boolean {
  const adminHeader = request.headers.get("x-admin-secret");
  return Boolean(adminHeader && adminHeader === ADMIN_SECRET);
}

// GET /api/logs — ხელმისაწვდომია მხოლოდ ავტორიზებული Dashboard-იდან
export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      {
        error:
          "403 Forbidden — Direct access to ITalive Telemetry API is strictly prohibited.",
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("company_id");

  const filteredLogs = companyId
    ? globalStore.italiveLogs.filter((l) => l.company_id === companyId)
    : globalStore.italiveLogs;

  return NextResponse.json(
    {
      logs: filteredLogs,
      companies: globalStore.italiveCompanies,
    },
    { status: 200 }
  );
}

// POST /api/logs — იღებს ლოგებს მხოლოდ Rust აგენტიდან ან შიდა WAF სენსორიდან
export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    const internalSensor = request.headers.get("x-italive-sensor") || "";
    const companyToken = request.headers.get("x-company-token") || "";

    const isTrustedSource =
      userAgent.includes("ITaliveGuardian") ||
      internalSensor === "italive-waf-internal";

    if (!isTrustedSource) {
      return NextResponse.json(
        { error: "403 Forbidden — Untrusted Client Signature" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const companyId = body.company_id || "italive-core";

    const company = globalStore.italiveCompanies.find(
      (c) => c.id === companyId
    );
    if (!company || company.token !== companyToken) {
      return NextResponse.json(
        { error: "403 Forbidden — Invalid Company ID or Token" },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();
    const newLog: SecurityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      company_id: company.id,
      hostname: body.hostname || "unknown-host",
      signature: body.signature || "Unknown Security Event",
      category: body.category || "Security",
      severity: Number(body.severity) || 2,
      src_ip: body.src_ip || "0.0.0.0",
      dest_ip: body.dest_ip || "0.0.0.0",
      timestamp: body.timestamp && body.timestamp.trim() !== "" ? body.timestamp : nowIso,
    };

    // დუბლიკატად ითვლება მხოლოდ მაშინ, თუ იგივე შეტევა ბოლო 15 წამში უკვე შემოვიდა
    const isOnlineHeartbeat = newLog.signature.includes("AGENT ONLINE");
    const nowMs = Date.now();

    const isRecentDuplicate =
      !isOnlineHeartbeat &&
      globalStore.italiveLogs.slice(0, 30).some((existing) => {
        const existingMs = new Date(existing.timestamp).getTime() || 0;
        const within15Seconds = Math.abs(nowMs - existingMs) < 15000;
        return (
          within15Seconds &&
          existing.company_id === newLog.company_id &&
          existing.hostname === newLog.hostname &&
          existing.signature === newLog.signature &&
          existing.src_ip === newLog.src_ip &&
          existing.dest_ip === newLog.dest_ip
        );
      });

    if (!isRecentDuplicate) {
      globalStore.italiveLogs.unshift(newLog);
      if (globalStore.italiveLogs.length > 500) {
        globalStore.italiveLogs = globalStore.italiveLogs.slice(0, 500);
      }
    }

    return NextResponse.json(
      { status: "logged", id: newLog.id },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
  }
}

// PUT /api/logs — ახალი კომპანიის (Tenant) დამატება მხოლოდ ადმინისტრატორისთვის
export async function PUT(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "403 Forbidden" }, { status: 403 });
  }

  try {
    const { name, id } = await request.json();
    if (!name || !id) {
      return NextResponse.json(
        { error: "Name and ID required" },
        { status: 400 }
      );
    }

    const cleanId = id
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const exists = globalStore.italiveCompanies.some((c) => c.id === cleanId);
    if (exists) {
      return NextResponse.json(
        { error: "Company ID already exists" },
        { status: 409 }
      );
    }

    const randomPart =
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 10);
    const newCompany: CompanyTenant = {
      id: cleanId,
      name: name.trim(),
      token: `ita_${cleanId.replace(/-/g, "")}_${randomPart}`,
      createdAt: new Date().toISOString(),
    };

    globalStore.italiveCompanies.push(newCompany);
    return NextResponse.json({ company: newCompany }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 400 }
    );
  }
}

// DELETE /api/logs — ლოგების გასუფთავება მხოლოდ ადმინისტრატორისთვის
export async function DELETE(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "403 Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("company_id");

  if (companyId) {
    globalStore.italiveLogs = globalStore.italiveLogs.filter(
      (l) => l.company_id !== companyId
    );
  } else {
    globalStore.italiveLogs = [];
  }

  return NextResponse.json({ status: "cleared" }, { status: 200 });
}