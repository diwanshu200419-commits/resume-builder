"use client";

import { motion } from "framer-motion";

const companyLogos = [
  {
    name: "Google",
    svg: (
      <svg className="h-7 w-auto transition-transform duration-200 hover:scale-110" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    name: "Microsoft",
    svg: (
      <svg className="h-6 w-auto transition-transform duration-200 hover:scale-110" viewBox="0 0 23 23">
        <path fill="#f35325" d="M1 1h10v10H1z"/>
        <path fill="#81bc06" d="M12 1h10v10H12z"/>
        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
        <path fill="#ffba08" d="M12 12h10v10H12z"/>
      </svg>
    ),
  },
  {
    name: "Amazon",
    svg: (
      <span className="font-extrabold text-lg text-amber-500 tracking-tight flex items-center gap-0.5 hover:scale-105 transition-transform">
        amazon<span className="text-xs text-amber-400 font-normal">.in</span>
      </span>
    ),
  },
  {
    name: "Flipkart",
    svg: (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-black text-sm tracking-wide hover:scale-105 transition-transform">
        <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded font-black text-xs">f</span> Flipkart
      </div>
    ),
  },
  {
    name: "TCS",
    svg: (
      <span className="font-black text-base tracking-widest text-sky-400 border border-sky-400/30 px-2.5 py-1 rounded-lg bg-sky-400/10 hover:scale-105 transition-transform">
        TCS
      </span>
    ),
  },
  {
    name: "Infosys",
    svg: (
      <span className="font-bold text-base text-blue-400 tracking-wider hover:scale-105 transition-transform">
        Infosys
      </span>
    ),
  },
  {
    name: "Meta",
    svg: (
      <svg className="h-6 w-auto text-blue-500 transition-transform duration-200 hover:scale-110 fill-current" viewBox="0 0 24 24">
        <path d="M16.6 2C14.7 2 13.1 3 12 4.5 10.9 3 9.3 2 7.4 2 4 2 1.3 4.7 1.3 8.1c0 5 4.8 9.5 9.8 13.4.5.4 1.2.4 1.7 0 5-3.9 9.8-8.4 9.8-13.4C22.7 4.7 20 2 16.6 2z"/>
      </svg>
    ),
  },
  {
    name: "Uber",
    svg: (
      <span className="font-black text-lg text-slate-100 tracking-tighter hover:scale-105 transition-transform">
        Uber
      </span>
    ),
  },
];

export function SocialProof() {
  return (
    <section className="py-10 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-secondary text-xs sm:text-sm font-medium mb-6 uppercase tracking-wider"
        >
          Join <span className="text-text-primary font-bold">2,400+</span> candidates hired at top companies
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companyLogos.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-center cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
              title={`Candidates hired at ${item.name}`}
            >
              {item.svg}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
