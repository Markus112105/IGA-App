import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Mail, MessageCircle, Users } from "lucide-react";

const supportHighlights = [
  {
    title: "Prospective students",
    description: "Learn how to join a cohort, prepare for your application, and pick the right program pathway for you.",
    href: "/signup",
    cta: "Start your application",
    icon: Users,
  },
  {
    title: "Ask the team",
    description: "Not seeing what you need? Reach out and we will connect you to the right staff member within two business days.",
    href: "mailto:hello@internationalgirlsacademy.org",
    cta: "Email us",
    icon: Mail,
  },
  {
    title: "Partner with the International Girls Academy",
    description: "Educators, mentors, and sponsors can collaborate with us year-round to lift up girls in their communities.",
    href: "/mentors",
    cta: "Explore opportunities",
    icon: MessageCircle,
  },
];

const faqs = [
  {
    question: "What is the International Girls Academy?",
    answer: [
      "The International Girls Academy is a global learning community that helps girls build confidence, leadership, and technical skills by pairing live programming with mentorship and cultural exchange.",
      "We believe every girl can be a changemaker, and we design experiences that make that possible regardless of income, location, or previous exposure to science, technology, engineering, and math (STEM) or entrepreneurship.",
    ],
  },
  {
    question: "Who can join the academy?",
    answer: [
      "Our core programs serve girls ages 10-18 who are curious, collaborative, and ready to grow.",
      "We intentionally center Black girls and girls of color, and welcome allies from anywhere in the world who want to learn within an inclusive sisterhood.",
    ],
  },
  {
    question: "How do I apply for a program?",
    answer: [
      "Submit the quick interest form and select the program that fits your goals. Our team reviews submissions weekly and will invite you to a welcome call if a seat is available.",
    ],
    bullets: [
      "Create or sign in to your International Girls Academy account",
      "Share your interests, location, and availability",
      "Attend a virtual meet-and-greet to finalize enrollment",
    ],
  },
  {
    question: "What does it cost to participate?",
    answer: [
      "International Girls Academy (IGA) programs are scholarship-funded thanks to generous partners. Most cohorts are offered at no cost to students, and we provide technology or internet stipends when needed.",
      "Mentors and alumni volunteers also receive complimentary training and resources.",
    ],
  },
  {
    question: "How much time should I expect to commit?",
    answer: [
      "Cohorts typically run six to twelve weeks. Learners spend 3-4 hours each week between live workshops, mentorship sessions, and project work.",
      "Mentors commit about two hours per week, which includes preparation and a weekly check-in with their mentee squad.",
    ],
  },
  {
    question: "What kinds of programs are available?",
    answer: [
      "We currently offer the Nia (Purpose) Empowerment Academy—often shortened to NIA—the Ujima (Collective Work and Responsibility) Business Program, Kumbathon, and the Nia Global Academy.",
      "Each pathway blends leadership, entrepreneurship, science, technology, engineering, and math (STEM) exploration, and global citizenship projects tailored to different age groups.",
    ],
  },
  {
    question: "Do you offer virtual or in-person experiences?",
    answer: [
      "Both. Many of our cohorts are virtual-first so girls can participate no matter where they live.",
      "We also host local pop-ups, field trips, and community events in partner cities throughout the year.",
    ],
  },
  {
    question: "How can adults or organizations support the International Girls Academy (IGA)?",
    answer: [
      "You can mentor a cohort, sponsor technology kits, host an International Girls Academy (IGA) site visit, or co-design a workshop aligned with your expertise.",
      "Reach out through our partnership form and we will help you design a collaboration that matches your goals and availability.",
    ],
    cta: {
      label: "Share your partnership idea",
      href: "mailto:partners@internationalgirlsacademy.org",
    },
  },
];

const FAQPage = () => {
  return (
    <div className="space-y-12 pb-20 pt-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-8 py-12 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-fuchsia-100">Support hub</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Frequently Asked Questions</h1>
          <p className="text-lg text-fuchsia-100">
            Find quick answers about joining the International Girls Academy, supporting our work, and making the most of your journey.
          </p>
          <div className="flex flex-col justify-center gap-3 text-sm sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-rose-600 shadow-lg shadow-rose-500/30 transition hover:scale-[1.02] hover:bg-rose-50"
            >
              Start an application
            </Link>
            <Link
              href="mailto:hello@internationalgirlsacademy.org"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Contact support
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {supportHighlights.map(({ title, description, href, cta, icon: Icon }) => (
          <Card key={title} className="border-none bg-muted/40 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-rose-700">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href={href}
                className="inline-flex items-center text-sm font-medium text-rose-600 transition hover:text-rose-500"
              >
                {cta}
                <span aria-hidden className="ml-1">→</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-4xl space-y-4">
        {faqs.map(({ question, answer, bullets, cta }) => (
          <details
            key={question}
            className="group rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm transition hover:shadow-md"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
              <span className="text-base font-semibold text-rose-700">{question}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition group-open:rotate-180">
                <ChevronDown className="h-4 w-4" />
              </span>
            </summary>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {Array.isArray(bullets) && bullets.length > 0 && (
                <ul className="list-disc space-y-2 pl-5">
                  {bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {cta && (
                <Link
                  href={cta.href}
                  className="inline-flex items-center text-sm font-medium text-rose-600 transition hover:text-rose-500"
                >
                  {cta.label}
                  <span aria-hidden className="ml-1">→</span>
                </Link>
              )}
            </div>
          </details>
        ))}
      </section>

      <section className="mx-auto max-w-4xl rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-rose-700">Still looking for an answer?</h2>
        <p className="mt-3 text-sm text-rose-600">
          Send us a note at
          {' '}
          <a href="mailto:hello@internationalgirlsacademy.org" className="font-medium text-rose-700 underline">
            hello@internationalgirlsacademy.org
          </a>
          {' '}
          or join a welcome session to chat live with an International Girls Academy (IGA) mentor.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/statistics"
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-rose-500"
          >
            Explore community impact
          </Link>
          <Link
            href="/mentors"
            className="inline-flex items-center justify-center rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-white"
          >
            Meet our mentors
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
