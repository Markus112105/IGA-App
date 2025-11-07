"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import mockData from "@/data/mockData.json"
import { summarizeProfiles } from "@/lib/analytics"

export default function LandingDashboard() {
  const { profiles, programs, progress, engagement } = mockData

  const profileInsights = useMemo(() => summarizeProfiles(profiles), [profiles])
  const totalUsers = profileInsights.total
  const students = profileInsights.roleCounts.student ?? 0
  const admins = profileInsights.roleCounts.admin ?? 0
  const newsletterRate = profileInsights.newsletterRate

  const modulesCompleted = progress.filter(p => p.status === "completed").length
  const scoredEntries = progress.filter(p => typeof p.score === "number")
  const avgScore = scoredEntries.length > 0
    ? Math.round(scoredEntries.reduce((sum, p) => sum + (p.score ?? 0), 0) / scoredEntries.length)
    : 0

  const engagementCount = engagement.length
  const engagementTypes = engagement.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})
  const topCountries = profileInsights.topCountries.slice(0, 3)

  // --- UI ---
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center">
        International Girls Academy Statistics
      </h1>
      <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
        Over {totalUsers}+ learners across the world are already building, learning,
        and leading with us. Here’s a snapshot of the impact you’ll be part of:
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">
              {students} students · {admins} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Programs</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{programs.length}</p>
            <p className="text-sm text-muted-foreground">Active initiatives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Avg Score</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">
              {modulesCompleted} modules completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Newsletter</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{newsletterRate}%</p>
            <p className="text-sm text-muted-foreground">opted in</p>
          </CardContent>
        </Card>
      </div>

      {topCountries.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Top Countries</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {topCountries.map(({ country, count }) => (
                  <li key={country} className="flex items-center justify-between">
                    <span>{country}</span>
                    <span className="font-medium text-foreground">{count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Engagement Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Community Engagement</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(engagementTypes).map(([type, count]) => (
            <Card key={type}>
              <CardHeader><CardTitle>{type.replace("_", " ")}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">events logged</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
