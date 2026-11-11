/* A5. Körinmas çiziq va sirtlarni olib taşlaş (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n";
  var LIGHT = `// ${C("Yoritiş: bitta yönaltirilgan manba, rang glColor dan olinadi", "Освещение: один направленный источник, цвет берётся из glColor")}
void initLight() {
    GLfloat dir[] = { 0.4f, 0.7f, 1.0f, 0.0f };
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glLightfv(GL_LIGHT0, GL_POSITION, dir);
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE);
    glEnable(GL_NORMALIZE);
}

`;
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w / h, 0.5, 100.0);
    glMatrixMode(GL_MODELVIEW);
}
`;
  var RESHAPE2D = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-4.0, 4.0, -3.0, 3.0, -1.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}
`;
  function MAIN(title, extra, mode) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(${mode || "GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH"});
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
  function S(pre, todo, body, post) { return { starter: pre + todo + post, solution: pre + body + post }; }

  /* ---------- Misol ---------- */
  var ex = HEAD + LIGHT + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 1.5, 3,  0, 0, -6,  0, 1, 0);
    glEnable(GL_DEPTH_TEST);          // ${C("Z-bufer", "Z-буфер")}
    glEnable(GL_CULL_FACE);           // ${C("orqa yoqlarni taşlaş", "отбрасывание нелицевых граней")}

    // ${C("Oldingi kub — qizil", "Передний куб — красный")}
    glPushMatrix();
    glTranslated(0, 0, -5);
    glRotatef(30, 0, 1, 0);
    glColor3f(0.95f, 0.3f, 0.3f);
    glutSolidCube(1.5);
    glPopMatrix();

    // ${C("Orqadagi kub — kök", "Задний куб — синий")}
    glPushMatrix();
    glTranslated(1, 0, -7);
    glRotatef(20, 0, 1, 0);
    glColor3f(0.3f, 0.5f, 1.0f);
    glutSolidCube(2);
    glPopMatrix();

    glutSwapBuffers();
}

` + RESHAPE + MAIN("A5: Z-bufer", "    initLight();\n");

  /* ---------- 1. Kubning yaşirin qirralari ---------- */
  var CUBE2D = `struct P3 { double x, y, z; };
P3 V[8] = { {-1,-1,-1}, {1,-1,-1}, {1,1,-1}, {-1,1,-1}, {-1,-1,1}, {1,-1,1}, {1,1,1}, {-1,1,1} };
// ${C("Yoqlar: taşqaridan qaraganda uçlar soat strelkasiga qarşi (CCW)", "Грани: вершины против часовой стрелки при взгляде снаружи (CCW)")}
int F[6][4] = { {4,5,6,7}, {1,0,3,2}, {5,1,2,6}, {0,4,7,3}, {7,6,2,3}, {0,1,5,4} };
P3 R[8];

// ${C("Kubni Oy atrofida 35°, Ox atrofida 25° buriş, so'ng 1,6 marta kattalaştiriş", "Поворот куба: 35° вокруг Oy, 25° вокруг Ox, затем масштаб 1,6")}
void rotateAll() {
    double a = 35 * 3.14159265 / 180, b = 25 * 3.14159265 / 180;
    for (int i = 0; i < 8; i++) {
        double x = V[i].x * cos(a) + V[i].z * sin(a);
        double z = -V[i].x * sin(a) + V[i].z * cos(a);
        double y = V[i].y * cos(b) - z * sin(b);
        double z2 = V[i].y * sin(b) + z * cos(b);
        R[i].x = 1.6 * x; R[i].y = 1.6 * y; R[i].z = 1.6 * z2;
    }
}
void faceEdges(int f) {
    glBegin(GL_LINE_LOOP);
    for (int k = 0; k < 4; k++) glVertex2d(R[F[f][k]].x, R[F[f][k]].y);
    glEnd();
}

`;
  var t1 = S(HEAD + CUBE2D + `// ${C("Proyeksiyadagi köpburçakning işorali yuzi: > 0 — CCW (bizga qaragan yoq)", "Знаковая площадь проекции грани: > 0 — CCW (грань смотрит на нас)")}
