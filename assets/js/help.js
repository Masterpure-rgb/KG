/* HELP — işni GitHub orqali topşiriş va dasturni kompyuterda işga tuşiriş. UZ/RU. */
(function () {
  "use strict";
  var O = window.OGL || window.KG, el = O.el, I = O.I || { getLang: function () { return "uz"; } };
  var ru = I.getLang() === "ru";
  var TEX = ["brick", "wood", "checker", "marble", "crate", "grass", "stone", "water", "earth", "metal", "glass", "tiles"];
  function texLinks() { return [].concat.apply([], TEX.map(function (t, i) { return [i ? ", " : "", el("a", { href: O.link("assets/tex/" + t + ".png"), download: t + ".png" }, t + ".png")]; })); }
  function a(href, text) { return el("a", { href: href, target: "_blank", rel: "noopener" }, text); }
  var T = ru ? {
    topics: "Темы", crumb: "Как сдать работу", kicker: "Справка", h1: "Как сдать работу",
    s1: "1. Аккаунт GitHub",
    s1a: ["Откройте ", a("https://github.com/signup", "github.com/signup"), " и зарегистрируйтесь (бесплатно): адрес почты, пароль, имя пользователя. Подтвердите почту кодом из письма."],
    s1b: "Имя пользователя лучше выбрать нейтральное (например, латиницей фамилия и год). Сообщите его преподавателю — он внесёт его в список группы.",
    s1c: "Студентам доступен бесплатный пакет GitHub Education, но для сдачи работ он не нужен.",
    s2: "2. Отправка работы",
    s2l: ["Выполните задание в лабораторной, в Мастерской или в Visual Studio.",
      "Нажмите «Сдать работу» (на странице «Задания» темы или в Мастерской). Укажите ID из списка группы, группу и вариант. Фамилию не пишите: репозиторий открытый, по ID работу узнаёт только преподаватель.",
      "Откроется страница GitHub «New issue» с заполненными полями. Если код длинный, он копируется в буфер обмена — вставьте его в поле «Код программы (.cpp)».",
      "Сохраните скриншот окна (кнопка «Скриншот» в редакторе) и перетащите его в поле «Скриншот и файлы». Отчёт (PDF или DOCX) добавьте туда же.",
      "Нажмите «Create». Работа появится в списке обращений (Issues) курса."],
    s3: "3. Проверка и статусы",
    st: [["Отправлено", "Работа ждёт проверки."], ["Принято", "Преподаватель принял работу. Обращение на GitHub закрывается."], ["На доработку", "В комментарии указано, что исправить. Исправьте код и отправьте работу ещё раз (новым обращением) или ответьте в том же обращении."]],
    s3p: ["Посещаемость и статусы всех ваших работ — в разделе ", "«Мой кабинет»", ": войдите по ID и коду доступа, который выдал преподаватель."],
    s4: "4. Работа на своём компьютере",
    s4p: "Код из лабораторий и Мастерской — обычная программа C++ с freeglut. Чтобы собрать её локально:",
    s4l: [["Установите Visual Studio 2022 Community с рабочей нагрузкой «Разработка классических приложений на C++»."],
      ["Создайте проект «Консольное приложение» (C++), платформа x64, и замените содержимое файла .cpp кодом из лабораторной или Мастерской."],
      ["Установите freeglut и GLEW через менеджер пакетов vcpkg: ", el("code", null, "vcpkg install freeglut:x64-windows glew:x64-windows"), ", затем ", el("code", null, "vcpkg integrate install"), ". GLEW нужен для функций OpenGL 1.2+ (VBO, GL_CLAMP_TO_EDGE и т. п.): в таком случае первой строкой подключите ", el("code", null, "#include <GL/glew.h>"), " и вызовите ", el("code", null, "glewInit()"), " после glutCreateWindow."],
      ["Для загрузки изображений (stbi_load) скачайте файл stb_image.h из репозитория nothings/stb, добавьте в проект и перед подключением напишите ", el("code", null, "#define STB_IMAGE_IMPLEMENTATION"), ". Файлы текстур положите в папку проекта или рядом с .exe: "].concat(texLinks(), ["."]),
      ["Если в программе используется константа M_PI, первой строкой файла напишите ", el("code", null, "#define _USE_MATH_DEFINES"), " — без неё компилятор Visual C++ её не знает."],
      ["Соберите и запустите (F5). Результат совпадает с окном в браузере."]],
    faq: "Частые вопросы",
    qa: [["Нет компьютера — можно ли работать с телефона?", "Да. Лабораторные и Мастерская работают в мобильном браузере; удобнее с внешней клавиатурой."],
      ["Отправил не тот файл. Что делать?", "Отправьте работу ещё раз и в комментарии напишите, что предыдущая отправка ошибочная. Преподаватель проверяет последнюю."],
      ["Видят ли другие студенты мой код?", "Репозиторий курса открытый, поэтому отправленные работы видны всем. Списывание легко обнаружить: у каждого свой вариант, а при приёме работы преподаватель задаёт вопросы по коду."],
      ["Забыл код доступа к кабинету.", "Обратитесь к преподавателю — он выдаст новый."]]
  } : {
    topics: "Mavzular", crumb: "Işni qanday topşiriş", kicker: "Yordam", h1: "Işni qanday topşiriş",
    s1: "1. GitHub akkaunti",
    s1a: [a("https://github.com/signup", "github.com/signup"), " sahifasini oçing va röyxatdan öting (bepul): poçta manzili, parol, foydalanuvçi nomi. Poçtani xatdagi kod bilan tasdiqlang."],
    s1b: "Foydalanuvçi nomini neytral tanlang (masalan, lotinçada familiya va yil). Uni öqituvçiga ayting — u guruh röyxatiga kiritadi.",
    s1c: "Talabalar uçun bepul GitHub Education paketi bor, lekin iş topşiriş uçun u şart emas.",
    s2: "2. Işni yuboriş",
    s2l: ["Topşiriqni laboratoriyada, Ustaxonada yoki Visual Studio da bajaring.",
      "«Işni topşiriş» tugmasini bosing (mavzuning «Topşiriqlar» sahifasida yoki Ustaxonada). Guruh röyxatidagi ID, guruh va variantni körsating. Familiyani yozmang: repozitoriy oçiq, işni ID böyiça faqat öqituvçi taniydi.",
      "GitHub ning «New issue» sahifasi maydonlari töldirilgan holda oçiladi. Kod uzun bölsa, u buferga nusxalanadi — uni «Dastur kodi (.cpp)» maydoniga qöying.",
      "Oyna skrinşotini saqlang (muharrirdagi «Skrinşot» tugmasi) va uni «Skrinşot va fayllar» maydoniga sudrab qöying. Hisobotni (PDF yoki DOCX) ham şu yerga qöşing.",
      "«Create» tugmasini bosing. Iş kursning murojaatlar (Issues) röyxatida paydo böladi."],
    s3: "3. Tekşiriş va holatlar",
    st: [["Yuborildi", "Iş tekşirişni kutmoqda."], ["Qabul qilindi", "Öqituvçi işni qabul qildi. GitHub dagi murojaat yopiladi."], ["Qayta işlaşga", "Izohda nimani tuzatiş kerakligi yozilgan. Kodni tuzating va işni yana yuboring (yangi murojaat bilan) yoki öşa murojaatda javob yozing."]],
    s3p: ["Davomat va barça işlaringiz holati — ", "«Mening kabinetim»", " böllimida: öqituvçi bergan ID va kiriş kodi bilan kiring."],
    s4: "4. Öz kompyuteringizda işlaş",
    s4p: "Laboratoriya va Ustaxonadagi kod — freeglut bilan oddiy C++ dasturi. Uni kompyuterda yiğiş uçun:",
    s4l: [["Visual Studio 2022 Community ni «C++ bilan klassik ilovalar yaratiş» (Desktop development with C++) yuklamasi bilan örnating."],
      ["«Konsol ilovasi» (C++) loyihasini yarating, platforma x64, va .cpp fayl mazmunini laboratoriya yoki Ustaxonadagi kod bilan almaştiring."],
      ["freeglut va GLEW ni vcpkg paket menejeri orqali örnating: ", el("code", null, "vcpkg install freeglut:x64-windows glew:x64-windows"), ", söngra ", el("code", null, "vcpkg integrate install"), ". GLEW OpenGL 1.2+ funksiyalari uçun kerak (VBO, GL_CLAMP_TO_EDGE va h.k.): bunda birinçi qatorda ", el("code", null, "#include <GL/glew.h>"), " ni ulang va glutCreateWindow dan keyin ", el("code", null, "glewInit()"), " ni çaqiring."],
      ["Rasmlarni yuklaş (stbi_load) uçun nothings/stb repozitoriyasidan stb_image.h faylini yuklab oling, loyihaga qöşing va ulaşdan oldin ", el("code", null, "#define STB_IMAGE_IMPLEMENTATION"), " deb yozing. Tekstura fayllarini loyiha papkasiga yoki .exe yoniga qöying: "].concat(texLinks(), ["."]),
      ["Dasturda M_PI özgarmasi işlatilsa, faylning birinçi qatoriga ", el("code", null, "#define _USE_MATH_DEFINES"), " yozing — usiz Visual C++ kompilyatori uni tanimaydi."],
      ["Yiğing va işga tuşiring (F5). Natija brauzerdagi oyna bilan bir xil böladi."]],
    faq: "Köp beriladigan savollar",
    qa: [["Kompyuter yöq — telefonda işlasa böladimi?", "Ha. Laboratoriyalar va Ustaxona mobil brauzerda işlaydi; taşqi klaviatura bilan qulayroq."],
      ["Notöğri fayl yuboribman. Nima qiliş kerak?", "Işni yana yuboring va izohda oldingi yuboriş xato ekanini yozing. Öqituvçi oxirgisini tekşiradi."],
      ["Boşqa talabalar mening kodimni köradimi?", "Kurs repozitoriysi oçiq, şuning uçun yuborilgan işlar hammaga körinadi. Köçirişni aniqlaş oson: har kimning öz varianti bor, işni qabul qilişda öqituvçi kod böyiça savollar beradi."],
      ["Kabinetga kiriş kodini unutdim.", "Öqituvçiga murojaat qiling — u yangisini beradi."]]
  };
  O.header("help", [{ text: T.topics, href: O.link("") }, { text: T.crumb }]);
  var main = el("main", { class: "wrap doc" }); document.body.appendChild(main);
  main.appendChild(el("div", { class: "pagehead flat" }, el("p", { class: "kicker" }, T.kicker), el("h1", null, T.h1)));
  main.appendChild(el("section", { class: "blk" }, el("h2", null, T.s1),
    el("ol", { class: "num" }, el("li", null, T.s1a), el("li", null, T.s1b), el("li", null, T.s1c))));
  main.appendChild(el("section", { class: "blk" }, el("h2", null, T.s2),
    el("ol", { class: "num" }, T.s2l.map(function (x) { return el("li", null, x); }))));
  main.appendChild(el("section", { class: "blk" }, el("h2", null, T.s3),
    el("dl", { class: "defs" }, [].concat.apply([], T.st.map(function (x) { return [el("dt", null, x[0]), el("dd", null, x[1])]; }))),
    el("p", null, T.s3p[0], el("a", { href: O.link("me/") }, T.s3p[1]), T.s3p[2])));
  main.appendChild(el("section", { class: "blk" }, el("h2", null, T.s4), el("p", null, T.s4p),
    el("ol", { class: "num" }, T.s4l.map(function (x) { return el("li", null, x); }))));
  main.appendChild(el("section", { class: "blk" }, el("h2", null, T.faq),
    T.qa.map(function (x) { return el("details", { class: "qa-i" }, el("summary", null, el("span", null, x[0])), el("div", { class: "qa-a" }, el("p", null, x[1]))); })));
  O.footer();
})();
