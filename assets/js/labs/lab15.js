/* A15. Fraktal grafika: rekursiv daraxtlar, L-tizimlar, Barnsli paporotnigi, 3D daraxt (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n#include <cstdlib>\n#include <cstring>\n\n#define PI 3.14159265\n#define W 480\n#define H 480\n\n";
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(0, W, 0, H);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}
`;
  function MAIN(title, extra, mode) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(${mode || "GLUT_DOUBLE | GLUT_RGB"});
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
  var LSYS = `// ${C("L-tizim satrlari: C uslubidagi belgilar massivlari", "Строки L-системы: массивы символов в стиле C")}
char cur[60000], nxt[60000];

// ${C("Toşbaqa: (x, y, burçak); '[' — holatni stekka, ']' — stekdan", "Черепаха: (x, y, угол); '[' — состояние в стек, ']' — из стека")}
double minX, maxX, minY, maxY;
void turtle(double x0, double y0, double a0, double step, double delta, int draw) {
    double x = x0, y = y0, a = a0;
    double sx[200], sy[200], sa[200];
    int top = 0, n = strlen(cur);
    minX = maxX = x; minY = maxY = y;
    if (draw) glBegin(GL_LINES);
    for (int i = 0; i < n; i++) {
        char c = cur[i];
        if (c == 'F' || c == 'A' || c == 'B') {
            double nx = x + step * cos(a * PI / 180), ny = y + step * sin(a * PI / 180);
            if (draw) { glVertex2d(x, y); glVertex2d(nx, ny); }
            x = nx; y = ny;
            if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
        else if (c == '+') a += delta;
        else if (c == '-') a -= delta;
        else if (c == '[') { sx[top] = x; sy[top] = y; sa[top] = a; top++; }
        else if (c == ']') { top--; x = sx[top]; y = sy[top]; a = sa[top]; }
    }
    if (draw) glEnd();
}
// ${C("Rasmni oynaga sig'diriş: avval ölçab, keyin masştab bilan çiziş", "Вписать рисунок в окно: сначала измерить, затем нарисовать с масштабом")}
void fitAndDraw(double a0, double delta) {
    turtle(0, 0, a0, 1, delta, 0);
    double s = fmin((W - 40) / fmax(maxX - minX, 1e-6), (H - 40) / fmax(maxY - minY, 1e-6));
    double ox = 20 + ((W - 40) - s * (maxX - minX)) / 2 - s * minX, oy = 20 + ((H - 40) - s * (maxY - minY)) / 2 - s * minY;
    turtle(ox, oy, a0, s, delta, 1);
}

`;
  var EXPAND = `// ${C("Bir qadam: har bir 'F' qoida bilan almaştiriladi, boşqa belgilar özgarmaydi", "Один шаг: каждая 'F' заменяется правилом, прочие символы копируются")}
void expand(const char* rule) {
    int n = strlen(cur), k = 0, m = strlen(rule);
    for (int i = 0; i < n; i++) {
        if (cur[i] == 'F') { for (int j = 0; j < m; j++) nxt[k++] = rule[j]; }
        else nxt[k++] = cur[i];
    }
    nxt[k] = 0;
    strcpy(cur, nxt);
}

`;

  /* ---------- Misol: rekursiv daraxt ---------- */
  var BRANCH_SIG = `// ${C("Şox: (x, y) dan burçak a böyiça uzunligi len; uçidan ikki kiçikroq şox ösadi", "Ветка: из (x, y) под углом a длины len; из её конца растут две меньшие ветки")}
void branch(double x, double y, double a, double len, int depth) {
    double nx = x + len * cos(a * PI / 180), ny = y + len * sin(a * PI / 180);
    glLineWidth(1 + depth * 0.6f);
    glColor3f(0.55f - 0.04f * (8 - depth), 0.35f + 0.07f * (8 - depth), 0.2f);
    glBegin(GL_LINES); glVertex2d(x, y); glVertex2d(nx, ny); glEnd();
`;
  var ex = HEAD + BRANCH_SIG + `    if (depth == 0) return;                     // ${C("rekursiya tagi", "дно рекурсии")}
    branch(nx, ny, a + 25, len * 0.68, depth - 1);
    branch(nx, ny, a - 25, len * 0.68, depth - 1);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    branch(240, 20, 90, 120, 5);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: daraxt");

  /* ---------- 1. Rekursiv daraxt (8 daraja) ---------- */
  var t1 = S(HEAD + BRANCH_SIG, `    // ${C("TODO: depth == 0 bölsa — tugatiş; aks holda uçidan ikki şox: a + 20 va a − 20, uzunlik len·0,7, depth − 1", "TODO: если depth == 0 — выход; иначе из конца две ветки: a + 20 и a − 20, длина len·0,7, depth − 1")}
