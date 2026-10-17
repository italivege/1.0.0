import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const API_SECRET = process.env.GUARDIAN_API_KEY;

export interface Company {
  id: string;
  name: string;
  createdAt: string;
}

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

const DEFAULT_COMPANIES: Company[] = [
  { id: "italive-core", name: "ITalive Core Infrastructure", createdAt: "2026-10-17" },
  { id: "alpha-bank", name: "Alpha Financial Group", createdAt: "2026-10-17" },
  { id: "medi-cloud", name: "MediCloud Georgia", createdAt: "2026-10-17" },
];

const globalStore = globalThis as unknown as {
  __guardianCompanies?: Company[];
  __guardianLogs?: Record<string, SecurityLog[]>;
};

if (!globalStore.__guardianCompanies) {
  globalStore.__guardianCompanies = [...DEFAULT_COMPANIES];
}
if (!globalStore.__guardianLogs) {
  globalStore.__guardianLogs = {};
}

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

// დუბლირების შემოწმების დამხმარე ფუნქცია
function isDuplicateLog(existingLogs: SecurityLog[], candidate: SecurityLog): boolean {
  return existingLogs.some(
    (log) =>
      log.company_id === candidate.company_id &&
      log.hostname === candidate.hostname &&
      log.signature === candidate.signature &&
      log.src_ip === candidate.src_ip &&
      log.dest_ip === candidate.dest_ip
  );
}

// უნიკალური ლოგების გაფილტვრა წამოღებისას (ძველი დუბლიკატებიც რომ გაქრეს)
function deduplicateLogs(logs: SecurityLog[], companyId: string): SecurityLog[] {
  const seen = new Set<string>();
  const result: SecurityLog[] = [];

  for (const log of logs) {
    if (log.company_id !== companyId) continue;
    const key = `${log.hostname}|${log.signature}|${log.src_ip}|${log.dest_ip}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(log);
    }
  }
  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("company_id") || "italive-core";
  const redis = getRedisClient();

  if (redis) {
    try {
      let companies = await redis.get<Company[]>("guardian:companies");
      if (!companies || companies.length === 0) {
        companies = DEFAULT_COMPANIES;
        await redis.set("guardian:companies", companies);
      }
      const rawLogs = await redis.lrange<SecurityLog>(`guardian:logs:${companyId}`, 0, 199);
      const uniqueCompanyLogs = deduplicateLogs(rawLogs || [], companyId);

      return NextResponse.json({
        storage: "redis",
        companies,
        logs: uniqueCompanyLogs,
      });
    } catch (err) {
      console.warn("Redis GET fallback to memory:", err);
    }
  }

  const memLogs = globalStore.__guardianLogs?.[companyId] || [];
  return NextResponse.json({
    storage: "memory",
    companies: globalStore.__guardianCompanies || DEFAULT_COMPANIES,
    logs: deduplicateLogs(memLogs, companyId),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const redis = getRedisClient();

    // A) ახალი ქვე-კომპანიის შექმნა
    if (body.action === "create_company") {
      const cleanName = String(body.name || "").trim();
      const cleanId = String(body.id || "")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .trim();

      if (!cleanName || !cleanId) {
        return NextResponse.json({ message: "შეავსეთ კომპანიის სახელი და ID" }, { status: 400 });
      }

      const newCompany: Company = {
        id: cleanId,
        name: cleanName,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const memCompanies = globalStore.__guardianCompanies || [...DEFAULT_COMPANIES];
      if (!memCompanies.some((c) => c.id === cleanId)) {
        memCompanies.push(newCompany);
        globalStore.__guardianCompanies = memCompanies;
      }

      if (redis) {
        try {
          const rCompanies = (await redis.get<Company[]>("guardian:companies")) || [...DEFAULT_COMPANIES];
          if (!rCompanies.some((c) => c.id === cleanId)) {
            rCompanies.push(newCompany);
            await redis.set("guardian:companies", rCompanies);
          }
          return NextResponse.json({ companies: rCompanies }, { status: 200 });
        } catch (err) {
          console.warn("Redis create_company fallback:", err);
        }
      }

      return NextResponse.json({ companies: memCompanies }, { status: 200 });
    }

    // B) Rust აგენტიდან ლოგის მიღება
    const apiKey = request.headers.get("x-api-key");
    if (!API_SECRET || apiKey !== API_SECRET) {
      return NextResponse.json({ message: "Unauthorized Guardian Node" }, { status: 401 });
    }

    const companyId = String(body.company_id || "italive-core").trim();
    const logEntry: SecurityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      company_id: companyId,
      hostname: String(body.hostname || "unknown-host"),
      signature: String(body.signature || "Unknown Alert"),
      category: String(body.category || "Network Traffic"),
      severity: Number(body.severity) || 3,
      src_ip: String(body.src_ip || "0.0.0.0"),
      dest_ip: String(body.dest_ip || "0.0.0.0"),
      timestamp: String(body.timestamp || new Date().toISOString()),
    };

    // 1. სარეზერვო მეხსიერება (დუბლირების შემოწმებით)
    if (!globalStore.__guardianLogs![companyId]) {
      globalStore.__guardianLogs![companyId] = [];
    }
    if (!isDuplicateLog(globalStore.__guardianLogs![companyId], logEntry)) {
      globalStore.__guardianLogs![companyId].unshift(logEntry);
      globalStore.__guardianLogs![companyId] = globalStore.__guardianLogs![companyId].slice(0, 200);
    }

    // 2. Redis ბაზა (დუბლირების შემოწმებით)
    if (redis) {
      try {
        const rCompanies = (await redis.get<Company[]>("guardian:companies")) || [...DEFAULT_COMPANIES];
        if (!rCompanies.some((c) => c.id === companyId)) {
          rCompanies.push({
            id: companyId,
            name: String(body.company_name || companyId.toUpperCase()),
            createdAt: new Date().toISOString().split("T")[0],
          });
          await redis.set("guardian:companies", rCompanies);
        }

        const redisKey = `guardian:logs:${companyId}`;
        const existingRedisLogs = (await redis.lrange<SecurityLog>(redisKey, 0, 199)) || [];

        if (isDuplicateLog(existingRedisLogs, logEntry)) {
          return NextResponse.json({ status: "duplicate_ignored" }, { status: 200 });
        }

        await redis.lpush(redisKey, logEntry);
        await redis.ltrim(redisKey, 0, 199);
      } catch (redisErr) {
        console.warn("Redis POST fallback used:", redisErr);
      }
    }

    return NextResponse.json({ status: "logged", id: logEntry.id }, { status: 200 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Server error", error: errMsg }, { status: 500 });
  }
}