double area(int f) {
`, `    // ${C("TODO: Gauss formulasi: A = ½ Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ), i = 0..3 (R[F[f][i]] nuqtalar)", "TODO: формула Гаусса: A = ½ Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ), i = 0..3 (точки R[F[f][i]])")}
    return 1;
`, `    double A = 0;
    for (int i = 0; i < 4; i++) {
        P3 p = R[F[f][i]], q = R[F[f][(i + 1) % 4]];
        A += p.x * q.y - q.x * p.y;
    }
    return A / 2;
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    rotateAll();
    // ${C("1) Orqa yoqlarning qirralari — xira punktir", "1) Рёбра нелицевых граней — тусклый пунктир")}
    glEnable(GL_LINE_STIPPLE);
    glLineStipple(2, 0x3333);
    glLineWidth(1.5f);
    glColor3f(0.4f, 0.45f, 0.6f);
    for (int f = 0; f < 6; f++) if (area(f) <= 0) faceEdges(f);
    glDisable(GL_LINE_STIPPLE);
    // ${C("2) Old yoqlarning qirralari — yorqin", "2) Рёбра лицевых граней — яркие")}
    glLineWidth(3.0f);
    glColor3f(1.0f, 0.85f, 0.3f);
    for (int f = 0; f < 6; f++) if (area(f) > 0) faceEdges(f);
    glutSwapBuffers();
}

` + RESHAPE2D + MAIN("A5: yasirin qirralar", "", "GLUT_DOUBLE | GLUT_RGB"));

  /* ---------- 2–3. Kesişgan kublar ---------- */
  var TWO = HEAD + LIGHT + `void scene() {
    glPushMatrix();
    glRotatef(25, 0, 1, 0);
    glColor3f(0.95f, 0.3f, 0.3f);
    glutSolidCube(2.0);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.9f, 0.5f, 0.3f);
    glRotatef(45, 1, 1, 0);
    glColor3f(0.3f, 0.55f, 1.0f);
    glutSolidCube(1.8);
    glPopMatrix();
}

void display() {
`;
  var TWO_POST = `    glLoadIdentity();
    gluLookAt(2.5, 2.5, 6,  0.3, 0.2, 0,  0, 1, 0);
    scene();
    glutSwapBuffers();
}

` + RESHAPE;
  var t2 = S(TWO, `    // ${C("TODO: Z-buferni yoqing (GL_DEPTH_TEST) va kadr boşida çuqurlik buferini ham tozalang", "TODO: включите Z-буфер (GL_DEPTH_TEST) и в начале кадра очищайте также буфер глубины")}
    glClear(GL_COLOR_BUFFER_BIT);
`, `    glEnable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
`, TWO_POST + MAIN("A5: Z-bufer", "    initLight();\n"));
  var t3 = S(TWO, `    // ${C("TODO: Z-buferni öçiring (glDisable) — nima özgaradi?", "TODO: выключите Z-буфер (glDisable) — что изменится?")}
    glEnable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
`, `    // ${C("Z-bufersiz: keyin çizilgan obyekt har doim ustida — çuqurlik hisobga olinmaydi", "Без Z-буфера: нарисованное позже всегда сверху — глубина не учитывается")}
    glDisable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
`, TWO_POST + MAIN("A5: Z-bufersiz", "    initLight();\n"));

  /* ---------- 4. Rassom algoritmi ---------- */
  var t4 = S(HEAD + LIGHT + `struct Ball { float x, y, z, r, g, b; };
// ${C("Sferalar ataylab notöğri tartibda: yaqindagisi birinçi", "Сферы намеренно в неправильном порядке: ближняя — первой")}
Ball B[3] = {
    { 0.3f, 0.0f, -4.0f,  0.95f, 0.3f, 0.3f },
    { -0.6f, 0.3f, -6.0f, 0.3f, 0.85f, 0.4f },
    { 0.9f, 0.5f, -8.0f,  0.3f, 0.5f, 1.0f }
};

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glDisable(GL_DEPTH_TEST);            // ${C("Z-bufer işlatilmaydi!", "Z-буфер не используется!")}
    glEnable(GL_CULL_FACE);              // ${C("har bir sferaning orqa yarmi taşlanadi — aks holda u old yarmini yopadi", "задняя половина каждой сферы отбрасывается — иначе она закроет переднюю")}
    glLoadIdentity();
