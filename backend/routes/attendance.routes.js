const express = require("express");
const router = express.Router();

const { pool } =
    require("../config/database");

const authenticateToken =
    require("../middleware/auth.middleware");


/* =====================================================
   GET ATTENDANCE
   ===================================================== */

router.get(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        user_id,
                        subject,
                        attended_classes
                    FROM attendance
                    WHERE user_id = $1
                    ORDER BY id DESC
                    `,
                    [req.user.userId]
                );


            res.json({

                success: true,

                attendance:
                    result.rows

            });

        }
        catch (error) {

            console.error(
                "GET ATTENDANCE ERROR:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load attendance."

            });

        }

    }
);


/* =====================================================
   ADD ATTENDANCE
   ===================================================== */

router.post(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                subject,
                present_classes,
                total_classes
            } = req.body;


            if (!subject) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Subject is required."

                });

            }


            const present =
                Number(present_classes);


            const total =
                Number(total_classes);


            if (
                !Number.isFinite(present) ||
                !Number.isFinite(total)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Class values must be numbers."

                });

            }


            if (total <= 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Total classes must be greater than zero."

                });

            }


            if (
                present < 0 ||
                present > total
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid attendance values."

                });

            }


            const result =
                await pool.query(
                    `
                    INSERT INTO attendance
                    (
                        user_id,
                        subject,
                        attended_classes
                    )
                    VALUES
                    ($1, $2, $3)
                    RETURNING
                        id,
                        user_id,
                        subject,
                        attended_classes
                    `,
                    [
                        req.user.userId,
                        subject.trim(),
                        present
                    ]
                );


            const record =
                result.rows[0];


            const percentage =
                Number(
                    (
                        (present / total) * 100
                    ).toFixed(2)
                );


            res.status(201).json({

                success: true,

                message:
                    "Attendance saved successfully.",

                attendance: {

                    id:
                        record.id,

                    user_id:
                        record.user_id,

                    subject:
                        record.subject,

                    attended_classes:
                        record.attended_classes,

                    present_classes:
                        present,

                    total_classes:
                        total,

                    percentage:
                        percentage

                }

            });

        }
        catch (error) {

            console.error(
                "ADD ATTENDANCE ERROR:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to save attendance.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   DELETE ATTENDANCE
   ===================================================== */

router.delete(
    "/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM attendance
                    WHERE id = $1
                    AND user_id = $2
                    RETURNING id
                    `,
                    [
                        req.params.id,
                        req.user.userId
                    ]
                );


            if (!result.rows.length) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Attendance record not found."

                });

            }


            res.json({

                success: true,

                message:
                    "Attendance deleted successfully."

            });

        }
        catch (error) {

            console.error(
                "DELETE ATTENDANCE ERROR:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete attendance."

            });

        }

    }
);


module.exports = router;