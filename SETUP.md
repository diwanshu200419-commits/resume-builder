# ResumeAI — Setup Guide

Follow these steps to get the app running locally.

## Step 1: Install dependencies

```bash
npm install
```

## Step 2: Get your API keys

### Supabase (Database + Auth) — FREE

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** → choose a name and password
3. Wait for the project to finish setting up (~2 min)
4. Go to **Project Settings** → **API**
5. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
6. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → click **Run**
7. Verify setup locally: `npm run verify-setup`
8. (Optional) Go to **Authentication** → **Providers** → enable **Google**

### Google Gemini (AI) — FREE

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API key** → **Create API key**
3. Copy the key → `GEMINI_API_KEY`

### Razorpay (Payments) — Optional for testing

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) and sign up
2. Switch to **Test Mode** (toggle in top-left)
3. Go to **Settings** → **API Keys** → **Generate Test Key**
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

> Payments are optional. The app works without Razorpay — users just can't upgrade plans.

## Step 3: Create `.env.local`

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

> **Important:** Use `.env.local` (not `.env.example`). Next.js loads `.env.local` automatically.
> For `NEXT_PUBLIC_SUPABASE_URL`, use the **Project URL only** — e.g. `https://xxxxx.supabase.co` — **not** `/rest/v1/`.

Your `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
GEMINI_API_KEY=AIzaSy...
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Verify setup

```bash
npm run verify-setup
```

This checks Supabase connectivity and confirms the database tables exist.

## Step 5: Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the flow

1. Sign up at `/signup`
2. Go to **New Analysis**
3. Upload a resume (PDF/DOCX/TXT)
4. Paste a job description
5. Click **Analyze my resume**
6. View your ATS score and optimized resume

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Deploy

After deploying, update Supabase **Authentication** → **URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/api/auth/callback`
