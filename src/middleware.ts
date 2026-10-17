import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// საეჭვო მისამართები, რომლებსაც ჰაკერები და ბოტები ამოწმებენ ვებ-სერვერებზე
const SUSPICIOUS_PATHS = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login",
  "/phpmyadmin",
  "/admin",
  "/config",
  "/backup",
  "/etc/passwd",
  "/actuator",
];

// საეჭვო სკანერები (User-Agent)
const SUSPICIOUS_AGENTS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "zgrab",
  "gobuster",
  "dirbuster",
  "italive-test",
  "blacksun",
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullUrl = `${pathname}${search}`.toLowerCase();
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // არ ვამოწმებთ სტატიკურ ფაილებს და თავად ლოგების API-ს
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/logs") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  let detectedSignature: string | null = null;
  let severity = 2;

  // 1. ვამოწმებთ ფარული ფაილების სკანირებას (.env, wp-admin და ა.შ.)
  if (SUSPICIOUS_PATHS.some((p) => fullUrl.includes(p))) {
    detectedSignature = `WEB WAF: Sensitive Path Probe (${pathname})`;
    severity = 1;
  }
  // 2. ვამოწმებთ SQL Injection და XSS მცდელობებს URL-ში
  else if (
    fullUrl.includes("union%20select") ||
    fullUrl.includes("union+select") ||
    fullUrl.includes("<script") ||
    fullUrl.includes("%3cscript") ||
    fullUrl.includes("../") ||
    fullUrl.includes("or%201=1")
  ) {
    detectedSignature = `WEB WAF: Injection / XSS Attempt (${pathname})`;
    severity = 1;
  }
  // 3. ვამოწმებთ ჰაკერულ სკანერებს User-Agent-ში
  else if (SUSPICIOUS_AGENTS.some((agent) => userAgent.includes(agent))) {
    detectedSignature = `WEB WAF: Malicious Scanner Detected (${userAgent.slice(0, 30)})`;
    severity = 2;
  }

  // თუ საფრთხე დაფიქსირდა, ვაგზავნით პირდაპირ ჩვენს Dashboard-ზე!
  if (detectedSignature) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const attackerIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

    const payload = {
      company_id: "italive-core",
      hostname: "italive-web-amplify", // <-- ასე გამოჩნდება Dashboard-ზე მოწყობილობებში!
      signature: detectedSignature,
      category: "Web Application Firewall",
      severity,
      src_ip: attackerIp,
      dest_ip: `italive.ge${pathname}`,
      timestamp: new Date().toISOString(),
    };

    // ვაგზავნით ფონურად, რომ საიტი არ შეყოვნდეს
    fetch(`${request.nextUrl.origin}/api/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-company-token": "ita_italivecore_default2026token",
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};