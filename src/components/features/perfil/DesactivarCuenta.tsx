import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
export default function DesactivarCuenta() {

    const { deactivateUser, user, isDemo, logout } = useAuth();


    useEffect(() => {
        if (!user) {
            console.error("No hay usuario autenticado");
        }
        console.log("Usuario autenticado:", user);
        // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje
    }, [user]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            await deactivateUser(user.user_id);
            logout();
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al desactivar el usuario");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex justify-center items-center flex-col h-2/3 w-2/3 mx-auto dark:text-white">

            <h1 className=" text-center text-2xl font-bold">Desactivar cuenta</h1>
            {/* icono de alerta */}
            <FaExclamationTriangle className="my-4 text-red-500 text-5xl mx-auto" />
            <p className="text-md text-gray-500 dark:text-white text-justify">
                Al desactivar su cuenta, ya no podrá acceder a la aplicación ni a sus datos.
                Si desea volver a activar su cuenta, deberá ponerse en contacto con la administración.
            </p>
            <button onClick={() => handleConfirm()} className="bg-red-500 hover:bg-red-600 mt-4 text-white font-semibold rounded-sm p-2">
                Desactivar cuenta
            </button>
            <LoadingSpinner isOpen={isLoading} />
            {error && <div className="text-red-500 flex justify-between text-sm w-full mt-4 bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                <button disabled={isDemo} onClick={() => setError("")} className=" text-red-500">
                    X
                </button>
            </div>}
        </section>
    );
}
