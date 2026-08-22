const express = require("express");
const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();


router.get(
    "/insights",
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.userId;


            // -----------------------------------------
            // TASKS
            // -----------------------------------------

            const tasks =
                await pool.query(
                    `SELECT *
                     FROM tasks
                     WHERE user_id = $1
                     AND status != 'completed'
                     ORDER BY due_date ASC NULLS LAST`,
                    [userId]
                );


            // -----------------------------------------
            // ATTENDANCE
            // -----------------------------------------

            const attendance =
                await pool.query(
                    `SELECT *
                     FROM attendance
                     WHERE user_id = $1`,
                    [userId]
                );


            // -----------------------------------------
            // ACADEMICS
            // -----------------------------------------

            const academics =
                await pool.query(
                    `SELECT *
                     FROM academics
                     WHERE user_id = $1`,
                    [userId]
                );


            const taskList =
                tasks.rows;

            const attendanceList =
                attendance.rows;

            const academicList =
                academics.rows;


            const insights = [];


            // =========================================
            // TASK AI
            // =========================================

            const highPriority =
                taskList.filter(
                    task =>
                        task.priority === "high"
                );


            if (highPriority.length > 0) {

                insights.push({
                    type: "task",
                    level: "high",
                    title: "Priority task detected",
                    message:
                        `You have ${highPriority.length} high-priority task${highPriority.length > 1 ? "s" : ""}. Corely recommends completing these before lower-priority work.`
                });

            }


            // =========================================
            // ATTENDANCE AI
            // =========================================

            attendanceList.forEach(
                subject => {

                    const total =
                        Number(
                            subject.total_classes
                        );

                    const attended =
                        Number(
                            subject.attended_classes
                        );


                    if (total <= 0) {
                        return;
                    }


                    const percentage =
                        Math.round(
                            (attended / total) *
                            100
                        );


                    if (percentage < 75) {

                        insights.push({
                            type: "attendance",
                            level: "warning",
                            title:
                                `${subject.subject} attendance alert`,
                            message:
                                `Your attendance is ${percentage}%. Try to attend the upcoming ${subject.subject} classes consistently.`
                        });

                    }
                    else if (
                        percentage >= 90
                    ) {

                        insights.push({
                            type: "attendance",
                            level: "good",
                            title:
                                `${subject.subject} attendance is strong`,
                            message:
                                `Your attendance is ${percentage}%. Keep maintaining this consistency.`
                        });

                    }

                }
            );


            // =========================================
            // ACADEMIC AI
            // =========================================

            if (academicList.length > 0) {

                const average =
                    academicList.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            (
                                Number(item.marks) /
                                Number(item.max_marks || 100)
                            ) *
                            100,
                        0
                    ) /
                    academicList.length;


                const roundedAverage =
                    Math.round(
                        average
                    );


                if (
                    roundedAverage < 60
                ) {

                    insights.push({
                        type: "academic",
                        level: "warning",
                        title: "Academic improvement needed",
                        message:
                            `Your current average is ${roundedAverage}%. Corely recommends focusing more study time on your weaker subjects.`
                    });

                }
                else if (
                    roundedAverage >= 85
                ) {

                    insights.push({
                        type: "academic",
                        level: "excellent",
                        title: "Excellent academic performance",
                        message:
                            `Your current average is ${roundedAverage}%. Keep your current study pattern and focus on consistency.`
                    });

                }
                else {

                    insights.push({
                        type: "academic",
                        level: "good",
                        title: "Academic progress",
                        message:
                            `Your current average is ${roundedAverage}%. Corely recommends regular revision to improve further.`
                    });

                }

            }


            // =========================================
            // GENERAL AI
            // =========================================

            if (insights.length === 0) {

                insights.push({
                    type: "general",
                    level: "info",
                    title: "Corely is learning your routine",
                    message:
                        "Add tasks, attendance and academic records so Corely can generate personalized recommendations."
                });

            }


            res.json({

                success: true,

                engine:
                    "Corely Adaptive Intelligence",

                insights

            });

        }
        catch (error) {

            console.error(
                "AI error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to generate AI insights."

            });

        }

    }
);


module.exports = router;