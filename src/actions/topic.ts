"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/journey/queries";
import { prisma } from "@/lib/prisma";
import {
  topicCreateSchema,
  topicIdSchema,
  topicUpdateSchema,
} from "@/lib/validations/topic";

export type TopicFormState = {
  errors?: {
    title?: string[];
    order?: string[];
    form?: string[];
  };
  success?: boolean;
};

function topicCreateFormDataToInput(formData: FormData) {
  return {
    journeyId: formData.get("journeyId"),
    title: formData.get("title"),
  };
}

function topicUpdateFormDataToInput(formData: FormData) {
  return {
    title: formData.get("title"),
    order: formData.get("order"),
  };
}

async function getOwnedTopic(topicId: string, userId: string) {
  return prisma.topic.findFirst({
    where: {
      id: topicId,
      journey: { userId },
    },
    select: {
      id: true,
      journeyId: true,
    },
  });
}

export async function createTopicAction(
  _prevState: TopicFormState,
  formData: FormData
): Promise<TopicFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = topicCreateSchema.safeParse(topicCreateFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const journey = await prisma.journey.findFirst({
    where: { id: parsed.data.journeyId, userId: user.id },
    select: { id: true },
  });

  if (!journey) {
    return { errors: { form: ["Journey not found."] } };
  }

  try {
    const nextOrder = await prisma.topic
      .aggregate({
        where: { journeyId: journey.id },
        _max: { order: true },
      })
      .then((result) => (result._max.order ?? 0) + 1);

    await prisma.topic.create({
      data: {
        journeyId: journey.id,
        title: parsed.data.title,
        order: nextOrder,
      },
    });

    revalidatePath(`/dashboard/journeys/${journey.id}`);
    return { success: true };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while creating the topic. Please try again."],
      },
    };
  }
}

export async function updateTopicAction(
  topicId: string,
  _prevState: TopicFormState,
  formData: FormData
): Promise<TopicFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = topicIdSchema.safeParse(topicId);

  if (!idParsed.success) {
    return { errors: { form: ["Topic not found."] } };
  }

  const parsed = topicUpdateSchema.safeParse(topicUpdateFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getOwnedTopic(idParsed.data, user.id);

  if (!existing) {
    return { errors: { form: ["Topic not found."] } };
  }

  try {
    await prisma.topic.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title,
        order: parsed.data.order,
      },
    });

    revalidatePath(`/dashboard/journeys/${existing.journeyId}`);
    return { success: true };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while updating the topic. Please try again."],
      },
    };
  }
}

export async function deleteTopicAction(
  topicId: string
): Promise<{ error?: string }> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = topicIdSchema.safeParse(topicId);

  if (!idParsed.success) {
    return { error: "Topic not found." };
  }

  const existing = await getOwnedTopic(idParsed.data, user.id);

  if (!existing) {
    return { error: "Topic not found." };
  }

  try {
    await prisma.topic.delete({
      where: { id: existing.id },
    });

    revalidatePath(`/dashboard/journeys/${existing.journeyId}`);
    return {};
  } catch {
    return {
      error: "Something went wrong while deleting the topic. Please try again.",
    };
  }
}
