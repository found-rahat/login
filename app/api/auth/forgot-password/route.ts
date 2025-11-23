import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Function to generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success response even if user doesn't exist to prevent email enumeration
      return new Response(
        JSON.stringify({ message: "If an account exists with this email, a password reset code has been sent." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a 6-digit verification code for password reset
    const passwordResetCode = generateVerificationCode();
    const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Update the user with the password reset code and expiration
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: passwordResetCode,
        passwordResetExpires: passwordResetExpires,
      },
    });

    // Send password reset code email using SMTP
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // your email
          pass: process.env.SMTP_PASS, // your email app password
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER, // sender address
        to: email, // recipient email
        subject: "Password Reset Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Please enter the following 6-digit code to continue:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #F3F4F6; padding: 15px; border-radius: 8px;">${passwordResetCode}</span>
            </div>
            <p><strong>Note:</strong> This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return new Response(
        JSON.stringify({
          error: "Failed to send password reset email. Please try again.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "If an account exists with this email, a password reset code has been sent.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}