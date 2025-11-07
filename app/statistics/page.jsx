import Image from "next/image"
import Link from "next/link"

import UsersChart from "@/components/UserChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import mockData from "@/data/mockData.json"
import { Globe2 } from "lucide-react"

const { profiles, programs, progress, engagement } = mockData

// Live community counts (public-facing minimums)
const studentCount = 1000
const mentorCount = 100
const alumniCount = 100

const completionRecords = progress.filter((entry) => entry.status === "completed")
const scoredRecords = completionRecords.filter((entry) => entry.score != null)
const modulesCompleted = completionRecords.length
const averageScore = scoredRecords.length
  ? Math.round(scoredRecords.reduce((sum, entry) => sum + entry.score, 0) / scoredRecords.length)
  : null

const countries = profiles.reduce((set, profile) => {
  const country = profile.location.split(",").pop()?.trim()
  if (country) {
    set.add(country)
  }
  return set
}, new Set())
const countriesRepresented = countries.size

const globalCommunity = {
  countriesServed: countriesRepresented,
  spotlightRegion: "Africa & the diaspora",
  spotlightCountries: [
    { name: "Ghana", flagSrc: "/flags/ghana.svg" },
    { name: "Nigeria", flagSrc: "/flags/nigeria.svg" },
    { name: "Kenya", flagSrc: "/flags/kenya.svg" },
    { name: "Rwanda", flagSrc: "/flags/rwanda.svg" },
    { name: "Ethiopia", flagSrc: "/flags/ethiopia.svg" },
    { name: "Tanzania", flagSrc: "/flags/tanzania.svg" },
  ],
}

const roleBreakdownSeries = [
  { name: "Students", value: studentCount },
  { name: "Mentors", value: mentorCount },
  { name: "Alumni", value: alumniCount },
]

const highlightMetrics = [
  {
    title: "Learners thriving",
    value: "1k+",
    description: "Active students and alumni in our ecosystem",
  },
  {
    title: "Countries represented",
    value: countriesRepresented,
    description: "A growing international community",
  },
  {
    title: "Mentorship network",
    value: "100+",
    description: "Mentors supporting every cohort",
  },
  {
    title: "Program pathways",
    value: programs.length,
    description: "Live, cohort-based journeys you can join today",
  },
]

const programSpotlights = [
  ...programs.slice(0, 3),
  {
    id: "program-nia-global",
    name: "NIA Global Youth Academy",
    cohort: "Global · Virtual exchanges",
    category: "Global Exchange",
    summary:
      "Connects IGA students with peers in Ghana, Liberia, Guyana, and beyond through global projects and cultural exchanges.",
    tags: ["global exchange", "collaboration", "culture"],
  },
  {
    id: "program-umoja-scholarship",
    name: "UMOJA Scholarship Giveaway",
    cohort: "Biannual · Academic & book awards",
    category: "Scholarships",
    summary:
      "Signature scholarship investing $50,000+ in book and academic support to power IGA members' journeys.",
    tags: ["scholarship", "access", "unity"],
  },
]

const StatisticsPage = () => {
  return (
    <div className="space-y-12 pt-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-8 py-12 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-fuchsia-100">Impact Report</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Uniting, Uplifting, & Empowering Girls Worldwide
          </h1>
          <p className="text-lg text-fuchsia-100">
            The International Girls Academy community is growing every week. See how learners, mentors, and programs intertwine to create a launchpad for bold ideas—and discover where you fit into the story.
          </p>
          <div className="flex flex-col justify-center gap-3 text-sm sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-rose-600 shadow-lg shadow-rose-500/30 transition hover:scale-[1.02] hover:bg-rose-50"
            >
              Join the academy
            </Link>

          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {highlightMetrics.map((metric) => (
          <Card key={metric.title} className="border-none bg-muted/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold text-rose-600">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-rose-100 via-white to-violet-50 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-200/60 blur-3xl" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-rose-700">Global sisterhood</CardTitle>
            <CardDescription className="text-rose-500">
              Connections across {globalCommunity.countriesServed}+ countries
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-rose-400">Countries</p>
                <p className="text-5xl font-bold text-rose-700">
                  {globalCommunity.countriesServed}
                  <span className="text-xl align-super">+</span>
                </p>
                <p className="text-sm text-rose-500">
                  Reaching girls across {globalCommunity.spotlightRegion}
                </p>
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-200/40" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-white shadow-sm">
                  <Globe2 className="h-8 w-8 text-rose-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {globalCommunity.spotlightCountries.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center gap-3 rounded-lg border border-rose-100 bg-white p-2 shadow-sm"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-rose-100">
                    <Image
                      src={country.flagSrc}
                      alt={`${country.name} flag`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-rose-700">{country.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <UsersChart
          title="Who's inside the academy"
          description="A balanced network of learners and leadership powering the community"
          data={roleBreakdownSeries}
          barColor="rgb(236, 72, 153)"
        />
        <Card className="border-none bg-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Learning outcomes</CardTitle>
            <CardDescription>Evidence that our curriculum delivers measurable results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Modules completed</p>
              <p className="text-2xl font-semibold text-rose-600">{modulesCompleted}</p>
              <p className="text-sm text-muted-foreground">high-impact sessions already wrapped this term</p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Average assessment score</p>
              <p className="text-2xl font-semibold text-rose-600">
                {averageScore != null ? `${averageScore}%` : "Coming soon"}
              </p>
              <p className="text-sm text-muted-foreground">confidence that participants are mastering the material</p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Mentor touchpoints</p>
              <p className="text-2xl font-semibold text-rose-600">{engagement.length}</p>
              <p className="text-sm text-muted-foreground">tracked engagements across live sessions, chats, and resources</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Programs shaping the journey</h2>
          <p className="text-muted-foreground">
            When you join, you jump straight into curated cohorts that blend entrepreneurship, technology, and community care.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programSpotlights.map((program) => (
            <Card key={program.id} className="border-none bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-rose-600">{program.name}</CardTitle>
                <CardDescription>{program.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{program.summary}</p>
                {program.extra ? (
                  <p className="text-sm text-muted-foreground">{program.extra}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Card className="border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white gap-0">
          <CardHeader className="text-center space-y-3 pb-0">
            <CardTitle className="text-2xl">Ready to bring your brilliance to the International Girls Academy?</CardTitle>
            <CardDescription className="text-slate-200 max-w-2xl mx-auto">
              We'll plug you into mentors, projects, and a global sisterhood that accelerates your goals within weeks, not years.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 py-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-200"
            >
              Start your application
            </Link>
            <Link
              href="/#questionaire"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-200"
            >
              Not sure? Take our quiz!
            </Link>
          </CardContent>
        </Card>
        <footer className="border-t pt-4 text-center text-sm text-muted-foreground pb-4">
          © {new Date().getFullYear()} International Girls Academy — All rights reserved
        </footer>
      </section>
    </div>
  )
}

export default StatisticsPage