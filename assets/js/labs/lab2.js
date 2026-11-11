/* A2. Splayn egri çiziqlar va rastr böyaş algoritmlari (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n#define W 480\n#define H 360\n\n";
  var BEZ = `// ${C("Kub Beze egri çiziği: 4 ta tayanç nuqta, t ∈ [0; 1]", "Кубическая кривая Безье: 4 опорные точки, t ∈ [0; 1]")}
void bezier(float P[4][2]) {
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i <= 100; i++) {
        float t = i / 100.0f, mt = 1 - t;
        float x = mt*mt*mt*P[0][0] + 3*t*mt*mt*P[1][0] + 3*t*t*mt*P[2][0] + t*t*t*P[3][0];
        float y = mt*mt*mt*P[0][1] + 3*t*mt*mt*P[1][1] + 3*t*t*mt*P[2][1] + t*t*t*P[3][1];
        glVertex2f(x, y);
    }
    glEnd();
}

// ${C("Tayanç köpburçak (kulrang) va tayanç nuqtalar", "Опорная ломаная (серая) и опорные точки")}
void controls(float P[][2], int n) {
    glColor3f(0.4f, 0.47f, 0.6f);
    glLineWidth(1.0f);
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i < n; i++) glVertex2f(P[i][0], P[i][1]);
    glEnd();
    glPointSize(7.0f);
    glColor3f(0.95f, 0.95f, 1.0f);
    glBegin(GL_POINTS);
    for (int i = 0; i < n; i++) glVertex2f(P[i][0], P[i][1]);
    glEnd();
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(0, w, 0, h);     // ${C("piksel koordinatalari", "пиксельные координаты")}
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

  /* ---------- Misol ---------- */
  var ex = HEAD + BEZ + `float P[4][2] = { {50, 50}, {110, 320}, {330, 320}, {430, 50} };

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    controls(P, 4);
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(3.0f);
    bezier(P);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: Beze");

  /* ---------- 1. S harfi ---------- */
  var t1 = S(HEAD + BEZ, `// ${C("TODO: «S» şakli uçun tayanç nuqtalar: (360, 320), (40, 330), (440, 30), (120, 40)", "TODO: опорные точки для «S»: (360, 320), (40, 330), (440, 30), (120, 40)")}
