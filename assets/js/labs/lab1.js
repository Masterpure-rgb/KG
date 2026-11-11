/* A1. Poligonal törlar, Platon jismlari va geometrik almaştirişlar (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n\n#define PI 3.14159265\n\n";
  var COMMON = `struct Vec3 { double x, y, z; };

// ${C("Kabine proyeksiyasi: z öqi 45° ostida, 1/2 masştabda", "Кабинетная проекция: ось z под 45°, масштаб 1/2")}
void edge(Vec3 a, Vec3 b) {
    glVertex2d(a.x + 0.3535 * a.z, a.y + 0.3535 * a.z);
    glVertex2d(b.x + 0.3535 * b.z, b.y + 0.3535 * b.z);
}

// ${C("Koordinata öqlari: X — qizil, Y — yaşil, Z — kök", "Оси координат: X — красная, Y — зелёная, Z — синяя")}
void axes() {
    glLineWidth(1.0f);
    glBegin(GL_LINES);
        glColor3f(0.6f, 0.3f, 0.3f);  glVertex2d(0, 0); glVertex2d(7.5, 0);
        glColor3f(0.3f, 0.6f, 0.35f); glVertex2d(0, 0); glVertex2d(0, 5.5);
        glColor3f(0.35f, 0.45f, 0.75f); glVertex2d(0, 0); glVertex2d(-3.5, -3.5);
    glEnd();
}

// ${C("Simlik (wireframe) çiziş: V — uçlar, E — qirralar (uç indekslari jufti)", "Каркас: V — вершины, E — рёбра (пары индексов вершин)")}
void wire(Vec3 V[], int E[][2], int ne) {
    glBegin(GL_LINES);
    for (int i = 0; i < ne; i++)
        edge(V[E[i][0]], V[E[i][1]]);
    glEnd();
}

`;
  var CUBE = `// ${C("Kub: tomoni d = 2, bir uçi koordinatalar boşida", "Куб: сторона d = 2, одна вершина в начале координат")}
Vec3 cube[8] = {
    {0, 0, 0}, {2, 0, 0}, {2, 2, 0}, {0, 2, 0},
    {0, 0, 2}, {2, 0, 2}, {2, 2, 2}, {0, 2, 2}
};
int cubeE[12][2] = {
    {0,1},{1,2},{2,3},{3,0},    // ${C("pastki yoq", "нижняя грань")}
    {4,5},{5,6},{6,7},{7,4},    // ${C("ustki yoq", "верхняя грань")}
    {0,4},{1,5},{2,6},{3,7}     // ${C("yon qirralar", "боковые рёбра")}
};

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-8.0, 8.0, -6.0, 6.0, -1.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}
`;
  function MAIN(title, extra, mode) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(${mode || "GLUT_DOUBLE | GLUT_RGB"});
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
  // starter = pre + todo + post; solution = pre + body + post
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }

  /* ---------- Misol ---------- */
  var ex = HEAD + COMMON + CUBE + `void translate(Vec3& p, double lam, double mu, double nu) {
    p.x += lam; p.y += mu; p.z += nu;
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();

    // ${C("Dastlabki kub — kulrang", "Исходный куб — серый")}
    glColor3f(0.55f, 0.6f, 0.7f);
    wire(cube, cubeE, 12);

    // ${C("Kubning nusxasini (λ, μ, ν) = (-5, -3, 0) vektorga köçiramiz", "Копию куба переносим на вектор (λ, μ, ν) = (-5, -3, 0)")}
    Vec3 moved[8];
    for (int i = 0; i < 8; i++) {
        moved[i] = cube[i];
        translate(moved[i], -5, -3, 0);
    }
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(2.0f);
    wire(moved, cubeE, 12);

    glutSwapBuffers();
}

` + RESHAPE + MAIN("A1: kub");

  /* ---------- 1. Tetraedr ---------- */
  var t1 = S(HEAD + COMMON, `// ${C("TODO: tetraedrning 4 ta uçi va 6 ta qirrasini yozing.", "TODO: запишите 4 вершины и 6 рёбер тетраэдра.")}
// ${C("Uçlar: (2,2,2), (2,-2,-2), (-2,2,-2), (-2,-2,2)", "Вершины: (2,2,2), (2,-2,-2), (-2,2,-2), (-2,-2,2)")}
Vec3 T[4] = { {0, 0, 0}, {0, 0, 0}, {0, 0, 0}, {0, 0, 0} };
int TE[6][2] = { {0,0},{0,0},{0,0},{0,0},{0,0},{0,0} };
`, `Vec3 T[4] = { {2, 2, 2}, {2, -2, -2}, {-2, 2, -2}, {-2, -2, 2} };
// ${C("Tetraedrda har bir uç qolgan uçtasi bilan qirra orqali boğlangan", "В тетраэдре каждая вершина соединена ребром с тремя остальными")}
int TE[6][2] = { {0,1},{0,2},{0,3},{1,2},{1,3},{2,3} };
`, `
void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(2.0f);
    wire(T, TE, 6);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A1: tetraedr"));

  /* ---------- 2. Oktaedr ---------- */
  var t2 = S(HEAD + COMMON, `// ${C("TODO: oktaedrning 6 ta uçi (öqlarda, ±3) va 12 ta qirrasi.", "TODO: 6 вершин октаэдра (на осях, ±3) и 12 рёбер.")}
// ${C("Uçlar tartibi: +X, -X, +Y, -Y, +Z, -Z", "Порядок вершин: +X, -X, +Y, -Y, +Z, -Z")}
Vec3 O[6] = { {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0} };
int OE[12][2] = { {0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0} };
`, `Vec3 O[6] = { {3,0,0}, {-3,0,0}, {0,3,0}, {0,-3,0}, {0,0,3}, {0,0,-3} };
// ${C("Qarama-qarşi uçlar (+X va -X kabi) qirra bilan boğlanmaydi", "Противоположные вершины (как +X и -X) ребром не соединяются")}
int OE[12][2] = {
    {0,2},{0,3},{0,4},{0,5},
    {1,2},{1,3},{1,4},{1,5},
    {2,4},{2,5},{3,4},{3,5}
};
`, `
void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();
    glColor3f(0.45f, 0.85f, 1.0f);
    glLineWidth(2.0f);
    wire(O, OE, 12);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A1: oktaedr"));

  /* ---------- 3–5. Köçiriş, masştablaş, buriş ---------- */
  function transformTask(fnSig, todo, body, call, title) {
    return S(HEAD + COMMON + CUBE + fnSig + " {\n", todo, body, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();
    glColor3f(0.55f, 0.6f, 0.7f);
    wire(cube, cubeE, 12);

    Vec3 R[8];
    for (int i = 0; i < 8; i++) {
        R[i] = cube[i];
        ${call}
    }
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(2.0f);
    wire(R, cubeE, 12);
    glutSwapBuffers();
}

` + RESHAPE + MAIN(title));
  }
  var t3 = transformTask("void translate(Vec3& p, double lam, double mu, double nu)",
    `    // ${C("TODO: nuqtani (λ, μ, ν) vektorga köçiring", "TODO: перенесите точку на вектор (λ, μ, ν)")}
`, `    p.x += lam;
    p.y += mu;
    p.z += nu;
`, "translate(R[i], 2, 3, 1);", "A1: kociris");
  var t4 = transformTask("void scale(Vec3& p, double a, double b, double g)",
    `    // ${C("TODO: koordinatalarni α, β, γ ga köpaytiring (D = diag(α, β, γ, 1))", "TODO: умножьте координаты на α, β, γ (D = diag(α, β, γ, 1))")}
`, `    p.x *= a;
    p.y *= b;
    p.z *= g;
`, "scale(R[i], 2, 1.5, 1);", "A1: masstablas");
  var t5 = transformTask("void rotateZ(Vec3& p, double deg)",
    `    // ${C("TODO: Oz öqi atrofida deg gradusga buriş:", "TODO: поворот вокруг оси Oz на deg градусов:")}
    // x' = x·cosφ − y·sinφ,  y' = x·sinφ + y·cosφ
`, `    double f = deg * PI / 180.0;
    double x = p.x * cos(f) - p.y * sin(f);
    double y = p.x * sin(f) + p.y * cos(f);
    p.x = x;
    p.y = y;
`, "rotateZ(R[i], 30);", "A1: buris");

  /* ---------- 6. Kombinatsiya (matritsalar) ---------- */
  var MATS = `// ${C("4×4 matritsalar, qator-vektor: p' = p · M", "Матрицы 4×4, вектор-строка: p' = p · M")}
void identity(double M[4][4]) {
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            M[i][j] = (i == j) ? 1 : 0;
}
void mul(double A[4][4], double B[4][4], double R[4][4]) {   // R = A · B
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) {
            R[i][j] = 0;
            for (int k = 0; k < 4; k++) R[i][j] += A[i][k] * B[k][j];
        }
}
void apply(Vec3& p, double M[4][4]) {
    double x = p.x * M[0][0] + p.y * M[1][0] + p.z * M[2][0] + M[3][0];
    double y = p.x * M[0][1] + p.y * M[1][1] + p.z * M[2][1] + M[3][1];
    double z = p.x * M[0][2] + p.y * M[1][2] + p.z * M[2][2] + M[3][2];
    p.x = x; p.y = y; p.z = z;
}

`;
  var t6 = S(HEAD + COMMON + CUBE + MATS + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();
    glColor3f(0.55f, 0.6f, 0.7f);
    wire(cube, cubeE, 12);

    double f = 45 * PI / 180.0;
    double Rx[4][4], T[4][4], M[4][4];
`, `    // ${C("TODO 1: Rx — Ox atrofida 45° buriş matritsasi; T — (0, 2, 0) ga köçiriş matritsasi", "TODO 1: Rx — матрица поворота вокруг Ox на 45°; T — матрица переноса на (0, 2, 0)")}
    // ${C("TODO 2: M = Rx · T (avval buriş, keyin köçiriş)", "TODO 2: M = Rx · T (сначала поворот, потом перенос)")}
    identity(M);
`, `    identity(Rx);
    Rx[1][1] = cos(f);  Rx[1][2] = sin(f);
    Rx[2][1] = -sin(f); Rx[2][2] = cos(f);
    identity(T);
    T[3][1] = 2;                  // ${C("köçiriş qatori: (λ, μ, ν) = (0, 2, 0)", "строка переноса: (λ, μ, ν) = (0, 2, 0)")}
    mul(Rx, T, M);                // ${C("bitta umumiy almaştiriş", "одно общее преобразование")}
`, `
    Vec3 R[8];
    for (int i = 0; i < 8; i++) { R[i] = cube[i]; apply(R[i], M); }
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(2.0f);
    wire(R, cubeE, 12);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A1: kombinatsiya"));

  /* ---------- 7. Dodekaedr ---------- */
  var t7 = S(HEAD + COMMON + `// ${C("Oltin kesim φ = (1 + √5) / 2", "Золотое сечение φ = (1 + √5) / 2")}
double phi = (1 + sqrt(5.0)) / 2;
Vec3 D[20];
int DE[30][2];
int ne = 0;

void build() {
    double a = 1 / phi, k = 2.2;   // ${C("k — masştab", "k — масштаб")}
    int n = 0;
`, `    // ${C("TODO 1: 20 ta uçni yozing: (±1, ±1, ±1), (0, ±1/φ, ±φ), (±1/φ, ±φ, 0), (±φ, 0, ±1/φ) — hammasini k ga köpaytiring", "TODO 1: 20 вершин: (±1, ±1, ±1), (0, ±1/φ, ±φ), (±1/φ, ±φ, 0), (±φ, 0, ±1/φ) — все умножить на k")}
    // ${C("TODO 2: uzunligi 2/φ·k bölgan barça juftlarni DE ga qirra sifatida qöşing (30 ta)", "TODO 2: добавьте в DE все пары вершин на расстоянии 2/φ·k (их 30)")}
`, `    for (int i = -1; i <= 1; i += 2)
        for (int j = -1; j <= 1; j += 2)
            for (int l = -1; l <= 1; l += 2) {
                D[n].x = i * k; D[n].y = j * k; D[n].z = l * k; n++;
            }
    for (int i = -1; i <= 1; i += 2)
        for (int j = -1; j <= 1; j += 2) {
            D[n].x = 0;           D[n].y = i * a * k;   D[n].z = j * phi * k; n++;
            D[n].x = i * a * k;   D[n].y = j * phi * k; D[n].z = 0;           n++;
            D[n].x = i * phi * k; D[n].y = 0;           D[n].z = j * a * k;   n++;
        }
    // ${C("Qirra — uzunligi 2/φ ga teng kesma", "Ребро — отрезок длины 2/φ")}
    double L = 2 * a * k;
    for (int i = 0; i < 20; i++)
        for (int j = i + 1; j < 20; j++) {
            double dx = D[i].x - D[j].x, dy = D[i].y - D[j].y, dz = D[i].z - D[j].z;
            if (fabs(sqrt(dx*dx + dy*dy + dz*dz) - L) < 0.01) {
                DE[ne][0] = i; DE[ne][1] = j; ne++;
            }
        }
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    axes();
    glColor3f(0.75f, 0.6f, 1.0f);
    glLineWidth(2.0f);
    wire(D, DE, ne);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A1: dodekaedr", "    build();\n"));

  /* ---------- 8. Animatsiya ---------- */
  var RESHAPE3D = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.5, 100.0);
    glMatrixMode(GL_MODELVIEW);
}
`;
  var t8 = S(HEAD + `float angle = 0;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 3, 8,  0, 0, 0,  0, 1, 0);
