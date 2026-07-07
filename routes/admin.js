const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
    getDB,
    getBookings,
    getOpeningHours,
    getTattooTypes,
    updateOpeningHours,
    updateTattooDuration
} = require("../utils/database");

/* ==========================
   AUTH MIDDLEWARE
========================== */

function authenticate(req, res, next) {

    const auth = req.headers.authorization;

    if (!auth) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

    }

    const token = auth.replace("Bearer ", "");

    try {

        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();

    }

    catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });

    }

}

/* ==========================
   LOGIN
========================== */

router.post("/login", (req, res) => {

    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {

        return res.status(401).json({

            success: false,

            message: "Wrong password."

        });

    }

    const token = jwt.sign(

        {

            admin: true

        },

        process.env.JWT_SECRET,

        {

            expiresIn: "12h"

        }

    );

    res.json({

        success: true,

        token

    });

});
/* ==========================
   GET ALL BOOKINGS
========================== */

router.get(

"/bookings",

authenticate,

async(req,res)=>{

try{

const bookings=

await getBookings();

return res.json(bookings);

}

catch(err){

console.error(err);

return res.status(500).json({

success:false,

message:"Unable to load bookings."

});

}

}

);

/* ==========================
   GET SETTINGS
========================== */

router.get(

"/settings",

authenticate,

async(req,res)=>{

try{

const openingHours=

await getOpeningHours();

const tattooTypes=

await getTattooTypes();

return res.json({

success:true,

openingHours,

tattooTypes

});

}

catch(err){

console.error(err);

return res.status(500).json({

success:false,

message:"Unable to load settings."

});

}

}

);
/* ==========================
   SAVE SETTINGS
========================== */

router.put(

"/settings",

authenticate,

async(req,res)=>{

try{

const {

openingHours,

tattooTypes

}=req.body;

if(Array.isArray(openingHours)){

for(const day of openingHours){

await updateOpeningHours(

day.day,

day.open,

day.close

);

}

}

if(Array.isArray(tattooTypes)){

for(const tattoo of tattooTypes){

await updateTattooDuration(

tattoo.name,

tattoo.duration

);

}

}

return res.json({

success:true,

message:"Settings updated successfully."

});

}

catch(err){

console.error(err);

return res.status(500).json({

success:false,

message:"Unable to save settings."

});

}

}

);

/* ==========================
   DASHBOARD STATS
========================== */

router.get(

"/stats",

authenticate,

async(req,res)=>{

    try{

        const bookings = await getBookings();

        const today = new Date();

        const todayString = today.toISOString().split("T")[0];

        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;

        for(const booking of bookings){

            const bookingDate = new Date(booking.start);

            if(booking.start.startsWith(todayString)){
                todayCount++;
            }

            const diff =
                (today-bookingDate)/(1000*60*60*24);

            if(diff >= 0 && diff <= 7){
                weekCount++;
            }

            if(
                bookingDate.getMonth() === today.getMonth() &&
                bookingDate.getFullYear() === today.getFullYear()
            ){
                monthCount++;
            }

        }

        return res.json({

            success:true,

            today:todayCount,

            week:weekCount,

            month:monthCount,

            total:bookings.length

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Unable to load statistics."

        });

    }

}

);

/* ==========================
   EXPORT
========================== */

module.exports = router;