const now = Date.now();
const day = 864e5;
const iso = (d) => new Date(d).toISOString();

export const DEMO_USER = {
  id: 1,
  name: 'Demo Candidate',
  email: 'demo@interviewiq.com',
  role: 'STUDENT',
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Intermediate',
};

export const QUESTIONS = [
  { id: 1, questionText: 'Explain the difference between let and const in JavaScript.', category: 'Technical', difficulty: 'Easy', expectedKeywords: 'scope, reassignment, block, hoisting, temporal dead zone' },
  { id: 2, questionText: 'How would you design a URL shortener that handles millions of links?', category: 'System Design', difficulty: 'Medium', expectedKeywords: 'hashing, base62, database, cache, redirect, collision' },
  { id: 3, questionText: 'What is the difference between authentication and authorization?', category: 'Technical', difficulty: 'Easy', expectedKeywords: 'identity, permission, jwt, role, access control' },
  { id: 4, questionText: 'Describe a time you disagreed with a teammate. How did you handle it?', category: 'Behavioral', difficulty: 'Medium', expectedKeywords: 'situation, task, action, result, conflict, communication' },
  { id: 5, questionText: 'How do you optimise a slow React component?', category: 'Frontend', difficulty: 'Hard', expectedKeywords: 'memo, usememo, virtualisation, rerender, profiling, lazy' },
  { id: 6, questionText: 'Explain ACID properties in database transactions.', category: 'Technical', difficulty: 'Medium', expectedKeywords: 'atomicity, consistency, isolation, durability, transaction' },
  { id: 7, questionText: 'What is normalisation and when would you denormalise?', category: 'Database', difficulty: 'Medium', expectedKeywords: 'normalisation, redundancy, 1nf, 3nf, join, read performance' },
  { id: 8, questionText: 'How would you approach learning a new codebase in your first week?', category: 'HR', difficulty: 'Easy', expectedKeywords: 'readme, structure, run, tests, ask, commit history' },
];

const makeAnswers = (ids, ivId) => ids.map((id, i) => {
  const q = QUESTIONS.find((x) => x.id === id);
  const jitter = [4, -6, 2, -3, 6][i % 5];
  const score = Math.max(38, Math.min(96, (ivId === 5 ? 88 : 88 - ivId * 4) + jitter));
  return {
    id: i + 1,
    interviewId: ivId,
    questionId: id,
    questionText: q.questionText,
    answerText: 'A structured answer covering definition, how it works, a real example and the trade-offs.',
    score,
    technicalScore: Math.max(30, score - 2),
    relevanceScore: Math.min(99, score + 3),
    completenessScore: Math.max(28, score - 6),
    clarityScore: Math.min(99, score + 1),
    feedback: score >= 80
      ? 'Strong answer with a concrete example. Add one trade-off to reach full marks.'
      : 'Reasonable structure, but the example is thin. Quantify the impact and mention a trade-off.',
    strengths: 'Clear structure, correct core concept',
    weaknesses: 'Needs a real-world example and a trade-off',
    difficultyAtTime: q.difficulty,
    createdAt: iso(now - day),
  };
});

const mkInterview = (id, role, score, daysAgo, count) => ({
  id,
  userId: 1,
  jobRole: role,
  experienceLevel: 'Intermediate',
  difficulty: 'Adaptive AI',
  interviewType: 'Mixed',
  totalQuestions: count,
  overallScore: score,
  technicalScore: score - 2,
  communicationScore: score - 5,
  problemSolvingScore: score - 1,
  confidenceScore: Math.min(98, score + 3),
  durationSeconds: 600,
  status: 'COMPLETED',
  createdAt: iso(now - daysAgo * day),
});

const SPEC = [
  { id: 5, role: 'Full Stack Developer', score: 88, ago: 2 },
  { id: 4, role: 'Java Developer', score: 84, ago: 6 },
  { id: 3, role: 'Full Stack Developer', score: 79, ago: 13 },
  { id: 2, role: 'Backend Developer', score: 72, ago: 21 },
  { id: 1, role: 'Full Stack Developer', score: 64, ago: 34 },
];

