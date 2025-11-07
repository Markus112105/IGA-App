"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { BookOpen } from "lucide-react"
import { Flame, Gift, Trophy, Star } from "lucide-react"

export default function DashboardPage() {
  // Temporary data for struggled subjects
  const struggledSubjects = [
    { name: "Math", difficulty: 85, hoursSpent: 24 },
    { name: "Science", difficulty: 78, hoursSpent: 31 },
    { name: "English", difficulty: 72, hoursSpent: 19 },
    { name: "History", difficulty: 68, hoursSpent: 22 },
  ]

  // User tenure data
  const userTenure = {
    semesters: 2,
    startDate: "Fall 2024",
    totalHours: 156,
  }

// Gamification state
const LS_KEY = "iga_gamification";

function loadState() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
}

function saveState(next) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(next));
}

// Rewards catalog
const rewardsCatalog = [
  { id: "badge-starter", type: "badge", name: "Starter Badge", cost: 100, emoji: "🎖️", desc: "Your first milestone!" },
  { id: "badge-streak3", type: "badge", name: "3-Day Streak", cost: 0,   emoji: "🔥",  desc: "Auto-unlocks at 3 days." },
  { id: "gift-wallpaper", type: "gift",  name: "IGA Wallpaper", cost: 250, emoji: "🖼️", desc: "Downloadable phone background." },
  { id: "gift-sticker",   type: "gift",  name: "Digital Sticker Pack", cost: 400, emoji: "💫", desc: "Use in your profile." },
];

const [points, setPoints] = useState(0);
const [streak, setStreak] = useState(0);
const [lastCheckIn, setLastCheckIn] = useState(null); 
const [claimed, setClaimed] = useState({}); 

useEffect(() => {
  const s = loadState();
  if (s) {
    setPoints(s.points ?? 0);
    setStreak(s.streak ?? 0);
    setLastCheckIn(s.lastCheckIn ?? null);
    setClaimed(s.claimed ?? {});
  }
}, []);

function persist(next = {}) {
  const snapshot = {
    points,
    streak,
    lastCheckIn,
    claimed,
    ...next,
  };
  saveState(snapshot);
}

// Points award helper
function award(amt, reason = "") {
  const next = points + amt;
  setPoints(next);
  persist({ points: next });
}

// Daily check-in, +20 pts, increments streak when consecutive
function dailyCheckIn() {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayISO = today.toISOString();

  if (lastCheckIn) {
    const prev = new Date(lastCheckIn);
    const diffDays = Math.round((today - prev) / (1000*60*60*24));
    if (diffDays === 0) { return; }             // already checked in today
    else if (diffDays === 1) {                  // consecutive
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      award(20, "Daily check-in");
      setLastCheckIn(todayISO);
      persist({ streak: nextStreak, lastCheckIn: todayISO });
      // auto-unlock 3-day badge
      if (nextStreak === 3 && !claimed["badge-streak3"]) {
        setClaimed(prev => {
          const c = { ...prev, "badge-streak3": true };
          persist({ claimed: c });
          return c;
        });
      }
      return;
    } else {                                   // the streak was broken
      setStreak(1);
      award(20, "Daily check-in");
      setLastCheckIn(todayISO);
      persist({ streak: 1, lastCheckIn: todayISO });
      return;
    }
  }

  // first time
  setStreak(1);
  award(20, "Daily check-in");
  setLastCheckIn(todayISO);
  persist({ streak: 1, lastCheckIn: todayISO });
}

// Claim a reward: deduct points, mark as claimed
function claimReward(id, cost) {
  if (claimed[id]) return;
  if (points < cost) return;
  const nextPoints = points - cost;
  setPoints(nextPoints);
  setClaimed(prev => {
    const c = { ...prev, [id]: true };
    persist({ points: nextPoints, claimed: c });
    return c;
  });
}

