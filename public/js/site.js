/*==================================================
ZUZINK
SITE.JS
==================================================*/

"use strict";

/*==================================================
ELEMENTS
==================================================*/

const navbar =
document.querySelector(".navbar");

const menuButton =
document.querySelector(".menuButton");

const mobileMenu =
document.querySelector(".mobileMenu");

const scrollTopButton =
document.getElementById("scrollTop");

const faqItems =
document.querySelectorAll(".faqItem");

const galleryImages =
document.querySelectorAll(".galleryItem img");

const navLinks =
document.querySelectorAll("nav a");

const sections =
document.querySelectorAll("section");

const englishButton =
document.getElementById("englishBtn");

const bulgarianButton =
document.getElementById("bulgarianBtn");

/*==================================================
NAVBAR
==================================================*/

window.addEventListener(

"scroll",

()=>{

    if(window.scrollY>80){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

}

);

/*==================================================
SCROLL TO TOP
==================================================*/

if(scrollTopButton){

    scrollTopButton.style.opacity="0";

    scrollTopButton.style.pointerEvents="none";

    window.addEventListener(

    "scroll",

    ()=>{

        if(window.scrollY>500){

            scrollTopButton.style.opacity="1";

            scrollTopButton.style.pointerEvents="all";

        }

        else{

            scrollTopButton.style.opacity="0";

            scrollTopButton.style.pointerEvents="none";

        }

    });

    scrollTopButton.addEventListener(

    "click",

    ()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*==================================================
FAQ
==================================================*/

faqItems.forEach(item=>{

    const button =
    item.querySelector("button");

    button.addEventListener(

    "click",

    ()=>{

        faqItems.forEach(faq=>{

            if(faq!==item){

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


/*==================================================
TRANSLATIONS
==================================================*/

const translations = {

    en: {

        home:"Home",

        portfolio:"Portfolio",

        artist:"Artist",

        services:"Services",

        contact:"Contact",

        book:"Book Appointment",

        subtitle:"Minimal • Elegant • Timeless",

        heroTitle:"Fine Line Tattoo Studio",

        heroText:"Professional fine line tattoos, custom artwork and premium quality in a relaxed studio environment.",

        viewPortfolio:"View Portfolio",

        portfolioTitle:"Portfolio",

        portfolioDescription:"Some of our recent work",

        aboutArtist:"ABOUT THE ARTIST",

        artistTitle:"Hi, I'm Zlatina",

        artistText1:"I specialize in elegant fine line, minimalistic and custom tattoo designs.",

        artistText2:"Every tattoo is carefully planned to match your style and personality. Your comfort, safety and satisfaction are always my highest priority.",

        servicesTitle:"Services",

        serviceFineLine:"Fine Line",

        serviceFineLineText:"Elegant and timeless tattoos with exceptional precision.",

        serviceCustom:"Custom Designs",

        serviceCustomText:"Every tattoo is designed specifically for you.",

        serviceSafe:"Safe & Sterile",

        serviceSafeText:"Professional hygiene and premium equipment.",

        serviceInk:"Premium Ink",

        serviceInkText:"Long-lasting, high-quality pigments.",

        faqTitle:"Frequently Asked Questions",

        faqQuestion1:"Does getting tattooed hurt?",

        faqAnswer1:"Pain depends on placement, but every appointment is done as comfortably as possible.",

        faqQuestion2:"How should I prepare?",

        faqAnswer2:"Eat before your appointment, stay hydrated and avoid alcohol.",

        faqQuestion3:"How long does healing take?",

        faqAnswer3:"Usually between 2 and 4 weeks.",

        faqQuestion4:"Can I bring my own design?",

        faqAnswer4:"Absolutely. Reference images are always welcome.",

        contactLabel:"CONTACT",

        contactTitle:"Let's Talk",

        contactDescription:"Whether it's your first tattoo or your next masterpiece, I'd love to hear your idea.",

        studioLabel:"Studio",

        phoneLabel:"Phone",

        emailLabel:"Email",

        footerSubtitle:"Fine Line Tattoo Studio",

        copyright:"© 2026 ZuzInk Tattoo Studio. All Rights Reserved."

    },

    bg: {

        home:"Начало",

        portfolio:"Портфолио",

        artist:"Артист",

        services:"Услуги",

        contact:"Контакти",

        book:"Запази Час",

        subtitle:"Минималистични • Елегантни • Вечни",

        heroTitle:"Студио за Фини Татуировки",

        heroText:"Професионални фини татуировки, индивидуални дизайни и първокласно качество в спокойна студийна атмосфера.",

        viewPortfolio:"Портфолио",

        portfolioTitle:"Портфолио",

        portfolioDescription:"Част от последните ми творби",

        aboutArtist:"ЗА АРТИСТА",

        artistTitle:"Здравей, аз съм Златина",

        artistText1:"Специализирам във фини, минималистични и персонализирани татуировки.",

        artistText2:"Всяка татуировка се планира внимателно, за да отговаря на вашия стил и индивидуалност. Вашият комфорт, безопасност и удовлетворение винаги са мой основен приоритет.",

        servicesTitle:"Услуги",

        serviceFineLine:"Фини Татуировки",

        serviceFineLineText:"Елегантни и вечни татуировки с изключителна прецизност.",

        serviceCustom:"Индивидуален Дизайн",

        serviceCustomText:"Всяка татуировка се създава специално за вас.",

        serviceSafe:"Безопасност и Хигиена",

        serviceSafeText:"Професионална хигиена и първокласно оборудване.",

        serviceInk:"Премиум Мастила",

        serviceInkText:"Дълготрайни висококачествени пигменти.",

        faqTitle:"Често Задавани Въпроси",

        faqQuestion1:"Боли ли поставянето на татуировка?",

        faqAnswer1:"Болката зависи от мястото, но всяка процедура се извършва възможно най-комфортно.",

        faqQuestion2:"Как трябва да се подготвя?",

        faqAnswer2:"Хапнете преди часа си, пийте достатъчно вода и избягвайте алкохол.",

        faqQuestion3:"Колко време отнема заздравяването?",

        faqAnswer3:"Обикновено между 2 и 4 седмици.",

        faqQuestion4:"Мога ли да донеса собствен дизайн?",

        faqAnswer4:"Разбира се. Референтни снимки винаги са добре дошли.",

        contactLabel:"КОНТАКТИ",

        contactTitle:"Нека поговорим",

        contactDescription:"Независимо дали това е първата ви татуировка или следващият ви шедьовър, ще се радвам да чуя вашата идея.",

        studioLabel:"Студио",

        phoneLabel:"Телефон",

        emailLabel:"Имейл",

        footerSubtitle:"Студио за Фини Татуировки",

        copyright:"© 2026 ZuzInk Tattoo Studio. Всички права запазени."

    }

};

/*==================================================
LANGUAGE SYSTEM
==================================================*/

function setLanguage(lang){

    localStorage.setItem(

        "language",

        lang

    );

    document.documentElement.lang=lang;

    document
    .querySelectorAll("[data-i18n]")
    .forEach(element=>{

        const key=

        element.dataset.i18n;

        if(

            translations[lang] &&
            translations[lang][key]

        ){

            element.textContent=

            translations[lang][key];

        }

    });

}

if(englishButton){

    englishButton.addEventListener(

    "click",

    ()=>{

        setLanguage("en");

    });

}

if(bulgarianButton){

    bulgarianButton.addEventListener(

    "click",

    ()=>{

        setLanguage("bg");

    });

}

const savedLanguage=

localStorage.getItem(

"language"

)||"en";

setLanguage(savedLanguage);
/*==================================================
SMOOTH SCROLL
==================================================*/

document
.querySelectorAll('a[href^="#"]')
.forEach(link=>{

    link.addEventListener("click",event=>{

        const href=

        link.getAttribute("href");

        if(href==="#") return;

        const target=

        document.querySelector(href);

        if(!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

        if(mobileMenu){

            mobileMenu.classList.remove("active");

        }

    });

});

/*==================================================
ACTIVE NAVIGATION
==================================================*/

function updateActiveNav(){

    let current="";

    sections.forEach(section=>{

        const top=

        section.offsetTop-120;

        const height=

        section.offsetHeight;

        if(

            window.scrollY>=top &&
            window.scrollY<top+height

        ){

            current=section.id;

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href")==="#" + current

        ){

            link.classList.add("active");

        }

    });

}

window.addEventListener(

"scroll",

updateActiveNav

);

/*==================================================
SCROLL REVEAL
==================================================*/

const revealItems=

document.querySelectorAll(

".portfolio,.artist,.services,.faq,.contact"

);

function revealSections(){

    const trigger=

    window.innerHeight*0.85;

    revealItems.forEach(section=>{

        const top=

        section.getBoundingClientRect().top;

        if(top<trigger){

            section.classList.add("show");

        }

    });

}

window.addEventListener(

"scroll",

revealSections

);

window.addEventListener(

"load",

revealSections

);

/*==================================================
MOBILE MENU
==================================================*/

if(menuButton && mobileMenu){

    menuButton.addEventListener(

    "click",

    ()=>{

        mobileMenu.classList.toggle(

        "active"

        );

    });

}

/*==================================================
PRELOAD IMAGES
==================================================*/

window.addEventListener(

"load",

()=>{

    document
    .querySelectorAll("img")
    .forEach(image=>{

        const preload=

        new Image();

        preload.src=

        image.src;

    });

});

/*==================================================
INITIALISE
==================================================*/

window.addEventListener(

"load",

()=>{

    revealSections();

    updateActiveNav();

    console.log(

        "%c✔ ZUZINK WEBSITE READY",

        "color:#C7A66A;font-size:18px;font-weight:bold;"

    );

});

/*==================================================
END OF FILE
==================================================*/