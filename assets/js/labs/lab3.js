/* A3. Splayn sirtlar: Beze va B-splayn sirtlari (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n";
  var CORE = `struct Point { double x, y, z; };

// ${C("Bernşteyn köphadlari (Beze bazisi)", "Многочлены Бернштейна (базис Безье)")}
void bern(double t, double b[4]) {
    double m = 1 - t;
    b[0] = m*m*m; b[1] = 3*t*m*m; b[2] = 3*t*t*m; b[3] = t*t*t;
}
// ${C("Bir jinsli kub B-splayn bazisi", "Базис однородного кубического B-сплайна")}
void bsp(double t, double b[4]) {
    b[0] = (1-t)*(1-t)*(1-t) / 6;
    b[1] = (3*t*t*t - 6*t*t + 4) / 6;
    b[2] = (-3*t*t*t + 3*t*t + 3*t + 1) / 6;
    b[3] = t*t*t / 6;
}
// ${C("Sirt nuqtasi: S(s, t) = Σ Σ Bᵢ(s)·Bⱼ(t)·Pᵢⱼ", "Точка поверхности: S(s, t) = Σ Σ Bᵢ(s)·Bⱼ(t)·Pᵢⱼ")}
Point surf(Point P[4][4], double s, double t, int spline) {
    double B[4], Cc[4];
    if (spline) { bsp(s, B); bsp(t, Cc); } else { bern(s, B); bern(t, Cc); }
    Point r = {0, 0, 0};
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) {
            r.x += B[i] * Cc[j] * P[i][j].x;
            r.y += B[i] * Cc[j] * P[i][j].y;
            r.z += B[i] * Cc[j] * P[i][j].z;
        }
    return r;
}
// ${C("Balandlik böyiça rang: past — kök, baland — sariq", "Цвет по высоте: низко — синий, высоко — жёлтый")}
void hcolor(double z) {
    double t = z / 4.0;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    glColor3f(0.15 + 0.85 * t, 0.35 + 0.5 * t, 0.85 - 0.55 * t);
}
Point G[33][33];
// ${C("Sirtni N×N törtburçaklar bilan çiziş (spline = 1 — B-splayn)", "Рисование поверхности сеткой N×N четырёхугольников (spline = 1 — B-сплайн)")}
void drawSurface(Point P[4][4], int N, int spline) {
    for (int i = 0; i <= N; i++)
        for (int j = 0; j <= N; j++)
            G[i][j] = surf(P, (double)i / N, (double)j / N, spline);
    glBegin(GL_QUADS);
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++) {
            hcolor(G[i][j].z);         glVertex3d(G[i][j].x, G[i][j].y, G[i][j].z);
            hcolor(G[i+1][j].z);       glVertex3d(G[i+1][j].x, G[i+1][j].y, G[i+1][j].z);
            hcolor(G[i+1][j+1].z);     glVertex3d(G[i+1][j+1].x, G[i+1][j+1].y, G[i+1][j+1].z);
            hcolor(G[i][j+1].z);       glVertex3d(G[i][j+1].x, G[i][j+1].y, G[i][j+1].z);
        }
    glEnd();
}
// ${C("Tayanç tör (kulrang çiziqlar va nuqtalar)", "Опорная сетка (серые линии и точки)")}
void drawNet(Point P[4][4]) {
    glColor3f(0.75f, 0.8f, 0.9f);
    glLineWidth(1.0f);
    for (int i = 0; i < 4; i++) {
        glBegin(GL_LINE_STRIP);
        for (int j = 0; j < 4; j++) glVertex3d(P[i][j].x, P[i][j].y, P[i][j].z);
        glEnd();
        glBegin(GL_LINE_STRIP);
        for (int j = 0; j < 4; j++) glVertex3d(P[j][i].x, P[j][i].y, P[j][i].z);
        glEnd();
    }
    glPointSize(6.0f);
    glBegin(GL_POINTS);
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) glVertex3d(P[i][j].x, P[i][j].y, P[i][j].z);
    glEnd();
}
// ${C("Tekis 4×4 tör: x = i, y = j, z = 0", "Плоская сетка 4×4: x = i, y = j, z = 0")}
void flatNet(Point P[4][4], double x0) {
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) { P[i][j].x = x0 + i; P[i][j].y = j; P[i][j].z = 0; }
}

`;
  function VIEW(cx) {
    return `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(${cx} + 5.5, -5.0, 6.5,  ${cx}, 1.5, 0.8,  0, 0, 1);   // ${C("z — yuqoriga", "z — вверх")}
`;
  }
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(40.0, (double)w / h, 0.5, 100.0);
    glMatrixMode(GL_MODELVIEW);
}
`;
  function MAIN(title, extra) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(480, 360);
    glutCreateWindow("${title}");
    glClearColor(0.08f, 0.11f, 0.2f, 1.0f);
    glEnable(GL_DEPTH_TEST);
${extra || ""}    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutMainLoop();
    return 0;
}
`;
  }
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }

  var P16 = `// ${C("16 ta tayanç nuqta (uslubiy körsatmadagi misol)", "16 опорных точек (пример из методички)")}
Point P[4][4] = {
    { {0,0,0}, {1,0,2}, {2,0,2}, {3,0,0} },
    { {0,1,2}, {1,1,4}, {2,1,4}, {3,1,2} },
    { {0,2,2}, {1,2,4}, {2,2,4}, {3,2,2} },
    { {0,3,0}, {1,3,2}, {2,3,2}, {3,3,0} }
};

`;
  /* ---------- Misol ---------- */
  var ex = HEAD + CORE + P16 + `void display() {
` + VIEW(1.5) + `    drawSurface(P, 16, 0);
    drawNet(P);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A3: Beze sirti");

  /* ---------- 1. Egar ---------- */
  var t1 = S(HEAD + CORE + `Point P[4][4];

