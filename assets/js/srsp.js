/* SRS — mustaqil iş: loyiha talablari, mavzular, himoya, yakuniy nazorat savollari. UZ/RU. */
(function () {
  "use strict";
  var O = window.OGL || window.KG, el = O.el, I = O.I || { getLang: function () { return "uz"; } };
  var lang = I.getLang() === "ru" ? "ru" : "uz";
  var L = lang === "ru" ? {
    topics: "Темы", crumb: "Самостоятельная работа", kicker: "Самостоятельная работа (СРС)", h1: "Проект: интерактивная 3D-сцена",
    toc: ["Проект", "Темы проектов", "Защита", "Итоговый контроль"],
    req: "Требования к проекту", del: "Что сдаётся", rep: "Структура отчёта", sched: "Сроки. ",
    myVar: "Мой вариант", variant: "Вариант ", open: "Открыть Мастерскую", submit: "Сдать проект",
    proc: "Порядок защиты", check: "Что проверяет преподаватель", qs: "Вопросы на защите", lab: "Работа ", loadErr: "Не удалось загрузить материалы. Обновите страницу."
  } : {
    topics: "Mavzular", crumb: "Mustaqil iş", kicker: "Mustaqil iş (SRS)", h1: "Loyiha: interaktiv 3D-sahna",
    toc: ["Loyiha", "Loyiha mavzulari", "Himoya", "Yakuniy nazorat"],
    req: "Loyihaga talablar", del: "Nima topşiriladi", rep: "Hisobot tuzilmasi", sched: "Muddatlar. ",
    myVar: "Mening variantim", variant: "Variant ", open: "Ustaxonani oçiş", submit: "Loyihani topşiriş",
    proc: "Himoya tartibi", check: "Öqituvçi nimani tekşiradi", qs: "Himoyadagi savollar", lab: "A", loadErr: "Materiallarni yuklab bölmadi. Sahifani yangilang."
  };
  O.header("srsp", [{ text: L.topics, href: O.link("") }, { text: L.crumb }]);
  var main = el("main", { class: "wrap doc" }); document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" }, el("p", { class: "kicker" }, L.kicker), el("h1", null, L.h1)));
  function ul(a, cls) { return el("ul", { class: cls || "ticks" }, (a || []).map(function (x) { return el("li", null, O.rich(x)); })); }
  function qa(list) { return el("div", { class: "qa" }, list.map(function (x, i) { return el("details", { class: "qa-i" }, el("summary", null, el("span", { class: "qn" }, String(i + 1)), el("span", null, O.rich(x.q))), el("div", { class: "qa-a" }, el("p", null, O.rich(x.a)))); })); }
  O.fetchJSON("data/srs.json").then(function (J) {
    var D = J[lang] || J.uz, S = D.project, P = D.defense, E = D.exam;
    main.appendChild(el("nav", { class: "toc", "aria-label": L.crumb },
      el("a", { href: "#project" }, L.toc[0]), el("a", { href: "#themes" }, L.toc[1]), el("a", { href: "#defense" }, L.toc[2]), el("a", { href: "#exam" }, L.toc[3])));
    main.appendChild(el("section", { class: "blk", id: "project" }, el("h2", null, S.title), el("p", { class: "lead" }, S.goal),
      el("h3", null, L.req), ul(S.requirements, "num"), el("h3", null, L.del), ul(S.deliverables), el("h3", null, L.rep), ul(S.report, "num"),
      el("p", null, el("b", null, L.sched), O.rich(S.schedule))));
    var myV = String(O.store.get("varSRS2", "") || "");
    var sel = el("select", { "aria-label": L.myVar }, el("option", { value: "" }, "—"), S.variants.map(function (v) { return el("option", { value: String(v.n), selected: String(v.n) === myV ? true : null }, L.variant + v.n); }));
    var vl = el("ol", { class: "variants" });
    function paint() {
      vl.innerHTML = "";
      S.variants.forEach(function (v) {
        var mine = String(v.n) === sel.value;
        vl.appendChild(el("li", { class: mine ? "mine" : null }, el("span", { class: "vn" }, String(v.n)),
          el("div", null, el("p", null, el("b", null, v.title + ". "), O.rich(v.text)),
            mine ? el("div", { class: "v-act" }, el("a", { class: "btn small", href: O.link("sandbox/") }, L.open),
              el("button", { class: "btn small run", type: "button", onclick: function () { Submit.open({ work: "SRS2", variant: v.n, code: O.store.get("sandbox:last", "") }); } }, L.submit)) : null)));
      });
    }
    sel.addEventListener("change", function () { O.store.set("varSRS2", sel.value); paint(); });
    paint();
    main.appendChild(el("section", { class: "blk", id: "themes" }, el("div", { class: "blk-h" }, el("h2", null, S.variantsTitle), el("label", { class: "var-pick" }, el("span", null, L.myVar + ": "), sel)), vl));
    main.appendChild(el("section", { class: "blk", id: "defense" }, el("h2", null, P.title), el("p", { class: "lead" }, P.goal),
      el("h3", null, L.proc), ul(P.procedure, "num"), el("h3", null, L.check), ul(P.checklist), el("h3", null, L.qs), qa(P.questions)));
    main.appendChild(el("section", { class: "blk", id: "exam" }, el("h2", null, E.title), el("p", { class: "muted" }, E.note),
      el("ol", { class: "exam" }, [].concat.apply([], E.groups.map(function (g) { return g.questions.map(function (q) { return el("li", null, el("a", { href: O.tpath("z", g.n), class: "muted small" }, L.lab + g.n), " ", O.rich(q)); }); })))));
    O.footer();
    if (location.hash && document.querySelector(location.hash)) document.querySelector(location.hash).scrollIntoView();
  }, function () { main.appendChild(el("p", { class: "note" }, L.loadErr)); O.footer(); });
})();
