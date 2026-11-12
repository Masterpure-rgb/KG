/* A9. OpenGL: geometriyani yaratiş usullari va dasturni optimallaştiriş (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n#define PI 3.14159265f\n";
  var LIGHT = `// ${C("Yoritiş va rang-material", "Освещение и цвет-материал")}
void initGL() {
    GLfloat dir[] = { 0.4f, 0.8f, 0.6f, 0 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, dir);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE);
    glEnable(GL_NORMALIZE);          // ${C("glScalef dan keyin normallar uzunligi 1 bölib qolsin", "после glScalef нормали остаются единичными")}
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
}
// ${C("FPS hisoblagiç: har 500 ms da konsolga", "Счётчик FPS: каждые 500 мс в консоль")}
int frames = 0, t0 = 0;
void fps(const char* tag) {
    frames++;
    int now = glutGet(GLUT_ELAPSED_TIME);
    if (now - t0 >= 500) { printf("%s: %.1f FPS\\n", tag, frames * 1000.0f / (now - t0)); frames = 0; t0 = now; }
}

`;
  var SPH_PT = `// ${C("Birlik sfera nuqtasi: kenglik i ∈ [0; ST], uzunlik j ∈ [0; SL]", "Точка единичной сферы: широта i ∈ [0; ST], долгота j ∈ [0; SL]")}
#define SL 32
#define ST 16
void spherePoint(int i, int j, float p[3]) {
    float u = -PI / 2 + PI * i / ST, v = 2 * PI * j / SL;
    p[0] = cos(u) * cos(v); p[1] = sin(u); p[2] = -cos(u) * sin(v);
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.5, 200.0);
    glMatrixMode(GL_MODELVIEW);
}
`;
  function MAIN(title, extra) {
    return `
void idle() { glutPostRedisplay(); }

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(480, 360);
    glutCreateWindow("${title}");
    glClearColor(0.08f, 0.11f, 0.2f, 1.0f);
    initGL();
${extra || ""}    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutIdleFunc(idle);
    glutMainLoop();
    return 0;
}
`;
  }
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }
  var VIEW = `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 1.2, 5,  0, 0, 0,  0, 1, 0);
`;

  /* ---------- Misol: darhol rejim ---------- */
  var ex = HEAD + LIGHT + SPH_PT + `// ${C("Darhol rejim (immediate mode): har kadrda 3072 ta uç alohida funksiya çaqiriqlari bilan yuboriladi", "Немедленный режим: каждый кадр 3072 вершины передаются отдельными вызовами функций")}
void sphereImmediate() {
    float p[3];
    glBegin(GL_TRIANGLES);
    for (int i = 0; i < ST; i++)
        for (int j = 0; j < SL; j++) {
            int q[6][2] = { {i, j}, {i, j + 1}, {i + 1, j + 1}, {i, j}, {i + 1, j + 1}, {i + 1, j} };
            for (int k = 0; k < 6; k++) {
                spherePoint(q[k][0], q[k][1], p);
                glNormal3fv(p);
                glVertex3fv(p);
            }
        }
    glEnd();
}

void display() {
` + VIEW + `    glColor3f(0.35f, 0.6f, 1.0f);
    glScalef(1.6f, 1.6f, 1.6f);
    sphereImmediate();
    fps("glBegin/glEnd");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: immediate");

  /* ---------- 1. glDrawArrays ---------- */
  var ARR = `// ${C("Uçlar va normallar massivlari: 32·16 ta törtburçak × 2 uçburçak × 3 uç", "Массивы вершин и нормалей: 32·16 четырёхугольников × 2 треугольника × 3 вершины")}
#define NV (SL * ST * 6)
float va[NV * 3], na[NV * 3];

void buildArrays() {
    int n = 0;
    float p[3];
    for (int i = 0; i < ST; i++)
        for (int j = 0; j < SL; j++) {
            int q[6][2] = { {i, j}, {i, j + 1}, {i + 1, j + 1}, {i, j}, {i + 1, j + 1}, {i + 1, j} };
            for (int k = 0; k < 6; k++) {
                spherePoint(q[k][0], q[k][1], p);
                for (int m = 0; m < 3; m++) { va[3 * n + m] = p[m]; na[3 * n + m] = p[m]; }
                n++;
            }
        }
}

