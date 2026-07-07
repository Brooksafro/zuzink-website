const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let db;

async function initDatabase() {

    db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    // Appointments
    await db.exec(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            bookingId TEXT UNIQUE,
            cancelToken TEXT UNIQUE,

            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,

            tattooType TEXT NOT NULL,
            placement TEXT,
            style TEXT,

            start DATETIME NOT NULL,
            end DATETIME NOT NULL,

            notes TEXT,

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Settings
    await db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

    // Tattoo durations
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tattoo_types (
            name TEXT PRIMARY KEY,
            duration INTEGER NOT NULL
        );
    `);

    // Opening hours
    await db.exec(`
        CREATE TABLE IF NOT EXISTS opening_hours (
            day TEXT PRIMARY KEY,
            open TEXT,
            close TEXT
        );
    `);

    // Default tattoo durations
    const tattoos = [
        ["Fine Line Text", 60],
        ["5 cm", 90],
        ["10 cm", 120],
        ["15 cm", 180],
        ["20 cm", 240],
        ["Big Tattoo", 360]
    ];

    for (const tattoo of tattoos) {

        await db.run(`
            INSERT OR IGNORE INTO tattoo_types(name,duration)
            VALUES (?,?)
        `, tattoo);

    }

    // Default opening hours

    const hours = [

        ["Monday", null, null],

        ["Tuesday", "09:00", "18:00"],

        ["Wednesday", "09:00", "18:00"],

        ["Thursday", "09:00", "18:00"],

        ["Friday", "09:00", "18:00"],

        ["Saturday", "09:00", "16:00"],

        ["Sunday", null, null]

    ];

    for (const day of hours) {

        await db.run(`
            INSERT OR IGNORE INTO opening_hours(day,open,close)
            VALUES (?,?,?)
        `, day);

    }

    console.log("✅ SQLite database ready.");

}

function getDB() {
    return db;
}


/* ==========================
   BOOKINGS
========================== */

async function createBooking(booking) {

    return await db.run(
        `
        INSERT INTO appointments
        (
            bookingId,
            cancelToken,
            name,
            email,
            phone,
            tattooType,
            placement,
            style,
            start,
            end,
            notes
        )

        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            booking.bookingId,
            booking.cancelToken,
            booking.name,
            booking.email,
            booking.phone,
            booking.tattooType,
            booking.placement,
            booking.style,
            booking.start,
            booking.end,
            booking.notes
        ]
    );

}

async function getBookings() {

    return await db.all(

        `SELECT * FROM appointments
         ORDER BY start ASC`

    );

}

async function getBookingsForDate(date) {

    return await db.all(

        `SELECT *
         FROM appointments
         WHERE DATE(start)=?
         ORDER BY start ASC`,

        [date]

    );

}

async function getBookingByToken(token){

    return await db.get(

        `SELECT *
         FROM appointments
         WHERE cancelToken=?`,

        [token]

    );

}

async function deleteBooking(token){

    return await db.run(

        `DELETE FROM appointments
         WHERE cancelToken=?`,

        [token]

    );

}
/* ==========================
SETTINGS
========================== */

async function getTattooTypes(){

    return await db.all(

        `SELECT *
         FROM tattoo_types`

    );

}

async function getTattooDuration(type){

    return await db.get(

        `SELECT duration
         FROM tattoo_types
         WHERE name=?`,

        [type]

    );

}

async function getOpeningHours(){

    return await db.all(

        `SELECT *
         FROM opening_hours`

    );

}

async function getOpeningHoursForDay(day){

    return await db.get(

        `SELECT *
         FROM opening_hours
         WHERE day=?`,

        [day]

    );

}
/* ==========================
   UPDATE SETTINGS
========================== */

async function updateOpeningHours(day, open, close){

    return await db.run(

        `UPDATE opening_hours
         SET open=?, close=?
         WHERE day=?`,

        [open, close, day]

    );

}

async function updateTattooDuration(name, duration){

    return await db.run(

        `UPDATE tattoo_types
         SET duration=?
         WHERE name=?`,

        [duration, name]

    );

}

module.exports={

    initDatabase,

    getDB,

    createBooking,

    getBookings,

    getBookingsForDate,

    getBookingByToken,

    deleteBooking,

    getTattooTypes,

    getTattooDuration,

    getOpeningHours,

    getOpeningHoursForDay,

    updateOpeningHours,

    updateTattooDuration

};