const { query } = require('../config/db');

const findByEmail = async (email) => {
  const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const rows = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

const create = async (name, email, passwordHash, role = 'user') => {
  const result = await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

const updateResetToken = async (email, token, expires) => {
  await query(
    'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?',
    [token, expires, email]
  );
};

const clearResetToken = async (email) => {
  await query(
    'UPDATE users SET reset_token = NULL, reset_expires = NULL WHERE email = ?',
    [email]
  );
};

const findByResetToken = async (token) => {
  const rows = await query(
    'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()',
    [token]
  );
  return rows[0];
};

module.exports = { findByEmail, findById, create, updateResetToken, clearResetToken, findByResetToken };

