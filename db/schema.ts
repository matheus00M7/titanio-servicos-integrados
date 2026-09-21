import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable(
  'projects',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    category: text('category').notNull(),
    description: text('description').notNull().default(''),
    location: text('location').notNull().default(''),
    images: text('images').notNull(),
    published: integer('published').notNull().default(0),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('projects_published_created').on(table.published, table.createdAt),
  ],
);
