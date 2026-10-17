import db from "../../config/db.js";

export const requestModel = {

    async getAll () {
        const result = await db.query('SELECT * FROM requests');
        return result.rows[0];
    },

    async getByUser (userId) {
        const result = await db.query('SELECT * FROM requests WHERE user_id = $1', [userId])
        return result.rows[0];
    },

    async getById (id) {
        const result = await db.query('SELECT FROM requests WHERE id = $1', [id])
        return result.rows[0];
    },

    async create (payload) {
        const {
            itemId,
            userId,
            name,
            email,
            phone,
            message,
            descripts,
        } = payload;

        const result = await db.query(
            `INSERT INTO requests
             (item_id, user_id, name, email, phone, message, descripts)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [itemId, userId, name, email, phone, message, descripts]
        );
        return result.rows[0];
    },

    async delete (id) {
        const result = await db.query('DELETE FROM requests WHERE id = $1', [id])
        return result.rows[0];
    }
};