export const DEMO_INTERVIEWS = SPEC.map((s) => mkInterview(s.id, s.role, s.score, s.ago, 5));

const SKILLS = [
  ['Java', 82], ['Spring Boot', 64], ['React', 76], ['SQL', 80],
  ['REST APIs', 88], ['System Design', 51], ['Communication', 84],
].map(([skill, score], i) => ({ skill, score, target: 90, id: i + 1 }));

const avg = Math.round(DEMO_INTERVIEWS.reduce((a, i) => a + i.overallScore, 0) / DEMO_INTERVIEWS.length);
export const DEMO_DASHBOARD = {
  readiness: avg,
  avg,
  total: DEMO_INTERVIEWS.length,
  streak: Math.min(DEMO_INTERVIEWS.length, 7),
  completed: DEMO_INTERVIEWS.length,
  trend: DEMO_INTERVIEWS.slice().reverse().map((i) => ({ date: i.createdAt.slice(0, 10), score: i.overallScore })),
  skills: SKILLS,
  recent: DEMO_INTERVIEWS.slice(-5).reverse(),
  achievements: [
    { id: 1, achievementName: 'First Interview', description: 'Completed first mock', earnedAt: iso(now - 34 * day) },
    { id: 2, achievementName: '80% Club', description: 'Scored 80%+', earnedAt: iso(now - 2 * day) },
  ],
};

export const DEMO_GAPS = {
  gaps: SKILLS.map((s) => ({ skill: s.skill, score: s.score })),
  topGap: 'System Design',
};

export const DEMO_ROADMAP = [
  'Master Full Stack Developer fundamentals',
  'Build 2 portfolio projects',
  'Practice system design and APIs',
  'STAR behavioral prep',
  'Full advanced mock',
].map((t, i) => ({
  id: i + 1,
  userId: 1,
  title: `Step ${i + 1}: ${t}`,
  description: t,
  priority: i + 1,
  progress: i < 2 ? 100 : i === 2 ? 45 : 0,
  status: 'PENDING',
}));

export const DEMO_RESUMES = [{
  id: 1,
  userId: 1,
  fileName: 'demo-resume.txt',
  extractedText: 'Java Spring Boot React SQL REST.',
  resumeScore: 78,
  uploadedAt: iso(now - 5 * day),
}];

export const DEMO_PERFORMANCE = {
  history: DEMO_INTERVIEWS.slice().reverse().map((i) => ({
    id: i.id, date: i.createdAt.slice(0, 10), score: i.overallScore,
    tech: i.technicalScore, comm: i.communicationScore, role: i.jobRole,
  })),
};

export const DEMO_ADMIN = {
  users: 1284,
  interviews: 4327,
  avg,
  recent: DEMO_INTERVIEWS.slice(0, 5),
};

export { makeAnswers, SKILLS, avg as DEMO_AVG };

