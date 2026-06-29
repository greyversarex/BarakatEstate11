import {
  pgTable,
  text,
  integer,
  boolean,
  real,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publishStatusEnum = pgEnum("publish_status", ["draft", "published"]);
export const dealTypeEnum = pgEnum("deal_type", ["sale", "rent"]);
export const userRoleEnum = pgEnum("user_role", ["user", "seller", "admin"]);
export const applicationStatusEnum = pgEnum("application_status", ["new", "read", "completed"]);
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);

export const adminUsersTable = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  telegram: text("telegram").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  facebook: text("facebook").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  bio: text("bio").notNull().default(""),
  rating: real("rating").notNull().default(0),
  dealsCount: integer("deals_count").notNull().default(0),
  experienceYears: integer("experience_years").notNull().default(0),
  specializations: text("specializations").notNull().default(""),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listingsTable = pgTable("listings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().default(""),
  dealType: dealTypeEnum("deal_type").notNull().default("sale"),
  propertyType: text("property_type").notNull().default("Квартира"),
  price: real("price").notNull().default(0),
  currency: text("currency").notNull().default("TJS"),
  district: text("district").notNull().default("Душанбе"),
  address: text("address").notNull().default(""),
  rooms: integer("rooms").notNull().default(1),
  area: real("area").notNull().default(0),
  floor: integer("floor").notNull().default(1),
  totalFloors: integer("total_floors").notNull().default(1),
  yearBuilt: integer("year_built").notNull().default(2024),
  description: text("description").notNull().default(""),
  features: text("features").notNull().default(""),
  constructionStage: text("construction_stage").notNull().default(""),
  renovation: text("renovation").notNull().default(""),
  documentType: text("document_type").notNull().default(""),
  landmark: text("landmark").notNull().default(""),
  latitude: real("latitude").notNull().default(38.5598),
  longitude: real("longitude").notNull().default(68.787),
  mapX: real("map_x").notNull().default(0),
  mapY: real("map_y").notNull().default(0),
  mainImage: text("main_image").notNull().default(""),
  gallery: text("gallery").notNull().default(""),
  employeeId: text("employee_id").notNull().default(""),
  sellerId: text("seller_id").notNull().default(""),
  sellerName: text("seller_name").notNull().default(""),
  sellerPhone: text("seller_phone").notNull().default(""),
  sellerWhatsapp: text("seller_whatsapp").notNull().default(""),
  sellerAvatar: text("seller_avatar").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isUrgent: boolean("is_urgent").notNull().default(false),
  isHero: boolean("is_hero").notNull().default(false),
  status: publishStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const applicationsTable = pgTable("applications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull().default(""),
  message: text("message").notNull().default(""),
  photos: text("photos").notNull().default(""),
  status: applicationStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const viewingsTable = pgTable("viewings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id").notNull().default(""),
  listingTitle: text("listing_title").notNull().default(""),
  employeeId: text("employee_id").notNull().default(""),
  sellerId: text("seller_id").notNull().default(""),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull().default(""),
  time: text("time").notNull().default(""),
  message: text("message").notNull().default(""),
  status: applicationStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  text: text("text").notNull(),
  sellerId: text("seller_id"),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertViewingSchema = createInsertSchema(viewingsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type Listing = typeof listingsTable.$inferSelect;
export type Application = typeof applicationsTable.$inferSelect;
export type Review = typeof reviewsTable.$inferSelect;
export type AdminUser = typeof adminUsersTable.$inferSelect;
export type Viewing = typeof viewingsTable.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertViewing = z.infer<typeof insertViewingSchema>;
