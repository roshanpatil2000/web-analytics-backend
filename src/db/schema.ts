import { boolean, pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);


export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().unique().notNull(),
    email: varchar().unique().notNull(),
    password: varchar().notNull(),
    name: varchar().notNull(),
    role: roleEnum().default("user").notNull(),
    lastLogin: timestamp().defaultNow(),
    isVerified: boolean().default(false).notNull(),
    hasPremium: boolean().default(false).notNull(),
    authToken: varchar(),
    resetPasswordToken: varchar(),
    resetPasswordExpiresAt: timestamp(),
    verificationToken: varchar(),
    verificationExpiresAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});
