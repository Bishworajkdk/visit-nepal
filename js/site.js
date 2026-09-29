(function () {
  "use strict";
  var motion = document.documentElement.classList.contains("motion");
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".story, .page-hero");
  var subnav = document.querySelector(".subnav");
  var story = document.querySelector(".story");
  var ticking = false;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function headerHeight() { return header ? header.offsetHeight : 0; }

  /* Header and in-page navigation */
  var navLinks = subnav ? Array.prototype.slice.call(subnav.querySelectorAll("a[href^='#']")) : [];
  var navTargets = navLinks.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

  function layout() {
    var h = headerHeight();
    if (subnav) subnav.style.top = h + "px";
  }

  function onScroll() {
    var h = headerHeight();
    if (header && hero) {
      var solid = hero.getBoundingClientRect().bottom <= h + 1;
      header.classList.toggle("is-solid", solid);
    }
    if (navLinks.length) {
      var line = h + (subnav ? subnav.offsetHeight : 0) + 60;
      var active = -1;
      navTargets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) active = i; });
      navLinks.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
      if (active > -1) {
        var link = navLinks[active];
        var bar = link.parentNode;
        var target = link.offsetLeft - bar.clientWidth / 2 + link.offsetWidth / 2;
        if (Math.abs(bar.scrollLeft - target) > 40) bar.scrollTo({ left: target, behavior: motion ? "smooth" : "auto" });
      }
    }
    if (story && motion) updateStory();
    ticking = false;
  }

  function requestTick() { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () { layout(); requestTick(); });

  /* Scroll story (home hero) */
  var sceneImgs = story ? story.querySelectorAll(".scene-img") : [];
  var sceneTexts = story ? story.querySelectorAll(".scene-text") : [];
  var bars = story ? story.querySelectorAll(".story-progress i") : [];
  var cue = story ? story.querySelector(".scroll-cue") : null;

  function updateStory() {
    var rect = story.getBoundingClientRect();
    var range = story.offsetHeight - window.innerHeight;
    var p = clamp(0 - rect.top / (range || 1), 0, 1);
    var n = sceneImgs.length;
    var t = p * n;
    for (var i = 0; i < n; i += 1) {
      var d = Math.abs(t - (i + 0.5));
      var o = clamp((0.62 - d) / 0.2, 0, 1);
      var ot = clamp((0.42 - d) / 0.14, 0, 1);
      if (i === 0 && t < 0.5) { o = 1; ot = 1; }
      if (i === n - 1 && t > n - 0.5) { o = 1; ot = 1; }
      var local = clamp(t - i, 0, 1);
      sceneImgs[i].style.opacity = o.toFixed(3);
      sceneImgs[i].style.transform = "scale(" + (1.12 - 0.12 * local).toFixed(4) + ")";
      var shift = (t - (i + 0.5)) * -70;
      if (i === 0 && t < 0.5) shift = 0;
      if (i === n - 1 && t > n - 0.5) shift = 0;
      sceneTexts[i].style.opacity = ot.toFixed(3);
      sceneTexts[i].style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
      sceneTexts[i].style.visibility = ot > 0.01 ? "visible" : "hidden";
      if (bars[i]) bars[i].style.transform = "scaleX(" + clamp(t - i, 0, 1).toFixed(3) + ")";
    }
    if (cue) cue.style.opacity = String(clamp(1 - p * 6, 0, 1));
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (motion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Destination gallery: arrows, dots, keyboard and mouse drag */
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var track = g.querySelector(".tiles");
    var items = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(g.querySelectorAll(".g-dot"));
    var prev = g.querySelector("[data-g='prev']");
    var next = g.querySelector("[data-g='next']");
    var counter = g.querySelector("[data-g-current]");
    var current = 0;

    function pad() { return parseFloat(getComputedStyle(track).paddingLeft) || 0; }
    function goTo(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: items[i].offsetLeft - pad(), behavior: motion ? "smooth" : "auto" });
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var best = 0, bestD = Infinity;
      items.forEach(function (it, i) {
        var d = Math.abs(it.offsetLeft - pad() - track.scrollLeft);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (track.scrollLeft >= max - 4) best = items.length - 1;
      current = best;
      dots.forEach(function (d, i) { if (i === best) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === best); });
      if (counter) counter.textContent = String(best + 1);
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft >= max - 4;
    }
    prev.addEventListener("click", function () { goTo(current - 1); });
    next.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { goTo(i); }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });
    var raf = 0;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);

    /* Drag with a mouse, like swiping on a phone */
    var down = false, moved = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function (e) {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
      if (moved) {
        var dx = e.clientX - startX;
        var step = Math.abs(dx) > 60 ? (dx < 0 ? 1 : 0 - 1) : 0;
        update();
        goTo(current + (Math.abs(track.scrollLeft - startLeft) > 60 ? 0 : step));
      }
    });
    track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);

    track.scrollLeft = 0;
    update();
  });

  /* Tabs (itineraries, months, news) */
  function tabGroup(list, onSelect) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role='tab']"));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      onSelect(tab);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k !== "ArrowRight" && k !== "ArrowLeft") return;
        e.preventDefault();
        var j = k === "ArrowRight" ? (i + 1) % tabs.length : (i + tabs.length - 1) % tabs.length;
        select(tabs[j], true);
      });
    });
  }

  var tripTabs = document.querySelector("#itineraries [role='tablist']");
  if (tripTabs) tabGroup(tripTabs, function (tab) {
    document.querySelectorAll("#itineraries .trip").forEach(function (panel) {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
  });

  var months = document.querySelector(".months");
  if (months) {
    months.querySelectorAll("[role='tab']").forEach(function (t, i) { t.tabIndex = t.getAttribute("aria-selected") === "true" ? 0 : -1; });
    tabGroup(months, function (tab) {
      var m = tab.getAttribute("data-month");
      document.querySelectorAll(".month-panel").forEach(function (panel) { panel.hidden = panel.getAttribute("data-month") !== m; });
    });
  }

  /* Accordion with smooth height */
  document.querySelectorAll("details.acc").forEach(function (d) {
    var summary = d.querySelector("summary");
    var body = d.querySelector(".acc-body");
    summary.addEventListener("click", function (e) {
      if (!motion || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        var h = body.offsetHeight;
        var close = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" });
        close.onfinish = function () { d.open = false; };
      } else {
        d.open = true;
        var full = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: full + "px", opacity: 1 }], { duration: 520, easing: "cubic-bezier(0.16,1,0.3,1)" });
      }
    });
  });

  /* Live news and rashifal */
  var CFG = window.VISIT_NEPAL_CONFIG || {};
  var FEEDS = CFG.feeds || {};
  var READERS = CFG.feedReaders || [{ type: "json", url: "https://api.rss2json.com/v1/api.json?rss_url={url}" }];
  var TTL = (CFG.refreshMinutes || 30) * 60000;
  var MAX = CFG.headlines || 8;
  var newsList = document.querySelector(".news-list:not([data-feed-auto])");
  var memory = {};

  function timeAgo(d) {
    if (!d || isNaN(d)) return "";
    var mins = Math.round((Date.now() - d.getTime()) / 60000);
    if (mins < 60) return mins <= 1 ? "just now" : mins + " minutes ago";
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs === 1 ? "1 hour ago" : hrs + " hours ago";
    var days = Math.round(hrs / 24);
    return days === 1 ? "yesterday" : days + " days ago";
  }
  function esc(s) { var div = document.createElement("div"); div.textContent = s || ""; return div.innerHTML; }
  function parseDate(s) {
    if (!s) return null;
    var d = new Date(s);
    if (isNaN(d)) d = new Date(String(s).replace(" ", "T") + "Z");
    return isNaN(d) ? null : d;
  }
  function tidy(items) {
    return items.map(function (it) {
      var title = it.title || "", source = it.source || "";
      var cut = title.lastIndexOf(" - ");
      if (cut > 0) { source = source || title.slice(cut + 3); title = title.slice(0, cut); }
      return { title: title, source: source, link: it.link, date: parseDate(it.date) };
    }).filter(function (it) { return it.title && it.link; })
      .sort(function (a, b) { return (b.date ? b.date.getTime() : 0) - (a.date ? a.date.getTime() : 0); });
  }
  function fromJson(data) {
    if (!data || data.status !== "ok") return [];
    return data.items.map(function (i) { return { title: i.title, link: i.link, date: i.pubDate, source: i.author }; });
  }
  function fromXml(text) {
    var doc = new DOMParser().parseFromString(text, "text/xml");
    return Array.prototype.slice.call(doc.querySelectorAll("item")).map(function (n) {
      function g(tag) { var e = n.querySelector(tag); return e ? e.textContent : ""; }
      return { title: g("title"), link: g("link"), date: g("pubDate"), source: g("source") };
    });
  }
  function readFeed(feedUrl) {
    var i = 0;
    function attempt() {
      if (i >= READERS.length) return Promise.resolve([]);
      var r = READERS[i];
      i += 1;
      return fetch(r.url.replace("{url}", encodeURIComponent(feedUrl)))
        .then(function (res) { if (!res.ok) throw new Error(res.status); return r.type === "json" ? res.json() : res.text(); })
        .then(function (data) { var items = r.type === "json" ? fromJson(data) : fromXml(data); if (!items.length) throw new Error("empty"); return items; })
        .catch(function () { return attempt(); });
    }
    return attempt();
  }
  function readGroup(name) {
    var urls = (FEEDS[name] || []).slice();
    function next() {
      if (!urls.length) return Promise.resolve([]);
      return readFeed(urls.shift()).then(function (items) { return items.length ? items : next(); });
    }
    return next();
  }
  function saved(name) {
    try {
      var raw = localStorage.getItem("vn-feed-" + name);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return obj && Date.now() - obj.t < TTL ? obj.items : null;
    } catch (e) { return null; }
  }
  function save(name, items) {
    try { localStorage.setItem("vn-feed-" + name, JSON.stringify({ t: Date.now(), items: items })); } catch (e) {}
  }
  function render(list, items, animate) {
    list.setAttribute("aria-busy", "false");
    if (!items.length) {
      list.innerHTML = '<li class="news-empty">' + esc(list.getAttribute("data-empty") || "Headlines could not load right now. Please try again in a little while.") + "</li>";
      return;
    }
    list.innerHTML = items.slice(0, MAX).map(function (it, i) {
      var d = it.date ? new Date(it.date) : null;
      return '<li' + (animate ? ' class="fresh" style="animation-delay:' + (i * 60) + 'ms"' : "") + '><span class="meta"><b>' + esc(it.source) + "</b> " + esc(timeAgo(d)) +
        '</span><a href="' + esc(it.link) + '" target="_blank" rel="noopener">' + esc(it.title) + "</a></li>";
    }).join("");
  }
  function load(name, list, force) {
    if (!list) return;
    var cached = !force && (memory[name] || saved(name));
    if (cached) { render(list, cached, !force); return; }
    if (!list.querySelector("li:not(.skeleton)")) {
      list.setAttribute("aria-busy", "true");
      list.innerHTML = '<li class="skeleton"></li><li class="skeleton"></li><li class="skeleton"></li><li class="skeleton"></li>';
    }
    readGroup(name).then(function (raw) {
      var items = tidy(raw).map(function (it) { return { title: it.title, source: it.source, link: it.link, date: it.date ? it.date.getTime() : null }; });
      if (items.length) { memory[name] = items; save(name, items); }
      render(list, items.length ? items : (memory[name] || []), true);
    });
  }

  var newsTabs = document.querySelector(".news-tabs");
  var currentFeed = "nepal";
  if (newsTabs && newsList) {
    tabGroup(newsTabs, function (tab) { currentFeed = tab.getAttribute("data-feed"); load(currentFeed, newsList); });
    if ("IntersectionObserver" in window) {
      var started = false;
      var nio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !started) { started = true; load(currentFeed, newsList); nio.disconnect(); }
      }, { rootMargin: "600px 0px" });
      nio.observe(newsList);
    } else {
      load(currentFeed, newsList);
    }
  }
  var autoLists = document.querySelectorAll("[data-feed-auto]");
  autoLists.forEach(function (list) { load(list.getAttribute("data-feed-auto"), list); });

  /* Keep everything fresh while the page stays open */
  setInterval(function () {
    memory = {};
    if (newsList && newsList.querySelector("li")) load(currentFeed, newsList, true);
    autoLists.forEach(function (list) { load(list.getAttribute("data-feed-auto"), list, true); });
  }, TTL);

  /* Nepali calendar */
  var BS = window.BS_DATA || {};
  var NE_DIGITS = "०१२३४५६७८९";
  var MONTHS_NE = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
  var MONTHS_EN = ["Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Asoj", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
  var DAYS_NE = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];
  var DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var AD_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var FIXED = CFG.fixedFestivals || {};
  var NOTES = CFG.monthNotes || [];
  function neNum(n) { return String(n).replace(/[0-9]/g, function (d) { return NE_DIGITS[Number(d)]; }); }
  function dayNum(y, m, d) { return Math.round(Date.UTC(y, m, d) / 86400000); }
  function toBS(date) {
    var n = dayNum(date.getFullYear(), date.getMonth(), date.getDate());
    var years = Object.keys(BS);
    for (var i = 0; i < years.length; i += 1) {
      var rows = BS[years[i]];
      for (var m = 0; m < 12; m += 1) {
        var r = rows[m];
        var start = dayNum(r[0], r[1] - 1, r[2]);
        if (n >= start && n < start + r[3]) return { y: Number(years[i]), m: m, d: n - start + 1, wd: date.getDay() };
      }
    }
    return null;
  }
  function bsNe(b) { return neNum(b.y) + " " + MONTHS_NE[b.m] + " " + neNum(b.d) + ", " + DAYS_NE[b.wd]; }
  function bsEn(b) { return b.d + " " + MONTHS_EN[b.m] + " " + b.y + ", " + DAYS_EN[b.wd]; }

  var now = new Date();
  var todayBS = toBS(now);
  function paintToday() {
    now = new Date();
    todayBS = toBS(now);
    if (!todayBS) {
      document.querySelectorAll(".today-strip").forEach(function (el) { el.hidden = true; });
      return;
    }
    document.querySelectorAll("[data-bs-today='ne']").forEach(function (el) { el.textContent = bsNe(todayBS); });
    document.querySelectorAll("[data-bs-today='en']").forEach(function (el) { el.textContent = bsEn(todayBS); });
    document.querySelectorAll("[data-ad-today]").forEach(function (el) {
      el.textContent = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    });
  }
  paintToday();

  var grid = document.querySelector(".cal-grid");
  if (grid && todayBS) {
    var view = { y: todayBS.y, m: todayBS.m };
    var titleNe = document.querySelector("[data-cal-title='ne']");
    var titleEn = document.querySelector("[data-cal-title='en']");
    var notes = document.querySelector("[data-cal-notes]");
    function draw(dir) {
      var r = BS[view.y][view.m];
      var first = new Date(r[0], r[1] - 1, r[2]);
      var last = new Date(r[0], r[1] - 1, r[2] + r[3] - 1);
      titleNe.textContent = MONTHS_NE[view.m] + " " + neNum(view.y);
      titleEn.textContent = MONTHS_EN[view.m] + " " + view.y + " (" + first.getDate() + " " + AD_MONTHS[first.getMonth()] + " to " + last.getDate() + " " + AD_MONTHS[last.getMonth()] + " " + last.getFullYear() + ")";
      notes.textContent = NOTES[view.m];
      var html = "";
      for (var e = 0; e < first.getDay(); e += 1) html += '<span class="cal-cell empty"></span>';
      for (var d = 1; d <= r[3]; d += 1) {
        var ad = new Date(r[0], r[1] - 1, r[2] + d - 1);
        var cls = "cal-cell";
        var fest = FIXED[view.m + "-" + d];
        if (ad.getDay() === 6) cls += " is-sat";
        if (fest) cls += " is-fest";
        if (view.y === todayBS.y && view.m === todayBS.m && d === todayBS.d) cls += " is-today";
        var label = d + " " + MONTHS_EN[view.m] + ", " + ad.getDate() + " " + AD_MONTHS[ad.getMonth()] + (fest ? ", " + fest : "");
        html += '<span class="' + cls + '" role="gridcell" aria-label="' + label + '" title="' + (fest || "") + '"><b lang="ne">' + neNum(d) + "</b><small>" + ad.getDate() + (ad.getDate() === 1 ? " " + AD_MONTHS[ad.getMonth()] : "") + "</small></span>";
      }
      grid.innerHTML = html;
      if (motion && dir && grid.animate) {
        grid.animate([{ opacity: 0, transform: "translateX(" + (dir * 24) + "px)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: "cubic-bezier(0.16,1,0.3,1)" });
      }
      var years = Object.keys(BS).map(Number);
      document.querySelector("[data-cal='-1']").disabled = view.y === years[0] && view.m === 0;
      document.querySelector("[data-cal='1']").disabled = view.y === years[years.length - 1] && view.m === 11;
    }
    document.querySelectorAll("[data-cal]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-cal");
        if (v === "today") { view = { y: todayBS.y, m: todayBS.m }; draw(0); return; }
        var step = Number(v);
        var m = view.m + step, y = view.y;
        if (m < 0) { m = 11; y = y - 1; }
        if (m > 11) { m = 0; y = y + 1; }
        if (!BS[y]) return;
        view = { y: y, m: m };
        draw(step);
      });
    });
    draw(0);
    window.vnRedrawCalendar = function () { view = { y: todayBS.y, m: todayBS.m }; draw(0); };

    var input = document.getElementById("ad-input");
    var outNe = document.querySelector("[data-conv='ne']");
    var outEn = document.querySelector("[data-conv='en']");
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    input.value = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    function convert() {
      var parts = input.value.split("-").map(Number);
      if (parts.length !== 3 || !parts[0]) { outNe.textContent = ""; outEn.textContent = ""; return; }
      var b = toBS(new Date(parts[0], parts[1] - 1, parts[2]));
      if (!b) { outNe.textContent = ""; outEn.textContent = "Choose a date between April 2023 and April 2033."; return; }
      outNe.textContent = bsNe(b);
      outEn.textContent = bsEn(b);
    }
    input.addEventListener("input", convert);
    convert();
  }

  /* Roll over to the new day at midnight without a reload */
  function scheduleMidnight() {
    var n = new Date();
    var next = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 5);
    setTimeout(function () {
      paintToday();
      if (typeof window.vnRedrawCalendar === "function") window.vnRedrawCalendar();
      scheduleMidnight();
    }, next.getTime() - n.getTime());
  }
  scheduleMidnight();

  /* Swap in a fallback photo if one fails to load */
  var FALLBACK = CFG.fallbackPhoto;
  if (FALLBACK) {
    document.querySelectorAll("img").forEach(function (im) {
      function swap() { if (im.src !== FALLBACK) im.src = FALLBACK; }
      im.addEventListener("error", swap);
      if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) swap();
    });
    document.querySelectorAll("[style*='background-image']").forEach(function (el) {
      var m = /url\(['"]?([^'")]+)['"]?\)/.exec(el.getAttribute("style"));
      if (!m) return;
      var test = new Image();
      test.onerror = function () { el.style.backgroundImage = "url('" + FALLBACK + "')"; };
      test.src = m[1];
    });
  }

  /* Rashifal links come from js/config.js so they can be changed in one place */
  var RASHI_CFG = CFG.rashifal || {};
  document.querySelectorAll("[data-sign]").forEach(function (a) {
    var url = RASHI_CFG.signs && RASHI_CFG.signs[a.getAttribute("data-sign")];
    if (url) a.href = url;
  });
  document.querySelectorAll("[data-rashifal-page]").forEach(function (a) { if (RASHI_CFG.page) a.href = RASHI_CFG.page; });


  /* Right now in Kathmandu: time, greeting and weather */
  var KTM = "Asia/Kathmandu";
  function ktmHour() { return Number(new Date().toLocaleString("en-US", { timeZone: KTM, hour: "numeric", hour12: false })) % 24; }
  function greet(h) { return h < 5 ? "शुभ रात्री" : h < 12 ? "शुभ प्रभात" : h < 17 ? "शुभ दिन" : h < 21 ? "शुभ सन्ध्या" : "शुभ रात्री"; }
  var ktmTemp = null;
  function paintClock() {
    var t;
    try { t = new Date().toLocaleTimeString("en-US", { timeZone: KTM, hour: "numeric", minute: "2-digit" }).toLowerCase(); } catch (e) { return; }
    document.querySelectorAll("[data-ktm-time]").forEach(function (el) { el.textContent = t; });
    document.querySelectorAll("[data-ktm-greet]").forEach(function (el) { el.textContent = greet(ktmHour()); });
    document.querySelectorAll("[data-ktm-line]").forEach(function (el) {
      el.textContent = "It is " + t + " in Kathmandu" + (ktmTemp !== null ? " and " + ktmTemp + "\u00B0C" : "") + ".";
    });
  }
  paintClock();
  setInterval(paintClock, 30000);

  var WX = { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy", 45: "Fog", 48: "Fog", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle", 61: "Rain", 63: "Rain", 65: "Heavy rain", 71: "Snow", 73: "Snow", 75: "Heavy snow", 77: "Snow", 80: "Showers", 81: "Showers", 82: "Heavy showers", 85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm" };
  var wxList = document.querySelector("[data-weather]");
  var wxPlaces = CFG.weather || [];
  function paintWeather(rows) {
    if (!wxList) return;
    wxList.innerHTML = rows.map(function (r) {
      return '<li><span>' + esc(r.name) + '</span><strong>' + r.temp + '\u00B0C</strong><small>' + esc(r.text) + "</small></li>";
    }).join("");
    if (rows[0]) { ktmTemp = rows[0].temp; paintClock(); }
  }
  function loadWeather() {
    if (!wxPlaces.length || (!wxList && !document.querySelector("[data-ktm-line]"))) return;
    try {
      var c = JSON.parse(localStorage.getItem("vn-weather") || "null");
      if (c && Date.now() - c.t < TTL) { paintWeather(c.rows); return; }
    } catch (e) {}
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + wxPlaces.map(function (p) { return p.lat; }).join(",") +
      "&longitude=" + wxPlaces.map(function (p) { return p.lng; }).join(",") + "&current=temperature_2m,weather_code&timezone=Asia%2FKathmandu";
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var arr = Array.isArray(data) ? data : [data];
      var rows = arr.map(function (d, i) {
        return { name: wxPlaces[i].name, temp: Math.round(d.current.temperature_2m), text: WX[d.current.weather_code] || "" };
      });
      try { localStorage.setItem("vn-weather", JSON.stringify({ t: Date.now(), rows: rows })); } catch (e) {}
      paintWeather(rows);
    }).catch(function () { if (wxList) wxList.hidden = true; });
  }
  loadWeather();
  setInterval(loadWeather, TTL);

  /* A singing bowl, made in the browser. It only plays when the visitor asks. */
  var bowlBtn = document.querySelector("[data-bowl]");
  if (bowlBtn) {
    var ctx = null, bowlTimer = null, master = null;
    function strike() {
      var now = ctx.currentTime;
      [[196, 0.5], [541, 0.22], [1060, 0.09], [1752, 0.04]].forEach(function (pt, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = pt[0];
        var lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = 3 + i * 0.7; lg.gain.value = pt[0] * 0.004;
        lfo.connect(lg); lg.connect(o.frequency);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(pt[1], now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 9 - i * 1.5);
        o.connect(g); g.connect(master);
        o.start(now); lfo.start(now);
        o.stop(now + 9.5); lfo.stop(now + 9.5);
      });
    }
    bowlBtn.addEventListener("click", function () {
      var on = bowlBtn.getAttribute("aria-pressed") !== "true";
      bowlBtn.setAttribute("aria-pressed", String(on));
      bowlBtn.querySelector("[data-bowl-label]").textContent = on ? "Stop the singing bowl" : "Play a singing bowl";
      if (on) {
        if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination); }
        ctx.resume();
        strike();
        bowlTimer = setInterval(strike, 10000);
      } else {
        clearInterval(bowlTimer);
        if (ctx) ctx.suspend();
      }
    });
  }

  layout();
  onScroll();
})();
