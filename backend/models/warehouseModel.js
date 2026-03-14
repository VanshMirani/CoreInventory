const { query } = require('../config/db');

const getAll = async () => {
  return query('SELECT * FROM warehouses ORDER BY name');
};

const getById = async (id) => {
  const rows = await query('SELECT * FROM warehouses WHERE id = ?', [id]);
  return rows[0];
};

const create = async (name, location, description = '') => {
  const result = await query(
    'INSERT INTO warehouses (name, location, description) VALUES (?, ?, ?)',
    [name, location, description]
  );
  return result.insertId;
};

const update = async (id, name, location, description = '') => {
  await query(
    'UPDATE warehouses SET name = ?, location = ?, description = ? WHERE id = ?',
    [name, location, description, id]
  );
  return id;
};

const remove = async (id) => {
  await query('DELETE FROM warehouses WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, update, remove };
