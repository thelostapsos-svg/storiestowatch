/* Stories To Watch — "The Essentials" affiliate module (Amazon, tag storiestowatc-20).
   Standalone, idempotent. Injects a disclosed, non-conflicting accessory picks block
   just before the closing related/CTA sections (outside the collapsible body, so it
   is always visible). Load ONLY on buying guides, comparisons and the Watch Finder —
   never celebrity/gossip pieces where accessory picks would feel off. */
(function(){
  if(window.__stwEssentials || document.querySelector('.es-mod')) return;
  var anchor = document.querySelector('.related-section, .nextmove, .gcurtain, .curtain') || document.querySelector('footer');
  if(!anchor || !anchor.parentNode) return;
  window.__stwEssentials = true;

  var CSS = ""
   + ".es-mod{max-width:920px;margin:0 auto;padding:38px 30px;border-top:1px solid rgba(201,168,76,0.1);border-bottom:1px solid rgba(201,168,76,0.1);background:#0b0b0a;}"
   + ".es-mod .es-k{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#8B6914;margin:0 0 8px;}"
   + ".es-mod .es-lead{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:#E8C96A;margin:0 0 22px;line-height:1.4;}"
   + ".es-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}"
   + ".es-card{display:block;background:#111110;border:1px solid rgba(201,168,76,0.14);padding:20px 18px;text-decoration:none;transition:border-color .25s,transform .25s;}"
   + ".es-card:hover{border-color:rgba(201,168,76,0.5);transform:translateY(-2px);}"
   + ".es-card .es-cat{display:block;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:#8B6914;margin-bottom:8px;}"
   + ".es-card .es-name{display:block;font-family:'Cormorant Garamond',serif;font-size:19px;color:#F5F1E8;line-height:1.2;margin-bottom:6px;}"
   + ".es-card .es-note{display:block;font-family:'Cormorant Garamond',serif;font-size:14px;color:#B8B4A6;line-height:1.5;}"
   + ".es-card .es-note em{color:#C9A84C;font-style:normal;white-space:nowrap;}"
   + ".es-mod .es-disc{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.02em;color:#8a8578;margin:18px 0 0;line-height:1.6;}"
   + "@media(max-width:760px){.es-grid3{grid-template-columns:1fr;}.es-mod{padding:30px 20px;}}";
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var T = 'storiestowatc-20';
  var mod = document.createElement('aside');
  mod.className = 'es-mod';
  mod.innerHTML =
      '<p class="es-k">The Essentials</p>'
    + '<p class="es-lead">A great watch deserves care. Three things we’d actually own —</p>'
    + '<div class="es-grid3">'
    +   '<a class="es-card" href="https://www.amazon.com/dp/B00VQIZI70?tag='+T+'" target="_blank" rel="sponsored nofollow noopener">'
    +     '<span class="es-cat">Keep it running</span><span class="es-name">WOLF Cub single winder</span>'
    +     '<span class="es-note">The patented-cuff winder collectors actually trust. <em>View on Amazon →</em></span></a>'
    +   '<a class="es-card" href="https://www.amazon.com/dp/B0B2838G83?tag='+T+'" target="_blank" rel="sponsored nofollow noopener">'
    +     '<span class="es-cat">Travel with it</span><span class="es-name">Genuine-leather watch roll</span>'
    +     '<span class="es-note">Protects the case and bracelet on the move. <em>View on Amazon →</em></span></a>'
    +   '<a class="es-card" href="https://www.amazon.com/dp/1579657141?tag='+T+'" target="_blank" rel="sponsored nofollow noopener">'
    +     '<span class="es-cat">Read it</span><span class="es-name">“A Man &amp; His Watch”</span>'
    +     '<span class="es-note">76 iconic watches and the stories behind them. <em>View on Amazon →</em></span></a>'
    + '</div>'
    + '<p class="es-disc">Affiliate note: these are Amazon links. If you buy through them, Stories To Watch may earn a small commission at no extra cost to you — we only list things we’d own ourselves.</p>';
  anchor.parentNode.insertBefore(mod, anchor);
})();
