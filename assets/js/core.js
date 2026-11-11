/* CORE — «Kompyuter grafika» saytining umumiy ma'lumotlari va yordamçilari. UZ/RU tanlovi i18n orqali. */
(function (global) {
  "use strict";
  var src = document.currentScript && document.currentScript.src || "";
  var BASE = src.replace(/assets\/js\/core\.js.*$/, "");

  // 15 ta amaliy ish — UZ va RU sarlavhalari
  var TOPICS = [
    { k: 1,  uz: "Poligonal törlardan foydalanib 3 ölçovli obyekt yaratiş va almaştirişlarni amalga oşiriş",
             ru: "Полигональные сетки, геометрические преобразования в пространстве" },
    { k: 2,  uz: "Splayn egri çiziqlardan foydalanib tasvirlar yaratiş va rastr algoritmlari yordamida böyaş",
             ru: "Сплайновые кривые и растровое закрашивание" },
    { k: 3,  uz: "Splayn sirtlardan foydalanib 3 ölçovli obyekt yaratiş",
             ru: "Сплайновые поверхности и построение 3D-объектов" },
    { k: 4,  uz: "Kesma, aylana va ellipsni Brezenxeym algoritmi yordamida hosil qiliş",
             ru: "Алгоритмы Брезенхейма: отрезок, окружность, эллипс" },
    { k: 5,  uz: "3 ölçovli obyektlarni tasvirlaşda körinmas çiziq va sirtlarni olib taşlaş",
             ru: "Удаление невидимых линий и поверхностей" },
    { k: 6,  uz: "Böyaş usullaridan foydalanib uç ölçovli obyektlarni böyaş",
             ru: "Методы закраски 3D-объектов: плоская, Гуро, Фонг" },
    { k: 7,  uz: "OpenGL yordamida geometrik obyektlarni çiziş",
             ru: "OpenGL: рисование геометрических объектов" },
    { k: 8,  uz: "OpenGL yordamida geometrik obyektlarga materiallar va yorugʻlik beriş",
             ru: "OpenGL: материалы и освещение" },
    { k: 9,  uz: "OpenGL yordamida obyektlarni yaratish usullari va optimallaştiriş",
             ru: "OpenGL: оптимизация и организация приложения" },
    { k: 10, uz: "Fraktal grafikasi asosida tasvir şakllarini yaratiş",
             ru: "Фракталы: Мандельброта, Жюлиа, Серпинского" },
    { k: 11, uz: "Fazoda harakatlarni vizuallaştiriş",
             ru: "Визуализация движения в пространстве" },
    { k: 12, uz: "Maşina detallari dizaynini yaratiş",
             ru: "Дизайн машиностроительных деталей" },
    { k: 13, uz: "Binolar dizaynini modellaştiriş",
             ru: "Моделирование зданий" },
    { k: 14, uz: "Landşaft dizaynini yaratiş. Obyektlar harakati",
             ru: "Ландшафт и анимация объектов" },
    { k: 15, uz: "Fraktal grafikasi asosida murakkab tasvirlar va L-tizimlari",
             ru: "Сложные фракталы и L-системы" }
  ];
  // SRS va SRSP (hali ishlanadi)
  var SRSP = [
    { n: 1, after: 3, uz: "SRS 1 boʻyiça nazorat ishi", ru: "Контрольная работа по СРС 1" },
    { n: 2, after: 8, uz: "SRS 1 ni qabul va himoya", ru: "Прием и защита СРС 1" },
    { n: 3, after: 15, uz: "Yakuniy imtihondan oldin konsultatsiya", ru: "Консультация перед итоговым экзаменом" }
  ];

  var CFG = global.KG_CONFIG || global.OGL_CONFIG || {};
  var REPO = CFG.repo || "Masterpure-rgb/KG";

  var I = global.I || { t: function (k) { return k; }, getLang: function () { return "uz"; }, setLang: function () {}, toggle: function () {} };

  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k]; if (v == null || v === false) continue;
      if (k === "class") e.className = v; else if (k === "html") e.innerHTML = v; else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") e.addEventListener(k.slice(2), v);
      else if (k === "style" && typeof v === "object") Object.assign(e.style, v); else e.setAttribute(k, v === true ? "" : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x != null && x !== false) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return e;
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("kg:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("kg:" + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem("kg:" + k); } catch (e) {} }
  };
  function topic(k) { return TOPICS.filter(function (t) { return t.k === +k; })[0]; }
  function topicName(k) { var t = topic(k); if (!t) return ""; return I.getLang() === "ru" ? t.ru : t.uz; }
  function tpath(kind, k) { return link(kind + "/" + k + "/"); }
  function link(path) { return BASE + path; }
  function fetchJSON(path) { return fetch(BASE + path, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(msg, kind) {
    var t = el("div", { class: "toast " + (kind || ""), role: "status" }, msg);
    document.body.appendChild(t); requestAnimationFrame(function () { t.classList.add("in"); });
    setTimeout(function () { t.classList.remove("in"); setTimeout(function () { t.remove(); }, 300); }, 3200);
  }
  var IDENT = /((?:glut|glu|gl)[A-Z]\w*\*?|(?:GLUT|GLU|GL)_[A-Z0-9_]+\*?|stbi_\w+|`[^`]+`)/;
  function rich(text) {
    return String(text == null ? "" : text).split(IDENT).map(function (part, i) {
      if (!(i % 2)) return part;
      return el("code", null, part.charAt(0) === "`" ? part.slice(1, -1) : part);
    }).filter(function (x) { return x !== ""; });
  }
  function loadScript(path) { return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = BASE + path; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }

  // Til almaştirgich — har sahifada körinadi
  function langToggle() {
    var cur = I.getLang();
    return el("div", { class: "lang-switch", role: "group", "aria-label": I.t("lang.switch") },
      el("button", {
        class: "lang-btn" + (cur === "uz" ? " on" : ""),
        type: "button",
        "aria-pressed": cur === "uz",
        onclick: function () { I.setLang("uz"); }
      }, "OʻZ"),
      el("button", {
        class: "lang-btn" + (cur === "ru" ? " on" : ""),
        type: "button",
        "aria-pressed": cur === "ru",
        onclick: function () { I.setLang("ru"); }
      }, "RUS")
    );
  }

  function header(active, crumbs) {
    var nav = el("nav", { class: "nav", "aria-label": I.t("nav.topics") },
      el("a", { href: link(""), class: active === "home" ? "on" : null }, I.t("nav.topics")),
      el("a", { href: link("sandbox/"), class: active === "sandbox" ? "on" : null }, I.t("nav.sandbox")),
      el("a", { href: link("srsp/"), class: active === "srsp" ? "on" : null }, I.t("nav.srsp")),
      el("a", { href: link("me/"), class: active === "me" ? "on" : null }, I.t("nav.me")));
    var h = el("header", { class: "top" },
      el("a", { class: "brand", href: link(""), "aria-label": I.t("brand.name") },
        el("span", { class: "mark", "aria-hidden": "true" }, "KG"),
        el("span", { class: "bt" }, el("b", null, I.t("brand.name")), el("span", null, I.t("brand.sub")))),
      nav,
      langToggle());
    document.body.insertBefore(h, document.body.firstChild);
    if (crumbs && crumbs.length) {
      var c = el("div", { class: "crumbs" }); crumbs.forEach(function (x, i) { if (i) c.appendChild(el("span", { class: "sep", "aria-hidden": "true" }, "/")); c.appendChild(x.href ? el("a", { href: x.href }, x.text) : el("span", null, x.text)); });
      h.after(c);
    }
    return h;
  }
  function footer() {
    var langNow = I.getLang();
    var cite = langNow === "ru"
      ? "Ф.М. Нуралиев, С.Н. Ибодуллаев. Компьютерная графика: методическое указание к практическим занятиям. Ташкентский университет информационных технологий имени Мухаммада аль-Хорезми, 2026."
      : "F.M. Nuraliyev, S.N. Ibodullayev. Kompyuter grafika: amaliy maşğulotlarni bajariş uçun uslubiy körsatma. Muhammad al-Xorazmiy nomidagi Toşkent axborot texnologiyalari universiteti, 2026.";
    var f = el("footer", { class: "foot" },
      el("p", null, cite),
      el("p", null,
        el("a", { href: link("metodichka/KG_uslubiy_korsatma_2026.docx"), download: "" }, I.t("footer.doc")),
        el("a", { href: link("help/") }, I.t("footer.submit"))));
    document.body.appendChild(f);
  }
  function trio(k, active) {
    function a(kind, href, label, sub) { return el("a", { href: href, class: "tri" + (active === kind ? " on" : "") }, el("b", null, label), el("span", null, sub)); }
    var langNow = I.getLang();
    return el("nav", { class: "trio", "aria-label": "A" + k },
      a("e", tpath("e", k), I.t("home.explain"), langNow === "ru" ? "≈2 минуты, аудио" : "≈2 daqiqa, audio"),
      a("l", tpath("l", k), I.t("home.practice"), langNow === "ru" ? "код и окно OpenGL" : "kod va OpenGL oynasi"),
      a("z", tpath("z", k), I.t("home.tasks"), langNow === "ru" ? "варианты, сдача" : "variantlar, topşiriş"));
  }

  global.KG = { BASE: BASE, TOPICS: TOPICS, SRSP: SRSP, REPO: REPO, CFG: CFG, I: I,
    el: el, rich: rich, $: $, $$: $$, store: store, topic: topic, topicName: topicName, k: function (k) { return k; }, tpath: tpath, link: link, fetchJSON: fetchJSON, esc: esc, toast: toast, loadScript: loadScript,
    header: header, footer: footer, trio: trio, langToggle: langToggle };
  // Orqaga mos kelish uchun OGL ham mavjud bo'lsin
  global.OGL = global.KG;
})(window);
