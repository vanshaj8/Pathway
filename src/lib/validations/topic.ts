import { z } from "zod";

export const topicIdSchema = z.string().cuid("Invalid topic id.");

export const topicCreateSchema = z.object({
  journeyId: z.string().cuid("Invalid journey id."),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must be 100 characters or fewer."),
});

export const topicUpdateSchema = topicCreateSchema
  .omit({ journeyId: true })
  .extend({
    order: z.coerce
      .number({ error: "Order must be a number." })
      .int("Order must be a whole number.")
      .min(1, "Order must be 1 or greater."),
  });

export type TopicCreateInput = z.infer<typeof topicCreateSchema>;
export type TopicUpdateInput = z.infer<typeof topicUpdateSchema>;
