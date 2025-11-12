// src/hooks/usePresupuesto.ts
import { useState } from 'react';
import { presupuestosService } from '@/lib/services/presupuestos';
import { Presupuesto } from '@/types';
import { useRouter } from 'next/navigation';

interface UsePresupuestoProps {
  partidoId?: number;
  candidatoId?: number;
  onSuccess?: () => void;
}

export const usePresupuesto = ({ partidoId, candidatoId, onSuccess }: UsePresupuestoProps = {}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cantidad: '',
    descripcion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cantidad || isNaN(Number(formData.cantidad))) {
      setError('La cantidad debe ser un número válido');
      return false;
    }

    if (!formData.descripcion) {
      setError('La descripción es requerida');
      return false;
    }

    if (!partidoId && !candidatoId) {
      setError('Se requiere ID de partido o candidato');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      cantidad: '',
      descripcion: ''
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Crear el objeto de presupuesto
      const presupuestoData: Omit<Presupuesto, 'id_presupuesto'> = {
        cantidad: Number(formData.cantidad),
        descripcion: formData.descripcion,
        fecha: new Date(),
        id_partido: partidoId || 0,
      };
      
      // Si hay candidatoId, agregarlo al objeto
      if (candidatoId) {
        presupuestoData.id_candidato = candidatoId;
      }

      // Guardar en la base de datos
      await presupuestosService.createPresupuesto(presupuestoData);
      
      // Resetear el formulario después de guardar
      resetForm();
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      // Opcional: refrescar los datos
      router.refresh();
      
    } catch (err) {
      console.error('Error al guardar presupuesto:', err);
      setError('Ocurrió un error al guardar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    resetForm
  };
};