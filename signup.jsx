const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3002;

// Use bodyParser middleware for handling JSON data
app.use(bodyParser.json());
app.use(cors());

// Create a PostgreSQL pool
const pool = new Pool({
  user: "labber",
  host: "localhost",
  database: "whiteboard",
  password: "labber",
  port: "5432",
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL server successfully!");
  })
  .catch((e) => {
    console.error(`Error connecting to Postgres server:\n${e}`);
  });

// Example endpoint to get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example endpoint to get all content
app.get("/api/content", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM content");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// post request for signup

app.post("/signup", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  pool.query(
    "INSERT INTO users(Email, Password) VALUES($1,$2)",
    // learn about SQL injection, I **hope** the mysql package author considered it.
    [newUser.email, newUser.password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("oh no");
      }

      return res.status(201).send(`Created ID: ${results.insertId}`);
    }
  );
});

module.exports = pool;
