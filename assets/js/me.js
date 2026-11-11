/* ME — talaba kabineti: ID va kiriş kodi bilan kiriş; şifrlangan kartoçkadan davomat va işlar holati. UZ/RU. */
(function () {
  "use strict";
  var O = window.OGL || window.KG, el = O.el, C = GHApi.C, I = O.I || { getLang: function () { return "uz"; } };
  var ru = I.getLang() === "ru";
  var T = ru ? {
    topics: "Темы", me: "Мой кабинет", h1: "Посещаемость и статус работ", code6: "6 символов",
    sid: "ID студента", code: "Код доступа", codeHint: "Код выдаёт преподаватель. Данные хранятся в зашифрованном виде: без кода их не прочитать.",
    login: "Войти", loading: "Загружаю…",
    none: "Карточка не найдена: преподаватель ещё не внёс вас в журнал или ID набран с ошибкой.",
    bad: "Неверный код доступа (или ID). Проверьте раскладку клавиатуры.",
    group: "Группа ", upd: ". Обновлено: ", locale: "ru-RU",
    att: "Посещаемость", was: "Был: ", late: ". Опоздал: ", abs: ". Не был: ",
    th: ["Занятие", "Дата", "Отметка"], noMarks: "Отметок пока нет.", minOn: " на ", min: " мин",
    works: "Работы", thw: ["Работа", "Вариант", "Статус", "Комментарий преподавателя"], noWorks: "Сданных работ пока нет.",
    ST: { p: ["был", "p"], l: ["опоздал", "l"], a: ["не был", "a"] },
    WS: { sent: "отправлено", accepted: "принято", rework: "на доработку" }
  } : {
    topics: "Mavzular", me: "Mening kabinetim", h1: "Davomat va işlar holati", code6: "6 ta belgi",
    sid: "Talaba ID si", code: "Kiriş kodi", codeHint: "Kodni öqituvçi beradi. Maʼlumotlar şifrlangan holda saqlanadi: kodsiz ularni öqib bölmaydi.",
    login: "Kiriş", loading: "Yuklanmoqda…",
    none: "Kartoçka topilmadi: öqituvçi sizni hali jurnalga kiritmagan yoki ID xato yozilgan.",
    bad: "Kiriş kodi (yoki ID) notöğri. Klaviatura tilini tekşiring.",
    group: "Guruh ", upd: ". Yangilangan: ", locale: "uz-UZ",
    att: "Davomat", was: "Kelgan: ", late: ". Keçikkan: ", abs: ". Kelmagan: ",
    th: ["Maşğulot", "Sana", "Belgi"], noMarks: "Hozirça belgilar yöq.", minOn: ", ", min: " daq",
    works: "Işlar", thw: ["Iş", "Variant", "Holat", "Öqituvçi izohi"], noWorks: "Hozirça topşirilgan işlar yöq.",
    ST: { p: ["kelgan", "p"], l: ["keçikkan", "l"], a: ["kelmagan", "a"] },
    WS: { sent: "yuborilgan", accepted: "qabul qilingan", rework: "qayta işlaşga" }
  };
  O.header("me", [{ text: T.topics, href: O.link("") }, { text: T.me }]);
  var main = el("main", { class: "wrap doc" }); document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" }, el("p", { class: "kicker" }, T.me), el("h1", null, T.h1)));
  var me = O.store.get("me", {});
  var id = el("input", { id: "me-id", value: me.id || "", autocomplete: "username", required: true });
  var code = el("input", { id: "me-code", type: "password", autocomplete: "current-password", required: true, placeholder: T.code6 });
  var msg = el("p", { class: "dlg-msg", role: "status" });
  var out = el("div");
  var form = el("form", { class: "login" },
    el("label", { class: "fld" }, el("span", null, T.sid), id),
    el("label", { class: "fld" }, el("span", null, T.code), code, el("small", null, T.codeHint)),
    el("button", { class: "btn run", type: "submit" }, T.login), msg);
  main.appendChild(form); main.appendChild(out);
  form.addEventListener("submit", function (e) {
    e.preventDefault(); msg.textContent = T.loading; msg.className = "dlg-msg"; out.innerHTML = "";
    var sid = id.value.trim(), sc = code.value.trim();
    C.studentFile(sid).then(GHApi.readPublic).then(function (box) {
      if (!box) throw new Error("none");
      return C.open(box, C.studentSecret(sid, sc), "ogl|" + sid.toLowerCase());
    }).then(function (card) {
      me.id = sid; O.store.set("me", me); msg.textContent = ""; render(card);
    }).catch(function (err) {
      msg.className = "dlg-msg bad";
      msg.textContent = err.message === "none" ? T.none : T.bad;
    });
  });
  function render(c) {
    out.appendChild(el("section", { class: "blk" }, el("h2", null, c.name || ("ID " + c.id)), el("p", { class: "muted" }, T.group + (c.group || "—") + T.upd + (c.updated ? new Date(c.updated).toLocaleString(T.locale) : "—"))));
    var sess = c.sessions || [];
    var cnt = { p: 0, l: 0, a: 0 }; sess.forEach(function (s) { if (cnt[s.s] !== undefined) cnt[s.s]++; });
    out.appendChild(el("section", { class: "blk" }, el("h2", null, T.att),
      el("p", null, T.was + cnt.p + T.late + cnt.l + T.abs + cnt.a + "."),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, T.th.map(function (h) { return el("th", null, h); }))),
        el("tbody", null, sess.length ? sess.map(function (s) { var t = T.ST[s.s] || ["—", ""]; return el("tr", null, el("td", null, s.label), el("td", null, s.date || "—"), el("td", null, el("span", { class: "mk mk-" + t[1] }, t[0] + (s.s === "l" && s.m ? T.minOn + s.m + T.min : "")))); }) : el("tr", null, el("td", { colspan: "3", class: "muted" }, T.noMarks)))))));
    var works = c.works || [];
    out.appendChild(el("section", { class: "blk" }, el("h2", null, T.works),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, T.thw.map(function (h) { return el("th", null, h); }))),
        el("tbody", null, works.length ? works.map(function (w) { return el("tr", null, el("td", null, w.url ? el("a", { href: w.url, target: "_blank", rel: "noopener" }, w.label) : w.label), el("td", null, w.variant || "—"), el("td", null, el("span", { class: "ws ws-" + w.status }, T.WS[w.status] || w.status)), el("td", null, w.comment || "")); }) : el("tr", null, el("td", { colspan: "4", class: "muted" }, T.noWorks)))))));
  }
  O.footer();
})();
