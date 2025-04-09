import * as React from 'react';
import BarChart from '@/components/common/charts/BarChart';
import PieChart from '@/components/common/charts/PieChart';
import ScatterPlot from '@/components/common/charts/ScatterPlot';
import StackBars from '@/components/common/charts/BarOverview';

export default function Page() {

    return (
        <div className="flex flex-col overflow-x-hidden  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-black text-center w-full mx-auto font-mono lg:p-3">
            <main className='w-[100%] lg:rounded-md mx-auto lg:p-4 h-[95%] '>
                <div className="flex w-full justify-between gap-2">
                    <h1 className='text-2xl font-bold'>Estadisticas</h1>
                    {/* Seleccion entre semana mes y año */}
                    <div className="flex text-center rounded-full">
                        <button className="bg-white hover:bg-gray-200 text-black px-4 w-20 py-2 rounded-l-full">Semana</button>
                        <button className="bg-white hover:bg-gray-200 text-black px-4 w-20 py-2 ">Mes</button>
                        <button className="bg-white hover:bg-gray-200 text-black px-4 w-20 py-2 rounded-r-full">Año</button>
                    </div>
                {/* Selector de fecha entre rango de fechas */}
                <div className="flex flex-row ">
                    <input type="date" className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-l-full" />
                    <input type="date" className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-r-full" />
                </div>
                </div>
                <div className="flex py-4 flex-col lg:grid lg:grid-cols-4 grid-rows-7 pb-4 gap-2 lg:gap-4">

                    {/* Grafico de barras */}
                    <div className=" bg-white dark:bg-gray-700 shadow-md rounded-md py-3 col-span-4 row-span-1 row-start-1">
                        <BarChart />
                    </div>
                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-7">
                        <ScatterPlot />
                    </div>

                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <PieChart />
                    </div>
                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <StackBars />
                    </div>

                </div>

            </main>
        </div>
    );
}