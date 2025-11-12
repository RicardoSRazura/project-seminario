// src/lib/services/propuestas.ts
import { createClient } from '../../../utils/supabase/client';
import { Propuesta } from '@/types';

const supabase = createClient();

export const propuestasService = {
  // Obtener propuestas por candidato
  async getPropuestasByCandidato(candidatoId: string): Promise<Propuesta[]> {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('id_candidato', candidatoId);
    
    if (error) {
      console.error('Error al obtener propuestas del candidato:', error);
      throw error;
    }
    
    return data || [];
  },

  // Obtener propuestas por partido
  async getPropuestasByPartido(partidoId: string): Promise<Propuesta[]> {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('id_partido', partidoId);
    
    if (error) {
      console.error('Error al obtener propuestas del partido:', error);
      throw error;
    }
    
    return data || [];
  },

  // Crear una nueva propuesta
  async createPropuesta(propuesta: Omit<Propuesta, 'id_propuesta'>): Promise<Propuesta> {
    const { data, error } = await supabase
      .from('propuestas')
      .insert([propuesta])
      .select()
      .single();
    
    if (error) {
      console.error('Error al crear propuesta:', error);
      throw error;
    }
    
    return data;
  },

  // Actualizar una propuesta
  async updatePropuesta(id: number, propuesta: Partial<Propuesta>): Promise<Propuesta> {
    const { data, error } = await supabase
      .from('propuestas')
      .update(propuesta)
      .eq('id_propuesta', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error al actualizar propuesta:', error);
      throw error;
    }
    
    return data;
  },

  // Eliminar una propuesta
  async deletePropuesta(id: number): Promise<void> {
    const { error } = await supabase
      .from('propuestas')
      .delete()
      .eq('id_propuesta', id);
    
    if (error) {
      console.error('Error al eliminar propuesta:', error);
      throw error;
    }
  },

  // Obtener propuesta por ID
  async getPropuestaById(id: number): Promise<Propuesta | null> {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('id_propuesta', id)
      .single();
    
    if (error) {
      console.error('Error al obtener propuesta:', error);
      return null;
    }
    
    return data;
  },

  // Obtener propuestas por categoría
  async getPropuestasByCategoria(partidoId: string, categoria: string): Promise<Propuesta[]> {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('id_partido', partidoId)
      .eq('categoria', categoria);
    
    if (error) {
      console.error('Error al obtener propuestas por categoría:', error);
      throw error;
    }
    
    return data || [];
  }
};