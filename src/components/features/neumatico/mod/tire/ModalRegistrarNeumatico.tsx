"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import { TyreModelDto } from "@/types/TyreModelDTO";


interface ModalRegistrarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarNeumatico({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarNeumaticoProps) {
    const [tyreModelEdited, setTyreModelEdited] = useState({
        code: "",
        modelId: null as number | null,
        initialTread: null as number | null,
        initialKilometrage: null as number | null,
        initialHours: null as number | null
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tireModels, setTireModels] = useState<TyreModelDto[]>([]);
    const [selectedModel, setSelectedModel] = useState<TyreModelDto | null>(null);

    const fetchModelTire = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/tireModels");
            const data = await response.json();
            setLoading(false);
            setTireModels(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    useEffect(() => {
        fetchModelTire();
        console.log("selected", selectedModel)
    }, []);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const {
            code, modelId, initialTread, initialKilometrage, initialHours
        } = tyreModelEdited;
        console.log(tyreModelEdited);
        if (
            !code ||
            modelId === null ||
            initialTread === null ||
            initialKilometrage === null ||
            initialHours === null
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        if (selectedModel && initialTread > selectedModel.originalTread) {
            setError(`La goma inicial no puede ser mayor a la original del modelo (${selectedModel.originalTread})`);
            setLoading(false);
            return;
        }
        const locationId = 2;
        const usedHours = 0;
        const usedKilometrage = 0;
        try {
            const response = await axios.post(
                `https://inventory-service-emva.onrender.com/tires/`,
                {
                    code,
                    modelId,
                    locationId,
                    initialTread,
                    initialKilometrage,
                    initialHours,
                    usedHours,
                    usedKilometrage,
                },
            );

            setTyreModelEdited({
                code: "",
                modelId: null,
                initialTread: null,
                initialKilometrage: null,
                initialHours: null
            });
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };


    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative dark:text-white bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar Nuevo Neumatico</h2>
                <p className="text-sm text-gray-500 mb-4">Completa los campos para registrar un nuevo neumatico. Todos los nuevos neumaticos se almacenaran en bodega.</p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo */}
                    <Label title="Codigo" isNotEmpty={true} />
                    <input
                        name="Codigo Neumatico"
                        value={tyreModelEdited.code}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Modelo */}
                    <Label title="Modelo" isNotEmpty={true} />
                    <select
                        name="modelo"
                        value={tyreModelEdited.modelId === null ? "" : tyreModelEdited.modelId}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedModel = tireModels.find((model) => model.id === selectedId);
                            setSelectedModel(selectedModel || null);
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                modelId: selectedId,
                                initialTread: selectedModel?.originalTread ?? null,
                            });
                        }}
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Modelo</option>
                        {tireModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.code} - {model.dimensions}
                            </option>
                        ))}
                    </select>

                    {/* Goma original */}
                    <Label title="Goma Inicial" isNotEmpty={true} />
                    <input
                        disabled={selectedModel === null}
                        min={0}
                        value={tyreModelEdited.initialTread === null ? "" : tyreModelEdited.initialTread}
                        name="gomaInicial"
                        type="number"
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialTread: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="Goma Inicial"
                        className={`border border-gray-300 p-2 rounded ${selectedModel === null ? "opacity-50" : ""}`}
                    />
                    {/* KM inicial */}
                    <Label title="KM Inicial" isNotEmpty={true} />
                    <input
                        name="kmInicial"
                        type="number"
                        min={0}
                        value={tyreModelEdited.initialKilometrage === null ? "" : tyreModelEdited.initialKilometrage}
                        onChange={(e) => {
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialKilometrage: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}

                        placeholder="KM Inicial"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas inciales */}
                    <Label title="Horas Iniciales" isNotEmpty={true} />
                    <input
                        min={0}
                        name="horasIniciales"
                        type="number"
                        value={tyreModelEdited.initialHours === null ? "" : tyreModelEdited.initialHours}
                        onChange={(e) => {
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialHours: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}
                        placeholder="Horas Iniciales"
                        className="border border-gray-300 p-2 rounded"
                    />

                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : "Guardar Cambios"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
