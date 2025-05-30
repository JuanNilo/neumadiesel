"use client";
import Budget from "@/components/features/faena/budget/ListaBudget";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}
export default function Page() {


    const params = useParams<{ id: string }>();
    const id = params.id

    const [faena, setFaena] = useState<FaenaDTO | null>(null);

    const fetchFaenas = async () => {
        try {
            const response = await fetch(`https://inventory-service-emva.onrender.com/sites/${id}/with-contract`);
            const data = await response.json();
            setFaena(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);

    return (
        <div className="bg-white rounded-lg h-full ">
            <Breadcrumb />
            <h1 className="text-3xl font-bold px-4">Faena {faena?.name
                ? faena.name
                : "Cargando.."
            }</h1>
            <div className="flex justify-between items-center border-b px-4 py-2 border-gray-300 pb-4">
                <div className="flex  gap-2">

                    <span className="text-md text-gray-600 font-semibold flex items-center gap-2">
                        <FaCalendarAlt className="text-3xl" />
                        <div className="flex flex-col">
                            <span>Inicio: </span>
                            <span className="text-lg font-semibold text-neutral-900">
                                {faena?.contract?.startDate ? new Date(faena.contract.startDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                        <FaCalendarAlt className="text-3xl ml-4" />
                        <div className="flex flex-col gap-1">
                            <span>Fecha: </span>
                            <span className="text-lg font-semibold text-neutral-900">
                                {faena?.contract?.endDate ? new Date(faena.contract.endDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                    </span>
                </div>
            </div>

            <Budget siteId={Number(id)} />
        </div>
    );
}
