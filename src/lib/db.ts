import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

let pool: any = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
}

export const initDb = async () => {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nibgate_settings (
        site_id VARCHAR(50),
        id VARCHAR(255),
        recipient VARCHAR(255),
        price VARCHAR(50),
        PRIMARY KEY (site_id, id)
      );
    `);
  } catch (error) {
    console.error('Failed to initialize database table:', error);
  }
};

export const getSettings = async (site_id: string, id: string) => {
  if (!pool) return null;
  try {
    const res = await pool.query('SELECT * FROM nibgate_settings WHERE site_id = $1 AND id = $2', [site_id, id]);
    return res.rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch settings for ${site_id}/${id}:`, error);
    return null;
  }
};

export const getAllSettings = async (site_id: string) => {
  if (!pool) return [];
  try {
    const res = await pool.query('SELECT * FROM nibgate_settings WHERE site_id = $1', [site_id]);
    return res.rows;
  } catch (error) {
    console.error(`Failed to fetch all settings for ${site_id}:`, error);
    return [];
  }
};

export const upsertSetting = async (site_id: string, id: string, recipient: string, price: string) => {
  if (!pool) return false;
  try {
    await pool.query(`
      INSERT INTO nibgate_settings (site_id, id, recipient, price)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (site_id, id) DO UPDATE SET
        recipient = EXCLUDED.recipient,
        price = EXCLUDED.price;
    `, [site_id, id, recipient, price]);
    return true;
  } catch (error) {
    console.error(`Failed to upsert setting for ${site_id}/${id}:`, error);
    return false;
  }
};
