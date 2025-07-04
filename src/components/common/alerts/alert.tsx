'use client';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export default function CustomModal({ isOpen, onClose, title, message }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            {/* Fondo semitransparente detrás */}
            <div className="absolute inset-0 bg-neutral-900 opacity-60"></div>

            {/* Contenido del modal */}
            <div className="relative bg-white dark:bg-neutral-800 dark:text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold dark:text-white">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-white ">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
