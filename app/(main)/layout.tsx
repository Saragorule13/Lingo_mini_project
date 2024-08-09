import Sidebar from "@/components/Sidebar";
import { Divide } from "lucide-react";
import { Children } from "react";

type Props = {
    children: React.ReactNode;
};

const MainLayout = ({
    children,
}: Props) =>{
    return(
    <>
        <Sidebar/>
        <main className="pl-[256px] h-full pt-[50px] lg:pt-0">
            <div className="bg-red-500 h-full border-red-50">
            {children}
            </div>
        </main>
       </>
    );
}

export default MainLayout;