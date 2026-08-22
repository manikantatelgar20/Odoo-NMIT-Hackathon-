const express = require("express");
const cors = require("cors");
require("dotenv").config();


// =====================================================
// DATABASE
// =====================================================

const {
    testDatabaseConnection
} = require("./config/database");


// =====================================================
// ROUTES
// =====================================================

const authRoutes =
    require("./routes/auth.routes");

const academicRoutes =
    require("./routes/academic.routes");

const attendanceRoutes =
    require("./routes/attendance.routes");

const scheduleRoutes =
    require("./routes/schedule.routes");

const taskRoutes =
    require("./routes/task.routes");


// =====================================================
// EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// PORT
// =====================================================

const PORT =
    process.env.PORT || 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

// CORS
app.use(
    cors({
        origin: "*",

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// JSON
app.use(
    express.json({
        limit: "2mb"
    })
);


// URL encoded
app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// REQUEST LOGGER
// =====================================================

app.use(
    (req, res, next) => {

        console.log(
            `[CORELY] ${req.method} ${req.originalUrl}`
        );

        next();

    }
);


// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            project: "Corely",

            message:
                "Corely API is running.",

            version: "1.0.0"

        });

    }
);


// =====================================================
// HEALTH
// =====================================================

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            project: "Corely",

            status: "online",

            database:
                "Local PostgreSQL",

            timestamp:
                new Date().toISOString()

        });

    }
);


// =====================================================
// AUTH
// =====================================================

// POST /api/auth/register
// POST /api/auth/login

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// ACADEMICS
// =====================================================

// GET    /api/academics
// POST   /api/academics
// DELETE /api/academics/:id

app.use(
    "/api/academics",
    academicRoutes
);


// =====================================================
// ATTENDANCE
// =====================================================

// GET    /api/attendance
// POST   /api/attendance
// DELETE /api/attendance/:id

app.use(
    "/api/attendance",
    attendanceRoutes
);


// =====================================================
// SCHEDULE
// =====================================================

// GET    /api/schedule
// POST   /api/schedule
// DELETE /api/schedule/:id

app.use(
    "/api/schedule",
    scheduleRoutes
);


// =====================================================
// TASKS
// =====================================================

// GET    /api/tasks
// POST   /api/tasks
// PUT    /api/tasks/:id
// DELETE /api/tasks/:id

app.use(
    "/api/tasks",
    taskRoutes
);


// =====================================================
// CORELY AI
// =====================================================

app.post(
    "/api/ai",
    async (req, res) => {

        try {

            const {
                message,
                context
            } = req.body;


            // -----------------------------------------
            // Validate
            // -----------------------------------------

            if (
                !message ||
                typeof message !== "string"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "AI message is required."

                });

            }


            const text =
                message
                    .toLowerCase()
                    .trim();


            // -----------------------------------------
            // AI response
            // -----------------------------------------

            let reply;


            // Attendance
            if (
                text.includes("attendance") ||
                text.includes("absent") ||
                text.includes("present")
            ) {

                reply =
                    "Corely AI recommends maintaining at least 75% attendance. Focus first on subjects where your attendance is lowest.";

            }


            // Academics
            else if (
                text.includes("marks") ||
                text.includes("grade") ||
                text.includes("academic") ||
                text.includes("cgpa")
            ) {

                reply =
                    "Corely AI recommends reviewing your lower-scoring subjects and creating focused study sessions around them.";

            }


            // Study
            else if (
                text.includes("study") ||
                text.includes("revision")
            ) {

                reply =
                    "Try a focused 45-minute study session followed by a 10-minute break. Prioritize your closest deadline first.";

            }


            // Exam
            else if (
                text.includes("exam") ||
                text.includes("test")
            ) {

                reply =
                    "Start preparing for the nearest exam first. Give extra revision time to subjects where your current performance is weaker.";

            }


            // Tasks
            else if (
                text.includes("task") ||
                text.includes("assignment") ||
                text.includes("deadline")
            ) {

                reply =
                    "Complete high-priority tasks before lower-priority activities. Corely recommends protecting important deadlines in your schedule.";

            }


            // Schedule
            else if (
                text.includes("schedule") ||
                text.includes("plan") ||
                text.includes("timetable")
            ) {

                reply =
                    "Your schedule should protect classes and deadlines first, then place study sessions in the remaining time.";

            }


            // Greeting
            else if (
                text.includes("hello") ||
                text.includes("hi") ||
                text.includes("hey")
            ) {

                reply =
                    "Hi! I'm Corely AI 👋 I can help you with studies, attendance, academics, tasks, exams and scheduling.";

            }


            // Default
            else {

                reply =
                    "I'm Corely AI 🤖. Ask me about your studies, attendance, academics, tasks, exams or schedule.";

            }


            // -----------------------------------------
            // Response
            // -----------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Corely AI response generated.",

                reply: reply,

                context:
                    context || null

            });

        }
        catch (error) {

            console.error(
                "CORELY AI ERROR:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to process AI request."

            });

        }

    }
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "CORELY SERVER ERROR:",
            error
        );


        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Internal server error."

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        console.log("");
        console.log(
            "Connecting to PostgreSQL..."
        );


        // -----------------------------------------
        // Check JWT
        // -----------------------------------------

        if (
            !process.env.JWT_SECRET
        ) {

            throw new Error(
                "JWT_SECRET is missing from backend/.env"
            );

        }


        // -----------------------------------------
        // Check database
        // -----------------------------------------

        await testDatabaseConnection();


        console.log(
            "PostgreSQL connected"
        );


        // -----------------------------------------
        // Start Express
        // -----------------------------------------

        app.listen(
            PORT,
            () => {

                console.log("");
                console.log(
                    "=============================================="
                );

                console.log(
                    "             CORELY BACKEND"
                );

                console.log(
                    "=============================================="
                );

                console.log(
                    `Server      : http://localhost:${PORT}`
                );

                console.log(
                    `Health      : http://localhost:${PORT}/api/health`
                );

                console.log(
                    `Auth        : http://localhost:${PORT}/api/auth`
                );

                console.log(
                    `Academics   : http://localhost:${PORT}/api/academics`
                );

                console.log(
                    `Attendance  : http://localhost:${PORT}/api/attendance`
                );

                console.log(
                    `Schedule    : http://localhost:${PORT}/api/schedule`
                );

                console.log(
                    `Tasks       : http://localhost:${PORT}/api/tasks`
                );

                console.log(
                    `AI          : http://localhost:${PORT}/api/ai`
                );

                console.log(
                    "Database    : Local PostgreSQL"
                );

                console.log(
                    "Status      : ONLINE"
                );

                console.log(
                    "=============================================="
                );

                console.log("");

            }
        );

    }
    catch (error) {

        console.error("");
        console.error(
            "=============================================="
        );

        console.error(
            "       CORELY SERVER FAILED TO START"
        );

        console.error(
            "=============================================="
        );

        console.error(
            error.message
        );

        console.error(
            "=============================================="
        );

        process.exit(1);

    }

}


// =====================================================
// RUN
// =====================================================

startServer();