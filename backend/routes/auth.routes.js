const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../config/database");

const authenticateToken =
    require("../middleware/auth.middleware");


const router = express.Router();


// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            studentId,
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Clean input
        // ---------------------------------------------

        const cleanName =
            name.trim();

        const cleanStudentId =
            studentId.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // Validate name
        // ---------------------------------------------

        if (cleanName.length < 2) {

            return res.status(400).json({

                success: false,

                message:
                    "Name must contain at least 2 characters."

            });

        }


        // ---------------------------------------------
        // Validate student ID
        // ---------------------------------------------

        if (cleanStudentId.length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid student ID."

            });

        }


        // ---------------------------------------------
        // Validate email
        // ---------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(cleanEmail)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email address."

            });

        }


        // ---------------------------------------------
        // Validate password
        // ---------------------------------------------

        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters."

            });

        }


        // ---------------------------------------------
        // Check duplicate user
        // ---------------------------------------------

        const existingUser =
            await pool.query(
                `
                SELECT id
                FROM users
                WHERE email = $1
                   OR student_id = $2
                `,
                [
                    cleanEmail,
                    cleanStudentId
                ]
            );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "Email or student ID is already registered."

            });

        }


        // ---------------------------------------------
        // Hash password
        // ---------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        // ---------------------------------------------
        // Insert user
        // ---------------------------------------------

        const result =
            await pool.query(
                `
                INSERT INTO users
                (
                    name,
                    student_id,
                    email,
                    password_hash
                )
                VALUES
                ($1, $2, $3, $4)
                RETURNING
                    id,
                    name,
                    student_id,
                    email,
                    created_at
                `,
                [
                    cleanName,
                    cleanStudentId,
                    cleanEmail,
                    passwordHash
                ]
            );


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user:
                result.rows[0]

        });

    }
    catch (error) {

        console.error(
            "Registration error:",
            error.message
        );


        if (error.code === "23505") {

            return res.status(409).json({

                success: false,

                message:
                    "Email or student ID is already registered."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to create account."

        });

    }

});


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // Validate fields
        // ---------------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // Find user
        // ---------------------------------------------

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    name,
                    student_id,
                    email,
                    password_hash
                FROM users
                WHERE email = $1
                `,
                [cleanEmail]
            );


        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const user =
            result.rows[0];


        // ---------------------------------------------
        // Verify password
        // ---------------------------------------------

        const passwordValid =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordValid) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ---------------------------------------------
        // Check JWT secret
        // ---------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );

            return res.status(500).json({

                success: false,

                message:
                    "Authentication configuration error."

            });

        }


        // ---------------------------------------------
        // Create JWT
        // ---------------------------------------------

        const token =
            jwt.sign(

                {
                    userId: user.id,
                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        process.env.JWT_EXPIRES_IN ||
                        "1d"
                }

            );


        // ---------------------------------------------
        // Remove password hash
        // ---------------------------------------------

        delete user.password_hash;


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token: token,

            user: user

        });

    }
    catch (error) {

        console.error(
            "Login error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to login."

        });

    }

});


// =====================================================
// CURRENT USER
// GET /api/auth/me
// =====================================================

router.get(
    "/me",
    authenticateToken,
    async (req, res) => {

        try {

            // -----------------------------------------
            // JWT contains userId
            // -----------------------------------------

            const userId =
                req.user.userId;


            // -----------------------------------------
            // Get user from PostgreSQL
            // -----------------------------------------

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        student_id,
                        email,
                        created_at
                    FROM users
                    WHERE id = $1
                    `,
                    [userId]
                );


            if (result.rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });

            }


            // -----------------------------------------
            // Return current user
            // -----------------------------------------

            return res.status(200).json({

                success: true,

                user:
                    result.rows[0]

            });

        }
        catch (error) {

            console.error(
                "Get current user error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to retrieve user."

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;