/* HOME — asosiy sahifa: jonli OpenGL oyna, 15 ta mavzu röyxati, qanday ishlaydi, mualliflar. UZ/RU. */
(function () {
  "use strict";
  var O = window.KG, el = O.el, I = O.I, K = GL1.K;
  var DOC = "metodichka/KG_uslubiy_korsatma_2026.docx";
  O.header("home");
  var DEMO = [
    "#include <GL/glut.h>",
    "",
    "float angle = 0;",
    "",
    "void display() {",
    "    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);",
    "    glLoadIdentity();",
    "    gluLookAt(0, 2.2, 5.5,  0, 0.4, 0,  0, 1, 0);",
    "    GLfloat light[] = { 2.5f, 4.0f, 2.0f, 1.0f };",
    "    glLightfv(GL_LIGHT0, GL_POSITION, light);",
    "    glDisable(GL_LIGHTING);",
    "    glBegin(GL_QUADS);",
    "    for (int i = -4; i < 4; i++)",
    "        for (int j = -4; j < 4; j++) {",
    "            if ((i + j) % 2) glColor3f(0.86f, 0.87f, 0.9f); else glColor3f(0.74f, 0.76f, 0.8f);",
    "            glVertex3f(i, 0, j); glVertex3f(i, 0, j + 1); glVertex3f(i + 1, 0, j + 1); glVertex3f(i + 1, 0, j);",
    "        }",
    "    glEnd();",
    "    GLfloat s[16] = { light[1],0,0,0,  -light[0],0,-light[2],-1,  0,0,light[1],0,  0,0,0,light[1] };",
    "    glEnable(GL_BLEND); glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);",
    "    glEnable(GL_STENCIL_TEST);",
    "    glStencilFunc(GL_EQUAL, 0, 0xFF); glStencilOp(GL_KEEP, GL_KEEP, GL_INCR);",
    "    glEnable(GL_POLYGON_OFFSET_FILL); glPolygonOffset(-1, -1);",
    "    glColor4f(0.1f, 0.1f, 0.15f, 0.35f);",
    "    glPushMatrix(); glMultMatrixf(s); glTranslatef(0, 0.75f, 0); glRotatef(angle, 0, 1, 0); glutSolidTeapot(0.7); glPopMatrix();",
    "    glDisable(GL_POLYGON_OFFSET_FILL); glDisable(GL_STENCIL_TEST); glDisable(GL_BLEND);",
    "    glEnable(GL_LIGHTING);",
    "    GLfloat red[] = { 0.76f, 0.12f, 0.2f, 1 }, white[] = { 1, 1, 1, 1 };",
    "    glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, red);",
    "    glMaterialfv(GL_FRONT, GL_SPECULAR, white);",
    "    glMaterialf(GL_FRONT, GL_SHININESS, 64);",
    "    glPushMatrix(); glTranslatef(0, 0.75f, 0); glRotatef(angle, 0, 1, 0); glutSolidTeapot(0.7); glPopMatrix();",
    "    glutSwapBuffers();",
    "}",
    "",
    "void idle() { angle = glutGet(GLUT_ELAPSED_TIME) * 0.03f; glutPostRedisplay(); }",
    "",
    "void reshape(int w, int h) {",
    "    glViewport(0, 0, w, h);",
    "    glMatrixMode(GL_PROJECTION); glLoadIdentity();",
    "    gluPerspective(40, (double)w / h, 0.5, 50);",
    "    glMatrixMode(GL_MODELVIEW);",
    "}",
    "",
    "int main(int argc, char** argv) {",
    "    glutInit(&argc, argv);",
    "    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH | GLUT_STENCIL | GLUT_MULTISAMPLE);",
    "    glutInitWindowSize(560, 400);",
    "    glutCreateWindow(\"Teapot\");",
    "    glEnable(GL_DEPTH_TEST); glEnable(GL_LIGHTING); glEnable(GL_LIGHT0); glEnable(GL_NORMALIZE);",
    "    glClearColor(0.13f, 0.15f, 0.19f, 1);",
    "    glutDisplayFunc(display); glutReshapeFunc(reshape); glutIdleFunc(idle);",
    "    glutMainLoop();",
    "}"
  ].join("\n");

  var lang = I.getLang();
  var main = el("main", { class: "home" }); document.body.appendChild(main);
  var winHost = el("div", { class: "win-body" });
  var chips = el("div", { class: "chips" });
  var CH = lang === "ru"
    ? [["GL_DEPTH_TEST", "глубина"], ["GL_LIGHTING", "освещение"], ["GL_LIGHT0", "LIGHT0"], ["GL_NORMALIZE", "нормализация"], ["GL_BLEND", "смешивание"], ["GL_POLYGON_OFFSET_FILL", "смещение"], ["GL_STENCIL_TEST", "трафарет"], ["GL_TEXTURE_2D", "текстура"]]
    : [["GL_DEPTH_TEST", "çuqurlik"], ["GL_LIGHTING", "yoruğlik"], ["GL_LIGHT0", "LIGHT0"], ["GL_NORMALIZE", "normallaştiriş"], ["GL_BLEND", "aralaştiriş"], ["GL_POLYGON_OFFSET_FILL", "surilma"], ["GL_STENCIL_TEST", "trafaret"], ["GL_TEXTURE_2D", "tekstura"]];
  var chipEls = CH.map(function (c) { var x = el("span", { class: "chip", title: c[0] }, c[1]); chips.appendChild(x); return x; });
  var fps = el("span", { class: "wm" });

  var hero = el("section", { class: "hero" },
    el("div", { class: "hero-t" },
      el("p", { class: "kicker" }, I.t("home.univ")),
      el("h1", null, I.t("brand.name"), el("span", null, I.t("brand.sub"))),
      el("p", { class: "lead" }, I.t("home.hero.sub")),
      el("div", { class: "cta" },
        el("a", { class: "btn run", href: O.tpath("l", 1) }, I.t("home.hero.cta")),
        el("a", { class: "btn ghost", href: O.link("sandbox/") }, I.t("nav.sandbox")),
        el("a", { class: "btn ghost doc-dl", href: O.link(DOC), download: "" }, I.t("footer.doc"))),
      el("p", { class: "muted small" }, lang === "ru" ? "Над окном — работающая программа на OpenGL. Чипсы под окном обновляются и показывают, какие возможности включены." : "Oynada — işlab turgan OpenGL dasturi. Oyna tagidagi çiplar har kadrda yangilanadi va qaysi imkoniyatlar yoqilganini körsatadi.")),
    el("figure", { class: "hero-w" },
      el("div", { class: "win" }, el("div", { class: "win-bar" }, el("span", { class: "wt" }, "Teapot"), fps), winHost),
      chips,
      el("figcaption", null, el("a", { href: O.link("sandbox/?demo=1") }, lang === "ru" ? "Открыть код этой программы в мастерской" : "Bu dastur kodini ustaxonada oçiş"))));
  main.appendChild(hero);
  var handle = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function runDemo() {
    var code = reduce ? DEMO.replace("glutIdleFunc(idle);", "") : DEMO;
    Runner.run({ code: code, host: winHost, noImages: true, onFrame: function (info) {
      var on = {}; info.caps.forEach(function (c) { on[c] = 1; });
      CH.forEach(function (c, i) { chipEls[i].classList.toggle("on", !!on[K[c[0]]]); });
      fps.textContent = info.stats.fps ? info.stats.fps + (lang === "ru" ? " кадров/с" : " kadr/s") : "";
    } }).then(function (h) { handle = h; var cv = winHost.querySelector("canvas"); if (cv) cv.tabIndex = -1; });
  }
  if ("IntersectionObserver" in window) {
    var started = false; new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; runDemo(); } }).observe(winHost);
  } else runDemo();
  O.store.set("demo", DEMO);

  // 15 ta mavzu röyxati
  var list = el("section", { class: "topics", id: "temy", "aria-label": I.t("home.labs") }, el("h2", null, I.t("home.labs")));
  O.TOPICS.forEach(function (t) {
    var done = (O.store.get("lab" + t.k + ":done", []) || []).length;
    var name = lang === "ru" ? t.ru : t.uz;
    list.appendChild(el("article", { class: "trow", id: "t" + t.k },
      el("div", { class: "tn" }, el("span", null, I.t("home.lab")), String(t.k)),
      el("div", { class: "tt" },
        el("p", null, el("span", { class: "lbl" }, "A" + t.k), name),
        done ? el("p", { class: "done" }, (lang === "ru" ? "Шагов выполнено: " : "Bajarilgan qadamlar: ") + done) : null),
      el("div", { class: "tl" },
        el("a", { class: "tri", href: O.tpath("e", t.k) }, el("b", null, I.t("home.explain")), el("span", null, lang === "ru" ? "аудио" : "audio")),
        el("a", { class: "tri", href: O.tpath("l", t.k) }, el("b", null, I.t("home.practice")), el("span", null, lang === "ru" ? "код и окно" : "kod va oyna")),
        el("a", { class: "tri", href: O.tpath("z", t.k) }, el("b", null, I.t("home.tasks")), el("span", null, lang === "ru" ? "варианты, сдача" : "variantlar")))));
  });
  main.appendChild(list);

  // Qanday ishlaydi
  var how = lang === "ru"
    ? [["Объяснение", "У каждой темы — QR-код с аудио-объяснением на русском и узбекском языках и текстом."],
       ["Лаборатория", "Второй QR-код открывает пример и задания. Код C++ запускается прямо в браузере и проверяется автоматически."],
       ["Индивидуальное задание", "Вариант назначает преподаватель. Работать можно в мастерской или в Visual Studio 2022 с freeglut."],
       ["Сдача через GitHub", "Кнопка «Сдать работу» заполняет форму. Посещаемость и статусы работ — в «Моём кабинете»."]]
    : [["Audio izoh", "Har bir mavzuga QR-kod biriktirilgan — özbek va rus tillarida qisqa audio izoh va matn."],
       ["Amaliy iş", "Ikkinçi QR-kod misol va topşiriqlarni oçadi. C++ kodi brauzerda işga tuşadi va avtomatik tekşiriladi."],
       ["Individual topşiriq", "Variantni öqituvçi tayinlaydi. Ustaxona yoki Visual Studio 2022 + freeglut da işlaş mumkin."],
       ["GitHub orqali topşiriş", "«Topşiriş» tugmasi formani töldiradi. Davomat va holatlar — «Mening kabinetim» da."]];
  main.appendChild(el("section", { class: "how" },
    el("h2", null, lang === "ru" ? "Как устроено занятие" : "Maşğulot qanday taşkil etilgan"),
    el("ol", { class: "flow" },
      how.map(function (x) { return el("li", null, el("b", null, x[0]), el("span", null, x[1])); }))));

  // Mualliflar
  main.appendChild(el("section", { class: "authors" },
    el("h2", null, I.t("home.authors")),
    el("div", { class: "au-row" },
      el("figure", { class: "au" },
        el("img", { src: O.link("assets/img/authors/nuraliyev.jpg"), alt: "F.M. Nuraliyev", loading: "lazy" }),
        el("figcaption", null,
          el("b", null, lang === "ru" ? "Ф.М. Нуралиев" : "F.M. Nuraliyev"),
          el("span", null, lang === "ru" ? "доктор технических наук, профессор" : "texnika fanlari doktori, professor"))),
      el("figure", { class: "au" },
        el("img", { src: O.link("assets/img/authors/ibodullayev.jpg"), alt: "S.N. Ibodullayev", loading: "lazy", style: "object-position: 50% 24%" }),
        el("figcaption", null,
          el("b", null, lang === "ru" ? "С.Н. Ибодуллаев" : "S.N. Ibodullayev"),
          el("span", null, lang === "ru" ? "старший преподаватель" : "katta öqituvçi"))))));
  O.footer();
})();
