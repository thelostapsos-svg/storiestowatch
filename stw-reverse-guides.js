/* stw-reverse-guides.js
   Flips each hub's main index list (.glist) to NEWEST-FIRST and renumbers the
   Roman numerals so the newest reads "I" at the top. The content engine keeps
   appending new cards at the BOTTOM of .glist (oldest->newest in source); this
   reverses the display on load so new articles surface at the top automatically.
   Graceful: if JS is off, the list simply shows in source (oldest-first) order. */
(function () {
  function toRoman(n) {
    var map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
               [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    var r = '';
    for (var i = 0; i < map.length; i++) {
      while (n >= map[i][0]) { r += map[i][1]; n -= map[i][0]; }
    }
    return r;
  }
  function run() {
    var lists = document.querySelectorAll('.glist');
    for (var l = 0; l < lists.length; l++) {
      var list = lists[l];
      // direct-child guide cards only (never reel/carousel items)
      var items = [];
      for (var c = 0; c < list.children.length; c++) {
        if (list.children[c].classList && list.children[c].classList.contains('gitem')) {
          items.push(list.children[c]);
        }
      }
      if (items.length < 2) continue;
      // reverse DOM order (newest, currently last, goes to top)
      for (var i = items.length - 1; i >= 0; i--) { list.appendChild(items[i]); }
      // renumber from the top so newest = I
      var idx = 1;
      for (var k = 0; k < list.children.length; k++) {
        var it = list.children[k];
        if (!(it.classList && it.classList.contains('gitem'))) continue;
        var num = it.querySelector('.gnum');
        if (num) num.textContent = toRoman(idx);
        idx++;
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
