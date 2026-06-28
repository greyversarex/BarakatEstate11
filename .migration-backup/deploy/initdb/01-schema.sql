--
-- PostgreSQL database dump
--


-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'new',
    'read',
    'completed'
);


--
-- Name: deal_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.deal_type AS ENUM (
    'sale',
    'rent'
);


--
-- Name: publish_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publish_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: review_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.review_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'seller',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    whatsapp text DEFAULT ''::text NOT NULL,
    telegram text DEFAULT ''::text NOT NULL,
    instagram text DEFAULT ''::text NOT NULL,
    facebook text DEFAULT ''::text NOT NULL,
    avatar text DEFAULT ''::text NOT NULL,
    bio text DEFAULT ''::text NOT NULL,
    rating real DEFAULT 0 NOT NULL,
    deals_count integer DEFAULT 0 NOT NULL,
    experience_years integer DEFAULT 0 NOT NULL,
    specializations text DEFAULT ''::text NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    service text DEFAULT ''::text NOT NULL,
    message text DEFAULT ''::text NOT NULL,
    status public.application_status DEFAULT 'new'::public.application_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id text NOT NULL,
    title text NOT NULL,
    slug text DEFAULT ''::text NOT NULL,
    deal_type public.deal_type DEFAULT 'sale'::public.deal_type NOT NULL,
    property_type text DEFAULT 'Квартира'::text NOT NULL,
    price real DEFAULT 0 NOT NULL,
    currency text DEFAULT 'TJS'::text NOT NULL,
    district text DEFAULT 'Душанбе'::text NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    rooms integer DEFAULT 1 NOT NULL,
    area real DEFAULT 0 NOT NULL,
    floor integer DEFAULT 1 NOT NULL,
    total_floors integer DEFAULT 1 NOT NULL,
    year_built integer DEFAULT 2024 NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    features text DEFAULT ''::text NOT NULL,
    construction_stage text DEFAULT ''::text NOT NULL,
    renovation text DEFAULT ''::text NOT NULL,
    document_type text DEFAULT ''::text NOT NULL,
    landmark text DEFAULT ''::text NOT NULL,
    latitude real DEFAULT 38.5598 NOT NULL,
    longitude real DEFAULT 68.787 NOT NULL,
    map_x real DEFAULT 0 NOT NULL,
    map_y real DEFAULT 0 NOT NULL,
    main_image text DEFAULT ''::text NOT NULL,
    gallery text DEFAULT ''::text NOT NULL,
    employee_id text DEFAULT ''::text NOT NULL,
    seller_id text DEFAULT ''::text NOT NULL,
    seller_name text DEFAULT ''::text NOT NULL,
    seller_phone text DEFAULT ''::text NOT NULL,
    seller_whatsapp text DEFAULT ''::text NOT NULL,
    seller_avatar text DEFAULT ''::text NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    status public.publish_status DEFAULT 'draft'::public.publish_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    name text NOT NULL,
    text text NOT NULL,
    seller_id text,
    status public.review_status DEFAULT 'pending'::public.review_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    key text NOT NULL,
    value text DEFAULT ''::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_unique UNIQUE (username);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- PostgreSQL database dump complete
--


