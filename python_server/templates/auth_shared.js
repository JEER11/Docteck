// Minimal Firebase auth wiring to mirror existing providers
(function(){
  let cfg = {};
  try {
    const el = document.getElementById('fb-config');
    if (el && el.textContent) cfg = JSON.parse(el.textContent);
  } catch (_) { }
  if (!cfg.apiKey) {
    console.warn('Firebase config missing; auth buttons will be no-op');
    return;
  }
  // Load Firebase SDK dynamically
  const s1 = document.createElement('script');
  s1.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
  const s2 = document.createElement('script');
  s2.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js';
  s1.onload = () => document.head.appendChild(s2);
  document.head.appendChild(s1);

  function init(){
    if (!window.firebase?.apps?.length) return setTimeout(init, 150);
    const app = firebase.initializeApp(cfg);
    const auth = firebase.auth(app);
  // Phone auth reCAPTCHA set up lazily when the panel opens
  let recaptchaVerifier = null;
  let confirmation = null;

    function on(id, cb){ const el=document.getElementById(id); if(el) el.addEventListener('click', cb); }

    on('btn-google', async ()=>{
      try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); location.href='/app'; } catch(e){ alert('Google sign-in failed'); }
    });
    on('btn-facebook', async ()=>{
      try { await auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()); location.href='/app'; } catch(e){ alert('Facebook sign-in failed'); }
    });
    on('btn-yahoo', async ()=>{
      try { await auth.signInWithPopup(new firebase.auth.OAuthProvider('yahoo.com')); location.href='/app'; } catch(e){ alert('Yahoo sign-in failed'); }
    });
    on('btn-microsoft', async ()=>{
      try { await auth.signInWithPopup(new firebase.auth.OAuthProvider('microsoft.com')); location.href='/app'; } catch(e){ alert('Microsoft sign-in failed'); }
    });
    on('btn-phone', ()=>{
      const panel = document.getElementById('phone-panel');
      if (!panel) return;
      panel.hidden = false;
      if (!recaptchaVerifier) {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
        recaptchaVerifier.render().catch(()=>{});
      }
    });
    const closeBtn = document.getElementById('close-phone');
    if (closeBtn) closeBtn.addEventListener('click', ()=>{ const p = document.getElementById('phone-panel'); if (p) p.hidden = true; });
    const sendBtn = document.getElementById('send-code');
    if (sendBtn) sendBtn.addEventListener('click', async ()=>{
      try {
        const phone = document.getElementById('phone').value.trim();
        if (!phone) return alert('Enter phone');
        confirmation = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
        alert('Code sent');
      } catch(e){ alert(e?.message || 'Failed to send code'); }
    });
    const verifyBtn = document.getElementById('verify-code');
    if (verifyBtn) verifyBtn.addEventListener('click', async ()=>{
      try {
        const code = document.getElementById('otp').value.trim();
        if (!confirmation) return alert('Send code first');
        await confirmation.confirm(code);
        location.href='/app';
      } catch(e){ alert(e?.message || 'Verification failed'); }
    });

    const si = document.getElementById('signin-form');
    if (si) si.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      try { await auth.signInWithEmailAndPassword(email, password); location.href='/app'; }
      catch(e){ alert(e?.message || 'Sign in failed'); }
    });

    const su = document.getElementById('signup-form');
    if (su) su.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      try { const res = await auth.createUserWithEmailAndPassword(email, password); await res.user.updateProfile({ displayName: name }); location.href='/app'; }
      catch(e){ alert(e?.message || 'Sign up failed'); }
    });
  }

  init();
})();
