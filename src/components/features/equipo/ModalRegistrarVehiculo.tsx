"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuthFetch } from "@/utils/AuthFetch";
import axios from "axios";


interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
    vehicleCount: number;
}

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

interface VehicleTypeDTO {
    id: number;
    code: string;
    name: string;
}


interface ModalRegistrarVehiculoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarVehiculo({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarVehiculoProps) {
    const { user } = useAuth();
    const client = useAxiosWithAuth();
    const [vehicleEdited, setVehicleEdited] = useState({
        code: "",
        modelId: null as number | null,
        siteId: user?.faena_id == 99 ? null : user?.faena_id as number | null,
        typeId: null as number | null,
        kilometrage: null as number | null,
        hours: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [vehicleModels, setVehicleModels] = useState<VehicleModelDto[]>([]);
    const [sites, setSites] = useState<FaenaDTO[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeDTO[]>([]);

    const authFetch = useAuthFetch();


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dataForm/registerVehicle`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setLoading(false);
            setSites(data.sites);
            setVehicleModels(data.vehicleModels);
            setVehicleTypes(data.vehicleTypes);
            console.log("Data fetched:", data.vehicleTypes);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [user]);

    useEffect(() => {
        if (user?.faena_id) {
            setVehicleEdited((prev) => ({
                ...prev,
                siteId: user.faena_id === 99 ? null : (user.faena_id ?? null),
            }));
        }
    }, [user]);

    if (!visible) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        console.log("Type_vehicle:", vehicleEdited.typeId);
        const { code, modelId, typeId, siteId, hours, kilometrage } = vehicleEdited;
        if (!code || !modelId || !typeId || !siteId || hours === null || kilometrage === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        try {
            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/`,
                {
                    code,
                    modelId,
                    typeId,
                    siteId,
                    hours,
                    kilometrage
                },
            );

            onGuardar();
            setVehicleEdited({
                code: "",
                modelId: null,
                typeId: null,
                siteId: user?.faena_id == 99 ? null : user?.faena_id as number | null,
                kilometrage: 0,
                hours: 0,
            });
            onClose();
            setError("");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVehicleEdited({
            code: "",
            modelId: null,
            typeId: null,
            siteId: user?.faena_id == 99 ? null : user?.faena_id as number | null,
            kilometrage: 0,
            hours: 0,
        });
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] dark:text-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Registrar Nuevo Equipo</h2>
                <p className="text-sm mb-4">
                    Rellene todos los campos para registrar un nuevo equipo. Asegúrese de que el código del equipo sea único y que el modelo y la faena estén correctamente seleccionados.
                </p>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}

                <div className="grid grid-cols-2 gap-2">
                    {/* Lista de modelos */}
                    <label className="text-sm mt-2 font-semibold mb-2">Modelo</label>
                    <select
                        name="Modelo"
                        value={vehicleEdited.modelId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, modelId: Number(e.target.value) })
                        }
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona un modelo</option>
                        {vehicleModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.brand} {model.model}
                            </option>
                        ))}
                    </select>
                    {/* Lista de faenas */}
                    <label className="text-sm mt-2 font-semibold mb-2">Faena</label>
                    <select
                        disabled={user?.faena_id !== 99}
                        name="Faena"
                        value={vehicleEdited.siteId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, siteId: Number(e.target.value) })
                        }
                        className={"border border-gray-300 p-2 rounded" + (user?.faena_id !== 99 ? " opacity-70 cursor-not-allowed" : "")}
                    >
                        <option value="">Selecciona una faena</option>
                        {sites.map((site) => (
                            <option key={site.id} value={site.id}>
                                {site.name} - {site.region}
                            </option>
                        ))}
                    </select>
                    {/* Lista de tipos */}
                    <label className="text-sm mt-2 font-semibold mb-2">Tipo de Vehículo</label>
                    <select
                        name="Tipo"
                        value={vehicleEdited.typeId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, typeId: Number(e.target.value) })
                        }
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona un tipo de vehículo</option>
                        {vehicleTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.code} - {type.name}
                            </option>
                        ))}
                    </select>
                    {/* Codigo del vehiculo */}
                    <label className="text-sm mt-2 font-semibold mb-2">Código del equipo</label>
                    <input
                        name="Codigo"
                        value={vehicleEdited.code}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Código del equipo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas */}

                    <label className="text-sm mt-2 font-semibold mb-2">Horas Operacionales</label>
                    <input
                        name="horas"
                        type="number"
                        min={0}
                        value={vehicleEdited.hours === null ? "" : vehicleEdited.hours}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVehicleEdited({
                                ...vehicleEdited,
                                hours: val === "" ? 0 : Number(val),
                            });
                        }}
                        placeholder="Horas trabajadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje */}
                    <label className="text-sm mt-2 font-semibold mb-2">Kilometraje</label>
                    <input
                        name="kilometraje"
                        type="number"
                        min={0}
                        value={vehicleEdited.kilometrage === null ? "" : vehicleEdited.kilometrage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVehicleEdited({
                                ...vehicleEdited,
                                kilometrage: val === "" ? 0 : Number(val),
                            });
                        }
                        }
                        placeholder="Kilometraje"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">

                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>

                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
