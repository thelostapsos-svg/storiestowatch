/* Stories To Watch — "The Dispatch" newsletter signup (MailerLite-backed)
   Injects a dark-luxe, on-brand subscribe band just above the page <footer>.
   Self-contained: own styles + a fetch() POST to MailerLite (double opt-in handles
   confirmation). Side-effect-free & idempotent — bails if a band already exists.
   To add to a page: <script src="stw-dispatch.js" defer></script> before </body>. */
(function(){
  if(window.__stwDispatch || document.querySelector('.stw-dispatch')) return;
  window.__stwDispatch = true;

  var ENDPOINT = 'https://assets.mailerlite.com/jsonp/2672708/forms/200035765171783406/subscribe';

  var CSS = ""
  + ".stw-dispatch{background:radial-gradient(ellipse 70% 130% at 50% 0%,rgba(201,168,76,0.06),transparent 70%),#0A0A08;border-top:1px solid rgba(201,168,76,0.14);padding:58px 22px;text-align:center;}"
  + ".stw-dispatch .sd-in{max-width:600px;margin:0 auto;}"
  + ".stw-dispatch .sd-k{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:#C9A84C;margin:0 0 14px;}"
  + ".stw-dispatch .sd-h{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(24px,3.4vw,33px);line-height:1.18;color:#F5F1E8;margin:0 0 12px;}"
  + ".stw-dispatch .sd-h em{font-style:italic;color:#E8C96A;}"
  + ".stw-dispatch .sd-sub{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(15px,2vw,17px);line-height:1.55;color:#B8B4A6;margin:0 auto 26px;max-width:490px;}"
  + ".stw-dispatch .sd-form{display:flex;gap:10px;max-width:450px;margin:0 auto;flex-wrap:wrap;justify-content:center;}"
  + ".stw-dispatch .sd-input{flex:1 1 220px;background:#111110;border:1px solid rgba(201,168,76,0.3);color:#F5F1E8;font-family:'Montserrat',sans-serif;font-size:14px;padding:13px 16px;border-radius:2px;outline:none;transition:border-color .25s;}"
  + ".stw-dispatch .sd-input:focus{border-color:#C9A84C;}"
  + ".stw-dispatch .sd-input::placeholder{color:#8a857a;}"
  + ".stw-dispatch .sd-hp{position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;}"
  + ".stw-dispatch .sd-btn{flex:0 0 auto;font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#0b0b0a;background:linear-gradient(135deg,#E8C96A,#C9A84C);border:none;padding:13px 30px;border-radius:2px;cursor:pointer;transition:transform .2s;}"
  + ".stw-dispatch .sd-btn:hover{transform:translateY(-2px);}"
  + ".stw-dispatch .sd-btn:disabled{opacity:0.6;cursor:default;transform:none;}"
  + ".stw-dispatch .sd-msg{font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;line-height:1.5;margin:20px auto 0;max-width:470px;}"
  + ".stw-dispatch .sd-msg.sd-ok{color:#E8C96A;}"
  + ".stw-dispatch .sd-msg.sd-err{color:#e0a0a0;}"
  + ".stw-dispatch .sd-fine{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.06em;color:#6f6a5e;margin:16px 0 0;}"
  + "@media(max-width:480px){.stw-dispatch{padding:46px 18px;}.stw-dispatch .sd-form{flex-direction:column;}.stw-dispatch .sd-input{flex:0 0 auto;width:100%;}.stw-dispatch .sd-btn{width:100%;}}";
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var sec = document.createElement('section');
  sec.className = 'stw-dispatch';
  sec.setAttribute('aria-label','Subscribe to The Dispatch newsletter');
  sec.innerHTML = ''
    + '<div class="sd-in">'
    + '  <p class="sd-k">The Dispatch</p>'
    + '  <h2 class="sd-h">Watch news worth your <em>inbox</em>.</h2>'
    + '  <p class="sd-sub">One email a month &mdash; the best stories, the auctions worth watching, and the references on the move. No noise, no spam.</p>'
    + '  <form class="sd-form" novalidate>'
    + '    <input type="email" class="sd-input" name="email" placeholder="Your email" autocomplete="email" aria-label="Your email address" required>'
    + '    <input type="text" class="sd-hp" name="url" tabindex="-1" autocomplete="off" aria-hidden="true">'
    + '    <button type="submit" class="sd-btn">Subscribe</button>'
    + '  </form>'
    + '  <p class="sd-msg" role="status" aria-live="polite"></p>'
    + '  <p class="sd-fine">Free &middot; unsubscribe anytime &middot; we never share your email.</p>'
    + '</div>';

  var footer = document.querySelector('footer');
  if(footer && footer.parentNode){ footer.parentNode.insertBefore(sec, footer); }
  else { document.body.appendChild(sec); }

  var form = sec.querySelector('.sd-form');
  var input = sec.querySelector('.sd-input');
  var hp = sec.querySelector('.sd-hp');
  var btn = sec.querySelector('.sd-btn');
  var msg = sec.querySelector('.sd-msg');

  function done(){
    form.style.display = 'none';
    msg.textContent = 'Almost there — check your inbox and confirm your subscription to The Dispatch.';
    msg.className = 'sd-msg sd-ok';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    msg.className = 'sd-msg';
    msg.textContent = '';
    var email = (input.value || '').trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'sd-msg sd-err';
      input.focus();
      return;
    }
    if(hp.value){ done(); return; } // honeypot tripped — treat as done, don't submit
    btn.disabled = true; btn.textContent = 'Joining…';
    var body = new URLSearchParams();
    body.append('fields[email]', email);
    body.append('ml-submit', '1');
    body.append('anticsrf', 'true');
    fetch(ENDPOINT, { method:'POST', mode:'no-cors', body: body })
      .then(done)
      .catch(function(){
        // network-level failure (rare) — let them try again
        btn.disabled = false; btn.textContent = 'Subscribe';
        msg.textContent = 'Something went wrong. Please try again, or email hello@storiestowatch.com.';
        msg.className = 'sd-msg sd-err';
      });
  });
})();
