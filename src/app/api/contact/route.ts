import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// გლობალური ლიმიტი: მთლიანმა საიტმა ერთ საათში მაქსიმუმ 50 მეილი გაუშვას (სპამისგან დასაცავად)
const globalRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"),
});

// IP-ზე დაფუძნებული ლიმიტი: ერთმა IP-მ საათში მაქსიმუმ 3 მეილი გაგზავნოს
const ipRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, token } = body;

    // 1. CAPTCHA (Turnstile) ტოკენის შემოწმება
    if (!token) {
      return NextResponse.json(
        { message: 'გთხოვთ დაასრულოთ უსაფრთხოების გადამოწმება (CAPTCHA).' },
        { status: 400 }
      );
    }

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    });

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { message: 'CAPTCHA გადამოწმება ვერ მოხერხდა. სცადეთ თავიდან.' },
        { status: 400 }
      );
    }

    // 2. IP და გლობალური Rate Limiting შემოწმება
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown_ip';

    if (ip !== 'unknown_ip') {
      const ipCheck = await ipRatelimit.limit(ip);
      if (!ipCheck.success) {
        return NextResponse.json(
          { message: 'შეტყობინებების ლიმიტი ამოწურულია. სცადეთ 1 საათში.' },
          { status: 429 }
        );
      }
    }

    const globalCheck = await globalRatelimit.limit('global_contact_counter');
    if (!globalCheck.success) {
      return NextResponse.json(
        { message: 'სერვერი გადატვირთულია. სცადეთ მოგვიანებით.' },
        { status: 429 }
      );
    }

    // 3. ვალიდაცია
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'გთხოვთ შეავსოთ ყველა ველი.' },
        { status: 400 }
      );
    }

    // 4. Nodemailer გაგზავნა
    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      replyTo: email,
      to: process.env.RECEIVER_EMAIL,
      subject: `ახალი შეტყობინება ITalive.ge-დან: ${name}`,
      text: `სახელი: ${name}\nელ-ფოსტა: ${email}\nIP: ${ip}\n\nშეტყობინება:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'შეტყობინება წარმატებით გაიგზავნა!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { message: `სერვერის შეცდომა: ${error.message || 'უცნობი ერორი'}` },
      { status: 500 }
    );
  }
}