import {
  BestSellingProduct,
  Category,
  Color,
  FestivalBanner,
  FeaturedProduct,
  HeroBanner,
  Order,
  Product,
  ProductReview,
  PromoBanner,
  PromoBannerVariant,
  Commission,
  CommissionStatus,
  Payout,
  PayoutMethod,
  Referral,
  Reseller,
  ResellerStatus,
  ReviewSource,
  User,
} from '@/types';
import { ensureDatabaseReady, sql } from './neon';
import { DEFAULT_SITE_THEME, getThemePresetById, SiteThemeId } from '@/lib/themePresets';

type EntityTable =
  | 'products'
  | 'orders'
  | 'categories'
  | 'colors'
  | 'users'
  | 'featured_products'
  | 'best_selling_products'
  | 'hero_banners'
  | 'promo_banners'
  | 'festival_banners'
  | 'product_reviews'
  | 'resellers'
  | 'referrals'
  | 'commissions'
  | 'payouts';

type StoredRow<T> = {
  id: string;
  data: T;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteThemeSettings = {
  id: SiteThemeId;
  updatedAt: string;
};

export type MonthlyTargetSettings = {
  amount: number;
  updatedAt: string;
};

let productsCache: { data: Product[]; timestamp: number } | null = null;
let colorsCache: { data: Color[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

const nowIso = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeAmount = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const normalizeReferralCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 16);

const makeReferralCode = (seed = 'DREAM') =>
  normalizeReferralCode(`${seed.slice(0, 5)}${Math.random().toString(36).slice(2, 8)}`) || `DS${Date.now()}`;

const decodeNextImageUrl = (value: string): string => {
  if (!value) return value;
  let normalized = value.trim();

  for (let i = 0; i < 3; i += 1) {
    if (normalized.startsWith('/_next/image?')) {
      try {
        const parsed = new URL(normalized, 'https://dreamshopltd.com');
        const nested = parsed.searchParams.get('url');
        if (nested) {
          normalized = decodeURIComponent(nested);
          continue;
        }
      } catch {
        return value;
      }
    }

    const decoded = decodeURIComponent(normalized);
    if (decoded === normalized) break;
    normalized = decoded;
  }

  if (normalized.startsWith('https://https://')) {
    normalized = normalized.replace('https://https://', 'https://');
  }
  if (normalized.startsWith('http://http://')) {
    normalized = normalized.replace('http://http://', 'http://');
  }

  return normalized;
};

const normalizeImageFields = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeImageFields(item)) as T;
  }

  if (!input || typeof input !== 'object') return input;

  const obj = input as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && (key === 'image' || key === 'avatar')) {
      normalized[key] = decodeNextImageUrl(value);
      continue;
    }

    if (Array.isArray(value) && (key === 'images' || key === 'sliderImages' || key === 'rightBanners')) {
      normalized[key] = value.map((item) => (typeof item === 'string' ? decodeNextImageUrl(item) : normalizeImageFields(item)));
      continue;
    }

    normalized[key] = normalizeImageFields(value as any);
  }

  return normalized as T;
};

const withTimestamps = <T extends { createdAt?: string; updatedAt?: string }>(entity: T): T => {
  const now = nowIso();
  return {
    ...entity,
    createdAt: entity.createdAt || now,
    updatedAt: now,
  };
};

async function getRows<T>(table: EntityTable, includeInactive = false): Promise<StoredRow<T>[]> {
  await ensureDatabaseReady();
  const rows = includeInactive
    ? await sql.query(`SELECT id, data, is_active, created_at, updated_at FROM ${table} ORDER BY updated_at DESC`)
    : await sql.query(
        `SELECT id, data, is_active, created_at, updated_at FROM ${table} WHERE is_active = true ORDER BY updated_at DESC`
      );
  return rows as StoredRow<T>[];
}

async function getRowById<T>(table: EntityTable, id: string): Promise<StoredRow<T> | null> {
  await ensureDatabaseReady();
  const rows = await sql.query(`SELECT id, data, is_active, created_at, updated_at FROM ${table} WHERE id = $1 LIMIT 1`, [id]);
  const row = (rows[0] as StoredRow<T>) || null;
  if (!row) return null;
  return {
    ...row,
    data: normalizeImageFields(row.data),
  };
}

