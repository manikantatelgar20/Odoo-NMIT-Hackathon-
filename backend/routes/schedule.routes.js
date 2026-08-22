const express = require("express");
const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();


router.get("/", authenticateToken, async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM schedule
             WHERE user_id = $1
             ORDER BY start_time ASC`,
            [req.user.userId]
        );

        res.json({
            success: true,
            schedule: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load schedule."
        });

    }
});


router.post("/", authenticateToken, async (req, res) => {
    try {

        const {
            title,
            start_time,
            end_time,
            location,
            type
        } = req.body;

        if (!title || !start_time) {
            return res.status(400).json({
                success: false,
                message: "Title and start time are required."
            });
        }

        const result = await pool.query(
            `INSERT INTO schedule
            (
                user_id,
                title,
                start_time,
                end_time,
                location,
                type
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                req.user.userId,
                title.trim(),
                start_time,
                end_time || null,
                location || "",
                type || "class"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Schedule added successfully.",
            schedule: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to create schedule."
        });

    }
});


router.delete("/:id", authenticateToken, async (req, res) => {
    try {

        const result = await pool.query(
            `DELETE FROM schedule
             WHERE id = $1
             AND user_id = $2
             RETURNING id`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Schedule item not found."
            });
        }

        res.json({
            success: true,
            message: "Schedule deleted."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete schedule."
        });

    }
});


module.exports = router;