float S[4][2] = { {0, 0}, {0, 0}, {0, 0}, {0, 0} };
`, `float S[4][2] = { {360, 320}, {40, 330}, {440, 30}, {120, 40} };
`, `
void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    controls(S, 4);
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(4.0f);
    bezier(S);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: S"));

  /* ---------- 2. B-splayn ---------- */
  var t2 = S(HEAD + BEZ + `float P[4][2] = { {50, 50}, {110, 320}, {330, 320}, {430, 50} };

// ${C("Bir jinsli kub B-splayn segmenti", "Сегмент однородного кубического B-сплайна")}
void bspline(float P[4][2]) {
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i <= 100; i++) {
        float t = i / 100.0f;
`, `        // ${C("TODO: bazis funksiyalar b0..b3 ni hisoblang va (x, y) nuqtani çiqaring:", "TODO: вычислите базисные функции b0..b3 и выведите точку (x, y):")}
        // b0 = (1−t)³/6,  b1 = (3t³ − 6t² + 4)/6,  b2 = (−3t³ + 3t² + 3t + 1)/6,  b3 = t³/6
`, `        float b0 = (1 - t) * (1 - t) * (1 - t) / 6;
        float b1 = (3*t*t*t - 6*t*t + 4) / 6;
        float b2 = (-3*t*t*t + 3*t*t + 3*t + 1) / 6;
        float b3 = t*t*t / 6;
        glVertex2f(b0*P[0][0] + b1*P[1][0] + b2*P[2][0] + b3*P[3][0],
                   b0*P[0][1] + b1*P[1][1] + b2*P[2][1] + b3*P[3][1]);
`, `    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    controls(P, 4);
    glLineWidth(3.0f);
    glColor3f(1.0f, 0.85f, 0.3f);  bezier(P);     // ${C("Beze — sariq", "Безье — жёлтая")}
    glColor3f(0.3f, 0.9f, 1.0f);   bspline(P);    // ${C("B-splayn — havorang", "B-сплайн — голубая")}
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: B-splayn"));

  /* ---------- 3. Ulangan Beze (C1) ---------- */
  var t3 = S(HEAD + BEZ + `// ${C("7 ta nuqta: 0–1–2–3 birinçi egri, 3–4–5–6 ikkinçi egri", "7 точек: 0–1–2–3 первая кривая, 3–4–5–6 вторая")}
float Q[7][2] = { {30, 80}, {70, 300}, {180, 320}, {0, 0}, {300, 60}, {420, 60}, {450, 280} };

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
`, `    // ${C("TODO: ulaniş nuqtasi Q[3] ni Q[2] va Q[4] ning örtasiga qöying — şunda 2, 3, 4 bir töğri çiziqda yotadi (C1 silliqlik)", "TODO: поставьте точку стыка Q[3] в середину между Q[2] и Q[4] — тогда 2, 3, 4 лежат на одной прямой (гладкость C1)")}
`, `    // ${C("Ulaniş nuqtasi — qöşni tayanç nuqtalarning örtasi: 2, 3, 4 bir töğri çiziqda", "Точка стыка — середина соседних опорных: 2, 3, 4 на одной прямой")}
    Q[3][0] = (Q[2][0] + Q[4][0]) / 2;
    Q[3][1] = (Q[2][1] + Q[4][1]) / 2;
`, `
    float A[4][2], B[4][2];
    for (int i = 0; i < 4; i++) {
        A[i][0] = Q[i][0];     A[i][1] = Q[i][1];
        B[i][0] = Q[i + 3][0]; B[i][1] = Q[i + 3][1];
    }
    controls(Q, 7);
    glLineWidth(3.0f);
    glColor3f(1.0f, 0.85f, 0.3f); bezier(A);
    glColor3f(1.0f, 0.55f, 0.25f); bezier(B);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: C1"));

  /* ---------- 4. Yopiq soha ---------- */
  var LEAF = `// ${C("Uçta egri çiziqdan iborat yopiq kontur (barg)", "Замкнутый контур из трёх кривых (лист)")}
float LA[4][2] = { {240, 320}, {330, 300}, {420, 200}, {330, 90} };
float LB[4][2] = { {330, 90}, {280, 40}, {200, 40}, {150, 90} };
`;
  var t4 = S(HEAD + BEZ + LEAF, `// ${C("TODO: uçinçi egri LC: (150, 90) dan boşlanib (240, 320) da tugasin; oraliq nuqtalar (60, 200) va (150, 300)", "TODO: третья кривая LC: от (150, 90) до (240, 320); промежуточные точки (60, 200) и (150, 300)")}
float LC[4][2] = { {150, 90}, {150, 90}, {150, 90}, {150, 90} };
`, `// ${C("Konturning yopiqligi: LC ning oxiri LA ning boşi bilan ustma-ust", "Замкнутость: конец LC совпадает с началом LA")}
float LC[4][2] = { {150, 90}, {60, 200}, {150, 300}, {240, 320} };
`, `
void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glColor3f(0.4f, 1.0f, 0.55f);
    glLineWidth(3.0f);
    bezier(LA);
    bezier(LB);
    bezier(LC);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: yopiq soha"));

  /* ---------- 5. Flood fill ---------- */
  var RASTER = `// ${C("Dasturiy kadr buferi: har bir piksel — 3 bayt (R, G, B)", "Программный кадровый буфер: каждый пиксель — 3 байта (R, G, B)")}
unsigned char img[W * H * 3];

void setPix(int x, int y, int r, int g, int b) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    int k = (y * W + x) * 3;
    img[k] = r; img[k + 1] = g; img[k + 2] = b;
}
int isBg(int x, int y) {   // ${C("piksel fon rangidami?", "пиксель цвета фона?")}
    int k = (y * W + x) * 3;
    return img[k] == 20 && img[k + 1] == 28 && img[k + 2] == 51;
}
void clearImg() {
    for (int i = 0; i < W * H; i++) { img[3*i] = 20; img[3*i + 1] = 28; img[3*i + 2] = 51; }
}
// ${C("Egri çiziqni piksellar bilan «çizamiz» (zic qadam — kontur uzluksiz)", "«Рисуем» кривую пикселями (мелкий шаг — контур без разрывов)")}
void plotBezier(float P[4][2]) {
    for (int i = 0; i <= 2000; i++) {
        float t = i / 2000.0f, mt = 1 - t;
        float x = mt*mt*mt*P[0][0] + 3*t*mt*mt*P[1][0] + 3*t*t*mt*P[2][0] + t*t*t*P[3][0];
        float y = mt*mt*mt*P[0][1] + 3*t*mt*mt*P[1][1] + 3*t*t*mt*P[2][1] + t*t*t*P[3][1];
        setPix((int)(x + 0.5f), (int)(y + 0.5f), 120, 255, 140);
    }
}

`;
  var LEAF_FULL = LEAF + `float LC[4][2] = { {150, 90}, {60, 200}, {150, 300}, {240, 320} };

`;
  var t5 = S(HEAD + LEAF_FULL + RASTER + `int stx[W * H], sty[W * H];

// ${C("4-boğliq flood fill: rekursiya örniga aniq stek", "4-связная заливка: вместо рекурсии — явный стек")}
void floodFill(int x0, int y0, int r, int g, int b) {
`, `    // ${C("TODO: (x0, y0) ni stekka qöying; stekdan nuqtani oling, agar u fon rangida bölsa —", "TODO: положите (x0, y0) в стек; пока стек не пуст: достаньте точку, если она цвета фона —")}
    // ${C("uni (r, g, b) ga böyang va 4 ta qöşnisini (±x, ±y) stekka qöşing", "закрасьте её в (r, g, b) и положите в стек 4 соседа (±x, ±y)")}
`, `    int top = 0;
    stx[top] = x0; sty[top] = y0; top++;
    while (top > 0) {
        top--;
        int x = stx[top], y = sty[top];
        if (x < 0 || y < 0 || x >= W || y >= H || !isBg(x, y)) continue;
        setPix(x, y, 40, 150, 70);
        stx[top] = x + 1; sty[top] = y; top++;
        stx[top] = x - 1; sty[top] = y; top++;
        stx[top] = x; sty[top] = y + 1; top++;
        stx[top] = x; sty[top] = y - 1; top++;
    }
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    clearImg();
    plotBezier(LA); plotBezier(LB); plotBezier(LC);
    floodFill(240, 180, 40, 150, 70);           // ${C("urlöğ nuqta — barg içida", "затравка — внутри листа")}
    glRasterPos2i(0, 0);
    glDrawPixels(W, H, GL_RGB, GL_UNSIGNED_BYTE, img);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: flood fill"));

  /* ---------- 6. Scanline ---------- */
  var ARROW = `// ${C("Botiq bölmagan köpburçak (strelka), uçlar soat strelkasiga qarşi", "Невыпуклый многоугольник (стрелка), вершины против часовой стрелки")}
int N = 7;
float X[7] = { 60, 200, 200, 420, 420, 200, 200 };
float Y[7] = { 180, 40, 120, 120, 240, 240, 320 };

`;
  var SCAN_PRE = HEAD + ARROW + `// ${C("Skanlovçi çiziq usuli: har bir y uçun qirralar bilan kesişişlar topiladi,", "Метод сканирующей строки: для каждого y находим пересечения с рёбрами,")}
// ${C("saralanadi va juft-juft (x1–x2, x3–x4, ...) töldiriladi", "сортируем и заливаем попарно (x1–x2, x3–x4, ...)")}
void scanFill() {
    float xs[16];
    glLineWidth(1.0f);
    glBegin(GL_LINES);
    for (int y = 0; y < H; y++) {
        float yc = y + 0.5f;
        int k = 0;
`;
  var SCAN_BODY = `        for (int i = 0; i < N; i++) {
            int j = (i + 1) % N;
            float y0 = Y[i], y1 = Y[j];
            // ${C("yarim oçiq interval: uçni ikki marta sanamaslik uçun", "полуоткрытый интервал: чтобы не считать вершину дважды")}
            if ((y0 <= yc && yc < y1) || (y1 <= yc && yc < y0))
                xs[k++] = X[i] + (yc - y0) * (X[j] - X[i]) / (y1 - y0);
        }
        // ${C("faol qirralar kesişişlarini x böyiça saralaş", "сортировка пересечений активных рёбер по x")}
        for (int a = 0; a < k; a++)
            for (int b = a + 1; b < k; b++)
                if (xs[b] < xs[a]) { float t = xs[a]; xs[a] = xs[b]; xs[b] = t; }
`;
  var t6 = S(SCAN_PRE, `        // ${C("TODO 1: har bir qirra (i, i+1) uçun yc ni kesib ötsa, kesişiş x ini xs[k++] ga yozing", "TODO 1: для каждого ребра (i, i+1), пересекающего yc, запишите x пересечения в xs[k++]")}
        // ${C("TODO 2: xs[0..k) ni ösiş tartibida saralang", "TODO 2: отсортируйте xs[0..k) по возрастанию")}
`, SCAN_BODY, `        glColor3f(1.0f, 0.62f, 0.25f);
        for (int a = 0; a + 1 < k; a += 2) {
            glVertex2f(xs[a], yc);
            glVertex2f(xs[a + 1], yc);
        }
    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    scanFill();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: scanline"));

  /* ---------- 7. Interaktiv tayanç nuqtalar ---------- */
  var t7 = S(HEAD + BEZ + `float P[4][2] = { {50, 50}, {110, 320}, {330, 320}, {430, 50} };
int sel = 0;    // ${C("tanlangan nuqta", "выбранная точка")}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    controls(P, 4);
    glPointSize(13.0f);
    glColor3f(1.0f, 0.35f, 0.35f);       // ${C("tanlangan nuqta — qizil", "выбранная точка — красная")}
    glBegin(GL_POINTS); glVertex2f(P[sel][0], P[sel][1]); glEnd();
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(3.0f);
    bezier(P);
    glutSwapBuffers();
}

`, `// ${C("TODO 1: keyboard(): '1'..'4' tugmalari nuqtani tanlaydi (sel = key - '1')", "TODO 1: keyboard(): клавиши '1'..'4' выбирают точку (sel = key - '1')")}
// ${C("TODO 2: special(): strelkalar tanlangan nuqtani 10 pikselga suradi, keyin glutPostRedisplay()", "TODO 2: special(): стрелки сдвигают выбранную точку на 10 пикселей, затем glutPostRedisplay()")}
// ${C("TODO 3: main() da glutKeyboardFunc(keyboard) va glutSpecialFunc(special) ni qayd qiling", "TODO 3: в main() зарегистрируйте glutKeyboardFunc(keyboard) и glutSpecialFunc(special)")}
void keyboard(unsigned char key, int x, int y) { }
void special(int key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    if (key >= '1' && key <= '4') { sel = key - '1'; glutPostRedisplay(); }
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  P[sel][0] -= 10;
    if (key == GLUT_KEY_RIGHT) P[sel][0] += 10;
    if (key == GLUT_KEY_UP)    P[sel][1] += 10;
    if (key == GLUT_KEY_DOWN)  P[sel][1] -= 10;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A2: interaktiv", "    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  /* ---------- 8. Gradient ---------- */
  var t8 = S(SCAN_PRE + SCAN_BODY + `        // ${C("Gradient: pastda (y = 40) qizil, yuqorida (y = 320) kök", "Градиент: внизу (y = 40) красный, вверху (y = 320) синий")}
        float t = (yc - 40) / (320 - 40);
        if (t < 0) t = 0;
        if (t > 1) t = 1;
`, `        // ${C("TODO: rangni t böyiça aralaştiring: qizil (1; 0,25; 0,2) → kök (0,2; 0,4; 1)", "TODO: смешайте цвет по t: красный (1; 0,25; 0,2) → синий (0,2; 0,4; 1)")}
        glColor3f(1.0f, 0.62f, 0.25f);
`, `        glColor3f((1 - t) * 1.0f + t * 0.2f,
                  (1 - t) * 0.25f + t * 0.4f,
                  (1 - t) * 0.2f + t * 1.0f);
`, `        for (int a = 0; a + 1 < k; a += 2) {
            glVertex2f(xs[a], yc);
            glVertex2f(xs[a + 1], yc);
        }
    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    scanFill();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A2: gradient"));

  LAB.define({
    n: 2,
    title: { uz: "Splayn egri çiziqlardan foydalanib tasvirlar yaratiş va rastr algoritmlari yordamida böyaş", ru: "Сплайновые кривые и растровые алгоритмы закрашивания" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: kub Beze egri çiziği", ru: "Пример: кубическая кривая Безье" },
        text: { uz: "<p>Kub Beze egri çiziği 4 ta tayanç nuqta bilan beriladi: <i>B(t) = (1−t)³P₀ + 3t(1−t)²P₁ + 3t²(1−t)P₂ + t³P₃</i>, t ∈ [0; 1]. Egri P₀ va P₃ dan ötadi, P₁ va P₂ esa uni özlariga «tortadi» — kulrang tayanç köpburçakka qarang.</p><p>Nuqtalar koordinatalarini özgartirib, egri şakli qanday özgarişini kuzating.</p>",
                ru: "<p>Кубическая кривая Безье задаётся 4 опорными точками: <i>B(t) = (1−t)³P₀ + 3t(1−t)²P₁ + 3t²(1−t)P₂ + t³P₃</i>, t ∈ [0; 1]. Кривая проходит через P₀ и P₃, а P₁ и P₂ «притягивают» её — посмотрите на серую опорную ломаную.</p><p>Меняйте координаты точек и наблюдайте, как меняется форма кривой.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Beze bilan «S» harfi", ru: "Задание 1. Буква «S» кривой Безье" },
        text: { uz: "<p>Bitta kub Beze egri çiziği bilan «S» harfini çizing. Tayanç nuqtalar: (360, 320), (40, 330), (440, 30), (120, 40). P₁ va P₂ ekranning qarama-qarşi tomonlarida turgani uçun egri ikki marta egiladi.</p>",
                ru: "<p>Нарисуйте букву «S» одной кубической кривой Безье. Опорные точки: (360, 320), (40, 330), (440, 30), (120, 40). Так как P₁ и P₂ лежат по разные стороны, кривая изгибается дважды.</p>" },
        hint: { uz: "Massivni şu tartibda töldiring: float S[4][2] = { {360, 320}, {40, 330}, {440, 30}, {120, 40} };", ru: "Заполните массив в этом порядке: float S[4][2] = { {360, 320}, {40, 330}, {440, 30}, {120, 40} };" },
        check: { type: "image", maxDiff: 0.003 }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. B-splayn", ru: "Задание 2. B-сплайн" },
        text: { uz: "<p>Xuddi şu 4 ta nuqta uçun bir jinsli kub <b>B-splayn</b> segmentini çizing va uni Beze bilan soliştiring. B-splayn tayanç nuqtalardan ötmaydi, lekin silliqroq va tayanç köpburçakka yaqinroq; bir nuqtani özgartiriş egrining faqat bir qismiga taʼsir qiladi.</p>",
                ru: "<p>Для тех же 4 точек нарисуйте сегмент однородного кубического <b>B-сплайна</b> и сравните с кривой Безье. B-сплайн не проходит через опорные точки, но лежит ближе к опорной ломаной; изменение одной точки влияет лишь на часть кривой.</p>" },
        hint: { uz: "b0 = (1−t)³/6, b1 = (3t³−6t²+4)/6, b2 = (−3t³+3t²+3t+1)/6, b3 = t³/6; x = Σ bᵢ·Pᵢ.x, y = Σ bᵢ·Pᵢ.y.", ru: "b0 = (1−t)³/6, b1 = (3t³−6t²+4)/6, b2 = (−3t³+3t²+3t+1)/6, b3 = t³/6; x = Σ bᵢ·Pᵢ.x, y = Σ bᵢ·Pᵢ.y." },
        check: { type: "image", maxDiff: 0.003 }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Ulangan Beze egri çiziqlari", ru: "Задание 3. Составная кривая Безье" },
        text: { uz: "<p>Ikkita Beze egri çiziği 7 ta nuqta bilan berilgan: 0–1–2–3 va 3–4–5–6. Ulaniş joyida <b>C1 silliqlik</b> bölişi uçun 2, 3, 4 nuqtalar bir töğri çiziqda yotişi kerak. Ulaniş nuqtasi Q[3] ni Q[2] va Q[4] ning örtasiga joylaştiring — «sinişi» yöqoladi.</p>",
                ru: "<p>Две кривые Безье заданы 7 точками: 0–1–2–3 и 3–4–5–6. Для <b>гладкости C1</b> в месте стыка точки 2, 3, 4 должны лежать на одной прямой. Поставьте точку стыка Q[3] в середину между Q[2] и Q[4] — «излом» исчезнет.</p>" },
        hint: { uz: "Q[3][0] = (Q[2][0] + Q[4][0]) / 2; Q[3][1] = (Q[2][1] + Q[4][1]) / 2;", ru: "Q[3][0] = (Q[2][0] + Q[4][0]) / 2; Q[3][1] = (Q[2][1] + Q[4][1]) / 2;" },
        check: { type: "image", maxDiff: 0.003 }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Yopiq soha", ru: "Задание 4. Замкнутая область" },
        text: { uz: "<p>Uçta Beze egri çiziğidan yopiq kontur — barg hosil qiling. LA va LB berilgan; uçinçi egri LC (150, 90) dan boşlanib, (60, 200) va (150, 300) orqali yönalib, (240, 320) — LA ning boşida tugaşi kerak. Kontur yopiq bölmasa, keyingi topşiriqdagi böyaş taşqariga «oqib» ketadi.</p>",
                ru: "<p>Постройте замкнутый контур — лист — из трёх кривых Безье. LA и LB даны; третья кривая LC должна начинаться в (150, 90), идти через (60, 200) и (150, 300) и заканчиваться в (240, 320) — начале LA. Если контур не замкнут, заливка в следующем задании «вытечет» наружу.</p>" },
        hint: { uz: "float LC[4][2] = { {150, 90}, {60, 200}, {150, 300}, {240, 320} };", ru: "float LC[4][2] = { {150, 90}, {60, 200}, {150, 300}, {240, 320} };" },
        check: { type: "image", maxDiff: 0.003 }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Flood fill (urlöğ bilan töldiriş)", ru: "Задание 5. Заливка с затравкой (flood fill)" },
        text: { uz: "<p>Barg kontur piksellar bilan dasturiy buferga <code>img</code> çizilgan. <b>4-boğliq flood fill</b> algoritmini yozing: urlöğ nuqtadan boşlab fon rangidagi barça qöşni piksellarni yaşilga böyang. Rekursiya örniga aniq stek işlating — katta sohada rekursiya stekni töldirib yuboradi. Natija <code>glDrawPixels</code> bilan çiqariladi.</p>",
                ru: "<p>Контур листа нарисован пикселями в программный буфер <code>img</code>. Напишите <b>4-связную заливку с затравкой</b>: начиная с затравочной точки, закрасьте зелёным все соседние пиксели цвета фона. Вместо рекурсии используйте явный стек — на большой области рекурсия переполнит стек вызовов. Результат выводится через <code>glDrawPixels</code>.</p>" },
        hint: { uz: "while (top > 0) { top--; x = stx[top]; y = sty[top]; agar çegarada yoki fon emas — continue; setPix(...); 4 qöşnini push; }", ru: "while (top > 0) { top--; x = stx[top]; y = sty[top]; если вне окна или не фон — continue; setPix(...); положить 4 соседей; }" },
        check: { type: "both", calls: { "glDrawPixels": ">=1" } }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Skanlovçi çiziq (scanline) usuli", ru: "Задание 6. Метод сканирующей строки" },
        text: { uz: "<p>Botiq köpburçak — strelkani <b>scanline</b> usuli bilan töldiring. Har bir gorizontal çiziq y uçun uni kesib ötgan qirralar (faol qirralar röyxati) bilan kesişiş nuqtalarini toping, ularni x böyiça saralang va juft-juft töldiring: [x₁; x₂], [x₃; x₄], … Uçlarni ikki marta sanamaslik uçun yarim oçiq interval [y₀; y₁) dan foydalaning.</p>",
                ru: "<p>Залейте невыпуклый многоугольник — стрелку — <b>методом сканирующей строки</b>. Для каждой горизонтали y найдите пересечения с рёбрами, которые её пересекают (список активных рёбер), отсортируйте по x и заливайте парами: [x₁; x₂], [x₃; x₄], … Чтобы не считать вершины дважды, используйте полуоткрытый интервал [y₀; y₁).</p>" },
        hint: { uz: "Kesişiş: x = X[i] + (yc − Y[i])·(X[j] − X[i]) / (Y[j] − Y[i]), j = (i+1) % N. Saralaş uçun ikki ički sikl yetarli.", ru: "Пересечение: x = X[i] + (yc − Y[i])·(X[j] − X[i]) / (Y[j] − Y[i]), j = (i+1) % N. Для сортировки хватит двух вложенных циклов." },
        check: { type: "image" }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Interaktiv tayanç nuqtalar", ru: "Задание 7. Интерактивные опорные точки" },
        text: { uz: "<p>Egri çiziqni klaviatura bilan boşqaring: <b>1–4</b> tugmalari tayanç nuqtani tanlaydi (u qizil bilan belgilanadi), <b>strelkalar</b> uni 10 pikselga suradi. Oddiy tugmalarni <code>glutKeyboardFunc</code>, strelkalarni <code>glutSpecialFunc</code> qabul qiladi. Tekşiriş uçun oyna ustiga bosing va tugmalarni sinab köring.</p>",
                ru: "<p>Управляйте кривой с клавиатуры: клавиши <b>1–4</b> выбирают опорную точку (она выделяется красным), <b>стрелки</b> сдвигают её на 10 пикселей. Обычные клавиши принимает <code>glutKeyboardFunc</code>, стрелки — <code>glutSpecialFunc</code>. Щёлкните по окну и проверьте клавиши.</p>" },
        hint: { uz: "if (key == GLUT_KEY_LEFT) P[sel][0] -= 10; … va oxirida glutPostRedisplay();", ru: "if (key == GLUT_KEY_LEFT) P[sel][0] -= 10; … и в конце glutPostRedisplay();" },
        check: { type: "both", maxDiff: 0.003, source: [{ re: "glutSpecialFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutSpecialFunc(special) ni qayd qiling", ru: "Зарегистрируйте glutSpecialFunc(special)" } }, { re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "GLUT_KEY_UP", msg: { uz: "Yuqori strelkani (GLUT_KEY_UP) qayta işlang", ru: "Обработайте стрелку вверх (GLUT_KEY_UP)" } }, { re: "glutPostRedisplay", msg: { uz: "Özgarişdan keyin glutPostRedisplay() ni çaqiring", ru: "После изменения вызывайте glutPostRedisplay()" } }] }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Gradient böyaş", ru: "Задание 8. Градиентная заливка" },
        text: { uz: "<p>Strelkani bir xil rang bilan emas, balki <b>vertikal gradient</b> bilan töldiring: pastda (y = 40) qizil, yuqorida (y = 320) kök. Har bir skanlovçi çiziq uçun t = (y − 40)/(320 − 40) ni hisoblang va ikki rangni çiziqli aralaştiring: c = (1 − t)·c₁ + t·c₂.</p>",
                ru: "<p>Залейте стрелку не одним цветом, а <b>вертикальным градиентом</b>: внизу (y = 40) красный, вверху (y = 320) синий. Для каждой строки вычислите t = (y − 40)/(320 − 40) и линейно смешайте цвета: c = (1 − t)·c₁ + t·c₂.</p>" },
        hint: { uz: "glColor3f((1−t)·1 + t·0,2; (1−t)·0,25 + t·0,4; (1−t)·0,2 + t·1)", ru: "glColor3f((1−t)·1 + t·0,2; (1−t)·0,25 + t·0,4; (1−t)·0,2 + t·1)" },
        check: { type: "image" }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
