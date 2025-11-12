import { createClient } from '../../../utils/supabase/client';
import { Invitacion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const createInvitation = async (
  email: string,
  tipo: string,
  id_partido: number | null
): Promise<{ success: boolean; message?: string; invitation?: Invitacion; link?: string }> => {
  try {
    const supabase = createClient();
    
    // Verificar si ya existe una invitación para este email
    const { data: existingInvitations, error: checkError } = await supabase
      .from('invitaciones')
      .select('*')
      .eq('email', email)
      .eq('usada', false)
      .maybeSingle();
      
    if (checkError) {
      throw new Error(`Error al verificar invitaciones existentes: ${checkError.message}`);
    }
    
    // Si ya existe una invitación activa para este email, devolver mensaje
    if (existingInvitations) {
      return {
        success: false,
        message: 'Ya existe una invitación activa para este correo electrónico',
        invitation: existingInvitations,
        link: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/registro/${existingInvitations.token}`
      };
    }
    
    // Generar token único
    const token = uuidv4();
    
    // Calcular fecha de expiración (30 días a partir de hoy)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    // Crear invitación
    const newInvitation = {
      email,
      token,
      tipo,
      id_partido,
      usada: false,
      fecha_expiracion: expirationDate.toISOString()
    };
    
    const { data, error } = await supabase
      .from('invitaciones')
      .insert(newInvitation)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error al crear invitación: ${error.message}`);
    }
    
    // Generar link de invitación
     const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/registro/${token}`;

    return {
      success: true,
      invitation: data,
      link: invitationLink
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'Error desconocido al crear invitación'
    };
  }
};

export const validateInvitationToken = async (token: string): Promise<{ 
  valid: boolean; 
  invitation?: Invitacion; 
  message?: string 
}> => {
  try {
    const supabase = createClient();
    
    // Buscar invitación por token
    const { data, error } = await supabase
      .from('invitaciones')
      .select('*')
      .eq('token', token)
      .maybeSingle();
      
    if (error) {
      throw new Error(`Error al verificar el token de invitación: ${error.message}`);
    }
    
    // Si no existe invitación con ese token
    if (!data) {
      return {
        valid: false,
        message: 'Token de invitación inválido o inexistente'
      };
    }
    
    // Si la invitación ya fue usada
    if (data.usada) {
      return {
        valid: false,
        message: 'Esta invitación ya ha sido utilizada'
      };
    }
    
    // Verificar si la invitación expiró
    const expirationDate = new Date(data.fecha_expiracion);
    if (expirationDate < new Date()) {
      return {
        valid: false,
        message: 'Esta invitación ha expirado'
      };
    }
    
    return {
      valid: true,
      invitation: data
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        valid: false,
        message: error.message
      };
    }
    return {
      valid: false,
      message: 'Error desconocido al validar invitación'
    };
  }
};

export const markInvitationAsUsed = async (token: string): Promise<{ 
  success: boolean; 
  message?: string 
}> => {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('invitaciones')
      .update({ usada: true })
      .eq('token', token);
      
    if (error) {
      throw new Error(`Error al marcar invitación como usada: ${error.message}`);
    }
    
    return {
      success: true
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'Error desconocido al actualizar invitación'
    };
  }
};