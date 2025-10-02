// Simple global search index for app sections/routes
// Each item: { title, path, keywords: [...], action?: { type: 'dialog', target: 'record', tab?: number } }

const manualSections = [
  { title: 'Dashboard', path: '/dashboard', keywords: ['home', 'overview', 'stats'] },
  { title: 'Caring Hub', path: '/tables', keywords: ['appointments', 'providers', 'pharmacy', 'prescriptions', 'hub', 'records', 'report'] },
  { title: 'Assistance', path: '/assistance', keywords: ['doctor assistant', 'assistant', 'chat', 'advice', 'symptoms'] },
  { title: 'Billing', path: '/billing', keywords: ['payment methods', 'payments', 'add card', 'visual card', 'invoices', 'insurance', 'subscription', 'plan'] },
  { title: 'Profile', path: '/profile', keywords: ['settings', 'personal info', 'profile settings'] },
  { title: 'Family', path: '/profile/family', keywords: ['family', 'members', 'caregivers'] },
  { title: 'Pets', path: '/profile/pets', keywords: ['pets', 'vet', 'test results', 'schedule'] },

  // Common content terms visible across pages - these should open specific dialogs
  { title: 'Visits', path: '/profile', keywords: ['visits', 'appointments', 'doctor visits'], action: { type: 'dialog', target: 'record', tab: 0 } },
  { title: 'Test Results', path: '/profile', keywords: ['tests', 'results', 'labs'], action: { type: 'dialog', target: 'record', tab: 1 } },
  { title: 'End of Life Planning', path: '/profile', keywords: ['end of life', 'planning', 'will', 'advance directive'], action: { type: 'dialog', target: 'record', tab: 2 } },
  { title: 'Medical and Family History', path: '/profile', keywords: ['medical history', 'family history'], action: { type: 'dialog', target: 'record', tab: 3 } },
  { title: 'Preventive Care', path: '/profile', keywords: ['preventive', 'screenings', 'vaccines'], action: { type: 'dialog', target: 'record', tab: 4 } },
  { title: 'Messages', path: '/profile', keywords: ['messages', 'communication'], action: { type: 'dialog', target: 'communication', tab: 0 } },
  { title: 'Ask Questions', path: '/assistance', keywords: ['ask', 'questions', 'doctor', 'assistant'] },
  { title: 'Letters', path: '/profile', keywords: ['letters', 'documents'], action: { type: 'dialog', target: 'communication', tab: 2 } },
  { title: 'Community Resources', path: '/profile', keywords: ['community', 'resources', 'help'], action: { type: 'dialog', target: 'communication', tab: 3 } },
  { title: 'Report Problems', path: '/profile', keywords: ['report', 'problems', 'support'], action: { type: 'dialog', target: 'communication', tab: 4 } },
];

// Lazy-derived entries from routes provided at runtime via window.__APP_ROUTES__
function deriveFromRoutes(routes) {
  if (!Array.isArray(routes)) return [];
  return routes
    .filter(r => r && typeof r === 'object' && typeof r.name === 'string' && typeof r.route === 'string' && r.route)
    .map(r => ({
      title: r.name,
      path: r.route.startsWith('/') ? r.route : '/' + r.route,
      keywords: [(r.key || r.name || '').toString().toLowerCase()],
    }));
}

// Additional in-page targets for quick access
const inPageTargets = [
  { title: 'Payment Methods', path: '/billing', keywords: ['cards', 'add card', 'visual card', 'delete card', 'edit card'] },
  { title: 'Invoices', path: '/billing', keywords: ['invoice', 'charges', 'payments'] },
  { title: 'Appointments', path: '/tables', keywords: ['caring hub', 'calendar', 'schedule'] },
  { title: 'Prescriptions', path: '/tables', keywords: ['rx', 'pharmacy', 'medications'] },
  { title: 'Providers', path: '/tables', keywords: ['doctors', 'care team'] },
  { title: 'Profile Settings', path: '/profile', keywords: ['settings', 'account', 'preferences'] },
];

let sectionsCache = null;
function ensureIndexed() {
  if (sectionsCache) return sectionsCache;
  const derived = (typeof window !== 'undefined' && window.__APP_ROUTES__) ? deriveFromRoutes(window.__APP_ROUTES__) : [];
  const byKey = new Map();
  [...manualSections, ...derived, ...inPageTargets].forEach(item => {
    if (!item || !item.title || !item.path) return;
    const key = `${item.path}|${item.title}`;
    if (!byKey.has(key)) byKey.set(key, { ...item, keywords: Array.from(new Set(item.keywords || [])) });
    else {
      const existing = byKey.get(key);
      existing.keywords = Array.from(new Set([...(existing.keywords || []), ...(item.keywords || [])]));
      byKey.set(key, existing);
    }
  });
  sectionsCache = Array.from(byKey.values());
  return sectionsCache;
}

function norm(s) {
  return (s || '').toString().toLowerCase();
}

export function searchSections(q, limit = 8) {
  const query = norm(q);
  if (!query) return [];
  const sections = ensureIndexed();
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
  return ensureIndexed().slice();
}
