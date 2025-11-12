"use client"
import InputComponent from "@/components/InputComponent";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { createClient } from "../../../../utils/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [manualCheckTriggered, setManualCheckTriggered] = useState(false);
    const { signIn, role, user, roleLoading } = useAuth();
    const router = useRouter();

    // Efecto para redireccionar cuando se determina el rol del usuario
    useEffect(() => {
        // No hacer nada si no hay usuario o si estamos en proceso de inicio de sesión
        if (!user) return;
        
        console.log("Usuario autenticado:", user.id);
        console.log("Rol actual:", role);
        console.log("RoleLoading:", roleLoading);
        
        // Si roleLoading es false, significa que tenemos información del rol
        if (!roleLoading) {
            console.log("Redirección basada en rol:", role);
            handleRedirectBasedOnRole(role);
        } else {
            console.log("Esperando determinación de rol...");
            // Si después de 2 segundos aún estamos cargando el rol, verificar directamente
            const timeoutId = setTimeout(() => {
                if (roleLoading && !manualCheckTriggered) {
                    console.log("Ejecutando verificación directa de rol");
                    setManualCheckTriggered(true);
                    checkRoleDirectly();
                }
            }, 2000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [user, role, roleLoading, manualCheckTriggered]);

    // Función para manejar la redirección basada en rol
    const handleRedirectBasedOnRole = (userRole: string | null) => {
        console.log("Redirigiendo basado en rol:", userRole);
        
        switch(userRole) {
            case 'admin':
                router.push("/");
                break;
            case 'partido':
                router.push("/");
                break;
            case 'candidato':
                router.push("/panel");
                break;
            default:
                // En caso de rol desconocido o nulo, redirigir a la página principal
                console.log("Rol no reconocido o nulo, redirigiendo a /");
                router.push("/");
        }
    };
    
    // Verificación directa del rol en caso de que el hook no lo determine a tiempo
    const checkRoleDirectly = async () => {
        if (!user) return;
        
        try {
            console.log("Verificando rol directamente para usuario:", user.id);
            const supabase = createClient();
            
            // Consultar directamente la tabla profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id_usuario', user.id)
                .single();
            
            if (error) {
                console.error("Error al verificar perfil directamente:", error);
                console.log("Error detallado:", JSON.stringify(error));
                router.push("/"); // Redirección por defecto en caso de error
                return;
            }
            
            if (data && data.rol) {
                console.log("Perfil completo:", data);
                console.log("Rol determinado directamente:", data.rol);
                handleRedirectBasedOnRole(data.rol);
            } else {
                console.log("No se encontró perfil o rol, redirigiendo a página principal");
                router.push("/");
            }
        } catch (err) {
            console.error("Error inesperado en verificación directa:", err);
            router.push("/");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        setManualCheckTriggered(false);
        
        try {
            const { data, error } = await signIn(email, password);
            
            if (error) {
                console.error("Error durante el login:", error);
                setError(`Error al iniciar sesión: ${error.message}`);
                return;
            }
            
            console.log("Login exitoso, usuario:", data?.user?.id);
            // La redirección se maneja en el useEffect
            
        } catch (err) {
            console.error("Error en login:", err);
            setError("Ocurrió un error inesperado durante el inicio de sesión");
        } finally {
            setIsLoading(false);
        }
    };
        
    return(
        <div className="max-h-screen flex justify-center">
            <form onSubmit={handleLogin} className="flex flex-col items-center relative border-2 border-black rounded-lg p-8 w-full max-w-md text-black">
                <Link href="/" className="absolute left-4 top-3 text-gray-700 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>

                <h3 className="text-4xl font-bold mb-15 mt-5 py-5">Iniciar Sesión</h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full">
                        {error}
                    </div>
                )}

                {roleLoading && user && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 w-full">
                        Verificando credenciales...
                    </div>
                )}

                <InputComponent 
                    placeholder="Correo Electrónico" 
                    className="mb-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputComponent 
                    placeholder="Contraseña" 
                    className="mb-10" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button 
                    className={`text-white bg-blue-500 py-3 px-8 rounded-sm ${isLoading || (user && roleLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
                    type="submit"
                    
                >
                    {isLoading ? 'Iniciando sesión...' : (user && roleLoading) ? 'Verificando...' : 'Iniciar Sesión'}
                </button>

                <hr className="w-full border-t border-gray-600 my-10"/>

                <div className="mt-6 text-center">
                    <p className="font-bold text-md">¿No tienes cuenta?</p>
                    <Link href="/registro" className="hover:underline text-sm">
                        Crear una cuenta
                    </Link>
                </div>
            </form>
        </div>
    );
}