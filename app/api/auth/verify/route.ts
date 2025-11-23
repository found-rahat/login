import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate input
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and verification code are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User with this email does not exist' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return new Response(
        JSON.stringify({ error: 'Email is already verified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if verification code matches
    if (user.verificationCode !== code) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if verification code has expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Verification code has expired. Please register again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update user to mark as verified and clear verification fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    // Return success response (without sensitive data)
    const { password: _, verificationCode: __, verificationExpires: ___, ...userWithoutSensitiveData } = updatedUser;

    return new Response(
      JSON.stringify({
        message: 'Email verified successfully',
        user: userWithoutSensitiveData,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}