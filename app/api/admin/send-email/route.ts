import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const decoded = getTokenFromRequest(req);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "Recipient email and message are required" },
        { status: 400 }
      );
    }

    const formattedMessage = String(message)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br><br>");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FirstFlyExpress</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
            color: #333333;
            line-height: 1.6;
          }
          .wrapper {
            width: 100%;
            padding: 30px 15px;
            background: #f4f4f4;
          }
          .container {
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #d1d5db;
          }
          .header {
            background: #4d148c;
            padding: 24px 32px;
            color: #ffffff;
          }
          .brand {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.3px;
            margin: 0;
          }
          .sub-brand {
            font-size: 13px;
            margin-top: 4px;
            color: #e9d5ff;
          }
          .accent-line {
            height: 5px;
            background: #ff6600;
          }
          .content {
            padding: 36px 32px;
          }
          .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 18px;
          }
          .intro {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 24px;
          }
          .message-box {
            border-left: 4px solid #ff6600;
            border-top: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            background: #fafafa;
            padding: 14px 16px;
            margin: 20px 0;
          }
          .message-label {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .message-content {
            font-size: 15px;
            color: #111827;
            line-height: 1.7;
            word-break: break-word;
          }
          .closing {
            font-size: 15px;
            color: #4b5563;
            margin: 28px 0;
          }
          .signature {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            font-size: 14px;
            color: #374151;
            line-height: 1.8;
          }
          .signature strong {
            color: #111827;
          }
          .footer {
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 18px 32px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media screen and (max-width: 600px) {
            .header,
            .content,
            .footer {
              padding: 24px 20px;
            }
            .message-box {
              padding: 12px 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="brand">FirstFlyExpress</div>
              <div class="sub-brand">Premium Logistics & Delivery Services</div>
            </div>
            <div class="accent-line"></div>
            <div class="content">
              <div class="greeting">Dear Valued Customer,</div>
              <div class="intro">
                We're reaching out from <strong>FirstFlyExpress</strong> with an important update.
              </div>
              <div class="message-box">
                <div class="message-label">Message from FirstFlyExpress</div>
                <div class="message-content">${formattedMessage}</div>
              </div>
              <div class="closing">
                If you have any questions, please reply to this email or contact our support team.
              </div>
              <div class="signature">
                <strong>Best regards,</strong><br />
                Customer Support Team<br />
                FirstFlyExpress<br />
                +1 (323) 347-4758<br />
                support@firstflyexpress.com<br />
                www.firstflyexpress.com
              </div>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} FirstFlyExpress. All rights reserved.<br />
              This email was sent by our administration team.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
FirstFlyExpress – Direct Message

Dear Valued Customer,

We're reaching out from FirstFlyExpress with an important update.

----------------------------------------
${message}
----------------------------------------

If you have any questions, please reply to this email.

Best regards,
Customer Support Team
FirstFlyExpress
+1 (323) 347-4758
support@firstflyexpress.com
www.firstflyexpress.com

© ${new Date().getFullYear()} FirstFlyExpress.
    `;

    const { data, error } = await resend.emails.send({
      from: "FirstFlyExpress <support@firstflyexpres.com>",
      to: [to],
      subject: subject || "Message from FirstFlyExpress",
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Send email API error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}