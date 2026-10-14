import db from "../config/db.js";

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tag VARCHAR(100) NOT NULL,
        properties TEXT[] NOT NULL DEFAULT '{}',
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'lost',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("Error creating items table:", error);
  }
}

export async function down() {
  try {
    await db.query("DROP TABLE IF EXISTS items;");
  } catch (error) {
    console.error("Error dropping items table:", error);
  }
}

up();
