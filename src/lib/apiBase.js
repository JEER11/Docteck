// Determine the API base URL across environments
// Priority:
// 1) REACT_APP_API_URL if provided
// 2) If running on localhost and not on backend port, use http://localhost:3001
// 3) Same-origin (empty string)
export function getApiBase() {
  const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '3001') return 'http://localhost:3001';
  }
  return '';
}

export default getApiBase;
