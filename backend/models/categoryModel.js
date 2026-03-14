const { query } = require('../config/db');

const getAll = async () => {
  return query('SELECT * FROM categories ORDER BY name');
};

const getById = async (id) => {
  const rows = await query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

const create = async (name, description = '') => {
  const result = await query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.insertId;
};

const update = async (id, name, description = '') => {
  await query(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return id;
};

const remove = async (id) => {
  await query('DELETE FROM categories WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, update, remove };
