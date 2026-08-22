const { Pool } = require("pg");

require("dotenv").config();


const pool = new Pool({

    user: process.env.DB_USER,

    host: process.env.DB_HOST,

    database: process.env.DB_NAME,

    password: process.env.DB_PASSWORD,

    port: Number(process.env.DB_PORT) || 5432

});


pool.on("error", (error) => {

    console.error(
        "Unexpected PostgreSQL error:",
        error.message
    );

});


async function testDatabaseConnection() {

    try {

        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        console.log(
            "✓ PostgreSQL connected"
        );

        console.log(
            "Database:",
            process.env.DB_NAME
        );

        console.log(
            "Database time:",
            result.rows[0].current_time
        );

    }
    catch (error) {

        console.error(
            "✗ PostgreSQL connection failed:"
        );

        console.error(
            error.message
        );

        throw error;

    }

}


module.exports = {
    pool,
    testDatabaseConnection
};