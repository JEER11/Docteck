(function(){
  // Bridge the SPA UI to Flask APIs with minimal intrusion
  let API_BASE = '';
  try { const cfg = document.getElementById('flask-config'); if (cfg) API_BASE = (JSON.parse(cfg.textContent||'{}').apiBase)||''; } catch(_){}

  // Example: wire the assistant input if present on Dashboard
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    // Global guards to avoid silent blank screens after minor deploys
    (function guardAgainstChunkErrors(){
      // If a dynamic chunk fails to load (common after new build), reload once
      function shouldReload(err){
        try {
          const msg = (err && (err.message||err.reason && err.reason.message)) || '';
          return /ChunkLoadError|Loading chunk|import\(\) failed|Failed to fetch dynamically imported module/i.test(String(msg));
        } catch(_) { return false; }
      }
      function onError(ev){
        if (!shouldReload(ev)) return;
        try { console.warn('[Bridge] Detected dynamic import/chunk error', ev && (ev.message || ev.reason)); } catch(_) {}
        const lastTs = Number(sessionStorage.getItem('spa-last-reload-ts')||'0');
        const now = Date.now();
        const elapsed = now - lastTs;
        if (!sessionStorage.getItem('spa-chunk-reload') || elapsed > 15000) {
          // Mark attempt + timestamp
            sessionStorage.setItem('spa-chunk-reload','1');
            sessionStorage.setItem('spa-last-reload-ts', String(now));
            try { console.log('[Bridge] Reloading once to recover missing chunk'); } catch(_) {}
            location.reload();
            return;
        }
        // Already reloaded recently; surface a visible banner instead of looping.
        sessionStorage.removeItem('spa-chunk-reload');
        (function showBanner(){
          try {
            var el = document.getElementById('reload-loop-banner');
            if (!el) {
              el = document.createElement('div');
              el.id = 'reload-loop-banner';
              el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#7f1d1d;color:#fee2e2;font:13px system-ui;padding:10px 14px;box-shadow:0 2px 6px rgba(0,0,0,.3)';
              el.textContent = 'A new version failed to load a script chunk. Hard refresh (Ctrl+Shift+R) or clear cache to continue.';
              document.body && document.body.appendChild(el);
            }
          } catch(_){}
        })();
      }
      window.addEventListener('error', onError, true);
      window.addEventListener('unhandledrejection', onError);

      // Minimal visible banner for fatal errors to aid debugging instead of black screen
      function showBanner(text){
        try {
          var el = document.createElement('div');
          el.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;background:#7f1d1d;color:#fee2e2;font:13px system-ui;padding:10px 14px;box-shadow:0 2px 6px rgba(0,0,0,.3)';
          el.textContent = text;
          document.body && document.body.appendChild(el);
        } catch(_){}
      }
      window.addEventListener('error', function(e){
        // Only surface if it bubbles to window (likely unhandled)
        if (e && e.error && e.error.stack) {
          showBanner('A script error occurred. Check the console for details.');
        }
      });
    })();

    // Early watchdog: if the main React bundle never executes (blank screen with only index shell), attempt one cache-busting reload then show diagnostics overlay.
    (function reactBootWatchdog(){
      try {
        // Record script load failures (resource errors) for later diagnostics
        window.addEventListener('error', function(e){
          if (e && e.target && e.target.tagName === 'SCRIPT' && e.target.src) {
            try {
              (window.__FAILED_SCRIPTS__ = window.__FAILED_SCRIPTS__ || []).push(e.target.src);
            } catch(_) {}
          }
        }, true);

        function showBootOverlay(msg){
          if (document.getElementById('boot-failure-overlay')) return;
          var div = document.createElement('div');
          div.id = 'boot-failure-overlay';
          var failed = (window.__FAILED_SCRIPTS__||[]).map(function(u){ return ' - ' + u; }).join('\n');
          var info = 'Path: ' + location.pathname + '\nHas __APP_READY__: ' + (window.__APP_READY__?'yes':'no') + '\nFailed scripts:\n' + (failed||'(none captured)');
          div.innerHTML = '<div style="max-width:820px;margin:0 auto;padding:32px 34px;font:14px system-ui,Segoe UI,Roboto,sans-serif;">'
            + '<h2 style="margin:0 0 10px;font:600 24px system-ui;letter-spacing:.5px;">App did not initialize</h2>'
            + '<p style="margin:0 0 14px;opacity:.85;line-height:1.5;">'+ msg +' The main application script appears not to have run. This can happen right after a deployment when the cached index.html references outdated hashed filenames. A hard refresh (Ctrl+Shift+R) usually fixes it. Below are diagnostics you can share.</p>'
            + '<pre style="background:#1e223f;padding:14px 16px;border:1px solid #303861;border-radius:8px;max-height:260px;overflow:auto;font-size:12px;line-height:1.45;color:#e2e8f0;white-space:pre-wrap;">'+ info +'</pre>'
            + '<div style="margin-top:14px;display:flex;gap:12px;flex-wrap:wrap;">'
            + '  <button id="boot-overlay-retry" style="background:#2563eb;color:#fff;border:0;padding:9px 18px;font-weight:600;border-radius:6px;cursor:pointer;">Retry Now</button>'
            + '  <button id="boot-overlay-clear" style="background:#475569;color:#fff;border:0;padding:9px 18px;font-weight:600;border-radius:6px;cursor:pointer;">Clear Cache Hint</button>'
            + '</div>'
            + '</div>';
          Object.assign(div.style, { position:'fixed', inset:0, background:'radial-gradient(circle at 50% 20%, #1a1d34 0%, #0d0f1e 90%)', color:'#f1f5f9', zIndex:999998, overflowY:'auto' });
          document.body.appendChild(div);
          var retry = document.getElementById('boot-overlay-retry');
            retry && retry.addEventListener('click', function(){ try { sessionStorage.removeItem('spa-main-recover'); } catch(_){}; location.reload(); });
          var clear = document.getElementById('boot-overlay-clear');
            clear && clear.addEventListener('click', function(){ try { localStorage.clear(); sessionStorage.clear(); } catch(_){}; location.reload(); });
        }

        // If after 2500ms the app isn't ready and root is empty, attempt recovery.
        setTimeout(function(){
          try {
            if (window.__APP_READY__) return; // React started
            var rootEl = document.getElementById('root');
            var hasContent = rootEl && rootEl.childNodes && rootEl.childNodes.length > 0;
            if (hasContent) return; // Something rendered (maybe loading overlay) – let React watchdog handle it
            // No content: likely main bundle failed to load.
            var tried = sessionStorage.getItem('spa-main-recover');
            if (!tried) {
              sessionStorage.setItem('spa-main-recover','1');
              // Append a cache-busting query once
              var url = location.pathname + location.search + location.hash;
              if (!/v=/.test(location.search)) {
                var sep = location.search ? '&' : '?';
                location.replace(location.pathname + location.search + sep + 'v=' + Date.now() + location.hash);
              } else {
                location.reload();
              }
              return;
            }
            // Already retried: show overlay
            showBootOverlay('Automatic recovery attempt did not succeed.');
          } catch(err) {
            try { console.error('[Bridge] Boot watchdog failure', err); } catch(_){}
          }
        }, 2500);
      } catch(_){}
    })();

    // Ensure the sidebar brand uses the desired icon
    (function ensureBrandIcon(){
      var tries = 0; var maxTries = 40; // ~4s
      var timer = setInterval(function(){
        tries++;
        var img = document.querySelector('img[alt="Sidebar Logo"]');
        if (img) {
          var base = (location && location.pathname && location.pathname.indexOf('/app') === 0) ? '/app' : '';
          var desired = base + '/apple-icon.png';
          if (img.src.indexOf('apple-icon.png') === -1) img.src = desired;
          clearInterval(timer);
        }
        if (tries >= maxTries) clearInterval(timer);
      }, 100);
    })();

    // Assistant send button or input in SPA (selectors are heuristic and safe to ignore if not found)
    const input = document.querySelector('input[placeholder="Describe your symptoms..."]') || document.querySelector('input[placeholder*="symptoms"]');
    const sendBtn = document.querySelector('button, [role="button"]');
    if (input && sendBtn) {
      const callAssistant = async (message)=>{
        try {
          const res = await fetch((API_BASE||'') + '/api/assistant-smart', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message })});
          const data = await res.json();
          return data.reply || '...';
        } catch(e){ return 'Error: ' + (e.message||'unknown'); }
      };
      const output = document.createElement('div');
      output.style.cssText='margin-top:8px;color:#cbd5e1;font-size:12px;';
      input.parentElement && input.parentElement.appendChild(output);
      function submit(){ const msg=(input.value||'').trim(); if(!msg) return; output.textContent='…'; callAssistant(msg).then(t=>output.textContent=t); }
      input.addEventListener('keydown', e=>{ if(e.key==='Enter') submit(); });
      sendBtn.addEventListener('click', submit);
    }

    // Example: wire simple GET for appointments count if a badge is present
    const kpis = document.querySelectorAll('[data-kpi]');
    if (kpis.length) {
      fetch((API_BASE||'') + '/api/appointments').then(r=>r.json()).then(d=>{
        const count = (d.appointments||[]).length;
        kpis.forEach(el=>{ if(el.dataset.kpi==='appointments') el.textContent = (count||0) + ' appt'; });
      }).catch(()=>{});
    }
  });
})();
