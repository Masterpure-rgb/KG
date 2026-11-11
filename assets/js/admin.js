/* ADMIN — панель преподавателя: студенты и коды доступа, посещаемость, сданные работы (GitHub Issues),
   сводная ведомость; журнал хранится в репозитории в зашифрованном виде и сохраняется одним коммитом. */
(function () {
  "use strict";
  var O = window.OGL, el = O.el, C = GHApi.C;
  var LANG = (O.I && O.I.getLang && O.I.getLang()) === "ru" ? "ru" : "uz";
  var UZ = {"принято": "qabul qilingan", "на доработку": "qayta işlaşga", "Темы": "Mavzular", "Преподавателю": "Öqituvçiga", "Панель преподавателя": "Öqituvçi paneli", "Журнал модуля 2": "Guruh jurnali", "Логин": "Login", "Пароль": "Parol", "Войти": "Kiriş", "Проверяю…": "Tekşirilmoqda…", "Администратор ещё не подключил панель к GitHub.": "Administrator panelni hali GitHub ga ulamagan.", "Неверный логин или пароль.": "Login yoki parol notöğri.", "Срок доступа к GitHub истёк: администратору нужно войти и подключить панель заново.": "GitHub ga kiriş muddati tugagan: administrator kirib, panelni qayta ulaşi kerak.", "Подключаюсь к GitHub…": "GitHub ga ulanmoqda…", "У токена GitHub нет права записи: администратору нужно подключить панель заново.": "GitHub tokenida yoziş huquqi yöq: administrator panelni qayta ulaşi kerak.", "Журнал не открывается этой учётной записью.": "Jurnal bu hisob bilan oçilmaydi.", "Ф.М. Нуралиев": "F.M. Nuraliyev", "Подключение к GitHub": "GitHub ga ulaş", "Выполняется один раз. Токен сохраняется в зашифрованном виде; после этого все преподаватели входят только по логину и паролю.": "Bir marta bajariladi. Token şifrlangan holda saqlanadi; şundan keyin barça öqituvçilar faqat login va parol bilan kiradi.", "Токен доступа GitHub": "GitHub kiriş tokeni", "GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Repository access: Only select repositories → репозиторий курса. Permissions: Contents — Read and write, Issues — Read and write.": "GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Repository access: Only select repositories → kurs repozitoriysi. Permissions: Contents — Read and write, Issues — Read and write.", "Подключить": "Ulaş", "Проверяю токен…": "Token tekşirilmoqda…", "У токена нет права записи в репозиторий.": "Tokenda repozitoriyga yoziş huquqi yöq.", "Панель преподавателя: подключение к GitHub": "Öqituvçi paneli: GitHub ga ulaş", "Токен не принят GitHub.": "GitHub tokenni qabul qilmadi.", "Есть несохранённые изменения": "Saqlanmagan özgarişlar bor", "Сохранено": "Saqlandi", "Сохранить в GitHub": "GitHub ga saqlaş", "Студенты": "Talabalar", "Посещаемость": "Davomat", "Сданные работы": "Topşirilgan işlar", "Сводная ведомость": "Yiğma qaydnoma", "Учётные записи": "Hisoblar", " (администратор)": " (administrator)", "Есть несохранённые изменения. Выйти без сохранения?": "Saqlanmagan özgarişlar bor. Saqlamasdan çiqilsinmi?", "Выйти": "Çiqiş", "ID;Фамилия Имя;Группа;GitHub-логин — по одному студенту в строке (можно вставить из Excel)": "ID;Familiya Ism;Guruh;GitHub-login — har qatorda bitta talaba (Excel dan qöyiş mumkin)", "Добавить студентов": "Talabalarni qöşiş", "Добавить": "Qöşiş", "Разделитель — точка с запятой, запятая или табуляция. Существующие ID обновляются.": "Ajratuvçi — nuqtali vergul, vergul yoki tabulyatsiya. Mavjud ID lar yangilanadi.", "Выдать новый код доступа студенту ": "Talabaga yangi kiriş kodi berilsinmi: ", "? Старый перестанет работать.": "? Eskisi işlamay qoladi.", "новый код": "yangi kod", "Удалить студента ": "Talaba ", " из журнала?": " jurnaldan öçirilsinmi?", "удалить": "öçiriş", "Список (": "Röyxat (", "Скрыть коды": "Kodlarni yaşiriş", "Показать коды": "Kodlarni körsatiş", "Выдано кодов: ": "Berilgan kodlar: ", "Выдать недостающие коды": "Yetişmagan kodlarni beriş", "Скачать коды (CSV)": "Kodlarni yuklab oliş (CSV)", "ФИО": "F.I.Ş.", "Группа": "Guruh", "Код доступа": "Kiriş kodi", "Добавлено/обновлено: ": "Qöşildi/yangilandi: ", "ID;ФИО;Группа;Код доступа\n": "ID;F.I.Ş.;Guruh;Kiriş kodi\n", "Все группы": "Barça guruhlar", "Занятие ": "Maşğulot ", "Группа ": "Guruh ", "Дата ": "Sana ", "Остальных — «был»": "Qolganlar — «kelgan»", "Минут опоздания": "Keçikiş daqiqalari", "был": "kelgan", "опоздал": "keçikkan", "не был": "kelmagan", " мин": " daq", "сбросить": "bekor qiliş", "Студент": "Talaba", "Отметка": "Belgi", "Опоздание": "Keçikiş", "Загружаю…": "Yuklanmoqda…", "Загрузить сдачи с GitHub": "Topşirişlarni GitHub dan yuklaş", "Обновить": "Yangilaş", "Все работы": "Barça işlar", "Все статусы": "Barça holatlar", "Отправлено": "Yuborilgan", "На доработку": "Qayta işlaşga", "Принято": "Qabul qilingan", "Нажмите «Загрузить сдачи с GitHub».": "«Topşirişlarni GitHub dan yuklaş» tugmasini bosing.", "» нет в списке": "» röyxatda yöq", "отправил @": "yuborgan @", ", в списке @": ", röyxatda @", "отправлено": "yuborilgan", "запустить код": "kodni işga tuşiriş", "Принять": "Qabul qiliş", "Показано: ": "Körsatilgan: ", " из ": " / ", ". Решение сразу пишется комментарием в обращение на GitHub; статусы в кабинетах студентов обновятся после «Сохранить в GitHub».": ". Qaror darhol GitHub dagi murojaatga izoh bölib yoziladi; talabalar kabinetidagi holatlar «GitHub ga saqlaş» dan keyin yangilanadi.", "Дата": "Sana", "Работа": "Iş", "Вариант": "Variant", "Статус": "Holat", "Комментарий к принятой работе (можно оставить пустым):": "Qabul qilingan işga izoh (boş qoldiriş mumkin):", "Что нужно исправить?": "Nimani tuzatiş kerak?", "**Принято.**": "**Qabul qilindi.** / **Принято.**", "**На доработку.**": "**Qayta işlaşga.** / **На доработку.**", "Готово: #": "Tayyor: #", ", вариант ": ", variant ", "Закрыть": "Yopiş", "Логин: ": "Login: ", "\nПароль: ": "\nParol: ", "\n\nЗапишите пароль: в системе он не хранится в открытом виде.": "\n\nParolni yozib oling: tizimda u oçiq holda saqlanmaydi.", "администратор": "administrator", "преподаватель": "öqituvçi", "Новый пароль (не короче 10 символов):": "Yangi parol (kamida 10 belgi):", "Пароль слишком короткий.": "Parol juda qisqa.", "Повторите новый пароль:": "Yangi parolni takrorlang:", "Пароли не совпадают.": "Parollar mos emas.", "Учётная запись: смена пароля": "Hisob: parolni almaştiriş", "Пароль изменён. Новый пароль действует через 1–2 минуты.": "Parol özgartirildi. Yangi parol 1–2 daqiqadan keyin kuçga kiradi.", "сменить мой пароль": "parolimni almaştiriş", "Выдать новый пароль для «": "«", "»? Старый перестанет действовать.": "» uçun yangi parol berilsinmi? Eskisi amal qilmay qoladi.", "Учётная запись: новый пароль": "Hisob: yangi parol", "новый пароль": "yangi parol", "Удалить учётную запись «": "«", "Учётная запись: удаление": "Hisob: öçiriş", "Учётная запись удалена.": "Hisob öçirildi.", "логин латиницей": "login lotinçada", "Преподаватель видит студентов, посещаемость, сданные работы и ведомость. Администратор, кроме того, управляет учётными записями.": "Öqituvçi talabalar, davomat, topşirilgan işlar va qaydnomani köradi. Administrator bundan taşqari hisoblarni boşqaradi.", "Роль": "Rol", "Добавить учётную запись": "Hisob qöşiş", "Логин: 3–32 латинские буквы, цифры, точка, дефис.": "Login: 3–32 ta lotin harfi, raqam, nuqta, defis.", "Такой логин уже есть.": "Bunday login allaqaçon bor.", "Учётная запись: добавление": "Hisob: qöşiş", "Создать": "Yaratiş", "н": "y", "+ был, 5′ опоздал на 5 минут, н — не был; ✓ принято, ↺ на доработку, • отправлено": "+ kelgan, 5′ 5 daqiqa keçikkan, y — kelmagan; ✓ qabul qilingan, ↺ qayta işlaşga, • yuborilgan", "Скачать CSV": "CSV ni yuklab oliş", "опоздал ": "keçikkan ", "Сохраняю…": "Saqlanmoqda…", "Журнал: обновление ": "Jurnal: yangilaş ", "Журнал сохранён в GitHub. Кабинеты студентов обновятся через 1–2 минуты.": "Jurnal GitHub ga saqlandi. Talabalar kabinetlari 1–2 daqiqada yangilanadi.", "Ошибка: ": "Xato: "};
  var R = function (t) { return LANG === "uz" && UZ[t] !== undefined ? UZ[t] : t; };
  O.header("admin", [{ text: R("Темы"), href: O.link("") }, { text: R("Преподавателю") }]);
  var main = el("main", { class: "wrap wide doc admin" }); document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" }, el("p", { class: "kicker" }, R("Панель преподавателя")), el("h1", null, R("Журнал модуля 2"))));
  var gh = null, pass = null, J = null, sha = null, dirty = false, issues = null;
  var WLABEL = {}; O.WORKS.forEach(function (w) { WLABEL[w.id] = w.label; });
  var SLABEL = {}; O.SESSIONS.forEach(function (s) { SLABEL[s.id] = s.label; });
  function workId(label) { var f = O.WORKS.filter(function (w) { return label && (label === w.label || label.indexOf(w.label.split(" — ")[0]) === 0); })[0]; return f ? f.id : ""; }

  /* ---------------- вход: логин и пароль ----------------
     data/acc/<хеш логина>.json — учётная запись {login, name, role, K}, зашифрована паролем;
     data/vault.json — токен GitHub, зашифрован общим ключом K; data/journal.json — журнал, ключ K. */
  var me = null;
  var ACC = {
    file: function (login) { return C.sha("ogl-acc|" + String(login).trim().toLowerCase()).then(function (h) { return "data/acc/" + h.slice(0, 24) + ".json"; }); },
    salt: function (login) { return "ogl-acc|" + String(login).trim().toLowerCase(); }
  };
  function newPassword() {
    var A = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = crypto.getRandomValues(new Uint8Array(12)), s = "";
    for (var i = 0; i < 12; i++) s += (i && i % 4 === 0 ? "-" : "") + A[r[i] % A.length];
    return s;
  }
  var loginIn = el("input", { autocomplete: "username", value: O.store.get("adm", "") || "", required: true });
  var pwIn = el("input", { type: "password", autocomplete: "current-password", required: true });
  var msg = el("p", { class: "dlg-msg", role: "status" });
  var login = el("form", { class: "login" },
    el("label", { class: "fld" }, el("span", null, R("Логин")), loginIn),
    el("label", { class: "fld" }, el("span", null, R("Пароль")), pwIn),
    el("button", { class: "btn run", type: "submit" }, R("Войти")), msg);
  main.appendChild(login);
  var app = el("div", { hidden: true }); main.appendChild(app);
  function fail(t) { msg.className = "dlg-msg bad"; msg.textContent = t; }
  login.addEventListener("submit", function (e) {
    e.preventDefault(); msg.className = "dlg-msg"; msg.textContent = R("Проверяю…");
    var lg = loginIn.value.trim(), pw = pwIn.value;
    ACC.file(lg).then(GHApi.readPublic).then(function (box) {
      if (!box) throw new Error("bad");
      return C.open(box, pw, ACC.salt(lg)).catch(function () { throw new Error("bad"); });
    }).then(function (acc) {
      me = acc; pass = acc.K; O.store.set("adm", lg); pwIn.value = "";
      return GHApi.readPublic("data/vault.json").then(function (v) { return v ? C.open(v, pass).catch(function () { return null; }) : null; });
    }).then(function (vault) {
      if (vault && vault.token) return connect(vault.token);
      if (me.role === "admin") { login.hidden = true; askToken(); return; }
      throw new Error(R("Администратор ещё не подключил панель к GitHub."));
    }).catch(function (err) {
      if (err.message === "bad") fail(R("Неверный логин или пароль."));
      else if (err.status === 401 && me && me.role === "admin") { msg.textContent = ""; login.hidden = true; askToken(); }   // срок токена истёк — подключить заново
      else fail(err.status === 401 ? R("Срок доступа к GitHub истёк: администратору нужно войти и подключить панель заново.") : err.message);
    });
  });
  function connect(token) {
    msg.className = "dlg-msg"; msg.textContent = R("Подключаюсь к GitHub…");
    gh = new GHApi.GH(token, O.REPO);
    return gh.repoInfo().then(function (r) {
      if (!r.permissions || !r.permissions.push) throw new Error(R("У токена GitHub нет права записи: администратору нужно подключить панель заново."));
      return gh.getFile("data/journal.json");
    }).then(function (f) {
      if (!f) {
        J = { v: 1, students: [], sessions: {}, works: {}, files: [], accounts: [], updated: null }; sha = null; dirty = true;
        return seedAccounts();
      }
      sha = f.sha;
      return C.open(JSON.parse(f.text), pass).then(function (j) { J = j; J.accounts = J.accounts || []; }, function () { throw new Error(R("Журнал не открывается этой учётной записью.")); });
    }).then(function () {
      if (!J.accounts.some(function (a) { return a.login === me.login; })) { J.accounts.push({ login: me.login, name: me.name || "", role: me.role }); dirty = true; }
      login.hidden = true; app.hidden = false; build();
    });
  }
  function seedAccounts() { // учётные записи, созданные при настройке сайта
    J.accounts = [{ login: me.login, name: me.name || "", role: me.role }];
    return ACC.file("nuraliyev").then(GHApi.readPublic).then(function (b) { if (b && me.login !== "nuraliyev") J.accounts.push({ login: "nuraliyev", name: R("Ф.М. Нуралиев"), role: "teacher" }); });
  }
  function askToken() { // один раз: администратор подключает панель к репозиторию
    var tok = el("input", { type: "password", autocomplete: "off", placeholder: "github_pat_…", required: true });
    var m2 = el("p", { class: "dlg-msg", role: "status" });
    var f = el("form", { class: "login wide" },
      el("h2", null, R("Подключение к GitHub")),
      el("p", null, R("Выполняется один раз. Токен сохраняется в зашифрованном виде; после этого все преподаватели входят только по логину и паролю.")),
      el("label", { class: "fld" }, el("span", null, R("Токен доступа GitHub")), tok,
        el("small", null, R("GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Repository access: Only select repositories → репозиторий курса. Permissions: Contents — Read and write, Issues — Read and write."))),
      el("button", { class: "btn run", type: "submit" }, R("Подключить")), m2);
    main.insertBefore(f, app);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); m2.className = "dlg-msg"; m2.textContent = R("Проверяю токен…");
      var g = new GHApi.GH(tok.value.trim(), O.REPO);
      g.repoInfo().then(function (r) {
        if (!r.permissions || !r.permissions.push) throw new Error(R("У токена нет права записи в репозиторий."));
        return C.seal({ token: tok.value.trim(), at: new Date().toISOString() }, pass);
      }).then(function (box) { return g.commit([{ path: "data/vault.json", text: JSON.stringify(box) }], R("Панель преподавателя: подключение к GitHub")); })
        .then(function () { f.remove(); return connect(tok.value.trim()); })
        .catch(function (err) { m2.className = "dlg-msg bad"; m2.textContent = err.status === 401 ? R("Токен не принят GitHub.") : err.message; });
    });
  }
  function sealAccount(acc, password) {
    return Promise.all([ACC.file(acc.login), C.seal(acc, password, ACC.salt(acc.login))]).then(function (r) { return { path: r[0], text: JSON.stringify(r[1]) }; });
  }

  /* ---------------- интерфейс ---------------- */
  var saveBtn, saveMsg, tabs, panes = {};
  function setDirty(v) { dirty = v; saveMsg.textContent = v ? R("Есть несохранённые изменения") : R("Сохранено"); saveMsg.className = "save-msg " + (v ? "warn" : "ok"); }
  function build() {
    saveMsg = el("span", { class: "save-msg" });
    saveBtn = el("button", { class: "btn run", type: "button", onclick: save }, R("Сохранить в GitHub"));
    tabs = el("div", { class: "atabs", role: "tablist" });
    var bar = el("div", { class: "abar" }, tabs, el("span", { class: "grow" }), saveMsg, saveBtn);
    app.appendChild(bar);
    var T = [["students", R("Студенты")], ["att", R("Посещаемость")], ["works", R("Сданные работы")], ["sum", R("Сводная ведомость")]];
    if (me.role === "admin") T.push(["acc", R("Учётные записи")]);
    bar.appendChild(el("span", { class: "muted small" }, (me.name || me.login) + (me.role === "admin" ? R(" (администратор)") : "")));
    bar.appendChild(el("button", { class: "btn ghost", type: "button", onclick: function () { if (!dirty || confirm(R("Есть несохранённые изменения. Выйти без сохранения?"))) { dirty = false; location.reload(); } } }, R("Выйти")));
    T.forEach(function (t, i) {
      var b = el("button", { type: "button", role: "tab", onclick: function () { show(t[0]); } }, t[1]); b.dataset.t = t[0]; tabs.appendChild(b);
      panes[t[0]] = el("section", { class: "apane", hidden: true }); app.appendChild(panes[t[0]]);
    });
    window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
    setDirty(dirty); show("students");
  }
  function show(t) {
    O.$$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.t === t ? "true" : "false"); });
    for (var k in panes) panes[k].hidden = k !== t;
    ({ students: renderStudents, att: renderAtt, works: renderWorks, sum: renderSum, acc: renderAcc })[t]();
  }
  function groups() { var g = {}; J.students.forEach(function (s) { g[s.group || "—"] = 1; }); return Object.keys(g).sort(); }
  function byGroup(sel) { return J.students.filter(function (s) { return !sel || sel === "*" || (s.group || "—") === sel; }).sort(function (a, b) { return (a.group || "").localeCompare(b.group || "") || (a.name || "").localeCompare(b.name || "", "ru"); }); }
  function student(id) { return J.students.filter(function (s) { return String(s.id).toLowerCase() === String(id).trim().toLowerCase(); })[0]; }

  /* студенты */
  var showCodes = false;
  function renderStudents() {
    var P = panes.students; P.innerHTML = "";
    var imp = el("textarea", { rows: 5, class: "mono", placeholder: R("ID;Фамилия Имя;Группа;GitHub-логин — по одному студенту в строке (можно вставить из Excel)") });
    P.appendChild(el("div", { class: "acard" }, el("h2", null, R("Добавить студентов")), imp,
      el("div", { class: "row" }, el("button", { class: "btn", type: "button", onclick: function () { importRows(imp.value); imp.value = ""; } }, R("Добавить")),
        el("span", { class: "muted small" }, R("Разделитель — точка с запятой, запятая или табуляция. Существующие ID обновляются.")))));
    var tb = el("tbody");
    byGroup("*").forEach(function (s) {
      function inp(f, w) { var x = el("input", { value: s[f] || "", style: w ? "width:" + w : null }); x.addEventListener("change", function () { s[f] = x.value.trim(); setDirty(true); }); return x; }
      tb.appendChild(el("tr", null, el("td", { class: "mono" }, s.id), el("td", null, inp("name")), el("td", null, inp("group", "8em")), el("td", null, inp("gh", "10em")),
        el("td", { class: "mono" }, showCodes ? (s.code || "—") : (s.code ? "••••••" : "—")),
        el("td", null, el("button", { class: "linkbtn", type: "button", onclick: function () { if (confirm(R("Выдать новый код доступа студенту ") + s.id + R("? Старый перестанет работать."))) { s.code = C.newCode(); setDirty(true); renderStudents(); } } }, R("новый код")), " ",
          el("button", { class: "linkbtn danger", type: "button", onclick: function () { if (confirm(R("Удалить студента ") + s.id + R(" из журнала?"))) { J.students = J.students.filter(function (x) { return x !== s; }); setDirty(true); renderStudents(); } } }, R("удалить")))));
    });
    P.appendChild(el("div", { class: "acard" },
      el("div", { class: "row" }, el("h2", null, R("Список (") + J.students.length + ")"), el("span", { class: "grow" }),
        el("button", { class: "btn ghost", type: "button", onclick: function () { showCodes = !showCodes; renderStudents(); } }, showCodes ? R("Скрыть коды") : R("Показать коды")),
        el("button", { class: "btn ghost", type: "button", onclick: function () { var n = 0; J.students.forEach(function (s) { if (!s.code) { s.code = C.newCode(); n++; } }); if (n) setDirty(true); O.toast(R("Выдано кодов: ") + n, "good"); renderStudents(); } }, R("Выдать недостающие коды")),
        el("button", { class: "btn ghost", type: "button", onclick: exportCodes }, R("Скачать коды (CSV)"))),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, ["ID", R("ФИО"), R("Группа"), "GitHub", R("Код доступа"), ""].map(function (h) { return el("th", null, h); }))), tb))));
  }
  function importRows(text) {
    var n = 0;
    text.split(/\r?\n/).forEach(function (line) {
      if (!line.trim()) return;
      var p = line.split(/\t|;|,/).map(function (x) { return x.trim(); });
      if (!p[0] || /^id$/i.test(p[0])) return;
      var s = student(p[0]);
      if (!s) { s = { id: p[0], code: C.newCode() }; J.students.push(s); }
      if (p[1]) s.name = p[1]; if (p[2]) s.group = p[2]; if (p[3]) s.gh = p[3].replace(/^@/, "");
      n++;
    });
    if (n) setDirty(true); O.toast(R("Добавлено/обновлено: ") + n, "good"); renderStudents();
  }
  function download(name, text, type) { var a = el("a", { href: URL.createObjectURL(new Blob(["﻿" + text], { type: type || "text/csv;charset=utf-8" })), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 300); }
  function exportCodes() { download("kody_dostupa.csv", R("ID;ФИО;Группа;Код доступа\n") + byGroup("*").map(function (s) { return [s.id, s.name || "", s.group || "", s.code || ""].join(";"); }).join("\n")); }

  /* посещаемость */
  var attSess = "L11", attGroup = "*";
  function renderAtt() {
    var P = panes.att; P.innerHTML = "";
    var S = J.sessions[attSess] = J.sessions[attSess] || { date: "", marks: {} };
    var ss = el("select", null, O.SESSIONS.map(function (s) { return el("option", { value: s.id, selected: s.id === attSess ? true : null }, s.label); }));
    ss.addEventListener("change", function () { attSess = ss.value; renderAtt(); });
    var gs = el("select", null, el("option", { value: "*" }, R("Все группы")), groups().map(function (g) { return el("option", { value: g, selected: g === attGroup ? true : null }, g); }));
    gs.addEventListener("change", function () { attGroup = gs.value; renderAtt(); });
    var date = el("input", { type: "date", value: S.date || new Date().toISOString().slice(0, 10) });
    if (!S.date) { S.date = date.value; }
    date.addEventListener("change", function () { S.date = date.value; setDirty(true); });
    var list = byGroup(attGroup);
    P.appendChild(el("div", { class: "acard" }, el("div", { class: "row" }, el("label", null, R("Занятие "), ss), el("label", null, R("Группа "), gs), el("label", null, R("Дата "), date), el("span", { class: "grow" }),
      el("button", { class: "btn ghost", type: "button", onclick: function () { list.forEach(function (s) { if (!S.marks[s.id]) S.marks[s.id] = { s: "p" }; }); setDirty(true); renderAtt(); } }, R("Остальных — «был»")))));
    var tb = el("tbody");
    list.forEach(function (s) {
      var m = S.marks[s.id] || {};
      function b(code, label) { return el("button", { type: "button", class: "mkb mk-" + code + (m.s === code ? " on" : ""), "aria-pressed": m.s === code ? "true" : "false", onclick: function () { S.marks[s.id] = { s: code, m: code === "l" ? (m.m || 5) : undefined }; setDirty(true); renderAtt(); } }, label); }
      var mins = el("input", { type: "number", min: "1", max: "90", value: m.s === "l" ? (m.m || 5) : "", disabled: m.s === "l" ? null : true, style: "width:4.5em", "aria-label": R("Минут опоздания") });
      mins.addEventListener("change", function () { if (S.marks[s.id]) { S.marks[s.id].m = Math.max(1, +mins.value || 1); setDirty(true); } });
      tb.appendChild(el("tr", null, el("td", null, s.name || s.id), el("td", { class: "muted" }, s.group || ""), el("td", { class: "mkrow" }, b("p", R("был")), b("l", R("опоздал")), b("a", R("не был"))), el("td", null, mins, R(" мин")),
        el("td", null, m.s ? el("button", { class: "linkbtn", type: "button", onclick: function () { delete S.marks[s.id]; setDirty(true); renderAtt(); } }, R("сбросить")) : null)));
    });
    P.appendChild(el("div", { class: "acard" }, el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, [R("Студент"), R("Группа"), R("Отметка"), R("Опоздание"), ""].map(function (h) { return el("th", null, h); }))), tb))));
  }

  /* сданные работы */
  var wFilter = { work: "", status: "", group: "*" };
  function renderWorks() {
    var P = panes.works; P.innerHTML = "";
    var load = el("button", { class: "btn", type: "button", onclick: function () { load.disabled = true; load.textContent = R("Загружаю…"); fetchIssues().then(function () { renderWorks(); }, function (e) { O.toast("GitHub: " + e.message, "bad"); load.disabled = false; load.textContent = R("Загрузить сдачи с GitHub"); }); } }, issues ? R("Обновить") : R("Загрузить сдачи с GitHub"));
    var wsel = el("select", null, el("option", { value: "" }, R("Все работы")), O.WORKS.map(function (w) { return el("option", { value: w.id, selected: w.id === wFilter.work ? true : null }, w.label.split(" — ")[0]); }));
    var ssel = el("select", null, [["", R("Все статусы")], ["sent", R("Отправлено")], ["rework", R("На доработку")], ["accepted", R("Принято")]].map(function (x) { return el("option", { value: x[0], selected: x[0] === wFilter.status ? true : null }, x[1]); }));
    var gsel = el("select", null, el("option", { value: "*" }, R("Все группы")), groups().map(function (g) { return el("option", { value: g, selected: g === wFilter.group ? true : null }, g); }));
    [wsel, ssel, gsel].forEach(function (s, i) { s.addEventListener("change", function () { wFilter[["work", "status", "group"][i]] = s.value; renderWorks(); }); });
    P.appendChild(el("div", { class: "acard" }, el("div", { class: "row" }, load, wsel, ssel, gsel, el("span", { class: "grow" }))));
    if (!issues) { P.appendChild(el("p", { class: "muted" }, R("Нажмите «Загрузить сдачи с GitHub»."))); return; }
    var rows = issues.filter(function (x) {
      var w = J.works[x.number] || {}, st = w.status || "sent", s = student(x.f.student);
      return (!wFilter.work || x.wid === wFilter.work) && (!wFilter.status || st === wFilter.status) && (wFilter.group === "*" || (s && (s.group || "—") === wFilter.group));
    });
    var tb = el("tbody");
    rows.forEach(function (x) {
      var w = J.works[x.number] || { status: "sent" }, s = student(x.f.student);
      var who = s ? el("span", null, s.name || s.id, el("small", { class: "muted" }, " " + s.id + (s.group ? ", " + s.group : ""))) : el("span", { class: "warn-t" }, "ID «" + x.f.student + R("» нет в списке"));
      var ghWarn = s && s.gh && x.user && s.gh.toLowerCase() !== x.user.toLowerCase() ? el("div", { class: "warn-t small" }, R("отправил @") + x.user + R(", в списке @") + s.gh) : null;
      tb.appendChild(el("tr", null,
        el("td", { class: "mono small" }, new Date(x.created).toLocaleDateString("ru-RU")),
        el("td", null, who, ghWarn), el("td", null, (WLABEL[x.wid] || x.f.work).split(" — ")[0]), el("td", null, x.f.variant || "—"),
        el("td", null, el("span", { class: "ws ws-" + w.status }, { sent: R("отправлено"), accepted: R("принято"), rework: R("на доработку") }[w.status])),
        el("td", { class: "acts" },
          el("a", { href: x.url, target: "_blank", rel: "noopener" }, "#" + x.number),
          el("button", { class: "linkbtn", type: "button", onclick: function () { runCode(x); } }, R("запустить код")),
          el("button", { class: "btn small check", type: "button", onclick: function () { decide(x, "accepted"); } }, R("Принять")),
          el("button", { class: "btn small ghost", type: "button", onclick: function () { decide(x, "rework"); } }, R("На доработку")))));
    });
    P.appendChild(el("div", { class: "acard" }, el("p", { class: "muted small" }, R("Показано: ") + rows.length + R(" из ") + issues.length + R(". Решение сразу пишется комментарием в обращение на GitHub; статусы в кабинетах студентов обновятся после «Сохранить в GitHub».")),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, [R("Дата"), R("Студент"), R("Работа"), R("Вариант"), R("Статус"), ""].map(function (h) { return el("th", null, h); }))), tb))));
  }
  function fetchIssues() {
    return gh.issues("сдача").then(function (list) {
      issues = list.map(function (i) { var f = GHApi.parseIssue(i.body); return { number: i.number, url: i.html_url, user: i.user && i.user.login, created: i.created_at, state: i.state, labels: (i.labels || []).map(function (l) { return l.name; }), f: f, wid: workId(f.work) }; });
      issues.forEach(function (x) { // статус из меток, если журнал о нём не знает
        if (!J.works[x.number]) J.works[x.number] = { student: x.f.student, work: x.wid, variant: x.f.variant, status: x.labels.indexOf("принято") >= 0 ? "accepted" : x.labels.indexOf("на доработку") >= 0 ? "rework" : "sent", url: x.url, at: x.created };
      });
    });
  }
  function decide(x, status) {
    var comment = prompt(status === "accepted" ? R("Комментарий к принятой работе (можно оставить пустым):") : R("Что нужно исправить?"), "");
    if (comment === null) return;
    var head = status === "accepted" ? R("**Принято.**") : R("**На доработку.**");
    gh.comment(x.number, head + (comment ? " " + comment : "")).then(function () {
      return gh.setLabels(x.number, ["сдача", status === "accepted" ? "принято" : "на доработку"]);
    }).then(function () { return gh.setState(x.number, status === "accepted" ? "closed" : "open"); }).then(function () {
      J.works[x.number] = { student: x.f.student, work: x.wid, variant: x.f.variant, status: status, comment: comment, url: x.url, at: new Date().toISOString() };
      setDirty(true); renderWorks(); O.toast(R("Готово: #") + x.number, "good");
    }, function (e) { O.toast("GitHub: " + e.message, "bad"); });
  }
  function runCode(x) {
    var dlg = el("dialog", { class: "dlg big" });
    var host = el("div");
    dlg.appendChild(el("div", { class: "dlg-h" }, el("h2", null, "#" + x.number + " — " + (x.f.work || "") + R(", вариант ") + (x.f.variant || "—")), el("button", { class: "btn ghost", type: "button", onclick: function () { ide.stop(); dlg.close(); } }, R("Закрыть"))));
    dlg.appendChild(host); document.body.appendChild(dlg); dlg.addEventListener("close", function () { dlg.remove(); });
    dlg.showModal();
    var ide = new IDE(host, { code: x.f.code, fileName: "issue" + x.number, focusCanvas: false });
    ide.run();
  }

  /* учётные записи (только администратор) */
  function renderAcc() {
    var P = panes.acc; P.innerHTML = "";
    function commitAcc(files, text) { return gh.commit(files, text); }
    function showPw(login, pw) { alert(R("Логин: ") + login + R("\nПароль: ") + pw + R("\n\nЗапишите пароль: в системе он не хранится в открытом виде.")); }
    var tb = el("tbody");
    J.accounts.forEach(function (a) {
      tb.appendChild(el("tr", null, el("td", { class: "mono" }, a.login), el("td", null, a.name || ""), el("td", null, a.role === "admin" ? R("администратор") : R("преподаватель")),
        el("td", { class: "acts" },
          a.login === me.login ? el("button", { class: "linkbtn", type: "button", onclick: function () {
            var p1 = prompt(R("Новый пароль (не короче 10 символов):"), ""); if (!p1) return;
            if (p1.length < 10) { O.toast(R("Пароль слишком короткий."), "bad"); return; }
            if (prompt(R("Повторите новый пароль:"), "") !== p1) { O.toast(R("Пароли не совпадают."), "bad"); return; }
            sealAccount(me, p1).then(function (f) { return commitAcc([f], R("Учётная запись: смена пароля")); }).then(function () { O.toast(R("Пароль изменён. Новый пароль действует через 1–2 минуты."), "good"); }, function (e) { O.toast("GitHub: " + e.message, "bad"); });
          } }, R("сменить мой пароль")) : [
            el("button", { class: "linkbtn", type: "button", onclick: function () {
              if (!confirm(R("Выдать новый пароль для «") + a.login + R("»? Старый перестанет действовать."))) return;
              var pw = newPassword();
              sealAccount({ login: a.login, name: a.name || "", role: a.role, K: pass }, pw).then(function (f) { return commitAcc([f], R("Учётная запись: новый пароль")); }).then(function () { showPw(a.login, pw); }, function (e) { O.toast("GitHub: " + e.message, "bad"); });
            } }, R("новый пароль")), " ",
            el("button", { class: "linkbtn danger", type: "button", onclick: function () {
              if (!confirm(LANG === "uz" ? "«" + a.login + "» hisobi öçirilsinmi?" : "Удалить учётную запись «" + a.login + "»?")) return;
              ACC.file(a.login).then(function (path) { return commitAcc([{ path: path, text: null }], R("Учётная запись: удаление")); }).then(function () {
                J.accounts = J.accounts.filter(function (x) { return x !== a; }); setDirty(true); renderAcc(); O.toast(R("Учётная запись удалена."), "good");
              }, function (e) { O.toast("GitHub: " + e.message, "bad"); });
            } }, R("удалить"))])));
    });
    var lg = el("input", { placeholder: R("логин латиницей"), autocomplete: "off" }), nm = el("input", { placeholder: R("ФИО"), autocomplete: "off" });
    var role = el("select", null, el("option", { value: "teacher" }, R("преподаватель")), el("option", { value: "admin" }, R("администратор")));
    P.appendChild(el("div", { class: "acard" }, el("h2", null, R("Учётные записи")),
      el("p", { class: "muted small" }, R("Преподаватель видит студентов, посещаемость, сданные работы и ведомость. Администратор, кроме того, управляет учётными записями.")),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", null, el("tr", null, [R("Логин"), R("ФИО"), R("Роль"), ""].map(function (h) { return el("th", null, h); }))), tb))));
    P.appendChild(el("div", { class: "acard" }, el("h2", null, R("Добавить учётную запись")),
      el("div", { class: "row" }, lg, nm, role, el("button", { class: "btn", type: "button", onclick: function () {
        var l = lg.value.trim().toLowerCase();
        if (!/^[a-z0-9._-]{3,32}$/.test(l)) { O.toast(R("Логин: 3–32 латинские буквы, цифры, точка, дефис."), "bad"); return; }
        if (J.accounts.some(function (x) { return x.login === l; })) { O.toast(R("Такой логин уже есть."), "bad"); return; }
        var pw = newPassword(), a = { login: l, name: nm.value.trim(), role: role.value };
        sealAccount({ login: a.login, name: a.name, role: a.role, K: pass }, pw).then(function (f) { return commitAcc([f], R("Учётная запись: добавление")); }).then(function () {
          J.accounts.push(a); setDirty(true); renderAcc(); showPw(l, pw);
        }, function (e) { O.toast("GitHub: " + e.message, "bad"); });
      } }, R("Создать")))));
  }

  /* сводная ведомость */
  function renderSum() {
    var P = panes.sum; P.innerHTML = "";
    var gs = el("select", null, el("option", { value: "*" }, R("Все группы")), groups().map(function (g) { return el("option", { value: g, selected: g === attGroup ? true : null }, g); }));
    gs.addEventListener("change", function () { attGroup = gs.value; renderSum(); });
    var list = byGroup(attGroup), cols = O.SESSIONS.map(function (s) { return s.id; });
    var lastWork = latestWorks();
    var head = el("tr", null, el("th", null, R("Студент")), O.SESSIONS.map(function (s) { return el("th", { class: "v" }, s.label); }), O.WORKS.map(function (w) { return el("th", { class: "v" }, w.label.split(" — ")[0]); }));
    var tb = el("tbody");
    list.forEach(function (s) {
      tb.appendChild(el("tr", null, el("td", null, s.name || s.id),
        cols.map(function (c) { var m = (J.sessions[c] && J.sessions[c].marks[s.id]) || null; return el("td", { class: "c" }, m ? el("span", { class: "mk mk-" + m.s }, m.s === "p" ? "+" : m.s === "l" ? (m.m || "") + "′" : R("н")) : ""); }),
        O.WORKS.map(function (w) { var r = lastWork[s.id + "|" + w.id]; return el("td", { class: "c" }, r ? el("span", { class: "ws ws-" + r.status, title: r.comment || "" }, r.status === "accepted" ? "✓" : r.status === "rework" ? "↺" : "•") : ""); })));
    });
    P.appendChild(el("div", { class: "acard" }, el("div", { class: "row" }, gs, el("span", { class: "grow" }), el("span", { class: "muted small" }, R("+ был, 5′ опоздал на 5 минут, н — не был; ✓ принято, ↺ на доработку, • отправлено")),
      el("button", { class: "btn ghost", type: "button", onclick: function () { exportSum(list, cols, lastWork); } }, R("Скачать CSV"))),
      el("div", { class: "tbl-wrap" }, el("table", { class: "tbl sum" }, el("thead", null, head), tb))));
  }
  function latestWorks() {
    var r = {}; Object.keys(J.works).forEach(function (num) { var w = J.works[num], k = String(w.student).toLowerCase() + "|" + w.work; var s = student(w.student); if (s) k = s.id + "|" + w.work; if (!r[k] || (w.at || "") > (r[k].at || "")) r[k] = Object.assign({ issue: +num }, w); });
    return r;
  }
  function exportSum(list, cols, lw) {
    var h = ["ID", R("ФИО"), R("Группа")].concat(O.SESSIONS.map(function (s) { return s.label; })).concat(O.WORKS.map(function (w) { return w.label.split(" — ")[0]; }));
    var rows = list.map(function (s) { return [s.id, s.name || "", s.group || ""].concat(cols.map(function (c) { var m = J.sessions[c] && J.sessions[c].marks[s.id]; return m ? (m.s === "p" ? R("был") : m.s === "l" ? R("опоздал ") + (m.m || "") + R(" мин") : R("не был")) : ""; }))
      .concat(O.WORKS.map(function (w) { var r = lw[s.id + "|" + w.id]; return r ? ({ sent: R("отправлено"), accepted: R("принято"), rework: R("на доработку") }[r.status]) : ""; })); });
    download("vedomost_modul2.csv", [h].concat(rows).map(function (r) { return r.join(";"); }).join("\n"));
  }

  /* сохранение */
  function cardOf(s, lw) {
    var sess = O.SESSIONS.map(function (x) { var S = J.sessions[x.id]; var m = S && S.marks[s.id]; return m ? { id: x.id, label: x.label, date: S.date || "", s: m.s, m: m.m } : null; }).filter(Boolean);
    var works = Object.keys(J.works).map(function (num) { var w = J.works[num]; return String(w.student).toLowerCase() === String(s.id).toLowerCase() ? { issue: +num, work: w.work, label: WLABEL[w.work] || w.work, variant: w.variant, status: w.status, comment: w.comment || "", url: w.url, at: w.at } : null; })
      .filter(Boolean).sort(function (a, b) { return (a.at || "").localeCompare(b.at || ""); });
    return { id: s.id, name: s.name || "", group: s.group || "", sessions: sess, works: works, updated: new Date().toISOString() };
  }
  function save() {
    saveBtn.disabled = true; saveMsg.textContent = R("Сохраняю…"); saveMsg.className = "save-msg";
    var noCode = J.students.filter(function (s) { return !s.code; }); noCode.forEach(function (s) { s.code = C.newCode(); });
    J.updated = new Date().toISOString();
    var files = [], newPaths = [];
    var chain = Promise.all(J.students.map(function (s) {
      return C.studentFile(s.id).then(function (path) { newPaths.push(path); return C.seal(cardOf(s), C.studentSecret(s.id, s.code), "ogl|" + String(s.id).trim().toLowerCase()).then(function (box) { files.push({ path: path, text: JSON.stringify(box) }); }); });
    }));
    chain.then(function () {
      (J.files || []).forEach(function (p) { if (newPaths.indexOf(p) < 0) files.push({ path: p, text: null }); });
      J.files = newPaths.slice().sort();
      return C.seal(J, pass);
    }).then(function (box) {
      files.push({ path: "data/journal.json", text: JSON.stringify(box) });
      return Promise.all([gh.ensureLabel("сдача", "C21F32", "Сданная работа"), gh.ensureLabel("принято", "1D7F4E", "Работа принята"), gh.ensureLabel("на доработку", "9A5B00", "Нужно исправить")]).catch(function () {}).then(function () {
        return gh.commit(files, R("Журнал: обновление ") + new Date().toLocaleString(LANG === "uz" ? "uz-UZ" : "ru-RU"));
      });
    }).then(function () {
      setDirty(false); saveBtn.disabled = false; O.toast(R("Журнал сохранён в GitHub. Кабинеты студентов обновятся через 1–2 минуты."), "good");
      if (noCode.length) renderStudents();
    }).catch(function (e) { saveBtn.disabled = false; saveMsg.textContent = R("Ошибка: ") + e.message; saveMsg.className = "save-msg bad"; });
  }
  O.footer();
})();
