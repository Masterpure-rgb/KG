/* A13. Binolar dizaynini modellaştiriş: uy, tom, qavatlar, teksturalar, şahar, soyalar, kamera (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include \"stb_image.h\"\n#include <cmath>\n#include <cstdio>\n#include <cstdlib>\n\n";
  var LIGHT = `// ${C("Quyoş: yönaltirilgan manba; rang glColor dan", "Солнце: направленный источник; цвет из glColor")}
float SUN[4] = { 0.9f, 1.0f, 0.6f, 0 };
void initGL() {
    GLfloat amb[] = { 0.35f, 0.35f, 0.4f, 1 };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE);
    glEnable(GL_NORMALIZE);
    glEnable(GL_DEPTH_TEST);
}
void setSun() { glLightfv(GL_LIGHT0, GL_POSITION, SUN); }   // ${C("kamera qurilgandan keyin çaqiriladi", "вызывается после установки камеры")}

`;
  var BOX = `// ${C("Quti [x0; x1] × [y0; y1] × [z0; z1]: 6 yoq, normallar va tekstura koordinatalari (u, v — metrlarda × ts)", "Коробка [x0; x1] × [y0; y1] × [z0; z1]: 6 граней, нормали и текстурные координаты (u, v — в метрах × ts)")}
void box(float x0, float x1, float y0, float y1, float z0, float z1, float ts) {
    glBegin(GL_QUADS);
    glNormal3f(0, 0, 1);  glTexCoord2f(0, 0); glVertex3f(x0, y0, z1); glTexCoord2f((x1-x0)*ts, 0); glVertex3f(x1, y0, z1); glTexCoord2f((x1-x0)*ts, (y1-y0)*ts); glVertex3f(x1, y1, z1); glTexCoord2f(0, (y1-y0)*ts); glVertex3f(x0, y1, z1);
    glNormal3f(0, 0, -1); glTexCoord2f(0, 0); glVertex3f(x1, y0, z0); glTexCoord2f((x1-x0)*ts, 0); glVertex3f(x0, y0, z0); glTexCoord2f((x1-x0)*ts, (y1-y0)*ts); glVertex3f(x0, y1, z0); glTexCoord2f(0, (y1-y0)*ts); glVertex3f(x1, y1, z0);
    glNormal3f(1, 0, 0);  glTexCoord2f(0, 0); glVertex3f(x1, y0, z1); glTexCoord2f((z1-z0)*ts, 0); glVertex3f(x1, y0, z0); glTexCoord2f((z1-z0)*ts, (y1-y0)*ts); glVertex3f(x1, y1, z0); glTexCoord2f(0, (y1-y0)*ts); glVertex3f(x1, y1, z1);
    glNormal3f(-1, 0, 0); glTexCoord2f(0, 0); glVertex3f(x0, y0, z0); glTexCoord2f((z1-z0)*ts, 0); glVertex3f(x0, y0, z1); glTexCoord2f((z1-z0)*ts, (y1-y0)*ts); glVertex3f(x0, y1, z1); glTexCoord2f(0, (y1-y0)*ts); glVertex3f(x0, y1, z0);
    glNormal3f(0, 1, 0);  glVertex3f(x0, y1, z1); glVertex3f(x1, y1, z1); glVertex3f(x1, y1, z0); glVertex3f(x0, y1, z0);
    glNormal3f(0, -1, 0); glVertex3f(x0, y0, z0); glVertex3f(x1, y0, z0); glVertex3f(x1, y0, z1); glVertex3f(x0, y0, z1);
    glEnd();
}
// ${C("Old devorga (z = z0) yopişgan törtburçak — eşik yoki deraza", "Прямоугольник на передней стене (z = z0) — дверь или окно")}
void panel(float x0, float x1, float y0, float y1, float z) {
    glNormal3f(0, 0, 1);
    glBegin(GL_QUADS);
    glVertex3f(x0, y0, z + 0.01f); glVertex3f(x1, y0, z + 0.01f); glVertex3f(x1, y1, z + 0.01f); glVertex3f(x0, y1, z + 0.01f);
    glEnd();
}

`;
  var WINTEX = `// ${C("Protsedura teksturasi: 32×32 katakça — ramka (beton) va oyna (köm-kök, yarmi yoritilgan)", "Процедурная текстура: ячейка 32×32 — рама (бетон) и стекло (тёмно-синее, половина окон светится)")}
unsigned char win[64 * 64 * 3];
GLuint winTex;
void makeWindowTexture() {
    for (int y = 0; y < 64; y++)
        for (int x = 0; x < 64; x++) {
            int k = (y * 64 + x) * 3, cx = x % 32, cy = y % 32;
            int glass = cx >= 6 && cx < 26 && cy >= 8 && cy < 28;
            int lit = ((x / 32) + (y / 32)) % 2;
            if (!glass) { win[k] = 190; win[k + 1] = 180; win[k + 2] = 165; }
            else if (lit) { win[k] = 255; win[k + 1] = 220; win[k + 2] = 140; }
            else { win[k] = 40; win[k + 1] = 70; win[k + 2] = 120; }
        }
    glGenTextures(1, &winTex);
    glBindTexture(GL_TEXTURE_2D, winTex);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 64, 64, 0, GL_RGB, GL_UNSIGNED_BYTE, win);
}

`;
  var LOADTEX = `// ${C("Fayldan tekstura (stbi_load) — mip-darajalar bilan", "Текстура из файла (stbi_load) — с мип-уровнями")}
GLuint loadTexture(const char* file) {
    int w, h, n;
    stbi_set_flip_vertically_on_load(1);
    unsigned char* data = stbi_load(file, &w, &h, &n, 3);
    GLuint id;
    glGenTextures(1, &id);
    glBindTexture(GL_TEXTURE_2D, id);
    gluBuild2DMipmaps(GL_TEXTURE_2D, GL_RGB, w, h, GL_RGB, GL_UNSIGNED_BYTE, data);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    stbi_image_free(data);
    return id;
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.3, 300.0);
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
    glClearColor(0.55f, 0.72f, 0.9f, 1.0f);       // ${C("osmon", "небо")}
    initGL();
${extra || ""}    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutMainLoop();
    return 0;
}
`;
  }
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }
  function CAM(ex, ey, ez, cx, cy, cz) { return `    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(${ex}, ${ey}, ${ez},  ${cx}, ${cy}, ${cz},  0, 1, 0);
    setSun();
`; }
  var GROUND = `// ${C("Oddiy yer — yaşil tekislik", "Простая земля — зелёная плоскость")}
void ground(float s) {
    glColor3f(0.35f, 0.55f, 0.3f);
    glNormal3f(0, 1, 0);
    glBegin(GL_QUADS);
    glVertex3f(-s, 0, s); glVertex3f(s, 0, s); glVertex3f(s, 0, -s); glVertex3f(-s, 0, -s);
    glEnd();
}

`;
  var HOUSE = `    glColor3f(0.9f, 0.82f, 0.68f);  box(-2, 2, 0, 2.5f, -1.5f, 1.5f, 0);       // ${C("devorlar", "стены")}
    glColor3f(0.45f, 0.3f, 0.2f);   panel(-0.4f, 0.4f, 0, 1.6f, 1.5f);           // ${C("eşik", "дверь")}
    glColor3f(0.55f, 0.75f, 0.95f); panel(-1.6f, -0.8f, 1.1f, 1.9f, 1.5f);       // ${C("derazalar", "окна")}
                                    panel(0.8f, 1.6f, 1.1f, 1.9f, 1.5f);
`;

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT + BOX + GROUND + `void display() {
` + CAM(5, 3, 8, 0, 1.5, 0) + `    ground(20);
    // ${C("Bino — quti va derazalar qatori", "Здание — коробка и ряды окон")}
    glColor3f(0.8f, 0.78f, 0.75f);
    box(-1.5f, 1.5f, 0, 4, -1.5f, 1.5f, 0);
    glColor3f(0.3f, 0.45f, 0.7f);
    for (int f = 0; f < 3; f++)
        for (int w = 0; w < 3; w++)
            panel(-1.2f + w, -0.6f + w, 0.6f + 1.2f * f, 1.4f + 1.2f * f, 1.5f);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: bino");

  /* ---------- 1. Oddiy uy ---------- */
  var t1 = S(HEAD + LIGHT + BOX + GROUND + `void display() {
` + CAM(5, 3, 8, 0, 1.2, 0) + `    ground(20);
`, `    // ${C("TODO: devorlar — box(−2, 2, 0, 2,5, −1,5, 1,5, 0) och sariq; tekis tom — box(−2,2; 2,2; 2,5; 2,7; −1,7; 1,7, 0) kulrang;", "TODO: стены — box(−2, 2, 0, 2,5, −1,5, 1,5, 0) светло-жёлтые; плоская крыша — box(−2,2; 2,2; 2,5; 2,7; −1,7; 1,7, 0) серая;")}
    // ${C("eşik panel(−0,4; 0,4; 0; 1,6; 1,5) jigarrang; ikki deraza panel(−1,6; −0,8; 1,1; 1,9; 1,5) va panel(0,8; 1,6; 1,1; 1,9; 1,5) havorang", "дверь panel(−0,4; 0,4; 0; 1,6; 1,5) коричневая; два окна panel(−1,6; −0,8; 1,1; 1,9; 1,5) и panel(0,8; 1,6; 1,1; 1,9; 1,5) голубые")}
`, HOUSE + `    glColor3f(0.5f, 0.5f, 0.55f);   box(-2.2f, 2.2f, 2.5f, 2.7f, -1.7f, 1.7f, 0); // ${C("tekis tom", "плоская крыша")}
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: oddiy uy"));

  /* ---------- 2. Qiyma tom ---------- */
  var t2 = S(HEAD + LIGHT + BOX + GROUND + `// ${C("Ikki qiyalikli tom: tizma (y = 4) Ox böylab, çetlari devordan 0,2 ga çiqib turadi", "Двускатная крыша: конёк (y = 4) вдоль Ox, края выступают за стены на 0,2")}
void roof() {
    float x0 = -2.2f, x1 = 2.2f, z0 = -1.7f, z1 = 1.7f, y0 = 2.5f, y1 = 4.0f;
    glColor3f(0.7f, 0.3f, 0.25f);
`, `    // ${C("TODO 1: ikki qiya yoq (GL_QUADS): old (z1 → 0) va orqa (z0 → 0); normal — yoqqa perpendikulyar:", "TODO 1: два ската (GL_QUADS): передний (z1 → 0) и задний (z0 → 0); нормаль перпендикулярна скату:")}
    // ${C("old yoq uçun (0, z1, y1 − y0), orqa uçun (0, −z0... ) — ya'ni (0, 1,7, 1,5) va (0, 1,7, −1,5)", "для переднего (0, z1, y1 − y0), для заднего — т. е. (0, 1,7, 1,5) и (0, 1,7, −1,5)")}
    // ${C("TODO 2: ikki uçburçakli peştoq (GL_TRIANGLES) x = −2 va x = 2 da, normallar (∓1, 0, 0)", "TODO 2: два треугольных фронтона (GL_TRIANGLES) на x = −2 и x = 2, нормали (∓1, 0, 0)")}
`, `    glBegin(GL_QUADS);
    glNormal3f(0, z1, y1 - y0);                       // ${C("old qiyalik", "передний скат")}
    glVertex3f(x0, y0, z1); glVertex3f(x1, y0, z1); glVertex3f(x1, y1, 0); glVertex3f(x0, y1, 0);
    glNormal3f(0, z1, -(y1 - y0));                    // ${C("orqa qiyalik", "задний скат")}
    glVertex3f(x1, y0, z0); glVertex3f(x0, y0, z0); glVertex3f(x0, y1, 0); glVertex3f(x1, y1, 0);
    glEnd();
    glColor3f(0.9f, 0.82f, 0.68f);
    glBegin(GL_TRIANGLES);
    glNormal3f(1, 0, 0);  glVertex3f(2, y0, 1.5f);  glVertex3f(2, y0, -1.5f); glVertex3f(2, y1, 0);
    glNormal3f(-1, 0, 0); glVertex3f(-2, y0, -1.5f); glVertex3f(-2, y0, 1.5f); glVertex3f(-2, y1, 0);
    glEnd();
`, `}

void display() {
` + CAM(5.5, 3.5, 8, 0, 1.6, 0) + `    ground(20);
` + HOUSE + `    roof();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: qiyma tom"));

  /* ---------- 3. Köp qavatli bino ---------- */
  var t3 = S(HEAD + LIGHT + BOX + GROUND + `void display() {
` + CAM(7, 5, 13, 0, 4, 0) + `    ground(30);
    glColor3f(0.78f, 0.76f, 0.72f);
    box(-2.5f, 2.5f, 0, 9, -2, 2, 0);          // ${C("5 qavat × 1,8 m", "5 этажей × 1,8 м")}
    glColor3f(0.3f, 0.45f, 0.7f);
`, `    // ${C("TODO: 5 qavat × 4 deraza old devorda (z = 2): qavat f, deraza w:", "TODO: 5 этажей × 4 окна на передней стене (z = 2): этаж f, окно w:")}
    // ${C("panel(−2,2 + 1,15w; −1,4 + 1,15w; 0,5 + 1,8f; 1,4 + 1,8f; 2)", "panel(−2,2 + 1,15w; −1,4 + 1,15w; 0,5 + 1,8f; 1,4 + 1,8f; 2)")}
`, `    for (int f = 0; f < 5; f++)
        for (int w = 0; w < 4; w++)
            panel(-2.2f + 1.15f * w, -1.4f + 1.15f * w, 0.5f + 1.8f * f, 1.4f + 1.8f * f, 2);
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: qavatlar"));

  /* ---------- 4. Deraza teksturasi ---------- */
  var t4 = S(HEAD + LIGHT + BOX + GROUND + `// ${C("Protsedura teksturasi: 32×32 katakça — ramka (beton) va oyna", "Процедурная текстура: ячейка 32×32 — рама (бетон) и стекло")}
unsigned char win[64 * 64 * 3];
GLuint winTex;
void makeWindowTexture() {
    for (int y = 0; y < 64; y++)
        for (int x = 0; x < 64; x++) {
            int k = (y * 64 + x) * 3, cx = x % 32, cy = y % 32;
`, `            // ${C("TODO: oyna — 6 ≤ cx < 26 va 8 ≤ cy < 28; oyna rangi: ((x/32)+(y/32)) juft bölsa (40,70,120), toq — (255,220,140);", "TODO: стекло — 6 ≤ cx < 26 и 8 ≤ cy < 28; цвет стекла: если ((x/32)+(y/32)) чётно — (40,70,120), нечётно — (255,220,140);")}
            // ${C("ramka — (190,180,165)", "рама — (190,180,165)")}
            win[k] = 190; win[k + 1] = 180; win[k + 2] = 165;
`, `            int glass = cx >= 6 && cx < 26 && cy >= 8 && cy < 28;
            int lit = ((x / 32) + (y / 32)) % 2;
            if (!glass) { win[k] = 190; win[k + 1] = 180; win[k + 2] = 165; }
            else if (lit) { win[k] = 255; win[k + 1] = 220; win[k + 2] = 140; }
            else { win[k] = 40; win[k + 1] = 70; win[k + 2] = 120; }
`, `        }
    glGenTextures(1, &winTex);
    glBindTexture(GL_TEXTURE_2D, winTex);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);       // ${C("tekstura takrorlanadi", "текстура повторяется")}
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 64, 64, 0, GL_RGB, GL_UNSIGNED_BYTE, win);
}

void display() {
` + CAM(7, 5, 13, 0, 4, 0) + `    ground(30);
    glEnable(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, winTex);
    glColor3f(1, 1, 1);
    box(-3.6f, 3.6f, 0, 9, -2, 2, 0.278f);     // ${C("1 katakça = 1,8 m: ts = 0,5/1,8 → 4 × 5 deraza", "1 ячейка = 1,8 м: ts = 0,5/1,8 → 4 × 5 окон")}
    glDisable(GL_TEXTURE_2D);
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: deraza teksturasi", "    makeWindowTexture();\n"));

  /* ---------- 5. Şahar ---------- */
  var CITY = `float BH[5][5];
float BC[5][5][3];
void makeCity() {
    srand(21);
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) {
            BH[i][j] = 3.6f + (rand() % 8) * 1.8f;              // ${C("2..9 qavat", "2..9 этажей")}
            for (int c = 0; c < 3; c++) BC[i][j][c] = 0.7f + (rand() % 30) / 100.0f;
        }
}
`;
  var CITY_DRAW = `void city() {
    glEnable(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, winTex);
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) {
            float x = -12 + 6 * i, z = -12 + 6 * j;
            glColor3fv(BC[i][j]);
            box(x - 2, x + 2, 0, BH[i][j], z - 2, z + 2, 0.278f);
        }
    glDisable(GL_TEXTURE_2D);
}
`;
  var t5 = S(HEAD + LIGHT + BOX + GROUND + WINTEX + `float BH[5][5];
float BC[5][5][3];
void makeCity() {
    srand(21);
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) {
            BH[i][j] = 3.6f + (rand() % 8) * 1.8f;              // ${C("2..9 qavat", "2..9 этажей")}
            for (int c = 0; c < 3; c++) BC[i][j][c] = 0.7f + (rand() % 30) / 100.0f;
        }
}
void city() {
    glEnable(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, winTex);
`, `    // ${C("TODO: 5×5 bino: markazi (−12 + 6i; −12 + 6j), asosi 4×4, balandligi BH[i][j], rangi BC[i][j] (glColor3fv)", "TODO: 5×5 зданий: центр (−12 + 6i; −12 + 6j), основание 4×4, высота BH[i][j], цвет BC[i][j] (glColor3fv)")}
`, `    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) {
            float x = -12 + 6 * i, z = -12 + 6 * j;
            glColor3fv(BC[i][j]);
            box(x - 2, x + 2, 0, BH[i][j], z - 2, z + 2, 0.278f);
        }
`, `    glDisable(GL_TEXTURE_2D);
}

void display() {
` + CAM(26, 22, 34, 0, 2, 0) + `    ground(60);
    city();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: shahar", "    makeWindowTexture();\n    makeCity();\n"));

  /* ---------- 6. Yer teksturasi ---------- */
  var t6 = S(HEAD + LIGHT + BOX + WINTEX + LOADTEX + CITY + CITY_DRAW + `GLuint grassTex;

// ${C("Katta yer tekisligi: tekstura 60 marta takrorlanadi", "Большая плоскость земли: текстура повторяется 60 раз")}
void ground(float s) {
`, `    // ${C("TODO: GL_TEXTURE_2D ni yoqing, grassTex ni bog'lang, oq rang; GL_QUADS uçlariga tekstura koordinatalari 0 va 60", "TODO: включите GL_TEXTURE_2D, привяжите grassTex, белый цвет; вершинам GL_QUADS дайте текстурные координаты 0 и 60")}
    glColor3f(0.35f, 0.55f, 0.3f);
    glNormal3f(0, 1, 0);
    glBegin(GL_QUADS);
    glVertex3f(-s, 0, s); glVertex3f(s, 0, s); glVertex3f(s, 0, -s); glVertex3f(-s, 0, -s);
    glEnd();
`, `    glEnable(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, grassTex);
    glColor3f(1, 1, 1);
    glNormal3f(0, 1, 0);
    glBegin(GL_QUADS);
    glTexCoord2f(0, 0);   glVertex3f(-s, 0, s);
    glTexCoord2f(60, 0);  glVertex3f(s, 0, s);
    glTexCoord2f(60, 60); glVertex3f(s, 0, -s);
    glTexCoord2f(0, 60);  glVertex3f(-s, 0, -s);
    glEnd();
    glDisable(GL_TEXTURE_2D);
`, `}

void display() {
` + CAM(26, 22, 34, 0, 2, 0) + `    ground(60);
    city();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: yer", "    makeWindowTexture();\n    makeCity();\n    grassTex = loadTexture(\"grass.png\");\n"));

  /* ---------- 7. Soyalar ---------- */
  var t7 = S(HEAD + LIGHT + BOX + GROUND + WINTEX + CITY + CITY_DRAW + `// ${C("Tekis proyeksion soya: nuqta yorug'lik yönalişi L böyiça y = 0 tekisligiga «bosiladi»", "Плоская проекционная тень: точка «придавливается» к плоскости y = 0 вдоль направления света L")}
void shadowMatrix(float M[16]) {
    float lx = SUN[0], ly = SUN[1], lz = SUN[2];
    for (int i = 0; i < 16; i++) M[i] = 0;
`, `    // ${C("TODO: x' = x − (lx/ly)·y, y' = 0, z' = z − (lz/ly)·y (ustunlar böyiça: M[0], M[4], M[8], M[10], M[15])", "TODO: x' = x − (lx/ly)·y, y' = 0, z' = z − (lz/ly)·y (по столбцам: M[0], M[4], M[8], M[10], M[15])")}
    M[0] = M[5] = M[10] = M[15] = 1;
`, `    M[0] = 1;            // x' = x
    M[4] = -lx / ly;     //      − (lx/ly)·y
    M[10] = 1;           // z' = z
    M[6] = -lz / ly;     //      − (lz/ly)·y
    M[15] = 1;           // ${C("y' = 0: ikkinçi qator nol", "y' = 0: вторая строка нулевая")}
`, `}

void display() {
` + CAM(26, 22, 34, 0, 2, 0) + `    ground(60);
    // ${C("Soyalar: yoritişsiz, qora-yaşil, yer ustida 0,02 balandlikda", "Тени: без освещения, тёмно-зелёные, на высоте 0,02 над землёй")}
    float M[16];
    shadowMatrix(M);
    glDisable(GL_LIGHTING);
    glColor3f(0.2f, 0.32f, 0.18f);
    glPushMatrix();
    glTranslatef(0, 0.02f, 0);
    glMultMatrixf(M);
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) { float x = -12 + 6 * i, z = -12 + 6 * j; box(x - 2, x + 2, 0, BH[i][j], z - 2, z + 2, 0); }
    glPopMatrix();
    glEnable(GL_LIGHTING);
    city();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A13: soyalar", "    makeWindowTexture();\n    makeCity();\n"));

  /* ---------- 8. Yurgan kamera ---------- */
  var t8 = S(HEAD + LIGHT + BOX + GROUND + WINTEX + CITY + CITY_DRAW + `float cx = 3, cz = 27, yaw = -0.12f;      // ${C("kamera: joy va buriliş", "камера: позиция и поворот")}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(cx, 1.7, cz,  cx + sin(yaw), 1.7, cz - cos(yaw),  0, 1, 0);
    setSun();
    ground(60);
    city();
    glutSwapBuffers();
}

`, `// ${C("TODO: W/S — oldinga/orqaga 0,5 (sin yaw, −cos yaw), A/D — yonga (cos yaw, sin yaw), ←/→ — yaw ∓0,08", "TODO: W/S — вперёд/назад на 0,5 (sin yaw, −cos yaw), A/D — вбок (cos yaw, sin yaw), ←/→ — yaw ∓0,08")}
void keyboard(unsigned char key, int x, int y) { }
void special(int key, int x, int y) { }
`, `void keyboard(unsigned char key, int x, int y) {
    float fx = sin(yaw), fz = -cos(yaw), rx = cos(yaw), rz = sin(yaw);
    if (key == 'w') { cx += 0.5f * fx; cz += 0.5f * fz; }
    if (key == 's') { cx -= 0.5f * fx; cz -= 0.5f * fz; }
    if (key == 'd') { cx += 0.5f * rx; cz += 0.5f * rz; }
    if (key == 'a') { cx -= 0.5f * rx; cz -= 0.5f * rz; }
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  yaw -= 0.08f;
    if (key == GLUT_KEY_RIGHT) yaw += 0.08f;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A13: kamera", "    makeWindowTexture();\n    makeCity();\n    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  LAB.define({
    n: 13,
    title: { uz: "Binolar dizaynini modellaştiriş", ru: "Моделирование зданий" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: bino — quti va derazalar", ru: "Пример: здание — коробка и окна" },
        text: { uz: "<p>Arxitektura modellari oddiy bloklardan yiğiladi. <code>box(x0, x1, y0, y1, z0, z1, ts)</code> — normallari va tekstura koordinatalari bilan quti; <code>panel</code> — old devorga 1 sm oldinda yopişgan törtburçak (deraza, eşik): şunda u devor bilan bir xil çuqurlikda «titramaydi» (z-fighting yöq).</p>",
                ru: "<p>Архитектурные модели собираются из простых блоков. <code>box(x0, x1, y0, y1, z0, z1, ts)</code> — коробка с нормалями и текстурными координатами; <code>panel</code> — прямоугольник на 1 см перед передней стеной (окно, дверь): так он не «мерцает» на одной глубине со стеной (нет z-fighting).</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Oddiy uy", ru: "Задание 1. Простой дом" },
        text: { uz: "<p>Oddiy uy quring: 4 ta devor (bitta <code>box</code>), tekis tom (devordan 0,2 ga çiqib turgan yupqa quti), eşik va 2 ta deraza (<code>panel</code>). Ölçamlar va ranglar kod izohida berilgan.</p>",
                ru: "<p>Постройте простой дом: 4 стены (одна <code>box</code>), плоская крыша (тонкая коробка, выступающая за стены на 0,2), дверь и 2 окна (<code>panel</code>). Размеры и цвета — в комментарии к коду.</p>" },
        hint: { uz: "glColor3f(0,9; 0,82; 0,68); box(−2, 2, 0, 2,5, −1,5, 1,5, 0); … glColor3f(0,5; 0,5; 0,55); box(−2,2; 2,2; 2,5; 2,7; −1,7; 1,7; 0);", ru: "glColor3f(0,9; 0,82; 0,68); box(−2, 2, 0, 2,5, −1,5, 1,5, 0); … glColor3f(0,5; 0,5; 0,55); box(−2,2; 2,2; 2,5; 2,7; −1,7; 1,7; 0);" },
        check: { type: "image" }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Ikki qiyalikli tom", ru: "Задание 2. Двускатная крыша" },
        text: { uz: "<p>Uyga ikki qiyalikli tom qöşing: tizma Ox böylab y = 4 da. Har bir qiya yoq — törtburçak, normali yoqqa perpendikulyar (old qiyalik uçun (0; 1,7; 1,5)). Yon tomonlar — uçburçakli peştoqlar devor rangida. Normallar töğri bölsa, ikki qiyalik turliça yoritiladi.</p>",
                ru: "<p>Добавьте дому двускатную крышу: конёк вдоль Ox на y = 4. Каждый скат — четырёхугольник, нормаль перпендикулярна скату (для переднего (0; 1,7; 1,5)). По бокам — треугольные фронтоны цвета стен. При правильных нормалях скаты освещены по-разному.</p>" },
        hint: { uz: "Old qiyalik uçlari: (x0, y0, z1), (x1, y0, z1), (x1, y1, 0), (x0, y1, 0).", ru: "Вершины переднего ската: (x0, y0, z1), (x1, y0, z1), (x1, y1, 0), (x0, y1, 0)." },
        check: { type: "image" }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Köp qavatli bino", ru: "Задание 3. Многоэтажное здание" },
        text: { uz: "<p>5 qavatli binoning old devorida har qavatda 4 ta deraza bölsin. Qavat balandligi 1,8 m: f-qavat derazasi y = 0,5 + 1,8f dan 1,4 + 1,8f gaça, w-deraza x = −2,2 + 1,15w dan boşlanadi. Ikki ički sikl — «deraza matritsasi».</p>",
                ru: "<p>На передней стене 5-этажного здания — по 4 окна на этаже. Высота этажа 1,8 м: окно f-го этажа от y = 0,5 + 1,8f до 1,4 + 1,8f, w-е окно начинается с x = −2,2 + 1,15w. Два вложенных цикла — «матрица окон».</p>" },
        hint: { uz: "for f < 5: for w < 4: panel(−2,2 + 1,15w, −1,4 + 1,15w, 0,5 + 1,8f, 1,4 + 1,8f, 2);", ru: "for f < 5: for w < 4: panel(−2,2 + 1,15w, −1,4 + 1,15w, 0,5 + 1,8f, 1,4 + 1,8f, 2);" },
        check: { type: "both", calls: { "glBegin": ">=22" } }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Deraza teksturasi", ru: "Задание 4. Текстура окон" },
        text: { uz: "<p>Har bir derazani alohida çizmasdan, uni <b>tekstura</b> qilib qöyamiz. 64×64 protsedura teksturasini yarating: 32×32 katakça — beton ramka va oyna; qöşni oynalar navbat bilan yorug' va qorong'i. <code>GL_REPEAT</code> tufayli tekstura butun devor böylab takrorlanadi — 4 ta yoq bitta <code>box</code> çaqirig'i bilan.</p>",
                ru: "<p>Вместо того чтобы рисовать каждое окно отдельно, наложим их <b>текстурой</b>. Создайте процедурную текстуру 64×64: ячейка 32×32 — бетонная рама и стекло; соседние окна поочерёдно светлые и тёмные. Благодаря <code>GL_REPEAT</code> текстура повторяется по всей стене — 4 грани одним вызовом <code>box</code>.</p>" },
        hint: { uz: "glass = cx ≥ 6 && cx < 26 && cy ≥ 8 && cy < 28; lit = ((x/32) + (y/32)) % 2;", ru: "glass = cx ≥ 6 && cx < 26 && cy ≥ 8 && cy < 28; lit = ((x/32) + (y/32)) % 2;" },
        check: { type: "image" }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Şahar matritsasi", ru: "Задание 5. Матрица города" },
        text: { uz: "<p>5×5 kvartal: 25 ta bino turli balandlik (2..9 qavat) va rangda; balandlik va rang <code>srand(21)</code> bilan tasodifiy, lekin har gal bir xil. Binolar orasidagi masofa 6 m, asosi 4×4 m. Deraza teksturasi barça binolarga bir xil masştabda tuşadi (ts = 0,278).</p>",
                ru: "<p>Квартал 5×5: 25 зданий разной высоты (2..9 этажей) и цвета; высота и цвет случайны с <code>srand(21)</code>, но каждый раз одинаковы. Шаг между зданиями 6 м, основание 4×4 м. Текстура окон ложится на все здания в одном масштабе (ts = 0,278).</p>" },
        hint: { uz: "x = −12 + 6i, z = −12 + 6j; glColor3fv(BC[i][j]); box(x − 2, x + 2, 0, BH[i][j], z − 2, z + 2, 0.278f);", ru: "x = −12 + 6i, z = −12 + 6j; glColor3fv(BC[i][j]); box(x − 2, x + 2, 0, BH[i][j], z − 2, z + 2, 0.278f);" },
        check: { type: "image" }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Yer", ru: "Задание 6. Земля" },
        text: { uz: "<p>Şahar ostidagi yerni <code>grass.png</code> teksturasi bilan qoplang. Tekstura 120×120 m maydonga 60 marta takrorlanadi (tekstura koordinatalari 0..60, <code>GL_REPEAT</code>). Uzoqdagi joylarda mip-darajalar (<code>gluBuild2DMipmaps</code>) tekstura «çaqnaşini» yöqotadi.</p>",
                ru: "<p>Покройте землю под городом текстурой <code>grass.png</code>. Текстура повторяется 60 раз на площади 120×120 м (текстурные координаты 0..60, <code>GL_REPEAT</code>). Вдали мип-уровни (<code>gluBuild2DMipmaps</code>) убирают «мерцание» текстуры.</p>" },
        hint: { uz: "glEnable(GL_TEXTURE_2D); glBindTexture(GL_TEXTURE_2D, grassTex); glColor3f(1,1,1); glTexCoord2f(0, 0); glVertex3f(−s, 0, s); …", ru: "glEnable(GL_TEXTURE_2D); glBindTexture(GL_TEXTURE_2D, grassTex); glColor3f(1,1,1); glTexCoord2f(0, 0); glVertex3f(−s, 0, s); …" },
        check: { type: "both", tol: 16, source: [{ re: "glTexCoord2f", msg: { uz: "Yerga tekstura koordinatalarini bering", ru: "Задайте земле текстурные координаты" } }] }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Soyalar", ru: "Задание 7. Тени" },
        text: { uz: "<p>Har bir binoning yerga tuşgan tekis soyasini çiqaring. Proyeksion soya matritsasi nuqtani quyoş nuri yönalişi L böyiça y = 0 tekisligiga «bosadi»: x' = x − (Lx/Ly)·y, z' = z − (Lz/Ly)·y, y' = 0. OpenGL matritsasi ustunlar böyiça saqlanadi: M[4] — x' dagi y koeffitsiyenti, M[6] — z' dagi y koeffitsiyenti.</p>",
                ru: "<p>Выведите плоскую тень каждого здания на землю. Матрица проекционной тени «придавливает» точку к плоскости y = 0 вдоль направления солнечного света L: x' = x − (Lx/Ly)·y, z' = z − (Lz/Ly)·y, y' = 0. Матрица OpenGL хранится по столбцам: M[4] — коэффициент при y в x', M[6] — коэффициент при y в z'.</p>" },
        hint: { uz: "M[0] = 1; M[4] = −lx/ly; M[6] = −lz/ly; M[10] = 1; M[15] = 1; qolganlari 0 (M[5] = 0!).", ru: "M[0] = 1; M[4] = −lx/ly; M[6] = −lz/ly; M[10] = 1; M[15] = 1; остальные 0 (M[5] = 0!)." },
        check: { type: "image" }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Yurgan kamera", ru: "Задание 8. Камера-пешеход" },
        text: { uz: "<p>Şaharda «piyoda» bölib yuring: köz balandligi 1,7 m, <b>W/S</b> — oldinga/orqaga, <b>A/D</b> — yon tomonga, <b>←/→</b> — burilish. Qadam 0,5 m. Oyna ustiga bosing va köçalarni aylanib çiqing.</p>",
                ru: "<p>Пройдитесь по городу «пешком»: высота глаз 1,7 м, <b>W/S</b> — вперёд/назад, <b>A/D</b> — вбок, <b>←/→</b> — поворот. Шаг 0,5 м. Щёлкните по окну и обойдите улицы.</p>" },
        hint: { uz: "if (key == 'w') { cx += 0.5·sin(yaw); cz −= 0.5·cos(yaw); } …", ru: "if (key == 'w') { cx += 0.5·sin(yaw); cz −= 0.5·cos(yaw); } …" },
        check: { type: "both", source: [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) ni qayd qiling", ru: "Зарегистрируйте glutKeyboardFunc(keyboard)" } }, { re: "'w'", msg: { uz: "W tugmasini qayta işlang", ru: "Обработайте клавишу W" } }, { re: "yaw\\s*[-+]=", msg: { uz: "Strelkalar yaw ni özgartirsin", ru: "Стрелки должны менять yaw" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
