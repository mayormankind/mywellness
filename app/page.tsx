import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">

      {/* ── Public Nav ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
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
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                FUTA Student Mental Health Tool
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-foreground leading-tight mb-6">
                Understand Your Mind.{" "}
                <span className="text-primary">Support Your Well-Being.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                A confidential, science-backed self-assessment tool built for FUTA students. Track depression, anxiety, and stress using the validated DASS-21 questionnaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button className="h-12 px-8 text-base w-full sm:w-auto gap-2">
                    Start Free Assessment
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground font-light">
                Free · Confidential · No data shared with anyone
              </p>
            </div>

            {/* Decorative right panel */}
            <div className="relative flex items-center justify-center h-80 lg:h-auto">
              {/* Large bg circle */}
              <div className="absolute w-72 h-72 rounded-full bg-secondary top-0 right-0" />
              {/* Accent circle */}
              <div className="absolute w-40 h-40 rounded-full bg-accent bottom-4 left-4" />
              {/* Small dark circle */}
              <div className="absolute w-16 h-16 rounded-full bg-primary top-8 left-12" />

              {/* Stats card */}
              <div className="relative z-10 bg-white rounded-2xl border border-border p-6 shadow-sm w-64">
                <p className="text-xs text-muted-foreground font-light mb-4">Assessment snapshot</p>
                <div className="space-y-3">
                  {[
                    { label: "Depression", value: "Normal", color: "bg-primary" },
                    { label: "Anxiety", value: "Mild", color: "bg-accent" },
                    { label: "Stress", value: "Normal", color: "bg-primary" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-light">Based on DASS-21 scoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-secondary py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { number: "21", label: "Validated questions", sub: "DASS-21 standard" },
              { number: "3", label: "Subscales assessed", sub: "Depression · Anxiety · Stress" },
              { number: "5", label: "Severity levels", sub: "Normal to Extremely Severe" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm font-semibold text-foreground mb-0.5">{stat.label}</div>
                <div className="text-xs text-muted-foreground font-light">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / DASS-21 ── */}
      <section id="about" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual panel */}
            <div className="relative h-72 lg:h-full">
              <div className="absolute inset-0 bg-secondary rounded-2xl" />
              <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-accent" />
              <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <BrainIcon className="w-16 h-16 text-primary mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground">Science-backed</p>
                  <p className="text-xs text-muted-foreground font-light">DASS-21 instrument</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
                About the Assessment
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">
                Clinically Validated. Built for Students.
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                MyWellness uses the Depression Anxiety Stress Scales (DASS-21), a 21-item questionnaire developed by researchers at the University of New South Wales. It is one of the most widely used tools for measuring psychological distress.
              </p>
              <ul className="space-y-3">
                {[
                  "7 questions each for Depression, Anxiety, and Stress",
                  "Answers reflect your past week — honest, not right or wrong",
                  "Results are instant, private, and only visible to you",
                  "Flags elevated symptoms and points to FUTA support resources",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3 h-3 text-primary" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-secondary py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Register with your FUTA student email and matric number. Verify your email to activate your account.",
              },
              {
                step: "02",
                title: "Take the Assessment",
                desc: "Answer 21 short questions about how you have felt over the past week. No right or wrong answers — be honest.",
              },
              {
                step: "03",
                title: "Get Your Results",
                desc: "Receive instant, personalised feedback with severity classifications and self-care recommendations.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-border p-8">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                  <span className="text-sm font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Use MyWellness?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Validated Assessment",
                desc: "Scientifically validated DASS-21 questionnaire used in clinical and research settings worldwide.",
              },
              {
                icon: TrendingUpIcon,
                title: "Track Your Progress",
                desc: "Visual charts let you monitor your well-being trends across multiple assessments over time.",
              },
              {
                icon: ZapIcon,
                title: "Personalised Feedback",
                desc: "Actionable self-care tips tailored to your specific scores for each subscale.",
              },
              {
                icon: LockIcon,
                title: "Secure & Private",
                desc: "Your data is encrypted and completely private. Only you can ever access your results.",
              },
              {
                icon: HeartHandshakeIcon,
                title: "Crisis Support",
                desc: "When elevated symptoms are detected, FUTA counselling contacts and crisis lines are shown immediately.",
              },
              {
                icon: SmartphoneIcon,
                title: "Mobile Friendly",
                desc: "Fully responsive across all devices — complete your assessment anywhere, anytime.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#166262" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Make Your Mental Health a Priority.{" "}
            <br className="hidden sm:block" />Don&apos;t Overlook It.
          </h2>
          <p className="text-base text-white/80 font-light mb-8 max-w-xl mx-auto">
            Take the first step towards understanding your mental well-being. The assessment takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="h-12 px-8 text-base border-white/40 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
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
