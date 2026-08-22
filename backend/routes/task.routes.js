const express = require("express");
const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM tasks
             WHERE user_id = $1
             ORDER BY due_date ASC NULLS LAST`,
            [req.user.userId]
        );

        res.json({
            success: true,
            tasks: result.rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load tasks."
        });
    }
});


router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            due_date,
            estimated_minutes
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required."
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks
            (
                user_id,
                title,
                description,
                priority,
                due_date,
                estimated_minutes
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                req.user.userId,
                title.trim(),
                description || "",
                priority || "medium",
                due_date || null,
                estimated_minutes || 60
            ]
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully.",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to create task."
        });
    }
});


router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            due_date,
            estimated_minutes
        } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET
                title = $1,
                description = $2,
                priority = $3,
                status = $4,
                due_date = $5,
                estimated_minutes = $6
             WHERE id = $7
             AND user_id = $8
             RETURNING *`,
            [
                title,
                description || "",
                priority || "medium",
                status || "pending",
                due_date || null,
                estimated_minutes || 60,
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        res.json({
            success: true,
            message: "Task updated.",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update task."
        });
    }
});


router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             AND user_id = $2
             RETURNING id`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        res.json({
            success: true,
            message: "Task deleted."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete task."
        });
    }
});


module.exports = router;