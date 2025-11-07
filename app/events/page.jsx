"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const events = [
    {
      id: "flyer1",
      title: "Juntas Somos Más: Honoring Latinas — Hybrid Celebration & Spotlight",
      date: "Oct 5 @ 11:00 AM - 4:00 PM",
      location: "140 Sussex Ave, Newark, NJ 07103, USA",
      image: "/flyer1.png",
      description: `Celebrate the power of community and the achievements of inspiring Latinas at our hybrid event, Juntas Somos Más: Honoring Latinas—Hybrid Celebration & Spotlight. This special gathering brings together participants both in person and online, uniting our community to honor outstanding Latina leaders, changemakers, and role models.

In-Person Celebration: Join us for a vibrant gathering where we recognize and celebrate our honorees with live tributes, music, and community connection. Experience the energy of collective support and witness the impact of Latina leadership firsthand.

Blog & Digital Features: Throughout Hispanic Heritage Month, our blog will spotlight each honoree’s story, achievements, and contributions. These features will amplify their voices, inspire others, and ensure their legacies reach a wider audience.

Interactive Engagement: Whether attending in person or following along online, participants can share messages of support, ask questions, and connect with honorees through live Q&A and comment sections.

This hybrid event embodies the International Girls Academy’s mission by uplifting Latina voices, fostering unity, and celebrating the collective strength of our community. Join us as we honor those who lead the way and inspire the next generation—because together, we rise, and every story matters.`,
    },
    {
      id: "flyer2",
      title: "Reflections of Becoming Her Girls Conference",
      date: "Sat, March 14 @ 9:00 AM - 2:00 PM",
      location: "Hosted by the International Girls Academy",
      image: "/flyer2.png",
      description: `Step into a transformative experience at Reflections of Becoming Her, an inspiring event dedicated to celebrating the journey of self-discovery, growth, and empowerment for girls and young women. Hosted by the International Girls Academy, this gathering invites participants to reflect on their unique paths, honor their achievements, and envision the women they are becoming.

Event Highlights

Personal Storytelling: Hear powerful stories from women and girls who have overcome challenges, embraced their identities, and found their voices.

Guided Reflection Activities: Engage in interactive exercises and journaling sessions designed to foster self-awareness, confidence, and vision for the future.

Mentorship Circles: Connect with mentors and peers in supportive small groups, sharing experiences and building lasting relationships.

Creative Expression: Participate in art, poetry, or music workshops that encourage self-expression and celebrate individuality.

Recognition Ceremony: Celebrate the milestones and growth of participants, highlighting the strength and resilience within each girl.

Why Attend?

Reflect on your journey and celebrate your progress
Gain tools for self-discovery and confidence-building
Connect with a supportive community of peers and mentors
Be inspired by the stories and achievements of others

Join us for an uplifting day of reflection, connection, and celebration as we honor every step of becoming her—because every girl’s story matters, and every journey is worth celebrating.`,
    },
    {
      id: "flyer3",
      title: "UJAMMA Tea Party — Powered by Project Tea",
      date: "Mar 8, 2026 @ 11:00 AM - 2:00 PM",
      location: "Venue: TBD",
      image: "/flyer3.png",
      description: `International Girls Academy presents the UJAMMA Tea Party, proudly powered by Project Tea! Join us for an uplifting afternoon of community, culture, and empowerment as we celebrate the spirit of UJAMAA—cooperative economics and unity.

Enjoy exquisite teas, light refreshments, and inspiring conversations in a beautiful setting dedicated to uplifting young women from around the world. This vibrant event will also feature interactive activities, guest speakers, cultural performances, and opportunities to connect with fellow supporters of girls' education and empowerment.

Cause: Proceeds from the UJAMMA Tea Party will directly support our upcoming International Girls Academy Summer Camp and provide essential operational funding. Your participation will help us continue our mission: providing transformative learning experiences, leadership development, and safe spaces for girls to thrive.

We invite you to sip, support, and make a difference—because when girls rise, communities flourish!`,
    },
  ];

  async function handleSubmit(e) {
  e.preventDefault();
  setMessage("");

  if (!selectedEvent || !email) {
    setMessage("Please select an event and enter your email.");
    return;
  }

  try {
    // Find event details from your array
    const selected = events.find((ev) => ev.title === selectedEvent);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventname: selected.title,
        date: selected.date,
        time: selected.date.split("@")[1]?.trim() || "",
        location: selected.location,
        user_email: email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(` ${data.error || "Something went wrong."}`);
      return;
    }

    setMessage("You’ve successfully signed up for the event! We hope to see you there!");
    setEmail("");
    setSelectedEvent("");
  } catch (err) {
    console.error(err);
    setMessage("Error submitting form.");
  }
}


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center">Upcoming Events</h1>

      {/* Event cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{e.title}</CardTitle>
              <p className="text-sm text-gray-500">{e.date}</p>
              <p className="text-sm text-gray-600">{e.location}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <img
                src={e.image}
                alt={e.title}
                className="w-full h-48 object-contain bg-gray-50 rounded mb-3"
              />
              <p className="text-sm text-gray-700 whitespace-pre-line">{e.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sign-up form */}
      <div className="mt-10 p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up for an Event</h2>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel>Select an Event</FieldLabel>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">-- Choose an event --</option>
                {events.map((e) => (
                  <option key={e.id} value={e.title}>
                    {e.title}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FieldDescription>We’ll send event updates and reminders to this email.</FieldDescription>
            </Field>

            <div className="flex justify-center">
              <Button type="submit" className="bg-[#ffeded] text-black hover:bg-[#ffdede]">
                Sign Up
              </Button>
            </div>

            {message && (
              <p className="text-center mt-3 text-sm">
                {message}
              </p>
            )}
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
