"use strict";

/* ==========================================
   CONFIG
========================================== */

const API = "/api";

let calendar = null;
let selectedDate = null;

/* ==========================================
   ELEMENTS
========================================== */

const bookingForm = document.getElementById("bookingForm");

const calendarElement = document.getElementById("calendar");

const tattooType = document.getElementById("tattooType");
const placement = document.getElementById("placement");
const style = document.getElementById("style");
const time = document.getElementById("time");

const selectedDateInput =
document.getElementById("selectedDate");

const imageInput =
document.getElementById("referenceImages");

const preview =
document.getElementById("preview");

const bookingMessage =
document.getElementById("bookingMessage");

const confirmButton =
document.getElementById("confirmButton");

/* ==========================================
   STATIC DATA
========================================== */

const tattooTypes = [

"Fine Line Text",
"5 cm",
"10 cm",
"15 cm",
"20 cm",
"Big Tattoo"

];

const placements = [

"Arm",
"Forearm",
"Hand",
"Chest",
"Back",
"Shoulder",
"Neck",
"Leg",
"Thigh",
"Calf",
"Foot",
"Ribs",
"Hip",
"Other"

];

const styles = [

"Fine Line",
"Minimal",
"Blackwork",
"Realism",
"Traditional",
"Neo Traditional",
"Anime",
"Lettering",
"Geometric",
"Other"

];

/* ==========================================
   HELPERS
========================================== */

function showMessage(message,color="#C7A66A"){

bookingMessage.innerHTML=message;
bookingMessage.style.color=color;

}

function clearMessage(){

bookingMessage.innerHTML="";

}

/* ==========================================
   LOAD SELECTS
========================================== */

function loadTattooTypes(){

tattooType.innerHTML=
'<option value="">Tattoo Size</option>';

tattooTypes.forEach(type=>{

tattooType.innerHTML+=
`<option value="${type}">${type}</option>`;

});

}

function loadPlacements(){

placement.innerHTML=
'<option value="">Placement</option>';

placements.forEach(item=>{

placement.innerHTML+=
`<option value="${item}">${item}</option>`;

});

}

function loadStyles(){

style.innerHTML=
'<option value="">Tattoo Style</option>';

styles.forEach(item=>{

style.innerHTML+=
`<option value="${item}">${item}</option>`;

});

}

/* ==========================================
   IMAGE PREVIEW
========================================== */

imageInput.addEventListener(

"change",

()=>{

preview.innerHTML="";

[...imageInput.files]

.slice(0,5)

.forEach(file=>{

const reader=new FileReader();

reader.onload=e=>{

const wrapper=
document.createElement("div");

wrapper.className="previewItem";

const img=
document.createElement("img");

img.src=e.target.result;

wrapper.appendChild(img);

preview.appendChild(wrapper);

};

reader.readAsDataURL(file);

});

}

);
/* ==========================================
   CALENDAR
========================================== */

function initializeCalendar() {

    if (!calendarElement) return;

    calendar = new FullCalendar.Calendar(

        calendarElement,

        {

            initialView: "dayGridMonth",

            height: "auto",

            selectable: true,

            nowIndicator: true,

            fixedWeekCount: false,

            showNonCurrentDates: false,

            headerToolbar: {

                left: "prev,next",

                center: "title",

                right: "today"

            },

            buttonText: {

                today: "Today"

            },

            dateClick: async function(info) {

                const today = new Date();

                today.setHours(0,0,0,0);

                if(info.date < today){

                    showMessage(

                        "You cannot book past dates.",

                        "#ff6b6b"

                    );

                    return;

                }

                clearMessage();

                selectedDate = info.dateStr;

                selectedDateInput.value = selectedDate;

                document

                .querySelectorAll(".selected-date")

                .forEach(day=>{

                    day.classList.remove(

                        "selected-date"

                    );

                });

                info.dayEl.classList.add(

                    "selected-date"

                );

                await loadAvailableTimes();

            },

            dayCellDidMount:function(info){

                const today = new Date();

                today.setHours(0,0,0,0);

                if(info.date < today){

                    info.el.classList.add(

                        "past-date"

                    );

                }

                if(

                    info.date.toDateString() ===

                    today.toDateString()

                ){

                    info.el.classList.add(

                        "today-date"

                    );

                }

            }

        }

    );

    calendar.render();

}

/* ==========================================
   LOAD BOOKINGS
========================================== */

async function loadAppointments(){

    try{

        const response = await fetch(

            API + "/appointments"

        );

        const data = await response.json();

        if(!data.success){

            return;

        }

        calendar.removeAllEvents();

        const dayCounter = {};

        data.bookings.forEach(booking=>{

            calendar.addEvent({

                title:"Booked",

                start:booking.start,

                end:booking.end,

                display:"background",

                color:"#7A0019"

            });

            const day =

            booking.start.substring(0,10);

            dayCounter[day] =

            (dayCounter[day] || 0) + 1;

        });

        Object.keys(dayCounter)

        .forEach(day=>{

            if(dayCounter[day] >= 8){

                const cell =

                document.querySelector(

                    `[data-date="${day}"]`

                );

                if(cell){

                    cell.classList.add(

                        "fully-booked"

                    );

                }

            }

        });

    }

    catch(err){

        console.error(err);

    }

}
/* ==========================================
   AVAILABLE TIMES
========================================== */