/* ------------------------------------------------------------ local AI scoring */
/** Mirrors the scoring rules in backend/ai.js so offline answers feel real. */
const FILLER = new Set(['um', 'uh', 'like', 'basically', 'actually', 'very', 'really', 'just', 'so']);
export function evaluateOffline(answer, question) {
  const a = (answer || '').trim();
  const low = a.toLowerCase();
  const kws = (question?.expectedKeywords || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const cov = kws.length ? kws.filter((k) => low.includes(k)).length / kws.length : 0.6;
  const words = a ? a.split(/\s+/).length : 0;
  const len = words < 10 ? 0.3 : words < 30 ? 0.6 : words < 80 ? 0.85 : 0.95;
  const filler = low.split(/\W+/).filter((w) => FILLER.has(w)).length;
  const ex = /example|for instance|e\.g|use case|at work|in my/.test(low);
  const cl = (v) => Math.max(0.15, Math.min(1, v));
  const pc = (v) => Math.round(cl(v) * 1000) / 10;
  const technical = pc(0.35 + cov * 0.55 + (ex ? 0.05 : 0) + (words > 25 ? 0.05 : 0));
  const relevance = pc(0.4 + cov * 0.5 + (words > 15 ? 0.08 : 0));
  const completeness = pc(len);
  const clarity = pc(0.92 - filler * 0.06 + (a.includes('.') ? 0.03 : -0.05));
  const score = Math.round(technical * 0.4 + relevance * 0.25 + completeness * 0.2 + clarity * 0.15);
  return {
    technical, relevance, completeness, clarity, score,
    feedback: score >= 80
      ? 'Strong answer with a concrete example. Add one trade-off to reach full marks.'
      : cov < 0.4
        ? 'Structure is fine but key concepts are missing. Cover the core terms explicitly.'
        : 'Reasonable structure, but the example is thin. Quantify the impact and mention a trade-off.',
    strengths: 'Clear structure, correct core concept',
    weaknesses: 'Needs a real-world example and a trade-off',
  };
}

const LEVELS = ['Easy', 'Medium', 'Hard'];

/** Moves the difficulty one step with the candidate, clamped to the range. */
export function nextDifficulty(current, score) {
  const i = Math.max(0, LEVELS.indexOf(current));
  if (score >= 80) return LEVELS[Math.min(LEVELS.length - 1, i + 1)];
  if (score < 50) return LEVELS[Math.max(0, i - 1)];
  return LEVELS[i];
}

export function adaptiveReason(score) {
  if (score >= 85) return 'Excellent answer — increasing the difficulty to keep you challenged.';
  if (score >= 70) return 'Good answer — raising the difficulty slightly.';
  if (score >= 50) return 'Solid but incomplete — keeping the difficulty steady.';
  return 'This one is hard — easing off so you can build confidence.';
}
/* --------------------------------------------------------- request router */
/**
 * Answers requests from local state when the real API is unreachable, so a
 * static (GitHub Pages) deployment stays fully usable.
 */

const store = {
  active: false,
  interviews: DEMO_INTERVIEWS.map((i) => ({ ...i })),
  resumes: DEMO_RESUMES.map((r) => ({ ...r })),
  skills: SKILLS.map((s) => ({ ...s })),
  roadmap: DEMO_ROADMAP.map((r) => ({ ...r })),
  nextId: 99,
};

const listeners = new Set();
export const onDemoChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const isDemoMode = () => store.active;

function setActive(v) {
  if (store.active === v) return;
  store.active = v;
  listeners.forEach((fn) => fn(v));
}

const ok = (data) => Promise.resolve({ data, status: 200, headers: {}, config: {} });
const TOKEN = 'demo_access_token';
const firstFive = () => QUESTIONS.slice(0, 5).map((q) => q.id);

function safeParse(d) {
  if (typeof d !== 'string') return d || {};
  try { return JSON.parse(d); } catch { return {}; }
}

function mean(list, k) {
  return list.length ? Math.round(list.reduce((s, a) => s + a[k], 0) / list.length) : 0;
}

export function route(method, url, body) {
  const u = String(url).replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const m = String(method).toUpperCase();

  if (m === 'POST' && (u === '/api/auth/login' || u === '/api/auth/register')) {
    return ok({ token: TOKEN, user: { ...DEMO_USER, ...(body || {}) } });
  }
  if (m === 'POST' && u === '/api/auth/logout') return ok({ message: 'Logged out' });
  if (m === 'GET' && u === '/api/users/me') return ok({ ...DEMO_USER });

  if (m === 'GET' && u === '/api/analytics/dashboard') {
    const ivs = store.interviews;
    const a = ivs.length ? mean(ivs, 'overallScore') : 0;
    return ok({
      ...DEMO_DASHBOARD, readiness: a, avg: a, total: ivs.length,
      completed: ivs.length, streak: Math.min(ivs.length, 7),
      trend: ivs.slice().reverse().map((i) => ({ date: i.createdAt.slice(0, 10), score: i.overallScore })),
      skills: store.skills.map((s) => ({ skill: s.skill, score: s.score, target: s.target })),
      recent: ivs.slice(-5).reverse(),
    });
  }

  if (m === 'GET' && u === '/api/analytics/performance') {
    return ok({
      history: store.interviews.slice().reverse().map((i) => ({
        id: i.id, date: i.createdAt.slice(0, 10), score: i.overallScore,
        tech: i.technicalScore, comm: i.communicationScore, role: i.jobRole,
      })),
    });
  }

  if (u === '/api/interviews' && m === 'GET') return ok(store.interviews.slice().reverse());

  if (u === '/api/interviews' && m === 'POST') {
    const total = (body && body.totalQuestions) || 5;
    const iv = {
      ...DEMO_INTERVIEWS[0],
      id: store.nextId++,
      jobRole: (body && body.jobRole) || 'Full Stack Developer',
      difficulty: (body && body.difficulty) || 'Adaptive AI',
      interviewType: (body && body.interviewType) || 'Mixed',
      experienceLevel: (body && body.experienceLevel) || 'Intermediate',
      totalQuestions: total,
      overallScore: 0, technicalScore: 0, communicationScore: 0,
      problemSolvingScore: 0, confidenceScore: 0, durationSeconds: 0,
      status: 'IN_PROGRESS', createdAt: new Date().toISOString(),
    };
    store.interviews.push(iv);
    return ok({ interview: iv, questions: QUESTIONS.slice(0, total) });
  }
const mm = u.match(/^\/api\/interviews\/(\d+)(?:\/(\w+))?$/);
  if (mm) {
    const iv = store.interviews.find((x) => String(x.id) === mm[1]) || store.interviews[0];
    if (mm[2] === 'answers' && m === 'POST') {
      const q = QUESTIONS.find((x) => x.id === (body && body.questionId)) || QUESTIONS[0];
      const r = evaluateOffline(body && body.answerText, q);
      const nd = nextDifficulty(q.difficulty, r.score);
      const pool = QUESTIONS.filter((x) => x.difficulty === nd);
      const pick = pool.length ? pool : QUESTIONS;
      const nq = pick[Math.floor(Math.random() * pick.length)];
      iv._answers = iv._answers || [];
      iv._answers.push({
        id: iv._answers.length + 1, interviewId: iv.id, questionId: q.id, questionText: q.questionText,
        answerText: (body && body.answerText) || '', score: r.score, technicalScore: r.technical,
        relevanceScore: r.relevance, completenessScore: r.completeness, clarityScore: r.clarity,
        feedback: r.feedback, strengths: r.strengths, weaknesses: r.weaknesses,
        difficultyAtTime: q.difficulty, createdAt: new Date().toISOString(),
      });
      return ok({ evaluation: r, nextDifficulty: nd, adaptiveReason: adaptiveReason(r.score), nextQuestion: nq });
    }
    if (mm[2] === 'complete' && m === 'POST') {
      const list = iv._answers || makeAnswers(firstFive(), iv.id);
      iv._answers = list;
      const score = mean(list, 'score');
      Object.assign(iv, {
        overallScore: score, technicalScore: mean(list, 'technicalScore'),
        communicationScore: mean(list, 'clarityScore'), problemSolvingScore: mean(list, 'relevanceScore'),
        confidenceScore: Math.min(100, score + 3), durationSeconds: 620, status: 'COMPLETED',
      });
      store.skills = store.skills.map((s) => ({
        ...s, score: Math.max(20, Math.min(98, score + (s.skill === 'System Design' ? -14 : 6))),
      }));
      return ok({
        interview: iv, answers: list,
        report: {
          status: score >= 80 ? 'READY' : score >= 60 ? 'NEEDS_IMPROVEMENT' : 'NOT_READY',
          strengths: ['Strong technical fundamentals', 'Clear, structured explanations'],
          weaknesses: ['Use STAR-structured answers', 'Practise System Design in depth'],
          recommendation: 'Focus on your top skill gap, then retake an adaptive mock.',
        },
      });
    }
    if (!mm[2] && m === 'GET') {
      return ok({ interview: iv, answers: iv._answers || makeAnswers(firstFive(), iv.id) });
    }
  }

  if (u === '/api/skills/gaps') {
    return ok({ gaps: store.skills.map((s) => ({ skill: s.skill, score: s.score })), topGap: 'System Design' });
  }
  if (u === '/api/roadmap') return ok(store.roadmap);
  if (u === '/api/resume' && m === 'GET') return ok(store.resumes);
  if (u === '/api/resume/upload' && m === 'POST') {
    const txt = String((body && body.text) || '');
    const keys = ['java', 'spring', 'react', 'sql', 'rest', 'python', 'javascript', 'node', 'mysql', 'aws', 'docker'];
    const hit = keys.filter((k) => txt.toLowerCase().includes(k)).length;
    const score = Math.min(95, 45 + hit * 6 + (txt.length > 300 ? 10 : 0));
    const r = { id: store.nextId++, userId: 1, fileName: (body && body.fileName) || 'resume.txt', extractedText: txt, resumeScore: score, uploadedAt: new Date().toISOString() };
    store.resumes.unshift(r);
    return ok({
      resume: r,
      insights: [
        hit >= 4 ? 'Good technology diversity' : 'Add more technical skills',
        txt.length > 200 ? 'Good project detail' : 'Add measurable project outcomes',
        score >= 70 ? 'Resume strength is solid' : 'Improve skill categorization',
      ],
    });
  }
if (u === '/api/copilot/chat' && m === 'POST') {
    const msg = String((body && body.message) || '').toLowerCase();
    const gaps = store.skills.slice().sort((a, b) => a.score - b.score);
    const a = store.interviews.length ? mean(store.interviews, 'overallScore') : 0;
    const top3 = gaps.slice(0, 3).map((g) => `${g.skill} (${g.score}%)`).join(', ');
    if (/improve|weak|gap/.test(msg)) return ok({ reply: `Across ${store.interviews.length} mock interviews (avg ${a}%), your weakest areas are ${top3}. Top gap: ${gaps[0].skill}. Do 5 questions a day there, always add a real example, then retake an Adaptive mock.` });
    if (/ready|hire|job/.test(msg)) return ok({ reply: a >= 80 ? `You look READY at ${a}%. Attempt advanced and system-design rounds next.` : a >= 60 ? `Almost there at ${a}%. Close the ${gaps[0].skill} gap first, then retake.` : `Not yet at ${a}%. Work through the 7-day plan in your Roadmap first.` });
    if (/plan|study|7.day|week/.test(msg)) return ok({ reply: '7-day plan — Day 1 Java fundamentals, Day 2 Spring Boot, Day 3 SQL, Day 4 REST APIs, Day 5 System Design, Day 6 Behavioural (STAR), Day 7 full adaptive mock. Track it under Career Roadmap.' });
    if (/score|percent|why/.test(msg)) return ok({ reply: `Your score blends technical accuracy (40%), relevance (25%), completeness (20%) and clarity (15%). Your latest average is ${a}%. Add concrete examples and cover missing keywords to gain 8-12%.` });
    if (/question/.test(msg)) return ok({ reply: 'Try these: 1) let vs const. 2) Design a URL shortener. 3) ACID properties. 4) Optimising a slow React component. 5) Normalisation vs denormalisation.' });
    return ok({ reply: `You have ${store.interviews.length} interviews at ${a}% average. Your top gap is ${gaps[0].skill} at ${gaps[0].score}%. Ask me what to improve, for a 7-day plan, or whether you are interview ready.` });
  }

  if (u === '/api/admin/analytics') {
    return ok({ ...DEMO_ADMIN, avg: DEMO_DASHBOARD.avg, recent: store.interviews.slice(-5).reverse() });
  }

  return Promise.reject(Object.assign(new Error(`demo-mode: no route for ${m} ${u}`), { __demoMiss: true }));
}

/** Called from the axios interceptor when a request cannot reach the API. */
export function serveOffline(config) {
  setActive(true);
  return route(config.method, config.url || '', safeParse(config.data))
    .then((r) => ({ ...r, config }))
    .catch((e) => Promise.reject(e));
}

export function resetDemo() {
  store.interviews = DEMO_INTERVIEWS.map((i) => ({ ...i }));
  store.resumes = DEMO_RESUMES.map((r) => ({ ...r }));
  store.skills = SKILLS.map((s) => ({ ...s }));
}