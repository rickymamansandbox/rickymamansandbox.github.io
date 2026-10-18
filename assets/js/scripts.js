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
