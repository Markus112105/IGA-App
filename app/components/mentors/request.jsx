"use client";
import { useEffect, useState } from "react";
import { addRequest } from "../../../lib/localstore";

export default function RequestModal({ open, onOpenChange, mentor }) {
  const [note, setNote] = useState("");
  const [topic, setTopic] = useState("Entrepreneurship");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(()=>{ if(!open){ setNote(""); setTopic("Entrepreneurship"); setConsent(false);} },[open]);

  if (!open) return null;

  function submit() {
    const payload = { mentor_id: mentor.id, mentor_name: mentor.display_name, name, email, topic, note, under18: consent };
    addRequest(payload);
    // Open mailto with prefilled content
    const subject = encodeURIComponent(`Mentor Session Request - ${mentor.display_name}`);
    const body = encodeURIComponent(
`Student: ${name}
Email: ${email}
Under 18: ${consent ? "Yes" : "No"}
Topic: ${topic}
Mentor: ${mentor.display_name}
Note:
${note}`
    );
    window.location.href = `mailto:hello@intl-girls-academy.org?subject=${subject}&body=${body}`;
    onOpenChange(false);
    alert("Request saved locally and email draft opened!");
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="text-lg font-semibold mb-3">Request session with {mentor.display_name}</div>

        <div className="grid gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
          <select className="border rounded-lg px-3 py-2" value={topic} onChange={e=>setTopic(e.target.value)}>
            {["Entrepreneurship","STEM","Financial Literacy","Career"].map(t => <option key={t}>{t}</option>)}
          </select>
          <textarea className="border rounded-lg px-3 py-2 min-h-[90px]" placeholder="What would you like help with?" value={note} onChange={e=>setNote(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
            I am under 18 and have parent/guardian consent.
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded-lg border" onClick={()=>onOpenChange(false)}>Cancel</button>
          <button className="px-3 py-2 rounded-lg bg-pink-600 text-white" onClick={submit}>Send Request</button>
        </div>
      </div>
    </div>
  );
}