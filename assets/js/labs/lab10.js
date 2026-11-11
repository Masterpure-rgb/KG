/* A10. Fraktal grafika: Serpinskiy, Mandelbrot, Julia, Kox (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n#include <cstdlib>\n\n#define W 400\n#define H 400\n\n";
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
    glutInitWindowSize(W, H);
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
  var BUF = `unsigned char img[W * H * 3];
void put(int x, int y, int r, int g, int b) { int k = (y * W + x) * 3; img[k] = r; img[k + 1] = g; img[k + 2] = b; }
void show() {
    glRasterPos2i(0, 0);
    glDrawPixels(W, H, GL_RGB, GL_UNSIGNED_BYTE, img);
}
// ${C("Palitra: iteratsiyalar soni n → rang (to'plam içi — qora)", "Палитра: число итераций n → цвет (внутри множества — чёрный)")}
void palette(int n, int maxIt, int c[3]) {
    if (n >= maxIt) { c[0] = c[1] = c[2] = 0; return; }
    double t = (double)n / maxIt;
    c[0] = (int)(9 * (1 - t) * t * t * t * 255);
    c[1] = (int)(15 * (1 - t) * (1 - t) * t * t * 255);
    c[2] = (int)(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
}

`;
  var SIERP = `// ${C("Uçburçak uçlari", "Вершины треугольника")}
float VX[3] = { 20, 380, 200 }, VY[3] = { 30, 30, 372 };

`;

  /* ---------- Misol: Serpinskiy (xaos öyini) ---------- */
  var ex = HEAD + SIERP + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    srand(1);
    float x = 200, y = 200;
    glPointSize(1.0f);
    glBegin(GL_POINTS);
    for (int i = 0; i < 20000; i++) {
        int k = rand() % 3;                       // ${C("tasodifiy uç", "случайная вершина")}
        x = (x + VX[k]) / 2;                      // ${C("unga qarab yarim yöl", "полпути к ней")}
        y = (y + VY[k]) / 2;
        glColor3f(0.4f + 0.3f * (k == 0), 0.6f + 0.3f * (k == 1), 0.8f + 0.2f * (k == 2));
        if (i > 20) glVertex2f(x, y);
    }
    glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A10: Serpinskiy");

  /* ---------- 1. Serpinskiy 50000 ---------- */
  var t1 = S(HEAD + SIERP + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    srand(1);
    glPointSize(1.0f);
    glColor3f(0.8f, 0.5f, 0.25f);                // ${C("jigarrang", "коричневый")}
    glBegin(GL_POINTS);
`, `    // ${C("TODO: x = 200, y = 200 dan boşlab 50 000 marta: k = rand() % 3; (x, y) ni VX[k], VY[k] ga qarab yarim yöl suring;", "TODO: начиная с x = 200, y = 200, 50 000 раз: k = rand() % 3; сдвиньте (x, y) на полпути к VX[k], VY[k];")}
    // ${C("dastlabki 20 ta nuqtadan keyin glVertex2f(x, y)", "после первых 20 точек — glVertex2f(x, y)")}
`, `    float x = 200, y = 200;
    for (int i = 0; i < 50000; i++) {
        int k = rand() % 3;
        x = (x + VX[k]) / 2;
        y = (y + VY[k]) / 2;
        if (i > 20) glVertex2f(x, y);             // ${C("dastlabki nuqtalar attraktorga hali yetmagan", "первые точки ещё не попали на аттрактор")}
    }
`, `    glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A10: Serpinskiy 50000"));

  /* ---------- 2. Mandelbrot ---------- */
  var MAND_PRE = HEAD + BUF + `// ${C("Mandelbrot: z₀ = 0, zₖ₊₁ = zₖ² + c; c — piksel koordinatasi", "Мандельброт: z₀ = 0, zₖ₊₁ = zₖ² + c; c — координата пикселя")}
int mandel(double cr, double ci, int maxIt) {
`;
  var MAND_BODY = `    double zr = 0, zi = 0;
    int n = 0;
    while (n < maxIt && zr * zr + zi * zi < 4) {   // ${C("|z| > 2 bölsa — qoçib ketadi", "если |z| > 2 — убегает в бесконечность")}
        double t = zr * zr - zi * zi + cr;           // ${C("Re(z² + c)", "Re(z² + c)")}
        zi = 2 * zr * zi + ci;                       // ${C("Im(z² + c)", "Im(z² + c)")}
        zr = t;
        n++;
    }
    return n;
`;
  var t2 = S(MAND_PRE, `    // ${C("TODO: z = 0 dan boşlab n < maxIt va |z|² < 4 ekan: z = z² + c; n++; n ni qaytaring", "TODO: начиная с z = 0, пока n < maxIt и |z|² < 4: z = z² + c; n++; верните n")}
    // ${C("(z² = (zr² − zi²) + 2·zr·zi·i)", "(z² = (zr² − zi²) + 2·zr·zi·i)")}
    return 0;
`, MAND_BODY, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    int c[3];
    for (int py = 0; py < H; py++)
        for (int px = 0; px < W; px++) {
            double cr = -2.2 + 3.0 * px / W, ci = -1.5 + 3.0 * py / H;   // ${C("soha: [−2,2; 0,8] × [−1,5; 1,5]", "область: [−2,2; 0,8] × [−1,5; 1,5]")}
            palette(mandel(cr, ci, 200), 200, c);
            put(px, py, c[0], c[1], c[2]);
        }
    show();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A10: Mandelbrot"));

  /* ---------- 3. Julia ---------- */
  var JULIA_PRE = HEAD + BUF + `// ${C("Julia: z₀ = piksel, c — özgarmas", "Жюлиа: z₀ = пиксель, c — константа")}
double CR = -0.7, CI = 0.27;

int julia(double zr, double zi, int maxIt) {
    int n = 0;
`;
  var JULIA_BODY = `    while (n < maxIt && zr * zr + zi * zi < 4) {
        double t = zr * zr - zi * zi + CR;
        zi = 2 * zr * zi + CI;
        zr = t;
        n++;
    }
`;
  var JULIA_DISP = `    return n;
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    int c[3];
    for (int py = 0; py < H; py++)
        for (int px = 0; px < W; px++) {
            palette(julia(-1.6 + 3.2 * px / W, -1.6 + 3.2 * py / H, 150), 150, c);
            put(px, py, c[0], c[1], c[2]);
        }
    show();
    glutSwapBuffers();
}

`;
  var t3 = S(JULIA_PRE, `    // ${C("TODO: Mandelbrotdagi kabi sikl, lekin z boşlanğiç qiymati — piksel, c esa (CR, CI)", "TODO: цикл как у Мандельброта, но z стартует с пикселя, а c = (CR, CI)")}
`, JULIA_BODY, JULIA_DISP + RESHAPE + MAIN("A10: Julia"));

  /* ---------- 4. Dinamik Julia ---------- */
  var t4 = S(JULIA_PRE + JULIA_BODY + JULIA_DISP, `// ${C("TODO: special(): ←/→ CR ni ∓0,02 ga, ↑/↓ CI ni ±0,02 ga özgartiradi; c ni printf bilan çiqaring; glutPostRedisplay()", "TODO: special(): ←/→ меняют CR на ∓0,02, ↑/↓ — CI на ±0,02; выводите c через printf; glutPostRedisplay()")}
void special(int key, int x, int y) { }
`, `void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  CR -= 0.02;
    if (key == GLUT_KEY_RIGHT) CR += 0.02;
    if (key == GLUT_KEY_UP)    CI += 0.02;
    if (key == GLUT_KEY_DOWN)  CI -= 0.02;
    printf("c = %.2f %+.2fi\\n", CR, CI);
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A10: dinamik Julia", "    glutSpecialFunc(special);\n"));

  /* ---------- 5. Zoom ---------- */
  var t5 = S(MAND_PRE + MAND_BODY + `}

// ${C("Körinish: markaz (cx, cy) va masştab zoom (1 — töliq to'plam)", "Вид: центр (cx, cy) и масштаб zoom (1 — всё множество)")}
double cx = -0.7453, cy = 0.1127, zoom = 100;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    int c[3];
`, `    // ${C("TODO: körinish kengligi span = 3 / zoom; piksel → c: cr = cx + span·(px/W − 0,5), ci = cy + span·(py/H − 0,5)", "TODO: ширина вида span = 3 / zoom; пиксель → c: cr = cx + span·(px/W − 0,5), ci = cy + span·(py/H − 0,5)")}
    // ${C("iteratsiyalar zoom bilan oşsin: maxIt = 100 + 50·log2(zoom)", "итерации растут с zoom: maxIt = 100 + 50·log2(zoom)")}
    double span = 3;
    int maxIt = 100;
    double x0 = -0.7, y0 = 0;
`, `    double span = 3.0 / zoom;
    int maxIt = 100 + (int)(50 * log(zoom) / log(2.0));
    double x0 = cx, y0 = cy;
`, `    for (int py = 0; py < H; py++)
        for (int px = 0; px < W; px++) {
            double cr = x0 + span * ((double)px / W - 0.5), ci = y0 + span * ((double)py / H - 0.5);
            palette(mandel(cr, ci, maxIt), maxIt, c);
            put(px, py, c[0], c[1], c[2]);
        }
    show();
    glutSwapBuffers();
}

// ${C("'+' / '-' — zoom ×2 / ÷2, strelkalar — markazni suriş (körinish kengligining 10%)", "'+' / '-' — zoom ×2 / ÷2, стрелки — сдвиг центра (10% ширины вида)")}
void keyboard(unsigned char key, int x, int y) {
    if (key == '+') zoom *= 2;
    if (key == '-' && zoom > 1) zoom /= 2;
    printf("zoom = %g\\n", zoom);
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    double s = 0.3 / zoom;
    if (key == GLUT_KEY_LEFT) cx -= s;
    if (key == GLUT_KEY_RIGHT) cx += s;
    if (key == GLUT_KEY_UP) cy += s;
    if (key == GLUT_KEY_DOWN) cy -= s;
    glutPostRedisplay();
}

` + RESHAPE + MAIN("A10: zoom", "    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  /* ---------- 6. Palitralar ---------- */
  var t6 = S(MAND_PRE + MAND_BODY + `}

