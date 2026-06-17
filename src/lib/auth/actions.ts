"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth/auth";
import { hashPassword } from "@/lib/auth/password";
import { loginSchema, signupSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    form?: string[];
  };
  success?: boolean;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { errors: { form: ["Invalid email or password."] } };
    }

    throw error;
  }

  return {};
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["An account with this email already exists."],
      },
    };
  }

  const hashedPassword = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: parsed.data.name ?? null,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: {
          form: ["Account created, but sign-in failed. Please log in manually."],
        },
        success: true,
      };
    }

    throw error;
  }

  return {};
}
