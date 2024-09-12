//to fetch the data from db
//no need to use props everytime

import { cache } from "react";
import db from "@/db/drizzle";
import { challengeProgress, lessons, units, userProgress } from "./schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const getUserProgress = cache(async()=>{
    const {userId} = await auth();

    if(!userId){
        return null;
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(
                                    challengeProgress.userId,
                                    userId,
                                )
                            }
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
export const getCourseProgress = cache(async () =>{
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId){
        return null;
    }

    const unitInActiveCourse  = await db.query.units.findMany({
       orderBy: (units,{asc})=>[asc(units.order)],
       where: eq(units.courseId, userProgress.activeCourseId),
       with:{
        lessons:{
            orderBy: (lessons,{asc}) => [asc(lessons.order)],
            where: eq(units.courseId,userProgress.activeCourseId),
            with:{
                unit: true,
                challenges:{
                   with: {
                    challengeProgress:{
                        where:eq (challengeProgress.userId, userId),
                    },
                   }, 
                }
            },
        },
       },
    });
});

const firstUncompletedLesson = unitsInActiveCourse
.flatMap((unit) => unit.lessons)
.find((lesson)=> {
    return lesson.challenges.some((challenge)=> {
        return !challenge.challengeProhress 
        || challenge.challengeProgress.length === 0 
        || challenge.challengeProgress.some((progress)=>
        progress.completed === false)
    });
});

return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
};
});
export const getLesson = cache(async (id?: number) =>{
    const {userId} = await auth();
    const courseProgress = await getCourseProgress();
    const lessonId = id || courseProgress?.activeLessonId;
    if (!lessonId){
        return null;
    }
    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with:{
            challenges: {
                orderBy: (challenges, {asc})=> [asc (challenges.order)],
                with:{
                    challengeOptions: true,
                    challengeProgress: {
                       where: eq(challengeProgress.userId, userId), 
                    },
                },
            },
        },
});
if (!data || !data.challenges) {
   return null;
}
const normalizedChallenges = data.challenges.map((challenge)=>{
    const completed = challenge.challengeProgress && challenge.
    challengeProgress.length > 0;
    return {...challenge, completed}
});
return {...data, challenges : normalizedChallenges }
});

export const getLessonPercentage = cache (async () =>{
    const courseProgress = await getCourseProgress();
    if (!courseProgress?.activeLessonId){
        return 0;
    }
    const lesson = await getLesson(courseProgress.activeLessonId);

    if (!lesson){
        return 0;
    }

    const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);
    const percentage =Math.round(
        (completedChallenges.length / lesson.challenges.length)* 100,
    );
    return percentage;
});  