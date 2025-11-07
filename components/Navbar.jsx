"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const flag = window.localStorage.getItem("iga_isLoggedIn");
      const hasName = window.localStorage.getItem("iga_firstName");
      return flag === "true" || Boolean(hasName);
    } catch (_) {
      return false;
    }
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncAuthState = () => {
      try {
        const flag = window.localStorage.getItem("iga_isLoggedIn");
        const hasName = window.localStorage.getItem("iga_firstName");
        setIsLoggedIn(flag === "true" || Boolean(hasName));
      } catch (_) {
        setIsLoggedIn(false);
      }
    };

    const handleStorage = (event) => {
      if (!event.key || event.key === "iga_isLoggedIn" || event.key === "iga_firstName") {
        syncAuthState();
      }
    };

    const handleAuthEvent = (event) => {
      if (event?.detail && typeof event.detail.isLoggedIn === "boolean") {
        setIsLoggedIn(event.detail.isLoggedIn);
      } else {
        syncAuthState();
      }
    };

    syncAuthState();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("iga-auth", handleAuthEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("iga-auth", handleAuthEvent);
    };
  }, []);

  const handleSignOut = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("iga_isLoggedIn");
        window.localStorage.removeItem("iga_firstName");
        window.dispatchEvent(new CustomEvent("iga-auth", { detail: { isLoggedIn: false } }));
      }
    } catch (_) {
      // ignore localStorage errors during sign-out
    } finally {
      setIsLoggedIn(false);
      try {
        router.push("/login");
      } catch (_) {
        // ignore navigation errors
      }
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="sr-only">International Girls Academy home</span>
          <div className="w-14 h-14 relative overflow-visible">
            <Image
              src="/iimages/logo.png"
              alt="IGA logo"
              fill
              style={{ transformOrigin: "left center" }}
              className="object-contain rounded-md transform scale-[2.8] md:scale-[3.1] lg:scale-[3.6] translate-y-1"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/" className="text-gray-900 hover:text-gray-800 transition">Home</a>
          <a href="/q&a" className="text-gray-900 hover:text-gray-800 transition">Q&amp;A</a>
          <a href="/events" className="text-gray-900 hover:text-gray-800 transition">Events</a>
          <a href="/dashboard" className="text-gray-900 hover:text-gray-800 transition">Overview</a>
          <a href="/statistics" className="text-gray-900 hover:text-gray-800 transition">Statistics</a>
          <a href="/faq" className="text-gray-900 hover:text-gray-800 transition">FAQ</a>
          <a href="/mentors" className="text-gray-900 hover:text-gray-800 transition">Connect</a>

          {!isLoggedIn ? (
            <a
              href="/login"
              className="ml-4 inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-[1.02] transition transform"
            >
              Sign in
            </a>
          ) : (
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-4 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full shadow-md hover:scale-[1.02] transition transform"
            >
              Sign out
            </button>
          )}
        </nav>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md border text-gray-800"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 border-t border-gray-100">
          <div className="px-6 py-4 flex flex-col gap-3">
            <a href="/" className="block text-gray-900">Home</a>
            <a href="/q&a" className="block text-gray-900">Q&amp;A</a>
            <a href="/events" className="block text-gray-900">Events</a>
            <a href="/dashboard" className="block text-gray-900">Overview</a>
            <a href="/statistics" className="block text-gray-900">Statistics</a>
            <a href="/faq" className="block text-gray-900">FAQ</a>
            <a href="/mentors" className="block text-gray-900">Connect</a>
            {!isLoggedIn ? (
              <a
                href="/login"
                className="block mt-2 font-medium bg-gradient-to-r from-pink-600 to-rose-500 text-white px-4 py-2 rounded-full text-center"
              >
                Sign in
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
                className="block mt-2 font-medium bg-gray-900 text-white px-4 py-2 rounded-full text-center"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
