import * as React from "react";
import SectionCharts from "@/components/features/estadisticas/components/SectionCharts";
export default function Page() {
    return (
        <div className="flex flex-col overflow-x-hidden bg-white dark:bg-[#212121] pt-4 p-2 dark:text-white text-center w-full mx-auto   lg:p-3">
            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className=" grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold ">Reportabilidad de Rendimientos</h1>
                </div>
                <SectionCharts />
            </main>
        </div>
    );
}
