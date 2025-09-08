import type { Entitlements } from '@flatfinder/shared';
import express, { Request, Response, NextFunction } from 'express';
import { billingRouter } from './billing';

const app = express();

// Basic CORS (configure CORS_ORIGIN in env for stricter policy)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = process.env.CORS_ORIGIN ?? '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

// Request ID middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const existing = req.headers['x-request-id'];
  const rid = typeof existing === 'string' && existing.length > 0 ? existing : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  (req as any).requestId = rid;
  next();
});

// Mount webhooks BEFORE JSON body parser to preserve Stripe raw body
app.use('/billing', billingRouter);

// JSON body parser for normal routes
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Mock entitlement resolver middleware
app.use(async (req: Request, _res: Response, next: NextFunction) => {
  // In real implementation, resolve from Clerk session + DB
  const entitlements: Entitlements = {
    canViewContact: false,
    canRequestOutreach: false,
    weeklyMatchQuota: 3,
  };
  (req as any).entitlements = entitlements;
  next();
});

app.get('/matches', async (req: Request, res: Response) => {
  const entitlements = (req as any).entitlements as Entitlements;
  res.json({
    items: [
      {
        id: 'l1',
        title: 'Cozy 1BR near park',
        price: 1800,
        location: 'Toronto, ON',
        photos: [],
        contactAvailable: entitlements.canViewContact,
      },
    ],
    entitlements,
  });
});

app.get('/listings/:id', async (req: Request, res: Response) => {
  const entitlements = (req as any).entitlements as Entitlements;
  const base = {
    id: req.params.id,
    title: 'Cozy 1BR near park',
    price: 1800,
    location: 'Toronto, ON',
    photos: [],
  };
  if (entitlements.canViewContact) {
    return res.json({ ...base, contact: { redacted: false, email: 'landlord@example.com' } });
  }
  return res.json({ ...base, contact: { redacted: true } });
});

app.get('/listings/:id/contact', async (req: Request, res: Response) => {
  const entitlements = (req as any).entitlements as Entitlements;
  const requestId = (req as any).requestId as string;
  if (!entitlements.canViewContact) {
    // Audit log (redacted)
    console.warn('Contact access blocked', { requestId, listingId: req.params.id });
    return res.status(403).json({ error: 'Upgrade required to view contact details' });
  }
  // TODO: audit success in real audit store
  console.info('Contact access allowed', { requestId, listingId: req.params.id });
  res.json({ email: 'landlord@example.com', phone: '+1-555-123-4567' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = typeof err?.status === 'number' ? err.status : 500;
  const message = err?.message || 'Internal Server Error';
  console.error('API error:', { status, message });
  res.status(status).json({ error: message });
});

const port = parseInt(process.env.PORT || '3001', 10);
app.listen(port, () => console.log(`API listening on ${port}`));
