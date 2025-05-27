export default function page() {
    return (
        <div className="  p-5 gap-y-5">
            <h1 className="text-2xl font-bold mb-4 border-b border-b-amber-200">Programar Mantenimiento</h1>
            <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">Semana a programar:</label>
                <input type="text" className="bg-amber-50 dark:bg-[#212121] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
            </div>
            <section className="flex gap-x-4 my-4">

                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Código de Maquinaria:</label>
                    <input type="text" className="bg-amber-50 dark:bg-[#212121] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Código Neumático:</label>
                    <input type="text" className="bg-amber-50 dark:bg-[#212121] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
            </section>
            <section className="flex gap-x-4 my-4">
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Razón:</label>
                    <input type="text" className="bg-amber-50 dark:bg-[#212121] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Destino:</label>
                    <input type="text" className="bg-amber-50 dark:bg-[#212121] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
            </section>
            <div>
                <button className="bg-amber-300 text-black font-semibold rounded-md p-2">Crear Modelo</button>
            </div>
        </div>
    )
}