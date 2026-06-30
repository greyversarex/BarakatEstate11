-- Idempotent schema sync for production (Timeweb self-hosted Postgres).
-- Safe to run multiple times. Adds any missing enums / tables / columns so the
-- production DB matches lib/db/src/schema/admin.ts.
--
-- Run on the server (see .agents/memory/timeweb-deploy.md):
--   docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < lib/db/migrations/sync-prod-schema.sql
-- or pipe this file's contents via a heredoc.

BEGIN;

-- ---------- ENUMS ----------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publish_status') THEN
    CREATE TYPE publish_status AS ENUM ('draft', 'published');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_type') THEN
    CREATE TYPE deal_type AS ENUM ('sale', 'rent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('new', 'read', 'completed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- ---------- TABLES (create if missing) ----------
CREATE TABLE IF NOT EXISTS admin_users (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS listings (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS applications (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS viewings (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS reviews (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS blog_posts (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS site_settings (key text PRIMARY KEY);

-- ---------- admin_users ----------
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS whatsapp text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS telegram text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS instagram text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS facebook text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS rating real NOT NULL DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS deals_count integer NOT NULL DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS experience_years integer NOT NULL DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS specializations text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_username_unique') THEN
    ALTER TABLE admin_users ADD CONSTRAINT admin_users_username_unique UNIQUE (username);
  END IF;
END $$;

-- ---------- listings ----------
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS deal_type deal_type NOT NULL DEFAULT 'sale';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_type text NOT NULL DEFAULT 'Квартира';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price real NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'TJS';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS district text NOT NULL DEFAULT 'Душанбе';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rooms integer NOT NULL DEFAULT 1;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS area real NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS floor integer NOT NULL DEFAULT 1;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS total_floors integer NOT NULL DEFAULT 1;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS year_built integer NOT NULL DEFAULT 2024;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS features text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS construction_stage text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS renovation text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS document_type text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS landmark text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude real NOT NULL DEFAULT 38.5598;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude real NOT NULL DEFAULT 68.787;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS map_x real NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS map_y real NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS main_image text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS gallery text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS employee_id text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_id text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_name text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_phone text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_whatsapp text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_avatar text NOT NULL DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_new boolean NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_urgent boolean NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_hero boolean NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status publish_status NOT NULL DEFAULT 'draft';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE listings ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

-- ---------- applications ----------
ALTER TABLE applications ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS district text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS landmark text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS photos text NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status application_status NOT NULL DEFAULT 'new';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

-- ---------- viewings ----------
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS listing_id text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS listing_title text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS employee_id text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS seller_id text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS date text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS time text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS status application_status NOT NULL DEFAULT 'new';
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE viewings ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

-- ---------- reviews ----------
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS text text NOT NULL DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS seller_id text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status review_status NOT NULL DEFAULT 'pending';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

-- ---------- blog_posts ----------
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content text NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status publish_status NOT NULL DEFAULT 'draft';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

-- ---------- site_settings ----------
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS value text NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();

COMMIT;
