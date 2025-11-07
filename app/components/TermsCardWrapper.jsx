"use client";
import { useState } from "react";
import TermsCard from "./TermsCard";

export default function TermsCardWrapper() {
  const questions = [
    "Are you a middle or high school girl looking to build confidence and leadership skills?",
    "Are you interested in preparing for college or exploring scholarships?",
    "Are you in elementary or middle school?",
    "Do you want to learn how to start your own business before age 18?",
    "Are you interested in science, technology, engineering, or math (STEM)?",
    "Do you enjoy solving real-world problems with creative tech solutions?",
    "Would you like to connect with students from countries such as Ghana, Liberia, or Guyana?",
    "Are you interested in cultural exchange and virtual collaboration with peers around the world?",
  ];

  const [index, setIndex] = useState(0);

  // Programs mapping (keep names consistent with your site)
  const programs = [
    "NIA Empowerment Academy",
    "UJIMA Business Program",
    "Kumbathon",
    "NIA Global Academy",
  ];

  // Descriptions and image filenames for each program (images stored in public/)
  const programMeta = [
    {
      key: "nia",
      title: "NIA Empowerment Academy",
      image: "/nia_empowerment.png",
      description:
        "The NIA Empowerment Academy is a transformative six-week program offered during the Fall, Spring, and Summer. Designed to help girls build confidence and develop essential life skills, this academy focuses on career development, college preparation, career exposure, scholarships, AI development, and more. Students participate in interactive workshops, connect with inspiring mentors, and gain the tools they need to succeed in school and beyond.",
    },
    {
      key: "ujima",
      title: "UJIMA Business Program",
      image: "/ujima.png",
      description:
        "The UJIMA Business Program is a semester-long entrepreneurship experience for elementary and middle school students. Participants have the unique opportunity to create their own innovative businesses before the age of 18, preparing them to become the business leaders of tomorrow. Throughout the program, students develop business plans, pitch their ideas, and compete for exciting prizes in our annual pitch competition.",
    },
    {
      key: "kumbathon",
      title: "Kumbathon",
      image: "/kumbathon.png",
      description:
        "KUMBATHON is our annual hackathon, powered by a partnership with Girls Who Code and their innovative curriculum. Every March, students choose a STEM theme for the event, working together to solve real-world problems and develop tech solutions. KUMBATHON inspires girls to explore science, technology, engineering, and math in a collaborative and supportive environment.",
    },
    {
      key: "nia-global",
      title: "NIA Global Academy",
      image: "/nia_global.png",
      description:
        "NIA Global Academy connects International Girls Academy students with peers around the world, including Ghana, Liberia, Guyana, and beyond. Through virtual exchanges, collaborative projects, and cultural immersion experiences, girls expand their horizons and develop lifelong friendships with fellow students across the globe.",
    },
  ];

  // Score array aligned with `programs`
  const [programMatch, setProgramMatch] = useState(new Array(programs.length).fill(0));
  const [matchedPrograms, setMatchedPrograms] = useState(null); // null -> still running, array -> finished

  function handleAnswer(answer) {
    console.log("Answered:", questions[index], answer ? "Yes" : "No");

    // determine program index for this question
    // current convention: pairwise mapping (questions 0-1 -> program 0, 2-3 -> program 1, 4-5 -> program 2, 6-7 -> program 3)
    const pIdx = Math.floor(index / 2);

    // update scores immutably
    if (answer) {
      setProgramMatch((prev) => {
        const next = [...prev];
        next[pIdx] = (next[pIdx] || 0) + 1;
        return next;
      });
    }

    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      setIndex(nextIndex);
      return;
    }

    // finished: compute winners (handle ties)
    // Use a local copy of scores and apply the last answer synchronously to avoid waiting for state
    const finalScores = [...programMatch];
    if (answer) {
      finalScores[pIdx] = (finalScores[pIdx] || 0) + 1;
    }

    const max = Math.max(...finalScores);
  // If max is 0 then treat it like "all selected" — return all programs (same behavior for all-No or all-Yes)
  const winners = max > 0 ? programs.filter((_, i) => finalScores[i] === max) : programs.slice();

    setMatchedPrograms(winners);
    setIndex(-1);
  }

  // when index === -1 we've finished the flow — show matched program(s)
  if (index === -1) {
    if (matchedPrograms === null) {
      return <div className="text-center">Calculating matches&hellip;</div>;
    }

    // Render matched programs with images and descriptions (use programMeta to look up)
    const matchedMeta = matchedPrograms.map((name) => programMeta.find((m) => m.title === name)).filter(Boolean);

    return (
      <div className="p-4">
        <p className="text-center font-semibold">Here are the program(s) we recommend for you:</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {matchedMeta.map((m) => (
            <div key={m.key} className="flex flex-col bg-white rounded shadow p-4">
              {/* Use object-contain and a max height so images scale to fit instead of being cropped */}
              <img
                src={m.image}
                alt={m.title}
                className="w-full h-auto max-h-64 object-contain rounded bg-gray-50 p-2"
              />
              <h3 className="mt-3 text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{m.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            className="mt-6 px-4 py-2 bg-[#ffeded] text-black rounded"
            onClick={() => {
              // reset all state to start over
              setProgramMatch(new Array(programs.length).fill(0));
              setMatchedPrograms(null);
              setIndex(0);
            }}
          >
            Take Questionnaire Again
          </button>
        </div>
      </div>
    );
  }

  return <TermsCard key={index} question={questions[index]} onAnswer={handleAnswer} />;
}