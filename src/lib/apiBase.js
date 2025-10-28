// Determine the API base URL across environments
// Priority:
// 1) REACT_APP_API_URL if provided at build time
// 2) window.__API_BASE__ if provided at runtime (via public/config.js or an inline script)
// 3) If running on localhost and not on backend port, use http://localhost:3001
// 4) If deployed on Vercel (vercel.app) and no explicit config, fall back to the default Render backend for this app
// 5) Same-origin (empty string)
export function getApiBase() {
  // 1) Build-time env
  const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
  if (envUrl) return envUrl;

  // 2) Runtime override without rebuild
  if (typeof window !== 'undefined' && window.__API_BASE__ && typeof window.__API_BASE__ === 'string') {
    const u = window.__API_BASE__.trim();
    if (u) return u;
  }

  // 3) Local development helpers
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '3001') {
      // Use matching host to avoid cross-origin oddities between localhost and 127.0.0.1
      const host = hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
      return `http://${host}:3001`;
    }

    // 4) Production fallback for Vercel static front-end calling Render backend
    const hn = (hostname || '').toLowerCase();
    if (hn.endsWith('vercel.app')) {
      // NOTE: This URL is public and matches render.yaml (service name: Docteck-Backend)
      return 'https://docteck-backend.onrender.com';
    }
  }

  // 5) Same-origin
  return '';
}

export default getApiBase;
