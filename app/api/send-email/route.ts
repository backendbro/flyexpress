import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure email transporter (use your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, message, fromName, fromEmail } = await request.json();

    // Send email
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">${subject}</h2>
          <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message}
          </div>
          <p style="color: #6b7280; font-size: 12px;">This message was sent from First Fly Express website.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}