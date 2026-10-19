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
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const MAX_LOGS_LIMIT = 500; // მეხსიერების ავტომატური ლიმიტი

const DEFAULT_COMPANY: CompanyTenant = {
  id: "italive-core",
  name: "ITalive Core Infrastructure",
  token: "ita_italivecore_default2026token",
  createdAt: "2026-10-18T00:00:00.000Z",
};

// Fallback მეხსიერება (თუ Redis ჯერ არ არის მიბმული)
const globalStore = globalThis as unknown as {
  italiveLogs: SecurityLog[];
  italiveCompanies: CompanyTenant[];
};

if (!globalStore.italiveCompanies) {
  globalStore.italiveCompanies = [DEFAULT_COMPANY];
}
if (!globalStore.italiveLogs) {
  globalStore.italiveLogs = [];
}

// Upstash Redis REST API დამხმარე ფუნქცია
async function redisCmd(command: (string | number)[]) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(REDIS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

async function getCompanies(): Promise<CompanyTenant[]> {
  if (REDIS_URL && REDIS_TOKEN) {
    const raw = await redisCmd(["GET", "italive:companies"]);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CompanyTenant[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    await redisCmd(["SET", "italive:companies", JSON.stringify([DEFAULT_COMPANY])]);
    return [DEFAULT_COMPANY];
  }
  return globalStore.italiveCompanies;
}

async function saveCompanies(companies: CompanyTenant[]) {
  globalStore.italiveCompanies = companies;
  if (REDIS_URL && REDIS_TOKEN) {
    await redisCmd(["SET", "italive:companies", JSON.stringify(companies)]);
  }
}

async function getLogs(): Promise<SecurityLog[]> {
  if (REDIS_URL && REDIS_TOKEN) {
    const rawList = await redisCmd(["LRANGE", "italive:logs", 0, MAX_LOGS_LIMIT - 1]);
    if (Array.isArray(rawList)) {
      return rawList
        .map((item) => {
          try {
            return JSON.parse(item) as SecurityLog;
          } catch {
            return null;
          }
        })
        .filter((item): item is SecurityLog => item !== null);
    }
  }
  return globalStore.italiveLogs;
}

function isAuthorizedAdmin(request: Request): boolean {
  const adminHeader = request.headers.get("x-admin-secret");
  return Boolean(adminHeader && adminHeader === ADMIN_SECRET);
}

// GET /api/logs — კითხულობს მუდმივი ბაზიდან მხოლოდ ადმინისტრატორისთვის
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

  const [allLogs, companies] = await Promise.all([getLogs(), getCompanies()]);

  const filteredLogs = companyId
    ? allLogs.filter((l) => l.company_id === companyId)
    : allLogs;

  return NextResponse.json(
    {
      logs: filteredLogs,
      companies,
      persistent: Boolean(REDIS_URL && REDIS_TOKEN),
    },
    { status: 200 }
  );
}

// POST /api/logs — ინახავს ახალ ლოგს მუდმივ ბაზაში და ავტომატურად ჭრის 500-ზე მეტ ძველ ჩანაწერს
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

    const companies = await getCompanies();
    const company = companies.find((c) => c.id === companyId);

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
      timestamp:
        body.timestamp && body.timestamp.trim() !== "" ? body.timestamp : nowIso,
    };

    const recentLogs = await getLogs();
    const isOnlineHeartbeat = newLog.signature.includes("AGENT ONLINE");
    const nowMs = Date.now();

    // 15-წამიანი დუბლიკატების ფილტრი
    const isRecentDuplicate =
      !isOnlineHeartbeat &&
      recentLogs.slice(0, 25).some((existing) => {
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
      if (REDIS_URL && REDIS_TOKEN) {
        // ვამატებთ სიის თავში და ვტოვებთ მხოლოდ ბოლო 500 ჩანაწერს (მეხსიერება რომ არ გადაივსოს)
        await redisCmd(["LPUSH", "italive:logs", JSON.stringify(newLog)]);
        await redisCmd(["LTRIM", "italive:logs", 0, MAX_LOGS_LIMIT - 1]);
      } else {
        globalStore.italiveLogs.unshift(newLog);
        if (globalStore.italiveLogs.length > MAX_LOGS_LIMIT) {
          globalStore.italiveLogs = globalStore.italiveLogs.slice(0, MAX_LOGS_LIMIT);
        }
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

// PUT /api/logs — ახალი კომპანიის დამატება მუდმივ ბაზაში
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

    const companies = await getCompanies();
    if (companies.some((c) => c.id === cleanId)) {
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

    const updated = [...companies, newCompany];
    await saveCompanies(updated);

    return NextResponse.json({ company: newCompany }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 400 }
    );
  }
}

// DELETE /api/logs — Dashboard-იდან "🗑️ გასუფთავება" ღილაკზე დაჭერისას შლის ლოგებს ბაზიდან
export async function DELETE(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "403 Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("company_id");

  if (REDIS_URL && REDIS_TOKEN) {
    if (companyId) {
      const allLogs = await getLogs();
      const remaining = allLogs.filter((l) => l.company_id !== companyId);
      await redisCmd(["DEL", "italive:logs"]);
      for (let i = remaining.length - 1; i >= 0; i--) {
        await redisCmd(["LPUSH", "italive:logs", JSON.stringify(remaining[i])]);
      }
    } else {
      await redisCmd(["DEL", "italive:logs"]);
    }
  }

  if (companyId) {
    globalStore.italiveLogs = globalStore.italiveLogs.filter(
      (l) => l.company_id !== companyId
    );
  } else {
    globalStore.italiveLogs = [];
  }

  return NextResponse.json({ status: "cleared" }, { status: 200 });
}