"use server";

import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient()


type SignUpArgs = {
  email: string;
};

export async function onSignUp(args: SignUpArgs) {
  try {
    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email: args.email, // Corrected: Access email from the 'args' parameter
      }
    });

    console.log('New user signed up:', newUser);
    // Return a success message and the user data
    return { success: true, user: newUser };

  } catch (error) {
    console.error('Error during sign up:', error);
    // Return a structured error message
    return { success: false, error: 'Failed to sign up.' };
  }
}