import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type Option = {
    label: string;
    value: string;
    color?: string;
    icon?: React.ReactNode;
};

type MultiSelectProps = {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
};

export default function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Seleccionar estado...",
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleValue = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                onClick={() => setOpen(!open)}
                className="w-full border dark:border-neutral-700 rounded-md px-4 py-2 bg-white dark:bg-[#212121] flex justify-between items-center shadow-sm"
            >
                <span className="truncate text-left">
                    {selected.length > 0 ? `${selected.length} seleccionados` : placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-30 mt-2 w-full bg-white dark:bg-[#212121] border dark:border-neutral-700 rounded-md shadow-md max-h-64 overflow-y-auto">
                    {options.map(opt => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="accent-blue-600"
                                checked={selected.includes(opt.value)}
                                onChange={() => toggleValue(opt.value)}
                            />
                            <span className={clsx("w-3 h-3 rounded-full", opt.color)}></span>
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}