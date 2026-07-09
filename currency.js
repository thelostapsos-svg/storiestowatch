/* Stories To Watch — shared currency converter.
   Converts any element tagged data-usd / data-usd-low+data-usd-high into the
   viewer's chosen currency. USD is the base and stays in the HTML (crawlable).
   Live rates from a free endpoint with a dated fallback; choice persists in
   localStorage so it carries across pages. Conversions are labelled indicative. */
(function () {
  var CCY = {
    USD: { s: '$',    n: 'US Dollar' },
    EUR: { s: '€', n: 'Euro' },
    GBP: { s: '£', n: 'British Pound' },
    CHF: { s: 'CHF ',  n: 'Swiss Franc' },
    AED: { s: 'AED ',  n: 'UAE Dirham' },
    INR: { s: '₹', n: 'Indian Rupee' },
    JPY: { s: '¥', n: 'Japanese Yen' },
    SGD: { s: 'S$',    n: 'Singapore Dollar' },
    HKD: { s: 'HK$',   n: 'Hong Kong Dollar' },
    CAD: { s: 'C$',    n: 'Canadian Dollar' },
    AUD: { s: 'A$',    n: 'Australian Dollar' }
  };
  /* Indicative fallback, per 1 USD — used ONLY if the live fetch fails. ~mid-2026. */
  var FALLBACK = { USD:1, EUR:0.92, GBP:0.79, CHF:0.89, AED:3.67, INR:83.3, JPY:157, SGD:1.35, HKD:7.82, CAD:1.37, AUD:1.52 };
  var state = { code: 'USD', rate: 1, rates: FALLBACK, live: false };

  function num(v) { return Math.round(v).toLocaleString('en-US'); }
  function rateStr(r) { return r >= 10 ? Math.round(r).toLocaleString('en-US') : (Math.round(r * 100) / 100).toString(); }
  function symbol(code) { return (CCY[code] || CCY.USD).s; }
  function convert(usd) { return usd * state.rate; }
  function format(usd) { return symbol(state.code) + num(convert(usd)); }

  function applyToDom() {
    var i, els;
    els = document.querySelectorAll('[data-usd]');
    for (i = 0; i < els.length; i++) { els[i].textContent = format(parseFloat(els[i].getAttribute('data-usd'))); }
    els = document.querySelectorAll('[data-usd-low]');
    for (i = 0; i < els.length; i++) {
      var lo = parseFloat(els[i].getAttribute('data-usd-low')), hi = parseFloat(els[i].getAttribute('data-usd-high'));
      els[i].textContent = format(lo) + ' – ' + format(hi);
    }
    var note = document.getElementById('ccyNote');
    if (note) {
      note.textContent = state.code === 'USD'
        ? 'Figures in USD.'
        : ('Converted from USD at ' + (state.live ? 'live' : 'indicative') + ' rates · 1 USD ≈ ' + rateStr(state.rate) + ' ' + state.code + '. Indicative only.');
    }
  }

  function fire() {
    document.dispatchEvent(new CustomEvent('stw:ccy', { detail: { code: state.code, rate: state.rate, symbol: symbol(state.code), live: state.live } }));
  }

  function setCode(code) {
    if (!CCY[code]) code = 'USD';
    state.code = code;
    state.rate = state.rates[code] || 1;
    try { localStorage.setItem('stw-ccy', code); } catch (e) {}
    var sels = document.querySelectorAll('.stw-ccy-select');
    for (var i = 0; i < sels.length; i++) { sels[i].value = code; }
    applyToDom();
    fire();
  }

  function buildSelect(sel) {
    var order = ['USD','GBP','EUR','CHF','AED','INR','JPY','SGD','HKD','CAD','AUD'];
    for (var i = 0; i < order.length; i++) {
      var code = order[i];
      var o = document.createElement('option');
      o.value = code; o.textContent = code + ' · ' + symbol(code).trim();
      sel.appendChild(o);
    }
    sel.value = state.code;
    sel.addEventListener('change', function () { setCode(sel.value); });
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem('stw-ccy'); } catch (e) {}
    if (saved && CCY[saved]) state.code = saved;
    var sels = document.querySelectorAll('.stw-ccy-select');
    for (var i = 0; i < sels.length; i++) { buildSelect(sels[i]); }
    setCode(state.code); /* apply immediately with fallback rates */
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.rates) {
          for (var k in FALLBACK) { if (d.rates[k]) state.rates[k] = d.rates[k]; }
          state.live = true; state.rate = state.rates[state.code] || 1;
          applyToDom(); fire();
        }
      })
      .catch(function () { /* keep indicative fallback */ });
  }

  window.STWCurrency = {
    get code() { return state.code; },
    get rate() { return state.rate; },
    get symbol() { return symbol(state.code); },
    get live() { return state.live; },
    convert: convert, format: format, setCode: setCode
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
