// Simple localStorage-backed queue so assistant actions triggered on one page
// can be applied when the target UI mounts elsewhere, without changing UI.
const KEY = (name) => `assistant_queue_${name}`;

export function enqueue(name, payload) {
  try {
    const key = KEY(name);
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(payload);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent(`assistant:${name}`, { detail: payload }));
  } catch (_) {}
}

export function drain(name, handler) {
  try {
    const key = KEY(name);
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return;
    list.forEach((p) => {
      try { handler(p); } catch (_) {}
    });
    localStorage.removeItem(key);
  } catch (_) {}
}

export default { enqueue, drain };
