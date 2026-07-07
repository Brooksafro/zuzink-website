const API = "/api";

let calendar = null;
let bookings = [];
let selectedBooking = null;

/* ==========================
   ELEMENTS
========================== */

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const passwordInput = document.getElementById("password");

const loadingOverlay = document.getElementById("loadingOverlay");

const notification = document.getElementById("notification");

/* ==========================
   LOADING
========================== */

function showLoading(){

    loadingOverlay.style.display="flex";

}

function hideLoading(){

    loadingOverlay.style.display="none";

}

/* ==========================
   NOTIFICATION
========================== */

function notify(message){

    notification.innerText=message;

    notification.style.display="block";

    setTimeout(()=>{

        notification.style.display="none";

    },3000);

}

/* ==========================
   LOGIN
========================== */

loginBtn.addEventListener(

"click",

login

);

passwordInput.addEventListener(

"keypress",

e=>{

if(e.key==="Enter"){

login();

}

}

);

async function login(){

const password=passwordInput.value;

if(!password){

return;

}

showLoading();

try{

const res=await fetch(

API+"/admin/login",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

password

})

}

);

const data=await res.json();

hideLoading();

if(!data.success){

document.getElementById(

"loginError"

).innerText=

"Wrong password";

return;

}

localStorage.setItem(

"adminToken",

data.token

);

loginPage.style.display="none";

dashboard.style.display="block";

await initializeDashboard();

}

catch(err){

hideLoading();

console.error(err);

notify(

"Unable to connect."

);

}

}
/* ==========================
   AUTO LOGIN
========================== */

window.addEventListener(

"load",

async()=>{

const token=

localStorage.getItem(

"adminToken"

);

if(!token){

return;

}

loginPage.style.display="none";

dashboard.style.display="block";

await initializeDashboard();

});

/* ==========================
   LOGOUT
========================== */

logoutBtn.addEventListener(

"click",

()=>{

localStorage.removeItem(

"adminToken"

);

location.reload();

});

/* ==========================
   INITIALIZE DASHBOARD
========================== */

async function initializeDashboard(){

showLoading();

try{

await loadBookings();

await loadStatistics();

await loadTodayBookings();

createCalendar();

}

catch(err){

console.error(err);

notify(

"Dashboard failed to load."

);

}

hideLoading();

}

/* ==========================
   LOAD BOOKINGS
========================== */

async function loadBookings(){

const token=

localStorage.getItem(

"adminToken"

);

const res=

await fetch(

API+"/admin/bookings",

{

headers:{

Authorization:

"Bearer "+token

}

}

);

bookings=

await res.json();

}

/* ==========================
   CALENDAR
========================== */

function createCalendar(){

if(calendar){

calendar.destroy();

}

calendar=

new FullCalendar.Calendar(

document.getElementById(

"calendar"

),

{

initialView:

"dayGridMonth",

height:"auto",

events:

bookings.map(

booking=>({

id:

booking.bookingId,

title:

booking.name,

start:

booking.start,

color:"#800020"

})

),

eventClick(info){

openBooking(

info.event.id

);

}

}

);

calendar.render();

}
/* ==========================
   AUTO LOGIN
========================== */

window.addEventListener(

"load",

async()=>{

const token=

localStorage.getItem(

"adminToken"

);

if(!token){

return;

}

loginPage.style.display="none";

dashboard.style.display="block";

await initializeDashboard();

});

/* ==========================
   LOGOUT
========================== */

logoutBtn.addEventListener(

"click",

()=>{

localStorage.removeItem(

"adminToken"

);

location.reload();

});

/* ==========================
   INITIALIZE DASHBOARD
========================== */

async function initializeDashboard(){

showLoading();

try{

await loadBookings();

await loadStatistics();

await loadTodayBookings();

createCalendar();

}

catch(err){

console.error(err);

notify(

"Dashboard failed to load."

);

}

hideLoading();

}

/* ==========================
   LOAD BOOKINGS
========================== */

async function loadBookings(){

const token=

localStorage.getItem(

"adminToken"

);

const res=

await fetch(

API+"/admin/bookings",

{

headers:{

Authorization:

"Bearer "+token

}

}

);

bookings=

await res.json();

}

/* ==========================
   CALENDAR
========================== */

function createCalendar(){

if(calendar){

calendar.destroy();

}

calendar=

new FullCalendar.Calendar(

document.getElementById(

"calendar"

),

{

initialView:

"dayGridMonth",

height:"auto",

events:

bookings.map(

booking=>({

id:

booking.bookingId,

title:

booking.name,

start:

booking.start,

color:"#800020"

})

),

eventClick(info){

openBooking(

info.event.id

);

}

}

);

calendar.render();

}
/* ==========================
   BOOKING DETAILS
========================== */

