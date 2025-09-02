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
        if (shouldReload(ev)) {
          if (!sessionStorage.getItem('spa-chunk-reload')) {
            sessionStorage.setItem('spa-chunk-reload','1');
            location.reload();
            return;
          }
          sessionStorage.removeItem('spa-chunk-reload');
        }
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
