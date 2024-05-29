const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();


// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: process.env.PASSWORD,
  database: 'grocery_db'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }
  console.log('Connected to MySQL database');
});
 
// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Add new grocery item
app.post('/api/admin/grocery', (req, res) => {
  const { name, price, quantity } = req.body;
  const sql = 'INSERT INTO grocery_items (name, price, quantity) VALUES (?, ?, ?)';
  connection.query(sql, [name, price, quantity], (error, results) => {
    if (error) {
      console.error('Error adding grocery item:', error);
      res.status(500).json({ message: 'Failed to add grocery item', error });
      return;
    }
    res.json({ message: 'Grocery item added successfully', data: results });
  });
});

// View existing grocery items
app.get('/api/admin/grocery', (req, res) => {
  const sql = 'SELECT * FROM grocery_items';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching grocery items:', error);
      res.status(500).json({ message: 'Failed to fetch grocery items', error });
      return;
    }
    res.json({ message: 'Success', data: results });
  });
});
 
// Remove grocery item
app.delete('/api/admin/grocery/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM grocery_items WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error removing grocery item:', error);
      res.status(500).json({ message: 'Failed to remove grocery item', error });
      return;
    }
    res.json({ message: 'Grocery item removed successfully' });
  });
});

// Update grocery item
app.put('/api/admin/grocery/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const sql = 'UPDATE grocery_items SET name = ?, price = ?, quantity = ? WHERE id = ?';
  connection.query(sql, [name, price, quantity, id], (error, results) => {
    if (error) {
      console.error('Error updating grocery item:', error);
      res.status(500).json({ message: 'Failed to update grocery item', error });
      return;
    }
    res.json({ message: 'Grocery item updated successfully' });
  });
});
///////////////////////////////////
// Update inventory level of a grocery item
app.put('/api/admin/grocery/:id/inventory', (req, res) => {
  const itemId = req.params.id;
  const { inventory } = req.body;

  // Validate input
  if (!itemId || isNaN(itemId) || !inventory || isNaN(inventory)) {
    res.status(400).json({ message: 'Invalid request. Please provide a valid item ID and inventory level.' });
    return;
  }

  // Update inventory in the database
  const sql = 'UPDATE grocery_items SET inventory = ? WHERE id = ?';
  connection.query(sql, [inventory, itemId], (error, results) => {
    if (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ message: 'Failed to update inventory level of grocery item.', error });
      return;
    }
    res.json({ message: 'Inventory level updated successfully', data: results });
  });
});


//////////____________________USER___________________//////////////




// View available grocery items
app.get('/api/user/grocery', (req, res) => {
  const sql = 'SELECT * FROM grocery_items';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching grocery items:', error);
      res.status(500).json({ message: 'Failed to fetch grocery items', error });
      return;
    }
    res.json({ message: 'Success', data: results });
  });
});

// Book multiple grocery items in a single order
app.post('/api/user/order', (req, res) => {
  const { items } = req.body;
  // we can apply any extra logic here according to client need
  res.json({ message: 'Order placed successfully', data: items });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
