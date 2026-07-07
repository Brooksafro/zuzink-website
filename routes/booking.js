const express = require("express");
const router = express.Router();

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const {
    createBooking,
    getBookings,
    getBookingsForDate,
    getBookingByToken,
    deleteBooking,
    getTattooDuration,
    getTattooTypes,
    getOpeningHours
} = require("../utils/database");

const {
    getAvailableSlots
} = require("../utils/bookingEngine");

const {
    sendCustomerEmail,
    sendStudioEmail,
    sendCancellationEmail
} = require("../services/emailService");

/* ==========================
   TEMP FOLDER
========================== */

const uploadFolder = path.join(__dirname, "..", "temp");

if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(uploadFolder, { recursive: true });

}

/* ==========================
   MULTER
========================== */

const upload = multer({

    dest: uploadFolder,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

/* ==========================
   BOOKING ID
========================== */

async function generateBookingId() {

    const bookings = await getBookings();

    const year = new Date().getFullYear();

    const number = String(bookings.length + 1).padStart(4, "0");

    return `ZUZ-${year}-${number}`;

}

/* ==========================
   START / END
========================== */

function calculateAppointment(date, time, duration) {

    const start = new Date(`${date}T${time}:00`);

    const end = new Date(start.getTime() + duration * 60000);

    return {

        start,

        end

    };

}

/* ==========================
   VALIDATION
========================== */

function validateBooking(data) {

    if (!data.name) return "Name is required.";

    if (!data.email) return "Email is required.";

    if (!data.phone) return "Phone is required.";

    if (!data.date) return "Date is required.";

    if (!data.time) return "Time is required.";

    if (!data.tattooType) return "Tattoo type is required.";

    if (!data.placement) return "Placement is required.";

    if (!data.style) return "Style is required.";

    return null;

}

/* ==========================
   DELETE TEMP FILES
========================== */

function deleteTempFiles(files) {

    if (!files || files.length === 0) {

        return;

    }

    for (const file of files) {

        try {

            if (fs.existsSync(file.path)) {

                fs.unlinkSync(file.path);

            }

        }

        catch (err) {

            console.error(err);

        }

    }

}
/* ==========================
   GET ALL BOOKINGS
========================== */

router.get(

"/appointments",

async(req,res)=>{

    try{

        const bookings = await getBookings();

        return res.json({

            success:true,

            bookings

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load appointments."

        });

    }

});

/* ==========================
   BOOKINGS BY DATE
========================== */

router.get(

"/appointments/:date",

async(req,res)=>{

    try{

        const bookings = await getBookingsForDate(

            req.params.date

        );

        return res.json({

            success:true,

            bookings

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load appointments."

        });

    }

});

/* ==========================
   GET TATTOO TYPES
========================== */

router.get(

"/tattoos",

async(req,res)=>{

    try{

        const tattoos = await getTattooTypes();

        return res.json({

            success:true,

            tattoos

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load tattoo types."

        });

    }

});

/* ==========================
   GET OPENING HOURS
========================== */

router.get(

"/opening-hours",

async(req,res)=>{

    try{

        const openingHours =

        await getOpeningHours();

        return res.json({

            success:true,

            openingHours

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load opening hours."

        });

    }

});

/* ==========================
   AVAILABLE SLOTS
========================== */

router.get(

"/available-slots",

async(req,res)=>{

    try{

        const {

            date,

            tattooType

        } = req.query;

        if(

            !date ||

            !tattooType

        ){

            return res.status(400).json({

                success:false,

                message:"Date and tattoo type are required."

            });

        }

        const slots =

        await getAvailableSlots(

            date,

            tattooType

        );

        return res.json({

            success:true,

            slots

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load available slots."

        });

    }

});
/* ==========================
   CREATE BOOKING
========================== */

router.post(

"/book",

upload.array(

"referenceImage",

5

),

async(req,res)=>{

try{

const validation=

validateBooking(

req.body

);

if(validation){

deleteTempFiles(

req.files

);

return res.status(400).json({

success:false,

message:validation

});

}

/* -------------------------
   Tattoo Duration
-------------------------- */

const tattoo=

await getTattooDuration(

req.body.tattooType

);

if(!tattoo){

deleteTempFiles(

req.files

);

return res.status(400).json({

success:false,

message:"Invalid tattoo type."

});

}

const duration=

tattoo.duration;

/* -------------------------
   Available Slots
-------------------------- */

const available=

await getAvailableSlots(

req.body.date,

req.body.tattooType

);

if(

!available.includes(

req.body.time

)

){

deleteTempFiles(

req.files

);

return res.status(400).json({

success:false,

message:"This appointment slot is no longer available."

});

}

/* -------------------------
   Booking IDs
-------------------------- */

const bookingId=

await generateBookingId();

const cancelToken=

uuidv4();

/* -------------------------
   Appointment Times
-------------------------- */

const appointment=

calculateAppointment(

req.body.date,

req.body.time,

duration

);

/* -------------------------
   Booking Object
-------------------------- */

const booking={

bookingId,

cancelToken,

name:req.body.name,

email:req.body.email,

phone:req.body.phone,

tattooType:req.body.tattooType,

placement:req.body.placement,

style:req.body.style,

start:appointment.start.toISOString(),

end:appointment.end.toISOString(),

notes:req.body.notes || ""

};

/* -------------------------
   Save Booking
-------------------------- */

await createBooking(

booking

);

/* -------------------------
   Email Object
-------------------------- */

const emailBooking={

...booking,

date:req.body.date,

time:req.body.time,

duration,

attachments:req.files || []

};

/* -------------------------
   Send Emails
-------------------------- */

 await sendCustomerEmail(emailBooking);
 await sendStudioEmail(emailBooking);

/* -------------------------
   Delete Temp Files
-------------------------- */

deleteTempFiles(

req.files

);

/* -------------------------
   Success
-------------------------- */

return res.json({

success:true,

message:"Booking confirmed successfully.",

booking:{

bookingId,

cancelToken,

name:booking.name,

email:booking.email,

phone:booking.phone,

tattooType:booking.tattooType,

placement:booking.placement,

style:booking.style,

date:req.body.date,

time:req.body.time,

duration

}

});

}

catch(err){

console.error(err);

deleteTempFiles(

req.files

);

return res.status(500).json({

success:false,

message:"Internal server error."

});

}

}

);
/* ==========================
   CANCEL BOOKING
========================== */

router.delete(

"/cancel/:token",

async(req,res)=>{

    try{

        const booking = await getBookingByToken(

            req.params.token

        );

        if(!booking){

            return res.status(404).json({

                success:false,

                message:"Booking not found."

            });

        }

        await deleteBooking(

            req.params.token

        );

        await sendCancellationEmail({

            bookingId:booking.bookingId,

            email:booking.email,

            name:booking.name

        });

        return res.json({

            success:true,

            message:"Booking cancelled successfully."

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to cancel booking."

        });

    }

});

/* ==========================
   HEALTH CHECK
========================== */

router.get(

"/health",

(req,res)=>{

    res.json({

        success:true,

        message:"Booking API is running.",

        timestamp:new Date()

    });

});

/* ==========================
   404 API HANDLER
========================== */

router.use(

(req,res)=>{

    return res.status(404).json({

        success:false,

        message:"API endpoint not found."

    });

});

/* ==========================
   EXPORT
========================== */

module.exports = router;