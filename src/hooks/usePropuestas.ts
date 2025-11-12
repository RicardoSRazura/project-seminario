// src/hooks/usePropuestas.ts
import { useState, useEffect } from 'react';
import { propuestasService } from '@/lib/services/propuestas';
import { Propuesta } from '@/types';

export const usePropuestas = (partidoId?: string, candidatoId?: string) => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar propuestas iniciales (opcional)
  useEffect(() => {
    if (partidoId) {
      loadPropuestasByPartido(partidoId);
    } else if (candidatoId) {
      loadPropuestasByCandidato(candidatoId);
    }
  }, [partidoId, candidatoId]);

  // Cargar propuestas por partido
  const loadPropuestasByPartido = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propuestasService.getPropuestasByPartido(id);
      setPropuestas(data);
    } catch (err) {
      setError('Error al cargar las propuestas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar propuestas por candidato
  const loadPropuestasByCandidato = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propuestasService.getPropuestasByCandidato(id);
      setPropuestas(data);
    } catch (err) {
      setError('Error al cargar las propuestas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva propuesta
  const createPropuesta = async (nuevaPropuesta: Omit<Propuesta, 'id_propuesta'>) => {
    setLoading(true);
    setError(null);
    try {
      const propuestaCreada = await propuestasService.createPropuesta(nuevaPropuesta);
      setPropuestas(prevPropuestas => [...prevPropuestas, propuestaCreada]);
      return propuestaCreada;
    } catch (err) {
      setError('Error al crear la propuesta');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar propuesta
  const updatePropuesta = async (id: number, datosActualizados: Partial<Propuesta>) => {
    setLoading(true);
    setError(null);
    try {
      const propuestaActualizada = await propuestasService.updatePropuesta(id, datosActualizados);
      setPropuestas(prevPropuestas => 
        prevPropuestas.map(p => p.id_propuesta === id ? propuestaActualizada : p)
      );
      return propuestaActualizada;
    } catch (err) {
      setError('Error al actualizar la propuesta');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar propuesta
  const deletePropuesta = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await propuestasService.deletePropuesta(id);
      setPropuestas(prevPropuestas => prevPropuestas.filter(p => p.id_propuesta !== id));
    } catch (err) {
      setError('Error al eliminar la propuesta');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    propuestas,
    loading,
    error,
    loadPropuestasByPartido,
    loadPropuestasByCandidato,
    createPropuesta,
    updatePropuesta,
    deletePropuesta
  };
};