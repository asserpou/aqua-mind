// ==============================
// 🌍 TRANSLATIONS
// ==============================
const translations = {
    en: {
        home:"Home", stories:"Stories & Charts", aquaguard:"AquaGuard",
        interactive:"InteractiveHouse", marketplace:"MarketPlace",
        hero1:"Smarter Water", hero2:"Solutions for a Greener", hero3:"Tomorrow",
        btn1:"AquaGuard", btn2:"InteractiveHouse",
        aboutTitle:"Who is AquaMind",
        aboutText:"AquaMind delivers an interactive experience through a gamified learning journey and a virtual smart house, helping users understand how daily actions affect water consumption. By combining fun challenges with real-life simulations, the platform builds awareness, encourages responsible behavior, and promotes sustainable water use in a simple and engaging way.",
        feature1Title:"Raise Awareness", feature1Text:"Educate communities about water scarcity",
        feature2Title:"Gamified Learning", feature2Text:"Engage users with fun challenges & rewards.",
        feature3Title:"Sustainable Impact", feature3Text:"Drive positive change and responsible use.",
        tipsTitle:"AquaMind's Saving Tips",
        offerTitle:"What We Offer",
        offer1Title:"AquaGuard", offer1Text:"Game-based experience that teaches water conservation through challenges.",
        offer2Title:"Interactive House", offer2Text:"Explore a virtual home and learn how daily actions affect water usage.",
        offer3Title:"Stories & Charts", offer3Text:"Visual insights and real stories showing the impact of water consumption.",
        offer4Title:"Market Place", offer4Text:"Browse eco-friendly products that help reduce water consumption daily.",
        footerText:"Empowering communities with smart water solutions for a sustainable future.",
        footerLinks:"Quick Links", footerRights:"All rights reserved.", followUs:"Follow Us",
        alertTitle:"Water is Running Out!", alertMessage:"Take action now to save water and protect our future!", alertButton:"Play AquaGuard Game"
    },
    ar: {
        home:"الرئيسية", stories:"قصص ورسوم", aquaguard:"أكوا جارد",
        interactive:"المنزل التفاعلي", marketplace:"السوق",
        hero1:"مياه أذكى", hero2:"حلول من أجل غدٍ أكثر خضرة", hero3:"مستقبل أفضل",
        btn1:"أكوا جارد", btn2:"المنزل التفاعلي",
        aboutTitle:"من هو أكوا مايند",
        aboutText:"يقدم أكوا مايند تجربة تفاعلية من خلال رحلة تعليمية ممتعة ومنزل ذكي افتراضي، مما يساعد المستخدمين على فهم كيفية تأثير الإجراءات اليومية على استهلاك المياه. من خلال الجمع بين التحديات الممتعة والمحاكاة الواقعية، تبني المنصة الوعي وتشجع السلوك المسؤول وتعزز الاستخدام المستدام للمياه بطريقة بسيطة وجذابة.",
        feature1Title:"رفع الوعي", feature1Text:"تثقيف المجتمعات حول ندرة المياه",
        feature2Title:"التعلم الممتع", feature2Text:"إشراك المستخدمين بتحديات ومكافآت ممتعة",
        feature3Title:"تأثير مستدام", feature3Text:"دفع التغيير الإيجابي والاستخدام المسؤول",
        tipsTitle:"نصائح أكوا مايند للتوفير",
        offerTitle:"ما نقدمه",
        offer1Title:"أكوا جارد", offer1Text:"تجربة قائمة على الألعاب تعلم الحفاظ على المياه من خلال التحديات.",
        offer2Title:"المنزل التفاعلي", offer2Text:"استكشف منزلاً افتراضياً وتعلم كيف تؤثر الإجراءات اليومية على استخدام المياه.",
        offer3Title:"قصص ورسوم بيانية", offer3Text:"رؤى بصرية وقصص حقيقية توضح تأثير استهلاك المياه.",
        offer4Title:"السوق", offer4Text:"تصفح المنتجات الصديقة للبيئة التي تساعد على تقليل استهلاك المياه يومياً.",
        footerText:"تمكين المجتمعات بحلول مياه ذكية من أجل مستقبل مستدام.",
        footerLinks:"روابط سريعة", footerRights:"جميع الحقوق محفوظة.", followUs:"تابعنا",
        alertTitle:"المياه تنفد!", alertMessage:"اتخذ إجراءً الآن لتوفير المياه وحماية مستقبلنا!", alertButton:"العب لعبة أكوا جارد"
    }
};

