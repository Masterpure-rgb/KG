/* A7. OpenGL yordamida geometrik obyektlarni çiziş: primitivlar, almaştirişlar, animatsiya (UZ/RU) */
(function () {
  var C = LAB.C;
  var HEAD = "#include <GL/glut.h>\n#include <cmath>\n#include <cstdio>\n\n#define PI 3.14159265f\n\n";
  var RESHAPE = `void reshape(int w, int h) {
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-10, 10, -10, 10, -10, 10);   // ${C("sahna: −10 dan +10 gaça", "сцена: от −10 до +10")}
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}
`;
  function MAIN(title, extra) {
    return `
int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(480, 480);
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
  var NGON = `// ${C("Muntazam n-burçak: markaz (cx, cy), radius r; birinçi uç tepada", "Правильный n-угольник: центр (cx, cy), радиус r; первая вершина сверху")}
void ngon(float cx, float cy, float r, int n) {
    glBegin(GL_LINE_LOOP);
    for (int i = 0; i < n; i++) {
        float a = PI / 2 + 2 * PI * i / n;
        glVertex2f(cx + r * cos(a), cy + r * sin(a));
    }
    glEnd();
}

`;
  var TRI = `// ${C("Bitta uçburçak: tepasi (0; 8), asosi y = 1 da", "Один треугольник: вершина (0; 8), основание на y = 1")}
void tri() {
    glBegin(GL_TRIANGLES);
        glColor3f(1.0f, 0.85f, 0.3f); glVertex2f(0, 8);
        glColor3f(1.0f, 0.4f, 0.2f);  glVertex2f(-1.6f, 1);
        glColor3f(1.0f, 0.4f, 0.2f);  glVertex2f(1.6f, 1);
    glEnd();
}

`;

  /* ---------- Misol ---------- */
  var ex = HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glBegin(GL_TRIANGLES);
        glColor3f(1, 0, 0); glVertex2f(0, 6);      // ${C("har bir uçning öz rangi", "у каждой вершины свой цвет")}
        glColor3f(0, 1, 0); glVertex2f(-6, -5);
        glColor3f(0, 0, 1); glVertex2f(6, -5);
    glEnd();
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: uçburçak");

  /* ---------- 1. Tört çiziq ---------- */
  var t1 = S(HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLineWidth(5.0f);
`, `    // ${C("TODO: GL_LINES bilan 4 ta gorizontal çiziq (x: −8 dan 8 gaça):", "TODO: 4 горизонтальные линии GL_LINES (x от −8 до 8):")}
    // ${C("y = 6 qizil, y = 2 yaşil, y = −2 kök, y = −6 sariq", "y = 6 красная, y = 2 зелёная, y = −2 синяя, y = −6 жёлтая")}
`, `    glBegin(GL_LINES);           // ${C("har 2 ta uç — bitta kesma", "каждые 2 вершины — отрезок")}
        glColor3f(1.0f, 0.3f, 0.3f);  glVertex2f(-8, 6);  glVertex2f(8, 6);
        glColor3f(0.3f, 0.9f, 0.4f);  glVertex2f(-8, 2);  glVertex2f(8, 2);
        glColor3f(0.35f, 0.5f, 1.0f); glVertex2f(-8, -2); glVertex2f(8, -2);
        glColor3f(1.0f, 0.85f, 0.3f); glVertex2f(-8, -6); glVertex2f(8, -6);
    glEnd();
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: 4 çiziq"));

  /* ---------- 2. Olti burçak ---------- */
  var t2 = S(HEAD + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLineWidth(4.0f);
    glColor3f(0.3f, 0.9f, 1.0f);
`, `    // ${C("TODO: GL_LINE_LOOP bilan muntazam oltiburçak: markaz (0; 0), radius 7, uçlar burçagi k·60°", "TODO: правильный шестиугольник GL_LINE_LOOP: центр (0; 0), радиус 7, углы вершин k·60°")}
`, `    glBegin(GL_LINE_LOOP);       // ${C("oxirgi uç birinçisi bilan avtomatik ulanadi", "последняя вершина автоматически соединяется с первой")}
    for (int k = 0; k < 6; k++) {
        float a = k * PI / 3;
        glVertex2f(7 * cos(a), 7 * sin(a));
    }
    glEnd();
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: oltiburçak"));

  /* ---------- 3. ngon ---------- */
  var t3 = S(HEAD + `// ${C("Muntazam n-burçak: markaz (cx, cy), radius r; birinçi uç tepada (burçak π/2)", "Правильный n-угольник: центр (cx, cy), радиус r; первая вершина сверху (угол π/2)")}
void ngon(float cx, float cy, float r, int n) {
`, `    // ${C("TODO: GL_LINE_LOOP, i-uç: a = π/2 + 2π·i/n, (cx + r·cos a; cy + r·sin a)", "TODO: GL_LINE_LOOP, i-я вершина: a = π/2 + 2π·i/n, (cx + r·cos a; cy + r·sin a)")}
`, `    glBegin(GL_LINE_LOOP);
    for (int i = 0; i < n; i++) {
        float a = PI / 2 + 2 * PI * i / n;
        glVertex2f(cx + r * cos(a), cy + r * sin(a));
    }
    glEnd();
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLineWidth(3.0f);
    int n[5] = { 3, 4, 5, 6, 8 };
    for (int k = 0; k < 5; k++) {
        glColor3f(0.3f + 0.17f * k, 0.9f - 0.1f * k, 1.0f - 0.15f * k);
        ngon(-8 + 4 * k, 0, 1.8f, n[k]);
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: ngon"));

  /* ---------- 4. Töldirilgan ---------- */
  var t4 = S(HEAD + NGON + `// ${C("Töldirilgan muntazam n-burçak", "Залитый правильный n-угольник")}
void ngonFill(float cx, float cy, float r, int n) {
`, `    // ${C("TODO: ngon bilan bir xil, lekin GL_POLYGON primitivi", "TODO: как ngon, но примитив GL_POLYGON")}
`, `    glBegin(GL_POLYGON);         // ${C("qavariq köpburçak — içi böyaladi", "выпуклый многоугольник — внутренность закрашивается")}
    for (int i = 0; i < n; i++) {
        float a = PI / 2 + 2 * PI * i / n;
        glVertex2f(cx + r * cos(a), cy + r * sin(a));
    }
    glEnd();
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLineWidth(3.0f);
    int n[5] = { 3, 4, 5, 6, 8 };
    for (int k = 0; k < 5; k++) {
        glColor3f(0.3f + 0.17f * k, 0.9f - 0.1f * k, 1.0f - 0.15f * k);
        ngon(-8 + 4 * k, 4, 1.8f, n[k]);         // ${C("yuqorida — kontur", "сверху — контур")}
        ngonFill(-8 + 4 * k, -4, 1.8f, n[k]);    // ${C("pastda — töldirilgan", "снизу — залитый")}
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: GL_POLYGON"));

  /* ---------- 5. Transformatsiyalar ---------- */
  var t5 = S(HEAD + TRI + `void display() {
    glClear(GL_COLOR_BUFFER_BIT);
`, `    // ${C("TODO: uçburçakning 6 ta nusxasi, k-nusxa Oz atrofida k·60° ga burilgan:", "TODO: 6 копий треугольника, k-я повёрнута вокруг Oz на k·60°:")}
    // ${C("glPushMatrix(); glRotatef(...); tri(); glPopMatrix();", "glPushMatrix(); glRotatef(...); tri(); glPopMatrix();")}
    tri();
`, `    for (int k = 0; k < 6; k++) {
        glPushMatrix();                // ${C("joriy matritsani saqlaymiz", "сохраняем текущую матрицу")}
        glRotatef(60.0f * k, 0, 0, 1);
        tri();
        glPopMatrix();                 // ${C("va qayta tiklaymiz — burişlar yiğilib qolmaydi", "и восстанавливаем — повороты не накапливаются")}
    }
`, `    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: yulduz"));

  /* ---------- 6. Animatsiya ---------- */
  var t6 = S(HEAD + TRI + `float angle = 0;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glPushMatrix();
`, `    // ${C("TODO 1: butun yulduzni angle ga buring", "TODO 1: поверните всю звезду на angle")}
`, `    glRotatef(angle, 0, 0, 1);
`, `    for (int k = 0; k < 6; k++) {
        glPushMatrix();
        glRotatef(60.0f * k, 0, 0, 1);
        tri();
        glPopMatrix();
    }
    glPopMatrix();
    glutSwapBuffers();
}

void idle() {
`, `    // ${C("TODO 2: angle = 30·t (t — sekundlar), glutPostRedisplay(); main() da glutIdleFunc(idle)", "TODO 2: angle = 30·t (t — секунды), glutPostRedisplay(); в main() — glutIdleFunc(idle)")}
}
`, `    angle = 30.0f * glutGet(GLUT_ELAPSED_TIME) / 1000.0f;
    glutPostRedisplay();
}
`, `
` + RESHAPE + MAIN("A7: animatsiya", "    glutIdleFunc(idle);\n"));
  // t6 has two TODO blocks — build manually
  t6 = (function () {
    var a = HEAD + TRI + `float angle = 0;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glPushMatrix();
`;
    var mid = `    for (int k = 0; k < 6; k++) {
        glPushMatrix();
        glRotatef(60.0f * k, 0, 0, 1);
        tri();
        glPopMatrix();
    }
    glPopMatrix();
    glutSwapBuffers();
}

void idle() {
`;
    var end = `}

` + RESHAPE;
    return {
      starter: a + `    // ${C("TODO 1: butun yulduzni angle ga buring", "TODO 1: поверните всю звезду на angle")}
` + mid + `    // ${C("TODO 2: angle = 30·t (t — sekundlar) va glutPostRedisplay(); main() da glutIdleFunc(idle) qayd qilingan", "TODO 2: angle = 30·t (t — секунды) и glutPostRedisplay(); в main() уже есть glutIdleFunc(idle)")}
` + end + MAIN("A7: animatsiya", "    glutIdleFunc(idle);\n"),
      solution: a + `    glRotatef(angle, 0, 0, 1);
` + mid + `    angle = 30.0f * glutGet(GLUT_ELAPSED_TIME) / 1000.0f;     // ${C("sekundiga 30°", "30° в секунду")}
    glutPostRedisplay();
` + end + MAIN("A7: animatsiya", "    glutIdleFunc(idle);\n")
    };
  })();

  /* ---------- 7. Interaktiv ---------- */
  var t7 = S(HEAD + NGON + `// ${C("Saqlanadigan obyektlar: tur (0 — uçburçak, 1 — aylana) va joyi; eng köpi 10 ta", "Хранимые объекты: тип (0 — треугольник, 1 — окружность) и место; не более 10")}
int kind[10];
float ox[10], oy[10];
int count = 0, next = 0;
float cx = 0, cy = 0;            // ${C("kursor", "курсор")}

void addObject(int k, float x, float y) {
`, `    // ${C("TODO: obyektni next-öringa yozing, next = (next + 1) % 10; count 10 dan oşmasin", "TODO: запишите объект на место next, next = (next + 1) % 10; count не больше 10")}
`, `    kind[next] = k; ox[next] = x; oy[next] = y;
    next = (next + 1) % 10;          // ${C("11-obyekt eng eskisining örniga yoziladi", "11-й объект записывается на место самого старого")}
    if (count < 10) count++;
`, `}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLineWidth(3.0f);
    for (int i = 0; i < count; i++) {
        if (kind[i] == 0) {
            glColor3f(0.35f, 0.55f, 1.0f);
            glBegin(GL_TRIANGLES);
            glVertex2f(ox[i], oy[i] + 1.5f); glVertex2f(ox[i] - 1.3f, oy[i] - 0.8f); glVertex2f(ox[i] + 1.3f, oy[i] - 0.8f);
            glEnd();
        } else {
            glColor3f(1.0f, 0.35f, 0.35f);
            ngon(ox[i], oy[i], 1.4f, 40);
        }
    }
    // ${C("Kursor — oq xoç", "Курсор — белый крестик")}
    glColor3f(1, 1, 1);
    glLineWidth(1.0f);
    glBegin(GL_LINES);
    glVertex2f(cx - 0.7f, cy); glVertex2f(cx + 0.7f, cy);
    glVertex2f(cx, cy - 0.7f); glVertex2f(cx, cy + 0.7f);
    glEnd();
    glutSwapBuffers();
}

// ${C("Klaviatura: 't' — uçburçak, 'c' — aylana kursor joyida; strelkalar — kursorni suriş", "Клавиатура: 't' — треугольник, 'c' — окружность в месте курсора; стрелки — сдвиг курсора")}
void keyboard(unsigned char key, int x, int y) {
    if (key == 't') addObject(0, cx, cy);
    if (key == 'c') addObject(1, cx, cy);
    glutPostRedisplay();
}
void special(int key, int x, int y) {
    if (key == GLUT_KEY_LEFT)  cx -= 1;
    if (key == GLUT_KEY_RIGHT) cx += 1;
    if (key == GLUT_KEY_UP)    cy += 1;
    if (key == GLUT_KEY_DOWN)  cy -= 1;
    glutPostRedisplay();
}

` + RESHAPE + MAIN("A7: interaktiv", "    addObject(0, -5, 4);\n    addObject(1, 5, -4);\n    glutKeyboardFunc(keyboard);\n    glutSpecialFunc(special);\n"));

  /* ---------- 8. Primitivlarni soliştiriş ---------- */
  var t8 = S(HEAD + `// ${C("Bir xil 5 ta nuqta (katakça markaziga nisbatan)", "Одни и те же 5 точек (относительно центра ячейки)")}
float PX[5] = { -2.4f, -1.2f, 0.0f, 1.2f, 2.4f };
float PY[5] = { -1.5f, 1.5f, -1.0f, 1.8f, -1.6f };

void label(float x, float y, const char* s) {
    glRasterPos2f(x, y);
    for (int i = 0; s[i]; i++) glutBitmapCharacter(GLUT_BITMAP_HELVETICA_12, s[i]);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
`, `    // ${C("TODO: 6 ta rejim: GL_LINES, GL_LINE_STRIP, GL_LINE_LOOP, GL_TRIANGLES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN", "TODO: 6 режимов: GL_LINES, GL_LINE_STRIP, GL_LINE_LOOP, GL_TRIANGLES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN")}
    // ${C("va ularning nomlari (katakça tagidagi yozuv)", "и их названия (подпись под ячейкой)")}
    GLenum mode[6] = { GL_LINES, GL_LINES, GL_LINES, GL_LINES, GL_LINES, GL_LINES };
    const char* name[6] = { "?", "?", "?", "?", "?", "?" };
`, `    GLenum mode[6] = { GL_LINES, GL_LINE_STRIP, GL_LINE_LOOP, GL_TRIANGLES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN };
    const char* name[6] = { "GL_LINES", "GL_LINE_STRIP", "GL_LINE_LOOP", "GL_TRIANGLES", "GL_TRIANGLE_STRIP", "GL_TRIANGLE_FAN" };
`, `    glLineWidth(2.0f);
    for (int k = 0; k < 6; k++) {
        float x0 = -6.5f + 6.5f * (k % 3), y0 = 4.5f - 8.5f * (k / 3);
        glColor3f(0.3f + 0.12f * k, 0.85f - 0.08f * k, 1.0f - 0.1f * k);
        glBegin(mode[k]);
        for (int i = 0; i < 5; i++) glVertex2f(x0 + PX[i], y0 + PY[i]);
        glEnd();
        glColor3f(1, 1, 1);
        glPointSize(5.0f);
        glBegin(GL_POINTS);
        for (int i = 0; i < 5; i++) glVertex2f(x0 + PX[i], y0 + PY[i]);
        glEnd();
        glColor3f(0.85f, 0.88f, 0.95f);
        label(x0 - 2.8f, y0 - 3.3f, name[k]);
    }
    glutSwapBuffers();
}

` + RESHAPE + MAIN("A7: primitivlar"));

  var keysSrc = [{ re: "glutKeyboardFunc\\s*\\(\\s*\\w+\\s*\\)", msg: { uz: "glutKeyboardFunc(keyboard) qayd qilingan bölsin", ru: "Должна быть регистрация glutKeyboardFunc(keyboard)" } }];
  LAB.define({
    n: 7,
    title: { uz: "OpenGL yordamida geometrik obyektlarni çiziş", ru: "Рисование геометрических объектов средствами OpenGL" },
    steps: [
      { id: "s0", kind: "example", title: { uz: "Misol: rangli uçburçak", ru: "Пример: цветной треугольник" },
        text: { uz: "<p>OpenGL dasturining tuzilişi: <code>glutInit</code> → oyna yaratiş → hodisa funksiyalarini qayd qiliş (<code>glutDisplayFunc</code>, <code>glutReshapeFunc</code>) → <code>glutMainLoop</code>. Primitiv <code>glBegin(...)</code> va <code>glEnd()</code> orasida uçlar röyxati bilan beriladi. Har bir uçning rangi alohida — OpenGL ularni uçburçak içida silliq aralaştiradi.</p>",
                ru: "<p>Структура программы OpenGL: <code>glutInit</code> → создание окна → регистрация обработчиков (<code>glutDisplayFunc</code>, <code>glutReshapeFunc</code>) → <code>glutMainLoop</code>. Примитив задаётся списком вершин между <code>glBegin(...)</code> и <code>glEnd()</code>. Цвет у каждой вершины свой — OpenGL плавно смешивает их внутри треугольника.</p>" },
        code: ex },
      { id: "s1", kind: "task", title: { uz: "Topşiriq 1. Tört çiziq", ru: "Задание 1. Четыре линии" },
        text: { uz: "<p><code>GL_LINES</code> bilan 4 ta rangli gorizontal çiziq çizing (x: −8 dan 8 gaça): y = 6 — qizil, y = 2 — yaşil, y = −2 — kök, y = −6 — sariq. <code>GL_LINES</code> da har ikki uç alohida kesma hosil qiladi; rang — holat, u keyingi uçlarga ham taʼsir qiladi.</p>",
                ru: "<p>Нарисуйте <code>GL_LINES</code> 4 цветные горизонтальные линии (x от −8 до 8): y = 6 — красная, y = 2 — зелёная, y = −2 — синяя, y = −6 — жёлтая. В <code>GL_LINES</code> каждые две вершины образуют отдельный отрезок; цвет — это состояние, он действует и на следующие вершины.</p>" },
        hint: { uz: "Ranglar: (1; 0,3; 0,3), (0,3; 0,9; 0,4), (0,35; 0,5; 1), (1; 0,85; 0,3).", ru: "Цвета: (1; 0,3; 0,3), (0,3; 0,9; 0,4), (0,35; 0,5; 1), (1; 0,85; 0,3)." },
        check: { type: "both", calls: { "glVertex2f": ">=8" } }, starter: t1.starter, solution: t1.solution },
      { id: "s2", kind: "task", title: { uz: "Topşiriq 2. Yopiq köpburçak", ru: "Задание 2. Замкнутая ломаная" },
        text: { uz: "<p><code>GL_LINE_LOOP</code> bilan muntazam oltiburçak çizing: markaz (0; 0), radius 7, k-uçning burçagi k·60°. <code>GL_LINE_LOOP</code> oxirgi uçni birinçisi bilan özi ulaydi.</p>",
                ru: "<p>Нарисуйте <code>GL_LINE_LOOP</code> правильный шестиугольник: центр (0; 0), радиус 7, угол k-й вершины k·60°. <code>GL_LINE_LOOP</code> сам соединяет последнюю вершину с первой.</p>" },
        hint: { uz: "for k = 0..5: a = k·π/3; glVertex2f(7·cos a, 7·sin a);", ru: "for k = 0..5: a = k·π/3; glVertex2f(7·cos a, 7·sin a);" },
        check: { type: "both", maxDiff: 0.004, source: [{ re: "GL_LINE_LOOP", msg: { uz: "GL_LINE_LOOP primitivini işlating", ru: "Используйте примитив GL_LINE_LOOP" } }] }, starter: t2.starter, solution: t2.solution },
      { id: "s3", kind: "task", title: { uz: "Topşiriq 3. Universal ngon funksiyasi", ru: "Задание 3. Универсальная функция ngon" },
        text: { uz: "<p><code>ngon(cx, cy, r, n)</code> funksiyasini yozing — muntazam n-burçak konturi, birinçi uç tepada. Uning yordamida bir qatorda 3, 4, 5, 6 va 8 burçaklar çiziladi. Funksiya — qayta işlatiladigan «primitiv»: keyingi topşiriqlarda ham kerak böladi.</p>",
                ru: "<p>Напишите функцию <code>ngon(cx, cy, r, n)</code> — контур правильного n-угольника, первая вершина сверху. С её помощью в ряд рисуются 3-, 4-, 5-, 6- и 8-угольник. Функция — переиспользуемый «примитив», она понадобится и дальше.</p>" },
        hint: { uz: "a = π/2 + 2π·i/n; glVertex2f(cx + r·cos a, cy + r·sin a);", ru: "a = π/2 + 2π·i/n; glVertex2f(cx + r·cos a, cy + r·sin a);" },
        check: { type: "image", maxDiff: 0.004 }, starter: t3.starter, solution: t3.solution },
      { id: "s4", kind: "task", title: { uz: "Topşiriq 4. Töldirilgan köpburçaklar", ru: "Задание 4. Залитые многоугольники" },
        text: { uz: "<p><code>ngonFill</code> funksiyasini <code>GL_POLYGON</code> primitivi bilan yozing. Yuqori qatorda — konturlar, pastki qatorda — töldirilgan köpburçaklar. <code>GL_POLYGON</code> faqat <b>qavariq</b> köpburçaklarni töğri böyaydi.</p>",
                ru: "<p>Напишите функцию <code>ngonFill</code> с примитивом <code>GL_POLYGON</code>. В верхнем ряду — контуры, в нижнем — залитые многоугольники. <code>GL_POLYGON</code> правильно закрашивает только <b>выпуклые</b> многоугольники.</p>" },
        hint: { uz: "ngon bilan bir xil sikl, faqat glBegin(GL_POLYGON).", ru: "Тот же цикл, что в ngon, только glBegin(GL_POLYGON)." },
        check: { type: "both", source: [{ re: "GL_POLYGON", msg: { uz: "GL_POLYGON primitivini işlating", ru: "Используйте примитив GL_POLYGON" } }] }, starter: t4.starter, solution: t4.solution },
      { id: "s5", kind: "task", title: { uz: "Topşiriq 5. Transformatsiyalar", ru: "Задание 5. Преобразования" },
        text: { uz: "<p>Uçburçakning 6 ta nusxasidan yulduz yasang: k-nusxa Oz atrofida k·60° ga burilgan. Har bir nusxani <code>glPushMatrix</code>/<code>glPopMatrix</code> içida çizing — aks holda burişlar yiğilib boradi (60°, 120°+60°, …).</p>",
                ru: "<p>Соберите звезду из 6 копий треугольника: k-я копия повёрнута вокруг Oz на k·60°. Каждую копию рисуйте внутри <code>glPushMatrix</code>/<code>glPopMatrix</code> — иначе повороты будут накапливаться (60°, 120°+60°, …).</p>" },
        hint: { uz: "for k: glPushMatrix(); glRotatef(60·k, 0, 0, 1); tri(); glPopMatrix();", ru: "for k: glPushMatrix(); glRotatef(60·k, 0, 0, 1); tri(); glPopMatrix();" },
        check: { type: "both", calls: { "glPushMatrix": ">=6", "glRotatef": ">=6" } }, starter: t5.starter, solution: t5.solution },
      { id: "s6", kind: "task", title: { uz: "Topşiriq 6. Animatsiya", ru: "Задание 6. Анимация" },
        text: { uz: "<p>Yulduzni sekundiga 30° tezlikda aylantiring. Burçak vaqtga böğliq: angle = 30·t, bu yerda t = <code>glutGet(GLUT_ELAPSED_TIME)</code>/1000. Şunda tezlik kompyuter quvvatiga böğliq bölmaydi. <code>idle</code> da <code>glutPostRedisplay()</code> qayta çiziş uçun kerak.</p>",
                ru: "<p>Вращайте звезду со скоростью 30° в секунду. Угол зависит от времени: angle = 30·t, где t = <code>glutGet(GLUT_ELAPSED_TIME)</code>/1000. Тогда скорость не зависит от мощности компьютера. В <code>idle</code> нужен <code>glutPostRedisplay()</code> для перерисовки.</p>" },
        hint: { uz: "display: glRotatef(angle, 0, 0, 1); idle: angle = 30.0f·glutGet(GLUT_ELAPSED_TIME)/1000.0f; glutPostRedisplay();", ru: "display: glRotatef(angle, 0, 0, 1); idle: angle = 30.0f·glutGet(GLUT_ELAPSED_TIME)/1000.0f; glutPostRedisplay();" },
        frames: 2, check: { type: "both", source: [{ re: "glutPostRedisplay", msg: { uz: "idle() da glutPostRedisplay() ni çaqiring", ru: "Вызывайте glutPostRedisplay() в idle()" } }] }, starter: t6.starter, solution: t6.solution },
      { id: "s7", kind: "task", title: { uz: "Topşiriq 7. Interaktiv sahna", ru: "Задание 7. Интерактивная сцена" },
        text: { uz: "<p>Klaviatura bilan sahnaga obyekt qöşing: strelkalar kursorni suradi, <b>t</b> — kök uçburçak, <b>c</b> — qizil aylana qöşadi. Eng köpi 10 ta obyekt saqlanadi: 11-obyekt eng eskisining örniga yoziladi (halqa bufer). <code>addObject</code> funksiyasini yozing. Oyna ustiga bosib sinab köring.</p>",
                ru: "<p>Добавляйте объекты с клавиатуры: стрелки двигают курсор, <b>t</b> добавляет синий треугольник, <b>c</b> — красную окружность. Хранится не более 10 объектов: 11-й записывается на место самого старого (кольцевой буфер). Напишите функцию <code>addObject</code>. Щёлкните по окну и проверьте.</p>" },
        hint: { uz: "kind[next] = k; ox[next] = x; oy[next] = y; next = (next + 1) % 10; if (count < 10) count++;", ru: "kind[next] = k; ox[next] = x; oy[next] = y; next = (next + 1) % 10; if (count < 10) count++;" },
        check: { type: "both", maxDiff: 0.003, source: keysSrc }, starter: t7.starter, solution: t7.solution },
      { id: "s8", kind: "task", title: { uz: "Topşiriq 8. Primitivlarni soliştiriş", ru: "Задание 8. Сравнение примитивов" },
        text: { uz: "<p>Bir xil 5 ta nuqtani 6 xil rejimda çizing: <code>GL_LINES</code>, <code>GL_LINE_STRIP</code>, <code>GL_LINE_LOOP</code>, <code>GL_TRIANGLES</code>, <code>GL_TRIANGLE_STRIP</code>, <code>GL_TRIANGLE_FAN</code> va har birining tagiga nomini yozing. Juft bölmagan uç (GL_LINES da 5-uç) va töliq bölmagan uçburçak taşlab yuboriladi.</p>",
                ru: "<p>Нарисуйте одни и те же 5 точек в 6 режимах: <code>GL_LINES</code>, <code>GL_LINE_STRIP</code>, <code>GL_LINE_LOOP</code>, <code>GL_TRIANGLES</code>, <code>GL_TRIANGLE_STRIP</code>, <code>GL_TRIANGLE_FAN</code> и подпишите каждый. Непарная вершина (5-я в GL_LINES) и неполный треугольник отбрасываются.</p>" },
        hint: { uz: "Massivlar mode[] va name[] ni bir xil tartibda töldiring.", ru: "Заполните массивы mode[] и name[] в одном порядке." },
        check: { type: "image", maxDiff: 0.004 }, starter: t8.starter, solution: t8.solution }
    ]
  });
})();
