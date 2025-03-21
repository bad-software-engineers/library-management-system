import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const verifyPending = pgTable("verifyPending", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const users = pgTable("users", {
  clerkId: varchar({ length: 255 }).primaryKey(),
  primaryEmail: varchar({ length: 255 }).notNull(),
  universityId: varchar({ length: 30 }).notNull().unique(),
});

export const admin = pgTable("admin", {
  clerkId: varchar({ length: 255 }).primaryKey().notNull(),
  primaryEmail: varchar({ length: 255 }).notNull(),
});

export const systemMetadata = pgTable("systemMetadata", {
  maxBooks: integer().notNull().default(4),
  maxDays: integer().notNull().default(15),
});