async function loadAvailableTimes(){

    time.disabled = true;

    time.innerHTML =

    `<option>

        Loading available times...

    </option>`;

    if(!selectedDate){

        time.innerHTML =

        `<option>

            Select a date first

        </option>`;

        time.disabled = false;

        return;

    }

    if(!tattooType.value){

        time.innerHTML =

        `<option>

            Select tattoo size first

        </option>`;

        time.disabled = false;

        return;

    }

    try{

        const response = await fetch(

            `${API}/available-slots?date=${selectedDate}&tattooType=${encodeURIComponent(tattooType.value)}`

        );

        const data = await response.json();

        time.innerHTML = "";

        if(

            !data.success ||

            data.slots.length === 0

        ){

            time.innerHTML =

            `<option>

                No available times

            </option>`;

            time.disabled = false;

            return;

        }

        const placeholder =

        document.createElement(

            "option"

        );

        placeholder.value = "";

        placeholder.textContent =

        "Select Time";

        placeholder.selected = true;

        placeholder.disabled = true;

        time.appendChild(

            placeholder

        );

        data.slots.forEach(slot=>{

            const option =

            document.createElement(

                "option"

            );

            option.value = slot;

            option.textContent = slot;

            time.appendChild(

                option

            );

        });

        time.disabled = false;

        showMessage(

            `${data.slots.length} available time${data.slots.length===1?"":"s"} found.`,

            "#69db7c"

        );

    }

    catch(err){

        console.error(err);

        time.innerHTML =

        `<option>

            Unable to load available times

        </option>`;

        time.disabled = false;

        showMessage(

            "Unable to contact the booking server.",

            "#ff6b6b"

        );

    }

}

/* ==========================================
   EVENTS
========================================== */

tattooType.addEventListener(

    "change",

    async()=>{

        if(selectedDate){

            await loadAvailableTimes();

        }

    }

);

time.addEventListener(

    "change",

    ()=>{

        clearMessage();

    }

);
/* ==========================================
   BOOKING SUBMIT
========================================== */

bookingForm.addEventListener(

    "submit",

    submitBooking

);

async function submitBooking(event){

    event.preventDefault();

    clearMessage();

    if(!selectedDate){

        showMessage(

            "Please select a date.",

            "#ff6b6b"

        );

        return;

    }

    if(!time.value){

        showMessage(

            "Please select a time.",

            "#ff6b6b"

        );

        return;

    }

    confirmButton.disabled = true;

    confirmButton.innerHTML =

    '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';

    const formData = new FormData();

    formData.append(

        "name",

        document.getElementById("name").value.trim()

    );

    formData.append(

        "email",

        document.getElementById("email").value.trim()

    );

    formData.append(

        "phone",

        document.getElementById("phone").value.trim()

    );

    formData.append(

        "date",

        selectedDate

    );

    formData.append(

        "time",

        time.value

    );

    formData.append(

        "tattooType",

        tattooType.value

    );

    formData.append(

        "placement",

        placement.value

    );

    formData.append(

        "style",

        style.value

    );

    formData.append(

        "notes",

        document.getElementById("notes").value.trim()

    );

    [...imageInput.files].forEach(file=>{

        formData.append(

            "referenceImage",

            file

        );

    });

    try{

        const response = await fetch(

            API + "/book",

            {

                method:"POST",

                body:formData

            }

        );

        const data = await response.json();

        if(!data.success){

            showMessage(

                data.message,

                "#ff6b6b"

            );

            confirmButton.disabled = false;

            confirmButton.innerHTML =

            "Confirm Booking";

            return;

        }

        showMessage(

`<div style="font-size:22px;margin-bottom:8px;">✅</div>

<strong>Booking Confirmed!</strong>

<br><br>

Booking ID:

<strong>${data.booking.bookingId}</strong>

<br><br>

A confirmation email has been sent.`,

"#69db7c"

);

        bookingForm.reset();

        preview.innerHTML = "";

        selectedDate = null;

        selectedDateInput.value = "";

        time.innerHTML =

        '<option value="">Select Time</option>';

        await loadAppointments();

        document

        .querySelectorAll(".selected-date")

        .forEach(day=>{

            day.classList.remove(

                "selected-date"

            );

        });

    }

    catch(err){

        console.error(err);

        showMessage(

            "Unable to create booking.",

            "#ff6b6b"

        );

    }

    finally{

        confirmButton.disabled = false;

        confirmButton.innerHTML =

        "Confirm Booking";

    }

}/* ==========================================
   PAGE INITIALIZATION
========================================== */

async function initializePage(){

    loadTattooTypes();

    loadPlacements();

    loadStyles();

    initializeCalendar();

    await loadAppointments();

    applyTranslations();

    bookingForm.classList.add(

        "fade-in"

    );

}

/* ==========================================
   TRANSLATION REFRESH
========================================== */

function refreshLanguage(){

    if(typeof applyTranslations==="function"){

        applyTranslations();

    }

}

/* ==========================================
   MONTH CHANGED
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializePage();

    }

);

document.addEventListener(

    "languageChanged",

    ()=>{

        refreshLanguage();

    }

);

/* ==========================================
   CALENDAR AUTO REFRESH
========================================== */

setInterval(

    async()=>{

        if(calendar){

            await loadAppointments();

        }

    },

    60000

);

/* ==========================================
   PAGE ANIMATION
========================================== */

window.addEventListener(

    "load",

    ()=>{

        document.body.classList.add(

            "loaded"

        );

    }

);

/* ==========================================
   SMALL UX IMPROVEMENTS
========================================== */

document

.querySelectorAll(

    "input, select, textarea"

)

.forEach(element=>{

    element.addEventListener(

        "focus",

        ()=>{

            element.parentElement?.classList.add(

                "focused"

            );

        }

    );

    element.addEventListener(

        "blur",

        ()=>{

            element.parentElement?.classList.remove(

                "focused"

            );

        }

    );

});

/* ==========================================
   PREVENT DOUBLE SUBMIT
========================================== */

window.addEventListener(

    "beforeunload",

    ()=>{

        confirmButton.disabled=true;

    }

);

console.log(

    "✅ Booking page initialized."

);