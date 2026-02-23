import { pgTable, text, timestamp, uuid, varchar, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// OTP Table for phone verification
export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tournaments Table
export const tournaments = pgTable("tournaments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxPlayers: integer("max_players"),
  isActive: boolean("is_active").default(true),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tournament Admins Table
export const tournamentAdmins = pgTable("tournament_admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(), // 'creator' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tournament Players Table
export const tournamentPlayers = pgTable("tournament_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Nullable for manual/guest players
  // Manual player fields (used when userId is null)
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  category: varchar("category", { length: 100 }), // e.g., "Premium Bowler", "Batsman", "Beginner"
  customFields: jsonb("custom_fields"), // For additional player data
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Teams Table
export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team Members Table
export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  playerId: uuid("player_id").references(() => tournamentPlayers.id, { onDelete: "cascade" }).notNull(),
  role: varchar("role", { length: 50 }), // e.g., "Captain", "Vice-Captain", "Player"
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Announcements Table
export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("announcement").notNull(), // 'announcement' | 'match_info' | 'image' | 'jersey'
  imageUrl: text("image_url"),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Player Categories Table (for advanced random distribution)
export const playerCategories = pgTable("player_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  minPerTeam: integer("min_per_team").default(0),
  maxPerTeam: integer("max_per_team"),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions Table
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tournaments: many(tournaments),
  tournamentAdmins: many(tournamentAdmins),
  tournamentPlayers: many(tournamentPlayers),
  announcements: many(announcements),
  sessions: many(sessions),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  creator: one(users, {
    fields: [tournaments.creatorId],
    references: [users.id],
  }),
  admins: many(tournamentAdmins),
  players: many(tournamentPlayers),
  teams: many(teams),
  announcements: many(announcements),
  categories: many(playerCategories),
}));

export const tournamentAdminsRelations = relations(tournamentAdmins, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [tournamentAdmins.tournamentId],
    references: [tournaments.id],
  }),
  user: one(users, {
    fields: [tournamentAdmins.userId],
    references: [users.id],
  }),
}));

export const tournamentPlayersRelations = relations(tournamentPlayers, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [tournamentPlayers.tournamentId],
    references: [tournaments.id],
  }),
  user: one(users, {
    fields: [tournamentPlayers.userId],
    references: [users.id],
  }),
  teamMemberships: many(teamMembers),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  player: one(tournamentPlayers, {
    fields: [teamMembers.playerId],
    references: [tournamentPlayers.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [announcements.tournamentId],
    references: [tournaments.id],
  }),
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

export const playerCategoriesRelations = relations(playerCategories, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [playerCategories.tournamentId],
    references: [tournaments.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type TournamentPlayer = typeof tournamentPlayers.$inferSelect;
export type PlayerCategory = typeof playerCategories.$inferSelect;
