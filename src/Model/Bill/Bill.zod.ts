import { array, z } from 'zod';
import { itemInterfaceSchema } from './Item.zod';

export const billInterfaceSchema = z.object({
  number: z.string(),
  currency: z.string(),
  email: z.string(),
  token: z.string().optional(),
  name: z.string().optional(),
  items: array(itemInterfaceSchema),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  dueDate: z.string().optional(),
  passProcessingFee: z.boolean().optional(),
  status: z.string().optional(),
  url: z.string().optional(),
  createdDate: z.string().optional(),
  id: z.string().optional(),
  merchant: z.string().optional(),
  cc: z.union([z.array(z.string()), z.tuple([])])
});
