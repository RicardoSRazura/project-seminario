"use client"

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";


type Role = 'admin' | 'partido' | 'candidato' | null;

interface RegisterPartidoData {
    email: string;
    password: string;
    nombre: string;
    apellido?: string | null;
    logo?: File | null;
    rol: 'partido';
}
  
interface RegisterCandidatoData {
    email: string;
    password: string;
    nombre: string;
    apellido?: string | null;
    cargo_buscado?: string;
    id_partido: number | null;
    imagen?: File | null;
    rol: 'candidato';
}

  type RegisterData = RegisterPartidoData | RegisterCandidatoData;

export function useAuth() {
    const supabase = createClient()
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(null);
    const [roleLoading , setRoleLoading] = useState(true);

    const determineUserRole = async (userId: string) => {
        try {
            setRoleLoading(true);
            console.log("Determinando rol para el usuario:", userId);
            
            // Verificar que estamos buscando con la columna correcta
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id_usuario', userId)
                .single();

            if (error) {
                console.error("Error obteniendo perfil:", error);
                console.log("Error completo:", JSON.stringify(error));
                setRole(null);
            } else if (data && data.rol) {
                console.log("Perfil encontrado:", data);
                console.log("Rol determinado:", data.rol);
                setRole(data.rol as Role);
            } else {
                console.log("No se encontró perfil para el usuario o el rol es nulo");
                console.log("Datos recibidos:", data);
                setRole(null);
            }
        } catch (error) {
            console.error("Error en determineUserRole:", error);
            setRole(null);
        } finally {
            setRoleLoading(false); // Asegurarnos de que siempre se establezca a false
        }
    };

    useEffect(() => {
        // Obtener la sesión actual al cargar
        const fetchSession = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Sesión actual:", session);
            
            if (session?.user) {
              setUser(session.user);
              console.log("Usuario en sesión, determinando rol:", session.user.id);
              await determineUserRole(session.user.id);
            } else {
              setUser(null);
              setRole(null);
              setRoleLoading(false);
            }
          } catch (error) {
            console.error('Error al obtener la sesión:', error);
            setUser(null);
            setRole(null);
            setRoleLoading(false);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSession();
    
        // Escuchar cambios en la autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Evento de autenticación:", event, "Session:", session ? "Existe" : "No existe");
            
            if (event === 'SIGNED_OUT') {
                console.log("Usuario ceero sesuon, limpiado estado...")
                setUser(null);
                setRole(null);
                setRoleLoading(false);

                router.refresh();
            } else if (session?.user) {
                console.log("Usuario en sesión, determinando rol:", session.user.id);
                setUser(session.user);
                await determineUserRole(session.user.id);
            } else {
                console.log("No hay sesión activa, estableciendo rol a null");
                setUser(null);
                setRole(null);
                setRoleLoading(false);
            }
        });
    
        return () => {
          authListener.subscription.unsubscribe();
        };
      }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        return user;
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        return { data, error };
    };

    const signIn = async (email: string, password: string) => {
        console.log("Intentando iniciar sesión con:", email);
        setRoleLoading(true); // Establecer roleLoading a true al iniciar el proceso
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                console.error("Error de inicio de sesión:", error);
                setRoleLoading(false);
                return { data, error };
            }
            
            console.log("Inicio de sesión exitoso:", data);
            
            // Determinar el rol del usuario después del inicio de sesión
            if (data?.user) {
                setUser(data.user);
                await determineUserRole(data.user.id);
            } else {
                setRoleLoading(false);
            }
            
            return { data, error };
        } catch (err) {
            console.error("Error inesperado en signIn:", err);
            setRoleLoading(false);
            return { data: null, error: { message: "Error inesperado" } };
        }
    };

    const signOut = async () => {
        setRoleLoading(true);
        try{
            const {error} = await supabase.auth.signOut({
                scope: 'global'
            });

            if(error) {
                console.error("Error al cerrar sesion", error)
                throw error;
            }

            setUser(null);
            setRole(null);

            //Forzamos una recarga de la pagina para asegurar la eliminacion de las cookies
            router.push("/login");
            router.refresh();
        } catch(error) {
            console.error("Error durante el cierre de sesion", error);
        } finally {
            setRoleLoading(false);
        }
    };

    // Función para verificar si la sesión es válida
    const validateSession = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            
            if (error || !data.session) {
                // Si hay un error o no hay sesión, forzar logout
                await signOut();
                return false;
            }
            
            // Verificar que el usuario tiene un perfil válido
            if (data.session.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('rol')
                    .eq('id_usuario', data.session.user.id)
                    .single();
                
                if (profileError || !profileData) {
                    console.error("Perfil de usuario no encontrado, cerrando sesión");
                    await signOut();
                    return false;
                }
                
                return true;
            }
            
            return false;
        } catch (err) {
            console.error("Error validando sesión:", err);
            await signOut();
            return false;
        }
    };

    // Función para subir un archivo a Supabase Storage
    const uploadFile = async (file: File, path: string): Promise<string | null> => {
        if (!file) return null;
        
        try {
            const timestamp = new Date().getTime();
            const fileExt = file.name.split('.').pop();
            const fileName = `${timestamp}.${fileExt}`;
            const filePath = `${path}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);
                
            if (uploadError) {
                throw new Error(`Error al subir archivo: ${uploadError.message}`);
            }
            
            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    // Método unificado para el registro
    const register = async (formData: RegisterData) => {
        try {
            // 1. Registro del usuario en Auth
            const { data: authData, error: authError } = await signUp(formData.email, formData.password);

            if (authError) {
                throw new Error(`Error al registrar usuario: ${authError.message}`);
            }

            if (!authData?.user) {
                throw new Error('No se pudo crear el usuario');
            }

            // 2. Acciones específicas según el rol
            if (formData.rol === 'partido') {
                // Es un partido político
                // 2.1 Subir logo si existe
                let logoPublicUrl = null;
                if (formData.logo) {
                    logoPublicUrl = await uploadFile(formData.logo, 'partidos');
                }

                // 2.2 Crear perfil de partido
                const partidoData = {
                    nombre_partido: formData.nombre,
                    logo: logoPublicUrl,
                    id_partido: authData.user.id,
                };

                const { error: partidoError } = await supabase
                    .from('partidos')
                    .insert(partidoData);

                if (partidoError) {
                    throw new Error(`Error al crear partido: ${partidoError.message}`);
                }

                // 2.3 Crear perfil de usuario con rol 'partido'
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id_usuario: authData.user.id,
                        nombre: formData.nombre,
                        rol: 'partido',
                    });

                if (profileError) {
                    throw new Error(`Error al crear perfil: ${profileError.message}`);
                }
            } else {
                // Es un candidato
                // 2.1 Subir imagen si existe
                let imagenPublicUrl = null;
                if (formData.imagen) {
                    imagenPublicUrl = await uploadFile(formData.imagen, 'candidatos');
                }

                // 2.2 Crear perfil de candidato
                const candidatoData = {
                    nombre: formData.nombre,
                    apellido: formData.apellido || null,
                    id_partido: formData.id_partido,
                    id_usuario: authData.user.id,
                    cargo_buscado: formData.cargo_buscado || null,
                    imagen_url: imagenPublicUrl,
                };

                const { error: candidatoError } = await supabase
                    .from('candidatos')
                    .insert(candidatoData);

                if (candidatoError) {
                    throw new Error(`Error al crear candidato: ${candidatoError.message}`);
                }

                // 2.3 Crear perfil de usuario con rol 'candidato'
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id_usuario: authData.user.id,
                        nombre: formData.nombre,
                        apellido: formData.apellido || null,
                        id_partido: formData.id_partido,
                        rol: 'candidato'
                    });

                if (profileError) {
                    throw new Error(`Error al crear perfil: ${profileError.message}`);
                }
            }

            return { success: true, user: authData.user };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, error: error.message };
            }
            return { success: false, error: 'Error desconocido durante el registro' };
        }
    };

    // Mantener los métodos existentes por compatibilidad
    const registerPartido = async (formData: RegisterPartidoData) => {
        return register(formData);
    };

    const registerCandidato = async (formData: RegisterCandidatoData) => {
        return register(formData);
    };

    // Método para registrar con token de invitación
    const registerWithToken = async (
        token: string, 
        formData: any, 
        invitationType: string, 
        partidoId: number | null,
        logoFile: File | null
    ) => {
        try {
            // 1. Registro del usuario en Auth
            const { data: authData, error: authError } = await signUp(formData.email, formData.password);

            if (authError) {
                throw new Error(`Error al registrar usuario: ${authError.message}`);
            }

            if (!authData?.user) {
                throw new Error('No se pudo crear el usuario');
            }

            // 2. Subir logo si existe
            let logoPublicUrl = null;
            if (logoFile) {
                logoPublicUrl = await uploadFile(logoFile, invitationType === 'partido' ? 'partidos' : 'candidatos');
            }

            // 3. Crear perfil según tipo
            if (invitationType === 'partido') {
                const partidoData = {
                    nombre_partido: formData.nombre,
                    logo: logoPublicUrl,
                    auth_users_id: authData.user.id,
                };

                const { error: partidoError } = await supabase
                    .from('partidos')
                    .insert(partidoData);

                if (partidoError) {
                    throw new Error(`Error al crear partido: ${partidoError.message}`);
                }
            } else if (invitationType === 'candidato') {
                const candidatoData = {
                    nombre: formData.nombre,
                    apellido: formData.apellido || null,
                    id_partido: partidoId,
                    id_usuario: authData.user.id,
                    cargo_buscado: formData.cargo_buscado || null,
                    imagen_url: logoPublicUrl,
                };

                const { error: candidatoError } = await supabase
                    .from('candidatos')
                    .insert(candidatoData);

                if (candidatoError) {
                    throw new Error(`Error al crear candidato: ${candidatoError.message}`);
                }
            }

            // 4. Marcar invitación como usada
            // Esto deberías manejarlo con una función externa o un servicio
            // (Esta parte dependerá de tu implementación actual de markInvitationAsUsed)

            // 5. Crear perfil de usuario
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id_usuario: authData.user.id,
                    nombre: formData.nombre,
                    id_partido: invitationType === 'candidato' ? partidoId : null,
                    apellido: formData.apellido || null,
                });

            if (profileError) {
                throw new Error(`Error al crear perfil: ${profileError.message}`);
            }

            return { success: true, user: authData.user };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, error: error.message };
            }
            return { success: false, error: 'Error desconocido durante el registro' };
        }
    };


    return { 
        user,
        loading,
        role,
        roleLoading, 
        getUser, 
        signUp, 
        signIn, 
        signOut,
        validateSession,
        register,
        registerPartido,
        registerCandidato,
        registerWithToken
    };
}
