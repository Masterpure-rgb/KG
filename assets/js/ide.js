/* IDE — muharrir + OpenGL oynasi + konsol + holat paneli. Laboratoriya va Ustaxonada ishlatiladi. UZ/RU. */
(function (global) {
  "use strict";
  var O = global.OGL || global.KG, el = O.el, K = GL1.K;
  var I18 = global.I || { getLang: function () { return "uz"; } };
  var lang = I18.getLang();

  var L = lang === "ru" ? {
    run: "Запустить",
    runTitle: "Запустить (Ctrl+Enter)",
    check: "Проверить",
    reset: "Сбросить",
    resetTitle: "Вернуть исходный код шага",
    download: "Скачать .cpp",
    downloadTitle: "Скачать файл .cpp",
    shot: "Скриншот",
    shotTitle: "Сохранить изображение окна (для отчёта)",
    winTitle: "Окно OpenGL",
    winEmpty: "Нажмите «Запустить» — здесь откроется окно программы.",
    stateTitle: "Состояние OpenGL",
    chipsAria: "Включённые возможности OpenGL",
    console: "Консоль",
    clear: "очистить",
    line: "строка",
    compiling: "Компиляция…",
    rtErr: "Ошибка во время выполнения",
    errAt: "Ошибка в строке ",
    err: "Ошибка",
    notRun: "Программа не запущена — см. сообщение в консоли.",
    okWarn: "Работает, есть предупреждения",
    ok: "Работает",
    runFirst: "Сначала запустите программу.",
    frames: "Кадров", fps: "FPS", blocks: "Блоков glBegin", verts: "Вершин", draws: "Вызовов отрисовки",
    listBlocks: "Из списков", matrix: "Матрица", mvDepth: "Глубина стека MV",
    chips: {
      "GL_DEPTH_TEST": "глубина", "GL_LIGHTING": "освещение", "GL_LIGHT0": "LIGHT0", "GL_LIGHT1": "LIGHT1", "GL_LIGHT2": "LIGHT2",
      "GL_COLOR_MATERIAL": "цвет-материал", "GL_NORMALIZE": "нормализация", "GL_TEXTURE_2D": "текстура", "GL_BLEND": "смешивание",
      "GL_CULL_FACE": "отсечение граней", "GL_FOG": "туман", "GL_STENCIL_TEST": "трафарет", "GL_ALPHA_TEST": "альфа-тест",
      "GL_LINE_SMOOTH": "сглаж. линий", "GL_POLYGON_OFFSET_FILL": "смещ. полигонов", "GL_SCISSOR_TEST": "ножницы", "GL_CLIP_PLANE0": "плоск. отсеч."
    }
  } : {
    run: "Işga tuşuriş",
    runTitle: "Işga tuşuriş (Ctrl+Enter)",
    check: "Tekşiriş",
    reset: "Qayta tiklaş",
    resetTitle: "Boşlangiç kodga qaytariş",
    download: "Yuklab oliş .cpp",
    downloadTitle: ".cpp faylini yuklab oliş",
    shot: "Skrinşot",
    shotTitle: "Oyna rasmini saqlaş (hisobot uçun)",
    winTitle: "OpenGL oynasi",
    winEmpty: "«Işga tuşuriş» tugmasini bosing — bu yerda dastur oynasi oçiladi.",
    stateTitle: "OpenGL holati",
    chipsAria: "Yoqilgan OpenGL imkoniyatlari",
    console: "Konsol",
    clear: "tozalaş",
    line: "qator",
    compiling: "Kompilyatsiya…",
    rtErr: "Baǰariş vaqtida xato",
    errAt: "Xato — qator ",
    err: "Xato",
    notRun: "Dastur işga tuşmagan — konsoldagi xabarga qarang.",
    okWarn: "Işlayapti, ogohlantirişlar bor",
    ok: "Işlayapti",
    runFirst: "Avval dasturni işga tuşuring.",
    frames: "Kadrlar", fps: "FPS", blocks: "glBegin bloklari", verts: "Uçlar", draws: "Çiziş çaqiriqlari",
    listBlocks: "Röyxatlardan", matrix: "Matritsa", mvDepth: "MV steki çuqurligi",
    chips: {
      "GL_DEPTH_TEST": "çuqurlik", "GL_LIGHTING": "yoritiş", "GL_LIGHT0": "LIGHT0", "GL_LIGHT1": "LIGHT1", "GL_LIGHT2": "LIGHT2",
      "GL_COLOR_MATERIAL": "rang-material", "GL_NORMALIZE": "normallaştiriş", "GL_TEXTURE_2D": "tekstura", "GL_BLEND": "aralaştiriş",
      "GL_CULL_FACE": "qirra kesiş", "GL_FOG": "tuman", "GL_STENCIL_TEST": "trafaret", "GL_ALPHA_TEST": "alfa-test",
      "GL_LINE_SMOOTH": "çiziq silliqlaş", "GL_POLYGON_OFFSET_FILL": "poligon siljiş", "GL_SCISSOR_TEST": "qaypçi", "GL_CLIP_PLANE0": "kesiş tekisligi"
    }
  };

  var CHIP_KEYS = [
    "GL_DEPTH_TEST", "GL_LIGHTING", "GL_LIGHT0", "GL_LIGHT1", "GL_LIGHT2",
    "GL_COLOR_MATERIAL", "GL_NORMALIZE", "GL_TEXTURE_2D", "GL_BLEND",
    "GL_CULL_FACE", "GL_FOG", "GL_STENCIL_TEST", "GL_ALPHA_TEST",
    "GL_LINE_SMOOTH", "GL_POLYGON_OFFSET_FILL", "GL_SCISSOR_TEST", "GL_CLIP_PLANE0"
  ];
  var MODE = {}; MODE[K.GL_MODELVIEW] = "GL_MODELVIEW"; MODE[K.GL_PROJECTION] = "GL_PROJECTION"; MODE[K.GL_TEXTURE] = "GL_TEXTURE";

  function IDE(host, opts) {
    opts = opts || {};
    var I = this; this.opts = opts; this.run = run; this.stop = stop;
    host.classList.add("ide");
    var runBtn = el("button", { class: "btn run", type: "button", title: L.runTitle, onclick: function () { run({ manual: true }); } }, el("span", { class: "ic ic-play", "aria-hidden": "true" }), L.run);
    var checkBtn = opts.onCheck ? el("button", { class: "btn check", type: "button", onclick: function () { opts.onCheck(I.editor.get()); } }, el("span", { class: "ic ic-check", "aria-hidden": "true" }), L.check) : null;
    var resetBtn = el("button", { class: "btn ghost", type: "button", title: L.resetTitle, onclick: function () { if (opts.onReset) opts.onReset(); } }, L.reset);
    var dlBtn = el("button", { class: "btn ghost", type: "button", title: L.downloadTitle, onclick: download }, L.download);
    var shotBtn = el("button", { class: "btn ghost", type: "button", title: L.shotTitle, onclick: screenshot }, L.shot);
    this.status = el("span", { class: "ide-status", role: "status" });
    var bar = el("div", { class: "ide-bar" }, runBtn, checkBtn, el("span", { class: "grow" }), this.status, resetBtn, dlBtn, shotBtn);
    var edHost = el("div", { class: "ide-code" });
    this.winTitle = el("span", { class: "wt" }, L.winTitle);
    this.winMeta = el("span", { class: "wm" }, "");
    this.canvasHost = el("div", { class: "win-body" }, el("p", { class: "win-empty" }, L.winEmpty));
    var win = el("div", { class: "win" }, el("div", { class: "win-bar" }, this.winTitle, this.winMeta), this.canvasHost);
    this.chips = el("div", { class: "chips", "aria-label": L.chipsAria });
    this.chipEls = {};
    CHIP_KEYS.forEach(function (c) { var x = el("span", { class: "chip", title: c }, L.chips[c]); I.chipEls[c] = x; I.chips.appendChild(x); });
    this.metrics = el("dl", { class: "metrics" });
    var state = el("details", { class: "state", open: opts.stateOpen === false ? null : true }, el("summary", null, L.stateTitle), this.chips, this.metrics);
    this.cons = el("div", { class: "console", "aria-live": "polite" });
    var out = el("div", { class: "ide-out" }, win, state, el("div", { class: "cons-h" }, el("span", null, L.console), el("button", { class: "linkbtn", type: "button", onclick: function () { I.cons.innerHTML = ""; } }, L.clear)), this.cons);
    var main = el("div", { class: "ide-main" }, edHost, out);
    host.appendChild(bar); host.appendChild(main);
    this.editor = new Editor(edHost, { value: opts.code || "", onRun: function () { run({ manual: true }); }, onChange: opts.onChange });
    this.handle = null;
    var lastInfo = 0, outBuf = "";

    function log(kind, msg, line) {
      if (kind === "out") { outBuf += msg; var parts = outBuf.split("\n"); outBuf = parts.pop(); parts.forEach(function (p) { addLine("out", p, null); }); return; }
      addLine(kind, msg, line);
      if (line && (kind === "error" || kind === "warn")) I.editor.mark(line, kind === "error" ? "err" : "warn");
    }
    function addLine(kind, msg, line) {
      if (I.cons.childNodes.length > 300) I.cons.removeChild(I.cons.firstChild);
      var row = el("div", { class: "cl cl-" + kind },
        line ? el("button", { class: "ln", type: "button", onclick: function () { I.editor.goto(line); } }, L.line + " " + line) : null,
        el("span", null, msg));
      I.cons.appendChild(row); I.cons.scrollTop = I.cons.scrollHeight;
    }
    this.log = addLine;
    function stop() { if (I.handle && I.handle.rt) I.handle.rt.__destroy(); I.handle = null; }
    function run(how) {
      how = how || {};
      stop(); outBuf = "";
      I.cons.innerHTML = ""; I.editor.clearMarks();
      I.canvasHost.innerHTML = ""; I.winTitle.textContent = L.winTitle; I.winMeta.textContent = "";
      I.status.textContent = L.compiling; I.status.className = "ide-status";
      var code = I.editor.get();
      if (opts.onSave) opts.onSave(code);
      return Runner.run({ code: code, host: I.canvasHost, log: log,
        onWindow: function (w) {
          I.winTitle.textContent = w.title; I.winMeta.textContent = w.w + "×" + w.h + "  " + [w.double ? "DOUBLE" : "SINGLE", w.depth && "DEPTH", w.stencil && "STENCIL", w.accum && "ACCUM", w.msaa && "MULTISAMPLE"].filter(Boolean).join(" · ");
          w.canvas.style.aspectRatio = w.w + " / " + w.h;
        },
        onTitle: function (t) { I.winTitle.textContent = t; },
        onFrame: function (info) { var now = performance.now(); if (now - lastInfo > 250) { lastInfo = now; showState(info); } },
        onError: function () { I.status.textContent = L.rtErr; I.status.className = "ide-status bad"; }
      }).then(function (h) {
        I.handle = h;
        if (outBuf) { addLine("out", outBuf, null); outBuf = ""; }
        if (h.error) { I.status.textContent = h.error.line ? L.errAt + h.error.line : L.err; I.status.className = "ide-status bad"; if (h.error.line) I.editor.mark(h.error.line, "err"); if (!h.rt || !I.canvasHost.querySelector("canvas")) I.canvasHost.appendChild(el("p", { class: "win-empty bad" }, L.notRun)); }
        else { I.status.textContent = h.warnings.length ? L.okWarn : L.ok; I.status.className = "ide-status " + (h.warnings.length ? "warn" : "ok"); if (h.rt) showState(h.rt.__info()); var cv = I.canvasHost.querySelector("canvas"); if (cv && opts.focusCanvas !== false) cv.focus({ preventScroll: true }); }
        if (opts.onRun) opts.onRun(h, !!how.manual);
        return h;
      });
    }
    function showState(info) {
      var on = {}; info.caps.forEach(function (c) { on[c] = true; });
      CHIP_KEYS.forEach(function (c) { I.chipEls[c].classList.toggle("on", !!on[K[c]]); });
      var s = info.stats;
      I.metrics.innerHTML = "";
      [[L.frames, s.frames], [L.fps, s.fps || "—"], [L.blocks, s.blocks], [L.verts, s.verts], [L.draws, s.draws], [L.listBlocks, s.listBlocks],
        [L.matrix, MODE[info.matMode] || info.matMode], [L.mvDepth, info.mvDepth]].forEach(function (p) {
        I.metrics.appendChild(el("dt", null, p[0])); I.metrics.appendChild(el("dd", null, String(p[1])));
      });
    }
    function download() {
      var name = (opts.fileName || "program") + ".cpp", b = new Blob([I.editor.get()], { type: "text/x-c++src;charset=utf-8" });
      var a = el("a", { href: URL.createObjectURL(b), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
    function screenshot() {
      if (!I.handle || !I.handle.rt) { O.toast(L.runFirst, "bad"); return; }
      var img = I.handle.rt.__screen(); if (!img) return;
      var a = el("a", { href: Runner.toDataURL(img), download: (opts.fileName || "program") + ".png" }); document.body.appendChild(a); a.click(); a.remove();
    }
  }
  global.IDE = IDE;
})(window);
