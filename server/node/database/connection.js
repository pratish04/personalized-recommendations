const { Pool } = require("pg");

require("dotenv").config();

const dbConfig = {
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Define a function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  const client = await pool.connect();

  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch(err){
    console.error('Error while executing query: ', err);
    process.exit(1);
  }
  finally {
    client.release();
  }
};

// Example query
// const exampleQuery = async () => {
//   const result = await query("SELECT * FROM items");
//   console.log("Query result:", result.rows);
// };
// exampleQuery();

// Handle errors globally
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

// exampleQuery();

// Export the query function for use in other modules
module.exports = query;
