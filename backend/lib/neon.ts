import { neon } from '@neondatabase/serverless';

const getConnectionString = () =>
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

const getSql = () => {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('Neon connection string is missing. Set NEON_DATABASE_URL (or DATABASE_URL).');
  }
  return neon(connectionString);
};

export const sql = {
  query: async (queryText: string, params?: any[]) => {
    const client = getSql();
    return client.query(queryText, params);
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
  `CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
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
  `CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id)`,
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
