"use client";
import { FaInfoCircle, FaPlusSquare } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ModalEditarVehicleModel from "@/components/features/equipo/modaleditarModeloVehiculo";
import ModalRegistarModeloVehiculo from "@/components/features/equipo/ModalRegistrarModeloVehiculo";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/layout/BreadCrumb";
interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
    vehicleCount: number;
}

interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
}

export default function EquiposPorModelo() {
    const { id } = useParams();
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [model, setModel] = useState<VehicleModelDto>({} as VehicleModelDto);
    const [vehicleModelSelected, setVehicleModelSelected] = useState<VehicleModelDto | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3002/vehicleModels/withVehicles/${id}`);
            const data = await response.json();
            console.log(data);
            console.log("Vehiculos", data.vehicles)
            setModel(data);
            setVehicles(data.vehicles);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [modalRegistarFaena, setModalRegistrarFaena] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };


    useEffect(() => {
        fetchVehicleModels();
    }, [isOpen, mostrarEditar, modalRegistarFaena]);

    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <Breadcrumb />
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Lista de Vehiculos de {model.brand} - {model.model}</h1>
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="text-xs text-black uppercase bg-amber-300  ">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Codigo
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Horas
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Kilometraje
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Tipo de Equipo
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Acciones
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando Equipos...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8">
                                        <div className="flex flex-col items-center justify-center space-y-4  animate-pulse">
                                            <svg
                                                className="w-12 h-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No se encontraron Equipos.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {
                                vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200 dark:text-white">
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {vehicle.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {vehicle.hours}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {vehicle.kilometrage}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                CAEX
                                            </p>
                                        </td>
                                        <td className="  bg-gray-50 dark:bg-neutral-900 px-2">
                                            <div className="flex gap-2">
                                                {/* Boton de ver detalles */}
                                                <Link href={`/maquinaria/${vehicle.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border border-blue-300 rounded-md flex items-center justify-center">
                                                    <FaInfoCircle />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/* Modal editar Faena */}
                <ModalEditarVehicleModel
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    vehicleModel={vehicleModelSelected}
                    onGuardar={() => {
                        setMostrarEditar(false);
                    }} />

                <ModalRegistarModeloVehiculo
                    visible={modalRegistarFaena}
                    onClose={() => setModalRegistrarFaena(false)}
                    onGuardar={() => {
                        setModalRegistrarFaena(false);
                    }} />
            </main>
        </div>
    );
}