`, `    // ${C("TODO: rassom algoritmi — sferalarni z böyiça saralang: eng uzoq (eng kiçik z) birinçi çizilsin", "TODO: алгоритм художника — отсортируйте сферы по z: самая дальняя (наименьший z) рисуется первой")}
`, `    // ${C("Rassom algoritmi: uzoqdagidan yaqindagiga qarab çizamiz", "Алгоритм художника: рисуем от дальних к ближним")}
    for (int i = 0; i < 3; i++)
        for (int j = i + 1; j < 3; j++)
            if (B[j].z < B[i].z) { Ball t = B[i]; B[i] = B[j]; B[j] = t; }
`, `    for (int i = 0; i < 3; i++) {
        glPushMatrix();
        glTranslatef(B[i].x, B[i].y, B[i].z);
        glColor3f(B[i].r, B[i].g, B[i].b);
        glutSolidSphere(1.3, 32, 24);
        glPopMatrix();
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A5: rassom", "    initLight();\n"));

  /* ---------- 5. Yarim şaffof ---------- */
  var t5 = S(HEAD + LIGHT + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    glLoadIdentity();
    gluLookAt(1.5, 1.2, 5,  0, 0, 0,  0, 1, 0);

    // ${C("1) Şaffof bölmagan obyekt — qizil şar (devor ortida)", "1) Непрозрачный объект — красный шар (за стеной)")}
    glPushMatrix();
    glTranslatef(0, 0, -1.5f);
    glColor3f(0.95f, 0.25f, 0.25f);
    glutSolidSphere(1.0, 32, 24);
    glPopMatrix();

    // ${C("2) Şişa devor: rang alfa = 0,35", "2) Стеклянная стена: альфа = 0,35")}
`, `    // ${C("TODO: aralaştirişni yoqing: glEnable(GL_BLEND), glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);", "TODO: включите смешивание: glEnable(GL_BLEND), glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);")}
    // ${C("devorni çizişda çuqurlik buferiga yozişni öçiring: glDepthMask(GL_FALSE)", "при рисовании стены отключите запись в буфер глубины: glDepthMask(GL_FALSE)")}
    glColor4f(0.6f, 0.85f, 1.0f, 0.35f);
    glPushMatrix();
    glScalef(3.2f, 2.4f, 0.1f);
    glutSolidCube(1.0);
    glPopMatrix();
`, `    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glDepthMask(GL_FALSE);                 // ${C("şaffof sirt orqadagilarni «yopmaydi»", "прозрачная поверхность не «заслоняет» в буфере глубины")}
    glColor4f(0.6f, 0.85f, 1.0f, 0.35f);
    glPushMatrix();
    glScalef(3.2f, 2.4f, 0.1f);
    glutSolidCube(1.0);
    glPopMatrix();
    glDepthMask(GL_TRUE);
    glDisable(GL_BLEND);
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A5: shaffof", "    initLight();\n"));

  /* ---------- 6. Back-face culling ---------- */
  var t6 = S(HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 3, 6,  0, 0, 0,  0, 1, 0);
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);     // ${C("sim körinişi", "каркасный режим")}
    glColor3f(0.4f, 0.9f, 1.0f);
`, `    // ${C("TODO: orqa yoqlarni taşlaşni yoqing: glEnable(GL_CULL_FACE) va glCullFace(GL_BACK)", "TODO: включите отбрасывание нелицевых граней: glEnable(GL_CULL_FACE) и glCullFace(GL_BACK)")}
`, `    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
`, `    glPushMatrix();
    glRotatef(-60, 1, 0, 0);
    glutSolidTorus(0.6, 1.6, 16, 32);
    glPopMatrix();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A5: culling"));

  /* ---------- 7. Roberts ---------- */
  var t7 = S(HEAD + `struct P3 { double x, y, z; };
P3 T[4] = { {1.8, 1.8, 1.8}, {1.8, -1.8, -1.8}, {-1.8, 1.8, -1.8}, {-1.8, -1.8, 1.8} };
P3 R[4];
int vis[4];      // ${C("vis[k] — k-uçga qarama-qarşi yoq körinadimi", "vis[k] — видна ли грань, противолежащая вершине k")}

void rotateAll() {
    double a = 20 * 3.14159265 / 180, b = 15 * 3.14159265 / 180;
    for (int i = 0; i < 4; i++) {
        double x = T[i].x * cos(a) + T[i].z * sin(a);
        double z = -T[i].x * sin(a) + T[i].z * cos(a);
        R[i].x = 0.9 * x;
        R[i].y = 0.9 * (T[i].y * cos(b) - z * sin(b));
        R[i].z = 0.9 * (T[i].y * sin(b) + z * cos(b));
    }
}

// ${C("Roberts algoritmi: har bir yoq tekisligi ax + by + cz + d = 0;", "Алгоритм Робертса: для каждой грани плоскость ax + by + cz + d = 0;")}
// ${C("normal jism içidagi nuqta (markaz) manfiy tomonda qoladigan qilib yönaltiriladi.", "нормаль ориентируется так, чтобы внутренняя точка (центр) была с отрицательной стороны.")}
// ${C("Kuzatuvçi +z da: yoq körinadi, agar taşqi normalning c > 0 bölsa.", "Наблюдатель на +z: грань видна, если у внешней нормали c > 0.")}
void roberts() {
    P3 m = { 0, 0, 0 };
    for (int i = 0; i < 4; i++) { m.x += R[i].x / 4; m.y += R[i].y / 4; m.z += R[i].z / 4; }
    for (int k = 0; k < 4; k++) {
        int a = (k + 1) % 4, b = (k + 2) % 4, c = (k + 3) % 4;    // ${C("k ga qarama-qarşi yoq", "грань напротив k")}
        P3 u = { R[b].x - R[a].x, R[b].y - R[a].y, R[b].z - R[a].z };
        P3 v = { R[c].x - R[a].x, R[c].y - R[a].y, R[c].z - R[a].z };
`, `        // ${C("TODO 1: normal n = u × v (a, b, c koeffitsiyentlar), d = −n·R[a]", "TODO 1: нормаль n = u × v (коэффициенты a, b, c), d = −n·R[a]")}
        // ${C("TODO 2: agar n·m + d > 0 bölsa — normalni teskari qiling (n = −n)", "TODO 2: если n·m + d > 0 — разверните нормаль (n = −n)")}
        // ${C("TODO 3: vis[k] = (n.z > 0)", "TODO 3: vis[k] = (n.z > 0)")}
        vis[k] = 1;
`, `        double A = u.y * v.z - u.z * v.y;
        double B = u.z * v.x - u.x * v.z;
        double Cc = u.x * v.y - u.y * v.x;
        double D = -(A * R[a].x + B * R[a].y + Cc * R[a].z);
        if (A * m.x + B * m.y + Cc * m.z + D > 0) { A = -A; B = -B; Cc = -Cc; }
        vis[k] = Cc > 0;
`, `    }
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    rotateAll();
    roberts();
    // ${C("Qirra (i, j) ikki yoqqa tegişli — ular qolgan ikki uçga qarama-qarşi", "Ребро (i, j) принадлежит двум граням — противолежащим двум остальным вершинам")}
    for (int i = 0; i < 4; i++)
        for (int j = i + 1; j < 4; j++) {
            int p = -1, q = -1;
            for (int k = 0; k < 4; k++) if (k != i && k != j) { if (p < 0) p = k; else q = k; }
            int seen = vis[p] || vis[q];
            if (seen) { glDisable(GL_LINE_STIPPLE); glLineWidth(3.0f); glColor3f(1.0f, 0.85f, 0.3f); }
            else { glEnable(GL_LINE_STIPPLE); glLineStipple(2, 0x3333); glLineWidth(1.5f); glColor3f(0.4f, 0.45f, 0.6f); }
            glBegin(GL_LINES);
            glVertex2d(R[i].x, R[i].y);
            glVertex2d(R[j].x, R[j].y);
            glEnd();
        }
    glDisable(GL_LINE_STIPPLE);
    glutSwapBuffers();
}

` + RESHAPE2D + MAIN("A5: Roberts", "", "GLUT_DOUBLE | GLUT_RGB"));

  /* ---------- 8. FPS ---------- */
  var t8 = S(HEAD + LIGHT + `int frames = 0, t0 = 0;
float fps = 0;

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 6, 10,  0, 0, 0,  0, 1, 0);
    float t = glutGet(GLUT_ELAPSED_TIME) / 1000.0f;
    for (int i = -2; i <= 2; i++)
        for (int j = -2; j <= 2; j++) {
            glPushMatrix();
            glTranslatef(i * 2.2f, 0, j * 2.2f);
            glRotatef(40 * t + 15 * (i + j), 0, 1, 0);
            glColor3f(0.5f + 0.1f * i, 0.6f, 0.6f - 0.1f * j);
            glutSolidTorus(0.25, 0.6, 12, 20);
            glPopMatrix();
        }
`, `    // ${C("TODO: kadrlarni sanang (frames++); har 500 ms da fps = frames·1000 / (vaqt − t0) ni hisoblang,", "TODO: считайте кадры (frames++); каждые 500 мс вычисляйте fps = frames·1000 / (время − t0),")}
    // ${C("printf bilan konsolga çiqaring va frames = 0, t0 = vaqt qiling", "выводите printf в консоль и сбрасывайте frames = 0, t0 = время")}
`, `    frames++;
    int now = glutGet(GLUT_ELAPSED_TIME);
    if (now - t0 >= 500) {
        fps = frames * 1000.0f / (now - t0);
        printf("FPS = %.1f\\n", fps);
        frames = 0;
        t0 = now;
    }
`, `    glutSwapBuffers();
}

void idle() { glutPostRedisplay(); }

` + RESHAPE + MAIN("A5: FPS", "    initLight();\n    glEnable(GL_DEPTH_TEST);\n    glEnable(GL_CULL_FACE);\n    glutIdleFunc(idle);\n"));

  var KB = { uz: "Oyna ustiga bosing va natijani kuzating.", ru: "Щёлкните по окну и наблюдайте результат." };
  LAB.define({
    n: 5,
    title: { uz: "3 ölçovli obyektlarni tasvirlaşda körinmas çiziq va sirtlarni olib taşlaş", ru: "Удаление невидимых линий и поверхностей" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: Z-bufer bilan ikki kub", ru: "Пример: два куба с Z-буфером" },
        text: { uz: "<p><b>Z-bufer</b> har bir piksel uçun eng yaqin sirtning çuqurligini saqlaydi: yangi fragment faqat undan yaqinroq bölsa çiziladi. <code>GL_CULL_FACE</code> esa bizga orqasi bilan turgan yoqlarni umuman rastrlamaydi. Qizil kub kök kubning bir qismini töğri yopadi, çizilis tartibidan qatʼi nazar.</p>",
                ru: "<p><b>Z-буфер</b> хранит для каждого пикселя глубину ближайшей поверхности: новый фрагмент рисуется, только если он ближе. <code>GL_CULL_FACE</code> вообще не растеризует грани, повёрнутые к нам тыльной стороной. Красный куб правильно закрывает часть синего независимо от порядка рисования.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Kubning yaşirin qirralari", ru: "Задание 1. Скрытые рёбра куба" },
        text: { uz: "<p>Kub simlik körinişda dasturiy proyeksiyalangan. Har bir yoqning <b>ekrandagi işorali yuzini</b> (Gauss formulasi) hisoblang: yoq uçlari taşqaridan CCW tartibda berilgan, şuning uçun bizga qaragan yoq proyeksiyasi ham CCW (A > 0), orqadagisi — CW (A < 0). Old yoqlarning qirralari yorqin, orqadagilari punktir bilan çiziladi.</p>",
                ru: "<p>Каркас куба проецируется программно. Вычислите <b>знаковую площадь проекции</b> каждой грани (формула Гаусса): вершины граней заданы CCW при взгляде снаружи, поэтому проекция грани, обращённой к нам, тоже CCW (A > 0), а задней — CW (A < 0). Рёбра лицевых граней рисуются ярко, задних — пунктиром.</p>" },
        hint: { uz: "for i: p = R[F[f][i]], q = R[F[f][(i+1)%4]]; A += p.x·q.y − q.x·p.y; return A / 2;", ru: "for i: p = R[F[f][i]], q = R[F[f][(i+1)%4]]; A += p.x·q.y − q.x·p.y; return A / 2;" },
        check: { type: "image", maxDiff: 0.003 }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Z-bufer", ru: "Задание 2. Z-буфер" },
        text: { uz: "<p>Ikki kub bir-birining içiga kirib turibdi. Z-buferni yoqing va har kadr boşida çuqurlik buferini tozalang — kesişiş çiziği töğri körinişi kerak: har bir piksel eng yaqin kub rangida.</p>",
                ru: "<p>Два куба частично входят друг в друга. Включите Z-буфер и очищайте буфер глубины в начале каждого кадра — линия пересечения должна выглядеть правильно: каждый пиксель имеет цвет ближайшего куба.</p>" },
        hint: { uz: "glEnable(GL_DEPTH_TEST); glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);", ru: "glEnable(GL_DEPTH_TEST); glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);" },
        check: { type: "both", source: [{ re: "GL_DEPTH_BUFFER_BIT", msg: { uz: "Çuqurlik buferini ham tozalang: GL_DEPTH_BUFFER_BIT", ru: "Очищайте и буфер глубины: GL_DEPTH_BUFFER_BIT" } }] }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Z-bufersiz", ru: "Задание 3. Без Z-буфера" },
        text: { uz: "<p>Endi Z-buferni öçiring. Kök kub qizil kubdan keyin çizilgani uçun u <b>har doim ustida</b> körinadi — hatto orqada turgan qismlari ham; kubning orqa yoqlari old yoqlarini ham yopib qöyişi mumkin. Bu — çuqurlik hisobga olinmagandagi tipik xato.</p>",
                ru: "<p>Теперь выключите Z-буфер. Синий куб рисуется после красного, поэтому он <b>всегда сверху</b> — даже те его части, что сзади; задние грани куба могут перекрыть передние. Это типичная ошибка при неучтённой глубине.</p>" },
        hint: { uz: "glDisable(GL_DEPTH_TEST);", ru: "glDisable(GL_DEPTH_TEST);" },
        check: { type: "image" }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Rassom algoritmi", ru: "Задание 4. Алгоритм художника" },
        text: { uz: "<p>Z-bufersiz uçta sferani töğri çiziş uçun <b>rassom algoritmi</b>ni qöllang: obyektlarni uzoqligi böyiça saralang va uzoqdagidan yaqindagiga qarab çizing — yaqindagilar uzoqdagilarni böyab yopadi. Kamera −z yönalişiga qaragan, demak eng uzoq sfera eng kiçik z ga ega.</p>",
                ru: "<p>Чтобы правильно нарисовать три сферы без Z-буфера, примените <b>алгоритм художника</b>: отсортируйте объекты по удалённости и рисуйте от дальних к ближним — ближние закрасят дальние. Камера смотрит вдоль −z, значит самая дальняя сфера имеет наименьший z.</p>" },
        hint: { uz: "Pufakçali saralaş: if (B[j].z < B[i].z) almaştiring.", ru: "Сортировка пузырьком: if (B[j].z < B[i].z) поменять местами." },
        check: { type: "image" }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Yarim şaffof devor", ru: "Задание 5. Полупрозрачная стена" },
        text: { uz: "<p>Qizil şar şişa devor ortida turibdi. Şaffoflikni yoqing: <code>glEnable(GL_BLEND)</code>, <code>glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)</code>. Şaffof sirtlar oxirida (rassom tartibida) çiziladi, ular çiziliş paytida çuqurlik buferiga yozilmaydi — <code>glDepthMask(GL_FALSE)</code>.</p>",
                ru: "<p>Красный шар стоит за стеклянной стеной. Включите прозрачность: <code>glEnable(GL_BLEND)</code>, <code>glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)</code>. Прозрачные поверхности рисуются последними (в порядке художника) и не записываются в буфер глубины — <code>glDepthMask(GL_FALSE)</code>.</p>" },
        hint: { uz: "Rang: (1 − α)·fon + α·şişa. α = 0,35 — şişa engil körinadi.", ru: "Цвет: (1 − α)·фон + α·стекло. α = 0,35 — стекло едва заметно." },
        check: { type: "both", calls: { "glBlendFunc": ">=1" } }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Orqa yoqlarni taşlaş (back-face culling)", ru: "Задание 6. Отбрасывание нелицевых граней" },
        text: { uz: "<p>Tor sim körinişida çizilgan: barça çiziqlar körinadi va şakl çalkaş. <code>GL_CULL_FACE</code> ni yoqing — bizga orqasi bilan qaragan köpburçaklar taşlanadi va faqat old tomon qoladi. Bu ham tezlikni oşiradi: qavariq jismda yoqlarning yarmiga yaqini rastrlanmaydi.</p>",
                ru: "<p>Тор нарисован каркасом: видны все линии, форма читается плохо. Включите <code>GL_CULL_FACE</code> — многоугольники, повёрнутые к нам тыльной стороной, отбрасываются, остаётся лицевая сторона. Это ещё и ускоряет: у выпуклого тела почти половина граней не растеризуется.</p>" },
        hint: { uz: "glEnable(GL_CULL_FACE); glCullFace(GL_BACK);", ru: "glEnable(GL_CULL_FACE); glCullFace(GL_BACK);" },
        check: { type: "both", source: [{ re: "GL_CULL_FACE", msg: { uz: "glEnable(GL_CULL_FACE) ni çaqiring", ru: "Вызовите glEnable(GL_CULL_FACE)" } }] }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Roberts algoritmi", ru: "Задание 7. Алгоритм Робертса" },
        text: { uz: "<p>Tetraedr uçun Roberts algoritmining asosiy qadamini yozing: har bir yoq tekisligi tenglamasini (a, b, c, d) tuzing, normalni jismning içki nuqtasi (uçlar markazi) manfiy tomonda qoladigan qilib yönaltiring va kuzatuvçi (+z) tomonga qaraganlarini toping. Ikkala qöşni yoqi körinmaydigan qirra — yaşirin (punktir).</p>",
                ru: "<p>Напишите основной шаг алгоритма Робертса для тетраэдра: составьте уравнение плоскости каждой грани (a, b, c, d), ориентируйте нормаль так, чтобы внутренняя точка тела (центр вершин) была с отрицательной стороны, и найдите грани, обращённые к наблюдателю (+z). Ребро, у которого обе смежные грани невидимы, — скрытое (пунктир).</p>" },
        hint: { uz: "A = u.y·v.z − u.z·v.y; B = u.z·v.x − u.x·v.z; C = u.x·v.y − u.y·v.x; D = −(A·x + B·y + C·z); taşqi normal c > 0 → körinadi.", ru: "A = u.y·v.z − u.z·v.y; B = u.z·v.x − u.x·v.z; C = u.x·v.y − u.y·v.x; D = −(A·x + B·y + C·z); внешняя нормаль c > 0 → видна." },
        check: { type: "image", maxDiff: 0.003 }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. FPS ni ölçaş", ru: "Задание 8. Измерение FPS" },
        text: { uz: "<p>25 ta aylanuvçi tordan iborat sahnaning tezligini ölçang: kadrlarni sanang va har 500 ms da FPS (kadr/sekund) ni konsolga çiqaring. Söngra <code>GL_CULL_FACE</code> va <code>GL_DEPTH_TEST</code> ni navbat bilan öçirib, FPS va tasvir qanday özgarişini hisobotga yozing.</p>",
                ru: "<p>Измерьте скорость сцены из 25 вращающихся торов: считайте кадры и каждые 500 мс выводите FPS (кадров в секунду) в консоль. Затем поочерёдно отключите <code>GL_CULL_FACE</code> и <code>GL_DEPTH_TEST</code> и запишите в отчёт, как меняются FPS и изображение.</p>" },
        hint: { uz: "frames++; now = glutGet(GLUT_ELAPSED_TIME); if (now − t0 ≥ 500) { fps = frames·1000/(now − t0); printf(...); frames = 0; t0 = now; }", ru: "frames++; now = glutGet(GLUT_ELAPSED_TIME); if (now − t0 ≥ 500) { fps = frames·1000/(now − t0); printf(...); frames = 0; t0 = now; }" },
        check: { type: "calls", source: [{ re: "frames\\s*\\+\\+|\\+\\+\\s*frames|frames\\s*\\+=\\s*1", msg: { uz: "Kadrlarni sanang: frames++", ru: "Считайте кадры: frames++" } }, { re: "printf", msg: { uz: "FPS ni printf bilan konsolga çiqaring", ru: "Выводите FPS в консоль через printf" } }, { re: "GLUT_ELAPSED_TIME[\\s\\S]*GLUT_ELAPSED_TIME", msg: { uz: "Vaqtni glutGet(GLUT_ELAPSED_TIME) bilan ölçang", ru: "Измеряйте время через glutGet(GLUT_ELAPSED_TIME)" } }] }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
