import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {

    await sql`
      INSERT INTO test_connection (message)
      VALUES ('Hello from Vercel')
    `;

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}