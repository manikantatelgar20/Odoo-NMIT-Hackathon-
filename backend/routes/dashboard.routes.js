const express = require("express");

const { pool } = require("../config/database");

const authenticateToken =
    require("../middleware/auth.middleware");

const router = express.Router();


// =====================================================
// GET DASHBOARD DATA
// GET /api/dashboard
// =====================================================

router.get(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.userId;


            // ---------------------------------------------
            // USER
            // ---------------------------------------------

            const userResult =
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


            if (userResult.rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: "User not found."

                });

            }


            // ---------------------------------------------
            // TASKS
            // ---------------------------------------------

            const tasksResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        title,
                        description,
                        priority,
                        status,
                        due_date,
                        estimated_minutes,
                        created_at
                    FROM tasks
                    WHERE user_id = $1
                    ORDER BY
                        CASE priority
                            WHEN 'high' THEN 1
                            WHEN 'medium' THEN 2
                            ELSE 3
                        END,
                        due_date ASC NULLS LAST
                    `,
                    [userId]
                );


            // ---------------------------------------------
            // TODAY'S SCHEDULE
            // ---------------------------------------------

            const scheduleResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        title,
                        start_time,
                        end_time,
                        location,
                        type
                    FROM schedule
                    WHERE user_id = $1
                    AND DATE(start_time) = CURRENT_DATE
                    ORDER BY start_time ASC
                    `,
                    [userId]
                );


            // ---------------------------------------------
            // ATTENDANCE
            // ---------------------------------------------

            const attendanceResult =
                await pool.query(
                    `
                    SELECT
                        subject,
                        attended_classes,
                        total_classes
                    FROM attendance
                    WHERE user_id = $1
                    ORDER BY subject
                    `,
                    [userId]
                );


            // ---------------------------------------------
            // ACADEMICS
            // ---------------------------------------------

            const academicsResult =
                await pool.query(
                    `
                    SELECT
                        subject,
                        marks,
                        max_marks,
                        grade
                    FROM academics
                    WHERE user_id = $1
                    ORDER BY subject
                    `,
                    [userId]
                );


            // ---------------------------------------------
            // CALCULATE ATTENDANCE
            // ---------------------------------------------

            let totalAttended = 0;

            let totalClasses = 0;


            attendanceResult.rows.forEach(
                row => {

                    totalAttended +=
                        Number(
                            row.attended_classes
                        );

                    totalClasses +=
                        Number(
                            row.total_classes
                        );

                }
            );


            const attendance =
                totalClasses > 0
                    ? Math.round(
                        (
                            totalAttended /
                            totalClasses
                        ) * 100
                    )
                    : 0;


            // ---------------------------------------------
            // PENDING TASKS
            // ---------------------------------------------

            const pendingTasks =
                tasksResult.rows.filter(
                    task =>
                        task.status !==
                        "completed"
                );


            // ---------------------------------------------
            // HIGH PRIORITY TASKS
            // ---------------------------------------------

            const highPriorityTasks =
                pendingTasks.filter(
                    task =>
                        task.priority ===
                        "high"
                );


            // ---------------------------------------------
            // RESPONSE
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                user:
                    userResult.rows[0],

                dashboard: {

                    pendingTasks:
                        pendingTasks.length,

                    highPriorityTasks:
                        highPriorityTasks.length,

                    attendance,

                    todaySchedule:
                        scheduleResult.rows,

                    priorityTasks:
                        pendingTasks.slice(
                            0,
                            5
                        ),

                    academics:
                        academicsResult.rows

                },

                tasks:
                    tasksResult.rows,

                schedule:
                    scheduleResult.rows,

                attendanceDetails:
                    attendanceResult.rows,

                academics:
                    academicsResult.rows

            });

        }
        catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load dashboard data."

            });

        }

    }
);


module.exports = router;