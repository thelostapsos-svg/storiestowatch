/* Stories To Watch — Partner slot (house ad -> media kit).
   Standalone, idempotent, no side effects. Injects a rotating luxury-category
   "Partner with us" band just before the footer. Text sits on the dark side of
   each frame, never over the hero. Skips the media-kit page itself. */
(function(){
  if(window.__stwPartner || document.querySelector('.stw-partner')) return;
  if(/mediakit/i.test(location.pathname)) return;
  var foot = document.querySelector('footer');
  if(!foot || !foot.parentNode) return;
  window.__stwPartner = true;

  var CSS = ""
   + ".stw-partner{position:relative;display:block;max-width:1040px;margin:20px auto 8px;overflow:hidden;border:1px solid rgba(201,168,76,0.18);text-decoration:none;background:#0A0A08;}"
   + ".stw-partner img{display:block;}"
   + ".stw-partner-scrim{position:absolute;inset:0;pointer-events:none;}"
   + ".stw-partner .pl-eyebrow{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#C9A84C;margin-bottom:13px;display:block;}"
   + ".stw-partner .pl-head{font-family:'Cormorant Garamond',serif;font-size:clamp(19px,2.4vw,28px);line-height:1.16;color:#F5F1E8;margin-bottom:15px;display:block;}"
   + ".stw-partner .pl-cta{font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#E8C96A;display:block;}"
   + ".stw-partner:hover .pl-cta{color:#F5F1E8;}"
   + ".stw-partner .pl-tag{position:absolute;top:13px;right:13px;font-family:'Montserrat',sans-serif;font-size:8px;letter-spacing:0.26em;text-transform:uppercase;color:rgba(201,168,76,0.55);border:1px solid rgba(201,168,76,0.22);padding:4px 8px;background:rgba(5,5,5,0.35);}"
   + "@media(min-width:641px){.stw-partner{aspect-ratio:16/9;}.stw-partner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;}.stw-partner-scrim{background:linear-gradient(90deg,rgba(5,5,5,0.95),rgba(5,5,5,0.8) 25%,rgba(5,5,5,0.34) 46%,rgba(5,5,5,0) 62%);}.stw-partner-txt{position:absolute;left:0;top:0;bottom:0;width:54%;display:flex;flex-direction:column;justify-content:center;padding:0 5%;}}"
   + "@media(max-width:640px){.stw-partner img{width:100%;height:auto;}.stw-partner-scrim{display:none;}.stw-partner-txt{display:block;background:#0d0d0c;padding:20px 20px 22px;}}";
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var PIMGS = [
    {s:'partner-cars.webp',a:'A collector arriving at a grand estate beside a luxury car at night'},
    {s:'partner-yacht.webp',a:'A figure at the rail of a superyacht at dusk over open sea'},
    {s:'partner-aviation.webp',a:'A private jet on a dark tarmac at night, cabin light glowing'},
    {s:'partner-realestate.webp',a:'A glass penthouse terrace and infinity pool above a city skyline at night'},
    {s:'partner-jewellery.webp',a:'Fine diamond jewellery catching the light against black velvet'},
    {s:'partner-spirits.webp',a:'A crystal glass of aged whisky on a dark bar in a private club'}
  ];
  var pk = PIMGS[Math.floor(Math.random()*PIMGS.length)];
  var pb = document.createElement('a');
  pb.className = 'stw-partner'; pb.href = 'mediakit.html';
  pb.setAttribute('aria-label','Advertise on Stories To Watch — view the media kit');
  pb.innerHTML = '<img src="'+pk.s+'" alt="'+pk.a+'" loading="lazy" width="1600" height="900">'
    + '<span class="stw-partner-scrim"></span>'
    + '<span class="stw-partner-txt"><span class="pl-eyebrow">Partner with Stories To Watch</span>'
    + '<span class="pl-head">Your brand, in front of collectors at the moment they buy.</span>'
    + '<span class="pl-cta">View the media kit →</span></span>'
    + '<span class="pl-tag">Partner Space</span>';
  foot.parentNode.insertBefore(pb, foot);
})();
