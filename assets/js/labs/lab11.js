/* A11. Fazoda harakatlarni vizuallaştiriş: animatsiya, trayektoriya, kamera, fizika, zarraçalar (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n#include <cstdlib>\n\n#define PI 3.14159265f\n\n";
  var LIGHT = `void initGL() {
    GLfloat dir[] = { 0.4f, 0.9f, 0.6f, 0 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, dir);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE);
    glEnable(GL_NORMALIZE);
    glEnable(GL_DEPTH_TEST);
}
// ${C("Dastur boşlanğandan beri öçgan vaqt, sekundlarda", "Время с начала работы программы, в секундах")}
float now() { return glutGet(GLUT_ELAPSED_TIME) / 1000.0f; }

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.3, 200.0);
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
  var GRID = `// ${C("Pol: katakli tör (yoritişsiz)", "Пол: клетчатая сетка (без освещения)")}
void grid(float y, int n) {
    glDisable(GL_LIGHTING);
    glColor3f(0.25f, 0.32f, 0.48f);
    glBegin(GL_LINES);
    for (int i = -n; i <= n; i++) {
        glVertex3f(i, y, -n); glVertex3f(i, y, n);
        glVertex3f(-n, y, i); glVertex3f(n, y, i);
    }
    glEnd();
    glEnable(GL_LIGHTING);
}

`;

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2, 5,  0, 0, 0,  0, 1, 0);
    float angle = 45 * now();                  // ${C("burçak vaqtga böğliq: sekundiga 45°", "угол зависит от времени: 45° в секунду")}
    glRotatef(angle, 0, 1, 0);
    glColor3f(0.35f, 0.6f, 1.0f);
    glutSolidCube(1.5);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: aylanuvchi kub");

  /* ---------- 1. Aylanuvçi kub + FPS ---------- */
  var t1 = S(HEAD + LIGHT + `int frames = 0, t0 = 0;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2, 5,  0, 0, 0,  0, 1, 0);
`, `    // ${C("TODO 1: kubni Oy atrofida sekundiga 60° tezlikda aylantiring (now() dan foydalaning)", "TODO 1: вращайте куб вокруг Oy со скоростью 60° в секунду (используйте now())")}
    // ${C("TODO 2: kadrlarni sanab, har 500 ms da FPS ni oyna sarlavhasiga yozing:", "TODO 2: считайте кадры и каждые 500 мс пишите FPS в заголовок окна:")}
    // ${C("char buf[64]; sprintf(buf, \"FPS: %.1f\", fps); glutSetWindowTitle(buf);", "char buf[64]; sprintf(buf, \"FPS: %.1f\", fps); glutSetWindowTitle(buf);")}
`, `    glRotatef(60 * now(), 0, 1, 0);
    frames++;
    int t = glutGet(GLUT_ELAPSED_TIME);
    if (t - t0 >= 500) {
        char buf[64];
        sprintf(buf, "FPS: %.1f", frames * 1000.0f / (t - t0));
        glutSetWindowTitle(buf);                 // ${C("oyna sarlavhasi — oyna ustidagi qator", "заголовок окна — строка над окном")}
        frames = 0; t0 = t;
    }
`, `    glColor3f(0.35f, 0.6f, 1.0f);
    glutSolidCube(1.5);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: FPS"));

  /* ---------- 2. Trayektoriya ---------- */
  var t2 = S(HEAD + LIGHT + GRID + `// ${C("Fazoviy kub Beze egri çiziği — trayektoriya", "Пространственная кубическая кривая Безье — траектория")}
float P[4][3] = { {-4, 0, 2}, {-2, 4, -4}, {2, -1, -4}, {4, 2, 2} };

void bez(float t, float r[3]) {
`, `    // ${C("TODO: B(t) = (1−t)³P₀ + 3t(1−t)²P₁ + 3t²(1−t)P₂ + t³P₃ (har bir koordinata uçun)", "TODO: B(t) = (1−t)³P₀ + 3t(1−t)²P₁ + 3t²(1−t)P₂ + t³P₃ (для каждой координаты)")}
    r[0] = P[0][0]; r[1] = P[0][1]; r[2] = P[0][2];
`, `    float m = 1 - t;
    float b0 = m * m * m, b1 = 3 * t * m * m, b2 = 3 * t * t * m, b3 = t * t * t;
    for (int k = 0; k < 3; k++)
        r[k] = b0 * P[0][k] + b1 * P[1][k] + b2 * P[2][k] + b3 * P[3][k];
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 5, 10,  0, 0.5, -1,  0, 1, 0);
    grid(-1.5f, 6);
    float r[3];
    // ${C("Trayektoriya çiziği", "Линия траектории")}
    glDisable(GL_LIGHTING);
    glColor3f(1.0f, 0.85f, 0.3f);
    glLineWidth(2.0f);
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i <= 60; i++) { bez(i / 60.0f, r); glVertex3fv(r); }
    glEnd();
    glEnable(GL_LIGHTING);
    // ${C("Sfera: 4 sekundda bir marta yöl bosadi", "Сфера проходит путь за 4 секунды")}
    float t = fmod(now() / 4.0f, 1.0f);
    bez(t, r);
    glPushMatrix();
    glTranslatef(r[0], r[1], r[2]);
    glColor3f(1.0f, 0.4f, 0.35f);
    glutSolidSphere(0.45, 24, 18);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: trayektoriya"));

  /* ---------- 3. Öyin kamerasi ---------- */
  var t3 = S(HEAD + LIGHT + GRID + `// ${C("Kamera: joyi (cx, cz), burilişi yaw (radian), köz balandligi 1,6", "Камера: позиция (cx, cz), поворот yaw (радианы), высота глаз 1,6")}
float cx = 1, cz = 12, yaw = -0.25f;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(cx, 1.6, cz,  cx + sin(yaw), 1.6, cz - cos(yaw),  0, 1, 0);
    grid(0, 10);
    for (int i = -2; i <= 2; i++)
        for (int j = -2; j <= 2; j++) {
            glPushMatrix();
            glTranslatef(i * 3.0f, 0.6f, j * 3.0f);
            glColor3f(0.5f + 0.1f * i, 0.55f, 0.6f + 0.08f * j);
            glutSolidCube(1.2);
            glPopMatrix();
        }
    glutSwapBuffers();
}

`, `// ${C("TODO: keyboard(): W/S — qaraş yönalişida oldinga/orqaga 0,3 ga (dx = sin(yaw), dz = −cos(yaw)),", "TODO: keyboard(): W/S — вперёд/назад на 0,3 по направлению взгляда (dx = sin(yaw), dz = −cos(yaw)),")}
// ${C("A/D — yon tomonga (perpendikulyar: dx = cos(yaw), dz = sin(yaw)); special(): ←/→ yaw ni ∓0,1 ga", "A/D — вбок (перпендикулярно: dx = cos(yaw), dz = sin(yaw)); special(): ←/→ меняют yaw на ∓0,1")}
void keyboard(unsigned char key, int x, int y) { }
void special(int key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    float fx = sin(yaw), fz = -cos(yaw);       // ${C("oldinga", "вперёд")}
    float rx = cos(yaw), rz = sin(yaw);        // ${C("öngga", "вправо")}
    if (key == 'w') { cx += 0.3f * fx; cz += 0.3f * fz; }
    if (key == 's') { cx -= 0.3f * fx; cz -= 0.3f * fz; }
    if (key == 'd') { cx += 0.3f * rx; cz += 0.3f * rz; }
    if (key == 'a') { cx -= 0.3f * rx; cz -= 0.3f * rz; }
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  yaw -= 0.1f;
    if (key == GLUT_KEY_RIGHT) yaw += 0.1f;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A11: kamera", "    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  /* ---------- 4. Quyoş tizimi ---------- */
  var t4 = S(HEAD + LIGHT + `float R[3] = { 2.2f, 3.6f, 5.2f };          // ${C("orbita radiuslari", "радиусы орбит")}
float W[3] = { 60, 35, 20 };                 // ${C("burçak tezliklari, °/s", "угловые скорости, °/с")}
float SZ[3] = { 0.4f, 0.55f, 0.48f };
float PH[3] = { 0, 130, 250 };              // ${C("boşlanğiç burçaklar, °", "начальные углы, °")}
float COL[3][3] = { {0.85f, 0.55f, 0.3f}, {0.3f, 0.6f, 1.0f}, {0.9f, 0.35f, 0.3f} };

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 7, 9,  0, 0, 0,  0, 1, 0);
    float t = now();
    // ${C("Quyoş — yoritişsiz sariq şar", "Солнце — неосвещённый жёлтый шар")}
    glDisable(GL_LIGHTING);
    glColor3f(1.0f, 0.85f, 0.25f);
    glutSolidSphere(0.9, 32, 24);
    glEnable(GL_LIGHTING);
    for (int i = 0; i < 3; i++) {
`, `        // ${C("TODO: glPushMatrix; Oy atrofida PH[i] + W[i]·t ga buriş; R[i] ga siljiş; sayyora (COL[i], SZ[i]);", "TODO: glPushMatrix; поворот вокруг Oy на PH[i] + W[i]·t; сдвиг на R[i]; планета (COL[i], SZ[i]);")}
        // ${C("uning içida: yana Push; Oy atrofida 180·t; 0,8 ga siljiş; kulrang yöldoş (0,12); Pop; tashqi Pop", "внутри: ещё Push; поворот вокруг Oy на 180·t; сдвиг на 0,8; серый спутник (0,12); Pop; внешний Pop")}
`, `        glPushMatrix();
        glRotatef(PH[i] + W[i] * t, 0, 1, 0);    // ${C("sayyora orbita böylab", "планета по орбите")}
        glTranslatef(R[i], 0, 0);
        glColor3f(COL[i][0], COL[i][1], COL[i][2]);
        glutSolidSphere(SZ[i], 24, 18);
        glPushMatrix();                          // ${C("yöldoş — sayyora koordinatalar tizimida", "спутник — в системе координат планеты")}
        glRotatef(180 * t, 0, 1, 0);
        glTranslatef(SZ[i] + 0.4f, 0, 0);
        glColor3f(0.8f, 0.8f, 0.85f);
        glutSolidSphere(0.12, 12, 10);
        glPopMatrix();
        glPopMatrix();
`, `    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: quyosh tizimi"));

  /* ---------- 5. Sakraydigan şar ---------- */
  var t5 = S(HEAD + LIGHT + GRID + `// ${C("Fizika: tezlik va joy 5 ms li qadamlar bilan hisoblanadi (natija kadr tezligiga böğliq emas)", "Физика: скорость и позиция считаются шагами по 5 мс (результат не зависит от частоты кадров)")}
float y = 4, vy = 0, simT = 0;
const float G = -9.8f, RAD = 0.7f, DT = 0.005f;

void simulate(float t) {
    while (simT < t) {
        vy += G * DT;
        y += vy * DT;
`, `        // ${C("TODO: yer bilan toqnaşuv: agar y < RAD bölsa — y = RAD, vy = −vy·0,8 (energiya yöqotiş)", "TODO: столкновение с землёй: если y < RAD — y = RAD, vy = −vy·0,8 (потеря энергии)")}
`, `        if (y < RAD) {                // ${C("şar polga tegdi", "шар коснулся пола")}
            y = RAD;
            vy = -vy * 0.8f;          // ${C("qaytiş koeffitsiyenti 0,8", "коэффициент восстановления 0,8")}
        }
`, `        simT += DT;
    }
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2.5, 7,  0, 1.8, 0,  0, 1, 0);
    simulate(now());
    grid(0, 6);
    glPushMatrix();
    glTranslatef(0, y, 0);
    glColor3f(1.0f, 0.45f, 0.3f);
    glutSolidSphere(RAD, 32, 24);
    glPopMatrix();
    // ${C("Soya — polda qora ellips", "Тень — тёмный эллипс на полу")}
    glDisable(GL_LIGHTING);
    glColor3f(0.04f, 0.05f, 0.1f);
    glPushMatrix(); glTranslatef(0, 0.01f, 0); glScalef(1, 0.01f, 1); glutSolidSphere(RAD, 24, 8); glPopMatrix();
    glEnable(GL_LIGHTING);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: sakrash"));

  /* ---------- 6. Kalit kadrlar ---------- */
  var t6 = S(HEAD + LIGHT + GRID + `// ${C("5 ta kalit kadr: markaz → öng → past → çap → yuqori → (qaytiş) markaz; har oraliq 1 s", "5 ключевых кадров: центр → право → низ → лево → верх → (возврат) центр; каждый интервал 1 с")}
float K[6][3] = { {0, 1, 0}, {3, 1, 0}, {0, 1, 3}, {-3, 1, 0}, {0, 1, -3}, {0, 1, 0} };

void interp(float t, float p[3]) {
    t = fmod(t, 5.0f);
    int i = (int)t;          // ${C("joriy oraliq", "текущий интервал")}
    float u = t - i;         // ${C("oraliq içidagi ulush, 0..1", "доля внутри интервала, 0..1")}
`, `    // ${C("TODO: çiziqli interpolyatsiya: p = K[i] + u·(K[i+1] − K[i])", "TODO: линейная интерполяция: p = K[i] + u·(K[i+1] − K[i])")}
    p[0] = K[i][0]; p[1] = K[i][1]; p[2] = K[i][2];
`, `    for (int k = 0; k < 3; k++)
        p[k] = K[i][k] + u * (K[i + 1][k] - K[i][k]);
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 6, 8,  0, 0.5, 0,  0, 1, 0);
    grid(0, 5);
    // ${C("Kalit kadrlar — sariq nuqtalar", "Ключевые кадры — жёлтые точки")}
    glDisable(GL_LIGHTING);
    glPointSize(9.0f);
    glColor3f(1.0f, 0.85f, 0.3f);
    glBegin(GL_POINTS); for (int i = 0; i < 5; i++) glVertex3fv(K[i]); glEnd();
    glEnable(GL_LIGHTING);
    float p[3];
    interp(now(), p);
    glPushMatrix();
    glTranslatef(p[0], p[1], p[2]);
    glColor3f(0.35f, 0.6f, 1.0f);
    glutSolidCube(0.8);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: kalit kadrlar"));

  /* ---------- 7. Zarraçalar tizimi ---------- */
  var t7 = S(HEAD + LIGHT + `// ${C("100 ta uçqun: boşlanğiç tezlik va «yoş» siljişi; umri 1 s, keyin qayta tuğiladi", "100 искр: начальная скорость и сдвиг «возраста»; жизнь 1 с, затем рождается заново")}
#define NP 100
float vx[NP], vy[NP], vz[NP], ofs[NP];

void initParticles() {
    srand(5);
    for (int i = 0; i < NP; i++) {
        float a = (rand() % 628) / 100.0f, s = 1 + (rand() % 100) / 100.0f;
        vx[i] = s * cos(a); vz[i] = s * sin(a); vy[i] = 4 + (rand() % 300) / 100.0f;
        ofs[i] = (rand() % 1000) / 1000.0f;
    }
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2.5, 7,  0, 1.5, 0,  0, 1, 0);
    glDisable(GL_LIGHTING);
    glPointSize(5.0f);
    glBegin(GL_POINTS);
    float t = now();
    for (int i = 0; i < NP; i++) {
`, `        // ${C("TODO: yoş age = fmod(t + ofs[i], 1); joy: x = vx·age, y = vy·age − 4,9·age², z = vz·age;", "TODO: возраст age = fmod(t + ofs[i], 1); позиция: x = vx·age, y = vy·age − 4,9·age², z = vz·age;")}
        // ${C("rang yoş bilan söniş: (1; 0,9 − 0,7·age; 0,3 − 0,3·age); glVertex3f(x, y, z)", "цвет гаснет с возрастом: (1; 0,9 − 0,7·age; 0,3 − 0,3·age); glVertex3f(x, y, z)")}
`, `        float age = fmod(t + ofs[i], 1.0f);
        float x = vx[i] * age, y = vy[i] * age - 4.9f * age * age, z = vz[i] * age;
        glColor3f(1.0f, 0.9f - 0.7f * age, 0.3f - 0.3f * age);
        glVertex3f(x, y, z);
`, `    }
    glEnd();
    glEnable(GL_LIGHTING);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: zarrachalar", "    initParticles();\n"));

  /* ---------- 8. FPS statistika ---------- */
  var t8 = S(HEAD + LIGHT + `float hist[60];        // ${C("oxirgi 60 kadr vaqti, ms", "время последних 60 кадров, мс")}
int last = 0;

void text(float x, float y, const char* s) {
    glRasterPos2f(x, y);
    for (int i = 0; s[i]; i++) glutBitmapCharacter(GLUT_BITMAP_9_BY_15, s[i]);
}

void display() {
    int t = glutGet(GLUT_ELAPSED_TIME);
    float dt = t - last; last = t;
    for (int i = 0; i < 59; i++) hist[i] = hist[i + 1];
    hist[59] = dt;
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 2, 6,  0, 0, 0,  0, 1, 0);
    glRotatef(40 * t / 1000.0f, 0, 1, 0);
    glColor3f(0.35f, 0.6f, 1.0f);
    glutSolidTeapot(1.3);

    // ${C("2D qatlam: ekran koordinatalarida (0..480, 0..360)", "2D-слой: в экранных координатах (0..480, 0..360)")}
    glDisable(GL_LIGHTING); glDisable(GL_DEPTH_TEST);
    glMatrixMode(GL_PROJECTION); glPushMatrix(); glLoadIdentity(); gluOrtho2D(0, 480, 0, 360);
    glMatrixMode(GL_MODELVIEW); glPushMatrix(); glLoadIdentity();
`, `    // ${C("TODO 1: örtaça kadr vaqti avg = Σ hist / 60; matn: \"FPS: ...\" va \"ms: ...\" (sprintf + text)", "TODO 1: среднее время кадра avg = Σ hist / 60; текст: \"FPS: ...\" и \"ms: ...\" (sprintf + text)")}
    // ${C("TODO 2: grafik: GL_LINE_STRIP, i-nuqta (10 + 4·i; 10 + 2·hist[i]) — yaşil", "TODO 2: график: GL_LINE_STRIP, i-я точка (10 + 4·i; 10 + 2·hist[i]) — зелёный")}
`, `    float avg = 0;
    for (int i = 0; i < 60; i++) avg += hist[i];
    avg /= 60;
    char buf[64];
    glColor3f(1, 1, 1);
    sprintf(buf, "FPS: %.1f", avg > 0 ? 1000.0f / avg : 0.0f); text(10, 335, buf);
    sprintf(buf, "ms:  %.1f", avg); text(10, 315, buf);
    glColor3f(0.4f, 1.0f, 0.5f);
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i < 60; i++) glVertex2f(10 + 4 * i, 10 + 2 * hist[i]);
    glEnd();
`, `    glPopMatrix(); glMatrixMode(GL_PROJECTION); glPopMatrix(); glMatrixMode(GL_MODELVIEW);
    glEnable(GL_LIGHTING); glEnable(GL_DEPTH_TEST);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A11: FPS statistika"));

  var keysSrc = [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "'w'", msg: { uz: "W tugmasini qayta işlang", ru: "Обработайте клавишу W" } }, { re: "'d'", msg: { uz: "D tugmasini qayta işlang", ru: "Обработайте клавишу D" } }, { re: "yaw\\s*[-+]=", msg: { uz: "Strelkalar yaw ni özgartirsin", ru: "Стрелки должны менять yaw" } }];
  LAB.define({
    n: 11,
    title: { uz: "Fazoda harakatlarni vizuallaştiriş", ru: "Визуализация движения в пространстве" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: aylanuvçi kub", ru: "Пример: вращающийся куб" },
        text: { uz: "<p>Animatsiyaning asosiy qoidasi: holat <b>vaqtga</b> böğliq bölsin, kadrlar soniga emas. Burçak = tezlik × vaqt, vaqt — <code>glutGet(GLUT_ELAPSED_TIME)</code>. <code>idle</code> funksiyasi har bösh vaqtda <code>glutPostRedisplay()</code> ni çaqirib, yangi kadr çizdiradi.</p>",
                ru: "<p>Главное правило анимации: состояние зависит от <b>времени</b>, а не от числа кадров. Угол = скорость × время, время — <code>glutGet(GLUT_ELAPSED_TIME)</code>. Функция <code>idle</code> в свободное время вызывает <code>glutPostRedisplay()</code> и запускает новый кадр.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Aylanuvçi kub va FPS", ru: "Задание 1. Вращающийся куб и FPS" },
        text: { uz: "<p>Kubni Oy atrofida sekundiga 60° tezlikda aylantiring va kadrlar tezligini (FPS) oyna sarlavhasida körsating: kadrlarni sanang, har 500 ms da FPS = kadrlar·1000/öçgan_ms ni hisoblab, <code>glutSetWindowTitle</code> ga bering.</p>",
                ru: "<p>Вращайте куб вокруг Oy со скоростью 60° в секунду и показывайте частоту кадров (FPS) в заголовке окна: считайте кадры, каждые 500 мс вычисляйте FPS = кадры·1000/прошедшие_мс и передавайте в <code>glutSetWindowTitle</code>.</p>" },
        hint: { uz: "glRotatef(60 * now(), 0, 1, 0); sprintf(buf, \"FPS: %.1f\", …); glutSetWindowTitle(buf);", ru: "glRotatef(60 * now(), 0, 1, 0); sprintf(buf, \"FPS: %.1f\", …); glutSetWindowTitle(buf);" },
        check: { type: "both", source: [{ re: "glutSetWindowTitle", msg: { uz: "FPS ni glutSetWindowTitle bilan körsating", ru: "Показывайте FPS через glutSetWindowTitle" } }] }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Trayektoriya böylab harakat", ru: "Задание 2. Движение по траектории" },
        text: { uz: "<p>Sfera fazoviy kub Beze egri çiziği böylab 4 sekundda harakatlanadi; trayektoriya sariq çiziq bilan çiziladi. <code>bez(t, r)</code> funksiyasini yozing — parametrik nuqta har bir koordinata uçun Bernşteyn köphadlari bilan hisoblanadi.</p>",
                ru: "<p>Сфера движется по пространственной кубической кривой Безье за 4 секунды; траектория нарисована жёлтой линией. Напишите функцию <code>bez(t, r)</code> — точка кривой вычисляется многочленами Бернштейна по каждой координате.</p>" },
        hint: { uz: "m = 1 − t; b0 = m³, b1 = 3tm², b2 = 3t²m, b3 = t³; r[k] = Σ bᵢ·P[i][k].", ru: "m = 1 − t; b0 = m³, b1 = 3tm², b2 = 3t²m, b3 = t³; r[k] = Σ bᵢ·P[i][k]." },
        check: { type: "image" }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Öyin kamerasi", ru: "Задание 3. Игровая камера" },
        text: { uz: "<p>Birinçi şaxs kamerasi: <b>W/S</b> — qaraş yönalişida oldinga/orqaga, <b>A/D</b> — yon tomonga, <b>←/→</b> — buriliş (yaw). Qaraş vektori (sin yaw, 0, −cos yaw), öng vektori (cos yaw, 0, sin yaw). Kamera <code>gluLookAt</code> bilan quriladi. Oyna ustiga bosib, sahnada «yurib» köring.</p>",
                ru: "<p>Камера от первого лица: <b>W/S</b> — вперёд/назад по направлению взгляда, <b>A/D</b> — вбок, <b>←/→</b> — поворот (yaw). Вектор взгляда (sin yaw, 0, −cos yaw), вектор вправо (cos yaw, 0, sin yaw). Камера строится через <code>gluLookAt</code>. Щёлкните по окну и «пройдитесь» по сцене.</p>" },
        hint: { uz: "if (key == 'w') { cx += 0.3·sin(yaw); cz −= 0.3·cos(yaw); } …", ru: "if (key == 'w') { cx += 0.3·sin(yaw); cz −= 0.3·cos(yaw); } …" },
        check: { type: "both", source: keysSrc }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Quyoş tizimi", ru: "Задание 4. Солнечная система" },
        text: { uz: "<p>Markazda Quyoş, atrofida 3 ta sayyora turli tezlikda aylanadi, har birining öz yöldoşi bor. Bu — <b>ierarxik almaştirişlar</b>: yöldoş sayyoraning (allaqaçon burilgan va siljigan) koordinatalar tizimida aylanadi. Ički <code>glPushMatrix</code>/<code>glPopMatrix</code> juftligi kerak.</p>",
                ru: "<p>В центре Солнце, вокруг него с разными скоростями вращаются 3 планеты, у каждой свой спутник. Это <b>иерархические преобразования</b>: спутник вращается в системе координат планеты (уже повёрнутой и сдвинутой). Нужна вложенная пара <code>glPushMatrix</code>/<code>glPopMatrix</code>.</p>" },
        hint: { uz: "Push → Rotate(PH[i] + W[i]·t) → Translate(R[i]) → sayyora → Push → Rotate(180·t) → Translate(SZ+0,4) → yöldoş → Pop → Pop.", ru: "Push → Rotate(PH[i] + W[i]·t) → Translate(R[i]) → планета → Push → Rotate(180·t) → Translate(SZ+0,4) → спутник → Pop → Pop." },
        check: { type: "both", calls: { "glPushMatrix": ">=6" } }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Toqnaşuv: sakraydigan şar", ru: "Задание 5. Столкновение: прыгающий шар" },
        text: { uz: "<p>Şar erkin tuşadi (g = −9,8) va polga urilib sakraydi. Harakat kiçik qadamlar (5 ms) bilan integrallanadi: vy += g·dt, y += vy·dt. Toqnaşuvni qayta işlang: şar polga kirib qolsa (y < r) — uni pol sathiga qaytaring va tezlikni 0,8 koeffitsiyent bilan teskari qiling.</p>",
                ru: "<p>Шар свободно падает (g = −9,8) и отскакивает от пола. Движение интегрируется малыми шагами (5 мс): vy += g·dt, y += vy·dt. Обработайте столкновение: если шар ушёл в пол (y < r) — верните его на уровень пола и разверните скорость с коэффициентом 0,8.</p>" },
        hint: { uz: "if (y < RAD) { y = RAD; vy = −vy·0.8f; }", ru: "if (y < RAD) { y = RAD; vy = −vy·0.8f; }" },
        time: 1500, check: { type: "image", maxDiff: 0.003 }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Kalit kadrlar bilan interpolyatsiya", ru: "Задание 6. Интерполяция по ключевым кадрам" },
        text: { uz: "<p>Kub 5 ta kalit kadr (sariq nuqtalar) orasida harakatlanadi: markaz → öng → past → çap → yuqori → markaz, har oraliq 1 sekund. Joriy oraliq i = ⌊t⌋, ulush u = t − i; holat çiziqli interpolyatsiya bilan: p = Kᵢ + u·(Kᵢ₊₁ − Kᵢ).</p>",
                ru: "<p>Куб движется между 5 ключевыми кадрами (жёлтые точки): центр → право → низ → лево → верх → центр, каждый интервал 1 секунда. Текущий интервал i = ⌊t⌋, доля u = t − i; положение — линейная интерполяция: p = Kᵢ + u·(Kᵢ₊₁ − Kᵢ).</p>" },
        hint: { uz: "for k: p[k] = K[i][k] + u·(K[i+1][k] − K[i][k]);", ru: "for k: p[k] = K[i][k] + u·(K[i+1][k] − K[i][k]);" },
        time: 1500, check: { type: "image" }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Zarraçalar tizimi", ru: "Задание 7. Система частиц" },
        text: { uz: "<p>100 ta uçqun favvoradek otiladi: har birining boşlanğiç tezligi va yoşi bor; yoş 1 sekunddan oşganda uçqun qaytadan tuğiladi. Yoş age = (t + siljiş) mod 1, joy — tekis tezlanişli harakat formulasi bilan, rang yoş oşgan sari sariqdan qizilga söniş.</p>",
                ru: "<p>100 искр вылетают фонтаном: у каждой своя начальная скорость и возраст; когда возраст превышает 1 секунду, искра рождается заново. Возраст age = (t + сдвиг) mod 1, позиция — по формуле равноускоренного движения, цвет с возрастом гаснет от жёлтого к красному.</p>" },
        hint: { uz: "age = fmod(t + ofs[i], 1); y = vy·age − 4,9·age²;", ru: "age = fmod(t + ofs[i], 1); y = vy·age − 4,9·age²;" },
        check: { type: "image", maxDiff: 0.003 }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. FPS statistikasi", ru: "Задание 8. Статистика FPS" },
        text: { uz: "<p>Ekranning burçagida FPS va örtaça kadr vaqtini (ms) yozing, pastda — oxirgi 60 kadr vaqtining grafigi. 2D qatlam proyeksiya matritsasini vaqtinça <code>gluOrtho2D</code> ga almaştirib çiziladi. Grafik «sakrasa» — hisobotda sababini tuşuntiring.</p>",
                ru: "<p>Выведите в углу экрана FPS и среднее время кадра (мс), внизу — график времени последних 60 кадров. 2D-слой рисуется с временно заменённой на <code>gluOrtho2D</code> матрицей проекции. Если график «скачет» — объясните причину в отчёте.</p>" },
        hint: { uz: "avg = Σhist/60; sprintf(buf, \"FPS: %.1f\", 1000/avg); text(10, 335, buf); GL_LINE_STRIP: (10 + 4i; 10 + 2·hist[i]).", ru: "avg = Σhist/60; sprintf(buf, \"FPS: %.1f\", 1000/avg); text(10, 335, buf); GL_LINE_STRIP: (10 + 4i; 10 + 2·hist[i])." },
        check: { type: "calls", calls: { "glutBitmapCharacter": ">=8" }, source: [{ re: "GL_LINE_STRIP", msg: { uz: "Grafikni GL_LINE_STRIP bilan çizing", ru: "Рисуйте график через GL_LINE_STRIP" } }, { re: "sprintf", msg: { uz: "Matnni sprintf bilan tayyorlang", ru: "Готовьте текст через sprintf" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
