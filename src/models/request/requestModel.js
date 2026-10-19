import db from "../../config/db.js";

export const requestModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM requests");
    return result.rows;
  },

  async getByUser(userId) {
    const result = await db.query(
      `SELECT requests.*, items.name AS item_name,
              items.properties AS item_properties
       FROM requests
       INNER JOIN items ON items.id = requests.item_id
       WHERE requests.user_id = $1
       ORDER BY requests.created_at DESC, requests.id DESC`,
      [userId],
    );
    return result.rows;
  },

  async getByItemOwner(ownerId) {
    const result = await db.query(
      `SELECT requests.*, items.name AS item_name,
              items.properties AS item_properties
       FROM requests
       INNER JOIN items ON items.id = requests.item_id
       WHERE items.user_id = $1
       ORDER BY requests.created_at DESC, requests.id DESC`,
      [ownerId],
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT FROM requests WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create(payload) {
    const { itemId, userId, name, email, phone, message, descripts } = payload;

    const result = await db.query(
      `INSERT INTO requests
             (item_id, user_id, name, email, phone, message, descripts)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
      [itemId, userId, name, email, phone, message, descripts],
    );
    return result.rows[0];
  },

  async updateStatus(id, userId, status) {
    const result = await db.query(
      `UPDATE requests
       SET status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, status],
    );
    return result.rows[0] ?? null;
  },

  async updateStatusByItemOwner(id, ownerId, status) {
    const result = await db.query(
      `UPDATE requests
       SET status = $3, updated_at = CURRENT_TIMESTAMP
       FROM items
       WHERE requests.id = $1
         AND requests.item_id = items.id
         AND items.user_id = $2
       RETURNING requests.*`,
      [id, ownerId, status],
    );
    return result.rows[0] ?? null;
  },

  async delete(id, userId) {
    const result = await db.query(
      "DELETE FROM requests WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );
    return result.rows[0] ?? null;
  },

  async deleteByItemOwner(id, ownerId) {
    const result = await db.query(
      `DELETE FROM requests
       USING items
       WHERE requests.id = $1
         AND requests.item_id = items.id
         AND items.user_id = $2
       RETURNING requests.*`,
      [id, ownerId],
    );
    return result.rows[0] ?? null;
  },
};