`, `    // ${C("TODO 1: Oy öqi atrofida angle burçakka buring (glRotatef)", "TODO 1: поверните вокруг оси Oy на угол angle (glRotatef)")}
    glColor3f(1.0f, 0.85f, 0.3f);
    glutWireCube(3.0);
    glutSwapBuffers();
}

void idle() {
    // ${C("TODO 2: angle = 30° × (öçgan sekundlar); glutGet(GLUT_ELAPSED_TIME) — millisekundlar", "TODO 2: angle = 30° × (прошедшие секунды); glutGet(GLUT_ELAPSED_TIME) — миллисекунды")}
}
`, `    glRotatef(angle, 0, 1, 0);       // ${C("Oy atrofida aylaniş", "вращение вокруг Oy")}
    glColor3f(1.0f, 0.85f, 0.3f);
    glutWireCube(3.0);
    glutSwapBuffers();
}

void idle() {
    angle = 30.0f * glutGet(GLUT_ELAPSED_TIME) / 1000.0f;   // ${C("sekundiga 30°", "30° в секунду")}
    glutPostRedisplay();
}
`, `
` + RESHAPE3D + MAIN("A1: animatsiya", "    glEnable(GL_DEPTH_TEST);\n    glutIdleFunc(idle);\n", "GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH"));

  LAB.define({
    n: 1,
    title: { uz: "Poligonal törlardan foydalanib 3 ölçovli obyekt yaratiş va almaştirişlarni amalga oşiriş", ru: "Полигональные сетки: построение 3D-объектов и геометрические преобразования" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: kubning poligonal töri va köçiriş", ru: "Пример: полигональная сетка куба и перенос" },
        text: { uz: "<p>Kub <b>uçlar röyxati</b> <code>cube[8]</code> va <b>qirralar röyxati</b> <code>cubeE[12][2]</code> bilan berilgan: har bir qirra — ikki uçning indekslari. Fazoviy nuqtalar ekranga <b>kabine proyeksiyasi</b> orqali tuşiriladi: <code>x' = x + 0,3535·z</code>, <code>y' = y + 0,3535·z</code>.</p><p>Kulrang kub — dastlabki holat, sariq — <code>translate</code> funksiyasi bilan (−5, −3, 0) vektorga köçirilgan nusxa. Köçiriş vektorini özgartirib, «Işga tuşiriş» ni bosing.</p>",
                ru: "<p>Куб задан <b>списком вершин</b> <code>cube[8]</code> и <b>списком рёбер</b> <code>cubeE[12][2]</code>: каждое ребро — пара индексов вершин. Точки пространства переводятся на экран <b>кабинетной проекцией</b>: <code>x' = x + 0,3535·z</code>, <code>y' = y + 0,3535·z</code>.</p><p>Серый куб — исходный, жёлтый — копия, перенесённая функцией <code>translate</code> на вектор (−5, −3, 0). Измените вектор переноса и нажмите «Запустить».</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Tetraedr", ru: "Задание 1. Тетраэдр" },
        text: { uz: "<p>Tetraedrning 4 ta uçini va 6 ta qirrasini röyxat körinişida yozing va uni simlik (wireframe) tasvirda çiqaring. Uçlar kubning bir-biriga qöşni bölmagan uçlarida yotadi: (2, 2, 2), (2, −2, −2), (−2, 2, −2), (−2, −2, 2).</p>",
                ru: "<p>Запишите 4 вершины и 6 рёбер тетраэдра в виде списков и выведите его каркас. Вершины лежат в несмежных вершинах куба: (2, 2, 2), (2, −2, −2), (−2, 2, −2), (−2, −2, 2).</p>" },
        hint: { uz: "Tetraedrning har bir uçi qolgan uçtasi bilan boğlangan: juftlar (0,1), (0,2), (0,3), (1,2), (1,3), (2,3).", ru: "В тетраэдре каждая вершина соединена с тремя другими: пары (0,1), (0,2), (0,3), (1,2), (1,3), (2,3)." },
        check: { type: "both", maxDiff: 0.002, calls: { "glVertex2d": ">=12" } }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Oktaedr", ru: "Задание 2. Октаэдр" },
        text: { uz: "<p>Oktaedrni quring: uning 6 ta uçi koordinata öqlarida, boşdan 3 birlik masofada yotadi (+X, −X, +Y, −Y, +Z, −Z tartibida). Oktaedrning 12 ta qirrasi bor; qarama-qarşi uçlar qirra bilan boğlanmaydi.</p>",
                ru: "<p>Постройте октаэдр: 6 его вершин лежат на осях координат на расстоянии 3 от начала (в порядке +X, −X, +Y, −Y, +Z, −Z). У октаэдра 12 рёбер; противоположные вершины ребром не соединены.</p>" },
        hint: { uz: "+X uçi (0) ±Y va ±Z uçlari (2, 3, 4, 5) bilan boğlanadi; −X uçi (1) ham xuddi şunday. Qolgan 4 ta qirra: (2,4), (2,5), (3,4), (3,5).", ru: "Вершина +X (0) соединена с ±Y и ±Z (2, 3, 4, 5); вершина −X (1) — так же. Остальные 4 ребра: (2,4), (2,5), (3,4), (3,5)." },
        check: { type: "both", maxDiff: 0.002, calls: { "glVertex2d": ">=24" } }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Köçiriş", ru: "Задание 3. Перенос" },
        text: { uz: "<p><code>translate</code> funksiyasini yozing va kubni (2, 3, 1) vektorga köçiring. Dastlabki (kulrang) va köçirilgan (sariq) kub birga körsatiladi. Bir jinsli koordinatalarda köçiriş matritsasi T ning oxirgi qatori (λ, μ, ν, 1) ga teng.</p>",
                ru: "<p>Напишите функцию <code>translate</code> и перенесите куб на вектор (2, 3, 1). Исходный (серый) и перенесённый (жёлтый) кубы показываются вместе. В однородных координатах последняя строка матрицы переноса T равна (λ, μ, ν, 1).</p>" },
        hint: { uz: "Köçiriş — har bir koordinataga mos sonni qöşiş: p.x += lam va h.k.", ru: "Перенос — прибавление к каждой координате: p.x += lam и т. д." },
        check: { type: "image", maxDiff: 0.002 }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Masştablaş", ru: "Задание 4. Масштабирование" },
        text: { uz: "<p><code>scale</code> funksiyasini yozing va kubni (2; 1,5; 1) koeffitsiyentlar böyiça masştablang. Masştablaş matritsasi D = diag(α, β, γ, 1): har bir koordinata öz koeffitsiyentiga köpaytiriladi. Koordinatalar boşidagi uç joyida qoladi.</p>",
                ru: "<p>Напишите функцию <code>scale</code> и масштабируйте куб с коэффициентами (2; 1,5; 1). Матрица масштабирования D = diag(α, β, γ, 1): каждая координата умножается на свой коэффициент. Вершина в начале координат остаётся на месте.</p>" },
        hint: { uz: "p.x *= a; p.y *= b; p.z *= g;", ru: "p.x *= a; p.y *= b; p.z *= g;" },
        check: { type: "image", maxDiff: 0.002 }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Buriş", ru: "Задание 5. Поворот" },
        text: { uz: "<p><code>rotateZ</code> funksiyasini yozing va kubni Oz öqi atrofida 30° ga buring. Gradusni radianga ötkaziş: φ = deg·π/180. Yangi koordinatalarni avval vaqtinçalik özgaruvçilarda hisoblang — aks holda x ning yangi qiymati y ni hisoblaşda xato beradi.</p>",
                ru: "<p>Напишите функцию <code>rotateZ</code> и поверните куб вокруг оси Oz на 30°. Перевод в радианы: φ = deg·π/180. Новые координаты сначала вычислите во временных переменных — иначе новое значение x испортит вычисление y.</p>" },
        hint: { uz: "x' = x·cosφ − y·sinφ, y' = x·sinφ + y·cosφ, z' = z.", ru: "x' = x·cosφ − y·sinφ, y' = x·sinφ + y·cosφ, z' = z." },
        check: { type: "image", maxDiff: 0.002 }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Kombinatsiya — matritsalar köpaytmasi", ru: "Задание 6. Композиция — произведение матриц" },
        text: { uz: "<p>Kubni avval Ox öqi atrofida 45° ga buring, söngra (0, 2, 0) ga köçiring — ikkala almaştiriş <b>bitta matritsa</b> M = R<sub>x</sub>·T bilan bajarilsin. Qator-vektor qoidasida (p' = p·M) birinçi qöllanadigan matritsa çapda turadi.</p>",
                ru: "<p>Сначала поверните куб вокруг оси Ox на 45°, затем перенесите на (0, 2, 0) — оба преобразования выполните <b>одной матрицей</b> M = R<sub>x</sub>·T. При записи вектором-строкой (p' = p·M) первое применяемое преобразование стоит слева.</p>" },
        hint: { uz: "Rx: [1][1] = cosφ, [1][2] = sinφ, [2][1] = −sinφ, [2][2] = cosφ. T: identity, keyin T[3][1] = 2. Söng mul(Rx, T, M).", ru: "Rx: [1][1] = cosφ, [1][2] = sinφ, [2][1] = −sinφ, [2][2] = cosφ. T: единичная, затем T[3][1] = 2. Потом mul(Rx, T, M)." },
        check: { type: "both", maxDiff: 0.002, source: [{ re: "mul\\s*\\(\\s*Rx\\s*,\\s*T\\s*,\\s*M\\s*\\)", msg: { uz: "Umumiy matritsani mul(Rx, T, M) bilan hisoblang", ru: "Вычислите общую матрицу вызовом mul(Rx, T, M)" } }] }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Dodekaedr", ru: "Задание 7. Додекаэдр" },
        text: { uz: "<p>Dodekaedrning 20 ta uçini oltin kesim φ orqali hisoblang va 30 ta qirrasini toping. Qirralarni qölda yozmaslik uçun: ikki uç orasidagi masofa 2/φ ga teng bölsa, ular qirra bilan boğlangan. Eyler formulasini tekşiring: Γ + V = P + 2 → 12 + 20 = 30 + 2.</p>",
                ru: "<p>Вычислите 20 вершин додекаэдра через золотое сечение φ и найдите 30 рёбер. Чтобы не выписывать рёбра вручную: две вершины соединены ребром, если расстояние между ними равно 2/φ. Проверьте формулу Эйлера: Г + В = Р + 2 → 12 + 20 = 30 + 2.</p>" },
        hint: { uz: "Uç turlari: 8 ta (±1, ±1, ±1) va 12 ta (0, ±1/φ, ±φ) va ularning siklik almaştirişlari. Masofani sqrt(dx²+dy²+dz²) bilan hisoblang va fabs(d − L) < 0,01 bilan soliştiring.", ru: "Вершины: 8 штук (±1, ±1, ±1) и 12 штук (0, ±1/φ, ±φ) с циклическими перестановками. Расстояние — sqrt(dx²+dy²+dz²), сравнение — fabs(d − L) < 0,01." },
        check: { type: "both", maxDiff: 0.002, calls: { "glVertex2d": ">=60" } }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Animatsiya", ru: "Задание 8. Анимация" },
        text: { uz: "<p>Endi OpenGL ning öz almaştirişlaridan foydalanamiz. Kubni Oy öqi atrofida <b>sekundiga 30°</b> tezlikda aylantiring: burçakni <code>glutGet(GLUT_ELAPSED_TIME)</code> orqali hisoblang, <code>glRotatef</code> bilan qöllang va <code>idle</code> funksiyasida <code>glutPostRedisplay()</code> ni çaqiring.</p>",
                ru: "<p>Теперь используем преобразования самого OpenGL. Вращайте куб вокруг оси Oy со скоростью <b>30° в секунду</b>: угол вычислите через <code>glutGet(GLUT_ELAPSED_TIME)</code>, примените <code>glRotatef</code>, а в функции <code>idle</code> вызывайте <code>glutPostRedisplay()</code>.</p>" },
        hint: { uz: "angle = 30.0f * glutGet(GLUT_ELAPSED_TIME) / 1000.0f; display() da: glRotatef(angle, 0, 1, 0).", ru: "angle = 30.0f * glutGet(GLUT_ELAPSED_TIME) / 1000.0f; в display(): glRotatef(angle, 0, 1, 0)." },
        frames: 2, check: { type: "both", maxDiff: 0.002, calls: { "glRotatef": ">=1" }, source: [{ re: "glutPostRedisplay", msg: { uz: "Qayta çiziş uçun idle() da glutPostRedisplay() ni çaqiring", ru: "Для перерисовки вызывайте glutPostRedisplay() в idle()" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
