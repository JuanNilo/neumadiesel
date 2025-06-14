"use client"

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, LabelProps, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"

export const description = "A multiple bar chart"

function CustomLabel({ x, y, value }: Pick<LabelProps, "x" | "y" | "value">) {
    if (value === 0) return null;
    return (
        <text
            x={x}
            y={y}
            fill="white"
            fontSize={12}
            fontWeight={800}
            textAnchor="middle"
            transform={`rotate(-90, ${x}, ${y})`}
        >
            {value}
        </text>
    );
}

const chartData = [
    // { month: "2024", corte: 5376, desgaste: 5366, impacto: 4653, separacion: 3962, desgarro: 5124 },
    { month: "Enero", corte: 5200, desgaste: 5127, impacto: 0, separacion: 3762, desgarro: 4955 },
    { month: "Febrero", corte: 5284, desgaste: 5127, impacto: 0, separacion: 0, desgarro: 4575 },
    { month: "Marzo", corte: 3669, desgaste: 5187, impacto: 0, separacion: 0, desgarro: 0 },
    { month: "Abril", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    { month: "Mayo", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    { month: "Junio", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Julio", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Agosto", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Septiembre", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Octubre", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Noviembre", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
    // { month: "Diciembre", corte: 0, desgaste: 0, impacto: 0, separacion: 0, desgarro: 0 },
]

const chartConfig = {
    corte: {
        label: "corte",
        color: "#2980b9",
    },
    desgarro: {
        label: "desgarro",
        color: "#d4ac0d",
    },
    desgaste: {
        label: "desgaste",
        color: "#e74c3c",
    },
    impacto: {
        label: "impacto",
        color: "#2ecc71",
    },
    separacion: {
        label: "separacion",
        color: "#8e44ad",
    },

} satisfies ChartConfig

export function ScrapChart() {
    const [viewLabel, setViewLabel] = useState(false);
    return (
        <Card className="border-2 border-blue-500 h-[100%]  bg-neutral-100 dark:bg-neutral-900">
            <CardHeader>

                <CardTitle>Rendimiento Mensual</CardTitle>
                <CardDescription>Rendimiento Mensual por Motivo de Baja en Cantidad de Horas</CardDescription>

                <button onClick={() => setViewLabel(!viewLabel)} className="text-sm text-blue-500 hover:underline">
                    {viewLabel ? "Ocultar etiquetas" : "Mostrar etiquetas"}
                </button>

            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <YAxis
                            type="number"
                            tickCount={10}
                            tickLine={false}
                            tickMargin={4}
                            axisLine={false}
                            domain={[0, 6000]}
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}

                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="corte" fill="var(--color-corte)" radius={3}>
                            {
                                viewLabel && (
                                    <LabelList dataKey="corte" content={<CustomLabel />} />

                                )
                            }
                        </Bar>
                        <Bar dataKey="desgarro" fill="var(--color-desgarro)" radius={3} >
                            {viewLabel &&
                                (<LabelList dataKey="desgarro" content={<CustomLabel />} />)}
                        </Bar>
                        <Bar dataKey="desgaste" fill="var(--color-desgaste)" radius={3}>
                            {viewLabel && (<LabelList dataKey="desgaste" content={<CustomLabel />} />)}
                        </Bar>
                        <Bar dataKey="impacto" fill="var(--color-impacto)" radius={3} >
                            {viewLabel && (<LabelList dataKey="impacto" content={<CustomLabel />} />)}
                        </Bar>
                        <Bar dataKey="separacion" fill="var(--color-separacion)" radius={3}>
                            {viewLabel && (<LabelList dataKey="separacion" content={<CustomLabel />} />)}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex dark:text-white items-start gap-2 text-sm">
                {Object.entries(chartConfig).map(([key, { label, color }]) => (
                    <div key={key} className="flex gap-2 font-medium leading-none items-center">
                        <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: color }}></div>
                        <span>{label}</span>
                    </div>
                ))}
            </CardFooter>
        </Card>
    )
}
