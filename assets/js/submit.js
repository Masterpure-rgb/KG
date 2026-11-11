/* SUBMIT — işni topşiriş: saytdagi forma → maydonlari töldirilgan GitHub «New issue» sahifasi. UZ/RU. */
(function (global) {
  "use strict";
  var O = global.OGL || global.KG, el = O.el;
  var MAX_URL = 7000;
  var RU = (global.I && global.I.getLang && global.I.getLang()) === "ru";
  var L = RU ? {
    idPh: "например, 2401", grPh: "например, 721-23", varPh: "номер", ansPh: "Кратко ответьте на 2–3 контрольных вопроса (по требованию преподавателя)",
    h: "Сдать работу через GitHub", intro: "Работа отправляется преподавателю как обращение (issue) в репозитории курса. Нужен бесплатный аккаунт GitHub. Фамилию не пишите — достаточно ID из списка группы.",
    fId: "ID студента", fGr: "Группа", fWork: "Работа", fVar: "Вариант", fCode: "Код программы (.cpp)", fCodeHelp: "Код вставлен из редактора. Проверьте, что это окончательная версия.",
    fAns: "Ответы на контрольные вопросы (необязательно)", cancel: "Отмена", open: "Открыть GitHub",
    needId: "Укажите ID и группу.", needCode: "Вставьте код программы.", variantW: ", вариант ",
    left: "Осталось отправить на GitHub", st1: "В открывшейся вкладке войдите в GitHub (или зарегистрируйтесь).",
    copied: "Код скопирован в буфер обмена: ", longCode: "Код длинный — скопируйте его вручную: ", paste: "щёлкните в поле «Код программы (.cpp)» и вставьте (Ctrl+V).",
    filled: "Поля уже заполнены — проверьте их.", st3: "Перетащите в поле «Скриншот и файлы» снимок окна программы (кнопка «Скриншот» в редакторе)", srs: " и отчёт.",
    st4: "Нажмите «Create». Статус работы появится в разделе «Мой кабинет» после проверки.", copy: "Скопировать код", copiedT: "Код скопирован",
    again: "Открыть GitHub ещё раз", done: "Готово"
  } : {
    idPh: "masalan, 2401", grPh: "masalan, 721-23", varPh: "raqam", ansPh: "2–3 ta nazorat savoliga qisqa javob bering (öqituvçi talab qilsa)",
    h: "Işni GitHub orqali topşiriş", intro: "Iş öqituvçiga kurs omboridagi murojaat (issue) sifatida yuboriladi. Bepul GitHub akkaunti kerak. Familiyangizni yozmang — guruh röyxatidagi ID yetarli.",
    fId: "Talaba ID si", fGr: "Guruh", fWork: "Iş", fVar: "Variant", fCode: "Dastur kodi (.cpp)", fCodeHelp: "Kod muharrirdan qöyildi. Bu yakuniy versiya ekanini tekşiring.",
    fAns: "Nazorat savollariga javoblar (ixtiyoriy)", cancel: "Bekor qiliş", open: "GitHub ni oçiş",
    needId: "ID va guruhni körsating.", needCode: "Dastur kodini qöying.", variantW: ", variant ",
    left: "GitHub ga yuboriş qoldi", st1: "Oçilgan oynada GitHub ga kiring (yoki röyxatdan öting).",
    copied: "Kod buferga nusxalandi: ", longCode: "Kod uzun — uni qölda nusxalang: ", paste: "«Dastur kodi (.cpp)» maydoniga bosing va qöying (Ctrl+V).",
    filled: "Maydonlar töldirilgan — tekşirib çiqing.", st3: "«Skrinşot va fayllar» maydoniga dastur oynasi rasmini torting (muharrirdagi «Skrinşot» tugmasi)", srs: " va hisobotni.",
    st4: "«Create» ni bosing. Iş holati tekşirilgandan keyin «Mening kabinetim» bölimida körinadi.", copy: "Kodni nusxalaş", copiedT: "Kod nusxalandi",
    again: "GitHub ni yana oçiş", done: "Tayyor"
  };
  function open(o) {
    o = o || {};
    var me = O.store.get("me", {});
    var dlg = el("dialog", { class: "dlg", "aria-labelledby": "sub-h" });
    var id = el("input", { id: "sub-id", required: true, value: me.id || "", autocomplete: "off", inputmode: "text", placeholder: L.idPh });
    var grp = el("input", { id: "sub-g", required: true, value: me.group || "", autocomplete: "off", placeholder: L.grPh });
    var work = el("select", { id: "sub-w" }, O.WORKS.map(function (w) { return el("option", { value: w.id, selected: w.id === o.work ? true : null }, w.label); }));
    var variant = el("input", { id: "sub-v", value: o.variant || me["v" + (o.work || "")] || "", inputmode: "numeric", placeholder: L.varPh });
    var code = el("textarea", { id: "sub-c", rows: 8, spellcheck: "false", class: "mono" }, o.code || "");
    var answers = el("textarea", { id: "sub-a", rows: 3, placeholder: L.ansPh });
    var msg = el("p", { class: "dlg-msg", role: "status" });
    function field(lbl, inp, help) { return el("label", { class: "fld" }, el("span", null, lbl), inp, help ? el("small", null, help) : null); }
    var form = el("form", { method: "dialog" },
      el("h2", { id: "sub-h" }, L.h),
      el("p", { class: "muted small" }, L.intro),
      el("div", { class: "fld-row" }, field(L.fId, id), field(L.fGr, grp)),
      el("div", { class: "fld-row" }, field(L.fWork, work), field(L.fVar, variant)),
      field(L.fCode, code, L.fCodeHelp),
      field(L.fAns, answers),
      msg,
      el("div", { class: "dlg-act" },
        el("button", { class: "btn ghost", type: "button", onclick: function () { dlg.close(); } }, L.cancel),
        el("button", { class: "btn run", type: "submit" }, L.open)));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!id.value.trim() || !grp.value.trim()) { msg.textContent = L.needId; msg.className = "dlg-msg bad"; return; }
      if (!code.value.trim()) { msg.textContent = L.needCode; msg.className = "dlg-msg bad"; return; }
      me.id = id.value.trim(); me.group = grp.value.trim(); me["v" + work.value] = variant.value.trim(); O.store.set("me", me);
      var W = O.WORKS.filter(function (w) { return w.id === work.value; })[0];
      var title = "[" + W.label.split(" — ")[0] + "] ID " + me.id + (variant.value ? L.variantW + variant.value.trim() : "");
      var base = "https://github.com/" + O.REPO + "/issues/new?template=sdacha.yml";
      var q = "&title=" + encodeURIComponent(title) + "&student=" + encodeURIComponent(me.id) + "&group=" + encodeURIComponent(me.group) +
        "&work=" + encodeURIComponent(W.label) + "&variant=" + encodeURIComponent(variant.value.trim()) + (answers.value.trim() ? "&answers=" + encodeURIComponent(answers.value.trim()) : "");
      var withCode = base + q + "&code=" + encodeURIComponent(code.value);
      var url = withCode.length <= MAX_URL ? withCode : base + q;
      var copied = false;
      if (url !== withCode) {
        try { navigator.clipboard.writeText(code.value); copied = true; } catch (er) { copied = false; }
      }
      window.open(url, "_blank", "noopener");
      form.innerHTML = "";
      form.appendChild(el("h2", null, L.left));
      form.appendChild(el("ol", { class: "after" },
        el("li", null, L.st1),
        url !== withCode ? el("li", null, el("b", null, copied ? L.copied : L.longCode), L.paste) : el("li", null, L.filled),
        el("li", null, L.st3, W.id === "SRS2" ? L.srs : "."),
        el("li", null, L.st4)));
      if (url !== withCode && !copied) form.appendChild(el("button", { class: "btn small", type: "button", onclick: function () { try { navigator.clipboard.writeText(code.value); O.toast(L.copiedT, "good"); } catch (er) {} } }, L.copy));
      form.appendChild(el("div", { class: "dlg-act" }, el("a", { class: "btn ghost", href: url, target: "_blank", rel: "noopener" }, L.again), el("button", { class: "btn", type: "button", onclick: function () { dlg.close(); } }, L.done)));
    });
    dlg.appendChild(form);
    dlg.addEventListener("close", function () { dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    (me.id ? variant : id).focus();
  }
  global.Submit = { open: open };
})(window);