// ==============================
// 💧 TIPS DATA — فوق عشان setLanguage تلاقيهم
// ==============================
const tipsData = {
    en: [
        { text: "Fixing leaks can save up to <span>10%</span> of water usage", progress: 30 },
        { text: "Taking shorter showers saves <span>25 gallons</span> per day", progress: 60 },
        { text: "Using a dishwasher is <span>50%</span> more efficient than hand washing", progress: 50 }
    ],
    ar: [
        { text: "إصلاح التسريبات يوفّر حتى <span>10%</span> من استهلاك المياه", progress: 30 },
        { text: "الاستحمام القصير يوفّر <span>95 لتراً</span> يومياً", progress: 60 },
        { text: "غسالة الأطباق <span>أكثر كفاءة بنسبة 50%</span> من الغسيل اليدوي", progress: 50 }
    ]
};

// ==============================
// STATE VARIABLES — كلهم فوق
// ==============================
let tips = tipsData.en;
let currentTipIndex = 0;
let tipInterval;

// ==============================
// ELEMENTS
// ==============================
const langToggle   = document.getElementById("lang-toggle");
const langMenu     = document.getElementById("lang-menu");
const langOptions  = document.querySelectorAll(".lang-option");
const htmlEl       = document.documentElement;
const themeToggle  = document.getElementById("theme-toggle");

const tipText      = document.querySelector(".tip-text p");
const progressFill = document.querySelector(".progress");
const dots         = document.querySelectorAll(".dots span");
const arrowBtn     = document.querySelector(".arrow i");

// ==============================
// 🌍 LANGUAGE
// ==============================
let currentLang = localStorage.getItem("language") || "en";
if (!translations[currentLang]) currentLang = "en";

function setLanguage(lang) {
    const isAr = lang === "ar";
    htmlEl.setAttribute("dir", isAr ? "rtl" : "ltr");

    document.body.style.fontFamily = isAr
        ? "'Segoe UI','Cairo','Tahoma',Arial,sans-serif"
        : "'Segoe UI',Arial,sans-serif";

    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.dataset.key;
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    if (arrowBtn) arrowBtn.style.transform = isAr ? "scaleX(-1)" : "scaleX(1)";
    document.querySelectorAll(".title-icon-left,.title-icon-right").forEach(img => {
        img.style.transform = isAr ? "scaleX(-1)" : "scaleX(1)";
    });

    // تحديث نصوص التيبس
    tips = tipsData[lang] || tipsData.en;
    currentTipIndex = 0;
    if (tipText && progressFill && dots.length > 0) {
        tipText.innerHTML = tips[0].text;
        progressFill.style.width = tips[0].progress + "%";
        dots.forEach((d, i) => d.classList.toggle("active", i === 0));
    }
}

setLanguage(currentLang);

langToggle.addEventListener("click", e => {
    e.stopPropagation();
    langMenu.classList.toggle("show");
});
document.addEventListener("click", () => langMenu.classList.remove("show"));

langOptions.forEach(opt => {
    opt.addEventListener("click", () => {
        const lang = opt.dataset.lang;
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("language", lang);
        setLanguage(lang);
        langMenu.classList.remove("show");
    });
});

// ==============================
// 🌊 WAVE COLORS
// ==============================
function updateWaveColors(isDark) {
    const uses = document.querySelectorAll(".moving-waves use");
    const colors = isDark
        ? ["#0d2137","#091828","#050f1a"]
        : ["#def2fc","#caeafa","#c0e7fa"];
    uses.forEach((u, i) => { if (colors[i]) u.setAttribute("fill", colors[i]); });
}

