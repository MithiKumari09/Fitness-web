import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Database connection
const pool = new Pool({
  user: "postgres",   // your DB user
  host: "localhost",
  database: "postgres",
  password: "Mithichiru10",
  port: 5432,
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    gender VARCHAR(10),
    service VARCHAR(50)
  )
`).then(() => console.log("✅ Table ready"))
  .catch(err => console.error(err));

// API endpoint
app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, password, gender, service} = req.body;
  // console.log("received",req.body);
  try {
    await pool.query(
      "INSERT INTO contacts (firstName, lastName, email, password, gender, service) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstName, lastName, email, password, gender, service]
    );

    res.json({ message: "✅ Contact saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error saving contact" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