`, `    if (depth == 0) return;
    branch(nx, ny, a + 20, len * 0.7, depth - 1);
    branch(nx, ny, a - 20, len * 0.7, depth - 1);
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    branch(240, 15, 90, 115, 8);                // ${C("2⁹ − 1 = 511 ta şox", "2⁹ − 1 = 511 веток")}
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: rekursiv daraxt"));

  /* ---------- 2. Tasodifiy daraxt ---------- */
  var t2 = S(HEAD + `// ${C("Tasodifiy son [−1; 1]", "Случайное число [−1; 1]")}
double rnd() { return (rand() % 2001) / 1000.0 - 1; }

void branch(double x, double y, double a, double len, int depth) {
    double nx = x + len * cos(a * PI / 180), ny = y + len * sin(a * PI / 180);
    glLineWidth(1 + depth * 0.6f);
    glColor3f(0.55f - 0.04f * (8 - depth), 0.35f + 0.07f * (8 - depth), 0.2f);
    glBegin(GL_LINES); glVertex2d(x, y); glVertex2d(nx, ny); glEnd();
    if (depth == 0) return;
`, `    // ${C("TODO: burçak a ± (20 + 12·rnd()), uzunlik len·(0,7 + 0,12·rnd()) — har bir şox uçun alohida", "TODO: угол a ± (20 + 12·rnd()), длина len·(0,7 + 0,12·rnd()) — для каждой ветки отдельно")}
    branch(nx, ny, a + 20, len * 0.7, depth - 1);
    branch(nx, ny, a - 20, len * 0.7, depth - 1);
`, `    branch(nx, ny, a + 20 + 12 * rnd(), len * (0.7 + 0.12 * rnd()), depth - 1);
    branch(nx, ny, a - 20 - 12 * rnd(), len * (0.7 + 0.12 * rnd()), depth - 1);
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    srand(4);                                   // ${C("har kadrda bir xil daraxt", "в каждом кадре одно и то же дерево")}
    branch(240, 15, 90, 110, 8);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: tasodifiy daraxt"));

  /* ---------- 3. L-tizim: Kox ---------- */
  var t3 = S(HEAD + LSYS + `// ${C("Bir qadam: har bir 'F' qoida bilan almaştiriladi, boşqa belgilar özgarmaydi", "Один шаг: каждая 'F' заменяется правилом, прочие символы копируются")}
void expand(const char* rule) {
    int n = strlen(cur), k = 0, m = strlen(rule);
`, `    // ${C("TODO: i = 0..n−1: cur[i] == 'F' bölsa — rule ning barça belgilarini nxt ga, aks holda cur[i] ni; oxirida nxt[k] = 0, strcpy(cur, nxt)", "TODO: i = 0..n−1: если cur[i] == 'F' — скопируйте в nxt все символы rule, иначе — cur[i]; в конце nxt[k] = 0, strcpy(cur, nxt)")}
`, `    for (int i = 0; i < n; i++) {
        if (cur[i] == 'F') { for (int j = 0; j < m; j++) nxt[k++] = rule[j]; }
        else nxt[k++] = cur[i];
    }
    nxt[k] = 0;
    strcpy(cur, nxt);
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    strcpy(cur, "F");                            // ${C("aksioma", "аксиома")}
    for (int it = 0; it < 5; it++) expand("F+F--F+F");
    glColor3f(0.5f, 0.85f, 1.0f);
    glLineWidth(1.5f);
    fitAndDraw(0, 60);                           // ${C("burilish burçagi δ = 60°", "угол поворота δ = 60°")}
    printf("${C("satr uzunligi", "длина строки")}: %d\\n", (int)strlen(cur));
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: L-Kox"));

  /* ---------- 4. L-tizim: fraktal ösimlik ---------- */
  var t4 = S(HEAD + `char cur[60000], nxt[60000];
` + EXPAND + `void plant(double x0, double y0, double step) {
    double x = x0, y = y0, a = 90, delta = 22.5;
    double sx[200], sy[200], sa[200];
    int top = 0, n = strlen(cur);
    glBegin(GL_LINES);
    for (int i = 0; i < n; i++) {
        char c = cur[i];
        if (c == 'F') {
            double nx = x + step * cos(a * PI / 180), ny = y + step * sin(a * PI / 180);
            glVertex2d(x, y); glVertex2d(nx, ny);
            x = nx; y = ny;
        }
        else if (c == '+') a += delta;
        else if (c == '-') a -= delta;
`, `        // ${C("TODO: '[' — (x, y, a) ni stekka qöying (sx, sy, sa, top++); ']' — stekdan qaytaring (top−−)", "TODO: '[' — положите (x, y, a) в стек (sx, sy, sa, top++); ']' — восстановите из стека (top−−)")}
`, `        else if (c == '[') { sx[top] = x; sy[top] = y; sa[top] = a; top++; }   // ${C("şoxlaniş nuqtasini eslab qolamiz", "запоминаем точку ветвления")}
        else if (c == ']') { top--; x = sx[top]; y = sy[top]; a = sa[top]; }  // ${C("unga qaytamiz", "возвращаемся к ней")}
`, `    }
    glEnd();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    strcpy(cur, "F");
    for (int it = 0; it < 4; it++) expand("FF-[-F+F+F]+[+F-F-F]");
    glColor3f(0.45f, 0.85f, 0.4f);
    plant(240, 10, 6.4);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: L-osimlik"));

  /* ---------- 5. Barnsli paporotnigi ---------- */
  var t5 = S(HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    srand(2);
    double x = 0, y = 0;
    glPointSize(1.0f);
    glColor3f(0.35f, 0.9f, 0.4f);
    glBegin(GL_POINTS);
    for (int i = 0; i < 50000; i++) {
        int r = rand() % 100;
        double nx, ny;
`, `        // ${C("TODO: 4 ta affin almaştiriş, ehtimolligi 1%, 85%, 7%, 7%:", "TODO: 4 аффинных преобразования с вероятностями 1%, 85%, 7%, 7%:")}
        // ${C("r < 1:  nx = 0;                 ny = 0,16y", "r < 1:  nx = 0;                 ny = 0,16y")}
        // ${C("r < 86: nx = 0,85x + 0,04y;     ny = −0,04x + 0,85y + 1,6", "r < 86: nx = 0,85x + 0,04y;     ny = −0,04x + 0,85y + 1,6")}
        // ${C("r < 93: nx = 0,2x − 0,26y;      ny = 0,23x + 0,22y + 1,6", "r < 93: nx = 0,2x − 0,26y;      ny = 0,23x + 0,22y + 1,6")}
        // ${C("aks holda: nx = −0,15x + 0,28y; ny = 0,26x + 0,24y + 0,44", "иначе:    nx = −0,15x + 0,28y; ny = 0,26x + 0,24y + 0,44")}
        nx = 0.5 * x; ny = 0.5 * y + 1;
`, `        if (r < 1)       { nx = 0;                    ny = 0.16 * y; }                  // ${C("poya", "стебель")}
        else if (r < 86) { nx = 0.85 * x + 0.04 * y;  ny = -0.04 * x + 0.85 * y + 1.6; } // ${C("kiçraygan nusxa", "уменьшенная копия")}
        else if (r < 93) { nx = 0.2 * x - 0.26 * y;   ny = 0.23 * x + 0.22 * y + 1.6; }  // ${C("çap barg", "левый лист")}
        else             { nx = -0.15 * x + 0.28 * y; ny = 0.26 * x + 0.24 * y + 0.44; } // ${C("ong barg", "правый лист")}
`, `        x = nx; y = ny;
        glVertex2d(240 + 42 * x, 12 + 45.5 * y);
    }
    glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: Barnsli"));

  /* ---------- 6. Serpinskiy — L-tizim ---------- */
  var t6 = S(HEAD + LSYS + `// ${C("Ikki belgili qoida: A → B−A−B, B → A+B+A (ikkalasi ham «oldinga çiz»)", "Правило с двумя символами: A → B−A−B, B → A+B+A (оба означают «рисовать вперёд»)")}
void expand2() {
    int n = strlen(cur), k = 0;
    for (int i = 0; i < n; i++) {
`, `        // ${C("TODO: cur[i] == 'A' → nxt ga \"B-A-B\"; 'B' → \"A+B+A\"; boşqa belgilar — özgarişsiz", "TODO: cur[i] == 'A' → в nxt \"B-A-B\"; 'B' → \"A+B+A\"; прочие символы — без изменений")}
        nxt[k++] = cur[i];
`, `        if (cur[i] == 'A') { nxt[k++] = 'B'; nxt[k++] = '-'; nxt[k++] = 'A'; nxt[k++] = '-'; nxt[k++] = 'B'; }
        else if (cur[i] == 'B') { nxt[k++] = 'A'; nxt[k++] = '+'; nxt[k++] = 'B'; nxt[k++] = '+'; nxt[k++] = 'A'; }
        else nxt[k++] = cur[i];
`, `    }
    nxt[k] = 0;
    strcpy(cur, nxt);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    strcpy(cur, "A");
    for (int it = 0; it < 7; it++) expand2();
    glColor3f(1.0f, 0.75f, 0.35f);
    fitAndDraw(0, 60);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: L-Serpinskiy"));

  /* ---------- 7. Dekorativ naqş ---------- */
  var t7 = S(HEAD + LSYS + EXPAND + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
`, `    // ${C("TODO: Kox oroli — aksioma \"F-F-F-F\", qoida \"F-F+F+FF-F-F+F\", burçak 90°, 3 iteratsiya; boşlanğiç burçak 0", "TODO: остров Коха — аксиома \"F-F-F-F\", правило \"F-F+F+FF-F-F+F\", угол 90°, 3 итерации; начальный угол 0")}
    strcpy(cur, "F-F-F-F");
    double delta = 90;
`, `    strcpy(cur, "F-F-F-F");
    for (int it = 0; it < 3; it++) expand("F-F+F+FF-F-F+F");
    double delta = 90;
`, `    glColor3f(0.85f, 0.55f, 1.0f);
    glLineWidth(1.5f);
    fitAndDraw(0, delta);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A15: naqsh"));

  /* ---------- 8. 3D fraktal daraxt ---------- */
  var t8 = S(HEAD + `GLUquadric* q;

// ${C("3D şox: Oy böylab silindr; uçidan 3 ta kiçikroq şox, Oy atrofida 120° farq bilan, 35° ga oğgan", "3D-ветка: цилиндр вдоль Oy; из конца 3 меньшие ветки с разницей 120° вокруг Oy, отклонённые на 35°")}
void branch3(int depth, double len, double r) {
    glColor3f(0.5f - 0.05f * (5 - depth), 0.32f + 0.1f * (5 - depth), 0.2f);
    glPushMatrix();
    glRotatef(-90, 1, 0, 0);                   // ${C("gluCylinder Oz böylab — Oy ga buramiz", "gluCylinder идёт вдоль Oz — поворачиваем к Oy")}
    gluCylinder(q, r, r * 0.7, len, 8, 1);
    glPopMatrix();
    if (depth == 0) return;
    glTranslatef(0, len, 0);
`, `    // ${C("TODO: k = 0..2: glPushMatrix; Oy atrofida 120k + 30·depth; Oz atrofida 35°; branch3(depth − 1, len·0,68, r·0,65); glPopMatrix", "TODO: k = 0..2: glPushMatrix; поворот вокруг Oy на 120k + 30·depth; вокруг Oz на 35°; branch3(depth − 1, len·0,68, r·0,65); glPopMatrix")}
`, `    for (int k = 0; k < 3; k++) {
        glPushMatrix();
        glRotatef(120 * k + 30 * depth, 0, 1, 0);   // ${C("3 yönaliş aylana böylab", "3 направления по кругу")}
        glRotatef(35, 0, 0, 1);                     // ${C("tanadan oğiş", "отклонение от ствола")}
        branch3(depth - 1, len * 0.68, r * 0.65);
        glPopMatrix();
    }
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 3.2, 9,  0, 2.6, 0,  0, 1, 0);
    GLfloat d[] = { 0.4f, 0.9f, 0.6f, 0 };
    glLightfv(GL_LIGHT0, GL_POSITION, d);
    glRotatef(20 * glutGet(GLUT_ELAPSED_TIME) / 1000.0f, 0, 1, 0);
    glPushMatrix();
    branch3(5, 2.2, 0.18);
    glPopMatrix();
    glutSwapBuffers();
}

void reshape3(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.3, 100.0);
    glMatrixMode(GL_MODELVIEW);
}
void idle() { glutPostRedisplay(); }

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(W, H);
    glutCreateWindow("A15: 3D daraxt");
    glClearColor(0.08f, 0.11f, 0.2f, 1.0f);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING); glEnable(GL_LIGHT0);
    glEnable(GL_COLOR_MATERIAL);
    glEnable(GL_NORMALIZE);
    q = gluNewQuadric();
    glutDisplayFunc(display);
    glutReshapeFunc(reshape3);
    glutIdleFunc(idle);
    glutMainLoop();
    return 0;
}
`);

  LAB.define({
    n: 15,
    title: { uz: "Fraktal grafikasi asosida murakkab tasvirlar va L-tizimlar", ru: "Сложные изображения на основе фракталов и L-систем" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: rekursiv daraxt", ru: "Пример: рекурсивное дерево" },
        text: { uz: "<p>Daraxt — <b>rekursiv</b> struktura: şox uçidan ikki kiçikroq şox ösadi, ularning har biridan yana ikkitadan va h.k. Funksiya özini özi çaqiradi; <code>depth</code> har qadamda kamayadi va 0 ga yetganda rekursiya töxtaydi. Şox qalinligi va rangi çuqurlikka böğliq.</p>",
                ru: "<p>Дерево — <b>рекурсивная</b> структура: из конца ветки растут две меньшие, из каждой — ещё по две и т. д. Функция вызывает саму себя; <code>depth</code> уменьшается на каждом шаге, при 0 рекурсия останавливается. Толщина и цвет ветки зависят от глубины.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Rekursiv daraxt (8 daraja)", ru: "Задание 1. Рекурсивное дерево (8 уровней)" },
        text: { uz: "<p>Rekursiv daraxtni 8 darajali qiling: har bir şoxdan çapga va öngga 20° ga oğgan ikki şox, uzunlik koeffitsiyenti 0,7. Jami 2⁹ − 1 = 511 ta şox. Rekursiya tagi (<code>depth == 0</code>) bölmasa, dastur hech qaçon tugamaydi.</p>",
                ru: "<p>Сделайте рекурсивное дерево с 8 уровнями: из каждой ветки — две, отклонённые влево и вправо на 20°, коэффициент длины 0,7. Всего 2⁹ − 1 = 511 веток. Без дна рекурсии (<code>depth == 0</code>) программа никогда не завершится.</p>" },
        hint: { uz: "if (depth == 0) return; branch(nx, ny, a + 20, len·0.7, depth − 1); branch(nx, ny, a − 20, len·0.7, depth − 1);", ru: "if (depth == 0) return; branch(nx, ny, a + 20, len·0.7, depth − 1); branch(nx, ny, a − 20, len·0.7, depth − 1);" },
        check: { type: "both", calls: { "glBegin": ">=511" } }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Tasodifiy daraxt", ru: "Задание 2. Случайное дерево" },
        text: { uz: "<p>Tabiiy daraxtlar simmetrik emas. Burçakka ±12° va uzunlik koeffitsiyentiga ±0,12 tasodifiy özgariş qöşing. <code>srand(4)</code> har kadr boşida çaqiriladi — şunda daraxt har kadrda bir xil, «titramaydi». Boşqa urlöğ (seed) — boşqa daraxt.</p>",
                ru: "<p>Природные деревья несимметричны. Добавьте к углу случайное отклонение ±12°, а к коэффициенту длины ±0,12. <code>srand(4)</code> вызывается в начале каждого кадра — тогда дерево в каждом кадре одинаковое и не «дрожит». Другое зерно (seed) — другое дерево.</p>" },
        hint: { uz: "branch(nx, ny, a + 20 + 12·rnd(), len·(0.7 + 0.12·rnd()), depth − 1); va a − 20 − 12·rnd() uçun ham.", ru: "branch(nx, ny, a + 20 + 12·rnd(), len·(0.7 + 0.12·rnd()), depth − 1); и аналогично для a − 20 − 12·rnd()." },
        check: { type: "image", maxDiff: 0.004 }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. L-tizim: Kox egri çiziği", ru: "Задание 3. L-система: кривая Коха" },
        text: { uz: "<p><b>L-tizim</b> — satrlarni qayta yoziş qoidalari: aksioma «F», qoida F → F+F−−F+F. Har iteratsiyada barça F lar qoida bilan almaştiriladi. Natijani «toşbaqa» çizadi: F — oldinga, + / − — 60° ga buriliş. <code>expand</code> funksiyasini yozing; 5 iteratsiyadan keyin satrda 4⁵ = 1024 ta F bor.</p>",
                ru: "<p><b>L-система</b> — правила переписывания строк: аксиома «F», правило F → F+F−−F+F. На каждой итерации все F заменяются правилом. Результат рисует «черепаха»: F — вперёд, + / − — поворот на 60°. Напишите функцию <code>expand</code>; после 5 итераций в строке 4⁵ = 1024 символа F.</p>" },
        hint: { uz: "for i: if (cur[i] == 'F') for j: nxt[k++] = rule[j]; else nxt[k++] = cur[i]; nxt[k] = 0; strcpy(cur, nxt);", ru: "for i: if (cur[i] == 'F') for j: nxt[k++] = rule[j]; else nxt[k++] = cur[i]; nxt[k] = 0; strcpy(cur, nxt);" },
        check: { type: "both", maxDiff: 0.003, calls: { "glVertex2d": ">=2048" } }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. L-tizim: fraktal ösimlik", ru: "Задание 4. L-система: фрактальное растение" },
        text: { uz: "<p>Qoida F → FF−[−F+F+F]+[+F−F−F], burçak 22,5°, 4 iteratsiya. Kvadrat qavslar — <b>şoxlaniş</b>: «[» toşbaqa holatini (x, y, burçak) stekka saqlaydi, «]» uni qaytaradi — toşbaqa şoxlaniş nuqtasiga «sakrab» qaytadi. Stekni yozing.</p>",
                ru: "<p>Правило F → FF−[−F+F+F]+[+F−F−F], угол 22,5°, 4 итерации. Квадратные скобки — <b>ветвление</b>: «[» сохраняет состояние черепахи (x, y, угол) в стек, «]» восстанавливает его — черепаха «прыгает» обратно в точку ветвления. Реализуйте стек.</p>" },
        hint: { uz: "'[': sx[top] = x; sy[top] = y; sa[top] = a; top++;   ']': top−−; x = sx[top]; y = sy[top]; a = sa[top];", ru: "'[': sx[top] = x; sy[top] = y; sa[top] = a; top++;   ']': top−−; x = sx[top]; y = sy[top]; a = sa[top];" },
        check: { type: "image", maxDiff: 0.004 }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Barnsli paporotnigi", ru: "Задание 5. Папоротник Барнсли" },
        text: { uz: "<p><b>Iteratsion funksiyalar tizimi</b> (IFS): nuqtaga 4 ta affin almaştirişdan biri tasodifiy (1%, 85%, 7%, 7% ehtimollik bilan) qöllanadi. 50 000 qadamdan keyin nuqtalar paporotnik şaklini hosil qiladi: 85% li almaştiriş — butun bargning kiçraygan nusxasi, qolganlari — poya va ikki yon barg.</p>",
                ru: "<p><b>Система итерируемых функций</b> (IFS): к точке случайно применяется одно из 4 аффинных преобразований (с вероятностями 1%, 85%, 7%, 7%). После 50 000 шагов точки образуют папоротник: преобразование с 85% — уменьшенная копия всего листа, остальные — стебель и два боковых листа.</p>" },
        hint: { uz: "if (r < 1) {...} else if (r < 86) {...} else if (r < 93) {...} else {...}", ru: "if (r < 1) {...} else if (r < 86) {...} else if (r < 93) {...} else {...}" },
        check: { type: "image", maxDiff: 0.004 }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Serpinskiy uçburçagi (L-tizim)", ru: "Задание 6. Треугольник Серпинского (L-система)" },
        text: { uz: "<p>Serpinskiy uçburçagini endi L-tizim bilan oling: aksioma «A», qoidalar A → B−A−B va B → A+B+A, burçak 60°, 7 iteratsiya. Ikkala belgi ham «oldinga çiz» degani — farqi faqat almaştiriş qoidasida. Natija — «Serpinskiy egri çiziği» (uzluksiz çiziq).</p>",
                ru: "<p>Получите треугольник Серпинского теперь L-системой: аксиома «A», правила A → B−A−B и B → A+B+A, угол 60°, 7 итераций. Оба символа означают «рисовать вперёд» — различаются лишь правилами замены. Результат — «кривая Серпинского» (непрерывная линия).</p>" },
        hint: { uz: "if (cur[i] == 'A') yozing B,-,A,-,B; else if (cur[i] == 'B') yozing A,+,B,+,A; else nxt[k++] = cur[i];", ru: "if (cur[i] == 'A') запишите B,-,A,-,B; else if (cur[i] == 'B') запишите A,+,B,+,A; else nxt[k++] = cur[i];" },
        check: { type: "image", maxDiff: 0.004 }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Dekorativ naqş", ru: "Задание 7. Декоративный узор" },
        text: { uz: "<p>Umumiy L-tizim «mexanizmi» tayyor — faqat aksioma, qoida va burçakni bering. <b>Kox oroli</b>: aksioma «F−F−F−F» (kvadrat), qoida F → F−F+F+FF−F−F+F, burçak 90°, 3 iteratsiya. Söngra öz qoidangizni sinab köring (masalan, F → F+F−F−F+F, 90°) va natijani hisobotga qöşing.</p>",
                ru: "<p>Общий «механизм» L-системы готов — задайте только аксиому, правило и угол. <b>Остров Коха</b>: аксиома «F−F−F−F» (квадрат), правило F → F−F+F+FF−F−F+F, угол 90°, 3 итерации. Затем попробуйте своё правило (например, F → F+F−F−F+F, 90°) и добавьте результат в отчёт.</p>" },
        hint: { uz: "strcpy(cur, \"F-F-F-F\"); for 3 marta: expand(\"F-F+F+FF-F-F+F\");", ru: "strcpy(cur, \"F-F-F-F\"); 3 раза: expand(\"F-F+F+FF-F-F+F\");" },
        check: { type: "image", maxDiff: 0.004 }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. 3D fraktal daraxt", ru: "Задание 8. 3D фрактальное дерево" },
        text: { uz: "<p>Rekursiv daraxtni fazoga ötkazing: har bir şox — silindr (<code>gluCylinder</code>), uçidan 3 ta kiçikroq şox çiqadi, Oy atrofida 120° farq bilan va 35° ga oğgan. Har bir daraja <code>glPushMatrix</code>/<code>glPopMatrix</code> içida — almaştirişlar ierarxiyasi rekursiya bilan bir xil tuzilgan. 5 daraja: 1 + 3 + … + 3⁵ = 364 şox.</p>",
                ru: "<p>Перенесите рекурсивное дерево в пространство: каждая ветка — цилиндр (<code>gluCylinder</code>), из её конца выходят 3 меньшие ветки с разницей 120° вокруг Oy и отклонением 35°. Каждый уровень — внутри <code>glPushMatrix</code>/<code>glPopMatrix</code>: иерархия преобразований устроена так же, как рекурсия. 5 уровней: 1 + 3 + … + 3⁵ = 364 ветки.</p>" },
        hint: { uz: "for k < 3: Push; Rotate(120k + 30·depth, 0, 1, 0); Rotate(35, 0, 0, 1); branch3(depth − 1, len·0,68, r·0,65); Pop;", ru: "for k < 3: Push; Rotate(120k + 30·depth, 0, 1, 0); Rotate(35, 0, 0, 1); branch3(depth − 1, len·0,68, r·0,65); Pop;" },
        check: { type: "both", calls: { "gluCylinder": ">=364" } }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
