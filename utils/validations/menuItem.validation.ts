import {z} from 'zod';

export const menuItemSchema = z.object({
  id: z.string().optional().default(""),
  itemName: z.string(),
  category: z.string(),
  specialTag: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),  
  userId: z.string(),
})