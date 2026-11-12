/* LAB — laboratoriya sahifasi: öz lab{n}.js bölsa — töliq törtta step rejim;
   bölmasa — default minimal muhit (nazariya + starter kod + oyna), bu ham işlaydi. UZ/RU. */
(function () {
  "use strict";
  var O = window.KG || window.OGL, el = O.el, I = O.I || { t: function (k) { return k; }, getLang: function () { return "uz"; } };
  var lang = I.getLang();
  var n = +document.body.getAttribute("data-topic"), T = O.topic(n) || { k: n };
  var topicName = O.topicName(n);

  // Lokalizatsiya
  var L = lang === "ru" ? {
    topics: "Темы", topic: "Тема ", lab: "Лаборатория",
    kicker: "Работа " + O.k(n) + ". Лабораторная",
    comingSoon: "Интерактивные пошаговые задания для этой работы готовятся. Пока используйте этот стартовый код и окно OpenGL для изучения темы.",
    about: "О теме",
    starter: "Стартовый код",
    runHint: "Нажмите «Запустить» или Ctrl+Enter — программа скомпилируется и покажет результат в окне справа.",
    tryEdit: "Попробуйте изменить цвета, координаты, углы вращения — результат обновится.",
    toTasks: "К заданиям и вариантам",
    audio: "Прослушать аудио-объяснение",
    steps: "Шаги",
    allSteps: "Список шагов",
    example: "Пример",
    task: "Задание",
    done: "выполнено",
    of: "из",
    building: "Строится…",
    expected: "Ожидаемый результат",
    checkInfo: "Нажмите «Проверить»: программа запускается и её кадр сравнивается с ожидаемым.",
    hint: "Подсказка",
    checking: "Проверяю…",
    prev: "Предыдущий шаг",
    next: "Следующий шаг",
    toFirstTask: "К первому заданию",
    toLine: "Перейти к строке "
  } : {
    topics: "Mavzular", topic: "A", lab: "Laboratoriya",
    kicker: "A" + O.k(n) + " — Laboratoriya iş",
    comingSoon: "Bu işning bosqiçma-bosqiç interaktiv topşiriqlari tayyorlanmoqda. Hozirça quyidagi starter kod va OpenGL oynasidan foydalanib mavzuni örganiş mumkin.",
    about: "Mavzu haqida",
    starter: "Starter kod",
    runHint: "«Işga tuşuriş» tugmasini yoki Ctrl+Enter bosing — dastur kompilyatsiya qilinib, natija öngdagi oynada körsatiladi.",
    tryEdit: "Ranglarni, koordinatalarni, buriş burçaklarini özgartirib köring — natija darhol yangilanadi.",
    toTasks: "Topşiriqlar va variantlar sahifasiga",
    audio: "Audio izohni tinglaş",
    steps: "Qadamlar",
    allSteps: "Qadamlar röyxati",
    example: "Misol",
    task: "Topşiriq",
    done: "bajarildi",
    of: "dan",
    building: "Qurilmoqda…",
    expected: "Kutilayotgan natija",
    checkInfo: "«Tekşiriş» tugmasini bosing: dastur işga tuşadi va uning kadri etalon bilan soliştiriladi.",
    hint: "Maslahat",
    checking: "Tekşirilyapti…",
    prev: "Oldingi qadam",
    next: "Keyingi qadam",
    toFirstTask: "Birinçi topşiriqqa",
    toLine: "Şu qatorga ötiş "
  };

  O.header("lab", [
    { text: L.topics, href: O.link("") },
    { text: L.topic + O.k(n), href: O.link("#t" + n) },
    { text: L.lab }
  ]);

  var root = el("main", { class: "labpage" });
  document.body.appendChild(root);
  root.appendChild(el("div", { class: "pagehead" },
    el("p", { class: "kicker" }, L.kicker),
    el("h1", null, topicName),
    O.trio(n, "l")));

  // lab{n}.js ni yuklaş, muvaffaqiyatsiz bölsa — default demo
  O.loadScript("assets/js/labs/lab" + n + ".js?v=" + (O.CFG.v || 1)).then(start, startDemo);

  // ---------- DEFAULT DEMO ----------
  function startDemo() {
    var demo = defaultCodeFor(n);
    var intro = el("div", { class: "lab-demo" },
      el("div", { class: "lab-intro note" },
        el("p", null, L.comingSoon),
        el("p", null, el("a", { href: O.tpath("e", n), class: "btn ghost small" }, "▶ " + L.audio)))
    );
    var ideHost = el("div");
    var wrap = el("div", { class: "lab" },
      el("aside", { class: "lab-side" },
        el("div", { class: "lab-section" },
          el("h2", null, L.about),
          el("p", null, topicName),
          el("h2", { style: "margin-top: 20px" }, L.starter),
          el("p", { class: "muted small" }, L.runHint),
          el("p", { class: "muted small" }, L.tryEdit),
          el("div", { style: "margin-top: 16px" },
            el("a", { class: "btn", href: O.tpath("z", n) }, L.toTasks)))),
      el("div", { class: "lab-main" }, ideHost));
    root.appendChild(intro);
    root.appendChild(wrap);

    var ide = new IDE(ideHost, {
      fileName: "a" + n + "_demo",
      code: demo,
      onReset: function () { ide.editor.set(demo); ide.run(); }
    });
    ide.run();
  }

  // ---------- TO'LIQ LAB (lab{n}.js bor bölsa) ----------
  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
  function start() {
    var D = LAB.data, steps = D.steps, key = "lab" + n;
    var done = new Set(O.store.get(key + ":done", []));
    var cur = Math.min(O.store.get(key + ":cur", 0), steps.length - 1);

    var list = el("ol", { class: "steps" });
    var dots = el("ol", { class: "stepper", style: "--n: " + steps.length });
    var prog = el("span", { class: "prog" });
    var all = el("details", { class: "all-steps" }, el("summary", null, L.allSteps), list);
    var stepsBox = el("nav", { class: "lab-steps", "aria-label": L.steps },
      el("div", { class: "sh" }, el("h2", null, L.steps), prog), dots, all);
    var taskBox = el("section", { class: "task", "aria-live": "polite" });
    var ideHost = el("div");
    var tabs = el("div", { class: "tabs", role: "tablist" });
    var wrap = el("div", { class: "lab" }, el("aside", { class: "lab-side" }, stepsBox, taskBox), el("div", { class: "lab-main" }, ideHost));
    root.appendChild(tabs); root.appendChild(wrap);

    var ide = new IDE(ideHost, {
      fileName: "sz" + n + "_" + (steps[cur] && steps[cur].id),
      onCheck: function (code) { check(code); },
      onReset: function () { var s = steps[cur]; ide.editor.set(s.starter || s.code); O.store.del(key + ":" + s.id); ide.run(); },
      onSave: function (code) { var s = steps[cur]; if (code !== (s.starter || s.code)) O.store.set(key + ":" + s.id, code); },
      onRun: function (h, manual) { if (manual && window.matchMedia("(max-width: 900px)").matches) setTab("out"); }
    });

    var TABS = lang === "ru"
      ? [["task", "Задание"], ["code", "Код"], ["out", "Окно"]]
      : [["task", "Topşiriq"], ["code", "Kod"], ["out", "Oyna"]];
    TABS.forEach(function (t) { tabs.appendChild(el("button", { role: "tab", type: "button", "data-tab": t[0], onclick: function () { setTab(t[0]); } }, t[1])); });
    function setTab(t) { wrap.setAttribute("data-tab", t); O.$$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === t ? "true" : "false"); }); }
    setTab("task");

    function title(s) { return cap(String(LAB.tr(s.title) || "").replace(/^(Пример|Misol|Задание|Topşiriq)\s*\d*\s*[:.—-]?\s*/i, "")); }
    function renderList() {
      list.innerHTML = ""; dots.innerHTML = "";
      steps.forEach(function (s, i) {
        var lbl = s.kind === "example" ? (lang === "ru" ? "П" : "M") : String(stepNo(i));
        dots.appendChild(el("li", { class: (i === cur ? "cur " : "") + (done.has(s.id) ? "done" : "") },
          el("button", { type: "button", title: (s.kind === "example" ? L.example + ": " : L.task + " " + lbl + ": ") + title(s),
            "aria-current": i === cur ? "step" : null, onclick: function () { go(i); } }, lbl)));
      });
      steps.forEach(function (s, i) {
        var isDone = done.has(s.id);
        list.appendChild(el("li", { class: (i === cur ? "cur " : "") + (isDone ? "done" : "") },
          el("button", { type: "button", onclick: function () { all.open = false; go(i); }, "aria-current": i === cur ? "step" : null },
            el("span", { class: "sn" }, s.kind === "example" ? (lang === "ru" ? "П" : "M") : String(stepNo(i))),
            el("span", { class: "st" }, title(s)),
            isDone ? el("span", { class: "ok", "aria-label": L.done }, "✓") : null)));
      });
      var tasks = steps.filter(function (s) { return s.kind === "task"; }), d = tasks.filter(function (s) { return done.has(s.id); }).length;
      prog.textContent = L.done + " " + d + " " + L.of + " " + tasks.length;
    }
    function stepNo(i) { var k = 0; for (var j = 0; j <= i; j++) if (steps[j].kind === "task") k++; return k; }
    var result = null;
    function go(i) {
      cur = i; O.store.set(key + ":cur", i);
      var s = steps[i];
      renderList();
      taskBox.innerHTML = "";
      var head = el("div", { class: "task-h" },
        el("span", { class: "tag " + s.kind }, s.kind === "example" ? L.example : L.task + " " + stepNo(i)),
        el("h2", null, title(s)));
      taskBox.appendChild(head);
      taskBox.appendChild(el("div", { class: "task-text", html: LAB.tr(s.text) || "" }));
      if (s.kind === "task") {
        var c = s.check || { type: "image" };
        var row = el("div", { class: "task-row" });
        if (c.type !== "free" && c.type !== "calls") {
          var fig = el("figure", { class: "expect" }, el("div", { class: "ph" }, L.building), el("figcaption", null, L.expected));
          row.appendChild(fig);
          LAB.reference(s).then(function (r) { if (r.pixels) fig.replaceChild(el("img", { src: Runner.toDataURL(r.pixels, 360), alt: L.expected }), fig.firstChild); else fig.firstChild.textContent = "—"; });
        }
        var side = el("div", { class: "task-side" });
        if (s.hint) side.appendChild(el("details", { class: "hint" }, el("summary", null, L.hint), el("p", { html: LAB.tr(s.hint) })));
        result = el("div", { class: "result", role: "status" });
        side.appendChild(result);
        side.appendChild(el("p", { class: "muted small" }, L.checkInfo));
        row.appendChild(side);
        taskBox.appendChild(row);
      } else result = null;
      var nav = el("div", { class: "task-nav" },
        i > 0 ? el("button", { class: "btn ghost", type: "button", onclick: function () { go(i - 1); } }, L.prev) : null,
        i < steps.length - 1 ? el("button", { class: "btn ghost", type: "button", onclick: function () { go(i + 1); } }, s.kind === "example" ? L.toFirstTask : L.next) :
          el("a", { class: "btn", href: O.tpath("z", n) }, L.toTasks));
      taskBox.appendChild(nav);
      ide.opts.fileName = "sz" + n + "_" + s.id;
      ide.editor.set(O.store.get(key + ":" + s.id, null) || s.starter || s.code);
      O.$(".check", ideHost) && (O.$(".check", ideHost).hidden = s.kind !== "task");
      ide.run();
    }
    function check(code) {
      var s = steps[cur]; if (s.kind !== "task") return;
      if (!result) return;
      result.className = "result wait"; result.innerHTML = ""; result.textContent = L.checking;
      if (code !== (s.starter || s.code)) O.store.set(key + ":" + s.id, code);
      LAB.check(s, code).then(function (r) {
        result.innerHTML = "";
        result.className = "result " + (r.ok ? "good" : "bad");
        result.appendChild(el("b", null, r.msg));
        if (r.details && r.details.length) result.appendChild(el("ul", null, r.details.map(function (d) { return el("li", null, d.charAt(0).toUpperCase() + d.slice(1) + "."); })));
        if (r.line) result.appendChild(el("button", { class: "linkbtn", type: "button", onclick: function () { ide.editor.goto(r.line); setTab("code"); } }, L.toLine + r.line));
        if (r.ok) {
          done.add(s.id); O.store.set(key + ":done", Array.from(done)); renderList();
          if (cur < steps.length - 1) result.appendChild(el("button", { class: "btn small", type: "button", onclick: function () { go(cur + 1); } }, L.next));
          else result.appendChild(el("a", { class: "btn small", href: O.tpath("z", n) }, L.toTasks));
        }
        if (window.matchMedia("(max-width: 900px)").matches) setTab("task");
      });
    }
    go(cur);
  }

  // ---------- Default starter kod — har 15 ta A{k} uçun minimal OpenGL misoli ----------
  function defaultCodeFor(n) {
    var header = [
      "#define _USE_MATH_DEFINES",
      "#include <cmath>",
      "#include <GL/glew.h>",
      "#include <GL/freeglut.h>",
      ""
    ].join("\n");
    var footer = [
      "",
      "void reshape(int w, int h) {",
      "    glViewport(0, 0, w, h);",
      "    glMatrixMode(GL_PROJECTION);",
      "    glLoadIdentity();",
      "    gluPerspective(45.0, (double)w / h, 0.5, 100.0);",
      "    glMatrixMode(GL_MODELVIEW);",
      "}",
      "",
      "int main(int argc, char** argv) {",
      "    glutInit(&argc, argv);",
      "    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);",
      "    glutInitWindowSize(640, 480);",
      "    glutCreateWindow(\"A" + n + "\");",
      "    glewInit();",
      "    glEnable(GL_DEPTH_TEST);",
      "    glClearColor(0.12f, 0.17f, 0.28f, 1);",
      "    glutDisplayFunc(display);",
      "    glutReshapeFunc(reshape);",
      "    glutMainLoop();",
      "    return 0;",
      "}"
    ].join("\n");
    var body = (DEMOS[n] || DEMOS[0]).split("\n").map(function (ln) { return ln; }).join("\n");
    return header + body + footer;
  }

  var DEMOS = {
    0: [
      "void display() {",
      "    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);",
      "    glLoadIdentity();",
      "    gluLookAt(0, 2, 5,  0, 0, 0,  0, 1, 0);",
      "    glColor3f(0.9f, 0.7f, 0.2f);",
      "    glutWireTeapot(1.5);",
      "    glutSwapBuffers();",
      "}"
    ].join("\n"),
    1: [
      "void display() {",
      "    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);",
      "    glLoadIdentity();",
      "    gluLookAt(3, 3, 5,  0, 0, 0,  0, 1, 0);",
      "    glColor3f(0.4f, 0.7f, 1.0f);",
      "    glutWireCube(2.0);",
      "    glutSwapBuffers();",
      "}"
    ].join("\n"),
    2: [
      "void drawBezier(float P[4][2]) {",
      "    glBegin(GL_LINE_STRIP);",
      "    for (float t = 0; t <= 1.0f; t += 0.01f) {",
      "        float mt = 1 - t;",
      "        float x = mt*mt*mt*P[0][0] + 3*t*mt*mt*P[1][0]",
      "                + 3*t*t*mt*P[2][0] + t*t*t*P[3][0];",
      "        float y = mt*mt*mt*P[0][1] + 3*t*mt*mt*P[1][1]",
      "                + 3*t*t*mt*P[2][1] + t*t*t*P[3][1];",
      "        glVertex2f(x, y);",
      "    }",
      "    glEnd();",
      "}",
      "void display() {",
      "    glClear(GL_COLOR_BUFFER_BIT);",
      "    glLoadIdentity(); glOrtho(-2, 2, -2, 2, -1, 1);",
      "    glColor3f(0.9f, 0.3f, 0.3f); glLineWidth(2);",
      "    float P[4][2] = {{-1.5, 0}, {-0.5, 1.5}, {0.5, -1.5}, {1.5, 0}};",
      "    drawBezier(P);",
      "    glutSwapBuffers();",
      "}"
    ].join("\n"),
    7: [
      "void display() {",
      "    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);",
      "    glLoadIdentity();",
      "    gluLookAt(0, 0, 5,  0, 0, 0,  0, 1, 0);",
      "    glBegin(GL_TRIANGLES);",
      "        glColor3f(1, 0, 0); glVertex2f(0, 1);",
      "        glColor3f(0, 1, 0); glVertex2f(-1, -1);",
      "        glColor3f(0, 0, 1); glVertex2f(1, -1);",
      "    glEnd();",
      "    glutSwapBuffers();",
      "}"
    ].join("\n"),
    8: [
      "void display() {",
      "    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);",
      "    glEnable(GL_LIGHTING); glEnable(GL_LIGHT0);",
      "    GLfloat pos[] = {3, 5, 3, 1}, white[] = {1, 1, 1, 1};",
      "    glLightfv(GL_LIGHT0, GL_POSITION, pos);",
      "    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);",
      "    GLfloat red[] = {0.8f, 0.2f, 0.2f, 1}, spec[] = {1, 1, 1, 1};",
      "    glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, red);",
      "    glMaterialfv(GL_FRONT, GL_SPECULAR, spec);",
      "    glMaterialf(GL_FRONT, GL_SHININESS, 64);",
      "    glLoadIdentity();",
      "    gluLookAt(0, 2, 5,  0, 0, 0,  0, 1, 0);",
      "    glutSolidSphere(1.5, 32, 32);",
      "    glutSwapBuffers();",
      "}"
    ].join("\n")
  };
  // Boşqalarini standart teapot bilan töldiramiz
  for (var i = 1; i <= 15; i++) if (!DEMOS[i]) DEMOS[i] = DEMOS[0];

  O.footer();
})();
