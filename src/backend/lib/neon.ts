import { Pool } from 'pg';

const getConnectionString = () =>
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || '';

let pool: Pool | null = null;

const getPool = () => {
  if (pool) return pool;

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('PostgreSQL connection string is missing. Set DATABASE_URL (or POSTGRES_URL).');
  }

  const isLocal =
    connectionString.includes('@127.0.0.1:') ||
    connectionString.includes('@localhost:') ||
    connectionString.includes('sslmode=disable');

  pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  return pool;
};

export const sql = {
  query: async (queryText: string, params?: any[]) => {
    const client = getPool();
    const result = await client.query(queryText, params || []);
    return result.rows;
  },
};

let initPromise: Promise<void> | null = null;

const createStatements = [
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS colors (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS featured_products (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS best_selling_products (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS hero_banners (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS promo_banners (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS festival_banners (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS product_reviews (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS resellers (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS commissions (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS payouts (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS wishlists (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_colors_active ON colors(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_featured_active ON featured_products(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_best_selling_active ON best_selling_products(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users((data->>'email'))`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON product_reviews((data->>'productId'))`,
  `CREATE INDEX IF NOT EXISTS idx_resellers_user_id ON resellers((data->>'userId'))`,
  `CREATE INDEX IF NOT EXISTS idx_resellers_referral_code ON resellers((data->>'referralCode'))`,
  `CREATE INDEX IF NOT EXISTS idx_resellers_status ON resellers((data->>'status'))`,
  `CREATE INDEX IF NOT EXISTS idx_referrals_reseller_id ON referrals((data->>'resellerId'))`,
  `CREATE INDEX IF NOT EXISTS idx_commissions_reseller_id ON commissions((data->>'resellerId'))`,
  `CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions((data->>'orderId'))`,
  `CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions((data->>'status'))`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_reseller_id ON payouts((data->>'resellerId'))`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts((data->>'status'))`,
  `CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id)`,
];

export async function ensureDatabaseReady(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    for (const statement of createStatements) {
      await sql.query(statement);
    }
  })();

  return initPromise;
}
