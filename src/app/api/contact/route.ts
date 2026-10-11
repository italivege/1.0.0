import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// მარტივი in-memory Cache (Rate Limiter-ისთვის)
// გასათვალისწინებელია: Serverless გარემოში (მაგ: Vercel/Amplify) ეს მეხსიერება შეიძლება გადაიტვირთოს ხოლმე,
// მაგრამ სპამისგან თავდასაცავად მაინც ეფექტურია.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    // 1. მოვიპოვოთ კლიენტის IP მისამართი
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown_ip';

    // 2. Rate Limiting ლოგიკა (მაქს. 3 მოთხოვნა საათში)
    const MAX_REQUESTS_PER_HOUR = 3;
    const ONE_HOUR_IN_MS = 60 * 60 * 1000;
    const now = Date.now();

    const requestData = rateLimitMap.get(ip);

    if (requestData) {
      // ვამოწმებთ, გავიდა თუ არა 1 საათი პირველი მოთხოვნიდან
      if (now - requestData.timestamp < ONE_HOUR_IN_MS) {
        if (requestData.count >= MAX_REQUESTS_PER_HOUR) {
          return NextResponse.json(
            { message: 'შეტყობინებების ლიმიტი ამოწურულია. სცადეთ მოგვიანებით (1 საათში).' },
            { status: 429 } // 429 Too Many Requests
          );
        }
        // თუ 1 საათი არ გასულა და ლიმიტიც არაა ამოწურული, ვზრდით count-ს
        requestData.count += 1;
      } else {
        // თუ 1 საათი გავიდა, ვარესეტებთ
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      // პირველი მოთხოვნა ამ IP-დან
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // მოთხოვნის სხეულის წაკითხვა
    const body = await request.json();
    const { name, email, message } = body;

    // მარტივი ვალიდაცია
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'გთხოვთ შეავსოთ ყველა ველი.' },
        { status: 400 }
      );
    }

    // Nodemailer ტრანსპორტერის კონფიგურაცია
    // დინამიური პორტით, რათა 465 და 587 ორივემ იმუშაოს
    const port = Number(process.env.SMTP_PORT) || 465;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      // 465 პორტს სჭირდება secure: true, ხოლო 587-ს (STARTTLS) სჭირდება secure: false
      secure: port === 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // მეილის ფორმატირება
    const mailOptions = {
      from: process.env.SMTP_USER, 
      replyTo: email, 
      to: process.env.RECEIVER_EMAIL,
      subject: `ახალი შეტყობინება ITalive.ge-დან: ${name}`,
      text: `სახელი: ${name}\nელ-ფოსტა: ${email}\nIP: ${ip}\n\nშეტყობინება:\n${message}`,
    };

    // მეილის გაგზავნა
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'შეტყობინება წარმატებით გაიგზავნა!' },
      { status: 200 }
    );
  } catch (error: any) {
    // ერორის ლოგირება სერვერზე
    console.error('Email send error details:', error);
    
    // ფრონტენდზე ზუსტი შეცდომის მიზეზის დაბრუნება (დიაგნოსტიკისთვის)
    return NextResponse.json(
      { message: `შეცდომა სერვერზე: ${error.message || 'უცნობი ტექნიკური ერორი'}` },
      { status: 500 }
    );
  }
}