(function () {
  var trigger = document.querySelector('#toggle-main-menu-mobile');
  var menu = document.querySelector('#main-menu-mobile');
  if (!trigger || !menu) return;
  function setOpen(open) {
    menu.classList.toggle('open', open);
    trigger.classList.toggle('is-active', open);
    document.body.classList.toggle('lock-scroll', open);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  trigger.addEventListener('click', function () {
    var opening = !menu.classList.contains('open');
    setOpen(opening);
    if (opening) {
      window.setTimeout(function () {
        if (menu.classList.contains('open')) menu.querySelector('a')?.focus();
      }, 360);
    }
  });
  menu.addEventListener('click', function (event) { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (!menu.classList.contains('open')) return;
    if (event.key === 'Escape') { setOpen(false); trigger.focus(); }
    if (event.key === 'Tab') {
      var links = Array.from(menu.querySelectorAll('a'));
      var focusables = links.concat(trigger);
      var index = focusables.indexOf(document.activeElement);
      event.preventDefault();
      focusables[(index + (event.shiftKey ? -1 : 1) + focusables.length) % focusables.length].focus();
    }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 992) setOpen(false); });
})();

(function () {
  var items = document.querySelectorAll('.main-menu .has-sub');
  items.forEach(function (li) {
    var btn = li.querySelector('.sub-toggle');
    function set(open) { li.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', function () { set(!li.classList.contains('open')); });
    li.addEventListener('mouseenter', function () { btn.setAttribute('aria-expanded', 'true'); });
    li.addEventListener('mouseleave', function () { btn.setAttribute('aria-expanded', String(li.classList.contains('open'))); });
    li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
  });
  document.addEventListener('click', function (e) { items.forEach(function (li) { if (!li.contains(e.target)) { li.classList.remove('open'); li.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); } }); });
})();