void build() {
    flatNet(P, 0);
`, `    // ${C("TODO: «egar» uçun z = 1,2·((i − 1,5)² − (j − 1,5)²) + 1,5 qiymatlarini bering", "TODO: для «седла» задайте z = 1,2·((i − 1,5)² − (j − 1,5)²) + 1,5")}
`, `    // ${C("Giperbolik paraboloid: bir yönalişda kötarilib, ikkinçisida tuşadi", "Гиперболический параболоид: в одном направлении поднимается, в другом опускается")}
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            P[i][j].z = 1.2 * ((i - 1.5) * (i - 1.5) - (j - 1.5) * (j - 1.5)) + 1.5;
`, `}

void display() {
` + VIEW(1.5) + `    drawSurface(P, 16, 0);
    drawNet(P);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A3: egar", "    build();\n"));

  /* ---------- 2. Tepalik ---------- */
  var t2 = S(HEAD + CORE + `Point P[4][4];

void build() {
    flatNet(P, 0);
`, `    // ${C("TODO: markaziy 4 ta nuqtani (i, j ∈ {1, 2}) z = 4 ga kötaring", "TODO: поднимите 4 центральные точки (i, j ∈ {1, 2}) до z = 4")}
`, `    P[1][1].z = 4; P[1][2].z = 4;
    P[2][1].z = 4; P[2][2].z = 4;
`, `}

void display() {
` + VIEW(1.5) + `    drawSurface(P, 16, 0);
    drawNet(P);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A3: tepalik", "    build();\n"));

  /* ---------- 3–4. Ikki qism ---------- */
  var TWO = `Point A[4][4], B[4][4];

void build() {
    flatNet(A, 0);
    flatNet(B, 3);
    // ${C("Birinçi qism: ikki qatorli tepalik", "Первый лоскут: двойной холм")}
    A[1][1].z = 3; A[1][2].z = 3; A[2][1].z = 2.5; A[2][2].z = 2.5;
    for (int j = 0; j < 4; j++) A[3][j].z = 1.5;
    // ${C("Ikkinçi qism", "Второй лоскут")}
    B[1][1].z = 0.5; B[1][2].z = 0.5; B[2][1].z = 2; B[2][2].z = 2;
    for (int j = 0; j < 4; j++) B[3][j].z = 0.5;
`;
  var TWO_POST = `}

void display() {
` + VIEW(3) + `    drawSurface(A, 12, 0);
    drawSurface(B, 12, 0);
    drawNet(A);
    drawNet(B);
    glutSwapBuffers();
}

` + RESHAPE;
  var t3 = S(HEAD + CORE + TWO, `    // ${C("TODO: C0 uzluksizlik — B ning birinçi qatori (B[0][j]) A ning oxirgi qatori (A[3][j]) bilan bir xil bölsin", "TODO: непрерывность C0 — первая строка B (B[0][j]) должна совпадать с последней строкой A (A[3][j])")}
`, `    // ${C("Umumiy qirra: ikkala qismning çegaraviy nuqtalari ustma-ust", "Общая граница: граничные точки обоих лоскутов совпадают")}
    for (int j = 0; j < 4; j++) B[0][j] = A[3][j];
`, TWO_POST + MAIN("A3: C0", "    build();\n"));
  var t4 = S(HEAD + CORE + TWO + `    for (int j = 0; j < 4; j++) B[0][j] = A[3][j];      // C0
`, `    // ${C("TODO: C1 — B[1][j] nuqtasi A[2][j] ning B[0][j] ga nisbatan simmetrigi bölsin: B[1] = 2·A[3] − A[2]", "TODO: C1 — точка B[1][j] симметрична A[2][j] относительно B[0][j]: B[1] = 2·A[3] − A[2]")}
`, `    // ${C("Ulaniş çizig'i atrofidagi tayanç nuqtalar bir töğri çiziqda va teng masofada", "Опорные точки по обе стороны стыка — на одной прямой и на равных расстояниях")}
    for (int j = 0; j < 4; j++) {
        B[1][j].x = 2 * A[3][j].x - A[2][j].x;
        B[1][j].y = 2 * A[3][j].y - A[2][j].y;
        B[1][j].z = 2 * A[3][j].z - A[2][j].z;
    }
`, TWO_POST + MAIN("A3: C1", "    build();\n"));

  /* ---------- 5. B-splayn sirti ---------- */
  var t5 = S(HEAD + CORE + P16 + `void display() {
` + VIEW(1.5) + `    drawNet(P);
`, `    // ${C("TODO: Beze sirti örniga xuddi şu tör böyiça B-splayn sirtini çizing (drawSurface ning 3-parametri)", "TODO: вместо поверхности Безье нарисуйте B-сплайновую поверхность по той же сетке (3-й параметр drawSurface)")}
    drawSurface(P, 16, 0);
`, `    drawSurface(P, 16, 1);        // ${C("B-splayn: tayanç nuqtalardan ötmaydi, ancha «yumşoq»", "B-сплайн: не проходит через опорные точки, «мягче»")}
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A3: B-splayn sirti"));

  /* ---------- 6. Çaynik qopqoği ---------- */
  var t6 = S(HEAD + CORE + `// ${C("Qopqoq profili (r, z): çetidan töpasigaça", "Профиль крышки (r, z): от края к макушке")}
double PR[4] = { 2.0, 2.0, 1.0, 0.0 };
double PZ[4] = { 0.0, 0.8, 1.6, 1.8 };
// ${C("Çorak aylana uçun Beze tayanç nuqtalari (k = 0,5523)", "Опорные точки Безье для четверти окружности (k = 0,5523)")}
double CX[4] = { 1.0, 1.0, 0.5523, 0.0 };
double CY[4] = { 0.0, 0.5523, 1.0, 1.0 };
Point Q[4][4];

void build() {
`, `    // ${C("TODO: Q[i][j] = (PR[i]·CX[j], PR[i]·CY[j], PZ[i]) — profil × çorak aylana", "TODO: Q[i][j] = (PR[i]·CX[j], PR[i]·CY[j], PZ[i]) — профиль × четверть окружности")}
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) { Q[i][j].x = 0; Q[i][j].y = 0; Q[i][j].z = 0; }
`, `    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) {
            Q[i][j].x = PR[i] * CX[j];
            Q[i][j].y = PR[i] * CY[j];
            Q[i][j].z = PZ[i];
        }
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(5.0, -5.5, 4.5,  0, 0, 0.7,  0, 0, 1);
    // ${C("4 ta bir xil qism, har biri 90° ga burilgan", "4 одинаковых лоскута, каждый повёрнут на 90°")}
    for (int k = 0; k < 4; k++) {
        glPushMatrix();
        glRotatef(90.0f * k, 0, 0, 1);
        drawSurface(Q, 12, 0);
        glPopMatrix();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A3: qopqoq", "    build();\n"));

  /* ---------- 7. Interaktiv ---------- */
  var t7 = S(HEAD + CORE + P16 + `int cur = 5;     // ${C("tanlangan nuqta raqami 0..15: i = cur / 4, j = cur % 4", "номер выбранной точки 0..15: i = cur / 4, j = cur % 4")}

void display() {
` + VIEW(1.5) + `    drawSurface(P, 16, 0);
    drawNet(P);
    Point q = P[cur / 4][cur % 4];
    glPointSize(12.0f);
    glColor3f(1.0f, 0.3f, 0.3f);
    glBegin(GL_POINTS); glVertex3d(q.x, q.y, q.z); glEnd();
    glutSwapBuffers();
}

`, `// ${C("TODO 1: keyboard(): 'n' — keyingi nuqta (cur = (cur + 1) % 16), 'p' — oldingi", "TODO 1: keyboard(): 'n' — следующая точка (cur = (cur + 1) % 16), 'p' — предыдущая")}
// ${C("TODO 2: special(): ↑ / ↓ tanlangan nuqtaning z ini ±0,5 ga özgartiradi", "TODO 2: special(): ↑ / ↓ меняют z выбранной точки на ±0,5")}
// ${C("TODO 3: ikkala funksiyani main() da qayd qiling", "TODO 3: зарегистрируйте обе функции в main()")}
void keyboard(unsigned char key, int x, int y) { }
void special(int key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    if (key == 'n') cur = (cur + 1) % 16;
    if (key == 'p') cur = (cur + 15) % 16;
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_UP)   P[cur / 4][cur % 4].z += 0.5;
    if (key == GLUT_KEY_DOWN) P[cur / 4][cur % 4].z -= 0.5;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A3: interaktiv", "    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  /* ---------- 8. Sifat ---------- */
  var t8 = S(HEAD + CORE + P16 + `int N = 4;       // ${C("bölinmalar soni", "число разбиений")}

void display() {
` + VIEW(1.5) + `    int t0 = glutGet(GLUT_ELAPSED_TIME);
    drawSurface(P, N, 0);
    // ${C("Çiziş vaqti va törtburçaklar soni konsolga", "Время рисования и число четырёхугольников — в консоль")}
    printf("N = %d: %d quads, %d ms\\n", N, N * N, glutGet(GLUT_ELAPSED_TIME) - t0);
    glutSwapBuffers();
}

`, `// ${C("TODO 1: keyboard(): '+' N ni ikki baravar oşiradi (32 gaça), '-' kamaytiradi (4 gaça)", "TODO 1: keyboard(): '+' удваивает N (до 32), '-' уменьшает вдвое (до 4)")}
// ${C("TODO 2: boşlanğiç qiymatni N = 32 qiling va natijani N = 4 bilan soliştiring", "TODO 2: сделайте начальное значение N = 32 и сравните с N = 4")}
void keyboard(unsigned char key, int x, int y) { }

void init() { }
`, `void keyboard(unsigned char key, int x, int y) {
    if (key == '+' && N < 32) N *= 2;
    if (key == '-' && N > 4)  N /= 2;
    glutPostRedisplay();
}

void init() { N = 32; }
`, `
` + RESHAPE + MAIN("A3: sifat", "    init();\n    glutKeyboardFunc(keyboard);\n"));

  LAB.define({
    n: 3,
    title: { uz: "Splayn sirtlardan foydalanib 3 ölçovli obyekt yaratiş", ru: "Сплайновые поверхности и построение 3D-объектов" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: 16 tayanç nuqtali Beze sirti", ru: "Пример: поверхность Безье по 16 точкам" },
        text: { uz: "<p>Beze sirti 4×4 tayanç nuqtalar töri bilan beriladi: <i>S(s, t) = Σᵢ Σⱼ Bᵢ(s)·Bⱼ(t)·Pᵢⱼ</i>, bu yerda Bᵢ — Bernşteyn köphadlari. Sirt N×N törtburçaklarga bölib çiziladi, rangi balandlikka böğliq (kök — past, sariq — baland). Kulrang tör — tayanç nuqtalar: sirt faqat burçakdagi 4 ta nuqtadan ötadi.</p>",
                ru: "<p>Поверхность Безье задаётся сеткой 4×4 опорных точек: <i>S(s, t) = Σᵢ Σⱼ Bᵢ(s)·Bⱼ(t)·Pᵢⱼ</i>, где Bᵢ — многочлены Бернштейна. Поверхность рисуется сеткой N×N четырёхугольников, цвет зависит от высоты (синий — низко, жёлтый — высоко). Серая сетка — опорные точки: поверхность проходит только через 4 угловые.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Egar", ru: "Задание 1. Седло" },
        text: { uz: "<p>Tekis törning z koordinatalarini şunday beringki, «ot egari» — giperbolik paraboloid hosil bölsin: bir yönalişda çetlari kötarilgan, ikkinçisida tuşgan. Formulasi: z = 1,2·((i − 1,5)² − (j − 1,5)²) + 1,5.</p>",
                ru: "<p>Задайте z-координаты плоской сетки так, чтобы получилось «седло» — гиперболический параболоид: в одном направлении края подняты, в другом опущены. Формула: z = 1,2·((i − 1,5)² − (j − 1,5)²) + 1,5.</p>" },
        hint: { uz: "Ikki ički sikl: for i, for j: P[i][j].z = …", ru: "Два вложенных цикла: for i, for j: P[i][j].z = …" },
        check: { type: "image" }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Tepalik", ru: "Задание 2. Холм" },
        text: { uz: "<p>Sirt markazida bitta tepalik hosil qiling: markaziy 4 ta tayanç nuqtani (i, j ∈ {1, 2}) z = 4 ga kötaring. E'tibor bering: sirtning eng baland nuqtasi 4 dan past — Beze sirti ički tayanç nuqtalarga yetib bormaydi.</p>",
                ru: "<p>Сделайте в центре поверхности холм: поднимите 4 центральные опорные точки (i, j ∈ {1, 2}) до z = 4. Обратите внимание: вершина поверхности ниже 4 — поверхность Безье не достигает внутренних опорных точек.</p>" },
        hint: { uz: "P[1][1].z = P[1][2].z = P[2][1].z = P[2][2].z = 4.", ru: "P[1][1].z = P[1][2].z = P[2][1].z = P[2][2].z = 4." },
        check: { type: "image" }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Ikki qismli sirt (C0)", ru: "Задание 3. Составная поверхность (C0)" },
        text: { uz: "<p>Ikkita yonma-yon Beze sirti berilgan, lekin ular orasida tirqiş bor. <b>C0 uzluksizlik</b> uçun ikkinçi qismning birinçi qatori birinçi qismning oxirgi qatori bilan bir xil nuqtalardan iborat bölişi kerak: B[0][j] = A[3][j].</p>",
                ru: "<p>Даны две соседние поверхности Безье, но между ними щель. Для <b>непрерывности C0</b> первая строка второго лоскута должна состоять из тех же точек, что и последняя строка первого: B[0][j] = A[3][j].</p>" },
        hint: { uz: "for (int j = 0; j < 4; j++) B[0][j] = A[3][j];", ru: "for (int j = 0; j < 4; j++) B[0][j] = A[3][j];" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Silliq ulaniş (C1)", ru: "Задание 4. Гладкое соединение (C1)" },
        text: { uz: "<p>Endi ulaniş joyida «qirra» yöqolsin — <b>C1 silliqlik</b>. Buning uçun ulaniş çiziğining ikki tomonidagi tayanç nuqtalar bir töğri çiziqda va teng masofada yotişi kerak: B[1][j] = 2·A[3][j] − A[2][j].</p>",
                ru: "<p>Теперь уберём «ребро» на стыке — <b>гладкость C1</b>. Опорные точки по обе стороны линии стыка должны лежать на одной прямой и на равных расстояниях: B[1][j] = 2·A[3][j] − A[2][j].</p>" },
        hint: { uz: "x, y, z uçun alohida: B[1][j].x = 2·A[3][j].x − A[2][j].x va h.k.", ru: "Отдельно для x, y, z: B[1][j].x = 2·A[3][j].x − A[2][j].x и т. д." },
        check: { type: "image" }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. B-splayn sirti", ru: "Задание 5. B-сплайновая поверхность" },
        text: { uz: "<p>Xuddi şu 16 nuqta böyiça <b>B-splayn sirtini</b> çizing (<code>drawSurface</code> ning uçinçi parametri 1). Misoldagi Beze sirti bilan soliştiring: B-splayn sirti tayanç törga «yopişmaydi», ancha tekis va past.</p>",
                ru: "<p>Нарисуйте <b>B-сплайновую поверхность</b> по тем же 16 точкам (третий параметр <code>drawSurface</code> равен 1). Сравните с поверхностью Безье из примера: B-сплайн не «прилипает» к опорной сетке, он более плоский и низкий.</p>" },
        hint: { uz: "drawSurface(P, 16, 1);", ru: "drawSurface(P, 16, 1);" },
        check: { type: "image" }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Çaynik qopqoği", ru: "Задание 6. Крышка чайника" },
        text: { uz: "<p>Aylaniş sirtini 4 ta Beze qismidan yiğing. Bitta qismning tayanç nuqtalari <b>profil</b> (r, z) va <b>çorak aylana</b> (CX, CY) ning köpaytmasidan olinadi: Q[i][j] = (r<sub>i</sub>·cx<sub>j</sub>, r<sub>i</sub>·cy<sub>j</sub>, z<sub>i</sub>). Qolgan uçta qism — şu qismning 90°, 180°, 270° ga burilgan nusxalari.</p>",
                ru: "<p>Соберите поверхность вращения из 4 лоскутов Безье. Опорные точки одного лоскута — произведение <b>профиля</b> (r, z) и <b>четверти окружности</b> (CX, CY): Q[i][j] = (r<sub>i</sub>·cx<sub>j</sub>, r<sub>i</sub>·cy<sub>j</sub>, z<sub>i</sub>). Остальные три лоскута — копии, повёрнутые на 90°, 180°, 270°.</p>" },
        hint: { uz: "Q[i][j].x = PR[i]·CX[j]; Q[i][j].y = PR[i]·CY[j]; Q[i][j].z = PZ[i];", ru: "Q[i][j].x = PR[i]·CX[j]; Q[i][j].y = PR[i]·CY[j]; Q[i][j].z = PZ[i];" },
        check: { type: "image" }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Interaktiv tayanç nuqtalar", ru: "Задание 7. Интерактивные опорные точки" },
        text: { uz: "<p>Tanlangan tayanç nuqta (qizil) ni klaviatura bilan boşqaring: <b>n</b>/<b>p</b> — keyingi/oldingi nuqta, <b>↑</b>/<b>↓</b> — uning z koordinatasini 0,5 ga özgartiriş. Sirt darhol qayta hisoblanadi. Oyna ustiga bosib tekşiring.</p>",
                ru: "<p>Управляйте выбранной опорной точкой (красная) с клавиатуры: <b>n</b>/<b>p</b> — следующая/предыдущая точка, <b>↑</b>/<b>↓</b> — изменить её z на 0,5. Поверхность сразу пересчитывается. Щёлкните по окну и проверьте.</p>" },
        hint: { uz: "P[cur / 4][cur % 4].z += 0.5; va glutPostRedisplay();", ru: "P[cur / 4][cur % 4].z += 0.5; и glutPostRedisplay();" },
        check: { type: "both", source: [{ re: "glutSpecialFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutSpecialFunc(special) ni qayd qiling", ru: "Зарегистрируйте glutSpecialFunc(special)" } }, { re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "GLUT_KEY_DOWN", msg: { uz: "Pastki strelkani (GLUT_KEY_DOWN) qayta işlang", ru: "Обработайте стрелку вниз (GLUT_KEY_DOWN)" } }] }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Natija sifatini oşiriş", ru: "Задание 8. Повышение качества" },
        text: { uz: "<p>Bölinmalar soni N ni 4 → 8 → 16 → 32 ga oşiring: sirt silliqlaşadi, lekin törtburçaklar soni N² ga teng bölib, çiziş sekinlaşadi. '+' va '−' tugmalarini qöşing va boşlanğiç qiymatni N = 32 qiling. Konsoldagi vaqtni har bir N uçun hisobotdagi jadvalga yozing.</p>",
                ru: "<p>Увеличивайте число разбиений N: 4 → 8 → 16 → 32. Поверхность становится глаже, но число четырёхугольников равно N², и рисование замедляется. Добавьте клавиши '+' и '−' и сделайте начальное N = 32. Время из консоли для каждого N занесите в таблицу отчёта.</p>" },
        hint: { uz: "if (key == '+' && N < 32) N *= 2; if (key == '-' && N > 4) N /= 2; init() da N = 32.", ru: "if (key == '+' && N < 32) N *= 2; if (key == '-' && N > 4) N /= 2; в init(): N = 32." },
        check: { type: "both", maxDiff: 0.002, source: [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
