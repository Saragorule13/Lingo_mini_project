//to fetch the data from db
//no need to use props everytime

import { cache } from "react";
import db from "@/db/drizzle";
import { lessons, units, userProgress } from "./schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const getUserProgress = cache(async()=>{
    const {userId} = await auth();

    if(!userId){
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    })

    return data;
});

export const getUnits = cache(async ()=>{
    const userProgress = await getUserProgress();

    if(!userProgress?.activeCourseId){
        return[];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: true,
                        }
                    }
                }
            }
        }
    });

    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
          const allCompletedChallenges = lesson.challenges.every((challenge) => {
            return (
              challenge.challengeProgress &&
              challenge.challengeProgress.length > 0 &&
              challenge.challengeProgress.every((progress) => progress.completed)
            );
          });
          return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompletedStatus };
      });

      return normalizedData;
      
})

export const getCourses = cache(async()=>{
    const data = await db.query.courses.findMany();
    return data;
});


// function auth(): { userId: any; } | PromiseLike<{ userId: any; }> {
//     throw new Error("Function not implemented.");
//
