import { z } from 'zod';

export const requestSchema = z.object({
    id: z.number(),
    item_id: z.number(),
    user_id: z.number(),
    name: z.string().min(1, "title should be longer 1 char").max(255),
    email: z.string().min(4, "must cntain a valid email syntaz").max(255),
    phone: z.string().min(11, "must be a valid number").max(11),
    message: z.string(),
    descriptions: z.array(z.string()),
    createdAt: z.union([z.string().datetime({ offset: true }), z.date(), z.string()]),
    updatedAt: z.union([z.string().datetime({ offset: true }), z.date(), z.string()]),
})

export const createRequestSchema = requestSchema.omit({
    id: true,
    user_id: true,
    item_id: true,
    createdAt: true,
    updatedAt: true
})

export const updateRequestSchema = z.object({
    name: z.string().min(1, "title should be longer 1 char").max(255).optional(),
    email: z.string().min(4, "must cntain a valid email syntaz").max(255).optional(),
    phone: z.number().min(11, "must be a valid number").max(11).optional(),
    message: z.string().optional(),
    descriptions: z.string().optional(),
})