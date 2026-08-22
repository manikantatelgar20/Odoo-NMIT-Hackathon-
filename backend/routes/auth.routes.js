const express = require("express");

const router = express.Router();


// POST /api/auth/register
router.post("/register", (req, res) => {

    const {
        name,
        studentId,
        email,
        password
    } = req.body;


    // Basic backend validation
    if (
        !name ||
        !studentId ||
        !email ||
        !password
    ) {

        return res.status(400).json({

            success: false,

            message:
                "All fields are required."

        });

    }


    if (name.trim().length < 2) {

        return res.status(400).json({

            success: false,

            message:
                "Name must contain at least 2 characters."

        });

    }


    if (studentId.trim().length < 3) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid student ID."

        });

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid email address."

        });

    }


    if (password.length < 8) {

        return res.status(400).json({

            success: false,

            message:
                "Password must contain at least 8 characters."

        });

    }


    // Temporary response.
    // Database connection will be added next.

    res.status(201).json({

        success: true,

        message:
            "Registration data validated successfully.",

        user: {

            name:
                name.trim(),

            studentId:
                studentId.trim(),

            email:
                email.toLowerCase().trim()

        }

    });

});


module.exports = router;