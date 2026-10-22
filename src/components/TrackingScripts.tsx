"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ""; // მაგ: G-XXXXXXXXXX
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ""; // მაგ: AW-XXXXXXXXXX
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || ""; // მაგ: 123456789012345

export default function TrackingScripts() {
  const primaryGoogleId = GA_ID || ADS_ID;

  return (
    <>
      {/* 1. Google Analytics (GA4) & Google Ads Tag */}
      {primaryGoogleId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryGoogleId}`}
            strategy="afterInteractive"
          />
          <Script id="google-gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ""}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
            `}
          </Script>
        </>
      )}

      {/* 2. Meta (Facebook) Pixel */}
      {FB_PIXEL_ID && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}