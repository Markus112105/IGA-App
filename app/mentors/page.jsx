import MentorDirectory from "../components/mentors/MentorDirectory";

export default async function MentorsPage() {
  let initialMentors = [];
  try {
    const mod = await import('../../data/mentors');
    initialMentors = mod.mentors || [];
  } catch (e) {
    console.error('Could not load mentors data', e);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Mentors & Alumni</h1>
      <p className="text-gray-600 mb-6">Browse verified mentors and alumni. Request a short session or ask a public question.</p>
      <MentorDirectory initialMentors={initialMentors} />
    </div>
  );
}