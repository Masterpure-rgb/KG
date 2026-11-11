/* i18n — OʻZ (asosiy) va RUS tiliga tarjimalar + til tanlash.
   Foydalanish: window.I.t("home.title") natija joriy tilda qaytadi.
   localStorage da saqlanadi "kg:lang" kaliti ostida ("uz" yoki "ru"). */
(function (global) {
  "use strict";

  var DICT = {
    uz: {
      "brand.name": "Kompyuter grafika",
      "brand.sub":  "Amaliy ishlar",
      "lang.uz": "OʻZ",
      "lang.ru": "RUS",
      "lang.switch": "Tilni almaştiriş",

      "nav.topics": "Mavzular",
      "nav.sandbox": "Qumdon",
      "nav.srsp": "SRS va SRSP",
      "nav.me": "Mening kabinetim",
      "nav.help": "Yordam",
      "nav.teacher": "Oʻqituvchiga",

      "home.hero.title": "«Kompyuter grafika» fani boʻyiça 15 ta amaliy iş",
      "home.hero.sub":   "Brauzer ichida ishlaydigan interaktiv C++ muhit. Hech narsa oʻrnatish shart emas.",
      "home.hero.cta":   "Birinchi ishni boşlaş",
      "home.labs":       "Amaliy ishlar",
      "home.lab":        "A",
      "home.theory":     "Nazariya",
      "home.practice":   "Amaliy iş",
      "home.explain":    "Qisqa izoh (audio)",
      "home.tasks":      "Topşiriqlar",
      "home.authors":    "Mualliflar",
      "home.univ":       "Muhammad al-Xorazmiy nomidagi Toşkent axborot texnologiyalari universiteti",

      "footer.doc":      "Uslubiy koʻrsatma (Word)",
      "footer.submit":   "Qanday topşirish kerak",

      "lab.theory":      "Nazariya",
      "lab.tasks":       "Topşiriqlar",
      "lab.audio":       "Audio izoh",
      "lab.run":         "Ishga tushirish",
      "lab.check":       "Tekşiriş",
      "lab.reset":       "Dastlabkisiga qaytarish",
      "lab.download":    "Skaçat .cpp",
      "lab.screenshot":  "Skrinşot",
      "lab.console":     "Konsol",
      "lab.state":       "OpenGL holati",
      "lab.steps":       "Qadamlar roʻyxati",

      "explain.listen":  "Audio tinglash",
      "explain.transcript": "Matni",

      "me.title":        "Mening kabinetim",
      "me.attend":       "Davomat",
      "me.submitted":    "Topşirilgan ishlar",
      "me.id":           "ID",
      "me.code":         "Kirish kodi",
      "me.login":        "Kirish",
      "me.logout":       "Chiqish",

      "submit.title":    "Ishni qanday topşiriş",
      "sandbox.title":   "Qumdon — erkin kod muharriri",
      "srsp.title":      "Mustaqil ishlar (SRS) va SRSP",

      "help.title":      "Yordam",
    },
    ru: {
      "brand.name": "Компьютерная графика",
      "brand.sub":  "Практические занятия",
      "lang.uz": "УЗБ",
      "lang.ru": "РУС",
      "lang.switch": "Переключить язык",

      "nav.topics": "Темы",
      "nav.sandbox": "Песочница",
      "nav.srsp": "СРС и СРСП",
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
      "srsp.title":      "Самостоятельная работа (СРС) и СРСП",

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
