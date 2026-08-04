/* Stories To Watch — page enhancement
   1. Persistent dock (money path): Watch Finder + concierge, always in reach.
   2. Collapsible sections + "jump to" menu on long guides.
   Self-configuring: reads the page's own concierge/watchfinder links.
   Safe on any layout — collapsibles only activate on known structures; the dock always loads. */
(function(){
  // Idempotent: bail if this page was already enhanced (flag OR dock already in DOM).
  if(window.__stwEnhanced || document.querySelector('.stw-dock')) return;
  window.__stwEnhanced = true;

  var CSS = ""
  + ".stw-dock{position:fixed;right:22px;bottom:22px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:10px;opacity:0;visibility:hidden;transform:translateY(14px);transition:opacity .4s,transform .4s,visibility .4s;}"
  + ".stw-dock.show{opacity:1;visibility:visible;transform:translateY(0);}"
  + ".stw-dock-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:12px 20px;border-radius:40px;box-shadow:0 8px 24px rgba(0,0,0,0.45);transition:transform .2s,box-shadow .2s;}"
  + ".stw-dock-btn:hover{transform:translateY(-2px);}"
  + ".stw-dock-btn.primary{background:linear-gradient(135deg,#E8D18A,#C9A84C);color:#0b0b0a;box-shadow:0 10px 30px rgba(0,0,0,0.5),0 0 0 1px rgba(201,168,76,0.45);}"
  + ".stw-dock-btn.primary:hover{box-shadow:0 14px 36px rgba(0,0,0,0.6),0 0 0 1px rgba(201,168,76,0.75);}"
  + ".stw-dock-btn.secondary{background:rgba(10,10,8,0.94);color:#E8D18A;border:1px solid rgba(201,168,76,0.5);}"
  + ".stw-dock-btn.secondary:hover{border-color:rgba(201,168,76,0.85);color:#F5F1E8;}"
  + "@media(max-width:640px){.stw-dock{left:12px;right:12px;bottom:12px;flex-direction:row;align-items:stretch;gap:8px;}.stw-dock-btn{flex:1;justify-content:center;padding:13px 8px;border-radius:10px;font-size:10px;letter-spacing:0.06em;}}"
  + ".stw-jump{margin:8px 0 40px;padding:22px 24px;background:#0d0d0c;border:1px solid rgba(201,168,76,0.2);}"
  + ".stw-jump .stw-jump-k{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:#8B6914;margin:0 0 15px;}"
  + ".stw-jump .stw-jump-list{display:flex;flex-wrap:wrap;gap:9px;}"
  + ".stw-jump a.stw-jump-item{display:inline-block;padding:9px 15px;background:#141412;border:1px solid rgba(201,168,76,0.28);color:#E8D18A;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.03em;text-decoration:none;cursor:pointer;transition:background .2s,border-color .2s,color .2s;}"
  + ".stw-jump a.stw-jump-item:hover{background:rgba(201,168,76,0.14);border-color:rgba(201,168,76,0.65);color:#F5F1E8;}"
  + "h2.stw-sec-head{display:flex;align-items:center;justify-content:space-between;gap:18px;cursor:pointer;scroll-margin-top:92px;border-bottom:1px solid rgba(201,168,76,0.14);padding-bottom:12px;transition:color .2s;}"
  + "h2.stw-sec-head:hover{color:#E8D18A;}"
  + "h2.stw-sec-head:focus-visible{outline:2px solid rgba(201,168,76,0.6);outline-offset:6px;}"
  + ".stw-chev{flex:0 0 auto;width:23px;height:23px;border:1px solid rgba(201,168,76,0.4);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#C9A84C;font-size:11px;line-height:1;transition:transform .35s,background .25s;}"
  + "h2.stw-sec-head.open .stw-chev{transform:rotate(180deg);background:rgba(201,168,76,0.12);}"
  + ".stw-sec-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .38s ease;}"
  + ".stw-sec-body.open{grid-template-rows:1fr;}"
  + ".stw-sec-inner{overflow:hidden;}"
  + ".stw-sec-collapse{display:inline-flex;align-items:center;gap:7px;margin:10px 0 30px;padding:8px 15px;background:none;border:1px solid rgba(201,168,76,0.22);color:#8B6914;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s;}"
  + ".stw-sec-collapse:hover{border-color:rgba(201,168,76,0.55);color:#C9A84C;}";

  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ---- self-configure links from the page's own CTAs ----
  function grab(sel){ var a = document.querySelector(sel); return a ? a.getAttribute('href') : null; }
  var srcHref = grab('a[href*="source-a-watch.html?from="]');
  if(!srcHref){
    var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/i,'') || 'page';
    srcHref = 'source-a-watch.html?from=' + slug;
  }
  var wfHref = grab('a[href*="watchfinder.html?search="]') || 'watchfinder.html';

  // ---- dock (always) ----
  var dock = document.createElement('div'); dock.className = 'stw-dock';
  var b1 = document.createElement('a'); b1.className = 'stw-dock-btn secondary'; b1.href = wfHref; b1.setAttribute('aria-label','Browse verified dealers in the Watch Finder'); b1.innerHTML = '⌕ Watch Finder';
  var b2 = document.createElement('a'); b2.className = 'stw-dock-btn primary'; b2.href = srcHref; b2.setAttribute('aria-label','Have our concierge source this watch'); b2.innerHTML = '✦ Source this watch';
  dock.appendChild(b1); dock.appendChild(b2);
  document.body.appendChild(dock);

  // ---- collapsible sections ----
  var sections = [];
  function activate(head, body, idx){
    var inner = document.createElement('div'); inner.className = 'stw-sec-inner';
    while(body.firstChild) inner.appendChild(body.firstChild);
    body.appendChild(inner);
    body.classList.add('stw-sec-body');
    if(!head.id) head.id = 'stw-sec-' + idx;
    var label = head.textContent.replace(/[▾↑]/g, '').trim();
    head.classList.add('stw-sec-head'); head.setAttribute('tabindex','0'); head.setAttribute('role','button');
    var chev = document.createElement('span'); chev.className = 'stw-chev'; chev.setAttribute('aria-hidden','true'); chev.innerHTML = '▾';
    head.appendChild(chev);
    var cbtn = document.createElement('button'); cbtn.type = 'button'; cbtn.className = 'stw-sec-collapse'; cbtn.innerHTML = 'Collapse section ↑';
    inner.appendChild(cbtn);
    var sec = { id: head.id, label: label, head: head, body: body };
    sec.open = function(){ head.classList.add('open'); head.setAttribute('aria-expanded','true'); body.classList.add('open'); };
    sec.close = function(){ head.classList.remove('open'); head.setAttribute('aria-expanded','false'); body.classList.remove('open'); };
    sec.toggle = function(){ head.classList.contains('open') ? sec.close() : sec.open(); };
    head.addEventListener('click', function(){ sec.toggle(); });
    head.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); sec.toggle(); } });
    cbtn.addEventListener('click', function(e){ e.stopPropagation(); sec.close(); head.scrollIntoView({behavior:'smooth',block:'start'}); });
    sections.push(sec);
    return sec;
  }

  var insertParent = null, insertRef = null;
  // Type A: a content container whose sections are direct-child <h2>s with loose content between them.
  var mainA = null, headsA = [];
  var candidates = document.querySelectorAll('.article-main, .article-body, article');
  for(var ci = 0; ci < candidates.length; ci++){
    var hh = Array.prototype.filter.call(candidates[ci].children, function(el){ return el.tagName === 'H2'; });
    if(hh.length){ mainA = candidates[ci]; headsA = hh; break; }
  }
  if(mainA && headsA.length){
    headsA.forEach(function(h, i){
      var body = document.createElement('div');
      var n = h.nextSibling;
      while(n && !(n.nodeType === 1 && n.tagName === 'H2')){ var nx = n.nextSibling; body.appendChild(n); n = nx; }
      h.parentNode.insertBefore(body, h.nextSibling);
      var sec = activate(h, body, i);
      if(i === 0) sec.open(); else sec.close();
    });
    insertParent = mainA; insertRef = headsA[0];
  } else {
    var titles = document.querySelectorAll('h2.section-title');
    if(titles.length){
      Array.prototype.forEach.call(titles, function(h, i){
        var body = h.nextElementSibling;
        if(!body || !/(^|\s)section-body(\s|$)/.test(body.className)) return;
        var sec = activate(h, body, i);
        if(sections.length === 1) sec.open(); else sec.close();
      });
      if(sections.length){
        var firstBlock = sections[0].head.closest('.article-section') || sections[0].head;
        insertParent = firstBlock.parentNode; insertRef = firstBlock;
      }
    }
  }
  // Type C: explicit opt-in — a container marked [data-stw-collapse] whose direct .sec children each hold an <h2> + content.
  if(!sections.length){
    var optIn = document.querySelector('[data-stw-collapse]');
    if(optIn){
      var blocks = optIn.querySelectorAll(':scope > .sec');
      Array.prototype.forEach.call(blocks, function(secEl){
        var h = secEl.querySelector('h2');
        if(!h) return;
        var body = document.createElement('div');
        var n = h.nextSibling;
        while(n){ var nx = n.nextSibling; body.appendChild(n); n = nx; }
        secEl.appendChild(body);
        var sec = activate(h, body, sections.length);
        if(sections.length === 1) sec.open(); else sec.close();
      });
      if(sections.length){ insertParent = optIn; insertRef = blocks[0]; }
    }
  }

  // ---- jump menu ----
  if(sections.length > 1 && insertParent && insertRef){
    var jump = document.createElement('div'); jump.className = 'stw-jump';
    var k = document.createElement('div'); k.className = 'stw-jump-k'; k.textContent = 'In this guide — tap to jump'; jump.appendChild(k);
    var list = document.createElement('div'); list.className = 'stw-jump-list';
    sections.forEach(function(sec){ var a = document.createElement('a'); a.className = 'stw-jump-item'; a.href = '#' + sec.id; a.textContent = sec.label; list.appendChild(a); });
    jump.appendChild(list);
    insertParent.insertBefore(jump, insertRef);
  }

  // ---- in-page anchors expand their target ----
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null; if(!a) return;
    var id = a.getAttribute('href').slice(1); if(!id) return;
    var sec = null; for(var j = 0; j < sections.length; j++){ if(sections[j].id === id){ sec = sections[j]; break; } }
    if(!sec) return;
    e.preventDefault(); sec.open(); sec.head.scrollIntoView({behavior:'smooth',block:'start'});
    if(history.replaceState) history.replaceState(null, '', '#' + id);
  });
  if(location.hash){ for(var j = 0; j < sections.length; j++){ if('#' + sections[j].id === location.hash){ (function(s){ s.open(); setTimeout(function(){ s.head.scrollIntoView({block:'start'}); }, 80); })(sections[j]); break; } } }

  // ---- dock visibility (hide when the bottom concierge is in view) ----
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
