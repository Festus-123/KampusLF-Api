import db from "../config/db.js";

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        message TEXT NOT NULL,
        descripts TEXT[] NOT NULL DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.query(`
      ALTER TABLE requests
      ADD COLUMN IF NOT EXISTS descripts TEXT[] NOT NULL DEFAULT '{}';
    `);
  } catch (error) {
    console.error("Error creating requests table:", error);
  }
}

export async function down() {
  try {
    await db.query("DROP TABLE IF EXISTS requests;");
  } catch (error) {
    console.error("Error dropping requests table:", error);
  }
}

up();
