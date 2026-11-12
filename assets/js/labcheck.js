/* LABCHECK — laboratoriya qadamini tekşiriş: talaba dasturi etalon yeçim bilan (kadr tasviri)
   va/yoki OpenGL funksiyalari çaqiriqlariga qöyilgan talablar bilan soliştiriladi. UZ/RU. */
(function (global) {
  "use strict";
  var LAB = global.LAB = global.LAB || {};
  var LANG = (global.I && global.I.getLang && global.I.getLang()) || "uz";
  LAB.lang = LANG;
  // {uz, ru} yoki satr -> joriy tildagi matn
  LAB.tr = function (x) {
    if (x == null) return x;
    if (typeof x === "string") return x;
    return x[LANG] != null ? x[LANG] : (x.uz != null ? x.uz : x.ru);
  };
  // kod içidagi izohlar uçun: C("uz matn", "ru текст")
  LAB.C = function (uz, ru) { return LANG === "ru" ? ru : uz; };
  LAB.define = function (d) { LAB.data = d; if (LAB.onDefine) LAB.onDefine(d); };

  var M = LANG === "ru" ? {
    dontUse: "в этом задании не используйте ", needCall: "нужно вызвать ", atLeast: " не менее ", timesPerFrame: " раз за кадр",
    callsNow: ": сейчас вызовов за кадр — ", required: ", требуется ", or: " или ",
    notRun: "Программа не выполнилась: ", error: "ошибка",
    blank: "Окно залито одним цветом — ничего не нарисовано. Проверьте glBegin/glEnd, матрицы и glutSwapBuffers().",
    noRef: "Эталонное решение не построено — сообщите преподавателю.",
    imgDiff: "изображение отличается от ожидаемого: ", pixels: "% пикселей (допускается ",
    notYet: "Пока не совпадает.", correct: "Верно! Результат совпадает с ожидаемым.",
    condFail: "условие задания не выполнено", notDone: "Пока не выполнено.",
    freeOk: "Программа работает. Сравните результат с описанием задания и отметьте шаг.",
    reqOk: "Верно! Требования задания выполнены."
  } : {
    dontUse: "bu topşiriqda işlatmang: ", needCall: "çaqiriş kerak: ", atLeast: " kamida ", timesPerFrame: " marta (har kadrda)",
    callsNow: ": hozir har kadrda çaqiriqlar soni — ", required: ", talab: ", or: " yoki ",
    notRun: "Dastur bajarilmadi: ", error: "xato",
    blank: "Oyna bir xil rangga böyalgan — heç narsa çizilmagan. glBegin/glEnd, matritsalar va glutSwapBuffers() ni tekşiring.",
    noRef: "Etalon yeçim qurilmadi — öqituvçiga xabar bering.",
    imgDiff: "tasvir kutilganidan farq qiladi: ", pixels: "% piksel (ruxsat etiladi ",
    notYet: "Hozirça mos kelmayapti.", correct: "Töğri! Natija kutilgan tasvir bilan mos keldi.",
    condFail: "topşiriq şarti bajarilmagan", notDone: "Hozirça bajarilmagan.",
    freeOk: "Dastur işlayapti. Natijani topşiriq tavsifi bilan soliştiring va qadamni belgilang.",
    reqOk: "Töğri! Topşiriq talablari bajarildi."
  };

  var refCache = {};
  function opts(step) { return { time: step.time || 1000, frames: step.frames || 0 }; }
  function reference(step) {
    var src = step.solution || step.code || "", h = 5381;
    for (var i = 0; i < src.length; i++) h = ((h * 33) ^ src.charCodeAt(i)) >>> 0;   // töliq kod böyiça kalit (turli işlar aralaşmasin)
    var key = (LAB.data && LAB.data.n) + ":" + step.id + ":" + src.length + ":" + h + ":" + (step.time || 1000) + ":" + (step.frames || 0);
    if (!refCache[key]) refCache[key] = Runner.render(step.solution || step.code, opts(step));
    return refCache[key];
  }
  var OPS = { ">=": function (a, b) { return a >= b; }, ">": function (a, b) { return a > b; }, "<=": function (a, b) { return a <= b; },
    "<": function (a, b) { return a < b; }, "==": function (a, b) { return a === b; }, "=": function (a, b) { return a === b; } };
  function callReq(calls, spec) { // {"glPushMatrix": ">=2", "glBegin": 0 (işlatmaslik)}
    var problems = [];
    Object.keys(spec || {}).forEach(function (name) {
      var r = spec[name], n = 0;
      name.split("|").forEach(function (nm) { n += calls[nm] || 0; });
      var label = name.split("|").join(M.or);
      if (typeof r === "number") { if (r === 0 && n > 0) problems.push(M.dontUse + label); else if (r > 0 && n < r) problems.push(M.needCall + label + (r > 1 ? M.atLeast + r + M.timesPerFrame : "")); return; }
      var m = /^(>=|<=|==|=|>|<)\s*(\d+)$/.exec(String(r));
      if (m && !OPS[m[1]](n, +m[2])) problems.push(label + M.callsNow + n + M.required + m[1] + " " + m[2]);
    });
    return problems;
  }
  function srcReq(code, spec) { // dastur matniga talablar (muntazam ifodalar); izohlar hisobga olinmaydi
    var problems = [];
    code = String(code).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, "");
    (spec || []).forEach(function (r) { var re = new RegExp(r.re, r.flags || ""); var has = re.test(code); if (r.not ? has : !has) problems.push(LAB.tr(r.msg)); });
    return problems;
  }
  // tekşiriş: {ok, msg, details[], diff, ref, stu}
  LAB.check = function (step, code) {
    var c = step.check || { type: "image" };
    return Promise.all([Runner.render(code, opts(step)), c.type === "free" || c.type === "calls" ? Promise.resolve(null) : reference(step)]).then(function (rr) {
      var stu = rr[0], ref = rr[1];
      if (!stu.ok) return { ok: false, msg: M.notRun + (stu.error ? stu.error.msg : M.error), line: stu.error && stu.error.line, stu: stu };
      if (!c.allowBlank && Runner.blank(stu.pixels)) return { ok: false, msg: M.blank, stu: stu };
      var probs = callReq(stu.calls || {}, c.calls).concat(srcReq(code, c.source));
      if (c.type === "image" || c.type === "both" || !c.type) {
        if (!ref || !ref.ok) return { ok: false, msg: M.noRef, stu: stu };
        var cmp = Runner.compare(stu.pixels, ref.pixels, c.tol || 48);
        var limit = c.maxDiff !== undefined ? c.maxDiff : 0.012;
        if (cmp.reason) probs.unshift(cmp.reason);
        else if (cmp.diff > limit) probs.unshift(M.imgDiff + (cmp.diff * 100).toFixed(1) + M.pixels + (limit * 100).toFixed(1) + "%)");
        if (probs.length) return { ok: false, msg: M.notYet, details: probs, diff: cmp.diff, ref: ref, stu: stu };
        return { ok: true, msg: M.correct, diff: cmp.diff, ref: ref, stu: stu };
      }
      if (c.type === "custom" && typeof step.verify === "function") {
        var v = step.verify({ calls: stu.calls || {}, info: stu.info, pixels: stu.pixels, logs: stu.logs, code: code });
        if (v !== true) probs.push(typeof v === "string" ? v : M.condFail);
      }
      if (probs.length) return { ok: false, msg: M.notDone, details: probs, stu: stu };
      return { ok: true, msg: c.type === "free" ? M.freeOk : M.reqOk, stu: stu };
    });
  };
  LAB.reference = reference;
  LAB.renderOpts = opts;
})(window);
