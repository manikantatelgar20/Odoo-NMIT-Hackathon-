const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "Corely",
        message: "Corely API is running"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        project: "Corely",
        status: "online",
        message: "Corely backend is running",
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log("-----------------------------------");
    console.log("       CORELY BACKEND SERVER");
    console.log("-----------------------------------");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log("-----------------------------------");
});