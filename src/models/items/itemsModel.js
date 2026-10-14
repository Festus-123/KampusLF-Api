import db from "../../config/db.js";

export const itemModel = {
  async getAllLostItems() {
    const result = await db.query(
      "SELECT * FROM items WHERE status = $1 ORDER BY created_at DESC",
      ["lost"],
    );
    return result.rows;
  },

  async getLostItemById(itemId) {
    const result = await db.query(
      "SELECT * FROM items WHERE id = $1 AND status = $2",
      [itemId, "lost"],
    );
    return result.rows[0] ?? null;
  },

  async createLostItem({ name, tag, properties = [], userId, image = null }) {
    const result = await db.query(
      `INSERT INTO items (name, tag, properties, user_id, image)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
      [name, tag, properties, userId, image],
    );
    return result.rows[0];
  },

  async updateLostItem(itemId, userId, updates) {
    const allowedColumns = {
      name: "name",
      tag: "tag",
      properties: "properties",
      image: "image",
      status: "status",
    };
    const fields = Object.keys(allowedColumns).filter((field) =>
      Object.hasOwn(updates, field),
    );

    if (fields.length === 0) {
      return null;
    }

    const values = fields.map((field) => updates[field]);
    const assignments = fields.map(
      (field, index) => `${allowedColumns[field]} = $${index + 1}`,
    );
    values.push(itemId, userId);

    const result = await db.query(
      `UPDATE items
             SET ${assignments.join(", ")}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $${values.length - 1} AND user_id = $${values.length}
             RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  },

  async deleteLostItem(itemId, userId) {
    const result = await db.query(
      "DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *",
      [itemId, userId],
    );
    return result.rows[0] ?? null;
  },
};
