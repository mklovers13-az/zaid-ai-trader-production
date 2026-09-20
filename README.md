# SMC Trade — Production Starter

This is the production-oriented foundation for the SaaS you described.

## Included now
- Google OAuth sign-in
- One Supabase identity per Google account
- Server-side daily free analysis quota (6/day)
- Paid credit ledger
- Unlimited-plan field
- Chart upload endpoint
- Server-side AI image analysis hook
- Analysis history database
- Paddle webhook placeholder
- Vercel/Next.js-ready structure
- No private API key in browser code

## What you must connect
1. Supabase project
2. Google OAuth credentials
3. OpenAI API key
4. Market-data provider
5. Paddle merchant account (or another billing provider)
6. Domain
7. Vercel account

## Security
NEVER put SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, Paddle secret, or any MT5 credential in client-side code or send them in a public chat.

## Google login
In Supabase: Authentication -> Providers -> Google.
Create a Google OAuth Web Client in Google Cloud and add your production URL and Supabase callback URL as described by Supabase's Google OAuth guide.

## Database
Run `supabase/schema.sql` in Supabase SQL Editor.

## Local run
1. Install Node.js.
2. Copy `.env.example` to `.env.local`.
3. Fill the variables.
4. `npm install`
5. `npm run dev`
6. Open http://localhost:3000

## Deploy
Push to a private GitHub repository, import into Vercel, add the same environment variables, deploy, then connect your domain.

## Billing
For a Pakistan-based SaaS, Stripe's current official supported-country list does not include Pakistan. Paddle's current documentation explicitly lists Pakistan (`PK`) among supported sales countries; seller approval and payout eligibility still need to be confirmed with Paddle for your exact business. Billing code therefore uses a webhook boundary rather than trusting the browser.

## AI
The API is structured so the server calls the AI model with the chart image. Before real trading use, add deterministic market-data/indicator features and store the exact signal + model version so results can be audited.

## Important
This is not a claim that AI signals will be profitable. The site should be forward-tested, with spread, slippage, news, and execution differences tracked.
