const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes =
    require("./routes/auth.routes");

const {
    testDatabaseConnection
} = require("./config/database");


const app = express();

const PORT =
    process.env.PORT || 5000;


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// AUTH ROUTES
// =========================

app.use(
    "/api/auth",
    authRoutes
);


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({

        success: true,

        project: "Corely",

        message:
            "Corely API is running"

    });

});


// =========================
// HEALTH CHECK
// =========================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            project: "Corely",

            status: "online",

            message:
                "Corely backend is running",

            timestamp:
                new Date().toISOString()

        });

    }
);


// =========================
// START SERVER
// =========================

async function startServer() {

    try {

        // Test Neon PostgreSQL
        await testDatabaseConnection();


        app.listen(
            PORT,
            () => {

                console.log(
                    "-----------------------------------"
                );

                console.log(
                    "       CORELY BACKEND SERVER"
                );

                console.log(
                    "-----------------------------------"
                );

                console.log(
                    `Server: http://localhost:${PORT}`
                );

                console.log(
                    `Health: http://localhost:${PORT}/api/health`
                );

                console.log(
                    "Database: Neon PostgreSQL"
                );

                console.log(
                    "-----------------------------------"
                );

            }
        );

    }
    catch (error) {

        console.error(
            "-----------------------------------"
        );

        console.error(
            "CORELY SERVER FAILED TO START"
        );

        console.error(
            "-----------------------------------"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


startServer();