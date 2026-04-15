import { pgTable, text, timestamp, uuid, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core'

// ─── Users ────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  username:  text('username').notNull().unique(),
  password:  text('password').notNull(),
  name:      text('name'),
  image:     text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Watch Progress ───────────────────────────────────────────────────────
export const watchProgress = pgTable('watch_progress', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  arcSlug:     text('arc_slug').notNull(),
  episodeSlug: text('episode_slug').notNull(),
  watchedAt:   timestamp('watched_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserEpisode: uniqueIndex('unique_user_episode').on(table.userId, table.episodeSlug),
}))

// ─── Quiz Scores ──────────────────────────────────────────────────────────
export const quizScores = pgTable('quiz_scores', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  arcSlug:     text('arc_slug').notNull(),
  score:       integer('score').notNull(),
  totalQ:      integer('total_questions').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserArc: uniqueIndex('unique_user_arc_quiz').on(table.userId, table.arcSlug),
}))

// ─── Comments ─────────────────────────────────────────────────────────────
export const comments = pgTable('comments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  username:   text('username').notNull(),
  targetType: text('target_type').notNull(),  // 'arc' | 'character' | 'episode' | 'battle'
  targetSlug: text('target_slug').notNull(),
  content:    text('content').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
})

// ─── Favorites ───────────────────────────────────────────────────────────
export const favorites = pgTable('favorites', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: text('target_type').notNull(),  // 'arc' | 'character' | 'devil-fruit' | 'crew'
  targetSlug: text('target_slug').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserFav: uniqueIndex('unique_user_fav').on(table.userId, table.targetType, table.targetSlug),
}))

// ─── Type Inference ───────────────────────────────────────────────────────
export type User          = typeof users.$inferSelect
export type NewUser       = typeof users.$inferInsert
export type WatchProgress = typeof watchProgress.$inferSelect
export type QuizScore     = typeof quizScores.$inferSelect
export type Comment       = typeof comments.$inferSelect
export type NewComment    = typeof comments.$inferInsert
export type Favorite      = typeof favorites.$inferSelect