int pal = 3;     // ${C("1 — sovuq, 2 — iliq, 3 — HSV spiral", "1 — холодная, 2 — тёплая, 3 — HSV-спираль")}

// ${C("HSV → RGB: h ∈ [0; 360), s, v ∈ [0; 1]", "HSV → RGB: h ∈ [0; 360), s, v ∈ [0; 1]")}
void hsv(double h, double s, double v, int c[3]) {
`, `    // ${C("TODO: i = floor(h/60) % 6, f = h/60 − floor(h/60), p = v(1 − s), q = v(1 − s·f), t = v(1 − s(1 − f));", "TODO: i = floor(h/60) % 6, f = h/60 − floor(h/60), p = v(1 − s), q = v(1 − s·f), t = v(1 − s(1 − f));")}
    // ${C("i böyiça (r, g, b) = (v,t,p), (q,v,p), (p,v,t), (p,q,v), (t,p,v), (v,p,q); keyin ×255", "по i: (r, g, b) = (v,t,p), (q,v,p), (p,v,t), (p,q,v), (t,p,v), (v,p,q); затем ×255")}
    c[0] = c[1] = c[2] = (int)(v * 255);
`, `    double hh = h / 60;
    int i = (int)floor(hh) % 6;
    double f = hh - floor(hh), p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
    double r, g, b;
    if (i == 0) { r = v; g = t; b = p; }
    else if (i == 1) { r = q; g = v; b = p; }
    else if (i == 2) { r = p; g = v; b = t; }
    else if (i == 3) { r = p; g = q; b = v; }
    else if (i == 4) { r = t; g = p; b = v; }
    else { r = v; g = p; b = q; }
    c[0] = (int)(r * 255); c[1] = (int)(g * 255); c[2] = (int)(b * 255);
`, `}

