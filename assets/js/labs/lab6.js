/* A6. Böyaş usullari: Flat, Guro, Fong; materiallar va yoruğlik manbalari (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n";
  var LIGHT = `// ${C("Oq nuqtaviy manba (5, 5, 5): diffuz va ko'zgu tarkibiy qismlari", "Белый точечный источник (5, 5, 5): диффузная и зеркальная составляющие")}
void setupLight() {
    GLfloat pos[] = { 5, 5, 5, 1 };
    GLfloat col[] = { 1, 1, 1, 1 };
    GLfloat amb[] = { 0.15f, 0.15f, 0.18f, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, col);
    glLightfv(GL_LIGHT0, GL_SPECULAR, col);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
}
// ${C("Oddiy material: rang (r, g, b), oq yaltiroqlik", "Простой материал: цвет (r, g, b), белый блик")}
void material(float r, float g, float b, float shin) {
    GLfloat dif[] = { r, g, b, 1 };
    GLfloat amb[] = { r * 0.3f, g * 0.3f, b * 0.3f, 1 };
    GLfloat spe[] = { 0.8f, 0.8f, 0.8f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_AMBIENT, amb);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, shin);
}

`;
  var VIEW = `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 0, 7,  0, 0, 0,  0, 1, 0);
`;
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

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT + `void display() {
` + VIEW + `    setupLight();
    glShadeModel(GL_SMOOTH);              // ${C("Guro böyaşi", "закраска Гуро")}
    material(0.3f, 0.55f, 1.0f, 50);
    glutSolidSphere(1.8, 32, 32);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: Guro");

  /* ---------- 1. Flat ---------- */
  var t1 = S(HEAD + LIGHT + `void display() {
` + VIEW + `    setupLight();
    material(0.3f, 0.55f, 1.0f, 50);

    glPushMatrix();
    glTranslatef(-1.6f, 0, 0);
`, `    // ${C("TODO: çapdagi sfera uçun glShadeModel(GL_FLAT) — har bir yoq bir xil rangda", "TODO: для левой сферы glShadeModel(GL_FLAT) — каждая грань одного цвета")}
    glShadeModel(GL_SMOOTH);
`, `    glShadeModel(GL_FLAT);                // ${C("bir yoq — bitta rang (oxirgi uçning normali böyiça)", "одна грань — один цвет (по нормали последней вершины)")}
`, `    glRotatef(-90, 1, 0, 0);              // ${C("qutblar yuqori va pastda", "полюса сверху и снизу")}
    glutSolidSphere(1.3, 16, 12);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(1.6f, 0, 0);
    glRotatef(-90, 1, 0, 0);
    glShadeModel(GL_SMOOTH);
    glutSolidSphere(1.3, 16, 12);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: Flat va Guro"));

  /* ---------- 2. Guro qölda ---------- */
  var t2 = S(HEAD + `#define PI 3.14159265

// ${C("Lambert qonuni: I = 0,12 + 0,88·max(0, N·L), L — manbaga yönalgan birlik vektor", "Закон Ламберта: I = 0,12 + 0,88·max(0, N·L), L — единичный вектор на источник")}
double lambert(double nx, double ny, double nz) {
    double lx = 0.5, ly = 0.6, lz = 0.62;
    double d = nx * lx + ny * ly + nz * lz;
    if (d < 0) d = 0;
    return 0.12 + 0.88 * d;
}
// ${C("Sfera nuqtasi: kenglik u ∈ [−π/2; π/2], uzunlik v ∈ [0; 2π]; birlik sferada normal = nuqta", "Точка сферы: широта u ∈ [−π/2; π/2], долгота v ∈ [0; 2π]; для единичной сферы нормаль = точка")}
void sp(double u, double v, double n[3]) {
    n[0] = cos(u) * cos(v); n[1] = sin(u); n[2] = cos(u) * sin(v);
}

// ${C("Flat: har bir törtburçak markazidagi normal böyiça bitta rang", "Flat: один цвет на четырёхугольник по нормали в его центре")}
void flatSphere(int N) {
    glBegin(GL_QUADS);
    for (int i = 0; i < N; i++)
        for (int j = 0; j < 2 * N; j++) {
            double u0 = -PI / 2 + PI * i / N, u1 = -PI / 2 + PI * (i + 1) / N;
            double v0 = PI * j / N, v1 = PI * (j + 1) / N;
            double c[3], a[3], b[3], e[3], f[3];
            sp((u0 + u1) / 2, (v0 + v1) / 2, c);
            double I = lambert(c[0], c[1], c[2]);
            glColor3f(0.3 * I, 0.55 * I, 1.0 * I);
            sp(u0, v0, a); sp(u0, v1, b); sp(u1, v1, e); sp(u1, v0, f);
            glVertex3dv(a); glVertex3dv(f); glVertex3dv(e); glVertex3dv(b);
        }
    glEnd();
}

// ${C("Guro: rang har bir UÇDA hisoblanadi, OpenGL uni yoq böylab interpolyatsiya qiladi", "Гуро: цвет вычисляется в каждой ВЕРШИНЕ, OpenGL интерполирует его по грани")}
void vtx(double u, double v) {
    double n[3];
    sp(u, v, n);
`, `    // ${C("TODO: I = lambert(n) ni hisoblang va glColor3f(0,3·I; 0,55·I; 1·I) ni glVertex3dv(n) dan oldin bering", "TODO: вычислите I = lambert(n) и задайте glColor3f(0,3·I; 0,55·I; 1·I) перед glVertex3dv(n)")}
    glColor3f(0.3f, 0.55f, 1.0f);
    glVertex3dv(n);
`, `    double I = lambert(n[0], n[1], n[2]);
    glColor3f(0.3 * I, 0.55 * I, 1.0 * I);
    glVertex3dv(n);
`, `}
void gouraudSphere(int N) {
    glBegin(GL_QUADS);
    for (int i = 0; i < N; i++)
        for (int j = 0; j < 2 * N; j++) {
            double u0 = -PI / 2 + PI * i / N, u1 = -PI / 2 + PI * (i + 1) / N;
            double v0 = PI * j / N, v1 = PI * (j + 1) / N;
            vtx(u0, v0); vtx(u1, v0); vtx(u1, v1); vtx(u0, v1);
        }
    glEnd();
}

void display() {
` + VIEW + `    glShadeModel(GL_SMOOTH);              // ${C("yoritiş öçiq: ranglarni özimiz hisoblaymiz", "освещение выключено: цвета считаем сами")}
    glPushMatrix(); glTranslatef(-1.6f, 0, 0); glScalef(1.3f, 1.3f, 1.3f); flatSphere(8);    glPopMatrix();
    glPushMatrix(); glTranslatef(1.6f, 0, 0);  glScalef(1.3f, 1.3f, 1.3f); gouraudSphere(8); glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: Guro qolda"));

  /* ---------- 3. Bölinmalar ---------- */
  var t3 = S(HEAD + LIGHT + `void display() {
` + VIEW + `    setupLight();
    glShadeModel(GL_SMOOTH);
    material(1.0f, 0.55f, 0.25f, 60);
`, `    // ${C("TODO: 4 ta sfera (radiusi 0,7) x = −2,4; −0,8; 0,8; 2,4 da: bölinmalar 8, 16, 32, 64", "TODO: 4 сферы (радиус 0,7) в x = −2,4; −0,8; 0,8; 2,4: разбиения 8, 16, 32, 64")}
    glRotatef(-90, 1, 0, 0);
    glutSolidSphere(0.7, 8, 8);
`, `    int n[4] = { 8, 16, 32, 64 };
    for (int k = 0; k < 4; k++) {
        glPushMatrix();
        glTranslatef(-2.4f + 1.6f * k, 0, 0);
        glRotatef(-90, 1, 0, 0);
        glutSolidSphere(0.7, n[k], n[k]);
        glPopMatrix();
    }
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: bolinmalar"));

  /* ---------- 4. Oltin material ---------- */
  var t4 = S(HEAD + LIGHT + `// ${C("Oltin: klassik qiymatlar (ambient, diffuse, specular)", "Золото: классические значения (ambient, diffuse, specular)")}
void gold(float shininess) {
`, `    // ${C("TODO: ambient (0,25; 0,2; 0,07), diffuse (0,75; 0,61; 0,23), specular (0,63; 0,56; 0,37) va GL_SHININESS ni bering", "TODO: задайте ambient (0,25; 0,2; 0,07), diffuse (0,75; 0,61; 0,23), specular (0,63; 0,56; 0,37) и GL_SHININESS")}
    material(0.6f, 0.6f, 0.6f, shininess);
`, `    GLfloat amb[] = { 0.25f, 0.2f, 0.07f, 1 };
    GLfloat dif[] = { 0.75f, 0.61f, 0.23f, 1 };
    GLfloat spe[] = { 0.63f, 0.56f, 0.37f, 1 };
    glMaterialfv(GL_FRONT, GL_AMBIENT, amb);
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, shininess);
`, `}

void display() {
` + VIEW + `    setupLight();
    glShadeModel(GL_SMOOTH);
    float sh[3] = { 10, 60, 128 };        // ${C("yaltiroqlik: keng → tor yaltiroq dog'", "блеск: широкий → узкий блик")}
    for (int k = 0; k < 3; k++) {
        glPushMatrix();
        glTranslatef(-2.2f + 2.2f * k, 0, 0);
        gold(sh[k]);
        glutSolidSphere(0.95, 40, 40);
        glPopMatrix();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: oltin"));

  /* ---------- 5. Ikki manba ---------- */
  var t5 = S(HEAD + `void display() {
` + VIEW + `    glEnable(GL_LIGHTING);
    GLfloat white[] = { 1, 1, 1, 1 }, red[] = { 1, 0.15f, 0.1f, 1 };
    GLfloat p0[] = { 1, 2, 6, 1 };          // ${C("old tomondan", "спереди")}
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, p0);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
    glLightfv(GL_LIGHT0, GL_SPECULAR, white);
`, `    // ${C("TODO: GL_LIGHT1 — qizil manba çap tomondan (−6, 0, 1): yoqing va pozitsiya, diffuse, specular bering", "TODO: GL_LIGHT1 — красный источник слева (−6, 0, 1): включите и задайте позицию, diffuse, specular")}
`, `    GLfloat p1[] = { -6, 0, 1, 1 };         // ${C("çapdan", "слева")}
    glEnable(GL_LIGHT1);
    glLightfv(GL_LIGHT1, GL_POSITION, p1);
    glLightfv(GL_LIGHT1, GL_DIFFUSE, red);
    glLightfv(GL_LIGHT1, GL_SPECULAR, red);
`, `    GLfloat dif[] = { 0.8f, 0.8f, 0.8f, 1 }, spe[] = { 0.7f, 0.7f, 0.7f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 50);
    glShadeModel(GL_SMOOTH);
    glutSolidSphere(1.8, 48, 48);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: ikki manba"));

  /* ---------- 6. Kub ---------- */
  var t6 = S(HEAD + LIGHT + `// ${C("Kub uçlari (markazda, tomoni 2)", "Вершины куба (в центре, сторона 2)")}
float V[8][3] = { {-1,-1,-1}, {1,-1,-1}, {1,1,-1}, {-1,1,-1}, {-1,-1,1}, {1,-1,1}, {1,1,1}, {-1,1,1} };
int F[6][4] = { {4,5,6,7}, {1,0,3,2}, {5,1,2,6}, {0,4,7,3}, {7,6,2,3}, {0,1,5,4} };

// ${C("Har bir uçda «örtaça» normal: uç markazdan qaragan yönaliş", "В каждой вершине «усреднённая» нормаль: направление вершины от центра")}
void smoothCube() {
    glBegin(GL_QUADS);
    for (int f = 0; f < 6; f++)
        for (int k = 0; k < 4; k++) {
            float* v = V[F[f][k]];
`, `            // ${C("TODO: glNormal3f(v[0], v[1], v[2]) — uçning örtaça normali (GL_NORMALIZE uni birlikka keltiradi)", "TODO: glNormal3f(v[0], v[1], v[2]) — усреднённая нормаль вершины (GL_NORMALIZE нормирует её)")}
            glVertex3fv(v);
`, `            glNormal3f(v[0], v[1], v[2]);
            glVertex3fv(v);
`, `        }
    glEnd();
}

void display() {
` + VIEW + `    setupLight();
    glEnable(GL_NORMALIZE);
    glShadeModel(GL_SMOOTH);
    material(0.4f, 0.85f, 0.55f, 40);
    // ${C("Çapda: glutSolidCube — yoq normallari, FLAT va SMOOTH bir xil körinadi", "Слева: glutSolidCube — нормали граней, FLAT и SMOOTH выглядят одинаково")}
    glPushMatrix(); glTranslatef(-1.7f, 0, 0); glRotatef(30, 1, 0, 0); glRotatef(35, 0, 1, 0); glutSolidCube(1.8); glPopMatrix();
    // ${C("Ongda: uç normallari örtaçalangan kub", "Справа: куб с усреднёнными нормалями вершин")}
    glPushMatrix(); glTranslatef(1.7f, 0, 0); glRotatef(30, 1, 0, 0); glRotatef(35, 0, 1, 0); glScalef(0.9f, 0.9f, 0.9f); smoothCube(); glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A6: kub"));

  /* ---------- 7. Interaktiv manba ---------- */
  var t7 = S(HEAD + `float lx = 3, ly = 3;     // ${C("manba pozitsiyasi (z = 4)", "позиция источника (z = 4)")}

void display() {
` + VIEW + `    // ${C("Manba belgisi — yoritişsiz sariq nuqta", "Метка источника — неосвещённая жёлтая точка")}
    glDisable(GL_LIGHTING);
    glPointSize(10.0f);
    glColor3f(1.0f, 0.9f, 0.3f);
    glBegin(GL_POINTS); glVertex3f(lx, ly, 4); glEnd();

    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    GLfloat pos[] = { lx, ly, 4, 1 }, w[] = { 1, 1, 1, 1 };
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, w);
    glLightfv(GL_LIGHT0, GL_SPECULAR, w);
    GLfloat dif[] = { 0.85f, 0.3f, 0.35f, 1 }, spe[] = { 1, 1, 1, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 80);
    glShadeModel(GL_SMOOTH);
    glutSolidSphere(1.6, 48, 48);
    glutSwapBuffers();
}

`, `// ${C("TODO: special(): strelkalar manbani lx, ly böyiça 0,5 ga suradi; keyin glutPostRedisplay(); main() da qayd qiling", "TODO: special(): стрелки сдвигают источник по lx, ly на 0,5; затем glutPostRedisplay(); зарегистрируйте в main()")}
void special(int key, int x, int y) { }
`, `void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  lx -= 0.5f;
    if (key == GLUT_KEY_RIGHT) lx += 0.5f;
    if (key == GLUT_KEY_UP)    ly += 0.5f;
    if (key == GLUT_KEY_DOWN)  ly -= 0.5f;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A6: interaktiv manba", "    glutSpecialFunc(special);\n"));

  /* ---------- 8. Fong (piksel böyiça) ---------- */
  var t8 = S(HEAD + `#define PW 240
#define PH 360
unsigned char img[PW * PH * 3];

// ${C("Fong modeli har bir PIKSELDA — fragment şader aynan şu işni bajaradi.", "Модель Фонга в каждом ПИКСЕЛЕ — именно это делает фрагментный шейдер.")}
// ${C("Sfera: markaz (120, 180), radius 100; kuzatuvçi V = (0, 0, 1)", "Сфера: центр (120, 180), радиус 100; наблюдатель V = (0, 0, 1)")}
void phongImage() {
    double Lx = 0.45, Ly = 0.55, Lz = 0.7;
    double ln = sqrt(Lx*Lx + Ly*Ly + Lz*Lz); Lx /= ln; Ly /= ln; Lz /= ln;
    for (int y = 0; y < PH; y++)
        for (int x = 0; x < PW; x++) {
            int k = (y * PW + x) * 3;
            double nx = (x - 120) / 100.0, ny = (y - 180) / 100.0, r2 = nx*nx + ny*ny;
            if (r2 > 1) { img[k] = 20; img[k + 1] = 28; img[k + 2] = 51; continue; }
            double nz = sqrt(1 - r2);
`, `            // ${C("TODO: diff = max(0, N·L); R = 2(N·L)N − L; spec = max(0, R·V)^40;", "TODO: diff = max(0, N·L); R = 2(N·L)N − L; spec = max(0, R·V)^40;")}
            // ${C("rang = (0,3; 0,55; 1)·(0,12 + 0,88·diff)·255 + 255·0,8·spec (255 dan oşmasin)", "цвет = (0,3; 0,55; 1)·(0,12 + 0,88·diff)·255 + 255·0,8·spec (не больше 255)")}
            img[k] = 77; img[k + 1] = 140; img[k + 2] = 255;
`, `            double d = nx * Lx + ny * Ly + nz * Lz;
            double diff = d > 0 ? d : 0;
            double Rz = 2 * d * nz - Lz;                 // ${C("R·V = R.z, çunki V = (0, 0, 1)", "R·V = R.z, так как V = (0, 0, 1)")}
            double spec = Rz > 0 ? pow(Rz, 40) : 0;
            double I = 0.12 + 0.88 * diff;
            double c[3] = { 0.3 * I, 0.55 * I, 1.0 * I };
            for (int i = 0; i < 3; i++) {
                double v = (c[i] + 0.8 * spec) * 255;
                img[k + i] = v > 255 ? 255 : (int)v;
            }
`, `        }
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    // ${C("Çap yarmi: OpenGL, Guro (uçlarda hisoblaş), qöpol tör — yaltiroq dog' burçakli", "Левая половина: OpenGL, Гуро (по вершинам), грубая сетка — блик угловатый")}
    glViewport(0, 0, 240, 360);
    glMatrixMode(GL_PROJECTION); glLoadIdentity();
    gluPerspective(40.0, 240.0 / 360.0, 0.5, 100.0);
    glMatrixMode(GL_MODELVIEW); glLoadIdentity();
    gluLookAt(0, 0, 7,  0, 0, 0,  0, 1, 0);
    glEnable(GL_LIGHTING); glEnable(GL_LIGHT0);
    GLfloat pos[] = { 0.45f, 0.55f, 0.7f, 0 }, w[] = { 1, 1, 1, 1 }, amb[] = { 0.12f, 0.12f, 0.12f, 1 };
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, w);
    glLightfv(GL_LIGHT0, GL_SPECULAR, w);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
    GLfloat dif[] = { 0.3f, 0.55f, 1.0f, 1 }, spe[] = { 0.8f, 0.8f, 0.8f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 40);
    glShadeModel(GL_SMOOTH);
    glRotatef(-90, 1, 0, 0);
    glutSolidSphere(1.25, 10, 8);
    glDisable(GL_LIGHTING);

    // ${C("Ong yarmi: piksel böyiça Fong (dasturiy «fragment şader»)", "Правая половина: Фонг по пикселям (программный «фрагментный шейдер»)")}
    glViewport(240, 0, 240, 360);
    glMatrixMode(GL_PROJECTION); glLoadIdentity();
    gluOrtho2D(0, 240, 0, 360);
    glMatrixMode(GL_MODELVIEW); glLoadIdentity();
    phongImage();
    glRasterPos2i(0, 0);
    glDrawPixels(PW, PH, GL_RGB, GL_UNSIGNED_BYTE, img);
    glutSwapBuffers();
}

void reshape(int w, int h) { }
` + MAIN("A6: Fong"));

  LAB.define({
    n: 6,
    title: { uz: "Böyaş usullaridan foydalanib uç ölçovli obyektlarni böyaş", ru: "Методы закраски трёхмерных объектов" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: Guro böyaşi bilan sfera", ru: "Пример: сфера с закраской Гуро" },
        text: { uz: "<p>OpenGL ning standart yoritiş modeli har bir <b>uçda</b> rangni hisoblaydi: atrof (ambient) + diffuz (Lambert, N·L) + közgu (Fong, (R·V)ⁿ). <code>glShadeModel(GL_SMOOTH)</code> — <b>Guro</b> usuli: uçlardagi ranglar yoq böylab interpolyatsiya qilinadi. Manba (5, 5, 5) nuqtada — yaltiroq dog' yuqori-ong tomonda.</p>",
                ru: "<p>Стандартная модель освещения OpenGL вычисляет цвет в каждой <b>вершине</b>: фоновая (ambient) + диффузная (Ламберт, N·L) + зеркальная (Фонг, (R·V)ⁿ). <code>glShadeModel(GL_SMOOTH)</code> — метод <b>Гуро</b>: цвета вершин интерполируются по грани. Источник в точке (5, 5, 5) — блик справа сверху.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Flat böyaş", ru: "Задание 1. Плоская закраска" },
        text: { uz: "<p>Çapdagi sferani <code>GL_FLAT</code> rejimida çizing: har bir yoq bitta rang bilan böyaladi va sfera köpyoqlikka öxşab qoladi. Ongdagi sfera — xuddi şu tör, lekin Guro bilan. Bölinmalar soni bir xil (16×12) — farq faqat böyaş usulida.</p>",
                ru: "<p>Нарисуйте левую сферу в режиме <code>GL_FLAT</code>: каждая грань закрашивается одним цветом, и сфера выглядит многогранником. Правая — та же сетка, но с закраской Гуро. Разбиение одинаковое (16×12) — разница только в методе закраски.</p>" },
        hint: { uz: "glShadeModel(GL_FLAT); — çap sferadan oldin.", ru: "glShadeModel(GL_FLAT); — перед левой сферой." },
        check: { type: "both", source: [{ re: "GL_FLAT", msg: { uz: "glShadeModel(GL_FLAT) ni işlating", ru: "Используйте glShadeModel(GL_FLAT)" } }] }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Guro usuli — qölda", ru: "Задание 2. Метод Гуро — вручную" },
        text: { uz: "<p>Yoritişni özimiz hisoblaymiz. Çapda — Flat: rang törtburçak markazidagi normal böyiça. Ongda — Guro: rangni har bir <b>uçda</b> Lambert qonuni I = 0,12 + 0,88·max(0, N·L) bilan hisoblang; birlik sferada uçning normali — uçning özi. OpenGL ranglarni yoq böylab silliq interpolyatsiya qiladi.</p>",
                ru: "<p>Освещение считаем сами. Слева — Flat: цвет по нормали в центре четырёхугольника. Справа — Гуро: вычислите цвет в каждой <b>вершине</b> по закону Ламберта I = 0,12 + 0,88·max(0, N·L); у единичной сферы нормаль вершины — сама вершина. OpenGL плавно интерполирует цвета по грани.</p>" },
        hint: { uz: "double I = lambert(n[0], n[1], n[2]); glColor3f(0.3·I, 0.55·I, 1.0·I); glVertex3dv(n);", ru: "double I = lambert(n[0], n[1], n[2]); glColor3f(0.3·I, 0.55·I, 1.0·I); glVertex3dv(n);" },
        check: { type: "image" }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Sferaning bölinmalari", ru: "Задание 3. Разбиение сферы" },
        text: { uz: "<p>Bir qatorda 4 ta sfera çizing: bölinmalar soni 8, 16, 32, 64. Guro usuli yirik törda yaltiroq dog'ni «burçakli» qilib qöyadi; bölinmalar köpaygan sari natija piksel böyiça Fong böyaşiga yaqinlaşadi. Qaysi bölinişdan boşlab farq sezilmay qoladi — hisobotda yozing.</p>",
                ru: "<p>Нарисуйте в ряд 4 сферы с числом разбиений 8, 16, 32, 64. На крупной сетке Гуро делает блик «угловатым»; с ростом разбиения результат приближается к попиксельной закраске Фонга. С какого разбиения разница перестаёт быть заметной — запишите в отчёт.</p>" },
        hint: { uz: "int n[4] = {8, 16, 32, 64}; for k: glTranslatef(−2,4 + 1,6·k, 0, 0); glRotatef(−90, 1, 0, 0); glutSolidSphere(0.7, n[k], n[k]);", ru: "int n[4] = {8, 16, 32, 64}; for k: glTranslatef(−2,4 + 1,6·k, 0, 0); glRotatef(−90, 1, 0, 0); glutSolidSphere(0.7, n[k], n[k]);" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Oltin material", ru: "Задание 4. Материал «золото»" },
        text: { uz: "<p>Sariq metall — oltin materialini bering: ambient (0,25; 0,2; 0,07), diffuse (0,75; 0,61; 0,23), specular (0,63; 0,56; 0,37). Uçta sfera yaltiroqlik (<code>GL_SHININESS</code>) 10, 60 va 128 bilan çiziladi: kattaroq qiymat — kiçikroq va keskinroq yaltiroq dog'.</p>",
                ru: "<p>Задайте материал «золото»: ambient (0,25; 0,2; 0,07), diffuse (0,75; 0,61; 0,23), specular (0,63; 0,56; 0,37). Три сферы рисуются с блеском (<code>GL_SHININESS</code>) 10, 60 и 128: чем больше значение, тем меньше и резче блик.</p>" },
        hint: { uz: "glMaterialfv(GL_FRONT, GL_AMBIENT, amb); … glMaterialf(GL_FRONT, GL_SHININESS, shininess);", ru: "glMaterialfv(GL_FRONT, GL_AMBIENT, amb); … glMaterialf(GL_FRONT, GL_SHININESS, shininess);" },
        check: { type: "both", calls: { "glMaterialfv": ">=9" } }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Ikki manba", ru: "Задание 5. Два источника" },
        text: { uz: "<p>Sahnaga ikkinçi manba — <code>GL_LIGHT1</code> qöşing: qizil rangda, çap tomonda (−6, 0, 1). Oldindagi oq manba bilan birga sferada ikki yaltiroq dog' va rang qorişişi hosil böladi: OpenGL barça yoqilgan manbalar hissasini qöşadi.</p>",
                ru: "<p>Добавьте второй источник — <code>GL_LIGHT1</code>: красный, слева (−6, 0, 1). Вместе с белым передним источником на сфере появятся два блика и смешение цветов: OpenGL складывает вклады всех включённых источников.</p>" },
        hint: { uz: "glEnable(GL_LIGHT1); glLightfv(GL_LIGHT1, GL_POSITION, p1); … GL_DIFFUSE, GL_SPECULAR — red.", ru: "glEnable(GL_LIGHT1); glLightfv(GL_LIGHT1, GL_POSITION, p1); … GL_DIFFUSE, GL_SPECULAR — red." },
        check: { type: "both", source: [{ re: "GL_LIGHT1", msg: { uz: "GL_LIGHT1 manbasini işlating", ru: "Используйте источник GL_LIGHT1" } }] }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Kubda Flat va Guro", ru: "Задание 6. Flat и Гуро на кубе" },
        text: { uz: "<p><code>glutSolidCube</code> da har bir yoqning 4 ta uçi bir xil normalga ega — şuning uçun GL_FLAT va GL_SMOOTH bir xil natija beradi. Ongdagi kubga har bir uçda <b>örtaçalangan normal</b> bering (uç yönalişi markazdan): endi Guro yoqlarni «yumaloqlaydi» — kub yumşoq köringanday böladi.</p>",
                ru: "<p>У <code>glutSolidCube</code> все 4 вершины грани имеют одинаковую нормаль — поэтому GL_FLAT и GL_SMOOTH дают одинаковый результат. Задайте правому кубу <b>усреднённые нормали</b> в вершинах (направление вершины от центра): теперь Гуро «скругляет» грани — куб кажется мягким.</p>" },
        hint: { uz: "glNormal3f(v[0], v[1], v[2]); glVertex3fv(v);", ru: "glNormal3f(v[0], v[1], v[2]); glVertex3fv(v);" },
        check: { type: "both", calls: { "glNormal3f": ">=24" } }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Interaktiv manba", ru: "Задание 7. Интерактивный источник" },
        text: { uz: "<p>Manba pozitsiyasini strelkalar bilan özgartiring (0,5 qadam). Sariq nuqta — manba. Kuzating: diffuz yoritilgan qism manba tomonga, yaltiroq dog' esa manba va közning «örtasiga» qarab siljiydi (R·V maksimal bölgan joy).</p>",
                ru: "<p>Меняйте позицию источника стрелками (шаг 0,5). Жёлтая точка — источник. Наблюдайте: освещённая часть смещается к источнику, а блик — к направлению «между» источником и глазом (где R·V максимально).</p>" },
        hint: { uz: "if (key == GLUT_KEY_LEFT) lx −= 0.5f; … glutPostRedisplay(); main(): glutSpecialFunc(special);", ru: "if (key == GLUT_KEY_LEFT) lx −= 0.5f; … glutPostRedisplay(); main(): glutSpecialFunc(special);" },
        check: { type: "both", source: [{ re: "glutSpecialFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutSpecialFunc(special) ni qayd qiling", ru: "Зарегистрируйте glutSpecialFunc(special)" } }, { re: "GLUT_KEY_LEFT", msg: { uz: "Çap strelkani (GLUT_KEY_LEFT) qayta işlang", ru: "Обработайте стрелку влево (GLUT_KEY_LEFT)" } }, { re: "GLUT_KEY_UP", msg: { uz: "Yuqori strelkani (GLUT_KEY_UP) qayta işlang", ru: "Обработайте стрелку вверх (GLUT_KEY_UP)" } }] }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Fong — piksel böyiça («fragment şader»)", ru: "Задание 8. Фонг — по пикселям («фрагментный шейдер»)" },
        text: { uz: "<p>GLSL fragment şaderi har bir piksel uçun yoritişni hisoblaydi. Brauzer emulyatori GLSL ni bajarmaydi, şuning uçun xuddi şu hisobni protsessorda yozamiz: har bir piksel uçun sfera normali N, diffuz max(0, N·L) va közgu max(0, R·V)⁴⁰. Çapda — qöpol törli Guro, ongda — sizning Fong: yaltiroq dog' doira şaklida va silliq.</p>",
                ru: "<p>Фрагментный шейдер GLSL вычисляет освещение для каждого пикселя. Браузерный эмулятор не выполняет GLSL, поэтому тот же расчёт напишем на процессоре: для каждого пикселя нормаль сферы N, диффузная max(0, N·L) и зеркальная max(0, R·V)⁴⁰. Слева — Гуро на грубой сетке, справа — ваш Фонг: блик круглый и гладкий.</p>" },
        hint: { uz: "d = N·L; diff = max(0, d); R.z = 2·d·nz − Lz; spec = R.z > 0 ? pow(R.z, 40) : 0; rang = baza·(0,12 + 0,88·diff) + 0,8·spec.", ru: "d = N·L; diff = max(0, d); R.z = 2·d·nz − Lz; spec = R.z > 0 ? pow(R.z, 40) : 0; цвет = база·(0,12 + 0,88·diff) + 0,8·spec." },
        check: { type: "image" }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
