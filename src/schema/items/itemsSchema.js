import { z } from 'zod';

export const itemsSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string().min(1, "title should be longer 1 char").max(255),
    tag: z.string(),
    properties: z.array(z.string()),
    image: z.string().nullable().optional(),
    createdAt: z.union([z.string().datetime({ offset: true }), z.date(), z.string()]),
    updatedAt: z.union([z.string().datetime({ offset: true }), z.date(), z.string()]),
})

export const createItemsSchema = itemsSchema.omit({
    id: true,
    user_id: true,
    createdAt: true,
    updatedAt: true
})

export const updateItemsSchema = z.object({
    name: z.string().min(1, "title should be longer 1 char").max(255).optional(),
    tag: z.string().optional(),
    properties: z.array(z.string()).optional(),
    image: z.string().optional(),
})