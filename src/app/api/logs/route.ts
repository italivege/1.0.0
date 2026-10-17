import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// საიდუმლო გასაღები Rust აგენტისთვის (შეგიძლია .env-შიც გაწერო GUARDIAN_API_KEY)
const API_SECRET = process.env.GUARDIAN_API_KEY || "italive-secret-key-2026";

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

// საწყისი ქვე-კომპანიები, თუ ბაზა ჯერ ცარიელია
const DEFAULT_COMPANIES: Company[] = [
  { id: "italive-core", name: "ITalive Core Infrastructure", createdAt: "2026-10-17" },
  { id: "alpha-bank", name: "Alpha Financial Group", createdAt: "2026-10-17" },
  { id: "medi-cloud", name: "MediCloud Georgia", createdAt: "2026-10-17" },
];

// GET: კომპანიების სიის და არჩეული კომპანიის ლოგების წამოღება
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("company_id") || "italive-core";

    // 1. წამოვიღოთ ქვე-კომპანიები Redis-იდან
    let companies = await redis.get<Company[]>("guardian:companies");
    if (!companies || companies.length === 0) {
      companies = DEFAULT_COMPANIES;
      await redis.set("guardian:companies", companies);
    }

    // 2. წამოვიღოთ კონკრეტული კომპანიის ბოლო 100 ლოგი
    const rawLogs = await redis.lrange<SecurityLog>(`guardian:logs:${companyId}`, 0, 99);

    return NextResponse.json({
      companies,
      logs: rawLogs || [],
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ message: "შეცდომა მონაცემების წამოღებისას" }, { status: 500 });
  }
}

// POST: Rust აგენტიდან ლოგის მიღება ან ახალი ქვე-კომპანიის დამატება
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // A) თუ Dashboard-იდან ახალ ქვე-კომპანიას ვამატებთ
    if (body.action === "create_company") {
      const cleanName = (body.name || "").trim();
      const cleanId = (body.id || "")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .trim();

      if (!cleanName || !cleanId) {
        return NextResponse.json({ message: "შეავსეთ კომპანიის სახელი და ID" }, { status: 400 });
      }

      let companies = (await redis.get<Company[]>("guardian:companies")) || DEFAULT_COMPANIES;
      if (!companies.some((c) => c.id === cleanId)) {
        companies.push({
          id: cleanId,
          name: cleanName,
          createdAt: new Date().toISOString().split("T")[0],
        });
        await redis.set("guardian:companies", companies);
      }

      return NextResponse.json({ companies }, { status: 200 });
    }

    // B) თუ Rust აგენტი გვიგზავნის ლოგს — ვამოწმებთ API გასაღებს
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_SECRET) {
      return NextResponse.json({ message: "Unauthorized Guardian Node" }, { status: 401 });
    }

    const companyId = (body.company_id || "italive-core").trim();
    const logEntry: SecurityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      company_id: companyId,
      hostname: body.hostname || "unknown-host",
      signature: body.signature || "Unknown Alert",
      category: body.category || "Network Traffic",
      severity: Number(body.severity) || 3,
      src_ip: body.src_ip || "0.0.0.0",
      dest_ip: body.dest_ip || "0.0.0.0",
      timestamp: body.timestamp || new Date().toISOString(),
    };

    // თუ ეს company_id ჯერ არ არსებობს კომპანიების სიაში, ავტომატურად დავამატოთ
    let companies = (await redis.get<Company[]>("guardian:companies")) || DEFAULT_COMPANIES;
    if (!companies.some((c) => c.id === companyId)) {
      companies.push({
        id: companyId,
        name: body.company_name || companyId.toUpperCase(),
        createdAt: new Date().toISOString().split("T")[0],
      });
      await redis.set("guardian:companies", companies);
    }

    // ვინახავთ ლოგს კონკრეტული კომპანიის სიაში და ვტოვებთ ბოლო 200 ჩანაწერს
    const redisKey = `guardian:logs:${companyId}`;
    await redis.lpush(redisKey, logEntry);
    await redis.ltrim(redisKey, 0, 199);

    return NextResponse.json({ status: "logged", id: logEntry.id }, { status: 200 });
  } catch (error) {
    console.error("Guardian POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}