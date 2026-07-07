"use strict";

/* =====================================================
   ZUZINK LANGUAGE SYSTEM
===================================================== */

const translations = {

    en: {

        /* ==========================
           HEADER
        ========================== */

        chooseDate:
            "Choose Appointment Date",

        bookTitle:
            "Book Tattoo Session",

        /* ==========================
           FORM
        ========================== */

        name:
            "Name",

        email:
            "Email",

        phone:
            "Phone",

        size:
            "Tattoo Size",

        placement:
            "Placement",

        style:
            "Tattoo Style",

        selectedDate:
            "Select a date from the calendar",

        selectTime:
            "Select Time",

        referenceImages:
            "Reference Images",

        notes:
            "Describe your tattoo idea...",

        confirmBooking:
            "Confirm Booking",

        /* ==========================
           TIPS
        ========================== */

        tipsTitle:
            "Before Your Appointment",

        tip1:
            "Eat before arriving.",

        tip2:
            "Stay hydrated.",

        tip3:
            "Bring reference images.",

        tip4:
            "Arrive 10 minutes early.",

        /* ==========================
           STATUS
        ========================== */

        loading:
            "Loading...",

        loadingTimes:
            "Loading available times...",

        booking:
            "Booking...",

        bookingSuccess:
            "Booking Confirmed!",

        noTimes:
            "No available times",

        selectDateFirst:
            "Select a date first",

        selectSizeFirst:
            "Select tattoo size first",

        unableTimes:
            "Unable to load available times",

        unableBooking:
            "Unable to create booking.",

        bookingCreated:
            "A confirmation email has been sent.",

        bookingId:
            "Booking ID",

        today:
            "Today"

    },

    bg: {

        /* ==========================
           HEADER
        ========================== */

        chooseDate:
            "Изберете дата",

        bookTitle:
            "Запазете час",

        /* ==========================
           FORM
        ========================== */

        name:
            "Име",

        email:
            "Имейл",

        phone:
            "Телефон",

        size:
            "Размер",

        placement:
            "Място",

        style:
            "Стил",

        selectedDate:
            "Изберете дата от календара",

        selectTime:
            "Изберете час",

        referenceImages:
            "Референтни снимки",

        notes:
            "Опишете идеята си...",

        confirmBooking:
            "Запази час",

        /* ==========================
           TIPS
        ========================== */

        tipsTitle:
            "Преди посещението",

        tip1:
            "Хапнете преди часа.",

        tip2:
            "Пийте достатъчно вода.",

        tip3:
            "Носете примерни снимки.",

        tip4:
            "Елате 10 минути по-рано.",

        /* ==========================
           STATUS
        ========================== */

        loading:
            "Зареждане...",

        loadingTimes:
            "Зареждане на свободните часове...",

        booking:
            "Запазване...",

        bookingSuccess:
            "Часът е запазен!",

        noTimes:
            "Няма свободни часове",

        selectDateFirst:
            "Първо изберете дата",

        selectSizeFirst:
            "Първо изберете размер",

        unableTimes:
            "Неуспешно зареждане",

        unableBooking:
            "Неуспешно записване.",

        bookingCreated:
            "Изпратен е имейл за потвърждение.",

        bookingId:
            "Номер на резервация",

        today:
            "Днес"

    }

};

let currentLanguage =

localStorage.getItem("language") || "en";

function t(key){

    return translations[currentLanguage][key] || key;

}/* =====================================================
   APPLY TRANSLATIONS
===================================================== */

function applyTranslations(){

    document

    .querySelectorAll("[data-i18n]")

    .forEach(element=>{

        const key=

        element.dataset.i18n;

        if(translations[currentLanguage][key]){

            element.textContent=

            translations[currentLanguage][key];

        }

    });

    document

    .querySelectorAll("[data-i18n-placeholder]")

    .forEach(element=>{

        const key=

        element.dataset.i18nPlaceholder;

        if(translations[currentLanguage][key]){

            element.placeholder=

            translations[currentLanguage][key];

        }

    });

    /* =====================================
       BUTTON
    ===================================== */

    const confirmButton=

    document.getElementById(

        "confirmButton"

    );

    if(confirmButton){

        confirmButton.textContent=

        t("confirmBooking");

    }

    /* =====================================
       TIME PLACEHOLDER
    ===================================== */

    const time=

    document.getElementById(

        "time"

    );

    if(

        time &&

        time.options.length===1 &&

        time.value===""

    ){

        time.options[0].text=

        t("selectTime");

    }

    /* =====================================
       DATE PLACEHOLDER
    ===================================== */

    const selectedDate=

    document.getElementById(

        "selectedDate"

    );

    if(selectedDate){

        selectedDate.placeholder=

        t("selectedDate");

    }

}

/* =====================================================
   LANGUAGE SWITCHING
===================================================== */

function changeLanguage(language){

    currentLanguage=

    language;

    localStorage.setItem(

        "language",

        language

    );

    applyTranslations();

    document.dispatchEvent(

        new CustomEvent(

            "languageChanged"

        )

    );

}/* =====================================================
   FLAG BUTTONS
===================================================== */

const englishButton =
document.getElementById("englishButton");

const bulgarianButton =
document.getElementById("bulgarianButton");

if(englishButton){

    englishButton.addEventListener(

        "click",

        ()=>{

            changeLanguage("en");

        }

    );

}

if(bulgarianButton){

    bulgarianButton.addEventListener(

        "click",

        ()=>{

            changeLanguage("bg");

        }

    );

}

/* =====================================================
   ACTIVE FLAG
===================================================== */

function updateActiveFlag(){

    if(!englishButton || !bulgarianButton){

        return;

    }

    englishButton.classList.remove("active-language");

    bulgarianButton.classList.remove("active-language");

    if(currentLanguage==="en"){

        englishButton.classList.add(

            "active-language"

        );

    }

    else{

        bulgarianButton.classList.add(

            "active-language"

        );

    }

}

/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        applyTranslations();

        updateActiveFlag();

    }

);

/* =====================================================
   UPDATE WHEN LANGUAGE CHANGES
===================================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        applyTranslations();

        updateActiveFlag();

    }

);

/* =====================================================
   GLOBAL ACCESS
===================================================== */

window.t = t;

window.changeLanguage = changeLanguage;

window.applyTranslations = applyTranslations;