import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

export const journeySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be 100 characters or fewer."),
  category: optionalText(50, "Category"),
  description: optionalText(500, "Description"),
});

export type JourneyInput = z.infer<typeof journeySchema>;

export const journeyIdSchema = z.string().cuid("Invalid journey id.");
