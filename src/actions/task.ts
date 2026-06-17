"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/journey/queries";
import { prisma } from "@/lib/prisma";
import {
  taskCreateSchema,
  taskIdSchema,
  taskUpdateSchema,
} from "@/lib/validations/task";

export type TaskFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    externalLink?: string[];
    order?: string[];
    form?: string[];
  };
  success?: boolean;
};

function taskCreateFormDataToInput(formData: FormData) {
  return {
    topicId: formData.get("topicId"),
    title: formData.get("title"),
    description: formData.get("description"),
    externalLink: formData.get("externalLink"),
  };
}

function taskUpdateFormDataToInput(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    externalLink: formData.get("externalLink"),
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

async function getOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      topic: { journey: { userId } },
    },
    select: {
      id: true,
      topic: {
        select: {
          journeyId: true,
        },
      },
    },
  });
}

export async function createTaskAction(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = taskCreateSchema.safeParse(taskCreateFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const topic = await getOwnedTopic(parsed.data.topicId, user.id);

  if (!topic) {
    return { errors: { form: ["Topic not found."] } };
  }

  try {
    const nextOrder = await prisma.task
      .aggregate({
        where: { topicId: topic.id },
        _max: { order: true },
      })
      .then((result) => (result._max.order ?? 0) + 1);

    await prisma.task.create({
      data: {
        topicId: topic.id,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        externalLink: parsed.data.externalLink ?? null,
        order: nextOrder,
      },
    });

    revalidatePath(`/dashboard/journeys/${topic.journeyId}`);
    return { success: true };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while creating the task. Please try again."],
      },
    };
  }
}

export async function updateTaskAction(
  taskId: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = taskIdSchema.safeParse(taskId);

  if (!idParsed.success) {
    return { errors: { form: ["Task not found."] } };
  }

  const parsed = taskUpdateSchema.safeParse(taskUpdateFormDataToInput(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getOwnedTask(idParsed.data, user.id);

  if (!existing) {
    return { errors: { form: ["Task not found."] } };
  }

  try {
    await prisma.task.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        externalLink: parsed.data.externalLink ?? null,
        order: parsed.data.order,
      },
    });

    revalidatePath(`/dashboard/journeys/${existing.topic.journeyId}`);
    return { success: true };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while updating the task. Please try again."],
      },
    };
  }
}

export async function deleteTaskAction(
  taskId: string
): Promise<{ error?: string }> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const idParsed = taskIdSchema.safeParse(taskId);

  if (!idParsed.success) {
    return { error: "Task not found." };
  }

  const existing = await getOwnedTask(idParsed.data, user.id);

  if (!existing) {
    return { error: "Task not found." };
  }

  try {
    await prisma.task.delete({
      where: { id: existing.id },
    });

    revalidatePath(`/dashboard/journeys/${existing.topic.journeyId}`);
    return {};
  } catch {
    return {
      error: "Something went wrong while deleting the task. Please try again.",
    };
  }
}
