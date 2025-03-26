const { Pool } = require('pg');
const ck = require('ckey')

const pool = new Pool({
    user: ck.DB_USER,
    host: ck.DB_HOST,
    database: ck.DB_NAME,
    password: ck.DB_PASSWORD,
    port: ck.DB_PORT,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
