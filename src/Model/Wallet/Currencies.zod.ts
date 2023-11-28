import { z } from 'zod';
import { currencyQrInterfaceSchema } from './CurrencyQr.zod';

export const currenciesInterfaceSchema = z.object({
  qr: currencyQrInterfaceSchema.optional(),

  code: z.string(),
  p2p: z.boolean().optional(),
  dappBrowser: z.boolean().optional(),
  payPro: z.boolean().optional(),
  image: z.string().optional(),
  withdrawalFee: z.string().optional(),
  walletConnect: z.boolean().optional()
});
