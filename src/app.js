const express = require('express');
const { Pool } = require('pg');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.crzpeinkclkd.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: 'monkeymonkeymonkeygoodgood',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <form action="/query" method="post">
      <textarea name="sql" placeholder="Write your SQL here"></textarea><br>
      <button type="submit">Run Query</button>
    </form>
  `);
});

app.post('/query', async (req, res) => {
  try {
    const result = await pool.query(req.body.sql);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/timestamp', (req, res) => {
    pool.connect((err, client, release) => {
      if (err) {
        console.error('Error acquiring client', err.stack);
        res.status(500).send('Database connection error');
        return;
      }
      client.query('SELECT NOW()', (err, result) => {
        release();
        
        if (err) {
          console.error('Error executing query', err.stack);
          res.status(500).send('Query execution error');
        } else {
          res.send(result.rows);
        }
      });
    });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
