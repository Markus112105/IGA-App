"use client";
import { useState } from "react";
import { User } from "lucide-react";
import RequestModal from "./request";

export default function MentorCard({ mentor }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        {mentor.avatar_url ? (
          <img src={mentor.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
            <User className="w-5 h-5 text-pink-600" />
          </div>
        )}
        <div>
          <div className="font-semibold">{mentor.display_name}</div>
          <div className="text-xs text-pink-600">{(mentor.programs||[]).join(" • ")}</div>
        </div>
      </div>

      <p className="text-sm text-gray-700 line-clamp-3 mb-3">{mentor.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(mentor.expertise_tags||[]).slice(0,4).map(tag => (
          <span key={tag} className="px-2 py-1 text-xs bg-pink-50 text-pink-700 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{mentor.timezone}</span>
        <button onClick={()=>setOpen(true)} className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-2 rounded-lg">
          Request session
        </button>
      </div>

      <RequestModal open={open} onOpenChange={setOpen} mentor={mentor} />
    </div>
  );
}