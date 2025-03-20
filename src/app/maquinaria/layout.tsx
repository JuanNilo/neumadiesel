import { Camiones } from "@/mocks/Camiones.json";
import Link from "next/link";
import { GiMineTruck } from "react-icons/gi";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#f1f1f2] dark:bg-[#212121] block md:flex gap-x-5 min-h-screen">
            <main className="w-full md:w-[35%] md:h-screen h-[45vh]  flex justify-center items-center">
                <div className="bg-white dark:bg-black shadow-md rounded-lg w-[95%] h-[95%] ">
                    <h2 className="dark:text-amber-300 text-2xl font-bold p-2">Lista de Camiones</h2>
                    <div className="grid grid-cols-3 h-[85%] overflow-scroll gap-x-4 gap-y-2 px-6">
                        {Camiones.map((camion) => (
                            <Link href={`/maquinaria/${camion.Codigo}`} key={camion.Codigo} className="flex flex-col h-28 justify-center items-center p-2 bg-[#f1f1f1] dark:bg-[#212121] rounded-md hover:bg-amber-200 transition-all ease-in-out ">
                                <GiMineTruck size={35} />
                                <p className="text-xl font-semibold font-mono">{camion.Codigo}</p>
                            </Link>
                        ))
                        }
                    </div>
                </div>
            </main>
            <section className="w-full md:w-[65%] md:p-2">
                {children}
            </section>
        </div>
    )
}