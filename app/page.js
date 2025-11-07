import Image from "next/image";
import TermsCardWrapper from "./components/TermsCardWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 antialiased">
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Mission statement to explain goals */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">“Uniting, Uplifting, & Empowering Girls Worldwide”</h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">Through the <span className="font-semibold">International Girls Academy</span>, join mentorship programs, hands-on training modules, and leadership tracks designed for young women ready to make an impact.</p>

          <div className="mt-8 flex items-center justify-center gap-4"></div>


          {/* Statistics row */}
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ["1k+", "Students served"],
              ["100+", "Volunteers"],
              ["$50k", "Scholarships"],
              ["5k+", "Thank‑you cards"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                <dt className="text-2xl font-bold tracking-tight">{k}</dt>
                <dd className="mt-1 text-sm text-slate-600">{v}</dd>
              </div>
            ))}
          </dl>
        </section>


        {/* Introductional video */}
        <section className="mb-12 flex justify-center">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-2xl ring-1 ring-slate-900/5">
            <div className="relative aspect-[16/9]">
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/H4s3ibKGONM?modestbranding=1&rel=0"
                title="International Girls Academy — Welcome video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Mission statement/why you should join */}
        <section id="mission" className="mb-12">
          <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Our Mission
            </h2>
            <p className="mt-3 text-slate-700 leading-relaxed max-w-3xl">
              At the <span className="font-semibold">International Girls Academy</span>, we believe every girl
              can be a global change agent. Guided by the <span className="font-semibold">Nguzo Saba</span>—
              Unity, Self-Determination, Collective Work & Responsibility, Cooperative Economics, Purpose,
              Creativity, and Faith—we build a positive, open-minded community where girls connect their spark
              to education and help close the gender gap for good.
            </p>

            {/* Principles/cards */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Unity", "Self-Determination", "Collective Work & Responsibility",
                "Cooperative Economics", "Purpose", "Creativity", "Faith",
              ].map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Skills and why you should join */}
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Why Join IGA?</h3>
                <p className="mt-2 text-slate-700">
                  We empower girls to break down barriers and solve real problems using their own strengths—
                  regardless of background. Through leadership in gender equality, wellness, and cultural
                  awareness, every girl gets a fair shot at success.
                </p>

                <blockquote className="mt-4 border-l-4 border-pink-500 pl-4 italic text-slate-800">
                  “When girls connect their spark with education, they transform communities, and help end the
                  gender gap once and for all.”
                </blockquote>

                <div className="mt-6">
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-2.5 text-white shadow-md transition hover:scale-[1.02]"
                  >
                    Join Us
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">What Skills Will You Learn?</h3>
                <ul className="mt-3 space-y-3 text-slate-700">
                  <li>
                    <span className="font-medium text-gray-900">Advocacy:</span> Organize, influence, and align decision-makers to create change.
                  </li>
                  <li>
                    <span className="font-medium text-gray-900">Storytelling:</span> Break barriers, build connection, and inspire action with your voice.
                  </li>
                  <li>
                    <span className="font-medium text-gray-900">Fundraising:</span> Mobilize supporters to back the issues that matter most to you.
                  </li>
                  <li>
                    <span className="font-medium text-gray-900">Organizing:</span> Start a movement—wherever you are—and make a difference.
                  </li>
                </ul>

                <p className="mt-4 text-slate-700">
                  Will you join us in empowering more girls to become global change agents and citizens?
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Programs */}
        <section id="programs" className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Our Programs</h2>
          <p className="mt-2 text-slate-600 max-w-3xl">
            We offer mentorship, entrepreneurship modules, and leadership training designed for girls of all ages.
          </p>


          {/* Program cards, with information from website */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
                { title: "NIA Empowerment Academy", img: "/iimages/prog-1.png", description: "The NIA Empowerment Academy is a transformative six-week program offered during the Fall, Spring, and Summer." },
                { title: "Ujima Business Program", img: "/iimages/prog-2.png", description: "The UJIMA Business Program is a semester-long entrepreneurship experience for elementary and middle school students." },
                { title: "Kumbathon", img: "/iimages/prog-3.png", description: "KUMBATHON is our annual hackathon. KUMBATHON inspires girls to explore science, technology, engineering, and math in a collaborative and supportive environment." },
                { title: "NIA Global Academy", img: "/iimages/prog-4.png", description: "NIA Global Academy connects International Girls Academy students with peers around the world, including Ghana, Liberia, Guyana, & beyond." },
            ].map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform transform hover:-translate-y-2 hover:scale-105"
                aria-hidden="false"
              >
                <div className="relative aspect-[4/3] p-3 bg-white">
                  {/* Object-contain makes the whole image visible and letterboxed */}
                  <Image src={p.img} alt={p.title} fill className="object-contain transition-transform duration-300 transform scale-95 group-hover:scale-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Questionnaire */}
        <section id="questionaire" className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Questionnaire</h2>
          <p className="mt-2 text-slate-600">Answer some questions below and we can match you to one of our 4 programs!</p>
          <div className="mt-6 flex w-full justify-center">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <TermsCardWrapper />
            </div>
          </div>
        </section>
      </main>


      {/* CTA at bottom */}
      <div className="py-12 flex justify-center">
        <a href="/signup" className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition text-lg md:text-xl">Get Started</a>
      </div>

      <footer className="border-t border-slate-200/70 bg-white/60 py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} International Girls Academy — All rights reserved
      </footer>
    </div>
  );
}
