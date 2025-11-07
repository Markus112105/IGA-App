"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"

import mockData from "@/data/mockData.json"
import { summarizeProfiles } from "@/lib/analytics"

export default function UsersChart({
  title = "Community composition",
  description,
  data,
  barColor = "rgb(236, 72, 153)",
}) {
  const { profiles } = mockData

  const profileInsights = useMemo(() => summarizeProfiles(profiles), [profiles])

  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data
    }

    return profileInsights.roleDistribution.map(({ role, count }) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count,
    }))
  }, [data, profileInsights.roleDistribution])

  const newsletterHighlight = useMemo(() => {
    const studentEntry = chartData.find(
      (entry) => typeof entry?.name === "string" && entry.name.toLowerCase() === "students",
    )

    if (studentEntry?.value) {
      const engagedCount = Math.round(studentEntry.value * 0.88)
      return {
        audience: "students",
        rate: 88,
        count: engagedCount,
      }
    }

    return {
      audience: "members",
      rate: profileInsights.newsletterRate,
      count: profileInsights.newsletterCount,
    }
  }, [chartData, profileInsights.newsletterCount, profileInsights.newsletterRate])

  return (
    <Card className="border-none bg-muted/40 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(236, 72, 153, 0.08)" }} />
              <Bar dataKey="value" fill={barColor} radius={[10, 10, 0, 0]}>
                <LabelList dataKey="value" position="top" fill="var(--foreground)" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground">
          {newsletterHighlight.rate}% of {newsletterHighlight.audience} ({newsletterHighlight.count} individuals) stay engaged between sessions through our newsletter.
        </p>
      </CardContent>
    </Card>
  )
}
