import React, { useEffect } from "react";
// Initialize i18n (side-effect import)
import "./i18n";
import { createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import AppErrorBoundary from "components/AppErrorBoundary";

// Docteck Dashboard React Context Provider
import { VisionUIControllerProvider } from "context";
import AppProviders from "context/AppProviders";

// Docteck Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Docteck Dashboard React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";

// Docteck Dashboard React theme functions
import colors from "assets/theme/base/colors";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Mount watchdog: if React doesn't mark ready within a few seconds, show an overlay so we don't sit on a black screen silently.
(function initMountWatchdog(){
  try {
    window.__APP_BOOT_STEPS__ = [];
    function log(step){ try { window.__APP_BOOT_STEPS__.push({ t: Date.now(), step }); } catch(_){} }
    log('index:script-start');
    // After 4s if app not ready, display a diagnostic overlay.
    setTimeout(() => {
      if (window.__APP_READY__) return; // App signalled readiness
      const existing = document.getElementById('app-mount-timeout');
      if (existing) return;
      const div = document.createElement('div');
      div.id = 'app-mount-timeout';
      div.innerHTML = '<div style="font:14px system-ui,Segoe UI,Roboto,sans-serif;max-width:780px;margin:0 auto;padding:24px 28px;">\n  <h2 style="margin:0 0 6px;font:600 22px system-ui;letter-spacing:.4px;">Loading is taking longer than expected</h2>\n  <p style="margin:4px 0 12px;opacity:.85;line-height:1.4">The app JavaScript hasn\'t finished initializing. This can happen right after a new deploy or if a script chunk failed to load. Try a hard refresh (Ctrl+Shift+R). If it persists, copy the diagnostics below.</p>\n  <pre style="background:#1e223f;padding:12px 14px;border-radius:6px;border:1px solid #303861;max-height:220px;overflow:auto;font-size:11px;line-height:1.45;color:#dbe4ff;">' + JSON.stringify(window.__APP_BOOT_STEPS__, null, 2) + '</pre>\n  <button id="retry-app-btn" style="margin-top:10px;background:#2563eb;color:#fff;border:0;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer">Retry</button>\n</div>';
      Object.assign(div.style, { position:'fixed', inset:0, background:'radial-gradient(circle at 50% 20%, #1a1d34 0%, #0d0f1e 90%)', color:'#f1f5f9', zIndex: 999999, overflowY:'auto' });
      document.body.appendChild(div);
    document.getElementById('retry-app-btn')?.addEventListener('click', () => { try { sessionStorage.removeItem('spa-chunk-reload'); } catch(_) {}; window.location.reload(); });
    }, 4000);
    // Global error capture before React paints
    window.addEventListener('error', (e) => {
      try { window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'window.error', message: String(e.message||'') }); } catch(_){}
    });
    window.addEventListener('unhandledrejection', (e) => {
      try { window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'promise.rejection', message: String(e.reason && (e.reason.message||e.reason) || '') }); } catch(_){}
    });
  } catch(_) {}
})();

// Patch console.error to record first critical errors (non-intrusive)
try {
  const origErr = console.error;
  console.error = function patchedConsoleError(){
    try {
      if (arguments && arguments[0] && typeof arguments[0] === 'string' && /chunk|loading/i.test(arguments[0])) {
        window.__APP_BOOT_STEPS__ && window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'console.error', message: String(arguments[0]) });
      }
    } catch(_) {}
    return origErr.apply(this, arguments);
  }
} catch(_) {}

// Mark when we begin rendering
try { window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'index:before-render' }); } catch(_){}


try {
  root.render(
    <AppErrorBoundary>
      <BrowserRouter basename="/app">
        <VisionUIControllerProvider>
          <AppProviders>
            <App />
          </AppProviders>
        </VisionUIControllerProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
  try { window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'index:after-render-call' }); } catch(_){}
} catch (e) {
  // Synchronous render crash (rare) – present a fatal overlay manually
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;inset:0;background:#121426;color:#f1f5f9;font:14px system-ui;padding:32px;z-index:999999;overflow:auto';
    div.innerHTML = '<h2 style="margin-top:0;font:600 24px system-ui">Startup Error</h2>'+
      '<p style="opacity:.85;line-height:1.4">React failed to mount. A hard refresh might fix it. If not, share the stack trace below.</p>'+
      '<pre style="background:#1e223f;padding:14px 16px;border-radius:8px;border:1px solid #303861;font-size:11px;line-height:1.5;white-space:pre-wrap;">'+(e && (e.stack||e.message||String(e)))+'</pre>';
    document.body.appendChild(div);
  } catch(_) {}
}

// Export a helper for App to mark readiness
export function markAppReady(){ try { window.__APP_READY__ = true; window.__APP_BOOT_STEPS__ && window.__APP_BOOT_STEPS__.push({ t: Date.now(), step: 'app:ready' }); } catch(_){} }


