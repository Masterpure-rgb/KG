/* A12. Maşina detallari dizayni: ekstruziya, aylanma sirtlar, tişli ğildiraklar, prujina, podşipnik (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n#define PI 3.14159265f\n\n";
  var LIGHT = `// ${C("Metall: kulrang diffuz rang va oq yaltiroqlik", "Металл: серый диффузный цвет и белый блик")}
void initGL() {
    GLfloat pos[] = { 4, 6, 5, 1 }, w[] = { 1, 1, 1, 1 }, amb[] = { 0.18f, 0.18f, 0.22f, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, pos);
    glLightfv(GL_LIGHT0, GL_SPECULAR, w);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT, GL_AMBIENT_AND_DIFFUSE);
    GLfloat spe[] = { 0.7f, 0.7f, 0.7f, 1 };
    glMaterialfv(GL_FRONT, GL_SPECULAR, spe);
    glMaterialf(GL_FRONT, GL_SHININESS, 50);
    glEnable(GL_NORMALIZE);
    glEnable(GL_DEPTH_TEST);
}
float now() { return glutGet(GLUT_ELAPSED_TIME) / 1000.0f; }

`;
  var PRISM = `// ${C("Muntazam n-burçakli prizma (ekstruziya): radius r, balandlik h, Oy öqi böylab", "Правильная n-угольная призма (экструзия): радиус r, высота h, вдоль оси Oy")}
void prism(int n, float r, float h) {
    glBegin(GL_QUADS);                          // ${C("yon yoqlar", "боковые грани")}
    for (int i = 0; i < n; i++) {
        float a0 = 2 * PI * i / n, a1 = 2 * PI * (i + 1) / n, am = (a0 + a1) / 2;
        glNormal3f(cos(am), 0, sin(am));        // ${C("yoq normali — örta burçak yönalişida", "нормаль грани — по среднему углу")}
        glVertex3f(r * cos(a0), 0, r * sin(a0));
        glVertex3f(r * cos(a0), h, r * sin(a0));
        glVertex3f(r * cos(a1), h, r * sin(a1));
        glVertex3f(r * cos(a1), 0, r * sin(a1));
    }
    glEnd();
    for (int s = 0; s < 2; s++) {               // ${C("pastki va ustki asoslar", "нижнее и верхнее основания")}
        glNormal3f(0, s ? 1 : -1, 0);
        glBegin(GL_TRIANGLE_FAN);
        glVertex3f(0, s * h, 0);
        for (int i = 0; i <= n; i++) {
            float a = 2 * PI * (s ? n - i : i) / n;
            glVertex3f(r * cos(a), s * h, r * sin(a));
        }
        glEnd();
    }
}

`;
  var CYL_BODY = `    glBegin(GL_QUAD_STRIP);
    for (int i = 0; i <= n; i++) {
        float a = 2 * PI * i / n;
        glNormal3f(cos(a), 0, sin(a));
        glVertex3f(r * cos(a), h, r * sin(a));
        glVertex3f(r * cos(a), 0, r * sin(a));
    }
    glEnd();
    for (int s = 0; s < 2; s++) {
        glNormal3f(0, s ? 1 : -1, 0);
        glBegin(GL_TRIANGLE_FAN);
        glVertex3f(0, s * h, 0);
        for (int i = 0; i <= n; i++) {
            float a = 2 * PI * (s ? n - i : i) / n;
            glVertex3f(r * cos(a), s * h, r * sin(a));
        }
        glEnd();
    }
`;
  var CYL = `// ${C("Silindr: n segment, yon sirt normallari uçlarda (silliq)", "Цилиндр: n сегментов, нормали боковой поверхности в вершинах (гладко)")}
void cylinder(float r, float h, int n) {
` + CYL_BODY + `}

`;
  var LATHE = `// ${C("Aylanma sirt (tokarlik dastgohi): profil (R[i], Y[i]) Oy atrofida aylantiriladi", "Поверхность вращения («токарный станок»): профиль (R[i], Y[i]) вращается вокруг Oy")}
void lathe(float R[], float Y[], int m, int n) {
    for (int i = 0; i + 1 < m; i++) {
        float dr = R[i + 1] - R[i], dy = Y[i + 1] - Y[i];
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= n; j++) {
            float a = 2 * PI * j / n, c = cos(a), s = sin(a);
            glNormal3f(dy * c, -dr, dy * s);    // ${C("profil urinmasiga perpendikulyar", "перпендикуляр к касательной профиля")}
            glVertex3f(R[i + 1] * c, Y[i + 1], R[i + 1] * s);
            glVertex3f(R[i] * c, Y[i], R[i] * s);
        }
        glEnd();
    }
}

`;
  var GEAR = `// ${C("Tişli ğildirak: n tiş, ički radius r0, taşqi r1, qalinligi w; kontur yulduzsimon — markazdan yelpiğ bilan yopiladi", "Шестерня: n зубьев, внутренний радиус r0, внешний r1, толщина w; контур звёздный — закрывается веером из центра")}
void gear(int n, float r0, float r1, float w) {
    int m = 4 * n;
    float X[400], Z[400];
    for (int i = 0; i < n; i++) {
        float a = 2 * PI * i / n, d = 2 * PI / n / 4;
        X[4*i] = r0 * cos(a);           Z[4*i] = r0 * sin(a);
        X[4*i+1] = r1 * cos(a + d);     Z[4*i+1] = r1 * sin(a + d);
        X[4*i+2] = r1 * cos(a + 2 * d); Z[4*i+2] = r1 * sin(a + 2 * d);
        X[4*i+3] = r0 * cos(a + 3 * d); Z[4*i+3] = r0 * sin(a + 3 * d);
    }
    glBegin(GL_QUADS);
    for (int k = 0; k < m; k++) {
        int l = (k + 1) % m;
        glNormal3f(Z[l] - Z[k], 0, -(X[l] - X[k]));
        glVertex3f(X[k], -w / 2, Z[k]); glVertex3f(X[l], -w / 2, Z[l]);
        glVertex3f(X[l],  w / 2, Z[l]); glVertex3f(X[k],  w / 2, Z[k]);
    }
    glEnd();
    for (int s = 0; s < 2; s++) {
        float y = s ? w / 2 : -w / 2;
        glNormal3f(0, s ? 1 : -1, 0);
        glBegin(GL_TRIANGLE_FAN);
        glVertex3f(0, y, 0);
        for (int k = 0; k <= m; k++) { int q = s ? (m - k) % m : k % m; glVertex3f(X[q], y, Z[q]); }
        glEnd();
    }
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(40.0, (double)w / h, 0.3, 100.0);
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
  function VIEW(y, d, cy) { return `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, ${y}, ${d},  0, ${cy}, 0,  0, 1, 0);
`; }

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT + PRISM + `void display() {
` + VIEW(3, 6, 0.6) + `    glRotatef(20 * now(), 0, 1, 0);
    glColor3f(0.7f, 0.72f, 0.78f);
    prism(6, 1.3f, 1.2f);                      // ${C("oltiburçakli prizma — gayka kabi", "шестигранная призма — как гайка")}
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: prizma");

  /* ---------- 1. Silindr ---------- */
  var t1 = S(HEAD + LIGHT + `// ${C("Silindr: n segment, yon sirt normallari uçlarda (silliq)", "Цилиндр: n сегментов, нормали боковой поверхности в вершинах (гладко)")}
void cylinder(float r, float h, int n) {
`, `    // ${C("TODO 1: yon sirt — GL_QUAD_STRIP: har bir a = 2π·i/n uçun normal (cos a, 0, sin a) va ikki uç (y = h va y = 0)", "TODO 1: боковая поверхность — GL_QUAD_STRIP: для каждого a = 2π·i/n нормаль (cos a, 0, sin a) и две вершины (y = h и y = 0)")}
    // ${C("TODO 2: pastki va ustki asoslar — GL_TRIANGLE_FAN, normallar (0, ∓1, 0)", "TODO 2: нижнее и верхнее основания — GL_TRIANGLE_FAN, нормали (0, ∓1, 0)")}
`, CYL_BODY, `}

void display() {
` + VIEW(2.5, 6, 0.8) + `    glColor3f(0.7f, 0.72f, 0.78f);
    glRotatef(-25, 0, 1, 0);
    cylinder(1.0f, 2.0f, 32);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: silindr"));

  /* ---------- 2. Konus ---------- */
  var t2 = S(HEAD + LIGHT + `// ${C("Konus: asos radiusi r, balandlik h, ustki radius 0", "Конус: радиус основания r, высота h, верхний радиус 0")}
void cone(float r, float h, int n) {
    float k = r / h;          // ${C("yon sirt normali: (cos a, r/h, sin a) — yuqoriga oğgan", "нормаль боковой поверхности: (cos a, r/h, sin a) — наклонена вверх")}
`, `    // ${C("TODO: silindrdagidek GL_QUAD_STRIP, lekin ustki uç — (0, h, 0), normal (cos a, k, sin a); keyin pastki asos", "TODO: как у цилиндра GL_QUAD_STRIP, но верхняя вершина — (0, h, 0), нормаль (cos a, k, sin a); затем нижнее основание")}
`, `    glBegin(GL_QUAD_STRIP);
    for (int i = 0; i <= n; i++) {
        float a = 2 * PI * i / n;
        glNormal3f(cos(a), k, sin(a));
        glVertex3f(0, h, 0);                   // ${C("ustki radius 0 — barça uçlar bir nuqtada", "верхний радиус 0 — все вершины в одной точке")}
        glVertex3f(r * cos(a), 0, r * sin(a));
    }
    glEnd();
    glNormal3f(0, -1, 0);
    glBegin(GL_TRIANGLE_FAN);
    glVertex3f(0, 0, 0);
    for (int i = 0; i <= n; i++) { float a = 2 * PI * i / n; glVertex3f(r * cos(a), 0, r * sin(a)); }
    glEnd();
`, `}

void display() {
` + VIEW(2.5, 6, 0.8) + `    glColor3f(0.85f, 0.6f, 0.35f);
    cone(1.2f, 2.2f, 40);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: konus"));

  /* ---------- 3. Çaşka ---------- */
  var t3 = S(HEAD + LIGHT + `// ${C("Çaşka profili: taglikdan boşlab taşqi devor, labi va ički devor", "Профиль чашки: от дна — внешняя стенка, край и внутренняя стенка")}
float PR[9] = { 0.0f, 0.7f, 0.8f, 1.05f, 1.2f, 1.1f, 0.95f, 0.65f, 0.0f };
float PY[9] = { 0.0f, 0.0f, 0.15f, 0.8f, 1.6f, 1.6f, 0.85f, 0.25f, 0.25f };

void lathe(float R[], float Y[], int m, int n) {
    for (int i = 0; i + 1 < m; i++) {
        float dr = R[i + 1] - R[i], dy = Y[i + 1] - Y[i];
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= n; j++) {
            float a = 2 * PI * j / n, c = cos(a), s = sin(a);
`, `            // ${C("TODO: normal (dy·cos a, −dr, dy·sin a) va ikki uç: (R[i+1]·cos a, Y[i+1], R[i+1]·sin a), (R[i]·cos a, Y[i], R[i]·sin a)", "TODO: нормаль (dy·cos a, −dr, dy·sin a) и две вершины: (R[i+1]·cos a, Y[i+1], R[i+1]·sin a), (R[i]·cos a, Y[i], R[i]·sin a)")}
`, `            glNormal3f(dy * c, -dr, dy * s);
            glVertex3f(R[i + 1] * c, Y[i + 1], R[i + 1] * s);
            glVertex3f(R[i] * c, Y[i], R[i] * s);
`, `        }
        glEnd();
    }
}

void display() {
` + VIEW(3, 5.5, 0.6) + `    glColor3f(0.9f, 0.9f, 0.95f);
    lathe(PR, PY, 9, 48);
    // ${C("Dasta — tor bölagi", "Ручка — часть тора")}
    glPushMatrix();
    glTranslatef(1.25f, 0.85f, 0);
    glScalef(1, 1.2f, 1);
    glutSolidTorus(0.08, 0.38, 12, 24);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: çaşka"));

  /* ---------- 4. Tişli ğildirak ---------- */
  var t4 = S(HEAD + LIGHT + `void gear(int n, float r0, float r1, float w) {
    int m = 4 * n;
    float X[400], Z[400];
    for (int i = 0; i < n; i++) {
        float a = 2 * PI * i / n, d = 2 * PI / n / 4;
`, `        // ${C("TODO: har bir tiş — 4 ta kontur nuqtasi: (r0, a), (r1, a + d), (r1, a + 2d), (r0, a + 3d)", "TODO: каждый зуб — 4 точки контура: (r0, a), (r1, a + d), (r1, a + 2d), (r0, a + 3d)")}
        // ${C("X[4i + k] = radius·cos(burçak), Z[4i + k] = radius·sin(burçak)", "X[4i + k] = радиус·cos(угол), Z[4i + k] = радиус·sin(угол)")}
        for (int k = 0; k < 4; k++) { X[4*i+k] = r0 * cos(a + k * d); Z[4*i+k] = r0 * sin(a + k * d); }
`, `        X[4*i] = r0 * cos(a);           Z[4*i] = r0 * sin(a);
        X[4*i+1] = r1 * cos(a + d);     Z[4*i+1] = r1 * sin(a + d);
        X[4*i+2] = r1 * cos(a + 2 * d); Z[4*i+2] = r1 * sin(a + 2 * d);
        X[4*i+3] = r0 * cos(a + 3 * d); Z[4*i+3] = r0 * sin(a + 3 * d);
`, `    }
    glBegin(GL_QUADS);
    for (int k = 0; k < m; k++) {
        int l = (k + 1) % m;
        glNormal3f(Z[l] - Z[k], 0, -(X[l] - X[k]));
        glVertex3f(X[k], -w / 2, Z[k]); glVertex3f(X[l], -w / 2, Z[l]);
        glVertex3f(X[l],  w / 2, Z[l]); glVertex3f(X[k],  w / 2, Z[k]);
    }
    glEnd();
    for (int s = 0; s < 2; s++) {
        float y = s ? w / 2 : -w / 2;
        glNormal3f(0, s ? 1 : -1, 0);
        glBegin(GL_TRIANGLE_FAN);
        glVertex3f(0, y, 0);
        for (int k = 0; k <= m; k++) { int q = s ? (m - k) % m : k % m; glVertex3f(X[q], y, Z[q]); }
        glEnd();
    }
}

void display() {
` + VIEW(4, 4, 0) + `    glRotatef(30 * now(), 0, 1, 0);            // ${C("aylaniş animatsiyasi", "анимация вращения")}
    glColor3f(0.75f, 0.7f, 0.5f);
    gear(12, 1.3f, 1.7f, 0.5f);
    glColor3f(0.4f, 0.42f, 0.48f);
    glPushMatrix(); glTranslatef(0, -0.6f, 0); glScalef(0.3f, 1.2f, 0.3f); glutSolidCube(1.0); glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: tişli ğildirak"));

  /* ---------- 5. Ikki tişli ---------- */
  var t5 = S(HEAD + LIGHT + GEAR + `void display() {
` + VIEW(5, 5, 0) + `    float t = now();
    int n1 = 12, n2 = 24;
    float r1 = 1.0f, r2 = 2.0f;               // ${C("boşlanğiç aylana radiuslari (tişlar soniga mutanosib)", "радиусы начальных окружностей (пропорциональны числу зубьев)")}
    float w1 = 60;                            // ${C("birinçi ğildirak tezligi, °/s", "скорость первого колеса, °/с")}
`, `    // ${C("TODO: ikkinçi ğildirak tezligi n1·ω1 = n2·ω2 dan, teskari yönalişda: w2 = −w1·n1/n2;", "TODO: скорость второго колеса из n1·ω1 = n2·ω2, в обратную сторону: w2 = −w1·n1/n2;")}
    // ${C("tişlar bir-biriga kirişi uçun ikkinçisini yarim tişga (180/n2 °) burib qöying", "чтобы зубья вошли друг в друга, поверните второе на ползуба (180/n2 °)")}
    float w2 = w1, phase = 0;
`, `    float w2 = -w1 * n1 / n2;                 // ${C("çiziqli tezliklar ilaşiş nuqtasida teng", "линейные скорости в точке зацепления равны")}
    float phase = 180.0f / n2;
`, `    glPushMatrix();
    glTranslatef(-r1 - 0.05f, 0, 0);
    glRotatef(w1 * t, 0, 1, 0);
    glColor3f(0.8f, 0.65f, 0.35f);
    gear(n1, r1 - 0.2f, r1 + 0.2f, 0.4f);
    glPopMatrix();
    glPushMatrix();
    glTranslatef(r2 + 0.05f, 0, 0);
    glRotatef(w2 * t + phase, 0, 1, 0);
    glColor3f(0.6f, 0.65f, 0.75f);
    gear(n2, r2 - 0.2f, r2 + 0.2f, 0.4f);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: ikki tişli"));

  /* ---------- 6. Vint ---------- */
  var t6 = S(HEAD + LIGHT + PRISM + CYL + `void display() {
` + VIEW(2.2, 6.5, 0) + `    glRotatef(-60, 0, 0, 1);                   // ${C("vintni yotqizib körsatamiz", "кладём болт набок")}
    glRotatef(15 * now(), 0, 1, 0);
    glColor3f(0.72f, 0.74f, 0.8f);
    glTranslatef(0, -1.6f, 0);
`, `    // ${C("TODO 1: kallak — oltiburçakli prizma prism(6, 0,8, 0,6) y = 2,4 da (glTranslatef bilan)", "TODO 1: головка — шестигранная призма prism(6, 0,8, 0,6) на y = 2,4 (через glTranslatef)")}
    // ${C("TODO 2: özak — cylinder(0,4, 2,4, 32); rezba — 10 ta halqa glutSolidTorus(0,06, 0,42, 8, 24), har 0,22 da", "TODO 2: стержень — cylinder(0,4, 2,4, 32); резьба — 10 колец glutSolidTorus(0,06, 0,42, 8, 24) через 0,22")}
    // ${C("(tor XY tekisligida yotadi — uni Ox atrofida 90° ga buring)", "(тор лежит в плоскости XY — поверните его на 90° вокруг Ox)")}
`, `    glPushMatrix(); glTranslatef(0, 2.4f, 0); prism(6, 0.8f, 0.6f); glPopMatrix();   // ${C("kallak", "головка")}
    cylinder(0.4f, 2.4f, 32);                                                        // ${C("özak", "стержень")}
    for (int k = 0; k < 10; k++) {                                                    // ${C("rezba", "резьба")}
        glPushMatrix();
        glTranslatef(0, 0.15f + 0.22f * k, 0);
        glRotatef(90, 1, 0, 0);
        glutSolidTorus(0.06, 0.42, 8, 24);
        glPopMatrix();
    }
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: vint"));

  /* ---------- 7. Prujina ---------- */
  var t7 = S(HEAD + LIGHT + `// ${C("Prujina: radius R, sim radiusi r, N = 10 örama, qadam p = 0,5", "Пружина: радиус R, радиус проволоки r, N = 10 витков, шаг p = 0,5")}
const float R = 1.0f, r = 0.12f, p = 0.5f;
const int N = 10, SEG = 24, RING = 10;

// ${C("Vint çiziği nuqtasi va kesim aylanasi: θ — örama burçagi, φ — kesim burçagi", "Точка винтовой линии и окружность сечения: θ — угол витка, φ — угол сечения")}
void springVertex(float th, float ph) {
`, `    // ${C("TODO: radial yönaliş (cos θ, 0, sin θ); markaz C = (R·cos θ, p·θ/2π, R·sin θ);", "TODO: радиальное направление (cos θ, 0, sin θ); центр C = (R·cos θ, p·θ/2π, R·sin θ);")}
    // ${C("normal n = cos φ·radial + sin φ·(0, 1, 0); uç = C + r·n; glNormal3f(n), glVertex3f(uç)", "нормаль n = cos φ·radial + sin φ·(0, 1, 0); вершина = C + r·n; glNormal3f(n), glVertex3f(вершина)")}
    glVertex3f(R * cos(th), p * th / (2 * PI), R * sin(th));
`, `    float cx = cos(th), cz = sin(th);
    float nx = cos(ph) * cx, ny = sin(ph), nz = cos(ph) * cz;
    glNormal3f(nx, ny, nz);
    glVertex3f(R * cx + r * nx, p * th / (2 * PI) + r * ny, R * cz + r * nz);
`, `}

void display() {
` + VIEW(2.5, 7.5, 2.5) + `    glColor3f(0.75f, 0.78f, 0.85f);
    glRotatef(20 * now(), 0, 1, 0);
    // ${C("Sim — trubka: θ böyiça qadamlar, har qadamda kesim aylanasi (GL_QUAD_STRIP)", "Проволока — трубка: шаги по θ, на каждом шаге окружность сечения (GL_QUAD_STRIP)")}
    for (int i = 0; i < N * SEG; i++) {
        float t0 = 2 * PI * i / SEG, t1 = 2 * PI * (i + 1) / SEG;
        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= RING; j++) {
            float ph = 2 * PI * j / RING;
            springVertex(t0, ph);
            springVertex(t1, ph);
        }
        glEnd();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: prujina"));

  /* ---------- 8. Podşipnik ---------- */
  var t8 = S(HEAD + LIGHT + LATHE + `// ${C("Halqa profili (kesim — törtburçak): ički radius a, taşqi b, qalinlik h", "Профиль кольца (сечение — прямоугольник): внутренний радиус a, внешний b, толщина h")}
void ring(float a, float b, float h) {
    float R[5] = { a, b, b, a, a }, Y[5] = { -h / 2, -h / 2, h / 2, h / 2, -h / 2 };
    lathe(R, Y, 5, 64);
}

void display() {
` + VIEW(4.5, 4.5, 0) + `    float t = now();
    glColor3f(0.6f, 0.63f, 0.7f);
    ring(2.0f, 2.4f, 0.5f);                    // ${C("taşqi halqa — qözğalmas", "внешнее кольцо — неподвижно")}
    glPushMatrix();
    glRotatef(90 * t, 0, 1, 0);
    glColor3f(0.7f, 0.72f, 0.78f);
    ring(0.9f, 1.3f, 0.5f);                    // ${C("ički halqa — val bilan aylanadi", "внутреннее кольцо — вращается с валом")}
    glPopMatrix();
`, `    // ${C("TODO: 8 ta şar (radius 0,33) radiusi 1,65 bölgan aylanada, k·45° burçakda; separator 35°/s tezlikda aylanadi;", "TODO: 8 шаров (радиус 0,33) на окружности радиуса 1,65 под углами k·45°; сепаратор вращается со скоростью 35°/с;")}
    // ${C("har bir şar özi ham aylanadi (glRotatef(−200·t, 0, 1, 0)) — glutSolidSphere(0,33, 20, 16)", "каждый шар ещё вращается сам (glRotatef(−200·t, 0, 1, 0)) — glutSolidSphere(0,33, 20, 16)")}
`, `    glColor3f(0.9f, 0.85f, 0.6f);
    for (int k = 0; k < 8; k++) {
        glPushMatrix();
        glRotatef(35 * t + 45 * k, 0, 1, 0);   // ${C("separator", "сепаратор")}
        glTranslatef(1.65f, 0, 0);
        glRotatef(-200 * t, 0, 1, 0);          // ${C("şarning öz aylanişi", "собственное вращение шара")}
        glutSolidSphere(0.33, 20, 16);
        glPopMatrix();
    }
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A12: podşipnik"));

  LAB.define({
    n: 12,
    title: { uz: "Maşina detallari dizaynini yaratiş", ru: "Моделирование деталей машин" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: ekstruziya — oltiburçakli prizma", ru: "Пример: экструзия — шестигранная призма" },
        text: { uz: "<p>Köp maşina detallari ikki usulda quriladi: <b>ekstruziya</b> (tekis konturni balandlik böylab «çöziş») va <b>aylanma sirt</b> (profilni öq atrofida aylantiriş). Misolda oltiburçak kontur ekstruziya qilingan: yon yoqlar <code>GL_QUADS</code>, asoslar <code>GL_TRIANGLE_FAN</code>; har bir yoqning öz normali bor.</p>",
                ru: "<p>Многие детали машин строятся двумя способами: <b>экструзией</b> (вытягиванием плоского контура в высоту) и <b>поверхностью вращения</b> (вращением профиля вокруг оси). В примере шестиугольный контур вытянут: боковые грани — <code>GL_QUADS</code>, основания — <code>GL_TRIANGLE_FAN</code>; у каждой грани своя нормаль.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Oddiy silindr", ru: "Задание 1. Простой цилиндр" },
        text: { uz: "<p><code>glutSolidCylinder</code> siz silindr quring: r = 1, h = 2, 32 segment. Yon sirt — <code>GL_QUAD_STRIP</code>, normal har bir <b>uçda</b> (cos a, 0, sin a) — şunda sirt silliq körinadi. Asoslar — <code>GL_TRIANGLE_FAN</code>; ustki asos uçlarini teskari tartibda bering, şunda u taşqariga qaraydi.</p>",
                ru: "<p>Постройте цилиндр без <code>glutSolidCylinder</code>: r = 1, h = 2, 32 сегмента. Боковая поверхность — <code>GL_QUAD_STRIP</code>, нормаль в каждой <b>вершине</b> (cos a, 0, sin a) — тогда поверхность выглядит гладкой. Основания — <code>GL_TRIANGLE_FAN</code>; вершины верхнего задайте в обратном порядке, чтобы оно смотрело наружу.</p>" },
        hint: { uz: "for i ≤ n: a = 2π·i/n; glNormal3f(cos a, 0, sin a); glVertex3f(r·cos a, h, r·sin a); glVertex3f(r·cos a, 0, r·sin a);", ru: "for i ≤ n: a = 2π·i/n; glNormal3f(cos a, 0, sin a); glVertex3f(r·cos a, h, r·sin a); glVertex3f(r·cos a, 0, r·sin a);" },
        check: { type: "both", calls: { "glutSolidCylinder": 0 } }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Konus", ru: "Задание 2. Конус" },
        text: { uz: "<p>Silindr kodini özgartirib konus quring: ustki radius 0 — barça ustki uçlar (0, h, 0) nuqtaga tuşadi. Yon sirt normali endi gorizontal emas: (cos a, r/h, sin a) — u konus yuzasiga perpendikulyar.</p>",
                ru: "<p>Измените код цилиндра и постройте конус: верхний радиус 0 — все верхние вершины совпадают в точке (0, h, 0). Нормаль боковой поверхности теперь не горизонтальна: (cos a, r/h, sin a) — перпендикулярно поверхности конуса.</p>" },
        hint: { uz: "glNormal3f(cos a, k, sin a); glVertex3f(0, h, 0); glVertex3f(r·cos a, 0, r·sin a);", ru: "glNormal3f(cos a, k, sin a); glVertex3f(0, h, 0); glVertex3f(r·cos a, 0, r·sin a);" },
        check: { type: "both", calls: { "glutSolidCone": 0 } }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Çaşka — aylanma sirt", ru: "Задание 3. Чашка — поверхность вращения" },
        text: { uz: "<p>Universal <code>lathe</code> funksiyasini yozing: profilning har bir kesmasi (Rᵢ, Yᵢ) → (Rᵢ₊₁, Yᵢ₊₁) Oy atrofida aylanib <code>GL_QUAD_STRIP</code> halqasini beradi. Normal — profil urinmasiga perpendikulyar: (dy·cos a, −dr, dy·sin a). Profil çaşkaning taşqi devori, labi va ički devoridan iborat.</p>",
                ru: "<p>Напишите универсальную функцию <code>lathe</code>: каждый отрезок профиля (Rᵢ, Yᵢ) → (Rᵢ₊₁, Yᵢ₊₁) при вращении вокруг Oy даёт кольцо <code>GL_QUAD_STRIP</code>. Нормаль перпендикулярна касательной профиля: (dy·cos a, −dr, dy·sin a). Профиль — внешняя стенка, край и внутренняя стенка чашки.</p>" },
        hint: { uz: "glNormal3f(dy·c, −dr, dy·s); glVertex3f(R[i+1]·c, Y[i+1], R[i+1]·s); glVertex3f(R[i]·c, Y[i], R[i]·s);", ru: "glNormal3f(dy·c, −dr, dy·s); glVertex3f(R[i+1]·c, Y[i+1], R[i+1]·s); glVertex3f(R[i]·c, Y[i], R[i]·s);" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Tişli ğildirak", ru: "Задание 4. Шестерня" },
        text: { uz: "<p>n = 12 tişli ğildirak konturini tuzing: har bir tiş 2π/n burçakli sektorda 4 ta nuqta — ički radiusda, taşqi radiusda (ikki marta) va yana ički radiusda. Kontur ekstruziya qilinadi (yon yoqlar) va asoslar markazdan yelpiğ bilan yopiladi. Ğildirak sekundiga 30° aylanadi.</p>",
                ru: "<p>Постройте контур шестерни с n = 12 зубьями: каждый зуб в секторе 2π/n — 4 точки: на внутреннем радиусе, на внешнем (дважды) и снова на внутреннем. Контур вытягивается (боковые грани), основания закрываются веером из центра. Колесо вращается на 30° в секунду.</p>" },
        hint: { uz: "X[4i] = r0·cos a; X[4i+1] = r1·cos(a + d); X[4i+2] = r1·cos(a + 2d); X[4i+3] = r0·cos(a + 3d); Z — sin bilan.", ru: "X[4i] = r0·cos a; X[4i+1] = r1·cos(a + d); X[4i+2] = r1·cos(a + 2d); X[4i+3] = r0·cos(a + 3d); Z — через sin." },
        check: { type: "image" }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Ilaşgan ikki tişli ğildirak", ru: "Задание 5. Две зацепленные шестерни" },
        text: { uz: "<p>12 va 24 tişli ğildiraklar bir-birini aylantiradi. Ilaşiş nuqtasida çiziqli tezliklar teng, şuning uçun n₁ω₁ = n₂ω₂: kattasi ikki marta sekin va teskari yönalişda aylanadi. Tişlar bir-biriga kirişi uçun ikkinçi ğildirakni yarim tişga (180°/n₂) burib qöying.</p>",
                ru: "<p>Шестерни с 12 и 24 зубьями вращают друг друга. В точке зацепления линейные скорости равны, поэтому n₁ω₁ = n₂ω₂: большая вращается вдвое медленнее и в обратную сторону. Чтобы зубья вошли друг в друга, поверните второе колесо на ползуба (180°/n₂).</p>" },
        hint: { uz: "w2 = −w1·n1/n2 = −30 °/s; phase = 180/n2 = 7,5°.", ru: "w2 = −w1·n1/n2 = −30 °/с; phase = 180/n2 = 7,5°." },
        time: 1500, check: { type: "image" }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Vint", ru: "Задание 6. Болт" },
        text: { uz: "<p>Vintni tayyor «ğişt»lardan yiğing: oltiburçakli kallak (<code>prism</code>), silindrsimon özak (<code>cylinder</code>) va rezba — özak böylab har 0,22 da joylaşgan 10 ta ingiçka halqa (<code>glutSolidTorus</code>). Murakkab detal — oddiy primitivlar va almaştirişlar kombinatsiyasi.</p>",
                ru: "<p>Соберите болт из готовых «кирпичиков»: шестигранная головка (<code>prism</code>), цилиндрический стержень (<code>cylinder</code>) и резьба — 10 тонких колец (<code>glutSolidTorus</code>) через каждые 0,22 вдоль стержня. Сложная деталь — комбинация простых примитивов и преобразований.</p>" },
        hint: { uz: "Push; Translate(0, 2,4, 0); prism(6, 0,8, 0,6); Pop; cylinder(0,4, 2,4, 32); for k: Push; Translate(0, 0,15 + 0,22k, 0); Rotate(90, 1, 0, 0); Torus; Pop.", ru: "Push; Translate(0, 2,4, 0); prism(6, 0,8, 0,6); Pop; cylinder(0,4, 2,4, 32); for k: Push; Translate(0, 0,15 + 0,22k, 0); Rotate(90, 1, 0, 0); Torus; Pop." },
        check: { type: "both", calls: { "glutSolidTorus": ">=10" } }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Prujina", ru: "Задание 7. Пружина" },
        text: { uz: "<p>Spiral prujina — vint çiziği böylab «surilgan» aylana (trubka): N = 10 örama, qadam p = 0,5. Vint çiziği markazi C(θ) = (R·cos θ, p·θ/2π, R·sin θ); kesim aylanasi radial yönaliş va Oy öqi tekisligida yotadi. Har bir uçda normal — kesim aylanasining radiusi.</p>",
                ru: "<p>Пружина — окружность, «протянутая» вдоль винтовой линии (трубка): N = 10 витков, шаг p = 0,5. Центр винтовой линии C(θ) = (R·cos θ, p·θ/2π, R·sin θ); окружность сечения лежит в плоскости радиального направления и оси Oy. В каждой вершине нормаль — радиус окружности сечения.</p>" },
        hint: { uz: "n = (cos φ·cos θ, sin φ, cos φ·sin θ); uç = C + r·n.", ru: "n = (cos φ·cos θ, sin φ, cos φ·sin θ); вершина = C + r·n." },
        check: { type: "image" }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Podşipnik", ru: "Задание 8. Подшипник" },
        text: { uz: "<p>Podşipnik: qözğalmas taşqi halqa, val bilan aylanadigan ički halqa va ular orasida 8 ta şar. Şarlar separator bilan birga 35°/s tezlikda aylanadi va har biri özi ham aylanadi. Ierarxik almaştirişlar: separator burilişi → radius böyiça siljiş → şarning öz burilişi.</p>",
                ru: "<p>Подшипник: неподвижное внешнее кольцо, вращающееся с валом внутреннее кольцо и 8 шаров между ними. Шары вместе с сепаратором вращаются со скоростью 35°/с, и каждый ещё вращается сам. Иерархия преобразований: поворот сепаратора → сдвиг по радиусу → собственный поворот шара.</p>" },
        hint: { uz: "for k: Push; Rotate(35t + 45k, 0, 1, 0); Translate(1,65, 0, 0); Rotate(−200t, 0, 1, 0); Sphere(0,33); Pop.", ru: "for k: Push; Rotate(35t + 45k, 0, 1, 0); Translate(1,65, 0, 0); Rotate(−200t, 0, 1, 0); Sphere(0,33); Pop." },
        check: { type: "both", calls: { "glutSolidSphere": ">=8" } }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
