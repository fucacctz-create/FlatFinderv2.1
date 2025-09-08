import express, { Request, Response } from 'express';

export const billingRouter = express.Router();

// Placeholder mapping config; replace with real product IDs and secrets
const TIER_MAPPING = {
  stripe: { free: null, searchBlitz: null, casual: null, premium: null },
  walletconnect: { free: null, searchBlitz: null, casual: null, premium: null },
};

// Stripe webhook stub
billingRouter.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  // TODO: verify signature using STRIPE_WEBHOOK_SECRET
  // TODO: parse event, map product/price to tier, update entitlements/cache
  res.status(200).json({ received: true });
});

// WalletConnect webhook stub
billingRouter.post('/webhooks/walletconnect', express.json(), async (req: Request, res: Response) => {
  // TODO: verify signature using WALLETCONNECT_WEBHOOK_SECRET
  // TODO: parse event, map product to tier, update entitlements/cache
  res.status(200).json({ received: true });
});
