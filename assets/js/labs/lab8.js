/* A8. OpenGL: materiallar va yoruğlik manbalari (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n";
  var VIEW = `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 1.5, 7,  0, 0, 0,  0, 1, 0);
`;
  var LIGHT0 = `// ${C("Oq nuqtaviy manba (5, 5, 5)", "Белый точечный источник (5, 5, 5)")}
void setupLights() {
    GLfloat pos[] = { 5, 5, 5, 1 }, white[] = { 1, 1, 1, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
    glLightfv(GL_LIGHT0, GL_SPECULAR, white);
}

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
  var MATRED = `    GLfloat mat_diff[] = { 0.8f, 0.2f, 0.2f, 1 };
    GLfloat mat_spec[] = { 1, 1, 1, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diff);
    glMaterialfv(GL_FRONT, GL_SPECULAR, mat_spec);
    glMaterialf(GL_FRONT, GL_SHININESS, 60);
`;
  var MATGRAY = `    GLfloat dif[] = { 0.75f, 0.75f, 0.78f, 1 }, spe[] = { 0.6f, 0.6f, 0.6f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 40);
`;

  var FLOOR = `// ${C("Pol: mayda katakçalar — yoritiş uçlarda hisoblangani uçun spot doirasi silliq çiqadi", "Пол: мелкие клетки — освещение считается в вершинах, поэтому пятно прожектора выходит гладким")}
void floor_(float y) {
    glNormal3f(0, 1, 0);
    glBegin(GL_QUADS);
    for (int i = -40; i < 40; i++)
        for (int j = -40; j < 40; j++) {
            float x0 = i * 0.15f, z0 = j * 0.15f;
            glVertex3f(x0, y, z0); glVertex3f(x0, y, z0 + 0.15f);
            glVertex3f(x0 + 0.15f, y, z0 + 0.15f); glVertex3f(x0 + 0.15f, y, z0);
        }
    glEnd();
}

`;

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT0 + `void display() {
` + VIEW + `    setupLights();
` + MATRED + `    glutSolidSphere(1.5, 32, 32);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: yoritilgan shar");

  /* ---------- 1. Oddiy yoruğlik ---------- */
  var t1 = S(HEAD + `void display() {
` + VIEW, `    // ${C("TODO: yoritişni yoqing (GL_LIGHTING, GL_LIGHT0), manba pozitsiyasi (5, 5, 5, 1), diffuse = (1, 1, 1, 1)", "TODO: включите освещение (GL_LIGHTING, GL_LIGHT0), позиция источника (5, 5, 5, 1), diffuse = (1, 1, 1, 1)")}
    glColor3f(0.75f, 0.75f, 0.78f);
`, `    GLfloat pos[] = { 5, 5, 5, 1 };          // ${C("w = 1 — nuqtaviy manba", "w = 1 — точечный источник")}
    GLfloat white[] = { 1, 1, 1, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
`, MATGRAY + `    glutSolidSphere(1.5, 32, 32);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: oddiy yorug'lik"));

  /* ---------- 2. Rangli material ---------- */
  var t2 = S(HEAD + LIGHT0 + `void display() {
` + VIEW + `    setupLights();
`, `    // ${C("TODO: oltin material: ambient (0,2; 0,15; 0,05), diffuse (0,9; 0,7; 0,1), specular (1; 1; 0,8), shininess 50", "TODO: золотистый материал: ambient (0,2; 0,15; 0,05), diffuse (0,9; 0,7; 0,1), specular (1; 1; 0,8), shininess 50")}
`, `    GLfloat amb[] = { 0.2f, 0.15f, 0.05f, 1 };
    GLfloat dif[] = { 0.9f, 0.7f, 0.1f, 1 };
    GLfloat spe[] = { 1.0f, 1.0f, 0.8f, 1 };
    glMaterialfv(GL_FRONT, GL_AMBIENT, amb);
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 50);
`, `    glutSolidSphere(1.5, 32, 32);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: oltin"));

  /* ---------- 3. Yönaltirilgan manba ---------- */
  var t3 = S(HEAD + `void display() {
` + VIEW + `    GLfloat white[] = { 1, 1, 1, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
    glLightfv(GL_LIGHT0, GL_SPECULAR, white);
`, `    // ${C("TODO: quyoş — yönaltirilgan manba: nurlar (−1, −1, −1) yönalişda tuşadi,", "TODO: солнце — направленный источник: лучи идут в направлении (−1, −1, −1),")}
    // ${C("GL_POSITION ga manbaga qaragan vektor beriladi: (1, 1, 1, 0) — oxirgi komponent 0", "в GL_POSITION задаётся вектор на источник: (1, 1, 1, 0) — последняя компонента 0")}
    GLfloat pos[] = { 0, 0, 5, 1 };
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
`, `    GLfloat dir[] = { 1, 1, 1, 0 };          // ${C("w = 0: cheksiz uzoqdagi manba, nurlar parallel", "w = 0: бесконечно удалённый источник, лучи параллельны")}
    glLightfv(GL_LIGHT0, GL_POSITION, dir);
`, MATGRAY + `    for (int k = -1; k <= 1; k++) {
        glPushMatrix();
        glTranslatef(k * 2.3f, 0, 0);
        glutSolidSphere(0.9, 32, 32);
        glPopMatrix();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: quyosh"));

  /* ---------- 4. Spot ---------- */
  var t4 = S(HEAD + FLOOR + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 4, 8,  0, -0.5, 0,  0, 1, 0);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    GLfloat white[] = { 1, 1, 1, 1 }, amb[] = { 0.08f, 0.08f, 0.1f, 1 };
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
    glLightfv(GL_LIGHT0, GL_SPECULAR, white);
    GLfloat pos[] = { 0, 5, 0, 1 };
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
`, `    // ${C("TODO: spot: GL_SPOT_DIRECTION = (0, −1, 0), GL_SPOT_CUTOFF = 30°, GL_SPOT_EXPONENT = 10", "TODO: прожектор: GL_SPOT_DIRECTION = (0, −1, 0), GL_SPOT_CUTOFF = 30°, GL_SPOT_EXPONENT = 10")}
`, `    GLfloat sdir[] = { 0, -1, 0 };
    glLightfv(GL_LIGHT0, GL_SPOT_DIRECTION, sdir);
    glLightf(GL_LIGHT0, GL_SPOT_CUTOFF, 30);       // ${C("konus yarim burçagi", "половина угла конуса")}
    glLightf(GL_LIGHT0, GL_SPOT_EXPONENT, 10);     // ${C("markazdan çetga qarab susayiş", "ослабление от центра к краю")}
`, MATGRAY + `    floor_(-1.5f);
    GLfloat red[] = { 0.85f, 0.25f, 0.25f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, red);
    glPushMatrix();
    glTranslatef(0.8f, -0.6f, 0);
    glutSolidSphere(0.9, 32, 32);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: spot"));

  /* ---------- 5. Ikki manba ---------- */
  var t5 = S(HEAD + `void display() {
` + VIEW + `    glEnable(GL_LIGHTING);
    GLfloat red[] = { 1, 0.15f, 0.15f, 1 }, blue[] = { 0.2f, 0.35f, 1, 1 };
`, `    // ${C("TODO: GL_LIGHT0 — qizil, çapdan (−6, 1, 2); GL_LIGHT1 — kök, öngdan (6, 1, 2)", "TODO: GL_LIGHT0 — красный слева (−6, 1, 2); GL_LIGHT1 — синий справа (6, 1, 2)")}
`, `    GLfloat p0[] = { -6, 1, 2, 1 }, p1[] = { 6, 1, 2, 1 };
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, p0);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, red);
    glLightfv(GL_LIGHT0, GL_SPECULAR, red);
    glEnable(GL_LIGHT1);
    glLightfv(GL_LIGHT1, GL_POSITION, p1);
    glLightfv(GL_LIGHT1, GL_DIFFUSE, blue);
    glLightfv(GL_LIGHT1, GL_SPECULAR, blue);
`, `    GLfloat dif[] = { 0.9f, 0.9f, 0.9f, 1 }, spe[] = { 0.8f, 0.8f, 0.8f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 40);
    glutSolidSphere(1.7, 48, 48);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: ikki manba"));

  /* ---------- 6. Kub normallari ---------- */
  var t6 = S(HEAD + LIGHT0 + `// ${C("Kub: 6 ta yoq, har biri öz normali bilan", "Куб: 6 граней, у каждой своя нормаль")}
void cube() {
    glBegin(GL_QUADS);
`, `    // ${C("TODO: har bir yoq oldidan glNormal3f bering: +Z (0, 0, 1), −Z, +X, −X, +Y, −Y", "TODO: перед каждой гранью задайте glNormal3f: +Z (0, 0, 1), −Z, +X, −X, +Y, −Y")}
    glVertex3f(-1,-1, 1); glVertex3f( 1,-1, 1); glVertex3f( 1, 1, 1); glVertex3f(-1, 1, 1);
    glVertex3f( 1,-1,-1); glVertex3f(-1,-1,-1); glVertex3f(-1, 1,-1); glVertex3f( 1, 1,-1);
    glVertex3f( 1,-1, 1); glVertex3f( 1,-1,-1); glVertex3f( 1, 1,-1); glVertex3f( 1, 1, 1);
    glVertex3f(-1,-1,-1); glVertex3f(-1,-1, 1); glVertex3f(-1, 1, 1); glVertex3f(-1, 1,-1);
    glVertex3f(-1, 1, 1); glVertex3f( 1, 1, 1); glVertex3f( 1, 1,-1); glVertex3f(-1, 1,-1);
    glVertex3f(-1,-1,-1); glVertex3f( 1,-1,-1); glVertex3f( 1,-1, 1); glVertex3f(-1,-1, 1);
`, `    glNormal3f(0, 0, 1);   glVertex3f(-1,-1, 1); glVertex3f( 1,-1, 1); glVertex3f( 1, 1, 1); glVertex3f(-1, 1, 1);
    glNormal3f(0, 0, -1);  glVertex3f( 1,-1,-1); glVertex3f(-1,-1,-1); glVertex3f(-1, 1,-1); glVertex3f( 1, 1,-1);
    glNormal3f(1, 0, 0);   glVertex3f( 1,-1, 1); glVertex3f( 1,-1,-1); glVertex3f( 1, 1,-1); glVertex3f( 1, 1, 1);
    glNormal3f(-1, 0, 0);  glVertex3f(-1,-1,-1); glVertex3f(-1,-1, 1); glVertex3f(-1, 1, 1); glVertex3f(-1, 1,-1);
    glNormal3f(0, 1, 0);   glVertex3f(-1, 1, 1); glVertex3f( 1, 1, 1); glVertex3f( 1, 1,-1); glVertex3f(-1, 1,-1);
    glNormal3f(0, -1, 0);  glVertex3f(-1,-1,-1); glVertex3f( 1,-1,-1); glVertex3f( 1,-1, 1); glVertex3f(-1,-1, 1);
`, `    glEnd();
}

void display() {
` + VIEW + `    setupLights();
    GLfloat dif[] = { 0.35f, 0.75f, 0.95f, 1 }, spe[] = { 0.5f, 0.5f, 0.5f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 30);
    glRotatef(25, 1, 0, 0);
    glRotatef(-35, 0, 1, 0);
    cube();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: kub normallari"));

  /* ---------- 7. Jonli porlaş ---------- */
  var t7 = S(HEAD + LIGHT0 + `float shin = 32;

void display() {
` + VIEW + `    setupLights();
    GLfloat dif[] = { 0.8f, 0.2f, 0.25f, 1 }, spe[] = { 1, 1, 1, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, shin);
    glutSolidSphere(1.7, 48, 48);
    glutSwapBuffers();
}

`, `// ${C("TODO: keyboard(): '+' — shin += 8 (128 dan oşmasin), '-' — shin −= 8 (0 dan kam emas);", "TODO: keyboard(): '+' — shin += 8 (не больше 128), '-' — shin −= 8 (не меньше 0);")}
// ${C("qiymatni printf bilan çiqaring, glutPostRedisplay(); main() da qayd qiling", "выводите значение printf, glutPostRedisplay(); зарегистрируйте в main()")}
void keyboard(unsigned char key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    if (key == '+' && shin < 128) shin += 8;
    if (key == '-' && shin > 0)   shin -= 8;
    printf("shininess = %.0f\\n", shin);
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A8: porlash", "    glutKeyboardFunc(keyboard);\n"));

  /* ---------- 8. Masofa — susayiş ---------- */
  var t8 = S(HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(6, 3, 6,  0, 0, -3,  0, 1, 0);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    GLfloat pos[] = { 0, 0, 3, 1 }, white[] = { 1, 1, 1, 1 };
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, white);
`, `    // ${C("TODO: susayiş: kd(d) = 1 / (kc + kl·d + kq·d²); kc = 1, kl = 0,05, kq = 0,04", "TODO: ослабление: kd(d) = 1 / (kc + kl·d + kq·d²); kc = 1, kl = 0,05, kq = 0,04")}
    // ${C("(GL_CONSTANT_ATTENUATION, GL_LINEAR_ATTENUATION, GL_QUADRATIC_ATTENUATION)", "(GL_CONSTANT_ATTENUATION, GL_LINEAR_ATTENUATION, GL_QUADRATIC_ATTENUATION)")}
`, `    glLightf(GL_LIGHT0, GL_CONSTANT_ATTENUATION, 1.0f);
    glLightf(GL_LIGHT0, GL_LINEAR_ATTENUATION, 0.05f);
    glLightf(GL_LIGHT0, GL_QUADRATIC_ATTENUATION, 0.04f);
`, `    GLfloat dif[] = { 0.9f, 0.8f, 0.6f, 1 };
    glMaterialfv(GL_FRONT, GL_DIFFUSE, dif);
    // ${C("Manbadan 3, 7 va 11 birlik uzoqlikdagi şarlar", "Шары на расстоянии 3, 7 и 11 от источника")}
    for (int k = 0; k < 3; k++) {
        glPushMatrix();
        glTranslatef(0, 0, -4.0f * k);
        glutSolidSphere(1.0, 32, 32);
        glPopMatrix();
    }
    // ${C("Manba belgisi", "Метка источника")}
    glDisable(GL_LIGHTING);
    glPointSize(10.0f);
    glColor3f(1, 0.9f, 0.3f);
    glBegin(GL_POINTS); glVertex3f(0, 0, 3); glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A8: susayish"));

  LAB.define({
    n: 8,
    title: { uz: "OpenGL yordamida geometrik obyektlarga materiallar va yoruğlik beriş", ru: "Материалы и источники света в OpenGL" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: yoritilgan şar", ru: "Пример: освещённый шар" },
        text: { uz: "<p>Yoritişli sahna uçun uç narsa kerak: <b>manba</b> (<code>glLightfv</code> — pozitsiya, rang), <b>material</b> (<code>glMaterialfv</code> — sirt nurni qanday qaytaradi) va <b>normallar</b> (<code>glutSolidSphere</code> ularni özi beradi). Diffuz rang (0,8; 0,2; 0,2) — qizil, közgu rang oq, yaltiroqlik 60.</p>",
                ru: "<p>Для освещённой сцены нужны три вещи: <b>источник</b> (<code>glLightfv</code> — позиция, цвет), <b>материал</b> (<code>glMaterialfv</code> — как поверхность отражает свет) и <b>нормали</b> (<code>glutSolidSphere</code> задаёт их сам). Диффузный цвет (0,8; 0,2; 0,2) — красный, зеркальный — белый, блеск 60.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Oddiy yoruğlik", ru: "Задание 1. Простое освещение" },
        text: { uz: "<p>Hozir sfera yoritişsiz — tekis kulrang doira. Yoritişni yoqing va oq nuqtaviy manba qöşing: pozitsiya (5, 5, 5, 1), diffuse = (1, 1, 1, 1). Pozitsiyaning 4-komponenti 1 — manba fazodagi nuqtada.</p>",
                ru: "<p>Сейчас сфера без освещения — плоский серый круг. Включите освещение и добавьте белый точечный источник: позиция (5, 5, 5, 1), diffuse = (1, 1, 1, 1). Четвёртая компонента позиции 1 — источник в точке пространства.</p>" },
        hint: { uz: "glEnable(GL_LIGHTING); glEnable(GL_LIGHT0); glLightfv(GL_LIGHT0, GL_POSITION, pos); glLightfv(GL_LIGHT0, GL_DIFFUSE, white);", ru: "glEnable(GL_LIGHTING); glEnable(GL_LIGHT0); glLightfv(GL_LIGHT0, GL_POSITION, pos); glLightfv(GL_LIGHT0, GL_DIFFUSE, white);" },
        check: { type: "both", source: [{ re: "GL_LIGHTING", msg: { uz: "glEnable(GL_LIGHTING) ni çaqiring", ru: "Вызовите glEnable(GL_LIGHTING)" } }] }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Rangli material", ru: "Задание 2. Цветной материал" },
        text: { uz: "<p>Şar uçun oltinrang material yarating: ambient (0,2; 0,15; 0,05), diffuse (0,9; 0,7; 0,1), specular (1; 1; 0,8), shininess 50. Ambient — soyadagi rang, diffuse — asosiy rang, specular — yaltiroq dog' rangi.</p>",
                ru: "<p>Создайте для шара золотистый материал: ambient (0,2; 0,15; 0,05), diffuse (0,9; 0,7; 0,1), specular (1; 1; 0,8), shininess 50. Ambient — цвет в тени, diffuse — основной цвет, specular — цвет блика.</p>" },
        hint: { uz: "Uçta glMaterialfv (GL_AMBIENT, GL_DIFFUSE, GL_SPECULAR) va glMaterialf(GL_FRONT, GL_SHININESS, 50).", ru: "Три вызова glMaterialfv (GL_AMBIENT, GL_DIFFUSE, GL_SPECULAR) и glMaterialf(GL_FRONT, GL_SHININESS, 50)." },
        check: { type: "both", calls: { "glMaterialfv": ">=3" } }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Yönaltirilgan manba (quyoş)", ru: "Задание 3. Направленный источник (солнце)" },
        text: { uz: "<p>Quyoş — cheksiz uzoqdagi manba: uning nurlari parallel. Nurlar (−1, −1, −1) yönalişda tuşsin. OpenGL da <code>GL_POSITION</code> ga <b>manbaga qaragan</b> vektor va w = 0 beriladi: (1, 1, 1, 0). Uçta sfera bir xil yoritiladi — nuqtaviy manbadagidek farq yöq.</p>",
                ru: "<p>Солнце — бесконечно удалённый источник: его лучи параллельны. Пусть лучи идут в направлении (−1, −1, −1). В OpenGL в <code>GL_POSITION</code> задаётся вектор <b>на источник</b> и w = 0: (1, 1, 1, 0). Три сферы освещены одинаково — в отличие от точечного источника.</p>" },
        hint: { uz: "GLfloat dir[] = {1, 1, 1, 0}; glLightfv(GL_LIGHT0, GL_POSITION, dir);", ru: "GLfloat dir[] = {1, 1, 1, 0}; glLightfv(GL_LIGHT0, GL_POSITION, dir);" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Spot (projektor)", ru: "Задание 4. Прожектор" },
        text: { uz: "<p>Manbani projektorga aylantiring: yönaliş (0, −1, 0) — pastga, konus yarim burçagi 30°, markazdan çetga susayiş darajasi 10. Pol va qizil sfera faqat yoruğlik konusi içida yoritiladi. Pol mayda katakçalarga bölingan — yoritiş uçlarda hisoblanadi.</p>",
                ru: "<p>Превратите источник в прожектор: направление (0, −1, 0) — вниз, половина угла конуса 30°, показатель ослабления к краю 10. Пол и красная сфера освещены только внутри конуса. Пол разбит на мелкие клетки — освещение считается в вершинах.</p>" },
        hint: { uz: "glLightfv(GL_LIGHT0, GL_SPOT_DIRECTION, sdir); glLightf(GL_LIGHT0, GL_SPOT_CUTOFF, 30); glLightf(GL_LIGHT0, GL_SPOT_EXPONENT, 10);", ru: "glLightfv(GL_LIGHT0, GL_SPOT_DIRECTION, sdir); glLightf(GL_LIGHT0, GL_SPOT_CUTOFF, 30); glLightf(GL_LIGHT0, GL_SPOT_EXPONENT, 10);" },
        check: { type: "both", source: [{ re: "GL_SPOT_CUTOFF", msg: { uz: "GL_SPOT_CUTOFF ni bering", ru: "Задайте GL_SPOT_CUTOFF" } }] }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Ikki manba", ru: "Задание 5. Два источника" },
        text: { uz: "<p>Sahnaga ikki manba qöşing: çapdan qizil (GL_LIGHT0, (−6, 1, 2)) va öngdan kök (GL_LIGHT1, (6, 1, 2)). Oq sferaning old qismida ranglar qöşilib binafşa rang hosil böladi — OpenGL barça manbalar hissasini yiğadi.</p>",
                ru: "<p>Добавьте два источника: слева красный (GL_LIGHT0, (−6, 1, 2)) и справа синий (GL_LIGHT1, (6, 1, 2)). На передней части белой сферы цвета складываются в фиолетовый — OpenGL суммирует вклады всех источников.</p>" },
        hint: { uz: "Har bir manba uçun: glEnable(GL_LIGHTi); GL_POSITION; GL_DIFFUSE; GL_SPECULAR.", ru: "Для каждого источника: glEnable(GL_LIGHTi); GL_POSITION; GL_DIFFUSE; GL_SPECULAR." },
        check: { type: "both", source: [{ re: "GL_LIGHT1", msg: { uz: "Ikkinçi manba GL_LIGHT1 kerak", ru: "Нужен второй источник GL_LIGHT1" } }] }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Kub normallari", ru: "Задание 6. Нормали куба" },
        text: { uz: "<p>Kub qölda <code>GL_QUADS</code> bilan çizilgan, lekin normallarsiz — barça yoqlar bir xil yoritiladi va kub tekis dog'ga aylanadi. Har bir yoq oldidan uning taşqi normalini <code>glNormal3f</code> bilan bering: +Z, −Z, +X, −X, +Y, −Y. Endi uçta körinadigan yoq turli yorqinlikda.</p>",
                ru: "<p>Куб нарисован вручную <code>GL_QUADS</code>, но без нормалей — все грани освещены одинаково, и куб превращается в плоское пятно. Перед каждой гранью задайте её внешнюю нормаль <code>glNormal3f</code>: +Z, −Z, +X, −X, +Y, −Y. Теперь три видимые грани разной яркости.</p>" },
        hint: { uz: "Yoqlar tartibi kodda: +Z, −Z, +X, −X, +Y, −Y.", ru: "Порядок граней в коде: +Z, −Z, +X, −X, +Y, −Y." },
        check: { type: "both", calls: { "glNormal3f": ">=6" } }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Jonli porlaş", ru: "Задание 7. Живой блеск" },
        text: { uz: "<p>Yaltiroqlik (<code>GL_SHININESS</code>) ni klaviatura bilan özgartiring: <b>+</b> — 8 ga oşiradi (128 gaça), <b>−</b> — kamaytiradi (0 gaça). Qiymatni konsolga çiqaring. Kuzating: n oşgan sari yaltiroq dog' torayadi va keskinlaşadi — sirt «silliqroq» körinadi.</p>",
                ru: "<p>Меняйте блеск (<code>GL_SHININESS</code>) с клавиатуры: <b>+</b> увеличивает на 8 (до 128), <b>−</b> уменьшает (до 0). Выводите значение в консоль. Наблюдайте: с ростом n блик сужается и становится резче — поверхность выглядит «глаже».</p>" },
        hint: { uz: "if (key == '+' && shin < 128) shin += 8; if (key == '-' && shin > 0) shin −= 8;", ru: "if (key == '+' && shin < 128) shin += 8; if (key == '-' && shin > 0) shin −= 8;" },
        check: { type: "both", source: [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "shin\\s*\\+=", msg: { uz: "'+' tugmasida shin ni oşiring", ru: "По клавише '+' увеличивайте shin" } }] }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Masofa böyiça susayiş", ru: "Задание 8. Ослабление с расстоянием" },
        text: { uz: "<p>Real nuqtaviy manba yoruğligi masofa bilan kamayadi. Susayiş koeffitsiyentlarini bering: k = 1 / (1 + 0,05·d + 0,04·d²). Manbadan 3, 7 va 11 birlik uzoqlikdagi uçta şar — uzoqdagisi xiraroq. Koeffitsiyentlarni özgartirib, natijani hisobotda taqqoslang.</p>",
                ru: "<p>Свет реального точечного источника ослабевает с расстоянием. Задайте коэффициенты ослабления: k = 1 / (1 + 0,05·d + 0,04·d²). Три шара на расстояниях 3, 7 и 11 от источника — дальний тусклее. Поменяйте коэффициенты и сравните результаты в отчёте.</p>" },
        hint: { uz: "glLightf(GL_LIGHT0, GL_CONSTANT_ATTENUATION, 1); … GL_LINEAR_ATTENUATION, 0.05; … GL_QUADRATIC_ATTENUATION, 0.04;", ru: "glLightf(GL_LIGHT0, GL_CONSTANT_ATTENUATION, 1); … GL_LINEAR_ATTENUATION, 0.05; … GL_QUADRATIC_ATTENUATION, 0.04;" },
        check: { type: "both", calls: { "glLightf": ">=2" } }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
