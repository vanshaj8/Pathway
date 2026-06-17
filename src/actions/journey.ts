"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/journey/queries";
import { prisma } from "@/lib/prisma";
import { journeyIdSchema, journeySchema } from "@/lib/validations/journey";

export type JourneyFormState = {
  errors?: {
    title?: string[];
    category?: string[];
    description?: string[];
    form?: string[];
  };
};

function journeyFormDataToInput(formData: FormData) {
  return {
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
  };
}

export async function createJourneyAction(
  _prevState: JourneyFormState,
  formData: FormData
): Promise<JourneyFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = journeySchema.safeParse(journeyFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const journey = await prisma.$transaction(async (tx) => {
      const created = await tx.journey.create({
        data: {
          userId: user.id,
          title: parsed.data.title,
          category: parsed.data.category ?? null,
          description: parsed.data.description ?? null,
        },
      });

      await tx.attempt.create({
        data: {
          journeyId: created.id,
          attemptNumber: 1,
          status: "active",
        },
      });

      return created;
    });

    revalidatePath("/dashboard");
    redirect(`/dashboard/journeys/${journey.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      errors: {
        form: ["Something went wrong while creating your journey. Please try again."],
      },
    };
  }
}

export async function updateJourneyAction(
  journeyId: string,
  _prevState: JourneyFormState,
  formData: FormData
): Promise<JourneyFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = journeyIdSchema.safeParse(journeyId);

  if (!idParsed.success) {
    return { errors: { form: ["Journey not found."] } };
  }

  const parsed = journeySchema.safeParse(journeyFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.journey.findFirst({
    where: { id: idParsed.data, userId: user.id },
    select: { id: true },
  });

  if (!existing) {
    return { errors: { form: ["Journey not found."] } };
  }

  try {
    await prisma.journey.update({
      where: { id: idParsed.data },
      data: {
        title: parsed.data.title,
        category: parsed.data.category ?? null,
        description: parsed.data.description ?? null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/journeys/${idParsed.data}`);
    redirect(`/dashboard/journeys/${idParsed.data}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      errors: {
        form: ["Something went wrong while updating your journey. Please try again."],
      },
    };
  }
}

export async function deleteJourneyAction(
  journeyId: string
): Promise<{ error?: string }> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = journeyIdSchema.safeParse(journeyId);

  if (!idParsed.success) {
    return { error: "Journey not found." };
  }

  const existing = await prisma.journey.findFirst({
    where: { id: idParsed.data, userId: user.id },
    select: { id: true },
  });

  if (!existing) {
    return { error: "Journey not found." };
  }

  try {
    await prisma.journey.delete({
      where: { id: idParsed.data },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: "Something went wrong while deleting your journey. Please try again.",
    };
  }
}
