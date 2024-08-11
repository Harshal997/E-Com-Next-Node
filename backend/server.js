const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const pg = require('pg');

const app = express();
const port = 3001;
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'workwise',
  password: 'root',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/signup', async (req, res) => {
  const { username, email, password, isSeller } = req.body;
  console.log(username, email, password, isSeller);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password.' });
  }

  let role = "buyer";
  if (isSeller) {
    role = "seller"
  }

  try {
    // const test = await pool.query("select * from users");
    // console.log(test.rows);
    const result = await pool.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id', [username, email, password, role]);
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.status(201).json({ userId: result.rows[0].id, role, message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'An error occurred while creating user.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = result.rows[0];

    const passwordMatch = password == user.password

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ userId: result.rows[0].id, role: user.role, message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
});

app.post('/api/products', async (req, res) => {
  console.log(req.body);
  const { userId, name, category, description, price, discount } = req.body;
  console.log(userId, name, category, description, price, discount);
  try {
    const result = await pool.query('INSERT INTO products(seller_id, name, category, description, price, discount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, name, category, description, price, discount]);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error while inserting data in the database.' });
  }
})

app.get('/api/products/:id', async (req, res) => {
  const sellerId = req.params.id;
  console.log("sellerId", sellerId)
  if (sellerId === null || sellerId === undefined || sellerId === '') {
    return res.status(401).json("Unauthorized, Please login again to continue");
  }
  try {
    const result = await pool.query('SELECT * from products WHERE seller_id = $1', [sellerId]);
    return res.status(200).json(result.rows);
  }
  catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error fetching your products" });
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const searchTerm = req.headers['search']; // Replace with actual search term or dynamic input
    console.log(searchTerm);

    const query = `
    SELECT * 
FROM products 
WHERE 
    (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
    OR
    (category ILIKE '%' || $1 || '%' OR $1 IS NULL);

`;

    const result = await pool.query(query, [searchTerm]);

    return res.status(200).json(result.rows);
  }
  catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error fetching your products" });
  }
})

app.put('/api/products', async (req, res) => {
  console.log("data", req.body)
  const { name, category, description, price, discount, proId } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products
       SET 
         name = $1,
         category = $2,
         description = $3,
         price = $4,
         discount = $5
       WHERE id = $6
       RETURNING *`,
      [name, category, description, price, discount, proId]
    );

    console.log('Product updated successfully:', result.rows[0]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: "Error updating your product" });
    throw error;
  }
})

app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE from products where id = $1 RETURNING *', [id]);
    return res.status(200).json(result.rows);
  }
  catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error deleting your product" });
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
