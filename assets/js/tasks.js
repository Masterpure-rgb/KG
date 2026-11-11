/* TASKS — «Topşiriqlar» sahifasi: maqsad, individual topşiriq variantlari, nazorat savollari, hisobot, topşiriş. UZ/RU. */
(function () {
  "use strict";
  var O = window.KG || window.OGL, el = O.el, I = O.I || { getLang: function () { return "uz"; } };
  var lang = I.getLang() === "ru" ? "ru" : "uz";
  var n = +document.body.getAttribute("data-topic");
  var topicName = O.topicName(n);

  var L = lang === "ru" ? {
    topics: "Темы", topic: "Тема ", tasks: "Задания",
    kicker: "Работа " + n + ". Задания и сдача",
    loadErr: "Не удалось загрузить задания. Обновите страницу.",
    goal: "Цель работы", skills: "Навыки", indiv: "Индивидуальное задание",
    myVar: "Мой вариант", choose: "выберите номер",
    hintVar: "Номер варианта назначает преподаватель. Выберите его — он выделится, и появятся кнопки.",
    doIt: "Выполнить в Мастерской", submit: "Сдать работу",
    steps: "Порядок выполнения",
    s1: "Пройдите пример и задания лабораторной — каждое проверяется прямо в браузере.",
    s2: "Откройте свой вариант в Мастерской: условие уже будет в комментарии к коду.",
    s3: "Сделайте скриншот окна (кнопка «Скриншот») и подготовьте отчёт.",
    s4: "Сдайте работу: код, скриншот и ответы на контрольные вопросы.",
    toLab: "Открыть лабораторную", toAudio: "Аудио-объяснение",
    qs: "Контрольные вопросы", report: "Требования к отчёту",
    rep: [
      ["Тема и цель", "тема, цель работы и ожидаемый результат."],
      ["Краткая теория", "основные понятия и формулы по теме работы."],
      ["Описание выполнения", "пошагово по заданиям и индивидуальному варианту, использованные функции и алгоритмы."],
      ["Код программы", "один файл .cpp (прежде всего — по индивидуальному варианту)."],
      ["Скриншоты", "окно OpenGL для каждого задания и варианта (.png)."],
      ["Ответы на контрольные вопросы", "кратко, своими словами."],
      ["Вывод", "чему научились и какие навыки применили."]],
    repNote: "Отчёт оформляется на листах A4, шрифт Times New Roman 14 pt, интервал 1,5; сдаётся через сайт одним файлом ZIP или PDF."
  } : {
    topics: "Mavzular", topic: "A", tasks: "Topşiriqlar",
    kicker: "A" + n + " — Topşiriqlar va topşiriş",
    loadErr: "Topşiriqlarni yuklab bölmadi. Sahifani yangilang.",
    goal: "Işning maqsadi", skills: "Könikmalar", indiv: "Individual topşiriq",
    myVar: "Mening variantim", choose: "raqamni tanlang",
    hintVar: "Variant raqamini öqituvçi tayinlaydi. Uni tanlang — variant ajralib turadi va tugmalar paydo böladi.",
    doIt: "Ustaxonada bajariş", submit: "Işni topşiriş",
    steps: "Bajariş tartibi",
    s1: "Laboratoriyadagi misol va topşiriqlarni bajaring — har biri brauzerda tekşiriladi.",
    s2: "Öz variantingizni Ustaxonada oçing: şart kod izohida yozilgan böladi.",
    s3: "Oyna rasmini oling («Skrinşot» tugmasi) va hisobot tayyorlang.",
    s4: "Işni topşiring: kod, skrinşot va nazorat savollariga javoblar.",
    toLab: "Laboratoriyani oçiş", toAudio: "Audio izoh",
    qs: "Nazorat savollari", report: "Hisobotga talablar",
    rep: [
      ["Mavzu va maqsad", "iş mavzusi, maqsadi va kutilayotgan natija."],
      ["Qisqa nazariya", "mavzuga oid asosiy tuşunçalar va formulalar."],
      ["Bajarilgan iş tavsifi", "topşiriqlar va individual variant böyiça bosqiçma-bosqiç, qöllanilgan funksiyalar va algoritmlar."],
      ["Dastur kodi", "bitta .cpp fayl (avvalo individual variant böyiça)."],
      ["Skrinşotlar", "har bir topşiriq va variantning OpenGL oynasi (.png)."],
      ["Nazorat savollariga javoblar", "qisqa, öz sözlaringiz bilan."],
      ["Xulosa", "nimani örgandingiz va qaysi könikmalarni qölladingiz."]],
    repNote: "Hisobot A4 formatida, Times New Roman 14 pt, 1,5 interval bilan tayyorlanadi; sayt orqali bitta ZIP yoki PDF fayl körinişida topşiriladi."
  };

  O.header("tasks", [
    { text: L.topics, href: O.link("") },
    { text: L.topic + n, href: O.link("#t" + n) },
    { text: L.tasks }
  ]);
  var main = el("main", { class: "wrap doc" });
  document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" },
    el("p", { class: "kicker" }, L.kicker),
    el("h1", null, topicName),
    O.trio(n, "z")));

  O.fetchJSON("data/topics/" + n + ".json").then(render, function () {
    main.appendChild(el("p", { class: "note" }, L.loadErr));
    O.footer();
  });

  function render(J) {
    var D = J[lang] || J.uz;
    // 1. Maqsad va könikmalar
    main.appendChild(el("section", { class: "blk" },
      el("h2", null, L.goal), el("p", null, O.rich(cap(D.goal))),
      el("h3", null, L.skills), el("p", null, O.rich(cap(D.skills)))));

    // 2. Bajariş tartibi
    main.appendChild(el("section", { class: "blk" },
      el("h2", null, L.steps),
      el("ol", { class: "ticks" }, [L.s1, L.s2, L.s3, L.s4].map(function (s) { return el("li", null, s); })),
      el("div", { class: "v-act" },
        el("a", { class: "btn", href: O.tpath("l", n) }, L.toLab),
        el("a", { class: "btn ghost", href: O.tpath("e", n) }, L.toAudio))));

    // 3. Individual topşiriq
    var key = "var:" + n, myV = String(O.store.get(key, "") || "");
    var sel = el("select", { "aria-label": L.myVar },
      el("option", { value: "" }, "— " + L.choose + " —"),
      D.variants.map(function (v) { return el("option", { value: String(v.n), selected: String(v.n) === myV ? true : null }, String(v.n)); }));
    var list = el("ol", { class: "variants" });
    function paint() {
      list.innerHTML = "";
      D.variants.forEach(function (v) {
        var mine = String(v.n) === sel.value;
        list.appendChild(el("li", { class: mine ? "mine" : null, id: "v" + v.n },
          el("span", { class: "vn" }, String(v.n)),
          el("div", null,
            el("p", null, O.rich(v.text)),
            mine ? el("div", { class: "v-act" },
              el("a", { class: "btn small", href: O.link("sandbox/?t=" + n + "&v=" + v.n) }, L.doIt),
              el("button", { class: "btn small run", type: "button", onclick: function () {
                var code = O.store.get("sandbox:t" + n + ":v" + v.n, "") || O.store.get("sandbox:last", "");
                Submit.open({ work: "SZ" + n, variant: v.n, code: code });
              } }, L.submit)) : null)));
      });
    }
    sel.addEventListener("change", function () { O.store.set(key, sel.value); paint(); });
    paint();
    main.appendChild(el("section", { class: "blk" },
      el("div", { class: "blk-h" }, el("h2", null, L.indiv),
        el("label", { class: "var-pick" }, el("span", null, L.myVar + ": "), sel)),
      el("p", null, O.rich(D.intro)),
      el("p", { class: "muted small" }, L.hintVar),
      list));

    // 4. Nazorat savollari
    main.appendChild(el("section", { class: "blk" },
      el("h2", null, L.qs),
      el("ol", { class: "qa" }, D.questions.map(function (q) { return el("li", null, O.rich(q)); }))));

    // 5. Hisobot
    main.appendChild(el("section", { class: "blk" },
      el("h2", null, L.report),
      el("ul", { class: "ticks" }, L.rep.map(function (r) { return el("li", null, el("b", null, r[0]), " — ", r[1]); })),
      el("p", { class: "muted small" }, L.repNote)));
    O.footer();
    if (location.hash && document.querySelector(location.hash)) document.querySelector(location.hash).scrollIntoView();
  }
  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
})();
