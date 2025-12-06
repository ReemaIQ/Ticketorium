export const eventStatsSeed = [
    {
        eventKey: 4, // Coding Competition
        totals: {
            totalEvents: 1,
            upcomingEvents: 1,
            totalAttendees: 120,
            averageConversion: 0.37,
        },
        attendance: {
            joined: 90,
            waitlisted: 20,
            cancelled: 5,
            noShow: 5,
        },
        funnel: {
            totalVisitors: 800,
            clickedView: 520,
            joined: 120,
        },
        audience: {
            gender: { male: 70, female: 30 },
            ageGroups: { "18-21": 45, "22-25": 35, "26-30": 15, "30+": 5 },
            universities: { kfupm: 70, harvard: 20, other: 10 },
        },
    },
    {
        eventKey: 1, // Harvard Hiking
        totals: {
            totalEvents: 1,
            upcomingEvents: 1,
            totalAttendees: 40,
            averageConversion: 0.25,
        },
        attendance: {
            joined: 30,
            waitlisted: 5,
            cancelled: 3,
            noShow: 2,
        },
        funnel: {
            totalVisitors: 200,
            clickedView: 100,
            joined: 40,
        },
        audience: {
            gender: { male: 50, female: 50 },
            ageGroups: { "18-21": 60, "22-25": 30, "26-30": 10, "30+": 0 },
            universities: { kfupm: 5, harvard: 80, other: 15 },
        },
    },
];