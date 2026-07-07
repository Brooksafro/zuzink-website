require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initDatabase } = require("./utils/database");
const { verifyEmail } = require("./services/emailService");

const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

const app = express();

/* ==========================
   MIDDLEWARE
========================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ==========================
   STATIC FILES
========================== */

app.use(express.static("public"));

/* ==========================
   API ROUTES
========================== */

app.use("/api", bookingRoutes);
app.use("/api/admin", adminRoutes);

/* ==========================
   HOME PAGE
========================== */

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

/* ==========================
   START SERVER
========================== */

const PORT = process.env.PORT || 3000;

async function start() {

    try {

        await initDatabase();
        console.log("✅ SQLite database ready.");

        await verifyEmail();
        console.log("✅ Email service ready.");

        app.listen(PORT, () => {

            console.log(`🚀 ZuzInk server running on port ${PORT}`);

        });

    }

    catch (err) {

        console.error("❌ Failed to start server");
        console.error(err);

        process.exit(1);

    }

}

start();