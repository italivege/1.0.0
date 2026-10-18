import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SENSITIVE_PATHS = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/pma",
  "/admin.php",
  "/config.php",
  "/configuration.php",
  "/etc/passwd",
  "/etc/shadow",
  "/actuator",
  "/server-status",
  "/telescope",
  "/.aws",
  "/.ssh",
  "/backup.sql",
  "/db.sql",
];

const MALICIOUS_AGENTS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "dirbuster",
  "gobuster",
  "nuclei",
  "acunetix",
  "nessus",
  "openvas",
  "wpscan",
  "zgrab",
  "wfuzz",
  "ffuf",
  "hydra",
  "burpsuite",
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown-ip";

  // 1. ჩვენს Rust აგენტებს, შიდა სენსორს და ადმინისტრატორს თავისუფლად ვუშვებთ /api/logs-მდე
  if (
    pathname.startsWith("/api/logs") &&
    (ua.includes("italiveguardian") ||
      req.headers.get("x-italive-sensor") === "italive-waf-internal" ||
      req.headers.get("x-admin-secret"))
  ) {
    return NextResponse.next();
  }

  let detectedSignature = "";
  let category = "Active Web Application Firewall";

  // 2. ფარულ ფაილებზე და ადმინ-პანელებზე წვდომის მცდელობა
  if (SENSITIVE_PATHS.some((p) => lowerPath.includes(p))) {
    detectedSignature = `WAF BLOCKED: Sensitive Path Probe (${pathname})`;
    category = "Reconnaissance / File Exposure Attempt";
  }
  // 3. SQL Injection, XSS და Path Traversal მცდელობა URL-ში
  else if (
    search &&
    /(union\s+select|<script|alert\(|or\s+1=1|\.\.\/|\/etc\/passwd|sleep\(\d+\)|benchmark\()/i.test(
      decodeURIComponent(search)
    )
  ) {
    detectedSignature = `WAF BLOCKED: Injection/Traversal Attempt (${pathname})`;
    category = "Web Application Attack (SQLi/XSS)";
  }
  // 4. ჰაკერული სკანერების ამოცნობა User-Agent-ით
  else if (MALICIOUS_AGENTS.some((agent) => ua.includes(agent))) {
    detectedSignature = `WAF BLOCKED: Malicious Scanner (${ua.slice(0, 40)})`;
    category = "Automated Vulnerability Scanner";
  }

  // თუ საფრთხე დაფიქსირდა: ვაგზავნით ლოგს (await-ით, რომ არ დაიკარგოს) და ვბლოკავთ 403-ით
  if (detectedSignature) {
    try {
      await fetch(`${req.nextUrl.origin}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-italive-sensor": "italive-waf-internal",
          "x-company-token": "ita_italivecore_default2026token",
        },
        body: JSON.stringify({
          company_id: "italive-core",
          hostname: "italive.ge-waf",
          signature: detectedSignature,
          category,
          severity: 1,
          src_ip: clientIp,
          dest_ip: "italive.ge",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // თუ შიდა ქსელური შეფერხებაა, მაინც ვბლოკავთ შემტევს
    }

    return new NextResponse(
      JSON.stringify({
        error: "403 Forbidden — Access Blocked by ITalive Active WAF",
        incident: detectedSignature,
        client_ip: clientIp,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:bin|exe|svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};