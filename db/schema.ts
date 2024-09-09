import exp from "constants";
import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, text } from "drizzle-orm/pg-core";
import {boolean, pgTable, PgTable } from "drizzle-orm/pg-core";
import { ImageResponse } from "next/server";
import { title } from "process";

export const courses = pgTable("courses",{
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({many})=>({
    userProgress: many(userProgress),
    units: many(units),
}))

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(()=>courses.id, {
        onDelete: "cascade"
    }).notNull(),
});


export const unitRelations = relations(units, ({many, one})=>({
    course: one(courses, {
        fields: [units.courseId],
        references:[courses.id],
    }),
    lessons: many(lessons),
}));

 export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
  });

  export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
      fields: [lessons.unitId],
      references: [units.id],
    }),
    challenges: many(challenges)
  }));

  export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);
  
  export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(()=>lessons.id, {
        onDelete: "cascade"
    }).notNull(),
    type: challengesEnum("type").notNull(),
    Question: text("question").notNull(),
    order: integer("order").notNull(),
  })

export const challengesRelations = relations(challenges, ({ one, many }) => ({
   lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
   }),
   challengesOption: many(challengesOption),
   challengeProgress: many(challengeProgress),
}));

  export const challengesOption = pgTable("challengesOption", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(()=>challenges.id, {
        onDelete: "cascade"
    }).notNull(),
    type: challengesEnum("type").notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
  })
  
  export const challengeProgress = pgTable("challengeProgress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(()=>challenges.id, {
        onDelete: "cascade"
    }).notNull(),
    type: challengesEnum("type").notNull(),
    completed: boolean("completed").notNull().default(false),
  })
  
  export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
     fields: [challengeProgress.challengeId],
     references: [challenges.id],
    })
   }));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
    activeCourseId: integer("active_course_id").references(()=>courses.id, {onDelete: "cascade"}),
    hearts: integer("hearts").notNull().default(5),
    points: integer("hearts").notNull().default(0),
})

export const userProgressRelations = relations(userProgress, ({one})=>({
    activeCourse: one(courses, {
        fields:  [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));