async function upsertRow<T extends { id: string; isActive?: boolean; createdAt?: string; updatedAt?: string }>(
  table: EntityTable,
  entity: T
): Promise<T> {
  await ensureDatabaseReady();
  const normalized = withTimestamps(entity);
  const isActive = normalized.isActive !== false;
  await sql.query(
    `INSERT INTO ${table} (id, data, is_active, updated_at)
     VALUES ($1, $2::jsonb, $3, NOW())
     ON CONFLICT (id) DO UPDATE SET
       data = EXCLUDED.data,
       is_active = EXCLUDED.is_active,
       updated_at = NOW()`,
    [normalized.id, JSON.stringify(normalized), isActive]
  );
  return normalized;
}

async function hardDeleteById<T>(table: EntityTable, id: string): Promise<T | null> {
  const existing = await getRowById<T>(table, id);
  if (!existing) return null;
  await sql.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return existing.data;
}

async function softDeleteById<T extends { isActive?: boolean; updatedAt?: string }>(
  table: EntityTable,
  id: string
): Promise<T | null> {
  const existing = await getRowById<T>(table, id);
  if (!existing) return null;
  const updated = { ...existing.data, isActive: false, updatedAt: nowIso() } as T;
  await upsertRow(table, { ...(updated as any), id });
  return updated;
}

function rowsToEntities<T extends { id?: string; isActive?: boolean }>(rows: StoredRow<T>[]): T[] {
  return rows.map((row) => ({
    ...(normalizeImageFields(row.data) as any),
    id: row.data?.id || row.id,
    isActive: row.data?.isActive ?? row.is_active,
  })) as T[];
}

export async function getProducts(): Promise<Product[]> {
  const now = Date.now();
  if (productsCache && now - productsCache.timestamp < CACHE_TTL) return productsCache.data;
  const rows = await getRows<Product>('products');
  const data = rowsToEntities<Product>(rows);
  productsCache = { data, timestamp: now };
  return data;
}

export function invalidateProductsCache(): void {
  productsCache = null;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await getRowById<Product>('products', id);
  if (row?.is_active) return { ...(row.data as any), id: row.id };
  const all = await getProducts();
  return all.find((p) => p.id === id || p.sku === id);
}

export async function saveProduct(product: Product): Promise<Product> {
  const saved = await upsertRow('products', {
    ...product,
    id: product.id || makeId('product'),
    isActive: product.isActive !== false,
  });
  invalidateProductsCache();
  return saved;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const deleted = await hardDeleteById<Product>('products', id);
  if (!deleted) return null;
  await sql.query(`DELETE FROM featured_products WHERE (data->>'productId') = $1 OR id = $1`, [id]);
  await sql.query(`DELETE FROM best_selling_products WHERE (data->>'productId') = $1 OR id = $1`, [id]);
  invalidateProductsCache();
  return deleted;
}

export async function removeProductImage(id: string, imageIndex: number): Promise<Product | null> {
  const product = await getProductById(id);
  if (!product) return null;
  const images = Array.isArray(product.images) ? product.images : [];
  if (imageIndex < 0 || imageIndex >= images.length) return product;
  const updated: Product = {
    ...product,
    images: images.filter((_, idx) => idx !== imageIndex),
    updatedAt: nowIso(),
  };
  await saveProduct(updated);
  return updated;
}

export async function getOrders(): Promise<Order[]> {
  const rows = await getRows<Order>('orders', true);
  return rowsToEntities<Order>(rows);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await getRowById<Order>('orders', id);
  return row ? ({ ...(row.data as any), id: row.id } as Order) : undefined;
}

export async function saveOrder(order: Order): Promise<Order> {
  return upsertRow('orders', {
    ...order,
    id: order.id || makeId('order'),
    isActive: true,
  } as any);
}

export async function getResellers(includeInactive = true): Promise<Reseller[]> {
  const rows = await getRows<Reseller>('resellers', includeInactive);
  return rowsToEntities<Reseller>(rows);
}

export async function getResellerById(id: string): Promise<Reseller | undefined> {
  const row = await getRowById<Reseller>('resellers', id);
  return row ? ({ ...(row.data as any), id: row.id } as Reseller) : undefined;
}

export async function getResellerByUserId(userId: string): Promise<Reseller | undefined> {
  const resellers = await getResellers(true);
  return resellers.find((reseller) => reseller.userId === userId);
}

