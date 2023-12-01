import { z } from 'zod';

export const payoutInfoInterfaceSchema = z.object({
  name: z.string().optional(),
  account: z.string().optional(),
  routing: z.string().optional(),
  merchantEin: z.string().optional(),
  label: z.string().optional(),
  bankCountry: z.string().optional(),
  bank: z.string().optional(),
  swift: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal: z.string().optional(),
  sort: z.string().optional(),
  wire: z.boolean().optional(),
  bankName: z.string().optional(),
  bankAddress: z.string().optional(),
  bankAddress2: z.string().optional(),
  iban: z.string().optional(),
  additionalInformation: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountHolderAddress: z.string().optional(),
  accountHolderAddress2: z.string().optional(),
  accountHolderPostalCode: z.string().optional(),
  accountHolderCity: z.string().optional(),
  accountHolderCountry: z.string().optional()
});
