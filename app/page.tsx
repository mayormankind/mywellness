'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon,
  LockIcon,
  HeartHandshakeIcon,
  SmartphoneIcon,
  BrainIcon,
  ArrowRightIcon,
  CheckIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function Reveal({
  children,
  delay = 0,
  from = 'bottom',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'scale';
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const initMap = {
    bottom: { opacity: 0, y: 42, x: 0, scale: 1 },
    left:   { opacity: 0, x: -52, y: 0, scale: 1 },
    right:  { opacity: 0, x: 52,  y: 0, scale: 1 },
    scale:  { opacity: 0, scale: 0.85, y: 0, x: 0 },
  };

  const init = initMap[from];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={init}
      animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : init}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(async (r) => {
        if (r.ok) {
          setIsLoggedIn(true);
          const data = await r.json();
          if (data.user?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      })
      .catch(() => null);
  }, []);

  const features = [
    { icon: ShieldCheckIcon, title: 'Validated Assessment', desc: 'Scientifically validated DASS-21 questionnaire used in clinical and research settings worldwide.' },
    { icon: TrendingUpIcon,  title: 'Track Your Progress',  desc: 'Visual charts let you monitor your well-being trends across multiple assessments over time.' },
    { icon: ZapIcon,         title: 'Personalised Feedback',desc: 'Actionable self-care tips tailored to your specific scores for each subscale.' },
    { icon: LockIcon,        title: 'Secure & Private',     desc: 'Your data is encrypted and completely private. Only you can ever access your results.' },
    { icon: HeartHandshakeIcon, title: 'Crisis Support',    desc: 'When elevated symptoms are detected, FUTA counselling contacts and crisis lines are shown immediately.' },
    { icon: SmartphoneIcon,  title: 'Mobile Friendly',      desc: 'Fully responsive across all devices — complete your assessment anywhere, anytime.' },
  ];

  const steps = [
    { step: '01', title: 'Create Your Account',   desc: 'Register with your FUTA student email and a unique username. Verify your email to activate your account.' },
    { step: '02', title: 'Take the Assessment',   desc: 'Answer 21 short questions about how you are feeling currently. No right or wrong answers — be honest.' },
    { step: '03', title: 'Get Your Results',      desc: 'Receive instant, personalised feedback with severity classifications and self-care recommendations.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Public Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BrainIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                My<span className="text-primary">Wellness</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#about" className="hover:text-foreground transition-colors">About</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            </nav>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href={isAdmin ? "/admin" : "/dashboard"}>
                  <Button className="h-10 px-5 text-sm font-semibold rounded-lg">
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="hidden sm:inline-flex h-10 px-5 text-sm font-semibold rounded-lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="h-10 px-5 text-sm font-semibold rounded-lg">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-white min-h-[88vh] flex items-center py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Ambient floating bubbles — right side atmosphere */}
        {[
          { w: 320, h: 320, top: '-8%',  right: '-6%',  bg: 'bg-secondary',    opacity: 0.65, dur: 7,  del: 0   },
          { w: 190, h: 190, bottom: '8%',right: '6%',   bg: 'bg-accent',       opacity: 0.45, dur: 9,  del: 1   },
          { w: 70,  h: 70,  top: '22%',  right: '16%',  bg: 'bg-primary/20',   opacity: 1,    dur: 5,  del: 0.5 },
          { w: 44,  h: 44,  top: '48%',  right: '32%',  bg: 'bg-primary/30',   opacity: 1,    dur: 6,  del: 1.5 },
          { w: 28,  h: 28,  top: '67%',  right: '20%',  bg: 'bg-accent/40',    opacity: 1,    dur: 8,  del: 0.8 },
          { w: 18,  h: 18,  top: '32%',  right: '26%',  bg: 'bg-secondary/70', opacity: 1,    dur: 6,  del: 2   },
        ].map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${b.bg} pointer-events-none`}
            style={{ width: b.w, height: b.h, top: b.top ?? undefined, bottom: b.bottom ?? undefined, right: b.right ?? undefined, opacity: b.opacity }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: b.opacity, scale: 1, y: [0, -20, 0], x: [0, 6, 0] }}
            transition={{ opacity: { duration: 0.8, delay: 0.2 + i * 0.1 }, scale: { duration: 0.8, delay: 0.2 + i * 0.1 }, y: { duration: b.dur, repeat: Infinity, delay: b.del, ease: 'easeInOut' }, x: { duration: b.dur * 1.3, repeat: Infinity, delay: b.del, ease: 'easeInOut' } }}
          />
        ))}

        {/* Slow-rotating rings */}
        <motion.div
          className="absolute w-[520px] h-[520px] rounded-full border border-primary/8 top-1/2 right-0 -translate-y-1/2 translate-x-1/3 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[360px] h-[360px] rounded-full border border-accent/12 top-1/2 right-0 -translate-y-1/2 translate-x-1/4 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: copy ── */}
            <div>
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                Understand Your Mind.{' '}
                <span className="text-primary relative">
                  Support Your Well-Being.
                  
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48, ease: EASE }}
              >
                A confidential, science-backed self-assessment tool built for FUTA students. Track depression, anxiety, and stress using the validated DASS-21 questionnaire.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
              >
                {isLoggedIn ? (
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button className="h-12 px-8 text-base w-full sm:w-auto gap-2">
                        {isAdmin ? "Go to Admin Panel" : "Go to Dashboard"}{' '}
                        <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Button className="h-12 px-8 text-base w-full sm:w-auto gap-2">
                          Start Free Assessment <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/login">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Button variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">Sign In</Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.div
                className="mt-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.82 }}
              >
                <div className="flex -space-x-2">
                  {['bg-primary', 'bg-accent', 'bg-primary/60'].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-light">Free · Confidential · No data shared with anyone</p>
              </motion.div>
            </div>

            {/* ── Right: animated card ── */}
            <motion.div
              className="relative flex items-center justify-center h-80 lg:h-[460px]"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
            >
              {/* Dashed spinning ring */}
              <motion.div
                className="absolute w-72 h-72 rounded-full border-2 border-dashed border-primary/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              />
              {/* Solid counter-ring */}
              <motion.div
                className="absolute w-52 h-52 rounded-full border border-accent/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              />

              {/* Stats card */}
              <motion.div
                className="relative z-10 bg-white rounded-2xl border border-border p-6 shadow-xl shadow-primary/10 w-64"
                whileHover={{ y: -7 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-muted-foreground font-light">Assessment snapshot</p>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Depression', value: 'Normal', pct: 15, color: 'bg-primary'  },
                    { label: 'Anxiety',    value: 'Mild',   pct: 38, color: 'bg-accent'   },
                    { label: 'Stress',     value: 'Normal', pct: 20, color: 'bg-primary'  },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${item.color}`}>{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 1.1, delay: 0.85 + i * 0.18, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-light">Based on DASS-21 scoring</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-secondary py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { number: '21', label: 'Validated questions', sub: 'DASS-21 standard' },
              { number: '3',  label: 'Subscales assessed',  sub: 'Depression · Anxiety · Stress' },
              { number: '5',  label: 'Severity levels',     sub: 'Normal to Extremely Severe' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.15} from="bottom">
                <div className="text-5xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm font-semibold text-foreground mb-0.5">{stat.label}</div>
                <div className="text-xs text-muted-foreground font-light">{stat.sub}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / DASS-21 ── */}
      <section id="about" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual panel */}
            <Reveal from="left">
              <div className="relative h-72 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl" />
                <motion.div
                  className="absolute top-6 left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-accent to-accent/60 shadow-lg shadow-accent/20"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-gradient-to-bl from-primary to-primary/70 shadow-lg shadow-primary/30"
                  animate={{ scale: [1, 1.09, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                {[
                  { w: 32, h: 32, top: 48,  right: 48,  bg: 'bg-primary/30', dur: 5 },
                  { w: 24, h: 24, bottom: 64, left: 64,  bg: 'bg-accent/40',  dur: 6 },
                  { w: 16, h: 16, top: '50%', right: 32, bg: 'bg-secondary',   dur: 7 },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${b.bg}`}
                    style={{ width: b.w, height: b.h, top: b.top, bottom: b.bottom, left: b.left, right: b.right }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: b.dur, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center relative z-10">
                    <BrainIcon className="w-16 h-16 text-primary mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Science-backed</p>
                    <p className="text-xs text-muted-foreground font-light">DASS-21 instrument</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">About the Assessment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">Clinically Validated. Built for Students.</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                MyWellness uses the Depression Anxiety Stress Scales (DASS-21), a 21-item questionnaire developed by researchers at the University of New South Wales. It is one of the most widely used tools for measuring psychological distress.
              </p>
              <ul className="space-y-3">
                {[
                  '7 questions each for Depression, Anxiety, and Stress',
                  'Answers reflect how you are feeling currently — honest, not right or wrong',
                  'Results are instant, private, and only visible to you',
                  'Flags elevated symptoms and points to FUTA support resources',
                ].map((point, i) => (
                  <motion.li
                    key={point}
                    className="flex items-start gap-3 text-sm text-muted-foreground font-light"
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: EASE }}
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3 h-3 text-primary" />
                    </span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How It Works — Vertical Timeline ── */}
      <section id="how-it-works" className="bg-secondary py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* ambient bubbles */}
        {[
          { w: 80, top: '8%',   left: '3%',   bg: 'bg-primary/10',  dur: 6 },
          { w: 56, top: '20%',  right: '5%',  bg: 'bg-accent/12',   dur: 8 },
          { w: 36, bottom: '12%', right: '14%', bg: 'bg-primary/8', dur: 7 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${b.bg} pointer-events-none`}
            style={{ width: b.w, height: b.w, top: b.top ?? undefined, bottom: b.bottom ?? undefined, left: b.left ?? undefined, right: b.right ?? undefined }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
          />
        ))}

        <div className="max-w-3xl mx-auto relative z-10">
          <Reveal from="bottom" className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
          </Reveal>

          {/* ── Vertical timeline ── */}
          <div ref={timelineRef} className="relative">

            {/* Rail — static grey */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
            {/* Rail — animated teal fill */}
            <motion.div
              className="absolute left-5 top-5 w-0.5 bg-primary origin-top"
              style={{ bottom: '1.25rem' }}
              initial={{ scaleY: 0 }}
              animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
            />

            <div className="space-y-7">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  className="flex items-start gap-6"
                  initial={{ opacity: 0, x: 36 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.45 + index * 0.22, ease: EASE }}
                >
                  {/* Step circle — centred on the rail (left-5 = 1.25rem = half of w-10) */}
                  <motion.div
                    className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={timelineInView ? { scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.6 + index * 0.22 }}
                    whileHover={{ scale: 1.12 }}
                  >
                    <span className="text-xs font-bold text-primary leading-none">{item.step}</span>
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden -mt-0.5"
                    whileHover={{ y: -4, boxShadow: '0 14px 36px rgba(0,0,0,0.09)' }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-primary/5" />
                    <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-accent/8" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm"
                          whileHover={{ scale: 1.1, rotate: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <span className="text-xs font-bold text-white">{item.step}</span>
                        </motion.div>
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {[
          { w: 96,  top: '6%',   right: '6%',  bg: 'bg-secondary/60', dur: 7 },
          { w: 64,  top: '28%',  left: '4%',   bg: 'bg-accent/20',    dur: 9 },
          { w: 44,  bottom: '10%', right: '22%', bg: 'bg-primary/10',  dur: 6 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${b.bg} pointer-events-none`}
            style={{ width: b.w, height: b.w, top: b.top ?? undefined, bottom: b.bottom ?? undefined, left: b.left ?? undefined, right: b.right ?? undefined }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
          />
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal from="bottom" className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Use MyWellness?</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="p-6 rounded-2xl border border-border bg-white relative overflow-hidden"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: EASE }}
                whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.07)', borderColor: 'var(--primary)' }}
              >
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-primary/5" />
                <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-accent/8" />
                <div className="relative z-10">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#166262' }}>
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal from="bottom">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Make Your Mental Health a Priority.{' '}
              <br className="hidden sm:block" />Don&apos;t Overlook It.
            </h2>
            <p className="text-base text-white/80 font-light mb-8 max-w-xl mx-auto">
              Take the first step towards understanding your mental well-being. The assessment takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90 w-full sm:w-auto font-semibold">
                    Create Free Account
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button className="h-12 px-8 text-base bg-transparent border-2 border-white text-white hover:bg-white/15 w-full sm:w-auto font-semibold">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#082B2B" }} className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <BrainIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">
                  My<span className="text-primary">Wellness</span>
                </span>
              </div>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                A mental well-being monitoring system for FUTA students. For educational purposes only — not a substitute for professional medical advice.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Pages</h4>
              <ul className="space-y-2">
                {[
                  { href: "/login", label: "Sign In" },
                  { href: "/register", label: "Register" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/60 hover:text-white font-light transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-white/60 font-light">FUTA Counselling Centre</span>
                </li>
                <li>
                  <span className="text-sm text-white/60 font-light">Suicide Prevention Lifeline: 0800-800-2000</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-white/40 font-light">
              © {new Date().getFullYear()} MyWellness · FUTA Final Year Project · Not a clinical service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
