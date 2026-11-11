/* A4. Brezenxeym algoritmlari: kesma, aylana, ellips (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = `#include <GL/glut.h>
#include <cmath>
#include <cstdio>

// ${C("Mantiqiy piksellar: 160×120 «katta piksel», har biri ekranda 3×3", "Логические пиксели: 160×120 «крупных пикселей», каждый на экране 3×3")}
#define W 160
#define H 120

void plot(int x, int y) { glVertex2f(x + 0.5f, y + 0.5f); }

`;
  var LINE1 = `// ${C("Brezenxeym kesmasi (0 ≤ qiyalik ≤ 1, x0 < x1): faqat butun sonli amallar", "Отрезок Брезенхема (0 ≤ наклон ≤ 1, x0 < x1): только целочисленные операции")}
void lineOct0(int x0, int y0, int x1, int y1) {
    int dx = x1 - x0, dy = y1 - y0;
    int d = 2 * dy - dx;              // ${C("xatolik (qaror parametri)", "ошибка (параметр решения)")}
    int y = y0;
    for (int x = x0; x <= x1; x++) {
        plot(x, y);
        if (d > 0) { y++; d -= 2 * dx; }
        d += 2 * dy;
    }
}

`;
  var LINE = `// ${C("Umumiy Brezenxeym kesmasi: barça yönalişlar uçun", "Общий отрезок Брезенхема: для всех направлений")}
void line(int x0, int y0, int x1, int y1) {
    int dx = abs(x1 - x0), dy = abs(y1 - y0);
    int sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    int err = dx - dy;
    while (1) {
        plot(x0, y0);
        if (x0 == x1 && y0 == y1) break;
        int e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 <  dx) { err += dx; y0 += sy; }
    }
}

`;
  var CIRCLE = `// ${C("Örta nuqta usulidagi aylana: 8 tomonlama simmetriya", "Окружность методом средней точки: 8-кратная симметрия")}
void circle(int xc, int yc, int r) {
    int x = 0, y = r, d = 1 - r;
    while (x <= y) {
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        plot(xc + y, yc + x); plot(xc - y, yc + x); plot(xc + y, yc - x); plot(xc - y, yc - x);
        if (d < 0) d += 2 * x + 3;
        else { d += 2 * (x - y) + 5; y--; }
        x++;
    }
}

`;
  var ELLIPSE = `// ${C("Örta nuqta usulidagi ellips: ikki soha (qiyalik |k| < 1 va |k| > 1)", "Эллипс методом средней точки: две области (наклон |k| < 1 и |k| > 1)")}
void ellipse(int xc, int yc, int a, int b) {
    double a2 = a * a, b2 = b * b;
    int x = 0, y = b;
    double d1 = b2 - a2 * b + 0.25 * a2;
    while (b2 * x < a2 * y) {             // ${C("1-soha", "область 1")}
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        if (d1 < 0) d1 += b2 * (2 * x + 3);
        else { d1 += b2 * (2 * x + 3) + a2 * (-2 * y + 2); y--; }
        x++;
    }
    double d2 = b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2;
    while (y >= 0) {                      // ${C("2-soha", "область 2")}
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        if (d2 > 0) d2 += a2 * (-2 * y + 3);
        else { d2 += b2 * (2 * x + 2) + a2 * (-2 * y + 3); x++; }
        y--;
    }
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(0, W, 0, H);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}
`;
  function MAIN(title, extra) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(480, 360);
    glutCreateWindow("${title}");
    glClearColor(0.08f, 0.11f, 0.2f, 1.0f);
${extra || ""}    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutMainLoop();
    return 0;
}
`;
  }
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }
  var BEGIN = `    glClear(GL_COLOR_BUFFER_BIT);
    glPointSize(3.0f);
    glBegin(GL_POINTS);
`;
  var END = `    glEnd();
    glutSwapBuffers();
}

`;

  /* ---------- Misol ---------- */
  var ex = HEAD + LINE1 + `void display() {
` + BEGIN + `    // ${C("Birinçi oktantdagi kesmalar yelpiği: qiyalik 0 dan 1 gaça", "Веер отрезков первого октанта: наклон от 0 до 1")}
    for (int k = 0; k <= 6; k++) {
        glColor3f(1.0f, 0.85f - k * 0.08f, 0.3f + k * 0.1f);
        lineOct0(10, 10, 150, 10 + k * 18);
    }
` + END + RESHAPE + MAIN("A4: Brezenxeym");

  /* ---------- 1. Çiziq — barça yönalişlar ---------- */
  var t1 = S(HEAD + `// ${C("Umumiy Brezenxeym kesmasi: barça yönalişlar uçun", "Общий отрезок Брезенхема: для всех направлений")}
void line(int x0, int y0, int x1, int y1) {
`, `    // ${C("TODO: dx = |x1 − x0|, dy = |y1 − y0|, qadamlar sx, sy = ±1, xatolik err = dx − dy;", "TODO: dx = |x1 − x0|, dy = |y1 − y0|, шаги sx, sy = ±1, ошибка err = dx − dy;")}
    // ${C("har qadamda e2 = 2·err: e2 > −dy bölsa x bölib, e2 < dx bölsa y böyiça siljing", "на каждом шаге e2 = 2·err: если e2 > −dy — шаг по x, если e2 < dx — шаг по y")}
    plot(x0, y0);
`, `    int dx = abs(x1 - x0), dy = abs(y1 - y0);
    int sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    int err = dx - dy;
    while (1) {
        plot(x0, y0);
        if (x0 == x1 && y0 == y1) break;
        int e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 <  dx) { err += dx; y0 += sy; }
    }
`, `}

void display() {
` + BEGIN + `    glColor3f(1.0f, 0.85f, 0.3f);  line(10, 10, 150, 40);     // ${C("yotiq", "пологий")}
    glColor3f(0.3f, 0.9f, 1.0f);   line(30, 110, 60, 5);      // ${C("tik, pastga", "крутой, вниз")}
    glColor3f(1.0f, 0.45f, 0.4f);  line(150, 100, 20, 70);    // ${C("çapga", "влево")}
    glColor3f(0.5f, 1.0f, 0.5f);   line(100, 5, 120, 115);    // ${C("tik, yuqoriga", "крутой, вверх")}
` + END + RESHAPE + MAIN("A4: ciziq"));

  /* ---------- 2. Nişon ---------- */
  var t2 = S(HEAD + `// ${C("Örta nuqta usulidagi aylana", "Окружность методом средней точки")}
void circle(int xc, int yc, int r) {
`, `    // ${C("TODO: x = 0, y = r, d = 1 − r; x ≤ y ekan: 8 ta simmetrik nuqtani çizing;", "TODO: x = 0, y = r, d = 1 − r; пока x ≤ y: нарисуйте 8 симметричных точек;")}
    // ${C("d < 0 → d += 2x + 3, aks holda d += 2(x − y) + 5 va y−−; keyin x++", "d < 0 → d += 2x + 3, иначе d += 2(x − y) + 5 и y−−; затем x++")}
`, `    int x = 0, y = r, d = 1 - r;
    while (x <= y) {
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        plot(xc + y, yc + x); plot(xc - y, yc + x); plot(xc + y, yc - x); plot(xc - y, yc - x);
        if (d < 0) d += 2 * x + 3;
        else { d += 2 * (x - y) + 5; y--; }
        x++;
    }
`, `}

void display() {
` + BEGIN + `    // ${C("5 ta konsentrik aylana: R = 10, 20, 30, 40, 50", "5 концентрических окружностей: R = 10, 20, 30, 40, 50")}
    for (int k = 1; k <= 5; k++) {
        if (k % 2) glColor3f(1.0f, 0.4f, 0.35f); else glColor3f(0.95f, 0.95f, 1.0f);
        circle(80, 60, 10 * k);
    }
` + END + RESHAPE + MAIN("A4: nison"));

  /* ---------- 3. Ellips ---------- */
  var t3 = S(HEAD + `void ellipse(int xc, int yc, int a, int b) {
    double a2 = a * a, b2 = b * b;
    int x = 0, y = b;
    double d1 = b2 - a2 * b + 0.25 * a2;
    while (b2 * x < a2 * y) {             // ${C("1-soha", "область 1")}
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        if (d1 < 0) d1 += b2 * (2 * x + 3);
        else { d1 += b2 * (2 * x + 3) + a2 * (-2 * y + 2); y--; }
        x++;
    }
`, `    // ${C("TODO: 2-soha: d2 = b²(x + 0,5)² + a²(y − 1)² − a²b²; y ≥ 0 ekan: 4 ta nuqta çizing,", "TODO: область 2: d2 = b²(x + 0,5)² + a²(y − 1)² − a²b²; пока y ≥ 0: рисуйте 4 точки,")}
    // ${C("d2 > 0 → d2 += a²(−2y + 3), aks holda d2 += b²(2x + 2) + a²(−2y + 3) va x++; keyin y−−", "d2 > 0 → d2 += a²(−2y + 3), иначе d2 += b²(2x + 2) + a²(−2y + 3) и x++; затем y−−")}
`, `    double d2 = b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2;
    while (y >= 0) {                      // ${C("2-soha", "область 2")}
        plot(xc + x, yc + y); plot(xc - x, yc + y); plot(xc + x, yc - y); plot(xc - x, yc - y);
        if (d2 > 0) d2 += a2 * (-2 * y + 3);
        else { d2 += b2 * (2 * x + 2) + a2 * (-2 * y + 3); x++; }
        y--;
    }
`, `}

void display() {
` + BEGIN + `    glColor3f(0.3f, 0.9f, 1.0f);
    ellipse(80, 60, 70, 40);              // a = 70, b = 40
` + END + RESHAPE + MAIN("A4: ellips"));

  /* ---------- 4. Yulduz ---------- */
  var t4 = S(HEAD + LINE + CIRCLE + `void display() {
` + BEGIN, `    // ${C("TODO: markaz (80, 60) dan 45° qadam bilan 8 ta nur (uzunligi 50) va R = 50 aylana çizing", "TODO: из центра (80, 60) — 8 лучей с шагом 45° (длина 50) и окружность R = 50")}
    // ${C("nur uçi: (80 + round(50·cos a), 60 + round(50·sin a))", "конец луча: (80 + round(50·cos a), 60 + round(50·sin a))")}
`, `    glColor3f(1.0f, 0.85f, 0.3f);
    for (int k = 0; k < 8; k++) {
        double a = k * 3.14159265 / 4;
        line(80, 60, 80 + (int)round(50 * cos(a)), 60 + (int)round(50 * sin(a)));
    }
    glColor3f(0.3f, 0.9f, 1.0f);
    circle(80, 60, 50);
`, END + RESHAPE + MAIN("A4: yulduz"));

  /* ---------- 5. Antialyasing (Vu) ---------- */
  var t5 = S(HEAD + LINE + `// ${C("Fon rangi bilan aralaştirib piksel çiziş: c = bg + (fg − bg)·α", "Пиксель с прозрачностью: c = bg + (fg − bg)·α")}
void plotA(int x, int y, double a) {
    glColor3f(0.08f + (1.0f - 0.08f) * a, 0.11f + (0.85f - 0.11f) * a, 0.2f + (0.3f - 0.2f) * a);
    plot(x, y);
}
double fpart(double v) { return v - floor(v); }

// ${C("Vu algoritmi (yotiq kesma, x0 < x1): har bir x da ikki piksel, yorqinligi masofaga mutanosib", "Алгоритм Ву (пологий отрезок, x0 < x1): на каждом x два пикселя, яркость по расстоянию")}
void wuLine(double x0, double y0, double x1, double y1) {
    double k = (y1 - y0) / (x1 - x0);
    double y = y0;
    for (int x = (int)x0; x <= (int)x1; x++) {
`, `        // ${C("TODO: yuqori piksel (x, floor(y) + 1) — yorqinlik fpart(y),", "TODO: верхний пиксель (x, floor(y) + 1) — яркость fpart(y),")}
        // ${C("pastki (x, floor(y)) — 1 − fpart(y); keyin y += k", "нижний (x, floor(y)) — 1 − fpart(y); затем y += k")}
        plotA(x, (int)floor(y + 0.5), 1.0);
        y += k;
`, `        plotA(x, (int)floor(y), 1 - fpart(y));
        plotA(x, (int)floor(y) + 1, fpart(y));
        y += k;
`, `    }
}

void display() {
` + BEGIN + `    glColor3f(1.0f, 0.85f, 0.3f);
    line(10, 75, 150, 110);                // ${C("Brezenxeym — «zinapoya»", "Брезенхем — «лесенка»")}
    wuLine(10, 15, 150, 50);               // ${C("Vu — silliq qirralar", "Ву — сглаженные края")}
` + END + RESHAPE + MAIN("A4: Vu"));

  /* ---------- 6. Interaktiv ellips ---------- */
  var t6 = S(HEAD + ELLIPSE + `int ea = 60, eb = 30;

void display() {
` + BEGIN + `    glColor3f(0.3f, 0.9f, 1.0f);
    ellipse(80, 60, ea, eb);
    // ${C("Tutqiçlar: yarim öqlarning uçlari", "Ручки: концы полуосей")}
    glColor3f(1.0f, 0.4f, 0.35f);
    plot(80 + ea, 60); plot(80, 60 + eb);
` + END, `// ${C("TODO: special(): ← / → — a ni ±5 ga, ↑ / ↓ — b ni ±5 ga özgartiradi (5..75 va 5..55 oralığida)", "TODO: special(): ← / → меняют a на ±5, ↑ / ↓ — b на ±5 (в пределах 5..75 и 5..55)")}
void special(int key, int x, int y) { }
`, `void special(int key, int x, int y) {
    if (key == GLUT_KEY_RIGHT && ea < 75) ea += 5;
    if (key == GLUT_KEY_LEFT  && ea > 5)  ea -= 5;
    if (key == GLUT_KEY_UP    && eb < 55) eb += 5;
    if (key == GLUT_KEY_DOWN  && eb > 5)  eb -= 5;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A4: interaktiv ellips", "    glutSpecialFunc(special);\n"));

  /* ---------- 7. Soat ---------- */
  var t7 = S(HEAD + LINE + CIRCLE + `// ${C("Soat 10:08:30 dan boşlanadi va dastur vaqti bilan yuradi", "Часы стартуют с 10:08:30 и идут по времени программы")}
double start = 10 * 3600 + 8 * 60 + 30;

// ${C("Strelka: burçak 12 dan soat strelkasi böyiça, uzunligi len", "Стрелка: угол от 12 по часовой стрелке, длина len")}
void hand(double deg, int len) {
    double a = (90 - deg) * 3.14159265 / 180;
    line(80, 60, 80 + (int)round(len * cos(a)), 60 + (int)round(len * sin(a)));
}

void display() {
    double s = start + glutGet(GLUT_ELAPSED_TIME) / 1000.0;
` + BEGIN + `    glColor3f(0.6f, 0.65f, 0.8f);
    circle(80, 60, 55);
`, `    // ${C("TODO: soniya strelkasi 6°/s, daqiqa — 6°/min, soat — 30°/soat:", "TODO: секундная стрелка 6°/с, минутная — 6°/мин, часовая — 30°/ч:")}
    // ${C("hand(...) bilan uçta strelkani turli rangda çizing (uzunliklar 30, 45, 52)", "нарисуйте три стрелки hand(...) разными цветами (длины 30, 45, 52)")}
`, `    glColor3f(0.95f, 0.95f, 1.0f); hand(fmod(s / 3600, 12) * 30, 30);   // ${C("soat", "часовая")}
    glColor3f(0.3f, 0.9f, 1.0f);   hand(fmod(s / 60, 60) * 6, 45);      // ${C("daqiqa", "минутная")}
    glColor3f(1.0f, 0.4f, 0.35f);  hand(fmod(s, 60) * 6, 52);           // ${C("soniya", "секундная")}
`, END + `void idle() { glutPostRedisplay(); }

` + RESHAPE + MAIN("A4: soat", "    glutIdleFunc(idle);\n"));

  /* ---------- 8. Taqqoslaş ---------- */
  var t8 = S(HEAD + LINE + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glPointSize(3.0f);
    // ${C("Brezenxeym — havorang", "Брезенхем — голубой")}
    glColor3f(0.3f, 0.9f, 1.0f);
    glBegin(GL_POINTS);
    line(5, 20, 155, 110);
    glEnd();
`, `    // ${C("TODO: xuddi şu kesmani OpenGL ning GL_LINES primitivi bilan sariq rangda, 1 piksel qalinlikda çizing", "TODO: тот же отрезок нарисуйте примитивом GL_LINES OpenGL жёлтым цветом, толщиной 1 пиксель")}
    // ${C("(OpenGL koordinatalari: piksel markazi — x + 0,5)", "(координаты OpenGL: центр пикселя — x + 0,5)")}
`, `    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(1.0f);
    glBegin(GL_LINES);
    glVertex2f(5.5f, 20.5f);
    glVertex2f(155.5f, 110.5f);
    glEnd();
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A4: taqqoslas"));

  LAB.define({
    n: 4,
    title: { uz: "Kesma, aylana va ellipsni Brezenxeym algoritmi yordamida hosil qiliş", ru: "Построение отрезка, окружности и эллипса алгоритмами Брезенхема" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: Brezenxeym kesmasi", ru: "Пример: отрезок Брезенхема" },
        text: { uz: "<p>Ekran — piksellar to'ri. Bu yerda har bir mantiqiy piksel 3×3 ekran pikseli bilan körsatilgan, şuning uçun rastrlaş «zinapoyasi» yaxşi körinadi. Brezenxeym algoritmi faqat butun sonlar bilan işlaydi: qaror parametri <i>d</i> keyingi piksel töğri (x+1, y) mi yoki diagonal (x+1, y+1) mi ekanligini aniqlaydi.</p>",
                ru: "<p>Экран — сетка пикселей. Здесь каждый логический пиксель показан квадратом 3×3, поэтому «лесенка» растеризации хорошо видна. Алгоритм Брезенхема работает только с целыми числами: параметр решения <i>d</i> определяет, будет ли следующий пиксель прямо (x+1, y) или по диагонали (x+1, y+1).</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Çiziq — barça yönalişlar", ru: "Задание 1. Отрезок в любом направлении" },
        text: { uz: "<p>Misoldagi algoritm faqat birinçi oktantda (0 ≤ k ≤ 1, x0 < x1) işlaydi. <b>Umumiy</b> variantni yozing: qadamlar sx, sy = ±1, xatolik err = dx − dy. Natijada yotiq, tik va «orqaga» yönalgan 4 ta kesma töğri çizilişi kerak.</p>",
                ru: "<p>Алгоритм из примера работает только в первом октанте (0 ≤ k ≤ 1, x0 < x1). Напишите <b>общий</b> вариант: шаги sx, sy = ±1, ошибка err = dx − dy. В результате должны правильно рисоваться 4 отрезка — пологие, крутые и направленные «назад».</p>" },
        hint: { uz: "while(1) { plot; agar oxirgi nuqta — break; e2 = 2·err; if (e2 > −dy) {err −= dy; x0 += sx;} if (e2 < dx) {err += dx; y0 += sy;} }", ru: "while(1) { plot; если последняя точка — break; e2 = 2·err; if (e2 > −dy) {err −= dy; x0 += sx;} if (e2 < dx) {err += dx; y0 += sy;} }" },
        check: { type: "image", maxDiff: 0.003 }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Nişon", ru: "Задание 2. Мишень" },
        text: { uz: "<p><b>Örta nuqta</b> usulidagi aylana algoritmini yozing va 5 ta konsentrik aylana çizing: R = 10, 20, 30, 40, 50. Faqat 1/8 yoy hisoblanadi, qolgan 7 tasi simmetriya bilan olinadi: (±x, ±y) va (±y, ±x).</p>",
                ru: "<p>Напишите алгоритм окружности <b>методом средней точки</b> и нарисуйте 5 концентрических окружностей: R = 10, 20, 30, 40, 50. Вычисляется только 1/8 дуги, остальные 7 получаются симметрией: (±x, ±y) и (±y, ±x).</p>" },
        hint: { uz: "x = 0, y = r, d = 1 − r; while (x ≤ y) { 8 ta plot; if (d < 0) d += 2x + 3; else { d += 2(x − y) + 5; y−−; } x++; }", ru: "x = 0, y = r, d = 1 − r; while (x ≤ y) { 8 вызовов plot; if (d < 0) d += 2x + 3; else { d += 2(x − y) + 5; y−−; } x++; }" },
        check: { type: "image", maxDiff: 0.003 }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Ellips", ru: "Задание 3. Эллипс" },
        text: { uz: "<p>Yarim öqlari a = 70, b = 40 bölgan ellipsni çizing. Ellipsda qiyalik |k| = 1 bölgan nuqtada qadam turi özgaradi: 1-sohada asosiy qadam x böyiça, 2-sohada — y böyiça. 1-soha tayyor, 2-sohani yozing.</p>",
                ru: "<p>Нарисуйте эллипс с полуосями a = 70, b = 40. В точке, где наклон |k| = 1, меняется тип шага: в области 1 основной шаг по x, в области 2 — по y. Область 1 готова, допишите область 2.</p>" },
        hint: { uz: "Ikkinçi siklda y har doim kamayadi, x esa faqat d2 ≤ 0 bölganda oşadi.", ru: "Во втором цикле y уменьшается всегда, а x растёт только при d2 ≤ 0." },
        check: { type: "image", maxDiff: 0.002 }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Yulduz", ru: "Задание 4. Звезда" },
        text: { uz: "<p>Tayyor <code>line</code> va <code>circle</code> funksiyalaridan foydalanib, 8 nurli yulduz çizing: markaz (80, 60) dan 45° qadam bilan uzunligi 50 bölgan 8 ta nur va R = 50 aylana. Nur uçining koordinatalarini butun songa yaxlitlang.</p>",
                ru: "<p>Используя готовые функции <code>line</code> и <code>circle</code>, нарисуйте восьмилучевую звезду: из центра (80, 60) с шагом 45° — 8 лучей длины 50 и окружность R = 50. Координаты концов лучей округлите до целых.</p>" },
        hint: { uz: "a = k·π/4; line(80, 60, 80 + (int)round(50·cos a), 60 + (int)round(50·sin a));", ru: "a = k·π/4; line(80, 60, 80 + (int)round(50·cos a), 60 + (int)round(50·sin a));" },
        check: { type: "image", maxDiff: 0.003 }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Antialyasing — Vu algoritmi", ru: "Задание 5. Сглаживание — алгоритм Ву" },
        text: { uz: "<p>Vu algoritmi har bir x uçun ikki pikselni böyaydi va ularning yorqinligini haqiqiy çiziqqaça masofaga qarab taqsimlaydi: yuqori pikselga fpart(y), pastkisiga 1 − fpart(y). Natijani yuqoridagi Brezenxeym «zinapoyasi» bilan soliştiring.</p>",
                ru: "<p>Алгоритм Ву на каждом x закрашивает два пикселя и распределяет яркость по расстоянию до истинной прямой: верхнему — fpart(y), нижнему — 1 − fpart(y). Сравните результат с «лесенкой» Брезенхема сверху.</p>" },
        hint: { uz: "plotA(x, (int)floor(y), 1 − fpart(y)); plotA(x, (int)floor(y) + 1, fpart(y));", ru: "plotA(x, (int)floor(y), 1 − fpart(y)); plotA(x, (int)floor(y) + 1, fpart(y));" },
        check: { type: "image", maxDiff: 0.002 }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Interaktiv ellips", ru: "Задание 6. Интерактивный эллипс" },
        text: { uz: "<p>Ellipsning yarim öqlarini klaviatura bilan özgartiring: <b>←/→</b> — a ni ±5 ga, <b>↑/↓</b> — b ni ±5 ga. Qizil tutqiçlar yarim öqlar uçini körsatadi. Qiymatlar 5..75 (a) va 5..55 (b) oralığidan çiqmasin.</p>",
                ru: "<p>Меняйте полуоси эллипса с клавиатуры: <b>←/→</b> — a на ±5, <b>↑/↓</b> — b на ±5. Красные ручки показывают концы полуосей. Значения не должны выходить за пределы 5..75 (a) и 5..55 (b).</p>" },
        hint: { uz: "if (key == GLUT_KEY_RIGHT && ea < 75) ea += 5; … glutPostRedisplay();", ru: "if (key == GLUT_KEY_RIGHT && ea < 75) ea += 5; … glutPostRedisplay();" },
        check: { type: "both", source: [{ re: "glutSpecialFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "main() da glutSpecialFunc(special) qayd qilingan bölsin", ru: "В main() должна быть регистрация glutSpecialFunc(special)" } }, { re: "GLUT_KEY_RIGHT", msg: { uz: "Ong strelkani (GLUT_KEY_RIGHT) qayta işlang", ru: "Обработайте стрелку вправо (GLUT_KEY_RIGHT)" } }, { re: "GLUT_KEY_UP", msg: { uz: "Yuqori strelkani (GLUT_KEY_UP) qayta işlang", ru: "Обработайте стрелку вверх (GLUT_KEY_UP)" } }] }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Soat strelkalari", ru: "Задание 7. Стрелки часов" },
        text: { uz: "<p>Brezenxeym kesmalari bilan analog soat strelkalarini çizing. Soniya strelkasi sekundiga 6°, daqiqa strelkasi daqiqasiga 6°, soat strelkasi soatiga 30° buriladi. Vaqt s sekundlarda berilgan: soniya burçagi = (s mod 60)·6, daqiqa = (s/60 mod 60)·6, soat = (s/3600 mod 12)·30.</p>",
                ru: "<p>Нарисуйте отрезками Брезенхема стрелки аналоговых часов. Секундная поворачивается на 6° в секунду, минутная — на 6° в минуту, часовая — на 30° в час. Время s задано в секундах: угол секундной = (s mod 60)·6, минутной = (s/60 mod 60)·6, часовой = (s/3600 mod 12)·30.</p>" },
        hint: { uz: "hand(fmod(s / 3600, 12) * 30, 30); hand(fmod(s / 60, 60) * 6, 45); hand(fmod(s, 60) * 6, 52);", ru: "hand(fmod(s / 3600, 12) * 30, 30); hand(fmod(s / 60, 60) * 6, 45); hand(fmod(s, 60) * 6, 52);" },
        check: { type: "image", maxDiff: 0.002 }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Taqqoslaş: GL_LINES va Brezenxeym", ru: "Задание 8. Сравнение: GL_LINES и Брезенхем" },
        text: { uz: "<p>Xuddi şu kesmani OpenGL ning <code>GL_LINES</code> primitivi bilan sariq rangda çizing (qalinligi 1). Havorang «katta piksellar» — bizning Brezenxeym, sariq çiziq — videokarta rastrlaşi (haqiqiy ekran piksellarida). Ikkalasi bir xil töğri çiziqni yaqinlaştiradi.</p>",
                ru: "<p>Нарисуйте тот же отрезок примитивом OpenGL <code>GL_LINES</code> жёлтым цветом (толщина 1). Голубые «крупные пиксели» — наш Брезенхем, жёлтая линия — растеризация видеокарты (в настоящих пикселях экрана). Обе приближают одну и ту же прямую.</p>" },
        hint: { uz: "glLineWidth(1); glBegin(GL_LINES); glVertex2f(5.5, 20.5); glVertex2f(155.5, 110.5); glEnd();", ru: "glLineWidth(1); glBegin(GL_LINES); glVertex2f(5.5, 20.5); glVertex2f(155.5, 110.5); glEnd();" },
        check: { type: "both", maxDiff: 0.003, calls: { "glLineWidth": ">=1" } }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
