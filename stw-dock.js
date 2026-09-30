/* Stories To Watch — standalone money dock
   The persistent bottom-right money path (Check availability + Watch Finder),
   for pages that do NOT load stw-enhance.js (homepage, reference price pages, tools).
   Side-effect-free: injects ONLY the dock (no collapsibles). Idempotent — bails if a
   dock already exists (e.g. stw-enhance.js already ran on this page).
   Self-configuring: uses the page's own availability-check / watchfinder links when
   present, else falls back to availability-check.html?from=<page-slug>. */
(function(){
  if(window.__stwDock || document.querySelector('.stw-dock')) return;
  window.__stwDock = true;

  var CSS = ""
  + ".stw-dock{position:fixed;right:22px;bottom:22px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:10px;opacity:0;visibility:hidden;transform:translateY(14px);transition:opacity .4s,transform .4s,visibility .4s;}"
  + ".stw-dock.show{opacity:1;visibility:visible;transform:translateY(0);}"
  + ".stw-dock-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:12px 20px;border-radius:40px;box-shadow:0 8px 24px rgba(0,0,0,0.45);transition:transform .2s,box-shadow .2s;}"
  + ".stw-dock-btn:hover{transform:translateY(-2px);}"
  + ".stw-dock-btn.primary{background:linear-gradient(135deg,#E8D18A,#C9A84C);color:#0b0b0a;box-shadow:0 10px 30px rgba(0,0,0,0.5),0 0 0 1px rgba(201,168,76,0.45);}"
  + ".stw-dock-btn.primary:hover{box-shadow:0 14px 36px rgba(0,0,0,0.6),0 0 0 1px rgba(201,168,76,0.75);}"
  + ".stw-dock-btn.secondary{background:rgba(10,10,8,0.94);color:#E8D18A;border:1px solid rgba(201,168,76,0.5);}"
  + ".stw-dock-btn.secondary:hover{border-color:rgba(201,168,76,0.85);color:#F5F1E8;}"
  + "@media(max-width:640px){.stw-dock{left:12px;right:12px;bottom:12px;flex-direction:row;align-items:stretch;gap:8px;}.stw-dock-btn{flex:1;justify-content:center;padding:13px 8px;border-radius:10px;font-size:10px;letter-spacing:0.06em;}}";
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function grab(sel){ var a = document.querySelector(sel); return a ? a.getAttribute('href') : null; }
  var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/i,'') || 'home';
  if(slug === 'index') slug = 'home';

  // primary = the $45 Availability Check (this is the fastest-converting money action)
  var availHref = grab('a[href*="availability-check.html?from="]') || ('availability-check.html?from=' + slug);
  var wfHref = grab('a[href*="watchfinder.html?search="]') || 'watchfinder.html';

  var dock = document.createElement('div'); dock.className = 'stw-dock';
  var b1 = document.createElement('a'); b1.className = 'stw-dock-btn secondary'; b1.href = wfHref; b1.setAttribute('aria-label','Browse verified dealers in the Watch Finder'); b1.innerHTML = '⌕ Watch Finder';
  var b2 = document.createElement('a'); b2.className = 'stw-dock-btn primary'; b2.href = availHref; b2.setAttribute('aria-label','Check whether a watch is realistically available ($45 read)'); b2.innerHTML = '✦ Check availability';
  dock.appendChild(b1); dock.appendChild(b2);
  document.body.appendChild(dock);

  // reveal after a little scroll; hide when a bottom concierge/CTA band is in view
  var curtain = document.querySelector('.gcurtain');
  function onScroll(){
    var show = window.pageYOffset > 620;
    if(curtain){ var r = curtain.getBoundingClientRect(); if(r.top < window.innerHeight - 40) show = false; }
    dock.classList.toggle('show', show);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();
})();