function openBooking(bookingId){

    selectedBooking = bookings.find(

        booking => booking.bookingId === bookingId

    );

    if(!selectedBooking){

        return;

    }

    const info = document.getElementById("bookingInfo");

    info.innerHTML = `

        <p><b>Booking ID:</b> ${selectedBooking.bookingId}</p>

        <p><b>Name:</b> ${selectedBooking.name}</p>

        <p><b>Email:</b> ${selectedBooking.email}</p>

        <p><b>Phone:</b> ${selectedBooking.phone}</p>

        <p><b>Date:</b> ${selectedBooking.start.substring(0,10)}</p>

        <p><b>Time:</b> ${selectedBooking.start.substring(11,16)}</p>

        <p><b>Tattoo:</b> ${selectedBooking.tattooType}</p>

        <p><b>Placement:</b> ${selectedBooking.placement}</p>

        <p><b>Style:</b> ${selectedBooking.style}</p>

        <p><b>Notes:</b> ${selectedBooking.notes || "None"}</p>

    `;

    const gallery = document.getElementById("bookingImages");

    gallery.innerHTML = "";

    /* Images (for future use) */

    if(selectedBooking.images){

        selectedBooking.images.forEach(image=>{

            const img=document.createElement("img");

            img.src=image;

            gallery.appendChild(img);

        });

    }

    document.getElementById(

        "bookingModal"

    ).style.display="flex";

}

/* ==========================
   CLOSE MODAL
========================== */

document

.getElementById(

"closeModal"

)

.addEventListener(

"click",

()=>{

document.getElementById(

"bookingModal"

).style.display="none";

});

window.addEventListener(

"click",

e=>{

if(

e.target===

document.getElementById(

"bookingModal"

)

){

document.getElementById(

"bookingModal"

).style.display="none";

}

});

/* ==========================
   CANCEL BOOKING
========================== */

document

.getElementById(

"cancelBookingBtn"

)

.addEventListener(

"click",

cancelBooking

);

async function cancelBooking(){

    if(!selectedBooking){

        return;

    }

    if(

        !confirm(

            "Cancel this appointment?"

        )

    ){

        return;

    }

    showLoading();

    try{

        const token=

        localStorage.getItem(

            "adminToken"

        );

        const res=

        await fetch(

          API + "/admin/booking/" + selectedBooking.cancelToken,

            {

                method:"DELETE",

                headers:{

                    Authorization:

                    "Bearer "+token

                }

            }

        );

        const data=

        await res.json();

        hideLoading();

        notify(

            data.message

        );

        document.getElementById(

            "bookingModal"

        ).style.display="none";

        await initializeDashboard();

    }

    catch(err){

        hideLoading();

        console.error(err);

        notify(

            "Unable to cancel booking."

        );

    }

}
/* ==========================
   SETTINGS
========================== */

async function loadSettings(){

    try{

        const token = localStorage.getItem("adminToken");

        const res = await fetch(

            API + "/admin/settings",

            {

                headers:{

                    Authorization:"Bearer "+token

                }

            }

        );

        const data = await res.json();

        document.getElementById("openingHours").innerHTML = "";
        document.getElementById("tattooDurations").innerHTML = "";

        /* Opening Hours */

        data.openingHours.forEach(day=>{

            document.getElementById("openingHours").innerHTML += `

                <label>${day.day}</label>

                <input
                    type="time"
                    value="${day.open || ""}"
                    data-day="${day.day}"
                    class="openTime">

                <input
                    type="time"
                    value="${day.close || ""}"
                    data-day="${day.day}"
                    class="closeTime">

                <hr>

            `;

        });

        /* Tattoo Durations */

        data.tattooTypes.forEach(type=>{

            document.getElementById("tattooDurations").innerHTML += `

                <label>${type.name}</label>

                <input
                    type="number"
                    value="${type.duration}"
                    data-type="${type.name}"
                    class="durationInput">

                <br><br>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

/* ==========================
   SAVE SETTINGS
========================== */

document.getElementById(

"saveSettings"

)

.addEventListener(

"click",

saveSettings

);

async function saveSettings(){

    const token =

    localStorage.getItem(

        "adminToken"

    );

    const openingHours = [];

    document.querySelectorAll(".openTime").forEach(open=>{

        const close =

        document.querySelector(

            `.closeTime[data-day="${open.dataset.day}"]`

        );

        openingHours.push({

            day:open.dataset.day,

            open:open.value,

            close:close.value

        });

    });

    const tattooTypes = [];

    document.querySelectorAll(".durationInput").forEach(input=>{

        tattooTypes.push({

            name:input.dataset.type,

            duration:Number(input.value)

        });

    });

    try{

        const res = await fetch(

            API+"/admin/settings",

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:"Bearer "+token

                },

                body:JSON.stringify({

                    openingHours,

                    tattooTypes

                })

            }

        );

        const data = await res.json();

        notify(data.message);

    }

    catch(err){

        console.error(err);

        notify("Unable to save settings.");

    }

}

/* ==========================
   LOAD SETTINGS ON START
========================== */

const originalInitialize = initializeDashboard;

initializeDashboard = async function(){

    await originalInitialize();

    await loadSettings();

};