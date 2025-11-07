export function summarizeProfiles(profiles = []) {
  const roleCounts = {}
  let newsletterCount = 0
  const countryCounts = {}

  for (const profile of profiles) {
    const roleKey = profile?.role ?? "unknown"
    roleCounts[roleKey] = (roleCounts[roleKey] || 0) + 1

    if (profile?.newsletter) {
      newsletterCount += 1
    }

    const location = profile?.location
    if (typeof location === "string" && location.trim().length > 0) {
      const segments = location.split(",")
      const country = segments[segments.length - 1].trim()
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1
      }
    }
  }

  const total = profiles.length
  const newsletterRate = total > 0 ? Math.round((newsletterCount / total) * 100) : 0

  const roleDistribution = Object.entries(roleCounts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  return {
    total,
    roleCounts,
    newsletterCount,
    newsletterRate,
    roleDistribution,
    topCountries,
  }
}
