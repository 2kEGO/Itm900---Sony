const { Client } = require('pg');

const connectsql = () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  client.connect()
    .then(() => {
      console.log("PostgreSQL connected!");
    })
    .catch((err) => {
      console.error("Error connecting to PostgreSQL:", err);
    });
};

module.exports = connectsql;
