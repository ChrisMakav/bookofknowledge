-- ─────────────────────────────────────────────────────────────────────────────
-- Book of Knowledge — Supabase Schema
-- Run in the Supabase SQL editor (top-to-bottom, once)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE book_format  AS ENUM ('hardcover', 'paperback', 'ebook');
CREATE TYPE order_status AS ENUM ('pending','paid','processing','shipped','delivered','cancelled','refunded');
CREATE TYPE genre_key    AS ENUM ('scifi','romance','thriller','fantasy','lifestyle','tech');

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── Authors ─────────────────────────────────────────────────────────────────
CREATE TABLE authors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors public read"  ON authors FOR SELECT USING (TRUE);

-- ─── Categories ──────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  genre       genre_key
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (TRUE);

-- ─── Books ───────────────────────────────────────────────────────────────────
CREATE TABLE books (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                       TEXT NOT NULL,
  slug                        TEXT UNIQUE NOT NULL,
  author_id                   UUID REFERENCES authors(id) ON DELETE SET NULL,
  cover_url                   TEXT NOT NULL DEFAULT '',
  description                 TEXT,
  synopsis                    TEXT,
  isbn                        TEXT UNIQUE,
  published_at                DATE,
  page_count                  INTEGER,
  price_hardcover             NUMERIC(10,2),
  price_paperback             NUMERIC(10,2),
  price_ebook                 NUMERIC(10,2),
  stripe_product_id           TEXT,
  stripe_price_id_hardcover   TEXT,
  stripe_price_id_paperback   TEXT,
  stripe_price_id_ebook       TEXT,
  rating_avg                  NUMERIC(3,2) DEFAULT 0,
  review_count                INTEGER      DEFAULT 0,
  is_featured                 BOOLEAN      DEFAULT FALSE,
  is_new_release              BOOLEAN      DEFAULT FALSE,
  is_bestseller               BOOLEAN      DEFAULT FALSE,
  is_staff_pick               BOOLEAN      DEFAULT FALSE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books public read" ON books FOR SELECT USING (TRUE);

-- ─── Book ↔ Category ─────────────────────────────────────────────────────────
CREATE TABLE book_categories (
  book_id     UUID REFERENCES books(id)      ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "BookCategories public read" ON book_categories FOR SELECT USING (TRUE);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  vibe_tags   TEXT[]   NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, user_id)
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews public read"    ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviews auth insert"    ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews owner update"   ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reviews owner delete"   ON reviews FOR DELETE USING (auth.uid() = user_id);

-- ─── Favorites ───────────────────────────────────────────────────────────────
CREATE TABLE favorites (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id    UUID REFERENCES books(id)      ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, book_id)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Favorites owner only"
  ON favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── Orders ──────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                    order_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id  TEXT UNIQUE,
  subtotal                  NUMERIC(10,2) NOT NULL,
  tax                       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                     NUMERIC(10,2) NOT NULL,
  shipping_address          JSONB,
  billing_address           JSONB,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders owner read"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- ─── Order Items ─────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id      UUID NOT NULL REFERENCES books(id),
  format       book_format NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price   NUMERIC(10,2) NOT NULL,
  stripe_price_id TEXT,
  download_url TEXT
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "OrderItems owner read"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- ─── Trigger: auto-create profile on sign-up ─────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Trigger: update rating_avg + review_count on reviews ────────────────────
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_book_id UUID;
BEGIN
  v_book_id := COALESCE(NEW.book_id, OLD.book_id);
  UPDATE books SET
    rating_avg   = (SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0) FROM reviews WHERE book_id = v_book_id),
    review_count = (SELECT COUNT(*)                                 FROM reviews WHERE book_id = v_book_id)
  WHERE id = v_book_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_book_rating();
