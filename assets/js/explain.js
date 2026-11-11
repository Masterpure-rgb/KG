/* EXPLAIN — qisqa ovozli izoh (QR-1): pleyer va matn. UZ/RU. */
(function () {
  "use strict";
  var O = window.KG || window.OGL, el = O.el, I = O.I || { getLang: function () { return "uz"; } };
  var lang = I.getLang();
  var n = +document.body.getAttribute("data-topic"), T = O.topic(n) || { k: n };
  var topicName = O.topicName(n);

  var L = lang === "ru" ? {
    topics: "Темы", topic: "Тема ", explain: "Объяснение",
    kicker: "Тема " + O.k(n) + ". Аудио-объяснение",
    comingSoon: "Аудио-объяснение этой темы готовится. Пока откройте лабораторную — там есть теория и примеры кода.",
    goLab: "Открыть лабораторную",
    goTasks: "К заданиям",
    listen: "Слушать",
    pause: "Пауза",
    transcript: "Текст объяснения",
    nextLab: "Дальше — практика: пример и задания с проверкой прямо в браузере.",
    openLab: "Открыть лабораторную",
    loadErr: "Не удалось загрузить аудио."
  } : {
    topics: "Mavzular", topic: "A", explain: "Audio izoh",
    kicker: "A" + O.k(n) + " — Audio izoh",
    comingSoon: "Bu mavzuning ovozli izohi tayyorlanmoqda. Hozirça laboratoriyani oçing — unda nazariya va kod misollari bor.",
    goLab: "Laboratoriyani oçiş",
    goTasks: "Topşiriqlarga",
    listen: "Tinglaş",
    pause: "Töxtatiş",
    transcript: "Izoh matni",
    nextLab: "Keyingi — amaliyot: misol va topşiriqlar brauzerda tekşiriş bilan.",
    openLab: "Laboratoriyani oçiş",
    loadErr: "Audio yuklab bölmadi."
  };

  O.header("explain", [
    { text: L.topics, href: O.link("") },
    { text: L.topic + O.k(n), href: O.link("#t" + n) },
    { text: L.explain }
  ]);

  var main = el("main", { class: "wrap doc" });
  document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" },
    el("p", { class: "kicker" }, L.kicker),
    el("h1", null, topicName),
    O.trio(n, "e")));

  function mmss(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  var other = lang === "ru" ? "uz" : "ru";
  O.fetchJSON("data/audio/" + n + "." + (lang === "ru" ? "ru" : "uz") + ".json").catch(function () {
    return O.fetchJSON("data/audio/" + n + "." + other + ".json");
  }).catch(function () { return O.fetchJSON("data/audio/" + n + ".json"); }).then(render, function () {
    main.appendChild(el("p", { class: "note" }, L.comingSoon));
    main.appendChild(el("div", { style: "margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap" },
      el("a", { class: "btn", href: O.tpath("l", n) }, L.goLab),
      el("a", { class: "btn ghost", href: O.tpath("z", n) }, L.goTasks)));
    O.footer();
  });

  function render(D) {
    var a = new Audio(); a.preload = "metadata"; a.src = O.link(D.file);
    var btn = el("button", { class: "play", type: "button", "aria-label": L.listen }, el("span", { class: "ic ic-play", "aria-hidden": "true" }));
    var fill = el("i"), bar = el("div", { class: "pbar", role: "slider", tabindex: "0", "aria-valuenow": "0" }, fill);
    var tc = el("span", { class: "tc" }, "0:00 / " + mmss(D.duration));
    var speeds = el("div", { class: "spd" });
    [0.75, 1, 1.25, 1.5].forEach(function (s) {
      var b = el("button", { type: "button", class: s === 1 ? "on" : null, onclick: function () { a.playbackRate = s; O.$$("button", speeds).forEach(function (x) { x.classList.toggle("on", x === b); }); } }, String(s).replace(".", ",") + "×");
      speeds.appendChild(b);
    });
    main.appendChild(el("section", { class: "player" }, btn, el("div", { class: "pmid" }, el("b", null, D.title), bar, el("div", { class: "prow" }, tc, speeds))));

    var tr = el("section", { class: "transcript" }, el("h2", null, L.transcript));
    var pe = [];
    (D.paragraphs || []).forEach(function (p) {
      var e = el("p", { tabindex: "0" }, p.text);
      function go() { a.currentTime = p.start + 0.01; a.play(); }
      e.addEventListener("click", go);
      e.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
      tr.appendChild(e); pe.push(e);
    });
    main.appendChild(tr);
    main.appendChild(el("section", { class: "next" },
      el("p", null, L.nextLab),
      el("a", { class: "btn run", href: O.tpath("l", n) }, L.openLab)));

    btn.addEventListener("click", function () { if (a.paused) a.play(); else a.pause(); });
    function seekTo(fr) { var d = a.duration || D.duration; a.currentTime = Math.max(0, Math.min(d - 0.1, fr * d)); }
    bar.addEventListener("click", function (ev) { var r = bar.getBoundingClientRect(); seekTo((ev.clientX - r.left) / r.width); });
    bar.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight") { a.currentTime = Math.min((a.duration || D.duration) - 0.1, a.currentTime + 5); ev.preventDefault(); }
      if (ev.key === "ArrowLeft") { a.currentTime = Math.max(0, a.currentTime - 5); ev.preventDefault(); }
    });
    a.addEventListener("play", function () { btn.classList.add("on"); btn.setAttribute("aria-label", L.pause); });
    a.addEventListener("pause", function () { btn.classList.remove("on"); btn.setAttribute("aria-label", L.listen); });
    a.addEventListener("error", function () { O.toast(L.loadErr, "bad"); });
    a.addEventListener("timeupdate", function () {
      var d = a.duration || D.duration, c = a.currentTime;
      fill.style.width = (100 * c / d) + "%";
      tc.textContent = mmss(c) + " / " + mmss(d);
      var cur = -1;
      (D.paragraphs || []).forEach(function (p, i) { if (c + 0.05 >= p.start) cur = i; });
      pe.forEach(function (e, i) { e.classList.toggle("now", i === cur && (c > 0 || !a.paused)); });
    });
    O.footer();
  }
})();