export async function getResellerByReferralCode(referralCode: string): Promise<Reseller | undefined> {
  const normalized = normalizeReferralCode(referralCode);
  if (!normalized) return undefined;
  const resellers = await getResellers(true);
  return resellers.find((reseller) => reseller.referralCode === normalized);
}

export async function saveReseller(reseller: Reseller): Promise<Reseller> {
  return upsertRow('resellers', {
    ...reseller,
    referralCode: normalizeReferralCode(reseller.referralCode),
    totalEarnings: normalizeAmount(reseller.totalEarnings),
    availableBalance: normalizeAmount(reseller.availableBalance),
    pendingBalance: normalizeAmount(reseller.pendingBalance),
    status: reseller.status || 'pending',
    isActive: reseller.status !== 'banned',
  } as any);
}

export async function createResellerSignup(input: {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  shopName?: string;
  status?: ResellerStatus;
}): Promise<Reseller> {
  const email = input.email?.trim() || `${input.phone.replace(/\D/g, '') || Date.now()}@reseller.dreamshop.local`;
  const nameParts = input.name.trim().split(/\s+/);
  const user = await saveUser({
    email,
    firstName: nameParts[0] || input.name,
    lastName: nameParts.slice(1).join(' '),
    phone: input.phone,
    password: input.password,
    role: 'reseller',
    isEmailVerified: false,
  } as any);

  const existing = await getResellerByUserId(user.id);
  if (existing) return existing;

  let referralCode = makeReferralCode(input.shopName || input.name || input.phone);
  while (await getResellerByReferralCode(referralCode)) {
    referralCode = makeReferralCode(input.shopName || input.name || input.phone);
  }

  return saveReseller({
    id: makeId('reseller'),
    userId: user.id,
    name: input.name,
    phone: input.phone,
    email: input.email,
    shopName: input.shopName,
    referralCode,
    status: input.status || 'pending',
    totalEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

export async function getReferrals(resellerId?: string): Promise<Referral[]> {
  const rows = await getRows<Referral>('referrals', true);
  const referrals = rowsToEntities<Referral>(rows);
  return resellerId ? referrals.filter((item) => item.resellerId === resellerId) : referrals;
}

export async function trackReferralClick(input: {
  referralCode: string;
  clickedIp?: string;
  userAgent?: string;
}): Promise<Referral | null> {
  const reseller = await getResellerByReferralCode(input.referralCode);
  if (!reseller || reseller.status !== 'active') return null;
  return upsertRow('referrals', {
    id: makeId('ref'),
    resellerId: reseller.id,
    referralCode: reseller.referralCode,
    clickedIp: input.clickedIp,
    userAgent: input.userAgent,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isActive: true,
  } as any);
}

export async function getCommissions(resellerId?: string): Promise<Commission[]> {
  const rows = await getRows<Commission>('commissions', true);
  const commissions = rowsToEntities<Commission>(rows);
  return resellerId ? commissions.filter((item) => item.resellerId === resellerId) : commissions;
}

export async function getCommissionByOrderId(orderId: string): Promise<Commission | undefined> {
  const commissions = await getCommissions();
  return commissions.find((item) => item.orderId === orderId);
}

export async function saveCommission(commission: Commission): Promise<Commission> {
  return upsertRow('commissions', {
    ...commission,
    amount: normalizeAmount(commission.amount),
    status: commission.status || 'pending',
    isActive: true,
  } as any);
}

export async function calculateOrderCommission(order: Order): Promise<number> {
  let total = 0;
  for (const item of order.items || []) {
    const snapshot = item.product as any;
    const product = snapshot || (await getProductById(item.productId));
    const type = product?.resellerCommissionType || 'percentage';
    const value = normalizeAmount(product?.commissionValue ?? 10);
    const base = normalizeAmount(item.price || product?.price) * normalizeAmount(item.quantity || 1);
    total += type === 'fixed' ? value * normalizeAmount(item.quantity || 1) : (base * value) / 100;
  }
  return Math.round(total * 100) / 100;
}

export async function createPendingCommissionForOrder(order: Order): Promise<Commission | null> {
  if (!order.resellerId) return null;
  const reseller = await getResellerById(order.resellerId);
  if (!reseller || reseller.status !== 'active') return null;
  const existing = await getCommissionByOrderId(order.id);
  if (existing) return existing;

  const amount = await calculateOrderCommission(order);
  if (amount <= 0) return null;

  const commission = await saveCommission({
    id: makeId('commission'),
    resellerId: reseller.id,
    orderId: order.id,
    amount,
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  await saveReseller({
    ...reseller,
    pendingBalance: normalizeAmount(reseller.pendingBalance) + amount,
    updatedAt: nowIso(),
  });

  return commission;
}

export async function settleCommissionForOrder(orderId: string, nextStatus: CommissionStatus): Promise<Commission | null> {
  const commission = await getCommissionByOrderId(orderId);
  if (!commission) return null;
  if (commission.status === nextStatus || commission.status === 'paid') return commission;

  const reseller = await getResellerById(commission.resellerId);
  if (!reseller) return null;

  const amount = normalizeAmount(commission.amount);
  let availableBalance = normalizeAmount(reseller.availableBalance);
  let pendingBalance = normalizeAmount(reseller.pendingBalance);
  let totalEarnings = normalizeAmount(reseller.totalEarnings);

  if (commission.status === 'pending') {
    pendingBalance = Math.max(0, pendingBalance - amount);
  }

  if (commission.status === 'approved' && nextStatus !== 'approved' && nextStatus !== 'paid') {
    availableBalance = Math.max(0, availableBalance - amount);
    totalEarnings = Math.max(0, totalEarnings - amount);
  }

  if (nextStatus === 'approved') {
    availableBalance += amount;
    totalEarnings += amount;
  }

  await saveReseller({
    ...reseller,
    availableBalance,
    pendingBalance,
    totalEarnings,
    updatedAt: nowIso(),
  });

  return saveCommission({
    ...commission,
    status: nextStatus,
    updatedAt: nowIso(),
  });
}

export async function getPayouts(resellerId?: string): Promise<Payout[]> {
  const rows = await getRows<Payout>('payouts', true);
  const payouts = rowsToEntities<Payout>(rows);
  return resellerId ? payouts.filter((item) => item.resellerId === resellerId) : payouts;
}

export async function requestPayout(input: {
  resellerId: string;
  amount: number;
  method: PayoutMethod;
  number: string;
}): Promise<Payout> {
  const reseller = await getResellerById(input.resellerId);
  if (!reseller) throw new Error('Reseller not found');
  const amount = normalizeAmount(input.amount);
  if (amount <= 0) throw new Error('Payout amount must be greater than 0');
  if (amount > normalizeAmount(reseller.availableBalance)) throw new Error('Insufficient available balance');

  await saveReseller({
    ...reseller,
    availableBalance: Math.max(0, normalizeAmount(reseller.availableBalance) - amount),
    updatedAt: nowIso(),
  });

  return upsertRow('payouts', {
    id: makeId('payout'),
    resellerId: input.resellerId,
    amount,
    method: input.method,
    number: input.number,
    status: 'requested',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isActive: true,
  } as any);
}

export async function updatePayoutStatus(id: string, status: Payout['status'], note?: string): Promise<Payout | null> {
  const row = await getRowById<Payout>('payouts', id);
  if (!row) return null;
  const payout = { ...(row.data as any), id: row.id } as Payout;
  const reseller = await getResellerById(payout.resellerId);

  if (reseller && status === 'rejected' && payout.status !== 'rejected' && payout.status !== 'paid') {
    await saveReseller({
      ...reseller,
      availableBalance: normalizeAmount(reseller.availableBalance) + normalizeAmount(payout.amount),
      updatedAt: nowIso(),
    });
  }

  return upsertRow('payouts', {
    ...payout,
    status,
    note,
    updatedAt: nowIso(),
    isActive: true,
  } as any);
}

export async function getResellerDashboardData(resellerId: string) {
  const [reseller, commissions, payouts, referrals, orders] = await Promise.all([
    getResellerById(resellerId),
    getCommissions(resellerId),
    getPayouts(resellerId),
    getReferrals(resellerId),
    getOrders(),
  ]);
  if (!reseller) return null;

  const resellerOrders = orders.filter((order) => order.resellerId === reseller.id);
  return {
    reseller,
    commissions,
    payouts,
    referrals,
    orders: resellerOrders,
    stats: {
      totalOrders: resellerOrders.length,
      pendingCommissions: commissions.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
      approvedCommissions: commissions.filter((item) => item.status === 'approved' || item.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
      clicks: referrals.length,
    },
  };
}

export async function getCategories(includeInactive = false): Promise<Category[]> {
  const rows = await getRows<Category>('categories', includeInactive);
  return rowsToEntities<Category>(rows);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const row = await getRowById<Category>('categories', id);
  return row ? ({ ...(row.data as any), id: row.id } as Category) : undefined;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const rows = await getRows<Category>('categories');
  const categories = rowsToEntities<Category>(rows);
  return categories.find((c) => c.slug === slug && c.isActive !== false);
}

export async function saveCategory(category: Category): Promise<Category> {
  return upsertRow('categories', {
    ...category,
    id: category.id || makeId('cat'),
    isActive: category.isActive !== false,
  } as any);
}

export async function deleteCategory(id: string): Promise<Category | null> {
  return softDeleteById<Category>('categories', id);
}

export async function getColors(): Promise<Color[]> {
  const now = Date.now();
  if (colorsCache && now - colorsCache.timestamp < CACHE_TTL) return colorsCache.data;
  const rows = await getRows<Color>('colors');
  const data = rowsToEntities<Color>(rows);
  colorsCache = { data, timestamp: now };
  return data;
}

export function invalidateColorsCache(): void {
  colorsCache = null;
}

export async function getColorById(id: string): Promise<Color | undefined> {
  const row = await getRowById<Color>('colors', id);
  return row ? ({ ...(row.data as any), id: row.id } as Color) : undefined;
}

export async function saveColor(color: Color): Promise<Color> {
  const saved = await upsertRow('colors', {
    ...color,
    id: color.id || makeId('color'),
    isActive: color.isActive !== false,
  } as any);
  invalidateColorsCache();
  return saved;
}

export async function deleteColor(id: string): Promise<Color | null> {
  const deleted = await softDeleteById<Color>('colors', id);
  if (deleted) invalidateColorsCache();
  return deleted;
}

export async function getUsers(): Promise<User[]> {
  const rows = await getRows<User>('users', true);
  return rowsToEntities<User>(rows);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await getRowById<User>('users', id);
  return row ? ({ ...(row.data as any), id: row.id } as User) : undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await ensureDatabaseReady();
  const rows = await sql.query(
    `SELECT id, data, is_active FROM users WHERE LOWER(data->>'email') = LOWER($1) LIMIT 1`,
    [email]
  );
  const row = rows[0] as StoredRow<User> | undefined;
  return row ? ({ ...(normalizeImageFields(row.data) as any), id: row.id } as User) : undefined;
}

export async function saveUser(user: Partial<User> & { email: string }): Promise<User> {
  const existing = user.id ? await getUserById(user.id) : await getUserByEmail(user.email);
  const merged: User = withTimestamps({
    id: existing?.id || user.id || makeId('user'),
    firstName: user.firstName || existing?.firstName || '',
    lastName: user.lastName || existing?.lastName || '',
    email: user.email || existing?.email || '',
    role: user.role || existing?.role || 'client',
    avatar: user.avatar ?? existing?.avatar,
    phone: user.phone ?? existing?.phone,
    address: user.address ?? existing?.address,
    isEmailVerified: user.isEmailVerified ?? existing?.isEmailVerified ?? false,
    createdAt: existing?.createdAt || nowIso(),
    updatedAt: nowIso(),
  });

  const extraFields: Record<string, unknown> = {};
  if ((user as any).password) extraFields.password = (user as any).password;
  if ((existing as any)?.password) extraFields.password = (existing as any).password;

  return upsertRow('users', { ...(merged as any), ...extraFields, isActive: true });
}

export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const rows = await getRows<FeaturedProduct>('featured_products');
  return rowsToEntities<FeaturedProduct>(rows);
}

export async function getFeaturedProductById(id: string): Promise<FeaturedProduct | undefined> {
  const row = await getRowById<FeaturedProduct>('featured_products', id);
  return row ? ({ ...(row.data as any), id: row.id } as FeaturedProduct) : undefined;
}

export async function getFeaturedProductByProductId(productId: string): Promise<FeaturedProduct | undefined> {
  const rows = await getFeaturedProducts();
  return rows.find((item) => item.productId === productId && item.isActive !== false);
}

export async function addFeaturedProduct(productId: string): Promise<FeaturedProduct> {
  const existing = await getFeaturedProductByProductId(productId);
  if (existing) return existing;
  const product = await getProductById(productId);
  if (!product) throw new Error(`Product with ID ${productId} not found`);
  const featured: FeaturedProduct = withTimestamps({
    ...(product as any),
    id: makeId('featured'),
    productId: product.id,
    featuredAt: nowIso(),
    isActive: true,
  });
  return upsertRow('featured_products', featured as any);
}

export async function removeFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  const item = await getFeaturedProductByProductId(productId);
  if (!item) return null;
  return softDeleteById<FeaturedProduct>('featured_products', item.id);
}

export async function removeFeaturedProductById(id: string): Promise<FeaturedProduct | null> {
  return softDeleteById<FeaturedProduct>('featured_products', id);
}

export async function updateFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  const featured = await getFeaturedProductByProductId(productId);
  const product = await getProductById(productId);
  if (!featured || !product) return null;
  const updated: FeaturedProduct = {
    ...(product as any),
    id: featured.id,
    productId: product.id,
    featuredAt: featured.featuredAt,
    isActive: true,
    createdAt: featured.createdAt,
    updatedAt: nowIso(),
  };
  return upsertRow('featured_products', updated as any);
}

export async function getBestSellingProducts(): Promise<BestSellingProduct[]> {
  const rows = await getRows<BestSellingProduct>('best_selling_products');
  return rowsToEntities<BestSellingProduct>(rows);
}

export async function getBestSellingProductById(id: string): Promise<BestSellingProduct | undefined> {
  const row = await getRowById<BestSellingProduct>('best_selling_products', id);
  return row ? ({ ...(row.data as any), id: row.id } as BestSellingProduct) : undefined;
}

export async function getBestSellingProductByProductId(productId: string): Promise<BestSellingProduct | undefined> {
  const rows = await getBestSellingProducts();
  return rows.find((item) => item.productId === productId && item.isActive !== false);
}

export async function addBestSellingProduct(productId: string): Promise<BestSellingProduct> {
  const existing = await getBestSellingProductByProductId(productId);
  if (existing) return existing;
  const product = await getProductById(productId);
  if (!product) throw new Error(`Product with ID ${productId} not found`);
  const bestSelling: BestSellingProduct = withTimestamps({
    ...(product as any),
    id: makeId('bestselling'),
    productId: product.id,
    bestSellingAt: nowIso(),
    isActive: true,
  });
  return upsertRow('best_selling_products', bestSelling as any);
}

export async function removeBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  const item = await getBestSellingProductByProductId(productId);
  if (!item) return null;
  return softDeleteById<BestSellingProduct>('best_selling_products', item.id);
}

export async function removeBestSellingProductById(id: string): Promise<BestSellingProduct | null> {
  return softDeleteById<BestSellingProduct>('best_selling_products', id);
}

export async function updateBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  const existing = await getBestSellingProductByProductId(productId);
  const product = await getProductById(productId);
  if (!existing || !product) return null;
  const updated: BestSellingProduct = {
    ...(product as any),
    id: existing.id,
    productId: product.id,
    bestSellingAt: existing.bestSellingAt,
    isActive: true,
    createdAt: existing.createdAt,
    updatedAt: nowIso(),
  };
  return upsertRow('best_selling_products', updated as any);
}

export async function getHeroBanner(): Promise<HeroBanner | null> {
  const rows = await getRows<HeroBanner>('hero_banners');
  return rows.length ? ({ ...(rows[0].data as any), id: rows[0].id } as HeroBanner) : null;
}

export async function getHeroBannerById(id: string): Promise<HeroBanner | undefined> {
  const row = await getRowById<HeroBanner>('hero_banners', id);
  return row ? ({ ...(row.data as any), id: row.id } as HeroBanner) : undefined;
}

export async function saveHeroBanner(heroBanner: HeroBanner): Promise<HeroBanner> {
  const normalized: HeroBanner = withTimestamps({
    ...heroBanner,
    id: heroBanner.id || makeId('hero'),
    isActive: heroBanner.isActive !== false,
  });
  if (normalized.isActive) {
    await sql.query(`UPDATE hero_banners SET is_active = false, updated_at = NOW() WHERE id <> $1`, [normalized.id]);
  }
  return upsertRow('hero_banners', normalized as any);
}

export async function deleteHeroBanner(id: string): Promise<HeroBanner | null> {
  return softDeleteById<HeroBanner>('hero_banners', id);
}

export async function getAllHeroBanners(): Promise<HeroBanner[]> {
  const rows = await getRows<HeroBanner>('hero_banners', true);
  return rowsToEntities<HeroBanner>(rows);
}

const defaultPromoCountdown = (): PromoBanner['initialTime'] => ({ days: 0, hours: 0, minutes: 0, seconds: 0 });

type PromoBannerQueryOptions = {
  includeInactive?: boolean;
  variant?: PromoBannerVariant;
  limit?: number;
};

const sortPromoBanners = (a: PromoBanner, b: PromoBanner) =>
  (a.order ?? 0) - (b.order ?? 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export async function getPromoBanners(options: PromoBannerQueryOptions = {}): Promise<PromoBanner[]> {
  const { includeInactive = false, variant, limit } = options;
  const rows = await getRows<PromoBanner>('promo_banners', includeInactive);
  let items = rowsToEntities<PromoBanner>(rows);
  if (variant) items = items.filter((item) => item.variant === variant);
  const sorted = items.sort(sortPromoBanners);
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getPromoBannerById(id: string): Promise<PromoBanner | undefined> {
  const row = await getRowById<PromoBanner>('promo_banners', id);
  return row ? ({ ...(row.data as any), id: row.id } as PromoBanner) : undefined;
}

export async function savePromoBanner(promoBanner: PromoBanner): Promise<PromoBanner> {
  const count = (await getRows<PromoBanner>('promo_banners', true)).length;
  const normalized: PromoBanner = withTimestamps({
    ...promoBanner,
    id: promoBanner.id || makeId('promo'),
    variant: promoBanner.variant || 'slider',
    initialTime: promoBanner.initialTime || defaultPromoCountdown(),
    order: typeof promoBanner.order === 'number' ? promoBanner.order : count,
    isActive: promoBanner.isActive !== false,
  });
  return upsertRow('promo_banners', normalized as any);
}

export async function deletePromoBanner(id: string): Promise<PromoBanner | null> {
  return softDeleteById<PromoBanner>('promo_banners', id);
}

type FestivalBannerQueryOptions = {
  includeInactive?: boolean;
  limit?: number;
};

const sortFestivalBanners = (a: FestivalBanner, b: FestivalBanner) =>
  (a.order ?? 0) - (b.order ?? 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const normalizeCoupons = (coupons?: FestivalBanner['coupons']): FestivalBanner['coupons'] => {
  if (!Array.isArray(coupons)) return [];
  return coupons
    .map((coupon) => ({
      code: String(coupon?.code || '').trim(),
      amount: String(coupon?.amount || '').trim(),
    }))
    .filter((coupon) => coupon.code && coupon.amount);
};

export async function getFestivalBanners(options: FestivalBannerQueryOptions = {}): Promise<FestivalBanner[]> {
  const { includeInactive = false, limit } = options;
  const rows = await getRows<FestivalBanner>('festival_banners', includeInactive);
  const sorted = rowsToEntities<FestivalBanner>(rows).sort(sortFestivalBanners);
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getFestivalBannerById(id: string): Promise<FestivalBanner | undefined> {
  const row = await getRowById<FestivalBanner>('festival_banners', id);
  return row ? ({ ...(row.data as any), id: row.id } as FestivalBanner) : undefined;
}

export async function saveFestivalBanner(banner: FestivalBanner): Promise<FestivalBanner> {
  const count = (await getRows<FestivalBanner>('festival_banners', true)).length;
  const normalized: FestivalBanner = withTimestamps({
    ...banner,
    id: banner.id || makeId('festival'),
    coupons: normalizeCoupons(banner.coupons),
    order: typeof banner.order === 'number' ? banner.order : count,
    isActive: banner.isActive !== false,
  });
  return upsertRow('festival_banners', normalized as any);
}

export async function deleteFestivalBanner(id: string): Promise<FestivalBanner | null> {
  return softDeleteById<FestivalBanner>('festival_banners', id);
}

const clampRating = (value: number) => {
  if (Number.isNaN(value)) return 5;
  if (value < 1) return 1;
  if (value > 5) return 5;
  return Number(value);
};

const normalizeReview = (
  review: Partial<ProductReview> & { productId: string },
  fallbackProductName?: string
): ProductReview => {
  const now = nowIso();
  return {
    id: review.id || makeId('rev'),
    productId: String(review.productId),
    productName: review.productName || fallbackProductName,
    author: (review.author || 'Anonymous').trim() || 'Anonymous',
    rating: clampRating(review.rating ?? 5),
    comment: (review.comment || '').trim(),
    date: review.date || now,
    verified: Boolean(review.verified),
    source: review.source || ('admin' as ReviewSource),
    createdAt: review.createdAt || now,
    updatedAt: now,
  };
};

export async function getReviews(productId?: string, productName?: string): Promise<ProductReview[]> {
  const rows = await getRows<ProductReview>('product_reviews', true);
  let reviews = rowsToEntities<ProductReview>(rows);
  if (productId && productName) {
    reviews = reviews.filter((review) => review.productId === productId || review.productName === productName);
  } else if (productId) {
    reviews = reviews.filter((review) => review.productId === productId);
  }
  return reviews;
}

export async function getReviewById(id: string): Promise<ProductReview | undefined> {
  const row = await getRowById<ProductReview>('product_reviews', id);
  return row ? ({ ...(row.data as any), id: row.id } as ProductReview) : undefined;
}

export async function getReviewsByProduct(productId: string, productName?: string): Promise<ProductReview[]> {
  return getReviews(productId, productName);
}

export async function saveReview(review: Partial<ProductReview> & { productId: string }): Promise<ProductReview> {
  const product = await getProductById(review.productId);
  const normalized = normalizeReview(review, product?.name);
  return upsertRow('product_reviews', { ...(normalized as any), isActive: true });
}

export async function deleteReview(id: string): Promise<ProductReview | null> {
  return hardDeleteById<ProductReview>('product_reviews', id);
}

export async function getSiteThemeSettings(): Promise<SiteThemeSettings> {
  await ensureDatabaseReady();
  const rows = await sql.query(`SELECT data, updated_at FROM site_settings WHERE key = 'theme' LIMIT 1`);
  const row = rows[0] as { data?: { id?: string }; updated_at?: string } | undefined;
  const preset = getThemePresetById(row?.data?.id);
  return {
    id: preset.id,
    updatedAt: row?.updated_at || nowIso(),
  };
}

export async function saveSiteThemeSettings(id: SiteThemeId): Promise<SiteThemeSettings> {
  const preset = getThemePresetById(id);
  await ensureDatabaseReady();
  await sql.query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ('theme', $1::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET
       data = EXCLUDED.data,
       updated_at = NOW()`,
    [JSON.stringify({ id: preset.id })]
  );

  return {
    id: preset.id,
    updatedAt: nowIso(),
  };
}

export async function getMonthlyTargetSettings(): Promise<MonthlyTargetSettings> {
  await ensureDatabaseReady();
  const rows = await sql.query(`SELECT data, updated_at FROM site_settings WHERE key = 'monthly_target' LIMIT 1`);
  const row = rows[0] as { data?: { amount?: number | string }; updated_at?: string } | undefined;
  const parsed = Number(row?.data?.amount ?? 0);

  return {
    amount: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    updatedAt: row?.updated_at || nowIso(),
  };
}

export async function saveMonthlyTargetSettings(amount: number): Promise<MonthlyTargetSettings> {
  await ensureDatabaseReady();
  const normalized = Math.max(0, Math.round(amount));

  await sql.query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ('monthly_target', $1::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET
       data = EXCLUDED.data,
       updated_at = NOW()`,
    [JSON.stringify({ amount: normalized })]
  );

  return {
    amount: normalized,
    updatedAt: nowIso(),
  };
}

export async function resetMonthlyTargetSettings(): Promise<MonthlyTargetSettings> {
  await ensureDatabaseReady();
  await sql.query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ('monthly_target', $1::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET
       data = EXCLUDED.data,
       updated_at = NOW()`,
    [JSON.stringify({ amount: 0 })]
  );
  return {
    amount: 0,
    updatedAt: nowIso(),
  };
}
