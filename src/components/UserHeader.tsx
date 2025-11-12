"use client";

import Link from "next/link";
import { useUserProfile } from "@/hooks/useUserProfile";
import PrincipleButton from "@/components/PrincipleButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function UserHeader() {
  const { user, profile, loading } = useUserProfile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut, role } = useAuth();
  const router = useRouter();
  
  // Manejar cierre de la sidebar con clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('user-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      setIsSidebarOpen(false);
      await signOut();
      // El signOut ya incluye redirección a /login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Forzar redirección en caso de error
      router.push('/login');
    }
  };

  // Mostrar botón de login si no hay usuario o está cargando
  if (!user || loading) {
    return (
      <Link href="/login">
        <PrincipleButton 
          title="Iniciar Sesión" 
          className="flex font-bold shadow-lg gap-2 cursor-pointer"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          }
        />
      </Link>
    );
  }

  // Determinar qué enlaces mostrar según el rol
  const getRoleBasedLinks = () => {
    switch(role) {
      case 'admin':
        return (
          <>
            <li>
              <button
                onClick={() => {
                  router.push("/admin/dashboard");
                  setIsSidebarOpen(false);
                }}
                className="text-black font-bold hover:underline"
              >
                Panel de Administración
              </button>
            </li>
          </>
        );
      case 'partido':
        return (
          <>
            <li>
              <button
                onClick={() => {
                  router.push("/partido/dashboard");
                  setIsSidebarOpen(false);
                }}
                className="text-black font-bold hover:underline"
              >
                Panel de Partido
              </button>
            </li>
          </>
        );
      case 'candidato':
        return (
          <>
            <li>
              <button
                onClick={() => {
                  router.push("/candidato/dashboard");
                  setIsSidebarOpen(false);
                }}
                className="text-black font-bold hover:underline"
              >
                Panel de Candidato
              </button>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Icono de usuario */}
      <button 
        className="flex items-center gap-2 text-black font-semibold"
        onClick={() => setIsSidebarOpen(true)}
      >
        {profile ? `${profile.nombre} ${profile.apellido || ''}` : "Perfil"}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div 
          id="user-sidebar"
          className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-all ease-in-out duration-300 p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Menú</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-2 bg-gray-100 rounded-md">
            <p className="font-semibold">{profile?.nombre} {profile?.apellido || ''}</p>
            <p className="text-sm text-gray-500 capitalize">{role || 'Usuario'}</p>
          </div>

          <ul className="space-y-4">
            {/* Links específicos según el rol */}
            {getRoleBasedLinks()}
            
            {/* Links comunes para todos los usuarios */}
            <li>
              <button
                onClick={() => {
                  router.push("/panel");
                  setIsSidebarOpen(false);
                }}
                className="text-black font-bold hover:underline"
              >
                Ajustes
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 font-bold hover:underline"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}