void color(int n, int maxIt, int c[3]) {
    if (n >= maxIt) { c[0] = c[1] = c[2] = 0; return; }
    double t = (double)n / maxIt;
    if (pal == 1) { c[0] = (int)(40 * t); c[1] = (int)(255 * sqrt(t)); c[2] = (int)(120 + 135 * t); }   // ${C("sovuq", "холодная")}
    else if (pal == 2) { c[0] = (int)(255 * sqrt(t)); c[1] = (int)(200 * t); c[2] = (int)(40 * t); }   // ${C("iliq", "тёплая")}
    else hsv(fmod(220 + n * 9.0, 360.0), 0.8, n < 12 ? 0.15 + n / 14.0 : 1.0, c);                // ${C("HSV spiral", "HSV-спираль")}
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    int c[3];
    for (int py = 0; py < H; py++)
        for (int px = 0; px < W; px++) {
            color(mandel(-2.2 + 3.0 * px / W, -1.5 + 3.0 * py / H, 200), 200, c);
            put(px, py, c[0], c[1], c[2]);
        }
    show();
    glutSwapBuffers();
}

void keyboard(unsigned char key, int x, int y) {
    if (key >= '1' && key <= '3') { pal = key - '0'; glutPostRedisplay(); }
}

` + RESHAPE + MAIN("A10: palitra", "    glutKeyboardFunc(keyboard);\n"));

  /* ---------- 7. Kox qor parçasi ---------- */
  var t7 = S(HEAD + `// ${C("Kox egri çiziği: kesmani 3 ga bölib, örta qismi örniga «tepalik» qöyamiz", "Кривая Коха: делим отрезок на 3 части, среднюю заменяем «пиком»")}
