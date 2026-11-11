/* A14. Landşaft dizayni: balandlik xaritasi, suv, osmon, daraxtlar, şamol, tölqinlar, parvoz (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n#include <cstdlib>\n\n#define PI 3.14159265f\n#define N 32\n#define CELL 1.25f\n\n";
  var LIGHT = `void initGL() {
    GLfloat amb[] = { 0.3f, 0.32f, 0.38f, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE);
    glEnable(GL_NORMALIZE);
    glEnable(GL_DEPTH_TEST);
}
void setSun() { GLfloat d[] = { -0.4f, 1.0f, 0.5f, 0 }; glLightfv(GL_LIGHT0, GL_POSITION, d); }
float now() { return glutGet(GLUT_ELAPSED_TIME) / 1000.0f; }

`;
  var HF = `// ${C("Balandlik formulasi: sinusoidalar yiğindisi (tepalik, vodiy, ko'l)", "Формула высоты: сумма синусоид (холмы, долины, озеро)")}
float height(float x, float z) {
    return 2.6f * sin(0.22f * x) * cos(0.18f * z) + 1.3f * sin(0.5f * x + 0.35f * z) + 0.6f * cos(0.9f * z) + 1.2f;
}
`;
  var GRIDH = `float H[N + 1][N + 1];      // ${C("balandliklar xaritasi (heightmap)", "карта высот (heightmap)")}
float X0(int i) { return -N * CELL / 2 + i * CELL; }
`;
  var FILLH = `void buildHeights() {
    for (int i = 0; i <= N; i++)
        for (int j = 0; j <= N; j++)
            H[i][j] = height(X0(i), X0(j));
}
`;
  var NORMAL = `// ${C("Uçdagi normal: markaziy ayirmalar (qöşni balandliklar farqi)", "Нормаль в вершине: центральные разности (разность соседних высот)")}
void normalAt(int i, int j) {
    int i0 = i > 0 ? i - 1 : i, i1 = i < N ? i + 1 : i, j0 = j > 0 ? j - 1 : j, j1 = j < N ? j + 1 : j;
    float dx = (H[i1][j] - H[i0][j]) / ((i1 - i0) * CELL), dz = (H[i][j1] - H[i][j0]) / ((j1 - j0) * CELL);
    glNormal3f(-dx, 1, -dz);
}
`;
  var COLOR = `// ${C("Rang balandlik böyiça: qum, ot, tosh, qor", "Цвет по высоте: песок, трава, камень, снег")}
void colorByHeight(float h) {
    if (h < 0.4f)      glColor3f(0.85f, 0.78f, 0.55f);
    else if (h < 3.0f) glColor3f(0.3f + 0.05f * h, 0.6f - 0.04f * h, 0.25f);
    else if (h < 4.6f) glColor3f(0.5f, 0.42f, 0.35f);
    else               glColor3f(0.95f, 0.96f, 1.0f);
}
`;
  var DRAWT = `void terrain() {
    for (int i = 0; i < N; i++) {
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= N; j++) {
            colorByHeight(H[i][j]);     normalAt(i, j);     glVertex3f(X0(i), H[i][j], X0(j));
            colorByHeight(H[i + 1][j]); normalAt(i + 1, j); glVertex3f(X0(i + 1), H[i + 1][j], X0(j));
        }
        glEnd();
    }
}
`;
  var WATER = `void water() {
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glDepthMask(GL_FALSE);
    glColor4f(0.2f, 0.45f, 0.8f, 0.55f);
    glNormal3f(0, 1, 0);
    glBegin(GL_QUADS);
    glVertex3f(-20, 0, 20); glVertex3f(20, 0, 20); glVertex3f(20, 0, -20); glVertex3f(-20, 0, -20);
    glEnd();
    glDepthMask(GL_TRUE);
    glDisable(GL_BLEND);
}
`;
  var SKY = `void sky() {
    glDisable(GL_LIGHTING);
    glDepthMask(GL_FALSE);
    for (int i = 0; i < 8; i++) {
        float a0 = PI / 2 * i / 8, a1 = PI / 2 * (i + 1) / 8;
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= 24; j++) {
            float b = 2 * PI * j / 24;
            glColor3f(0.75f - 0.55f * sin(a1), 0.85f - 0.45f * sin(a1), 1.0f - 0.25f * sin(a1));
            glVertex3f(90 * cos(a1) * cos(b), 90 * sin(a1) - 5, 90 * cos(a1) * sin(b));
            glColor3f(0.75f - 0.55f * sin(a0), 0.85f - 0.45f * sin(a0), 1.0f - 0.25f * sin(a0));
            glVertex3f(90 * cos(a0) * cos(b), 90 * sin(a0) - 5, 90 * cos(a0) * sin(b));
        }
        glEnd();
    }
    glDepthMask(GL_TRUE);
    glEnable(GL_LIGHTING);
}
`;
  var TREES = `// ${C("Daraxtlar: joyi tasodifiy, faqat 1,5 < h < 4 balandlikda (sohil va qoyalarda emas)", "Деревья: позиции случайны, только на высоте 1,5 < h < 4 (не на берегу и не на скалах)")}
float TX[20], TZ[20], TH[20];
void placeTrees() {
    srand(9);
    int n = 0;
    while (n < 20) {
        float x = (rand() % 3600) / 100.0f - 18, z = (rand() % 3600) / 100.0f - 18;
        float h = height(x, z);
        if (h > 1.5f && h < 4.0f) { TX[n] = x; TZ[n] = z; TH[n] = h; n++; }
    }
}
GLUquadric* quad;
void tree(int k, float sway) {
    glPushMatrix();
    glTranslatef(TX[k], TH[k], TZ[k]);
    glColor3f(0.45f, 0.3f, 0.18f);
    glPushMatrix(); glRotatef(-90, 1, 0, 0); gluCylinder(quad, 0.12, 0.1, 1.0, 8, 1); glPopMatrix();
    glTranslatef(0, 0.9f, 0);
    glRotatef(sway, 0, 0, 1);
    glColor3f(0.15f, 0.45f, 0.2f);
    glPushMatrix(); glRotatef(-90, 1, 0, 0); glutSolidCone(0.7, 1.8, 10, 2); glPopMatrix();
    glPopMatrix();
}
`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(50.0, (double)w / h, 0.3, 300.0);
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
    glClearColor(0.55f, 0.72f, 0.9f, 1.0f);
    initGL();
    buildHeights();
${extra || ""}    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutIdleFunc(idle);
    glutMainLoop();
    return 0;
}
`;
  }
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }
  var CAMV = `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 16, 30,  0, 0, 0,  0, 1, 0);
    setSun();
`;
  var BASE = HEAD + LIGHT + HF + GRIDH + FILLH + NORMAL;

  /* ---------- Misol: simlik tör ---------- */
  var ex = BASE + `void display() {
` + CAMV + `    glDisable(GL_LIGHTING);
    glColor3f(0.15f, 0.35f, 0.25f);
    // ${C("Balandlik xaritasi — simlik tör (har yönalişda çiziqlar)", "Карта высот — каркасная сетка (линии в обоих направлениях)")}
    for (int i = 0; i <= N; i++) {
        glBegin(GL_LINE_STRIP); for (int j = 0; j <= N; j++) glVertex3f(X0(i), H[i][j], X0(j)); glEnd();
        glBegin(GL_LINE_STRIP); for (int j = 0; j <= N; j++) glVertex3f(X0(j), H[j][i], X0(i)); glEnd();
    }
    glEnable(GL_LIGHTING);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: heightmap");

  /* ---------- 1. Heightmap — sirt ---------- */
  var t1 = S(HEAD + LIGHT + HF + GRIDH + `void buildHeights() {
`, `    // ${C("TODO: H[i][j] = height(X0(i), X0(j)) barça 0 ≤ i, j ≤ N uçun", "TODO: H[i][j] = height(X0(i), X0(j)) для всех 0 ≤ i, j ≤ N")}
`, `    for (int i = 0; i <= N; i++)
        for (int j = 0; j <= N; j++)
            H[i][j] = height(X0(i), X0(j));
`, `}
` + NORMAL + `void display() {
` + CAMV + `    glColor3f(0.45f, 0.6f, 0.35f);
    // ${C("Sirt: har bir qator — GL_QUAD_STRIP, normallar uçlarda", "Поверхность: каждая полоса — GL_QUAD_STRIP, нормали в вершинах")}
    for (int i = 0; i < N; i++) {
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= N; j++) {
            normalAt(i, j);     glVertex3f(X0(i), H[i][j], X0(j));
            normalAt(i + 1, j); glVertex3f(X0(i + 1), H[i + 1][j], X0(j));
        }
        glEnd();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: sirt"));

  /* ---------- 2. Rangli landşaft ---------- */
  var t2 = S(BASE + `// ${C("Rang balandlik böyiça", "Цвет по высоте")}
void colorByHeight(float h) {
`, `    // ${C("TODO: h < 0,4 — qum (0,85; 0,78; 0,55); h < 3 — ot (0,3 + 0,05h; 0,6 − 0,04h; 0,25);", "TODO: h < 0,4 — песок (0,85; 0,78; 0,55); h < 3 — трава (0,3 + 0,05h; 0,6 − 0,04h; 0,25);")}
    // ${C("h < 4,6 — tosh (0,5; 0,42; 0,35); aks holda — qor (0,95; 0,96; 1)", "h < 4,6 — камень (0,5; 0,42; 0,35); иначе — снег (0,95; 0,96; 1)")}
    glColor3f(0.45f, 0.6f, 0.35f);
`, `    if (h < 0.4f)      glColor3f(0.85f, 0.78f, 0.55f);                       // ${C("qum", "песок")}
    else if (h < 3.0f) glColor3f(0.3f + 0.05f * h, 0.6f - 0.04f * h, 0.25f); // ${C("ot", "трава")}
    else if (h < 4.6f) glColor3f(0.5f, 0.42f, 0.35f);                        // ${C("tosh", "камень")}
    else               glColor3f(0.95f, 0.96f, 1.0f);                        // ${C("qor", "снег")}
`, `}
` + DRAWT + `void display() {
` + CAMV + `    terrain();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: rangli"));

  /* ---------- 3. Suv ---------- */
  var t3 = S(BASE + COLOR + DRAWT + `void water() {
`, `    // ${C("TODO: aralaştiriş (GL_BLEND, GL_SRC_ALPHA / GL_ONE_MINUS_SRC_ALPHA), çuqurlikka yozmaslik (glDepthMask(GL_FALSE));", "TODO: смешивание (GL_BLEND, GL_SRC_ALPHA / GL_ONE_MINUS_SRC_ALPHA), без записи глубины (glDepthMask(GL_FALSE));")}
    // ${C("rang (0,2; 0,45; 0,8; 0,55); y = 0 da 40×40 törtburçak; keyin holatni qayta tiklang", "цвет (0,2; 0,45; 0,8; 0,55); прямоугольник 40×40 на y = 0; затем восстановите состояние")}
`, WATER.split("\n").slice(1, -2).join("\n") + "\n", `}

void display() {
` + CAMV + `    terrain();
    water();                    // ${C("şaffof — oxirida", "прозрачное — последним")}
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: suv"));

  /* ---------- 4. Osmon ---------- */
  var t4 = S(BASE + COLOR + DRAWT + WATER + `// ${C("Osmon gumbazi: radiusi 90 bölgan yarim sfera, ufqda oçiq, zenitda tim kök", "Небесный купол: полусфера радиуса 90, у горизонта светлая, в зените тёмно-синяя")}
void sky() {
    glDisable(GL_LIGHTING);
    glDepthMask(GL_FALSE);         // ${C("osmon hamma narsadan orqada", "небо позади всего")}
    for (int i = 0; i < 8; i++) {
        float a0 = PI / 2 * i / 8, a1 = PI / 2 * (i + 1) / 8;
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= 24; j++) {
            float b = 2 * PI * j / 24;
`, `            // ${C("TODO: ikki uç — kenglik a1 va a0 da: (90·cos a·cos b, 90·sin a − 5, 90·cos a·sin b);", "TODO: две вершины — на широте a1 и a0: (90·cos a·cos b, 90·sin a − 5, 90·cos a·sin b);")}
            // ${C("rang (0,75 − 0,55·sin a; 0,85 − 0,45·sin a; 1 − 0,25·sin a)", "цвет (0,75 − 0,55·sin a; 0,85 − 0,45·sin a; 1 − 0,25·sin a)")}
`, `            glColor3f(0.75f - 0.55f * sin(a1), 0.85f - 0.45f * sin(a1), 1.0f - 0.25f * sin(a1));
            glVertex3f(90 * cos(a1) * cos(b), 90 * sin(a1) - 5, 90 * cos(a1) * sin(b));
            glColor3f(0.75f - 0.55f * sin(a0), 0.85f - 0.45f * sin(a0), 1.0f - 0.25f * sin(a0));
            glVertex3f(90 * cos(a0) * cos(b), 90 * sin(a0) - 5, 90 * cos(a0) * sin(b));
`, `        }
        glEnd();
    }
    glDepthMask(GL_TRUE);
    glEnable(GL_LIGHTING);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 9, 30,  0, 4, 0,  0, 1, 0);
    setSun();
    sky();                      // ${C("birinçi", "первым")}
    terrain();
    water();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: osmon"));

  /* ---------- 5. Daraxtlar ---------- */
  var t5 = S(BASE + COLOR + DRAWT + WATER + SKY + `float TX[20], TZ[20], TH[20];
void placeTrees() {
    srand(9);
    int n = 0;
`, `    // ${C("TODO: n < 20 ekan: x, z = (rand() % 3600)/100 − 18; h = height(x, z); agar 1,5 < h < 4 bölsa — daraxtni saqlang (TX, TZ, TH), n++", "TODO: пока n < 20: x, z = (rand() % 3600)/100 − 18; h = height(x, z); если 1,5 < h < 4 — сохраните дерево (TX, TZ, TH), n++")}
`, `    while (n < 20) {
        float x = (rand() % 3600) / 100.0f - 18, z = (rand() % 3600) / 100.0f - 18;
        float h = height(x, z);
        if (h > 1.5f && h < 4.0f) { TX[n] = x; TZ[n] = z; TH[n] = h; n++; }   // ${C("mos joy — qabul", "подходящее место — принято")}
    }
`, `}
GLUquadric* quad;
void tree(int k, float sway) {
    glPushMatrix();
    glTranslatef(TX[k], TH[k], TZ[k]);
    glColor3f(0.45f, 0.3f, 0.18f);
    glPushMatrix(); glRotatef(-90, 1, 0, 0); gluCylinder(quad, 0.12, 0.1, 1.0, 8, 1); glPopMatrix();
    glTranslatef(0, 0.9f, 0);
    glRotatef(sway, 0, 0, 1);
    glColor3f(0.15f, 0.45f, 0.2f);
    glPushMatrix(); glRotatef(-90, 1, 0, 0); glutSolidCone(0.7, 1.8, 10, 2); glPopMatrix();
    glPopMatrix();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 9, 30,  0, 4, 0,  0, 1, 0);
    setSun();
    sky();
    terrain();
    for (int k = 0; k < 20; k++) tree(k, 0);
    water();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: daraxtlar", "    quad = gluNewQuadric();\n    placeTrees();\n"));

  /* ---------- 6. Şamol ---------- */
  var t6 = S(BASE + COLOR + DRAWT + WATER + SKY + TREES + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 9, 30,  0, 4, 0,  0, 1, 0);
    setSun();
    sky();
    terrain();
    float t = now();
    for (int k = 0; k < 20; k++) {
`, `        // ${C("TODO: har bir daraxt öz fazasi bilan tebranadi: sway = 8·sin(2t + 0,7k) gradus", "TODO: каждое дерево качается со своей фазой: sway = 8·sin(2t + 0,7k) градусов")}
        tree(k, 0);
`, `        float sway = 8 * sin(2 * t + 0.7f * k);    // ${C("faza k ga böğliq — daraxtlar bir vaqtda egilmaydi", "фаза зависит от k — деревья наклоняются не одновременно")}
        tree(k, sway);
`, `    }
    water();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: shamol", "    quad = gluNewQuadric();\n    placeTrees();\n"));

  /* ---------- 7. Tölqinlar ---------- */
  var t7 = S(BASE + COLOR + DRAWT + SKY + TREES + `// ${C("Tölqinli suv: 40×40 tör, sathi sinusoidalar bilan tebranadi", "Волнующаяся вода: сетка 40×40, уровень колеблется по синусоидам")}
float wave(float x, float z, float t) {
`, `    // ${C("TODO: return 0,15·sin(0,8x + 2t) + 0,1·cos(0,6z + 1,5t);", "TODO: return 0,15·sin(0,8x + 2t) + 0,1·cos(0,6z + 1,5t);")}
    return 0;
`, `    return 0.15f * sin(0.8f * x + 2 * t) + 0.1f * cos(0.6f * z + 1.5f * t);
`, `}
void water(float t) {
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glDepthMask(GL_FALSE);
    glColor4f(0.2f, 0.45f, 0.8f, 0.6f);
    GLfloat spe[] = { 0.9f, 0.9f, 0.9f, 1 };
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT_AND_BACK, GL_SHININESS, 40);
    for (int i = 0; i < 40; i++) {
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= 40; j++) {
            float x0 = -20 + i, x1 = x0 + 1, z = -20 + j;
            // ${C("normal — sath hosilalaridan (ayirmalar bilan): n = (−∂y/∂x, 1, −∂y/∂z)", "нормаль — по производным уровня (разностями): n = (−∂y/∂x, 1, −∂y/∂z)")}
            float e = 0.05f;
            glNormal3f(-(wave(x0 + e, z, t) - wave(x0 - e, z, t)) / (2 * e), 1, -(wave(x0, z + e, t) - wave(x0, z - e, t)) / (2 * e));
            glVertex3f(x0, wave(x0, z, t), z);
            glNormal3f(-(wave(x1 + e, z, t) - wave(x1 - e, z, t)) / (2 * e), 1, -(wave(x1, z + e, t) - wave(x1, z - e, t)) / (2 * e));
            glVertex3f(x1, wave(x1, z, t), z);
        }
        glEnd();
    }
    GLfloat nos[] = { 0, 0, 0, 1 };
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, nos);
    glDepthMask(GL_TRUE);
    glDisable(GL_BLEND);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(-6, 4, 18,  0, 0.5, 0,  0, 1, 0);
    setSun();
    float t = now();
    sky();
    terrain();
    for (int k = 0; k < 20; k++) tree(k, 8 * sin(2 * t + 0.7f * k));
    water(t);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A14: to'lqinlar", "    quad = gluNewQuadric();\n    placeTrees();\n"));

  /* ---------- 8. Parvoz ---------- */
  var t8 = S(BASE + COLOR + DRAWT + WATER + SKY + TREES + `// ${C("Parvoz kamerasi: joy (px, py, pz), yaw — gorizontal buriliş, pitch — pastga/yuqoriga qaraş", "Камера полёта: позиция (px, py, pz), yaw — поворот по горизонтали, pitch — наклон взгляда")}
float px = 0, py = 10, pz = 28, yaw = 0, pitch = -0.3f;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    float dx = sin(yaw) * cos(pitch), dy = sin(pitch), dz = -cos(yaw) * cos(pitch);
    gluLookAt(px, py, pz,  px + dx, py + dy, pz + dz,  0, 1, 0);
    setSun();
    float t = now();
    sky();
    terrain();
    for (int k = 0; k < 20; k++) tree(k, 8 * sin(2 * t + 0.7f * k));
    water();
    glutSwapBuffers();
}

`, `// ${C("TODO: keyboard(): W/S — qaraş yönalişida (dx, dy, dz) 0,8 ga oldinga/orqaga; Q/E — yuqoriga/pastga 0,5;", "TODO: keyboard(): W/S — вперёд/назад на 0,8 по направлению взгляда (dx, dy, dz); Q/E — вверх/вниз на 0,5;")}
// ${C("special(): ←/→ — yaw ∓0,06; ↑/↓ — pitch ±0,05 (−1,2..1,2 oraliğida)", "special(): ←/→ — yaw ∓0,06; ↑/↓ — pitch ±0,05 (в пределах −1,2..1,2)")}
void keyboard(unsigned char key, int x, int y) { }
void special(int key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    float dx = sin(yaw) * cos(pitch), dy = sin(pitch), dz = -cos(yaw) * cos(pitch);
    if (key == 'w') { px += 0.8f * dx; py += 0.8f * dy; pz += 0.8f * dz; }
    if (key == 's') { px -= 0.8f * dx; py -= 0.8f * dy; pz -= 0.8f * dz; }
    if (key == 'q') py += 0.5f;
    if (key == 'e') py -= 0.5f;
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  yaw -= 0.06f;
    if (key == GLUT_KEY_RIGHT) yaw += 0.06f;
    if (key == GLUT_KEY_UP   && pitch < 1.2f)  pitch += 0.05f;
    if (key == GLUT_KEY_DOWN && pitch > -1.2f) pitch -= 0.05f;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A14: parvoz", "    quad = gluNewQuadric();\n    placeTrees();\n    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  LAB.define({
    n: 14,
    title: { uz: "Landşaft dizaynini yaratiş. Turli obyektlar harakatini yaratiş", ru: "Создание ландшафта и движения объектов" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: balandlik xaritasi — simlik tör", ru: "Пример: карта высот — каркасная сетка" },
        text: { uz: "<p>Landşaft — <b>balandlik xaritasi</b> (heightmap): N×N tör tugunlarida balandlik H[i][j] saqlanadi. Bu yerda balandlik sinusoidalar yiğindisi bilan hisoblanadi (real loyihalarda — Perlin şovqini yoki rasm fayli). Tör ikki yönalişdagi <code>GL_LINE_STRIP</code> çiziqlari bilan çizilgan.</p>",
                ru: "<p>Ландшафт — <b>карта высот</b> (heightmap): в узлах сетки N×N хранятся высоты H[i][j]. Здесь высота вычисляется суммой синусоид (в реальных проектах — шумом Перлина или из файла-изображения). Сетка нарисована линиями <code>GL_LINE_STRIP</code> в двух направлениях.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Heightmap — sirt", ru: "Задание 1. Heightmap — поверхность" },
        text: { uz: "<p>Balandliklar massivini formula böyiça töldiring: H[i][j] = height(x<sub>i</sub>, z<sub>j</sub>). Sirt <code>GL_QUAD_STRIP</code> qatorlari bilan çiziladi; har bir uçdagi normal qöşni balandliklar farqidan (markaziy ayirmalar) hisoblanadi: n = (−∂h/∂x, 1, −∂h/∂z).</p>",
                ru: "<p>Заполните массив высот по формуле: H[i][j] = height(x<sub>i</sub>, z<sub>j</sub>). Поверхность рисуется полосами <code>GL_QUAD_STRIP</code>; нормаль в каждой вершине считается по разности соседних высот (центральные разности): n = (−∂h/∂x, 1, −∂h/∂z).</p>" },
        hint: { uz: "for i ≤ N: for j ≤ N: H[i][j] = height(X0(i), X0(j));", ru: "for i ≤ N: for j ≤ N: H[i][j] = height(X0(i), X0(j));" },
        check: { type: "image" }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Rangli landşaft", ru: "Задание 2. Цветной ландшафт" },
        text: { uz: "<p>Rangni balandlikka qarab bering: qirğoq bölmalari — qum, past joylar — ot (balandlaşgan sari to'qroq), yuqori — tosh, töpalar — qor. Rang har bir uçda beriladi, OpenGL uni yoqlar böylab silliq aralaştiradi.</p>",
                ru: "<p>Задайте цвет по высоте: прибрежные участки — песок, низины — трава (с высотой темнее), выше — камень, вершины — снег. Цвет задаётся в каждой вершине, OpenGL плавно смешивает его по граням.</p>" },
        hint: { uz: "if (h < 0.4) qum; else if (h < 3) ot; else if (h < 4.6) tosh; else qor;", ru: "if (h < 0.4) песок; else if (h < 3) трава; else if (h < 4.6) камень; else снег;" },
        check: { type: "image" }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Suv", ru: "Задание 3. Вода" },
        text: { uz: "<p>y = 0 sathida yarim şaffof suv qöşing (α = 0,55). Suv landşaftdan <b>keyin</b> çiziladi va çuqurlik buferiga yozilmaydi; suv tagidagi qum va ot unga «botib» körinadi. Şaffof obyektlar doimo oxirida çiziladi.</p>",
                ru: "<p>Добавьте полупрозрачную воду на уровне y = 0 (α = 0,55). Вода рисуется <b>после</b> ландшафта и не пишется в буфер глубины; песок и трава под водой видны сквозь неё. Прозрачные объекты всегда рисуются последними.</p>" },
        hint: { uz: "glEnable(GL_BLEND); glBlendFunc(...); glDepthMask(GL_FALSE); glColor4f(0.2, 0.45, 0.8, 0.55); GL_QUADS …; glDepthMask(GL_TRUE); glDisable(GL_BLEND);", ru: "glEnable(GL_BLEND); glBlendFunc(...); glDepthMask(GL_FALSE); glColor4f(0.2, 0.45, 0.8, 0.55); GL_QUADS …; glDepthMask(GL_TRUE); glDisable(GL_BLEND);" },
        check: { type: "both", calls: { "glBlendFunc": ">=1" } }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Osmon gumbazi", ru: "Задание 4. Небесный купол" },
        text: { uz: "<p>Sahnani katta yarim sfera — <b>osmon gumbazi</b> (skydome) bilan öring: ufqda oçiq havorang, zenitda tim kök. Gumbaz yoritişsiz va çuqurlik buferiga yozilmasdan birinçi çiziladi — şunda u har doim boşqa obyektlar ortida qoladi.</p>",
                ru: "<p>Окружите сцену большой полусферой — <b>небесным куполом</b> (skydome): у горизонта светло-голубой, в зените тёмно-синий. Купол рисуется первым, без освещения и без записи в буфер глубины — так он всегда остаётся позади остальных объектов.</p>" },
        hint: { uz: "glColor3f(0,75 − 0,55·sin a1; …); glVertex3f(90·cos a1·cos b, 90·sin a1 − 5, 90·cos a1·sin b); keyin a0 uçun xuddi şunday.", ru: "glColor3f(0,75 − 0,55·sin a1; …); glVertex3f(90·cos a1·cos b, 90·sin a1 − 5, 90·cos a1·sin b); затем то же для a0." },
        check: { type: "image" }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Daraxtlar", ru: "Задание 5. Деревья" },
        text: { uz: "<p>Landşaftga 20 ta daraxt joylaştiring. Joy tasodifiy tanlanadi, lekin faqat mos balandlikda (1,5 < h < 4) — suvda va qoyalarda daraxt ösmaydi. Mos kelmagan nuqta taşlanadi va yangisi tanlanadi (<b>rad etiş usuli</b>). Daraxt — tana (<code>gluCylinder</code>) va konus şaklidagi şox.</p>",
                ru: "<p>Расставьте на ландшафте 20 деревьев. Место выбирается случайно, но только на подходящей высоте (1,5 < h < 4) — в воде и на скалах деревья не растут. Неподходящая точка отбрасывается и выбирается новая (<b>метод отбора</b>). Дерево — ствол (<code>gluCylinder</code>) и крона-конус.</p>" },
        hint: { uz: "while (n < 20) { x, z = …; h = height(x, z); if (h > 1.5 && h < 4) { TX[n] = x; TZ[n] = z; TH[n] = h; n++; } }", ru: "while (n < 20) { x, z = …; h = height(x, z); if (h > 1.5 && h < 4) { TX[n] = x; TZ[n] = z; TH[n] = h; n++; } }" },
        check: { type: "both", calls: { "glutSolidCone": ">=20" } }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Şamol taʼsiri", ru: "Задание 6. Действие ветра" },
        text: { uz: "<p>Daraxt şoxlari şamolda tebransin: burçak sway = 8·sin(2t + 0,7k) gradus, bu yerda k — daraxt raqami. Turli faza tufayli daraxtlar bir vaqtda egilmaydi — tabiiyroq körinadi. Tebraniş tananing tepasi atrofida <code>glRotatef</code> bilan amalga oşiriladi.</p>",
                ru: "<p>Пусть кроны качаются на ветру: угол sway = 8·sin(2t + 0,7k) градусов, где k — номер дерева. Из-за разной фазы деревья наклоняются не одновременно — это выглядит естественнее. Наклон выполняется <code>glRotatef</code> вокруг верхушки ствола.</p>" },
        hint: { uz: "float sway = 8 * sin(2 * t + 0.7f * k); tree(k, sway);", ru: "float sway = 8 * sin(2 * t + 0.7f * k); tree(k, sway);" },
        check: { type: "image", maxDiff: 0.002 }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Suv tölqinlari", ru: "Задание 7. Волны на воде" },
        text: { uz: "<p>Suv sathini tebrating: suv endi tekis törtburçak emas, 40×40 tör, har bir tugun balandligi y = 0,15·sin(0,8x + 2t) + 0,1·cos(0,6z + 1,5t). Normallar ham vaqt bilan özgaradi — yaltiroqlik suv böylab «yuguradi».</p>",
                ru: "<p>Заставьте воду волноваться: теперь вода — не плоский прямоугольник, а сетка 40×40, высота каждого узла y = 0,15·sin(0,8x + 2t) + 0,1·cos(0,6z + 1,5t). Нормали тоже меняются со временем — блики «бегут» по воде.</p>" },
        hint: { uz: "return 0.15f * sin(0.8f * x + 2 * t) + 0.1f * cos(0.6f * z + 1.5f * t);", ru: "return 0.15f * sin(0.8f * x + 2 * t) + 0.1f * cos(0.6f * z + 1.5f * t);" },
        check: { type: "image", maxDiff: 0.002, tol: 16, source: [{ re: "float\\s+wave[^{]*\\{[^}]*sin\\s*\\(", msg: { uz: "wave() funksiyasi sinusoidalar yiğindisini qaytarsin", ru: "Функция wave() должна возвращать сумму синусоид" } }] }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Kamera parvozi", ru: "Задание 8. Полёт камеры" },
        text: { uz: "<p>Landşaft ustidan uçib öting: <b>W/S</b> — qaraş yönalişida oldinga/orqaga (balandlik ham özgaradi), <b>Q/E</b> — yuqoriga/pastga, <b>←/→</b> — buriliş, <b>↑/↓</b> — qaraşni kötariş/tuşiriş. Qaraş vektori: (sin yaw·cos pitch, sin pitch, −cos yaw·cos pitch).</p>",
                ru: "<p>Пролетите над ландшафтом: <b>W/S</b> — вперёд/назад по направлению взгляда (высота тоже меняется), <b>Q/E</b> — вверх/вниз, <b>←/→</b> — поворот, <b>↑/↓</b> — поднять/опустить взгляд. Вектор взгляда: (sin yaw·cos pitch, sin pitch, −cos yaw·cos pitch).</p>" },
        hint: { uz: "if (key == 'w') { px += 0.8·dx; py += 0.8·dy; pz += 0.8·dz; } … if (key == GLUT_KEY_UP && pitch < 1.2) pitch += 0.05;", ru: "if (key == 'w') { px += 0.8·dx; py += 0.8·dy; pz += 0.8·dz; } … if (key == GLUT_KEY_UP && pitch < 1.2) pitch += 0.05;" },
        check: { type: "both", source: [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "'w'", msg: { uz: "W tugmasini qayta işlang", ru: "Обработайте клавишу W" } }, { re: "pitch\\s*[-+]=", msg: { uz: "↑/↓ pitch ni özgartirsin", ru: "↑/↓ должны менять pitch" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
