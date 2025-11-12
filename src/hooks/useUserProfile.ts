"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Define los tipos según tu esquema
interface UserProfile {
  id_usuario: string;
  nombre: string;
  apellido?: string | null;
  rol?: 'admin' | 'partido' | 'candidato' | null;
  id_partido?: string | null;
  id_candidato?: string | null;
  // Agrega cualquier otro campo que necesites
}

export function useUserProfile() {
  const supabase = createClient();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Paso 1: obtener perfil básico
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id_usuario', user.id)
          .single();

        if (profileError || !profileData) {
          setError("Error al cargar el perfil");
          setProfile(null);
          return;
        }

        const extendedProfile: UserProfile = {
          ...profileData,
        };

        // Paso 2: si el usuario es partido o candidato, obtener su info
        if (profileData.rol === 'partido') {
          const { data: partidoData } = await supabase
            .from('partidos')
            .select('id_partido')
            .eq('id_usuario', user.id)
            .single();

          if (partidoData) {
            extendedProfile.id_partido = partidoData.id_partido;
          }
        }

        if (profileData.rol === 'candidato') {
          const { data: candidatoData } = await supabase
            .from('candidatos')
            .select('id_candidato, id_partido')
            .eq('id_usuario', user.id)
            .single();

          if (candidatoData) {
            extendedProfile.id_candidato = candidatoData.id_candidato;
            extendedProfile.id_partido = candidatoData.id_partido;
          }
        }

        console.log("Extended profile:", extendedProfile);
        setProfile(extendedProfile);

      } catch (err) {
        console.error("Unexpected error in useUserProfile:", err);
        setError("Error inesperado al cargar el perfil");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    
    // Configuramos un listener para cambios en los datos del perfil
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id_usuario=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Profile changed:', payload);
          // Recargar el perfil cuando haya cambios
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user, supabase]);

  // Función para actualizar el perfil
  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: "No user authenticated" };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id_usuario', user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
      }

      setProfile(data as UserProfile);
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
      return { success: false, error: "Error inesperado al actualizar el perfil" };
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    role,
    updateProfile,
  };
}