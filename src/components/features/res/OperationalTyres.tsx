"use client";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";
import { toPng } from "html-to-image";

type OperationalTire = {
    id: number;
    code: string;
    initialTread: number;
    model: {
        dimensions: string;
        originalTread: number;
    };
    lastInspection: {
        externalTread: number;
        internalTread: number;
        hours: number;
        inspectionDate: string;
    };
    installedTires?: {
        vehicle?: {
            code: string;
        };
    }[];
};

type ScatterPoint = {
    codigo: string;
    horas: number;
    desgaste: number;
    fecha: string;
    dimension: string;
    equipo: string;
};
type CustomTooltipProps = {
    active?: boolean;
    payload?: { payload: ScatterPoint }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 p-3 rounded shadow text-sm text-black dark:text-white max-w-xs">
                <p><strong>Neumático:</strong> {data.codigo}</p>
                <p><strong>Dimensión:</strong> {data.dimension}</p>
                <p><strong>Equipo:</strong> {data.equipo}</p>
                <p><strong>Fecha inspección:</strong> {data.fecha}</p>
                <p><strong>Horas inspección:</strong> {data.horas}h</p>
                <p><strong>% Desgaste del neumático:</strong> {data.desgaste}%</p>
            </div>
        );
    }
    return null;
};

export default function OperationalTyres() {
    const authFetch = useAuthFetch();
    const { user, siteId } = useAuth()
    const [tires, setTires] = useState<OperationalTire[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>(["46/90R57"]);
    const [trendInfo, setTrendInfo] = useState<{ equation: string, r2: number, correlation: string } | null>(null);

    const fetchTires = async () => {
        setLoading(true);
        try {
            const res = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/${siteId}`);
            if (!res) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await res.json();
            setTires(data);
        } catch (error) {
            console.error("Error cargando neumáticos operacionales:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!user) {
            return;
        }
        fetchTires();
    }, [user, siteId]);

    const scatterData: ScatterPoint[] = tires.map((tire) => {
        const finalTread = (tire.lastInspection.externalTread + tire.lastInspection.internalTread) / 2;
        const desgaste = tire.initialTread
            ? Number((((tire.initialTread - finalTread) / tire.initialTread) * 100).toFixed(2))
            : 0;

        const equipo = tire.installedTires?.[0]?.vehicle?.code ?? "Desconocido";

        return {
            codigo: tire.code,
            horas: tire.lastInspection.hours,
            desgaste,
            fecha: new Date(tire.lastInspection.inspectionDate).toISOString().split("T")[0],
            dimension: tire.model.dimensions,
            equipo,
        };
    });

    const groupedData: Record<string, ScatterPoint[]> = {};
    scatterData.forEach((item) => {
        if (!groupedData[item.dimension]) groupedData[item.dimension] = [];
        groupedData[item.dimension].push(item);
    });

    const dimensionOptions = Object.keys(groupedData).map((d) => ({ value: d, label: d }));

    const colorMap: Record<string, string> = {};
    dimensionOptions.forEach((opt, i) => {
        const hue = (i * 137.508) % 360;
        colorMap[opt.value] = `hsl(${hue}, 70%, 55%)`;
    });

    const visibleGroups = Object.entries(groupedData).filter(
        ([dim]) => selectedDimensions.length === 0 || selectedDimensions.includes(dim)
    );


    const downloadChartAsImage = async () => {
        const node = document.getElementById("chart-last-inspection");
        if (!node) return;
        console.log("exportando")

        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `grafico_salud_neumaticos.png`;
        link.click();
    };

    return (
        <section className=" border rounded-xl p-4 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
                % Desgaste vs. Horas de uso desde última inspección - Neumáticos Operacionales
            </h2> <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                Relación entre el uso operativo y el desgaste acumulado de los neumáticos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <div className="flex flex-col items-start space-y-1">
                    <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por dimensión:</label>
                    <Select
                        isMulti
                        options={dimensionOptions}
                        value={dimensionOptions.filter(opt => selectedDimensions.includes(opt.value))}
                        onChange={(opts) => setSelectedDimensions(opts.map(opt => opt.value))}
                        placeholder="Selecciona dimensiones..."
                        className="text-black w-full"
                    />
                </div>


                {/* Información de tendencia flotante */}
                {trendInfo && (
                    <div className="flex flex-col col-span-2 items-start space-y-1">
                        <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por dimensión:</label>
                        <div className="flex px-2 w-full bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-300 dark:border-neutral-700 rounded-lg py-2 items-center gap-2 text-sm">
                            <span className="inline-block w-4 h-0.5 bg-neutral-600" style={{ borderTop: "2px dashed" }}></span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Línea de Tendencia:</span>
                            <span className="text-gray-700 dark:text-gray-300">
                                {trendInfo.equation}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                R² = {trendInfo.r2.toFixed(4)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({trendInfo.correlation})
                            </span>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-end">
                    <button
                        onClick={downloadChartAsImage}
                        className="px-4 py-2 bg-blue-600 font-semibold text-white rounded mt-4"
                    >
                        Exportar como Imagen
                    </button>
                </div>
            </div>

            <div className="w-full h-[400px] bg-white dark:bg-neutral-800 p-4 rounded-md 
             relative">
                {loading ? (
                    <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
                ) : (
                    <div className="bg-white w-full h-full dark:bg-neutral-800 " id={"chart-last-inspection"}>

                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="horas" name="Horas acumuladas" unit="h" stroke="#888" />
                                <YAxis type="number" dataKey="desgaste" name="% Desgaste" unit="%" stroke="#888" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ color: '#000', fontWeight: 'bold' }} />
                                {visibleGroups.map(([dimension, data]) => (
                                    <Scatter
                                        key={dimension}
                                        name={dimension}
                                        data={data}
                                        fill={colorMap[dimension]}
                                    />
                                ))}
                                {/* Línea de tendencia única para todos los datos visibles */}
                                {(() => {
                                    // Combinar todos los datos visibles
                                    const allVisibleData = visibleGroups.flatMap(([, data]) => data);

                                    if (allVisibleData.length < 2) {
                                        // Limpiar información de tendencia si no hay suficientes datos
                                        if (trendInfo) setTrendInfo(null);
                                        return null;
                                    }

                                    // Calcular regresión lineal simple (y = a*x + b)
                                    const n = allVisibleData.length;
                                    const sumX = allVisibleData.reduce((acc, d) => acc + d.horas, 0);
                                    const sumY = allVisibleData.reduce((acc, d) => acc + d.desgaste, 0);
                                    const sumXY = allVisibleData.reduce((acc, d) => acc + d.horas * d.desgaste, 0);
                                    const sumX2 = allVisibleData.reduce((acc, d) => acc + d.horas * d.horas, 0);

                                    const denominator = n * sumX2 - sumX * sumX;
                                    if (denominator === 0) {
                                        if (trendInfo) setTrendInfo(null);
                                        return null;
                                    }

                                    const a = (n * sumXY - sumX * sumY) / denominator;
                                    const b = (sumY * sumX2 - sumX * sumXY) / denominator;

                                    // Calcular R²
                                    const yMean = sumY / n;
                                    const ssRes = allVisibleData.reduce((acc, d) => {
                                        const predicted = a * d.horas + b;
                                        return acc + Math.pow(d.desgaste - predicted, 2);
                                    }, 0);
                                    const ssTot = allVisibleData.reduce((acc, d) => {
                                        return acc + Math.pow(d.desgaste - yMean, 2);
                                    }, 0);
                                    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

                                    // Solo mostrar línea si R² >= 0.7 (70%)
                                    if (r2 < 0.7) {
                                        if (trendInfo) setTrendInfo(null);
                                        return null;
                                    }

                                    // Determinar correlación
                                    const getCorrelation = (r2: number) => {
                                        if (r2 >= 0.8) return "Muy fuerte";
                                        if (r2 >= 0.6) return "Fuerte";
                                        if (r2 >= 0.4) return "Moderada";
                                        if (r2 >= 0.2) return "Débil";
                                        return "Muy débil";
                                    };

                                    // Actualizar información de tendencia
                                    const newTrendInfo = {
                                        equation: `y = ${a.toFixed(4)}x + ${b.toFixed(2)}`,
                                        r2: r2,
                                        correlation: getCorrelation(r2)
                                    };

                                    // Solo actualizar si la información cambió para evitar re-renders infinitos
                                    if (!trendInfo ||
                                        trendInfo.equation !== newTrendInfo.equation ||
                                        Math.abs(trendInfo.r2 - newTrendInfo.r2) > 0.0001) {
                                        setTrendInfo(newTrendInfo);
                                    }

                                    // Determinar color de la línea
                                    const lineColor = visibleGroups.length === 1
                                        ? colorMap[visibleGroups[0][0]]  // Color de la única dimensión
                                        : "#666666";  // Gris cuando hay múltiples filtros

                                    // Generar puntos para la línea de tendencia
                                    const minX = Math.min(...allVisibleData.map(d => d.horas));
                                    const maxX = Math.max(...allVisibleData.map(d => d.horas));
                                    const trendLine = [
                                        {
                                            horas: minX,
                                            desgaste: a * minX + b,
                                            codigo: "",
                                            fecha: "",
                                            dimension: "",
                                            equipo: ""
                                        },
                                        {
                                            horas: maxX,
                                            desgaste: a * maxX + b,
                                            codigo: "",
                                            fecha: "",
                                            dimension: "",
                                            equipo: ""
                                        }
                                    ];

                                    return (
                                        <Scatter
                                            key="overall-trend"
                                            name="Tendencia General"
                                            data={trendLine}
                                            line={{ stroke: lineColor, strokeDasharray: "5 5", strokeWidth: 3 }}
                                            fill="transparent"
                                            shape={() => <></>}
                                        />
                                    );
                                })()}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </section>
    );
}
