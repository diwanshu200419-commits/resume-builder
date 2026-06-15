# ResumeAI

AI-powered resume optimization platform that helps job seekers improve ATS scores, optimize resumes for job descriptions, and download professionally formatted resumes.

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Next.js API Routes, Supabase (Auth + PostgreSQL)
- **AI:** Google Gemini 1.5 Flash
- **Payments:** Razorpay

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Enable Google OAuth in Authentication → Providers (optional)
4. Copy your project URL and anon key

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | ₹0 | 2 analyses/month, ATS score |
| Pro | ₹199/mo | Unlimited analyses, downloads, cover letter |
| Premium | ₹399/mo | Everything + interview prep + LinkedIn |

## Deploy on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
