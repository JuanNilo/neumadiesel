import * as React from "react";
import ScrapTyres from "@/components/features/res/ScrapTyres";
import OperationalTyres from "@/components/features/res/OperationalTyres";
import OperationalTyresHistograms from "@/components/features/res/OperationalTyresHistograms";
import ScrappedTyresChart from "@/components/features/res/ScrappedTyresChart";
import ScrappedReasonsChart from "@/components/features/res/ScrappedReasonsChart";
import TreadWearChart from "@/components/features/res/TreadWearChart";
import TireHealthChart from "@/components/features/res/TireHealthChart";
export default function Page() {
    return (
        <div className="flex flex-col overflow-x-hidden bg-gray-50 dark:bg-[#212121] pt-4  dark:text-white text-center w-full mx-auto gap-y-2 lg:gap-y-6 lg:p-3">

            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className=" grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold ">Reportabilidad de Rendimientos</h1>
                </div>
            </main>
            <ScrappedReasonsChart />
            <TreadWearChart />
            <TireHealthChart />
            <ScrapTyres />
            <OperationalTyres />
            <OperationalTyresHistograms />
            <ScrappedTyresChart />
        </div>
    );
}