void koch(double x1, double y1, double x2, double y2, int depth) {
    if (depth == 0) {
        glVertex2d(x1, y1);
        glVertex2d(x2, y2);
        return;
    }
`, `    // ${C("TODO: A = P1 + (P2−P1)/3, B = P1 + 2(P2−P1)/3; tepalik T — AB kesmasini A atrofida −60° ga burişdan:", "TODO: A = P1 + (P2−P1)/3, B = P1 + 2(P2−P1)/3; вершина T — поворот AB вокруг A на −60°:")}
    // ${C("T = A + R(−60°)·(B − A); keyin 4 ta rekursiv çaqiriq: P1–A, A–T, T–B, B–P2 (depth − 1)", "T = A + R(−60°)·(B − A); затем 4 рекурсивных вызова: P1–A, A–T, T–B, B–P2 (depth − 1)")}
    koch(x1, y1, x2, y2, 0);
`, `    double dx = (x2 - x1) / 3, dy = (y2 - y1) / 3;
    double ax = x1 + dx, ay = y1 + dy;
    double bx = x1 + 2 * dx, by = y1 + 2 * dy;
    double c = cos(-3.14159265 / 3), s = sin(-3.14159265 / 3);
    double tx = ax + dx * c - dy * s, ty = ay + dx * s + dy * c;
    koch(x1, y1, ax, ay, depth - 1);
    koch(ax, ay, tx, ty, depth - 1);
    koch(tx, ty, bx, by, depth - 1);
    koch(bx, by, x2, y2, depth - 1);
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glColor3f(0.6f, 0.85f, 1.0f);
    glLineWidth(1.5f);
    // ${C("Teng tomonli uçburçak (uçlar soat strelkasiga qarşi) — har tomoni Kox egri çiziğiga aylanadi", "Равносторонний треугольник (вершины против часовой стрелки) — каждая сторона становится кривой Коха")}
    double R = 150, cxp = 200, cyp = 200;
    double px[3], py[3];
    for (int k = 0; k < 3; k++) { double a = 3.14159265 / 2 + k * 2 * 3.14159265 / 3; px[k] = cxp + R * cos(a); py[k] = cyp + R * sin(a); }
    glBegin(GL_LINES);
    for (int k = 0; k < 3; k++) koch(px[k], py[k], px[(k + 1) % 3], py[(k + 1) % 3], 4);
    glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A10: Kox"));

  /* ---------- 8. z³ + c ---------- */
  var t8 = S(HEAD + BUF + `// ${C("Multibrot: zₖ₊₁ = zₖ³ + c", "Мультиброт: zₖ₊₁ = zₖ³ + c")}
int multi(double cr, double ci, int maxIt) {
    double zr = 0, zi = 0;
    int n = 0;
    while (n < maxIt && zr * zr + zi * zi < 4) {
`, `        // ${C("TODO: z³ = (zr³ − 3·zr·zi²) + (3·zr²·zi − zi³)·i; z = z³ + c", "TODO: z³ = (zr³ − 3·zr·zi²) + (3·zr²·zi − zi³)·i; z = z³ + c")}
        double t = zr * zr - zi * zi + cr;
        zi = 2 * zr * zi + ci;
        zr = t;
`, `        double t = zr * zr * zr - 3 * zr * zi * zi + cr;
        zi = 3 * zr * zr * zi - zi * zi * zi + ci;
        zr = t;
`, `        n++;
    }
    return n;
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    int c[3];
    for (int py = 0; py < H; py++)
        for (int px = 0; px < W; px++) {
            palette(multi(-1.5 + 3.0 * px / W, -1.5 + 3.0 * py / H, 150), 150, c);
            put(px, py, c[0], c[1], c[2]);
        }
    show();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A10: z^3 + c"));

  LAB.define({
    n: 10,
    title: { uz: "Fraktal grafikasi asosida tasvir şakllarini yaratiş", ru: "Построение изображений на основе фрактальной графики" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: Serpinskiy uçburçagi (xaos öyini)", ru: "Пример: треугольник Серпинского («игра хаоса»)" },
        text: { uz: "<p><b>Xaos öyini</b>: ixtiyoriy nuqtadan boşlab, har qadamda uçburçakning tasodifiy uçini tanlaymiz va unga qarab yarim yöl yuramiz. Tasodifiy jarayon natijasida <b>tartibli</b> fraktal — Serpinskiy uçburçagi hosil böladi. Fraktal — özining qismlariga öxşaş (öziga öxşaş) şakl.</p>",
                ru: "<p><b>Игра хаоса</b>: начиная с произвольной точки, на каждом шаге выбираем случайную вершину треугольника и проходим к ней полпути. Случайный процесс даёт <b>упорядоченный</b> фрактал — треугольник Серпинского. Фрактал — фигура, подобная своим частям (самоподобная).</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Serpinskiy — 50 000 nuqta", ru: "Задание 1. Серпинский — 50 000 точек" },
        text: { uz: "<p>Xaos öyini siklini özingiz yozing: 50 000 ta nuqta, rangi jigarrang. <code>srand(1)</code> tufayli tasodifiy sonlar ketma-ketligi har gal bir xil — natija etalon bilan aynan mos tuşadi. Dastlabki ~20 nuqtani çizmang: ular hali attraktorga yetib bormagan.</p>",
                ru: "<p>Напишите цикл игры хаоса сами: 50 000 точек коричневого цвета. Благодаря <code>srand(1)</code> последовательность случайных чисел каждый раз одинакова — результат точно совпадёт с эталоном. Первые ~20 точек не рисуйте: они ещё не попали на аттрактор.</p>" },
        hint: { uz: "for (i < 50000) { k = rand() % 3; x = (x + VX[k]) / 2; y = (y + VY[k]) / 2; if (i > 20) glVertex2f(x, y); }", ru: "for (i < 50000) { k = rand() % 3; x = (x + VX[k]) / 2; y = (y + VY[k]) / 2; if (i > 20) glVertex2f(x, y); }" },
        check: { type: "image", maxDiff: 0.004 }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Mandelbrot to'plami", ru: "Задание 2. Множество Мандельброта" },
        text: { uz: "<p>Har bir piksel kompleks son c ga mos keladi. z₀ = 0 dan boşlab zₖ₊₁ = zₖ² + c ni takrorlang: agar |z| > 2 bölsa — nuqta qoçib ketadi, takrorlar soni n rangni belgilaydi; 200 takrordan keyin ham qoçmasa — nuqta to'plamga tegişli (qora).</p>",
                ru: "<p>Каждому пикселю соответствует комплексное число c. Повторяйте zₖ₊₁ = zₖ² + c, начиная с z₀ = 0: если |z| > 2 — точка убегает, число итераций n задаёт цвет; если и после 200 итераций не убежала — точка принадлежит множеству (чёрная).</p>" },
        hint: { uz: "while (n < maxIt && zr² + zi² < 4) { t = zr² − zi² + cr; zi = 2·zr·zi + ci; zr = t; n++; }", ru: "while (n < maxIt && zr² + zi² < 4) { t = zr² − zi² + cr; zi = 2·zr·zi + ci; zr = t; n++; }" },
        check: { type: "both", calls: { "glDrawPixels": ">=1" } }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Julia to'plami", ru: "Задание 3. Множество Жюлиа" },
        text: { uz: "<p>Julia to'plami Mandelbrotga «teskari»: c = −0,7 + 0,27i — özgarmas, z ning boşlanğiç qiymati esa piksel koordinatasi. Formulasi xuddi şu: zₖ₊₁ = zₖ² + c. Har bir c uçun öz Julia to'plami bor.</p>",
                ru: "<p>Множество Жюлиа «обратно» Мандельброту: c = −0,7 + 0,27i — константа, а начальное z — координата пикселя. Формула та же: zₖ₊₁ = zₖ² + c. Для каждого c — своё множество Жюлиа.</p>" },
        hint: { uz: "Sikl: t = zr² − zi² + CR; zi = 2·zr·zi + CI; zr = t; n++;", ru: "Цикл: t = zr² − zi² + CR; zi = 2·zr·zi + CI; zr = t; n++;" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Dinamik Julia", ru: "Задание 4. Динамическое множество Жюлиа" },
        text: { uz: "<p>c ni strelkalar bilan özgartiring: ←/→ — haqiqiy qism, ↑/↓ — mavhum qism (qadam 0,02). Julia şakli jonli özgaradi: c Mandelbrot to'plami içida bölsa — Julia «yaxlit», taşqarida bölsa — «çang»ga aylanadi. Joriy c ni konsolga çiqaring.</p>",
                ru: "<p>Меняйте c стрелками: ←/→ — вещественная часть, ↑/↓ — мнимая (шаг 0,02). Форма Жюлиа меняется вживую: если c внутри множества Мандельброта — Жюлиа «связное», снаружи — рассыпается в «пыль». Выводите текущее c в консоль.</p>" },
        hint: { uz: "if (key == GLUT_KEY_LEFT) CR −= 0.02; … printf(\"c = %.2f %+.2fi\\n\", CR, CI); glutPostRedisplay();", ru: "if (key == GLUT_KEY_LEFT) CR −= 0.02; … printf(\"c = %.2f %+.2fi\\n\", CR, CI); glutPostRedisplay();" },
        check: { type: "calls", source: [{ re: "glutSpecialFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutSpecialFunc(special) ni qayd qiling", ru: "Зарегистрируйте glutSpecialFunc(special)" } }, { re: "CR\\s*[-+]=", msg: { uz: "Strelkalar CR ni özgartirsin", ru: "Стрелки должны менять CR" } }, { re: "CI\\s*[-+]=", msg: { uz: "Strelkalar CI ni özgartirsin", ru: "Стрелки должны менять CI" } }] }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Zoom", ru: "Задание 5. Масштабирование" },
        text: { uz: "<p>Mandelbrot tasvirini kattalaştiring: körinish markazi (cx, cy) = (−0,7453; 0,1127) («dengiz otlari vodiysi»), masştab zoom = 100. Körinish kengligi 3/zoom. Kattalaştirişda detallar köpayadi, şuning uçun iteratsiyalar soni ham oşişi kerak: maxIt = 100 + 50·log₂(zoom). '+'/'−' va strelkalar bilan tekşiring.</p>",
                ru: "<p>Увеличьте изображение Мандельброта: центр вида (cx, cy) = (−0,7453; 0,1127) («долина морских коньков»), масштаб zoom = 100. Ширина вида 3/zoom. При увеличении деталей становится больше, поэтому должно расти и число итераций: maxIt = 100 + 50·log₂(zoom). Проверьте клавишами '+'/'−' и стрелками.</p>" },
        hint: { uz: "span = 3.0 / zoom; maxIt = 100 + (int)(50·log(zoom)/log(2)); x0 = cx; y0 = cy;", ru: "span = 3.0 / zoom; maxIt = 100 + (int)(50·log(zoom)/log(2)); x0 = cx; y0 = cy;" },
        check: { type: "image" }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Rangli palitralar", ru: "Задание 6. Цветовые палитры" },
        text: { uz: "<p>Mandelbrotni 3 xil palitrada körsating: 1 — sovuq, 2 — iliq, 3 — <b>HSV spiral</b> (ton h = 220 + 9·n gradus). HSV → RGB ötkazgiç funksiyasini yozing: ton aylanasi 6 ta 60° li sektorga bölinadi. Boşlanğiç palitra — 3; 1/2/3 tugmalari bilan almaştiring.</p>",
                ru: "<p>Покажите Мандельброт в 3 палитрах: 1 — холодная, 2 — тёплая, 3 — <b>HSV-спираль</b> (тон h = 220 + 9·n градусов). Напишите функцию перевода HSV → RGB: круг тонов делится на 6 секторов по 60°. Начальная палитра — 3; переключение клавишами 1/2/3.</p>" },
        hint: { uz: "i = 0: (v,t,p); 1: (q,v,p); 2: (p,v,t); 3: (p,q,v); 4: (t,p,v); 5: (v,p,q).", ru: "i = 0: (v,t,p); 1: (q,v,p); 2: (p,v,t); 3: (p,q,v); 4: (t,p,v); 5: (v,p,q)." },
        check: { type: "image" }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Kox qor parçasi", ru: "Задание 7. Снежинка Коха" },
        text: { uz: "<p>Rekursiv <code>koch</code> funksiyasini yozing: kesma 3 ga bölinadi, örta uçdan biri örniga teng tomonli uçburçakning ikki tomoni qöyiladi. 4 iteratsiyadan keyin uçburçakning har bir tomoni 4⁴ = 256 ta kesmaga aylanadi — Kox qor parçasi. Uning perimetri cheksizga intiladi, yuzi esa çekli.</p>",
                ru: "<p>Напишите рекурсивную функцию <code>koch</code>: отрезок делится на 3 части, средняя заменяется двумя сторонами равностороннего треугольника. После 4 итераций каждая сторона превращается в 4⁴ = 256 отрезков — снежинка Коха. Её периметр стремится к бесконечности, а площадь конечна.</p>" },
        hint: { uz: "tx = ax + dx·cos(−60°) − dy·sin(−60°); ty = ay + dx·sin(−60°) + dy·cos(−60°); keyin 4 ta koch(..., depth − 1).", ru: "tx = ax + dx·cos(−60°) − dy·sin(−60°); ty = ay + dx·sin(−60°) + dy·cos(−60°); затем 4 вызова koch(..., depth − 1)." },
        check: { type: "both", maxDiff: 0.003, calls: { "glVertex2d": ">=1536" } }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Boşqa formula: z³ + c", ru: "Задание 8. Другая формула: z³ + c" },
        text: { uz: "<p>zₖ₊₁ = zₖ³ + c formulasi uçun fraktalni (<b>multibrot</b>) çizing. Kompleks sonning kubi: z³ = (x³ − 3xy²) + (3x²y − y³)i. Mandelbrot dan farqi: to'plam 2 tomonlama simmetriyaga ega va ikkita katta «yuraksimon» qismdan iborat. Hisobotda tuşuntiring.</p>",
                ru: "<p>Нарисуйте фрактал для формулы zₖ₊₁ = zₖ³ + c (<b>мультиброт</b>). Куб комплексного числа: z³ = (x³ − 3xy²) + (3x²y − y³)i. Отличие от Мандельброта: множество имеет двукратную симметрию и состоит из двух больших «кардиоидных» частей. Объясните в отчёте.</p>" },
        hint: { uz: "t = zr³ − 3·zr·zi² + cr; zi = 3·zr²·zi − zi³ + ci; zr = t;", ru: "t = zr³ − 3·zr·zi² + cr; zi = 3·zr²·zi − zi³ + ci; zr = t;" },
        check: { type: "image" }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