// Example “earn” actions
function completeModule() { award(50, "Module completed"); }
function attendEvent() { award(40, "Event attended"); }
function postStory() { award(30, "Shared a story"); }

  return (
    <div className="min-h-screen bg-[#ffeded]">
      {/* Header */}
      <header className="border-b border-black/10 bg-[#ffeded]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-black" />
            <span className="text-xl font-bold text-black">IGA</span>
          </div>
          <nav></nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Your Learning Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Struggling Subjects Section */}
          <Card className="bg-white border-black/10">
            <CardHeader>
              <CardTitle className="text-black">Most Challenging Subjects</CardTitle>
              <CardDescription className="text-black/70">
                Subjects where you've spent the most time and effort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {struggledSubjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">{subject.name}</span>
                      <span className="text-sm text-black/70">{subject.hoursSpent}h</span>
                    </div>
                    <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-black transition-all" style={{ width: `${subject.difficulty}%` }} />
                    </div>
                    <p className="text-xs text-black/60">Difficulty level: {subject.difficulty}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Tenure Section */}
          <Card className="bg-white border-black/10">
            <CardHeader>
              <CardTitle className="text-black">Your Journey With Us</CardTitle>
              <CardDescription className="text-black/70">Track your learning progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-6xl font-bold text-black mb-2">{userTenure.semesters}</div>
                  <p className="text-lg text-black/70">{userTenure.semesters === 1 ? "Semester" : "Semesters"}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-black/10">
                  <div className="flex justify-between items-center">
                    <span className="text-black/70">Started</span>
                    <span className="font-medium text-black">{userTenure.startDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/70">Total Study Hours</span>
                    <span className="font-medium text-black">{userTenure.totalHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/70">Average per Week</span>
                    <span className="font-medium text-black">
                      {Math.round(userTenure.totalHours / (userTenure.semesters * 16))}h
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="bg-white border-black/20 text-black hover:bg-black/5 px-8 py-2">
            Modules
          </Button>
        </div>

        {/* Gamification: Points, Streak, Badges, Digital Gifts */}
        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Points and streaks */}
          <Card className="bg-white border-black/10 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Trophy className="h-5 w-5" /> Your Points
              </CardTitle>
              <CardDescription className="text-black/70">Earn points by learning and participating.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-extrabold text-black">{points}</div>
                  <div className="text-sm text-black/60 mt-1">Total points</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 border border-orange-200">
                    <Flame className="h-4 w-4" /> {streak}-day streak
                  </div>
                  <Button
                    onClick={dailyCheckIn}
                    className="mt-3 bg-black text-white hover:bg-black/80"
                  >
                    Daily check-in (+20)
                  </Button>
                </div>
              </div>

              {/* Quick ways to earn */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-black mb-2">Earn more points</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="justify-center border-black/20 text-black hover:bg-black/5 text-sm px-2 py-1 whitespace-normal leading-tight"
                    onClick={completeModule}
                  >
                    Complete Module (+50)
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-center border-black/20 text-black hover:bg-black/5 text-sm px-3 py-1 whitespace-normal leading-tight"
                    onClick={attendEvent}
                  >
                    Attend Event (+40)
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-center border-black/20 text-black hover:bg-black/5 text-sm px-3 py-1 whitespace-normal leading-tight"
                    onClick={postStory}
                  >
                    Share a Story (+30)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="bg-white border-black/10 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Star className="h-5 w-5" /> Badges
              </CardTitle>
              <CardDescription className="text-black/70">
                Unlock badges by hitting milestones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {/* Starter badge */}
                <div className="rounded-xl border border-black/10 p-3 text-center">
                  <div className="text-3xl">🎖️</div>
                  <div className="mt-1 font-medium text-black text-sm">Starter Badge</div>
                  <div className="text-xs text-black/60">Cost: 100</div>
                  <Button
                    disabled={claimed["badge-starter"] || points < 100}
                    onClick={() => claimReward("badge-starter", 100)}
                    className="mt-2 w-full bg-black text-white disabled:opacity-50"
                  >
                    {claimed["badge-starter"] ? "Unlocked" : points < 100 ? "Need 100 pts" : "Unlock"}
                  </Button>
                </div>

                {/* 3-day streak badge */}
                <div className="rounded-xl border border-black/10 p-3 text-center">
                  <div className="text-3xl">🔥</div>
                  <div className="mt-1 font-medium text-black text-sm">3-Day Streak</div>
                  <div className="text-xs text-black/60">Auto unlock</div>
                  <Button disabled className="mt-2 w-full bg-black text-white disabled:opacity-50">
                    {claimed["badge-streak3"] ? "Unlocked" : "Locked"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Gifts */}
          <Card className="bg-white border-black/10 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Gift className="h-5 w-5" /> Digital Gifts
              </CardTitle>
              <CardDescription className="text-black/70">
                Trade points for fun digital prizes!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rewardsCatalog.filter(r => r.type === "gift").map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border border-black/10 p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{r.emoji}</div>
                      <div>
                        <div className="font-medium text-black">{r.name}</div>
                        <div className="text-xs text-black/60">{r.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-black/60 mb-1">Cost: {r.cost}</div>
                      <Button
                        disabled={claimed[r.id] || points < r.cost}
                        onClick={() => claimReward(r.id, r.cost)}
                        className="bg-black text-white disabled:opacity-50"
                      >
                        {claimed[r.id] ? "Claimed" : points < r.cost ? "Not enough pts" : "Claim"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
