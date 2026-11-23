(function () {
  var root = document.documentElement;
  var here = root.dataset.sidebar;
  if (!here) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function read() {
    try {
      return sessionStorage.getItem("sidebar-mode");
    } catch (error) {
      return null;
    }
  }

  function write(mode) {
    try {
      sessionStorage.setItem("sidebar-mode", mode);
    } catch (error) {}
  }

  function shouldPlay(from) {
    if (reduce || !from || from === here) return false;
    return (from === "expanded" || from === "collapsed") && (here === "expanded" || here === "collapsed");
  }

  function play() {
    var bio = null;
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      if (bio) bio.removeEventListener("transitionend", onEnd);
      root.classList.remove("sidebar-hold");
    }

    function onEnd(event) {
      if (event.target !== bio || event.propertyName !== "grid-template-rows") return;
      finish();
    }

    root.classList.add("sidebar-prep");
    root.classList.add("sidebar-hold");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bio = document.querySelector(".sidebar-bio");
        root.classList.remove("sidebar-prep");
        if (!bio) {
          finish();
          return;
        }
        bio.addEventListener("transitionend", onEnd);
        window.setTimeout(finish, 520);
      });
    });
  }

  if (shouldPlay(read())) play();

  write(here);

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    var from = read();
    write(here);
    if (!shouldPlay(from)) return;
    play();
  });

  var desktop = window.matchMedia("(min-width: 1024px)");
  var leaving = false;

  function modeForPath(pathname) {
    var path = pathname.replace(/\/index\.html$/, "/");
    if (path.length > 1) path = path.replace(/\/$/, "");
    var file = path.split("/").pop();
    if (file === "about.html") return "collapsed";
    if (!file || file === "fun.html" || file === "writing.html") return "expanded";
    return null;
  }

  document.addEventListener("click", function (event) {
    if (leaving || reduce || !desktop.matches) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest("a");
    if (!link || !link.closest(".sidebar .nav")) return;
    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    var target = modeForPath(url.pathname);
    if (!target || target === here) return;

    event.preventDefault();
    leaving = true;
    root.classList.add(target === "collapsed" ? "sidebar-leave-up" : "sidebar-leave-down");

    var bio = document.querySelector(".sidebar-bio");
    var gone = false;
    function go() {
      if (gone) return;
      gone = true;
      write(target);
      window.location.href = link.href;
    }
    if (bio) {
      bio.addEventListener("transitionend", function (endEvent) {
        if (endEvent.target === bio && endEvent.propertyName === "grid-template-rows") go();
      });
    }
    window.setTimeout(go, 520);
  });
})();
