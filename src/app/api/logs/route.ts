import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const MASTER_API_SECRET = process.env.GUARDIAN_API_KEY;

export interface Company {
  id: string;
  name: string;
  token: string;
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

function generateCompanyToken(companyId: string): string {
  const randomHex = crypto.randomBytes(12).toString("hex");
  return `ita_${companyId.replace(/[^a-z0-9]/g, "")}_${randomHex}`;
}

const DEFAULT_COMPANIES: Company[] = [
  {
    id: "italive-core",
    name: "ITalive Core Infrastructure",
    token: "ita_italivecore_default2026token",
    createdAt: "2026-10-17",
  },
  {
    id: "alpha-bank",
    name: "Alpha Financial Group",
    token: "ita_alphabank_9f8e7d6c5b4a3210",
    createdAt: "2026-10-17",
  },
  {
    id: "medi-cloud",
    name: "MediCloud Georgia",
    token: "ita_medicloud_1a2b3c4d5e6f7890",
    createdAt: "2026-10-17",
  },
];

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

async function getCompaniesList(redis: Redis | null): Promise<Company[]> {
  if (!redis) return DEFAULT_COMPANIES;
  let companies = await redis.get<Company[]>("guardian:companies");
  if (!companies || companies.length === 0) {
    companies = DEFAULT_COMPANIES;
    await redis.set("guardian:companies", companies);
  } else {
    // თუ ძველ კომპანიებს ტოკენი არ ჰქონდათ, ავტომატურად მივანიჭოთ
    let updated = false;
    companies = companies.map((c) => {
      if (!c.token) {
        updated = true;
        const def = DEFAULT_COMPANIES.find((d) => d.id === c.id);
        return { ...c, token: def ? def.token : generateCompanyToken(c.id) };
      }
      return c;
    });
    if (updated) {
      await redis.set("guardian:companies", companies);
    }
  }
  return companies;
}

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
      const companies = await getCompaniesList(redis);
      const rawLogs = await redis.lrange<SecurityLog>(`guardian:logs:${companyId}`, 0, 199);
      return NextResponse.json({
        storage: "redis",
        companies,
        logs: deduplicateLogs(rawLogs || [], companyId),
      });
    } catch (err) {
      console.error("Redis GET error:", err);
    }
  }

  return NextResponse.json({
    storage: "memory",
    companies: DEFAULT_COMPANIES,
    logs: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const redis = getRedisClient();
    const companies = await getCompaniesList(redis);

    // A) ახალი ქვე-კომპანიის შექმნა უნიკალური ტოკენით
    if (body.action === "create_company") {
      const cleanName = String(body.name || "").trim();
      const cleanId = String(body.id || "")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .trim();

      if (!cleanName || !cleanId) {
        return NextResponse.json({ message: "შეავსეთ კომპანიის სახელი და ID" }, { status: 400 });
      }

      if (!companies.some((c) => c.id === cleanId)) {
        const newCompany: Company = {
          id: cleanId,
          name: cleanName,
          token: generateCompanyToken(cleanId),
          createdAt: new Date().toISOString().split("T")[0],
        };
        companies.push(newCompany);
        if (redis) {
          await redis.set("guardian:companies", companies);
        }
      }

      return NextResponse.json({ companies }, { status: 200 });
    }

    // B) ლოგის მიღება აგენტიდან (ვამოწმებთ კომპანიის ინდივიდუალურ ტოკენს ან Master გასაღებს)
    const companyId = String(body.company_id || "italive-core").trim();
    const companyToken = request.headers.get("x-company-token");
    const legacyApiKey = request.headers.get("x-api-key");

    const targetCompany = companies.find((c) => c.id === companyId);
    if (!targetCompany) {
      return NextResponse.json({ message: "Unknown Company ID" }, { status: 404 });
    }

    const isTokenValid =
      (companyToken && companyToken === targetCompany.token) ||
      (MASTER_API_SECRET && legacyApiKey === MASTER_API_SECRET);

    if (!isTokenValid) {
      return NextResponse.json({ message: "Invalid Company Token" }, { status: 401 });
    }

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

    if (redis) {
      const redisKey = `guardian:logs:${companyId}`;
      const existingRedisLogs = (await redis.lrange<SecurityLog>(redisKey, 0, 199)) || [];

      if (isDuplicateLog(existingRedisLogs, logEntry)) {
        return NextResponse.json({ status: "duplicate_ignored" }, { status: 200 });
      }

      await redis.lpush(redisKey, logEntry);
      await redis.ltrim(redisKey, 0, 199);
    }

    return NextResponse.json({ status: "logged", id: logEntry.id }, { status: 200 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Server error", error: errMsg }, { status: 500 });
  }
}