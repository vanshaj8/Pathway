import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(z.url("External link must be a valid URL.").optional());

export const taskIdSchema = z.string().cuid("Invalid task id.");

export const taskCreateSchema = z.object({
  topicId: z.string().cuid("Invalid topic id."),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(200, "Title must be 200 characters or fewer."),
  description: optionalText(1000, "Description"),
  externalLink: optionalUrl,
});

export const taskUpdateSchema = taskCreateSchema
  .omit({ topicId: true })
  .extend({
    order: z.coerce
      .number({ error: "Order must be a number." })
      .int("Order must be a whole number.")
      .min(1, "Order must be 1 or greater."),
  });

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
