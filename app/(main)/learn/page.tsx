import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
// import { UserProgress } from "@/components/user-progress";
// import { getUserProgress } from "@/server/db/queries";

import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";

const LearnPage = async () => {
  // const userProgressData = getUserProgress();

  // const [userProgress] = await Promise.all([userProgressData]);

  // if (!userProgress || !userProgress.activeCourse) {
  //   redirect("/courses");
  // }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse ={{title: "Spanish", imageSrc: "/heart.svg"}}
          hearts={5}
          points={100}
          hasActiveSubscription={true}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={"Hello"} />
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;