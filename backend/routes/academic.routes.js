const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth.middleware");


/* =========================================
   CALCULATE GRADE
========================================= */

function calculateGrade(total) {

    if (total >= 90) return "A+";
    if (total >= 80) return "A";
    if (total >= 70) return "B+";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";

    return "F";
}


/* =========================================
   GET ACADEMICS
   GET /api/academics
========================================= */

router.get(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            const result = await pool.query(
                `
                SELECT
                    id,
                    user_id,
                    subject,
                    internal_marks,
                    semester_end_marks,
                    total,
                    grade,
                    created_at
                FROM academics
                WHERE user_id = $1
                ORDER BY created_at DESC
                `,
                [req.user.userId]
            );


            return res.status(200).json({

                success: true,

                academics:
                    result.rows

            });

        }
        catch (error) {

            console.error(
                "GET academics error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load academic records."

            });

        }

    }
);


/* =========================================
   ADD ACADEMIC RECORD
   POST /api/academics
========================================= */

router.post(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                subject,
                internal_marks,
                semester_end_marks
            } = req.body;


            if (
                !subject ||
                internal_marks === undefined ||
                semester_end_marks === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Subject and marks are required."

                });

            }


            const internal =
                Number(internal_marks);

            const semester =
                Number(semester_end_marks);


            if (
                Number.isNaN(internal) ||
                Number.isNaN(semester)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Marks must be valid numbers."

                });

            }


            if (
                internal < 0 ||
                semester < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Marks cannot be negative."

                });

            }


            const total =
                internal + semester;


            const grade =
                calculateGrade(total);


            const result =
                await pool.query(
                    `
                    INSERT INTO academics
                    (
                        user_id,
                        subject,
                        internal_marks,
                        semester_end_marks,
                        total,
                        grade,
                        created_at
                    )
                    VALUES
                    ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
                    RETURNING *
                    `,
                    [
                        req.user.userId,
                        subject.trim(),
                        internal,
                        semester,
                        total,
                        grade
                    ]
                );


            return res.status(201).json({

                success: true,

                message:
                    "Academic record added successfully.",

                academic:
                    result.rows[0]

            });

        }
        catch (error) {

            console.error(
                "POST academics error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to save academic record."

            });

        }

    }
);


/* =========================================
   DELETE ACADEMIC RECORD
   DELETE /api/academics/:id
========================================= */

router.delete(
    "/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM academics
                    WHERE id = $1
                    AND user_id = $2
                    RETURNING id
                    `,
                    [
                        req.params.id,
                        req.user.userId
                    ]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Academic record not found."

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Academic record deleted."

            });

        }
        catch (error) {

            console.error(
                "DELETE academics error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete academic record."

            });

        }

    }
);


module.exports = router;