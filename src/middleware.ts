import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

// ვიზიტორის რეალური IP-ის ამოღება Cloudflare-ის და AWS CloudFront-ის ჰედერებიდან
function getRealClientIp(request: NextRequest): string {
  // 1. თუ ჩართულია Cloudflare Proxy
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // 2. თუ შემოდის პირდაპირ AWS CloudFront / Amplify-დან (ფორმატი: IP:PORT)
  const viewerAddress = request.headers.get("cloudfront-viewer-address");
  if (viewerAddress) {
    // ვაშორებთ პორტს ბოლოში (მაგ: "212.58.100.1:54321" -> "212.58.100.1")
    const lastColon = viewerAddress.lastIndexOf(":");
    return lastColon > 0 ? viewerAddress.slice(0, lastColon).trim() : viewerAddress.trim();
  }

  // 3. სტანდარტული X-Real-IP
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // 4. X-Forwarded-For (პირველი IP სიაში არის რეალური კლიენტი)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return "unknown-ip";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullUrl = `${pathname}${search}`.toLowerCase();
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

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

  if (SUSPICIOUS_PATHS.some((p) => fullUrl.includes(p))) {
    detectedSignature = `WEB WAF: Sensitive Path Probe (${pathname})`;
    severity = 1;
  } else if (
    fullUrl.includes("union%20select") ||
    fullUrl.includes("union+select") ||
    fullUrl.includes("<script") ||
    fullUrl.includes("%3cscript") ||
    fullUrl.includes("../") ||
    fullUrl.includes("or%201=1")
  ) {
    detectedSignature = `WEB WAF: Injection / XSS Attempt (${pathname})`;
    severity = 1;
  } else if (SUSPICIOUS_AGENTS.some((agent) => userAgent.includes(agent))) {
    detectedSignature = `WEB WAF: Malicious Scanner Detected (${userAgent.slice(0, 30)})`;
    severity = 2;
  }

  if (detectedSignature) {
    const attackerIp = getRealClientIp(request);

    const payload = {
      company_id: "italive-core",
      hostname: "italive-web-amplify",
      signature: detectedSignature,
      category: "Web Application Firewall",
      severity,
      src_ip: attackerIp,
      dest_ip: `italive.ge${pathname}`,
      timestamp: new Date().toISOString(),
    };

    try {
      // await აუცილებელია Amplify-ზე, რომ ფუნქცია გაგზავნამდე არ გაითიშოს
      await fetch("https://www.italive.ge/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-company-token": "ita_italivecore_default2026token",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("WAF Log Error:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};