// ==============================
// 🌙 DARK MODE
// ==============================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.classList.replace("fa-sun","fa-moon");
    updateWaveColors(true);
} else {
    updateWaveColors(false);
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
        themeToggle.classList.replace("fa-sun","fa-moon");
    } else {
        themeToggle.classList.replace("fa-moon","fa-sun");
    }
    updateWaveColors(isDark);
});

// ==============================
// 📜 NAVBAR SCROLL
// ==============================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ==============================
// 🍔 HAMBURGER MENU
// ==============================
const hamburger = document.getElementById("hamburger");
const menu = document.querySelector(".menu");

if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        menu.classList.toggle("active");
    });
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            menu.classList.remove("active");
        });
    });
    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
            hamburger.classList.remove("active");
            menu.classList.remove("active");
        }
    });
}

// ==============================
// 👁️ SCROLL REVEAL
// ==============================
function initScrollReveal() {
    const els = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => observer.observe(el));
}
initScrollReveal();

// ==============================
// 💧 TIPS CAROUSEL
// ==============================
function updateTip(index) {
    if (!tipText) return;
    tipText.style.opacity = "0";
    setTimeout(() => {
        tipText.innerHTML = tips[index].text;
        if (progressFill) progressFill.style.width = tips[index].progress + "%";
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
        tipText.style.opacity = "1";
    }, 300);
}

function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    updateTip(currentTipIndex);
}

function startTipRotation() {
    tipInterval = setInterval(nextTip, 8000);
}

if (arrowBtn) {
    arrowBtn.addEventListener("click", () => {
        clearInterval(tipInterval);
        nextTip();
        startTipRotation();
    });
}

if (tipText && progressFill && dots.length > 0) {
    startTipRotation();
}

// ==============================
// 💧 WATER ALERT POPUP
// ==============================
let countdownValue = 10;
let countdownInterval;

function showWaterAlert() {
    const overlay = document.getElementById("waterAlertOverlay");
    if (overlay) { overlay.classList.add("show"); startCountdown(); }
}

function closeWaterAlert() {
    const overlay = document.getElementById("waterAlertOverlay");
    if (overlay) {
        overlay.classList.remove("show");
        clearInterval(countdownInterval);
        resetCountdown();
        sessionStorage.setItem("waterAlertShown","true");
    }
}

function goToAquaGuard() {
    sessionStorage.setItem("waterAlertShown","true");
    clearInterval(countdownInterval);
    window.location.href = "aquaguard.html";
}

function startCountdown() {
    countdownValue = 10;
    const numberEl = document.getElementById("countdownNumber");
    const circleEl = document.getElementById("countdownCircle");
    const circumference = 2 * Math.PI * 45;
    if (circleEl) {
        circleEl.style.strokeDasharray = circumference;
        circleEl.style.strokeDashoffset = 0;
    }
    countdownInterval = setInterval(() => {
        countdownValue--;
        if (numberEl) numberEl.textContent = countdownValue;
        if (countdownValue <= 5) {
            if (numberEl) numberEl.classList.add("danger");
            if (circleEl) circleEl.classList.add("danger");
        }
        if (circleEl) {
            circleEl.style.strokeDashoffset = circumference - (countdownValue / 10) * circumference;
        }
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            setTimeout(() => {
                sessionStorage.setItem("waterAlertShown","true");
                window.location.href = "aquaguard.html";
            }, 500);
        }
    }, 1000);
}

function resetCountdown() {
    countdownValue = 10;
    const numberEl = document.getElementById("countdownNumber");
    const circleEl = document.getElementById("countdownCircle");
    if (numberEl) { numberEl.textContent = "10"; numberEl.classList.remove("danger"); }
    if (circleEl) { circleEl.style.strokeDashoffset = 0; circleEl.classList.remove("danger"); }
}

window.addEventListener("load", () => {
    const isHome = window.location.pathname.endsWith("index.html")
        || window.location.pathname.endsWith("/")
        || window.location.pathname === "";
    if (isHome && !sessionStorage.getItem("waterAlertShown")) showWaterAlert();
});

const alertOverlay = document.getElementById("waterAlertOverlay");
if (alertOverlay) {
    alertOverlay.addEventListener("click", e => {
        if (e.target.id === "waterAlertOverlay") closeWaterAlert();
    });
}