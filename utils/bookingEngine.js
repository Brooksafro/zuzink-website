const {
    getDB,
    getTattooDuration,
    getOpeningHoursForDay
} = require("./database");

const SLOT_MINUTES = 30;

/*
Convert HH:MM to minutes
*/
function toMinutes(time) {

    const [h, m] = time.split(":").map(Number);

    return h * 60 + m;

}

/*
Convert minutes to HH:MM
*/
function toTime(minutes) {

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

}

/*
Generate 30-minute slots
*/
function generateSlots(open, close) {

    const slots = [];

    let current = toMinutes(open);
    const end = toMinutes(close);

    while (current < end) {

        slots.push(toTime(current));

        current += SLOT_MINUTES;

    }

    return slots;

}

/*
Check if two appointments overlap
*/
function overlaps(start1, end1, start2, end2) {

    return start1 < end2 && end1 > start2;

}

/*
Get all available starting times for a date
*/
async function getAvailableSlots(date, tattooType) {

    const db = getDB();

    // Tattoo duration (minutes)
    const tattoo = await getTattooDuration(tattooType);

    if (!tattoo) {
        throw new Error("Tattoo type not found.");
    }

    const duration = tattoo.duration;

    // Day of week
    const day = new Date(date).toLocaleDateString(
        "en-US",
        { weekday: "long" }
    );

    // Opening hours
    const hours = await getOpeningHoursForDay(day);

    if (!hours || !hours.open || !hours.close) {
        return [];
    }

    // Generate every possible 30-minute slot
    const slots = generateSlots(
        hours.open,
        hours.close
    );

    // Existing appointments
    const appointments = await db.all(

        `SELECT *
         FROM appointments
         WHERE DATE(start)=?`,

        [date]

    );

    const available = [];

    for (const slot of slots) {

        const start = toMinutes(slot);
        const end = start + duration;

        // Don't allow appointments after closing
        if (end > toMinutes(hours.close)) {
            continue;
        }

        let valid = true;

        for (const appointment of appointments) {

            const existingStart = toMinutes(
                appointment.start.substring(11, 16)
            );

            const existingEnd = toMinutes(
                appointment.end.substring(11, 16)
            );

            if (
                overlaps(
                    start,
                    end,
                    existingStart,
                    existingEnd
                )
            ) {
                valid = false;
                break;
            }

        }

        if (valid) {
            available.push(slot);
        }

    }

    return available;

}

module.exports = {

    getAvailableSlots,

    overlaps,

    toMinutes,

    toTime,

    generateSlots

};