`;
  var t1 = S(HEAD + LIGHT + SPH_PT + ARR + `void display() {
` + VIEW + `    glColor3f(0.35f, 0.6f, 1.0f);
    glScalef(1.6f, 1.6f, 1.6f);
`, `    // ${C("TODO: glEnableClientState(GL_VERTEX_ARRAY / GL_NORMAL_ARRAY), glVertexPointer, glNormalPointer,", "TODO: glEnableClientState(GL_VERTEX_ARRAY / GL_NORMAL_ARRAY), glVertexPointer, glNormalPointer,")}
    // ${C("glDrawArrays(GL_TRIANGLES, 0, NV) — bitta çaqiriq bilan butun sfera; glBegin işlatilmasin", "glDrawArrays(GL_TRIANGLES, 0, NV) — вся сфера одним вызовом; glBegin не использовать")}
`, `    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_NORMAL_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, va);
    glNormalPointer(GL_FLOAT, 0, na);
    glDrawArrays(GL_TRIANGLES, 0, NV);            // ${C("3072 ta uç — bitta çaqiriq", "3072 вершины — один вызов")}
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
`, `    fps("glDrawArrays");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: glDrawArrays", "    buildArrays();\n"));

  /* ---------- 2. Displey röyxati ---------- */
  var SCENE = `// ${C("Sahna: 5 ta sfera va 5 ta kub", "Сцена: 5 сфер и 5 кубов")}
void scene() {
    for (int k = 0; k < 5; k++) {
        float x = -4 + 2 * k;
        glPushMatrix(); glTranslatef(x, 0.8f, 0); glColor3f(0.35f, 0.6f, 1.0f); glutSolidSphere(0.7, 32, 24); glPopMatrix();
        glPushMatrix(); glTranslatef(x, -0.9f, 0); glRotatef(30 + 15 * k, 0, 1, 0); glColor3f(1.0f, 0.6f, 0.3f); glutSolidCube(1.0); glPopMatrix();
    }
}

`;
  var VIEW2 = `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2.5, 9,  0, 0, 0,  0, 1, 0);
`;
  var t2 = S(HEAD + LIGHT + SCENE + `GLuint list = 0;

void build() {
`, `    // ${C("TODO: list = glGenLists(1); glNewList(list, GL_COMPILE); scene(); glEndList();", "TODO: list = glGenLists(1); glNewList(list, GL_COMPILE); scene(); glEndList();")}
}

void display() {
` + VIEW2 + `    // ${C("TODO: scene() örniga glCallList(list)", "TODO: вместо scene() — glCallList(list)")}
    scene();
`, `    list = glGenLists(1);
    glNewList(list, GL_COMPILE);       // ${C("buyruqlar bajarilmaydi, faqat yozib olinadi", "команды не выполняются, а записываются")}
    scene();
    glEndList();
}

void display() {
` + VIEW2 + `    glCallList(list);                  // ${C("tayyor röyxatni bir çaqiriq bilan ijro etiş", "воспроизведение готового списка одним вызовом")}
`, `    fps("display list");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: display list", "    build();\n"));

  /* ---------- 3. VBO ---------- */
  var t3 = S(HEAD + LIGHT + SPH_PT + ARR + `GLuint vbo[2];

void buildVBO() {
    buildArrays();
`, `    // ${C("TODO: glGenBuffers(2, vbo); uçlarni vbo[0] ga, normallarni vbo[1] ga glBufferData bilan yuklang", "TODO: glGenBuffers(2, vbo); загрузите вершины в vbo[0], нормали в vbo[1] через glBufferData")}
}

void display() {
` + VIEW + `    glColor3f(0.35f, 0.6f, 1.0f);
    glScalef(1.6f, 1.6f, 1.6f);
    // ${C("TODO: bufferlarni boğlang (glBindBuffer), glVertexPointer/glNormalPointer ga (void*)0 siljiş bering, glDrawArrays", "TODO: привяжите буферы (glBindBuffer), в glVertexPointer/glNormalPointer передайте смещение (void*)0, glDrawArrays")}
`, `    glGenBuffers(2, vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo[0]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(va), va, GL_STATIC_DRAW);    // ${C("bir marta — videoxotiraga", "один раз — в видеопамять")}
    glBindBuffer(GL_ARRAY_BUFFER, vbo[1]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(na), na, GL_STATIC_DRAW);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
}

void display() {
` + VIEW + `    glColor3f(0.35f, 0.6f, 1.0f);
    glScalef(1.6f, 1.6f, 1.6f);
    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_NORMAL_ARRAY);
    glBindBuffer(GL_ARRAY_BUFFER, vbo[0]);
    glVertexPointer(3, GL_FLOAT, 0, (void*)0);    // ${C("körsatkiç emas — bufer içidagi siljiş", "не указатель — смещение внутри буфера")}
    glBindBuffer(GL_ARRAY_BUFFER, vbo[1]);
    glNormalPointer(GL_FLOAT, 0, (void*)0);
    glDrawArrays(GL_TRIANGLES, 0, NV);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
`, `    fps("VBO");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: VBO", "    buildVBO();\n"));

  /* ---------- 4. Indeksli ---------- */
  var t4 = S(HEAD + LIGHT + SPH_PT + `// ${C("Umumiy uçlar: (ST+1)·(SL+1) = 561 ta, indekslar: 32·16·6 = 3072 ta", "Общие вершины: (ST+1)·(SL+1) = 561, индексы: 32·16·6 = 3072")}
#define NV ((ST + 1) * (SL + 1))
#define NI (ST * SL * 6)
float va[NV * 3];
unsigned int idx[NI];

void build() {
    float p[3];
    for (int i = 0; i <= ST; i++)
        for (int j = 0; j <= SL; j++) {
            spherePoint(i, j, p);
            int v = i * (SL + 1) + j;
            va[3 * v] = p[0]; va[3 * v + 1] = p[1]; va[3 * v + 2] = p[2];
        }
    int n = 0;
    for (int i = 0; i < ST; i++)
        for (int j = 0; j < SL; j++) {
            int a = i * (SL + 1) + j, b = a + 1, c = a + (SL + 1) + 1, d = a + (SL + 1);
`, `            // ${C("TODO: ikki uçburçak indekslarini yozing: (a, b, c) va (a, c, d)", "TODO: запишите индексы двух треугольников: (a, b, c) и (a, c, d)")}
`, `            idx[n++] = a; idx[n++] = b; idx[n++] = c;
            idx[n++] = a; idx[n++] = c; idx[n++] = d;
`, `        }
    printf("${C("uçlar", "вершин")}: %d (glDrawArrays: %d), ${C("indekslar", "индексов")}: %d\\n", NV, NI, NI);
}

void display() {
` + VIEW + `    glColor3f(0.35f, 0.6f, 1.0f);
    glScalef(1.6f, 1.6f, 1.6f);
    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_NORMAL_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, va);
    glNormalPointer(GL_FLOAT, 0, va);          // ${C("birlik sferada normal = nuqta", "у единичной сферы нормаль = точка")}
    glDrawElements(GL_TRIANGLES, NI, GL_UNSIGNED_INT, idx);
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
    fps("glDrawElements");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: glDrawElements", "    build();\n"));

  /* ---------- 5. 1000 obyekt ---------- */
  var CUBEARR = `// ${C("Kub: 36 ta uç (12 uçburçak) va normallar", "Куб: 36 вершин (12 треугольников) и нормали")}
float cv[36 * 3], cn[36 * 3];
void buildCube() {
    float F[6][4][3] = {
        { {-1,-1, 1}, { 1,-1, 1}, { 1, 1, 1}, {-1, 1, 1} }, { { 1,-1,-1}, {-1,-1,-1}, {-1, 1,-1}, { 1, 1,-1} },
        { { 1,-1, 1}, { 1,-1,-1}, { 1, 1,-1}, { 1, 1, 1} }, { {-1,-1,-1}, {-1,-1, 1}, {-1, 1, 1}, {-1, 1,-1} },
        { {-1, 1, 1}, { 1, 1, 1}, { 1, 1,-1}, {-1, 1,-1} }, { {-1,-1,-1}, { 1,-1,-1}, { 1,-1, 1}, {-1,-1, 1} } };
    float N[6][3] = { {0,0,1}, {0,0,-1}, {1,0,0}, {-1,0,0}, {0,1,0}, {0,-1,0} };
    int ord[6] = { 0, 1, 2, 0, 2, 3 }, n = 0;
    for (int f = 0; f < 6; f++)
        for (int k = 0; k < 6; k++, n++)
            for (int m = 0; m < 3; m++) { cv[3 * n + m] = F[f][ord[k]][m]; cn[3 * n + m] = N[f][m]; }
}
float px[1000], py[1000], pz[1000], cr[1000], cg[1000];
void placeCubes() {
    srand(7);
    for (int i = 0; i < 1000; i++) {
        px[i] = (rand() % 2000) / 100.0f - 10; py[i] = (rand() % 1200) / 100.0f - 6; pz[i] = -(rand() % 2000) / 100.0f;
        cr[i] = 0.3f + (rand() % 70) / 100.0f; cg[i] = 0.3f + (rand() % 70) / 100.0f;
    }
}

`;
  var t5 = S(HEAD + LIGHT + CUBEARR + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 0, 14,  0, 0, -5,  0, 1, 0);
`, `    // ${C("TODO: kub massivlarini bir marta ulang (glVertexPointer/glNormalPointer), keyin 1000 marta:", "TODO: один раз подключите массивы куба (glVertexPointer/glNormalPointer), затем 1000 раз:")}
    // ${C("glPushMatrix, glTranslatef(px, py, pz), glScalef(0,25), glColor3f(cr, cg, 0,9), glDrawArrays(GL_TRIANGLES, 0, 36), glPopMatrix", "glPushMatrix, glTranslatef(px, py, pz), glScalef(0,25), glColor3f(cr, cg, 0,9), glDrawArrays(GL_TRIANGLES, 0, 36), glPopMatrix")}
`, `    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_NORMAL_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, cv);
    glNormalPointer(GL_FLOAT, 0, cn);
    // ${C("Bitta geometriya — 1000 nusxa («instansing» ğoyasi): faqat matritsa va rang özgaradi", "Одна геометрия — 1000 копий (идея «инстансинга»): меняются только матрица и цвет")}
    for (int i = 0; i < 1000; i++) {
        glPushMatrix();
        glTranslatef(px[i], py[i], pz[i]);
        glScalef(0.25f, 0.25f, 0.25f);
        glColor3f(cr[i], cg[i], 0.9f);
        glDrawArrays(GL_TRIANGLES, 0, 36);
        glPopMatrix();
    }
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
`, `    fps("1000 cubes");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: 1000 kub", "    buildCube();\n    placeCubes();\n"));

  /* ---------- 6. Frustum culling ---------- */
  var t6 = S(HEAD + LIGHT + `// ${C("Katta sahna: 3000 ta sfera tekislikda tarqalgan", "Большая сцена: 3000 сфер разбросаны по плоскости")}
#define NB 3000
float bx[NB], bz[NB];
GLuint ball;
int drawn = 0;

void build() {
    srand(3);
    for (int i = 0; i < NB; i++) { bx[i] = (rand() % 16000) / 100.0f - 80; bz[i] = (rand() % 16000) / 100.0f - 80; }
    ball = glGenLists(1);
    glNewList(ball, GL_COMPILE);
    glutSolidSphere(0.6, 8, 6);
    glEndList();
}

// ${C("Sfera körinişda bölişi mumkinmi? Kamera (0, 2, 0) dan −z ga qaragan; köriniş burçagi ±35° (radiusni hisobga olib)", "Может ли сфера попасть в кадр? Камера в (0, 2, 0) смотрит вдоль −z; угол обзора ±35° (с учётом радиуса)")}
int visible(float x, float z) {
`, `    // ${C("TODO: d = −z (oldinga masofa); agar d < −0,6 yoki d > 100 — körinmaydi;", "TODO: d = −z (расстояние вперёд); если d < −0,6 или d > 100 — не видна;")}
    // ${C("agar |x| > d·tan(35°) + 0,6·1,3 — körinmaydi; aks holda — körinadi", "если |x| > d·tan(35°) + 0,6·1,3 — не видна; иначе — видна")}
    return 1;
`, `    float d = -z;
    if (d < -0.6f || d > 100) return 0;
    if (fabs(x) > d * tan(35 * PI / 180) + 0.6f * 1.3f) return 0;
    return 1;
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2, 0,  0, 1.2, -10,  0, 1, 0);
    drawn = 0;
    for (int i = 0; i < NB; i++) {
        if (!visible(bx[i], bz[i])) continue;      // ${C("kadrga tuşmaydigan obyekt — çizilmaydi", "объект вне кадра — не рисуется")}
        glPushMatrix();
        glTranslatef(bx[i], 0, bz[i]);
        glColor3f(0.4f + 0.004f * (i % 150), 0.7f, 0.9f - 0.003f * (i % 200));
        glCallList(ball);
        glPopMatrix();
        drawn++;
    }
    printf("${C("çizildi", "нарисовано")}: %d / %d\\n", drawn, NB);
    fps("culling");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: frustum culling", "    build();\n"));

  /* ---------- 7. LOD ---------- */
  var t7 = S(HEAD + LIGHT + `GLuint lod[3];      // ${C("32, 16 va 8 segmentli sfera", "сфера на 32, 16 и 8 сегментов")}

void build() {
    int seg[3] = { 32, 16, 8 };
    for (int k = 0; k < 3; k++) {
        lod[k] = glGenLists(1);
        glNewList(lod[k], GL_COMPILE);
        glutSolidSphere(0.8, seg[k], seg[k] / 2 + 2);
        glEndList();
    }
}

// ${C("Kameragaça masofa böyiça detallik darajasi", "Уровень детализации по расстоянию до камеры")}
int level(float d) {
`, `    // ${C("TODO: d < 8 → 0 (32 segment), d < 16 → 1 (16 segment), aks holda → 2 (8 segment)", "TODO: d < 8 → 0 (32 сегмента), d < 16 → 1 (16 сегментов), иначе → 2 (8 сегментов)")}
    return 0;
`, `    if (d < 8) return 0;
    if (d < 16) return 1;
    return 2;
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 5, 6,  0, 0, -9,  0, 1, 0);
    int tris = 0, full = 0;
    for (int k = 0; k < 8; k++) {
        float z = -3.0f * k;
        float d = sqrt(25.0f + (6 - z) * (6 - z));          // ${C("kamera (0, 5, 6) gaça masofa", "расстояние до камеры (0, 5, 6)")}
        // ${C("Çap ustun — har doim 32 segment", "Левый столбец — всегда 32 сегмента")}
        glPushMatrix(); glTranslatef(-1.3f, 0, z); glColor3f(0.4f, 0.6f, 1.0f); glCallList(lod[0]); glPopMatrix();
        // ${C("Ong ustun — LOD", "Правый столбец — LOD")}
        int L = level(d);
        glPushMatrix(); glTranslatef(1.3f, 0, z); glColor3f(1.0f, 0.6f, 0.3f); glCallList(lod[L]); glPopMatrix();
        int s = L == 0 ? 32 : (L == 1 ? 16 : 8);
        tris += s * (s / 2 + 2) * 2; full += 32 * 18 * 2;
    }
    printf("${C("uçburçaklar", "треугольников")}: LOD %d / ${C("töliq", "полная")} %d\\n", tris, full);
    fps("LOD");
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: LOD", "    build();\n"));

  /* ---------- 8. Holat özgartirişlari ---------- */
  var t8 = S(HEAD + `// ${C("4 ta material va 40 ta obyekt (material raqami tartibsiz)", "4 материала и 40 объектов (номера материалов вперемешку)")}
float MAT[4][3] = { {0.9f, 0.3f, 0.3f}, {0.3f, 0.85f, 0.4f}, {0.35f, 0.5f, 1.0f}, {1.0f, 0.8f, 0.3f} };
int om[40];
float ox[40], oy[40];
int order[40];
int switches = 0, cur = -1;

void initGL() {
    GLfloat dir[] = { 0.4f, 0.8f, 0.6f, 0 };
    glEnable(GL_LIGHTING); glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, dir);
    glEnable(GL_DEPTH_TEST);
    srand(11);
    for (int i = 0; i < 40; i++) { om[i] = rand() % 4; ox[i] = -6.3f + 1.4f * (i % 10); oy[i] = 3 - 2 * (i / 10); order[i] = i; }
}
// ${C("Material faqat özgarganda yuboriladi — holat özgarişlari sanaladi", "Материал отправляется только при смене — считаем смены состояния")}
void useMaterial(int m) {
    if (m == cur) return;
    GLfloat d[] = { MAT[m][0], MAT[m][1], MAT[m][2], 1 }, s[] = { 0.6f, 0.6f, 0.6f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, d);
    glMaterialfv(GL_FRONT, GL_SPECULAR, s);
    cur = m; switches++;
}
int fps_dummy = 0;
void fps(const char* tag) { fps_dummy++; }

void sortByMaterial() {
`, `    // ${C("TODO: order[] massivini om[order[i]] böyiça ösiş tartibida saralang (guruhlaş)", "TODO: отсортируйте массив order[] по om[order[i]] по возрастанию (группировка)")}
`, `    for (int i = 0; i < 40; i++)
        for (int j = i + 1; j < 40; j++)
            if (om[order[j]] < om[order[i]]) { int t = order[i]; order[i] = order[j]; order[j] = t; }
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 0, 13,  0, 0, 0,  0, 1, 0);
    switches = 0; cur = -1;
    for (int k = 0; k < 40; k++) {
        int i = order[k];
        useMaterial(om[i]);
        glPushMatrix();
        glTranslatef(ox[i], oy[i], 0);
        glutSolidSphere(0.6, 20, 14);
        glPopMatrix();
    }
    printf("${C("material almaştirişlari", "смен материала")}: %d\\n", switches);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A9: holat", "    sortByMaterial();\n").replace("    initGL();\n    sortByMaterial();\n", "    initGL();\n    sortByMaterial();\n"));

  LAB.define({
    n: 9,
    title: { uz: "OpenGL yordamida geometrik obyektlarni yaratiş usullari va dasturni optimallaştiriş", ru: "Способы построения геометрии и оптимизация программ OpenGL" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: darhol rejim (glBegin/glEnd)", ru: "Пример: немедленный режим (glBegin/glEnd)" },
        text: { uz: "<p>Sfera qölda 32×16 törtburçakdan (3072 uç) qurilgan va <b>darhol rejimda</b> çizilmoqda: har bir uç uçun <code>glNormal3fv</code> va <code>glVertex3fv</code> çaqiriladi — kadrda 6000 dan ortiq çaqiriq. Konsolda FPS çiqadi. Keyingi topşiriqlarda xuddi şu tasvirni tezroq çizamiz: tekşiriladigan narsa — <b>qanday</b> çizilgani.</p>",
                ru: "<p>Сфера построена вручную из 32×16 четырёхугольников (3072 вершины) и рисуется в <b>немедленном режиме</b>: для каждой вершины вызываются <code>glNormal3fv</code> и <code>glVertex3fv</code> — больше 6000 вызовов за кадр. В консоли выводится FPS. Дальше рисуем то же изображение быстрее: проверяется, <b>как</b> оно нарисовано.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. glBegin dan voz keçiş — glDrawArrays", ru: "Задание 1. Отказ от glBegin — glDrawArrays" },
        text: { uz: "<p>Sfera uçlari va normallari oldindan massivlarga yiğilgan (<code>buildArrays</code>). Ularni <b>uç massivlari</b> orqali çiqaring: <code>glVertexPointer</code>, <code>glNormalPointer</code> va bitta <code>glDrawArrays</code>. Dasturda <code>glBegin</code> qolmasligi kerak.</p>",
                ru: "<p>Вершины и нормали сферы заранее собраны в массивы (<code>buildArrays</code>). Выведите их через <b>массивы вершин</b>: <code>glVertexPointer</code>, <code>glNormalPointer</code> и один вызов <code>glDrawArrays</code>. В программе не должно остаться <code>glBegin</code>.</p>" },
        hint: { uz: "glEnableClientState(GL_VERTEX_ARRAY); glEnableClientState(GL_NORMAL_ARRAY); glVertexPointer(3, GL_FLOAT, 0, va); glNormalPointer(GL_FLOAT, 0, na); glDrawArrays(GL_TRIANGLES, 0, NV);", ru: "glEnableClientState(GL_VERTEX_ARRAY); glEnableClientState(GL_NORMAL_ARRAY); glVertexPointer(3, GL_FLOAT, 0, va); glNormalPointer(GL_FLOAT, 0, na); glDrawArrays(GL_TRIANGLES, 0, NV);" },
        check: { type: "both", calls: { "glBegin": 0, "glDrawArrays": ">=1" } }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Displey röyxati", ru: "Задание 2. Дисплейный список" },
        text: { uz: "<p>5 ta sfera va 5 ta kubdan iborat sahnani <b>displey röyxati</b>ga yozing: <code>glNewList(list, GL_COMPILE)</code> … <code>glEndList()</code> — bir marta, işga tuşganda. Har kadrda faqat <code>glCallList(list)</code> çaqiriladi. FPS ni oddiy usul bilan soliştiring va hisobotga yozing.</p>",
                ru: "<p>Запишите сцену из 5 сфер и 5 кубов в <b>дисплейный список</b>: <code>glNewList(list, GL_COMPILE)</code> … <code>glEndList()</code> — один раз при запуске. В каждом кадре вызывается только <code>glCallList(list)</code>. Сравните FPS с обычным способом и запишите в отчёт.</p>" },
        hint: { uz: "build(): list = glGenLists(1); glNewList(list, GL_COMPILE); scene(); glEndList(); display(): glCallList(list);", ru: "build(): list = glGenLists(1); glNewList(list, GL_COMPILE); scene(); glEndList(); display(): glCallList(list);" },
        check: { type: "both", calls: { "glCallList": ">=1" } }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Bufer obyektlari (VBO)", ru: "Задание 3. Буферные объекты (VBO)" },
        text: { uz: "<p>Massivlarni videokarta xotirasiga — <b>VBO</b> ga bir marta yuklang (<code>glGenBuffers</code>, <code>glBufferData</code>). Çizişda buferni <code>glBindBuffer</code> bilan boğlang; şunda <code>glVertexPointer</code> ning oxirgi argumenti — körsatkiç emas, bufer içidagi bayt siljişi <code>(void*)0</code>. Uç variantni (darhol rejim, displey röyxati, VBO) FPS böyiça soliştiring.</p>",
                ru: "<p>Загрузите массивы в память видеокарты — в <b>VBO</b> — один раз (<code>glGenBuffers</code>, <code>glBufferData</code>). При рисовании привяжите буфер <code>glBindBuffer</code>; тогда последний аргумент <code>glVertexPointer</code> — не указатель, а смещение в байтах внутри буфера <code>(void*)0</code>. Сравните три варианта (немедленный режим, дисплейный список, VBO) по FPS.</p>" },
        hint: { uz: "glBindBuffer(GL_ARRAY_BUFFER, vbo[0]); glVertexPointer(3, GL_FLOAT, 0, (void*)0); glBindBuffer(GL_ARRAY_BUFFER, vbo[1]); glNormalPointer(GL_FLOAT, 0, (void*)0);", ru: "glBindBuffer(GL_ARRAY_BUFFER, vbo[0]); glVertexPointer(3, GL_FLOAT, 0, (void*)0); glBindBuffer(GL_ARRAY_BUFFER, vbo[1]); glNormalPointer(GL_FLOAT, 0, (void*)0);" },
        check: { type: "both", calls: { "glBegin": 0, "glBindBuffer": ">=2", "glDrawArrays": ">=1" }, source: [{ re: "glBufferData", msg: { uz: "Ma'lumotlarni glBufferData bilan yuklang", ru: "Загрузите данные через glBufferData" } }] }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Indeksli çiqariş — glDrawElements", ru: "Задание 4. Индексный вывод — glDrawElements" },
        text: { uz: "<p><code>glDrawArrays</code> da qöşni uçburçaklarning umumiy uçlari takrorlanadi: 3072 ta uç. Umumiy uçlarni bir marta saqlang (561 ta) va uçburçaklarni <b>indekslar</b> bilan bering — <code>glDrawElements</code>. Har bir törtburçak — ikki uçburçak (a, b, c) va (a, c, d).</p>",
                ru: "<p>В <code>glDrawArrays</code> общие вершины соседних треугольников повторяются: 3072 вершины. Храните общие вершины один раз (561) и задавайте треугольники <b>индексами</b> — <code>glDrawElements</code>. Каждый четырёхугольник — два треугольника (a, b, c) и (a, c, d).</p>" },
        hint: { uz: "idx[n++] = a; idx[n++] = b; idx[n++] = c; idx[n++] = a; idx[n++] = c; idx[n++] = d;", ru: "idx[n++] = a; idx[n++] = b; idx[n++] = c; idx[n++] = a; idx[n++] = c; idx[n++] = d;" },
        check: { type: "both", calls: { "glBegin": 0, "glDrawElements": ">=1" } }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. 1000 ta obyekt («instansing»)", ru: "Задание 5. 1000 объектов («инстансинг»)" },
        text: { uz: "<p>1000 ta kiçik kubdan iborat sahna: joylari tasodifiy (lekin <code>srand(7)</code> tufayli har gal bir xil). Kub geometriyasi massivlarda bir marta — uni 1000 marta turli matritsa va rang bilan çizing. Bu — <b>instansing</b> ğoyasi: zamonaviy OpenGL da u bitta <code>glDrawArraysInstanced</code> bilan bajariladi.</p>",
                ru: "<p>Сцена из 1000 маленьких кубов: позиции случайные (но благодаря <code>srand(7)</code> каждый раз одинаковые). Геометрия куба в массивах одна — нарисуйте её 1000 раз с разными матрицей и цветом. Это идея <b>инстансинга</b>: в современном OpenGL она выполняется одним вызовом <code>glDrawArraysInstanced</code>.</p>" },
        hint: { uz: "Massivlarni sikldan oldin bir marta ulang; sikl içida faqat glPushMatrix/glTranslatef/glScalef/glColor3f/glDrawArrays/glPopMatrix.", ru: "Подключите массивы один раз до цикла; в цикле только glPushMatrix/glTranslatef/glScalef/glColor3f/glDrawArrays/glPopMatrix." },
        check: { type: "both", calls: { "glBegin": 0, "glDrawArrays": ">=1000" } }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Frustum culling", ru: "Задание 6. Отсечение по пирамиде видимости" },
        text: { uz: "<p>Sahnada 3000 ta sfera, lekin kamera ularning kiçik qismini köradi. Kameraga tuşmaydigan obyektlarni umuman çizmang: sfera kamera ortida, juda uzoqda yoki yon tomonda köriniş burçagidan taşqarida bölsa (radiusni hisobga olib) — taşlab yuboring. Tasvir özgarmaydi, çizilgan obyektlar soni (konsolda) keskin kamayadi.</p>",
                ru: "<p>В сцене 3000 сфер, но камера видит лишь малую их часть. Не рисуйте объекты, которые не попадают в кадр: если сфера за камерой, слишком далеко или сбоку за пределами угла обзора (с учётом радиуса) — пропускайте её. Изображение не меняется, а число нарисованных объектов (в консоли) резко падает.</p>" },
        hint: { uz: "d = −z; if (d < −0,6 || d > 100) return 0; if (fabs(x) > d·tan(35°) + 0,78) return 0; return 1;", ru: "d = −z; if (d < −0,6 || d > 100) return 0; if (fabs(x) > d·tan(35°) + 0,78) return 0; return 1;" },
        check: { type: "both", calls: { "glCallList": "<=1500" } }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Detallik darajalari (LOD)", ru: "Задание 7. Уровни детализации (LOD)" },
        text: { uz: "<p>Bir xil sfera uçun 3 ta detallik darajasi tayyorlangan: 32, 16 va 8 segment. Kameradan uzoqlaşgan sari soddaroq variantni tanlang: d < 8 → 32, d < 16 → 16, aks holda 8. Çap ustun — har doim töliq detal, ong ustun — LOD. Uzoqdagi şarlar deyarli farq qilmaydi, uçburçaklar esa ança kam.</p>",
                ru: "<p>Для одной сферы подготовлены 3 уровня детализации: 32, 16 и 8 сегментов. Чем дальше от камеры, тем проще вариант: d < 8 → 32, d < 16 → 16, иначе 8. Левый столбец — всегда полная детализация, правый — LOD. Дальние шары почти не отличаются, а треугольников намного меньше.</p>" },
        hint: { uz: "if (d < 8) return 0; if (d < 16) return 1; return 2;", ru: "if (d < 8) return 0; if (d < 16) return 1; return 2;" },
        check: { type: "image", maxDiff: 0.0005 }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Holat özgartirişlarini kamaytiriş", ru: "Задание 8. Сокращение смен состояния" },
        text: { uz: "<p>40 ta şar 4 xil materialda, tartibsiz çiziladi: material deyarli har bir obyektda almaşadi (konsolga qarang). Obyektlar çiziliş tartibini (<code>order[]</code>) material böyiça <b>guruhlang</b> — şunda material atigi 4 marta almaşadi. Videokartada holat özgarişi qimmat amal.</p>",
                ru: "<p>40 шаров четырёх материалов рисуются вперемешку: материал меняется почти на каждом объекте (см. консоль). <b>Сгруппируйте</b> порядок рисования (<code>order[]</code>) по материалу — тогда материал сменится всего 4 раза. Смена состояния на видеокарте — дорогая операция.</p>" },
        hint: { uz: "Pufakçali saralaş: if (om[order[j]] < om[order[i]]) order[i] va order[j] ni almaştiring.", ru: "Сортировка пузырьком: if (om[order[j]] < om[order[i]]) поменяйте order[i] и order[j]." },
        check: { type: "both", calls: { "glMaterialfv": "<=8" } }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
