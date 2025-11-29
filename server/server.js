const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper to wrap db.run in a promise
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper to wrap db.get in a promise
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper to wrap db.all in a promise
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// --- ROUTES ---

// Create User (for testing mainly)
app.post('/users', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    const result = await dbRun('INSERT INTO users (username) VALUES (?)', [username]);
    // Initialize stats for the user
    await dbRun('INSERT INTO stats (user_id) VALUES (?)', [result.lastID]);
    res.status(201).json({ id: result.lastID, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Create Task
app.post('/tasks', async (req, res) => {
  const { title, difficulty, due_date, user_id } = req.body;

  // Basic validation
  if (!title || !difficulty || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const allowedDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!allowedDifficulties.includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty' });
  }

  try {
    const result = await dbRun(
      `INSERT INTO tasks (title, difficulty, due_date, user_id) VALUES (?, ?, ?, ?)`,
      [title, difficulty, due_date, user_id]
    );

    const newTask = await dbGet(`SELECT * FROM tasks WHERE id = ?`, [result.lastID]);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tasks/:id - Update Task (e.g. Complete)
app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const allowedUpdates = ['status', 'title', 'deleted_at']; // Only allow specific updates

  const fields = Object.keys(updates).filter(key => allowedUpdates.includes(key));

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid updates provided' });
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updates[field]);

  try {
    await dbRun(`UPDATE tasks SET ${setClause} WHERE id = ?`, [...values, id]);
    const updatedTask = await dbGet(`SELECT * FROM tasks WHERE id = ?`, [id]);
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /dashboard - Aggregate tasks and stats
app.get('/dashboard', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id query param required' });
  }

  try {
    const stats = await dbGet(`SELECT * FROM stats WHERE user_id = ?`, [user_id]);
    // Only fetch non-deleted tasks
    const tasks = await dbAll(`SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL`, [user_id]);

    res.json({
      stats,
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
