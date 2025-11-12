// src/hooks/useInformacionGeneral.ts
import { useState, useEffect } from 'react';
import { historiasService } from '@/lib/services/historias';
import { objetivosService } from '@/lib/services/objetivos';
import { Historia, Objetivo } from '@/types';
import { useRouter } from 'next/navigation';

interface UseInformacionGeneralProps {
  partidoId?: number;
  candidatoId?: number;
  onSuccess?: () => void;
}

export const useInformacionGeneral = ({ partidoId, candidatoId, onSuccess }: UseInformacionGeneralProps = {}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historia, setHistoria] = useState<string>('');
  const [objetivos, setObjetivos] = useState<string[]>([]);
  const [nuevoObjetivo, setNuevoObjetivo] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      if (!partidoId && !candidatoId) return;
      
      try {
        setLoading(true);
        
        // Cargar historia
        let historiaData: Historia | null = null;
        
        if (candidatoId) {
          historiaData = await historiasService.getHistoriaByCandidato(candidatoId);
        } else if (partidoId) {
          historiaData = await historiasService.getHistoriaByPartido(partidoId);
        }
        
        if (historiaData) {
          setHistoria(historiaData.descripcion);
        }
        
        // Cargar objetivos
        let objetivosData: Objetivo[] = [];
        
        if (candidatoId) {
          objetivosData = await objetivosService.getObjetivosByCandidato(candidatoId);
        } else if (partidoId) {
          objetivosData = await objetivosService.getObjetivosByPartido(partidoId);
        }
        
        setObjetivos(objetivosData.map(obj => obj.descripcion));
        setInitialDataLoaded(true);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar la información. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [partidoId, candidatoId]);

  // Manejar cambio de la historia
  const handleHistoriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHistoria(e.target.value);
  };

  // Funciones para manejar objetivos
  const agregarObjetivo = () => {
    if (nuevoObjetivo.trim()) {
      setObjetivos([...objetivos, nuevoObjetivo.trim()]);
      setNuevoObjetivo('');
    }
  };

  const eliminarObjetivo = (index: number) => {
    setObjetivos(objetivos.filter((_, i) => i !== index));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!historia.trim()) {
      setError('La historia es requerida');
      return false;
    }

    if (!partidoId && !candidatoId) {
      setError('Se requiere ID de partido o candidato');
      return false;
    }

    return true;
  };

  // Guardar toda la información
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Guardar historia
      if (candidatoId && partidoId) {
        await historiasService.upsertHistoriaCandidato(candidatoId, partidoId, historia);
      } else if (partidoId) {
        await historiasService.upsertHistoriaPartido(partidoId, historia);
      }
      
      // Manejar objetivos
      // Primero eliminamos los objetivos existentes
      if (candidatoId) {
        await objetivosService.deleteObjetivosByCandidato(candidatoId);
      } else if (partidoId) {
        await objetivosService.deleteObjetivosByPartido(partidoId);
      }
      
      // Luego creamos los nuevos objetivos
      if (objetivos.length > 0) {
        const objetivosData = objetivos.map(descripcion => ({
          descripcion,
          ...(partidoId && { id_partido: partidoId }),
          ...(candidatoId && { id_candidato: candidatoId })
        }));
        
        await objetivosService.createManyObjetivos(objetivosData);
      }
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      // Opcional: refrescar los datos
      router.refresh();
      
    } catch (err) {
      console.error('Error al guardar información:', err);
      setError('Ocurrió un error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    historia,
    objetivos,
    nuevoObjetivo,
    initialDataLoaded,
    handleHistoriaChange,
    setNuevoObjetivo,
    agregarObjetivo,
    eliminarObjetivo,
    handleSubmit
  };
};