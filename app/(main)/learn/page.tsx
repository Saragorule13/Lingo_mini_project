import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";


const LearnPage = async () => {
    const userProgressData = getUserProgress();
    
    const[
        userProgress
    ] = await Promise.all([
        userProgressData
    ]);

    
    

    return(
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
             <UserProgress
              activeCourse={{imageSrc: "/asl.png", title: "ASL"}}
              hearts={5}
              points={100}
              hasActiveSubscription={false}

             />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Learn" />
            </FeedWrapper>
        </div>
    )
}
  
  export default LearnPage;