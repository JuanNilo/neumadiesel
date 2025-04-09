import ListaNeumaticos from "@/components/features/neumatico/ListaNeumaticos";

export default function Page() {
    return (
        <div className="lg:m-4 rounded-md p-3 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm font-mono">
            <ListaNeumaticos tipo={"operacion"} />
        </div>
    );
}