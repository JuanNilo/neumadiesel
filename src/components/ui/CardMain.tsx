import Link from 'next/link';

interface CardMainProps {
    link: string;
    titulo: string;
    descripcion: string;
    cantidad: number;
    children: React.ReactNode;
}

export default function CardMain({ link, titulo, cantidad, descripcion, children }: CardMainProps) {
    return (

        <Link href={`/${link}`} className="w-80 h-36 px-4 rounded-xl p-3 bg-amber-50 hover:bg-amber-200 transition-all ease-in-out border border-black shadow-md ">
            <p className="text-black font-semibold text-xl">{titulo}</p>
            <div className='flex justify-between items-center pr-8' >
                <p className="text-black font-bold text-3xl">{cantidad}</p>
                {children}
            </div >
            <p className="text-black font-mono text-md">{descripcion}</p>
        </Link >
    )
}