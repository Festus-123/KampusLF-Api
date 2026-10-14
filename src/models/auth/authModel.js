import db from '../../config/db.js'

export const AuthModels = {

    async findByEmail (email) {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email])
        return result.rows[0];
    },

    async create (
        name,
        email, 
        passwordHash,
    ) {
        const result = await db.query(`INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at`,
            [name, email, passwordHash]
        )
        return result.rows[0]
    }
}