/* TASKS — «Topşiriqlar» sahifasi: variantlar, nazorat savollari, topşiriş. UZ/RU. */
(function () {
  "use strict";
  var O = window.KG || window.OGL, el = O.el, I = O.I || { getLang: function () { return "uz"; } };
  var lang = I.getLang();
  var n = +document.body.getAttribute("data-topic"), T = O.topic(n) || { k: n };
  var topicName = O.topicName(n);

  var L = lang === "ru" ? {
    topics: "Темы", topic: "Тема ", tasks: "Задания",
    kicker: "ЛР " + O.k(n) + ". Задания и сдача",
    comingSoon: "Материалы по теме ещё готовятся. Пока можно ознакомиться с темой на странице лабораторной.",
    goLab: "Открыть лабораторную",
    goAudio: "Аудио-объяснение"
  } : {
    topics: "Mavzular", topic: "A", tasks: "Topşiriqlar",
    kicker: "A" + O.k(n) + " — Topşiriqlar va topşiriş",
    comingSoon: "Mavzu boʻyiça materiallar tayyorlanmoqda. Hozircha laboratoriya sahifasida mavzu bilan tanişiş mumkin.",
    goLab: "Laboratoriyani oçiş",
    goAudio: "Audio izoh"
  };

  O.header("tasks", [
    { text: L.topics, href: O.link("") },
    { text: L.topic + O.k(n), href: O.link("#t" + n) },
    { text: L.tasks }
  ]);

  var main = el("main", { class: "wrap doc" });
  document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" },
    el("p", { class: "kicker" }, L.kicker),
    el("h1", null, topicName),
    O.trio(n, "z")));

  O.fetchJSON("data/topics/" + n + ".json").then(render, function () {
    main.appendChild(el("p", { class: "note" }, L.comingSoon));
    main.appendChild(el("div", { style: "margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap" },
      el("a", { class: "btn", href: O.tpath("l", n) }, L.goLab),
      el("a", { class: "btn ghost", href: O.tpath("e", n) }, L.goAudio)));
    O.footer();
  });

  function render(D) {
    // Agar data mavjud bo'lsa, oddiy variantlar roʻyxatini ko'rsatamiz
    var P = D.practice || {};
    if (P.variants && P.variants.length) {
      var list = el("ol", { class: "variants" }, P.variants.map(function (v) {
        return el("li", null,
          el("b", { class: "vn" }, "№" + v.n),
          el("span", null, O.rich(v.text || "")));
      }));
      main.appendChild(el("section", { class: "blk" },
        el("h2", null, lang === "ru" ? "Варианты индивидуального задания" : "Individual topşiriq variantlari"),
        list));
    } else {
      main.appendChild(el("p", { class: "note" }, L.comingSoon));
    }
    main.appendChild(el("div", { style: "margin-top: 20px" },
      el("a", { class: "btn", href: O.tpath("l", n) }, L.goLab)));
    O.footer();
  }
})();
