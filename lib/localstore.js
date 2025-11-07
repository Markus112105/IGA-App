const KEY = "iga_mentorship";

export function getStore() {
  if (typeof window === "undefined") return { requests: [], questions: [], answers: [] };
  try { return JSON.parse(localStorage.getItem(KEY)) ?? { requests: [], questions: [], answers: [] }; }
  catch { return { requests: [], questions: [], answers: [] }; }
}

export function saveStore(store) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(store));
}

export function addRequest(req) {
  const store = getStore();
  store.requests.push({ id: crypto.randomUUID(), created_at: Date.now(), status:"pending", ...req });
  saveStore(store);
  return store;
}

export function getRequests() { return getStore().requests ?? []; }

// Optional Q&A
export function addQuestion(q) {
  const store = getStore();
  store.questions.push({ id: crypto.randomUUID(), created_at: Date.now(), ...q });
  saveStore(store);
}
export function getQuestions() { return getStore().questions ?? []; }
export function addAnswer(ans) {
  const store = getStore();
  store.answers.push({ id: crypto.randomUUID(), created_at: Date.now(), ...ans });
  saveStore(store);
}
export function getAnswers() { return getStore().answers ?? []; }