"use client";
import { useMemo, useState } from "react";
import MentorCard from "./MentorCard";

export default function MentorDirectory({ initialMentors }) {
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("All");
  const [language, setLanguage] = useState("All");

  const filtered = useMemo(() => initialMentors.filter(m => {
    const text = `${m.display_name} ${m.bio} ${(m.expertise_tags||[]).join(" ")}`.toLowerCase();
    const matchesQ = text.includes(q.toLowerCase());
    const matchProg = program==="All" || (m.programs||[]).includes(program);
    const matchLang = language==="All" || (m.languages||[]).includes(language);
    return matchesQ && matchProg && matchLang;
  }), [q, program, language, initialMentors]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input className="border rounded-lg px-3 py-2" placeholder="Search mentors, tags…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded-lg px-3 py-2" value={program} onChange={e=>setProgram(e.target.value)}>
          {["All","UJIMA","Kumbathon","Academy"].map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2" value={language} onChange={e=>setLanguage(e.target.value)}>
          {["All","English","Spanish","French"].map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(m => <MentorCard key={m.id} mentor={m} />)}
      </div>
    </>
  );
}