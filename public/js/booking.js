/*==================================================
ZUZINK
BOOKING.JS
==================================================*/

"use strict";

/*==================================================
CONFIG
==================================================*/

const API="/api";

let calendar=null;

let selectedDate=null;

/*==================================================
ELEMENTS
==================================================*/

const bookingForm=
document.getElementById("bookingForm");

const calendarElement=
document.getElementById("calendar");

const tattooType=
document.getElementById("tattooType");

const placement=
document.getElementById("placement");

const style=
document.getElementById("style");

const time=
document.getElementById("time");

const selectedDateInput=
document.getElementById("selectedDate");

const preview=
document.getElementById("preview");

const imageInput=
document.getElementById("referenceImages");

const bookingMessage=
document.getElementById("bookingMessage");

/*==================================================
STATIC OPTIONS
==================================================*/

const placements=[

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

const styles=[

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

/*==================================================
LOAD DROPDOWNS
==================================================*/

async function loadTattooTypes(){

    try{

        const response=

        await fetch(

            API+"/tattoos"

        );

        const data=

        await response.json();

        tattooType.innerHTML=

        '<option value="">Tattoo Size</option>';

        data.tattoos.forEach(type=>{

            tattooType.innerHTML+=`

            <option value="${type.name}">

            ${type.name}

            </option>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

function loadPlacements(){

    placement.innerHTML=

    '<option value="">Placement</option>';

    placements.forEach(item=>{

        placement.innerHTML+=`

        <option value="${item}">

        ${item}

        </option>

        `;

    });

}

function loadStyles(){

    style.innerHTML=

    '<option value="">Tattoo Style</option>';

    styles.forEach(item=>{

        style.innerHTML+=`

        <option value="${item}">

        ${item}

        </option>

        `;

    });

}/*==================================================
CALENDAR
==================================================*/

function initializeCalendar(){

    if(!calendarElement) return;

    calendar=new FullCalendar.Calendar(

        calendarElement,

        {

            initialView:"dayGridMonth",

            height:"auto",

            selectable:true,

            dateClick:async function(info){

                selectedDate=info.dateStr;

                selectedDateInput.value=selectedDate;

                await loadAvailableTimes();

            }

        }

    );

    calendar.render();

}

/*==================================================
AVAILABLE TIMES
==================================================*/

async function loadAvailableTimes(){

    time.innerHTML=

    "<option>Loading...</option>";

    if(!selectedDate){

        time.innerHTML=

        "<option>Select a date first</option>";

        return;

    }

    if(!tattooType.value){

        time.innerHTML=

        "<option>Select tattoo size first</option>";

        return;

    }

    try{

        const response=

        await fetch(

`${API}/available-slots?date=${selectedDate}&tattooType=${encodeURIComponent(tattooType.value)}`

        );

        const data=

        await response.json();

        time.innerHTML="";

        if(

            !data.success ||

            data.slots.length===0

        ){

            time.innerHTML=

            "<option>No available times</option>";

            return;

        }

        time.innerHTML=

        '<option value="">Select Time</option>';

        data.slots.forEach(slot=>{

            time.innerHTML+=`

            <option value="${slot}">

            ${slot}

            </option>

            `;

        });

    }

    catch(err){

        console.error(err);

        time.innerHTML=

        "<option>Unable to load times</option>";

    }

}

/*==================================================
IMAGE PREVIEW
==================================================*/

imageInput.addEventListener(

"change",

()=>{

    preview.innerHTML="";

    [...imageInput.files]

    .slice(0,5)

    .forEach(file=>{

        const reader=

        new FileReader();

        reader.onload=e=>{

            const img=

            document.createElement("img");

            img.src=e.target.result;

            preview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});

/*==================================================
EVENTS
==================================================*/

tattooType.addEventListener(

"change",

loadAvailableTimes

);
/*==================================================
BOOKING SUBMIT
==================================================*/

bookingForm.addEventListener(

"submit",

submitBooking

);

async function submitBooking(event){

    event.preventDefault();

    if(!selectedDate){

        bookingMessage.innerText=

        "Please select a date.";

        return;

    }

    const formData=new FormData();

    formData.append(

        "name",

        document.getElementById("name").value

    );

    formData.append(

        "email",

        document.getElementById("email").value

    );

    formData.append(

        "phone",

        document.getElementById("phone").value

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

        document.getElementById("notes").value

    );

    [...imageInput.files].forEach(file=>{

        formData.append(

            "referenceImage",

            file

        );

    });

    try{

        bookingMessage.innerText=

        "Submitting...";

        const response=

        await fetch(

            API+"/book",

            {

                method:"POST",

                body:formData

            }

        );

        const data=

        await response.json();

        if(!data.success){

            bookingMessage.innerText=

            data.message ||

            "Booking failed.";

            return;

        }

        bookingMessage.innerText=

        "✅ Booking confirmed!";

        bookingForm.reset();

        preview.innerHTML="";

        selectedDate=null;

        selectedDateInput.value="";

        time.innerHTML=

        '<option value="">Select Time</option>';

    }

    catch(error){

        console.error(error);

        bookingMessage.innerText=

        "Unable to create booking.";

    }

}

/*==================================================
PAGE INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

async()=>{

    loadPlacements();

    loadStyles();

    await loadTattooTypes();

    initializeCalendar();

});