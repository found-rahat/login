import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Function to generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "All fields (name, email, password) are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with verification details
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
        emailVerified: false,
      },
    });

    // Send verification email using SMTP
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
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering. Please enter the following 6-digit verification code to complete your registration:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #F3F4F6; padding: 15px; border-radius: 8px;">${verificationCode}</span>
            </div>
            <p>This code will expire in 24 hours. If you did not create an account, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // If email fails, delete the user so they can try again
      await prisma.user.delete({ where: { id: user.id } });
      return new Response(
        JSON.stringify({
          error: "Failed to send verification email. Please try again.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success response (without password and sensitive data)
    const {
      password: _,
      verificationCode: __,
      verificationExpires: ___,
      ...userWithoutSensitiveData
    } = user;

    return new Response(
      JSON.stringify({
        message:
          "User registered successfully. Please check your email for the verification code.",
        user: userWithoutSensitiveData,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
