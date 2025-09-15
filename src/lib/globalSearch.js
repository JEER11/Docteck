// Simple global search index for app sections/routes
// Each item: { title, path, keywords: [..] }

const manualSections = [
  { title: 'Dashboard', path: '/app/dashboard', keywords: ['home', 'overview', 'stats'] },
  { title: 'Caring Hub', path: '/app/tables', keywords: ['appointments', 'providers', 'pharmacy', 'prescriptions', 'hub', 'records', 'report'] },
  { title: 'Assistance', path: '/app/assistance', keywords: ['doctor assistant', 'assistant', 'chat', 'advice', 'symptoms'] },
  { title: 'Billing', path: '/app/billing', keywords: ['payment methods', 'payments', 'add card', 'visual card', 'invoices', 'insurance', 'subscription', 'plan'] },
  { title: 'Profile', path: '/app/profile', keywords: ['settings', 'personal info', 'profile settings'] },
  { title: 'Family', path: '/app/profile/family', keywords: ['family', 'members', 'caregivers'] },
  { title: 'Pets', path: '/app/profile/pets', keywords: ['pets', 'vet', 'test results', 'schedule'] },

  // Common content terms visible across pages
  { title: 'Test Results', path: '/app/profile', keywords: ['tests', 'results', 'labs'] },
  { title: 'End of Life Planning', path: '/app/profile', keywords: ['end of life', 'planning', 'will', 'advance directive'] },
  { title: 'Medical and Family History', path: '/app/profile', keywords: ['medical history', 'family history'] },
  { title: 'Preventive Care', path: '/app/profile', keywords: ['preventive', 'screenings', 'vaccines'] },
  { title: 'Messages', path: '/app/profile', keywords: ['messages', 'communication'] },
  { title: 'Ask Questions', path: '/app/assistance', keywords: ['ask', 'questions', 'doctor', 'assistant'] },
  { title: 'Letters', path: '/app/profile', keywords: ['letters', 'documents'] },
  { title: 'Community Resources', path: '/app/profile', keywords: ['community', 'resources', 'help'] },
  { title: 'Report Problems', path: '/app/profile', keywords: ['report', 'problems', 'support'] },
];

// Derive entries from the app routes config (src/routes.js)
let derivedSections = [];
try {
  // Lazy import to avoid circular deps at module init
  const routesMod = require('../routes');
  const routes = routesMod && routesMod.default ? routesMod.default : routesMod;
  if (Array.isArray(routes)) {
    derivedSections = routes
      .filter(r => r && typeof r === 'object' && typeof r.name === 'string' && typeof r.route === 'string' && r.route)
      .map(r => ({
        title: r.name,
        path: `/app${r.route.startsWith('/') ? r.route : '/' + r.route}`,
        keywords: [(r.key || r.name || '').toString().toLowerCase()],
      }));
  }
} catch (_) {
  // best-effort; ignore if not available during certain builds
}

// Additional in-page targets for quick access
const inPageTargets = [
  { title: 'Payment Methods', path: '/app/billing', keywords: ['cards', 'add card', 'visual card', 'delete card', 'edit card'] },
  { title: 'Invoices', path: '/app/billing', keywords: ['invoice', 'charges', 'payments'] },
  { title: 'Appointments', path: '/app/tables', keywords: ['caring hub', 'calendar', 'schedule'] },
  { title: 'Prescriptions', path: '/app/tables', keywords: ['rx', 'pharmacy', 'medications'] },
  { title: 'Providers', path: '/app/tables', keywords: ['doctors', 'care team'] },
  { title: 'Profile Settings', path: '/app/profile', keywords: ['settings', 'account', 'preferences'] },
];

// Merge unique by path+title
const byKey = new Map();
[...manualSections, ...derivedSections, ...inPageTargets].forEach(item => {
  if (!item || !item.title || !item.path) return;
  const key = `${item.path}|${item.title}`;
  if (!byKey.has(key)) byKey.set(key, { ...item, keywords: Array.from(new Set(item.keywords || [])) });
  else {
    const existing = byKey.get(key);
    existing.keywords = Array.from(new Set([...(existing.keywords || []), ...(item.keywords || [])]));
    byKey.set(key, existing);
  }
});

const sections = Array.from(byKey.values());

function norm(s) {
  return (s || '').toString().toLowerCase();
}

export function searchSections(q, limit = 8) {
  const query = norm(q);
  if (!query) return [];
  const scored = [];
  for (const item of sections) {
    const haystack = [item.title, ...(item.keywords || [])].map(norm);
    let score = 0;
    for (const h of haystack) {
      if (h.includes(query)) score += h === query ? 3 : 1;
      // prioritize word starts
      if (h.startsWith(query)) score += 2;
    }
    if (score > 0) scored.push({ ...item, score });
  }
  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

export function getAllSections() {
  return sections.slice();
}
