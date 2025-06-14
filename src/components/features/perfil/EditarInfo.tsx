"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
export default function EditarInfo() {
    const { user, updateUser, setUser } = useAuth();
    const [name, setName] = useState(user?.name);
    const [last_name, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);
    const [role, setRole] = useState(user?.role.name);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            if (!user) return null;

            const updatedUser = await updateUser(user?.user_id, {
                name: name,
                last_name: last_name,
                email: email,
            });

            // Actualizar el estado del usuario en el contexto
            setUser(updatedUser);
            setSuccess("Usuario actualizado correctamente");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col dark:text-white">
            <h1 className="text-2xl font-bold ">Datos personales</h1>
            <div className="grid mt-2 grid-cols-2 gap-4 items-center justify-center w-full ">
                <div className="flex flex-col  w-full">
                    <label className="text-sm text-gray-500 dark:text-white">Nombre:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 rounded-sm p-2"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500 dark:text-white">Apellido:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 rounded-sm p-2"
                        value={last_name}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500 dark:text-white">Email:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 rounded-sm p-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500 dark:text-white">Password:</label>
                    <p className="text-sm text-gray-950 dark:text-white font-semibold">**********</p>
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500 dark:text-white">Rol:</label>
                    <input
                        disabled={true}
                        type="text"
                        className="text-sm bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 rounded-sm p-2"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    />
                </div>
                {error && (
                    <div className=" bg-red-50 border-2 border-dashed border-red-400 rounded-sm p-2">
                        <p className="text-red-500 text-sm">
                            Error al actualizar el usuario: {error}
                        </p>
                    </div>
                )}
                {success && (
                    <div className=" bg-green-50 border-2 border-dashed border-green-400 rounded-sm p-2">
                        <p className="text-green-700 text-sm">Usuario actualizado correctamente</p>
                    </div>
                )}
            </div>
            <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                Guardar Cambios
            </ButtonWithAuthControl>
        </section>
    );
}
