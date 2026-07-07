const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    },

    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 10000

});

/* ==========================
   VERIFY CONNECTION
========================== */

async function verifyEmail(){

    try{

        await transporter.verify();

        console.log("✅ Email service ready.");

    }

    catch(err){

        console.error("❌ Email Error:");

        console.error(err);

    }

}

/* ==========================
   CUSTOMER EMAIL
========================== */

async function sendCustomerEmail(booking){

    const html = `

    <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto;">

        <h1 style="color:#800020;">

            ZuzInk Tattoo Studio

        </h1>

        <h2>

            Booking Confirmed ✅

        </h2>

        <hr>

        <p>

            Hello <b>${booking.name}</b>,

        </p>

        <p>

            Your tattoo appointment has been confirmed.

        </p>

        <table style="width:100%;border-collapse:collapse;">

            <tr>
                <td><b>Booking ID</b></td>
                <td>${booking.bookingId}</td>
            </tr>

            <tr>
                <td><b>Date</b></td>
                <td>${booking.date}</td>
            </tr>

            <tr>
                <td><b>Time</b></td>
                <td>${booking.time}</td>
            </tr>

            <tr>
                <td><b>Tattoo</b></td>
                <td>${booking.tattooType}</td>
            </tr>

            <tr>
                <td><b>Placement</b></td>
                <td>${booking.placement}</td>
            </tr>

            <tr>
                <td><b>Style</b></td>
                <td>${booking.style}</td>
            </tr>

            <tr>
                <td><b>Estimated Duration</b></td>
                <td>${booking.duration} minutes</td>
            </tr>

        </table>

        <br>

        <a

        href="${process.env.BASE_URL}/api/cancel/${booking.cancelToken}"

        style="

        background:#800020;

        color:white;

        text-decoration:none;

        padding:15px 30px;

        border-radius:10px;

        display:inline-block;

        ">

        Cancel Appointment

        </a>

        <br><br>

        📍 Bulgarovo, ul. Dimcho Debelyanov 4

        <br><br>

        <a href="tel:+359892020065">

        📞 +359 89 202 0065

        </a>

    </div>

    `;

    console.log("➡ Starting customer email...");

    try {

        const info = await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: booking.email,

            subject: "ZuzInk Booking Confirmation",

            html,

            attachments:
                booking.attachments
                ? booking.attachments.map(file => ({
                    filename: file.originalname,
                    path: file.path
                }))
                : []

        });

        console.log("✅ Customer email sent!");
        console.log(info.messageId);

    }

    catch(err){

        console.error("❌ Customer email failed:");
        console.error(err);

        throw err;

    }

}
/* ==========================
   STUDIO EMAIL
========================== */

async function sendStudioEmail(booking){

    const html = `

    <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto;">

        <h1 style="color:#800020;">

            New Tattoo Booking

        </h1>

        <hr>

        <table style="width:100%;border-collapse:collapse;">

            <tr>
                <td><b>Booking ID</b></td>
                <td>${booking.bookingId}</td>
            </tr>

            <tr>
                <td><b>Name</b></td>
                <td>${booking.name}</td>
            </tr>

            <tr>
                <td><b>Email</b></td>
                <td>${booking.email}</td>
            </tr>

            <tr>
                <td><b>Phone</b></td>
                <td>${booking.phone}</td>
            </tr>

            <tr>
                <td><b>Date</b></td>
                <td>${booking.date}</td>
            </tr>

            <tr>
                <td><b>Time</b></td>
                <td>${booking.time}</td>
            </tr>

            <tr>
                <td><b>Tattoo</b></td>
                <td>${booking.tattooType}</td>
            </tr>

            <tr>
                <td><b>Placement</b></td>
                <td>${booking.placement}</td>
            </tr>

            <tr>
                <td><b>Style</b></td>
                <td>${booking.style}</td>
            </tr>

            <tr>
                <td><b>Estimated Duration</b></td>
                <td>${booking.duration} minutes</td>
            </tr>

            <tr>
                <td><b>Notes</b></td>
                <td>${booking.notes || "None"}</td>
            </tr>

        </table>

    </div>

    `;

    console.log("➡ Starting studio email...");

    try {

        const info = await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: `New Booking - ${booking.name}`,

            html,

            attachments:
                booking.attachments
                ? booking.attachments.map(file => ({
                    filename: file.originalname,
                    path: file.path
                }))
                : []

        });

        console.log("✅ Studio email sent!");
        console.log(info.messageId);

    }

    catch(err){

        console.error("❌ Studio email failed:");
        console.error(err);

        throw err;

    }

}

/* ==========================
   CANCELLATION EMAIL
========================== */

async function sendCancellationEmail(booking){

    const html = `

    <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto;">

        <h2 style="color:#800020;">

            Appointment Cancelled

        </h2>

        <hr>

        <p>

            Hello ${booking.name},

        </p>

        <p>

            Your appointment has been cancelled successfully.

        </p>

        <p>

            <b>Booking ID:</b>

            ${booking.bookingId}

        </p>

        <br>

        <p>

            If this was a mistake, you can always book another appointment through the website.

        </p>

    </div>

    `;

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: booking.email,

        subject: "ZuzInk Appointment Cancelled",

        html

    });

}

/* ==========================
   EXPORTS
========================== */

module.exports = {

    verifyEmail,

    sendCustomerEmail,

    sendStudioEmail,

    sendCancellationEmail

};