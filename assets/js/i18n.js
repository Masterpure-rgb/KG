/* i18n — OʻZ (asosiy) va RUS tiliga tarjimalar + til tanlash.
   Foydalanish: window.I.t("home.title") natija joriy tilda qaytadi.
   localStorage da saqlanadi "kg:lang" kaliti ostida ("uz" yoki "ru"). */
(function (global) {
  "use strict";

  var DICT = {
    uz: {
      "brand.name": "Kompyuter grafikasi",
      "brand.sub":  "Amaliy işlar",
      "lang.uz": "ÖZ",
      "lang.ru": "RUS",
      "lang.switch": "Tilni almaştiriş",

      "nav.topics": "Mavzular",
      "nav.sandbox": "Ustaxona",
      "nav.srsp": "Mustaqil iş",
      "nav.me": "Mening kabinetim",
      "nav.help": "Yordam",
      "nav.teacher": "Öqituvçiga",

      "home.hero.title": "«Kompyuter grafikasi» fani böyiça 15 ta amaliy iş",
      "home.hero.sub":   "Brauzer içida işlaydigan interaktiv C++ muhit. Heç narsa örnatiş şart emas.",
      "home.hero.cta":   "Birinçi işni boşlaş",
      "home.labs":       "Amaliy işlar",
      "home.lab":        "A",
      "home.theory":     "Nazariya",
      "home.practice":   "Amaliy iş",
      "home.explain":    "Qisqa izoh (audio)",
      "home.tasks":      "Topşiriqlar",
      "home.authors":    "Mualliflar",
      "home.univ":       "Muhammad al-Xorazmiy nomidagi Toşkent axborot texnologiyalari universiteti",

      "footer.doc":      "Uslubiy körsatma (Word)",
      "footer.pdf":      "Uslubiy körsatma (PDF)",
      "footer.submit":   "Qanday topşiriş kerak",

      "lab.theory":      "Nazariya",
      "lab.tasks":       "Topşiriqlar",
      "lab.audio":       "Audio izoh",
      "lab.run":         "Işga tuşiriş",
      "lab.check":       "Tekşiriş",
      "lab.reset":       "Dastlabkisiga qaytariş",
      "lab.download":    "Yuklab oliş .cpp",
      "lab.screenshot":  "Skrinşot",
      "lab.console":     "Konsol",
      "lab.state":       "OpenGL holati",
      "lab.steps":       "Qadamlar röyxati",

      "explain.listen":  "Audio tinglaş",
      "explain.transcript": "Matni",

      "me.title":        "Mening kabinetim",
      "me.attend":       "Davomat",
      "me.submitted":    "Topşirilgan işlar",
      "me.id":           "ID",
      "me.code":         "Kiriş kodi",
      "me.login":        "Kiriş",
      "me.logout":       "Çiqiş",

      "submit.title":    "Işni qanday topşiriş",
      "sandbox.title":   "Ustaxona — topşiriqlarni bajariş uçun kod oynasi",
      "srsp.title":      "Mustaqil iş (SRS)",

      "help.title":      "Yordam",
    },
    ru: {
      "brand.name": "Компьютерная графика",
      "brand.sub":  "Практические занятия",
      "lang.uz": "УЗБ",
      "lang.ru": "РУС",
      "lang.switch": "Переключить язык",

      "nav.topics": "Темы",
      "nav.sandbox": "Мастерская",
      "nav.srsp": "Самостоятельная работа",
      "nav.me": "Мой кабинет",
      "nav.help": "Помощь",
      "nav.teacher": "Преподавателю",

      "home.hero.title": "15 практических работ по курсу «Компьютерная графика»",
      "home.hero.sub":   "Интерактивная среда C++ в браузере. Ничего устанавливать не нужно.",
      "home.hero.cta":   "Начать с первой работы",
      "home.labs":       "Практические работы",
      "home.lab":        "A",
      "home.theory":     "Теория",
      "home.practice":   "Практика",
      "home.explain":    "Краткое объяснение (аудио)",
      "home.tasks":      "Задания",
      "home.authors":    "Авторы",
      "home.univ":       "Ташкентский университет информационных технологий имени Мухаммада аль-Хорезми",

      "footer.doc":      "Методичка (Word)",
      "footer.pdf":      "Методичка (PDF)",
      "footer.submit":   "Как сдать работу",

      "lab.theory":      "Теория",
      "lab.tasks":       "Задания",
      "lab.audio":       "Аудио объяснение",
      "lab.run":         "Запустить",
      "lab.check":       "Проверить",
      "lab.reset":       "Сбросить",
      "lab.download":    "Скачать .cpp",
      "lab.screenshot":  "Скриншот",
      "lab.console":     "Консоль",
      "lab.state":       "Состояние OpenGL",
      "lab.steps":       "Список шагов",

      "explain.listen":  "Прослушать аудио",
      "explain.transcript": "Текст",

      "me.title":        "Мой кабинет",
      "me.attend":       "Посещаемость",
      "me.submitted":    "Сданные работы",
      "me.id":           "ID",
      "me.code":         "Код доступа",
      "me.login":        "Войти",
      "me.logout":       "Выйти",

      "submit.title":    "Как сдать работу",
      "sandbox.title":   "Песочница — свободный редактор кода",
      "srsp.title":      "Самостоятельная работа (СРС)",

      "help.title":      "Помощь",
    }
  };

  var LANG_KEY = "kg:lang";
  var current = (function () {
    try { var s = localStorage.getItem(LANG_KEY); return (s === "ru" || s === "uz") ? s : "uz"; }
    catch (e) { return "uz"; }
  })();

  function t(key) {
    var d = DICT[current] || DICT.uz;
    return d[key] || (DICT.uz[key] || key);
  }

  function setLang(lang) {
    if (lang !== "uz" && lang !== "ru") return;
    if (lang === current) return;
    current = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("kg:lang", { detail: { lang: lang } }));
    // Sahifa qayta yuklash — eng oddiy va aniq
    location.reload();
  }

  function getLang() { return current; }

  function toggle() { setLang(current === "uz" ? "ru" : "uz"); }

  // Sahifa yuklanishida HTML lang atributini yangilash
  document.documentElement.lang = current;

  global.I = { t: t, setLang: setLang, getLang: getLang, toggle: toggle };
})(window);
