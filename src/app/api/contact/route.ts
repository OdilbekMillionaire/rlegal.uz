import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ContactSchema.safeParse(body);

    if (!data.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const { name, company, email, phone, service, message } = data.data;
    const firmEmail = process.env.CONTACT_EMAIL || "rlegalpractice@gmail.com";

    if (!process.env.RESEND_API_KEY) {
      // No Resend key — log and return success so form still works in dev
      console.log("[Contact Form] No RESEND_API_KEY. Submission:", data.data);
      return NextResponse.json({ ok: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email to the law firm
    await resend.emails.send({
      from: "R-Legal Contact Form <onboarding@resend.dev>",
      to: firmEmail,
      replyTo: email,
      subject: `New consultation request from ${name}${company ? ` (${company})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#151414">
          <div style="background:#0f2ccf;padding:24px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">New Consultation Request</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">R-Legal Practice — Contact Form</p>
          </div>
          <div style="background:#f9f9f9;padding:28px 32px;border:1px solid #e0dfdf;border-top:none">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;font-size:12px;color:#6b6a69;width:120px;font-weight:600;text-transform:uppercase">Name</td><td style="padding:8px 0;font-size:14px">${name}</td></tr>
              ${company ? `<tr><td style="padding:8px 0;font-size:12px;color:#6b6a69;font-weight:600;text-transform:uppercase">Company</td><td style="padding:8px 0;font-size:14px">${company}</td></tr>` : ""}
              <tr><td style="padding:8px 0;font-size:12px;color:#6b6a69;font-weight:600;text-transform:uppercase">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#0f2ccf">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;font-size:12px;color:#6b6a69;font-weight:600;text-transform:uppercase">Phone</td><td style="padding:8px 0;font-size:14px">${phone}</td></tr>` : ""}
              ${service ? `<tr><td style="padding:8px 0;font-size:12px;color:#6b6a69;font-weight:600;text-transform:uppercase">Service</td><td style="padding:8px 0;font-size:14px">${service}</td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #e0dfdf;margin:20px 0"/>
            <p style="font-size:12px;color:#6b6a69;font-weight:600;text-transform:uppercase;margin:0 0 8px">Message</p>
            <p style="font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
          </div>
          <div style="padding:16px 32px;background:#fff;border:1px solid #e0dfdf;border-top:none;border-radius:0 0 8px 8px;text-align:center">
            <p style="font-size:11px;color:#a0a0a0;margin:0">Reply directly to this email to respond to ${name}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to the client
    await resend.emails.send({
      from: "R-Legal Practice <onboarding@resend.dev>",
      to: email,
      subject: "We received your consultation request — R-Legal Practice",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#151414">
          <div style="background:#0f2ccf;padding:24px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">Thank you, ${name}</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">R-Legal Practice · Tashkent, Uzbekistan</p>
          </div>
          <div style="background:#f9f9f9;padding:28px 32px;border:1px solid #e0dfdf;border-top:none">
            <p style="font-size:14px;line-height:1.7;margin:0 0 16px">We have received your consultation request and will get back to you within <strong>1 business day</strong>.</p>
            <p style="font-size:14px;line-height:1.7;margin:0 0 24px">If your matter is urgent, please call us directly:</p>
            <div style="background:white;border:1px solid #e0dfdf;border-radius:8px;padding:16px 20px;display:inline-block">
              <p style="margin:0;font-size:14px;font-weight:600">📞 +998 90 825 08 78</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b6a69">✉️ rlegalpractice@gmail.com</p>
            </div>
          </div>
          <div style="padding:16px 32px;background:#fff;border:1px solid #e0dfdf;border-top:none;border-radius:0 0 8px 8px;text-align:center">
            <p style="font-size:11px;color:#a0a0a0;margin:0">© ${new Date().getFullYear()} R-Legal Practice · This is an automated confirmation</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Contact API]", error);
    return NextResponse.json({ error: "Failed to send. Please email us directly." }, { status: 500 });
  }
}
