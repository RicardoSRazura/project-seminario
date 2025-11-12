"use client"
import React, { useState } from 'react';
import { usePropuestas } from '@/hooks/usePropuestas';
import { Propuesta } from '@/types';

interface PropuestasProps {
    partidoId?: string;  // Cambiado a string para UUID
    candidatoId?: string; // Cambiado a string para UUID
}

export default function Propuestas({partidoId, candidatoId}: PropuestasProps) {
   const [descripcion, setDescripcion] = useState("");
   const [categoria, setCategoria] = useState("");
   const [presupuestoNecesario, setPresupuestoNecesario] = useState("");

    // Utilizamos el hook de usePropuestas
    const {
        propuestas,
        loading, 
        error,
        createPropuesta,
        deletePropuesta,
    } = usePropuestas(partidoId, candidatoId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(descripcion.trim() && categoria.trim()) {
            try {
                // Verificamos que al menos uno de los IDs exista
                if (!partidoId && !candidatoId) {
                    throw new Error("Se requiere un ID de partido o candidato");
                }

                // Creamos la nueva propuesta usando el servicio
                const nuevaPropuesta: Omit<Propuesta, 'id_propuesta'> = {
                    id_partido: partidoId || null,  // Aseguramos que es string
                    id_candidato: candidatoId || null, // Aseguramos que es string
                    descripcion: descripcion,
                    categoria: categoria,
                    presupuesto_necesario: presupuestoNecesario ? parseFloat(presupuestoNecesario) : 0
                };

                await createPropuesta(nuevaPropuesta);

                // Limpiamos el formulario
                setDescripcion("");
                setCategoria("");
                setPresupuestoNecesario("");
            } catch (err) {
                console.error("Error al guardar la propuesta:", err);
            }
        }
    };
    
    const handleDelete = async (id: number) => {
        try {
            await deletePropuesta(id);
        } catch (err) {
            console.error("Error al eliminar la propuesta:", err);
            // Aquí puede ir la lógica para mostrar una notificación
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-8">Propuestas</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Propuesta:</label>
                    <textarea 
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describa su propuesta..."
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Categoría:</label>
                    <input 
                        type="text"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Educación, Salud, Infraestructura..."
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Presupuesto necesario:</label>
                    <input 
                        type="number"
                        value={presupuestoNecesario}
                        onChange={(e) => setPresupuestoNecesario(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Cantidad estimada para implementar la propuesta"
                    />
                </div>
                
                <div className="flex justify-end mt-4">
                    <button 
                        type="submit"
                        
                        className={`px-4 py-2 ${loading || (!partidoId && !candidatoId) ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition`}
                    >
                        {loading ? 'Guardando...' : 'Guardar Propuesta'}
                    </button>
                </div>
            </form>
            
            {propuestas.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-lg font-medium mb-4">Propuestas guardadas:</h3>
                    <div className="space-y-4">
                        {propuestas.map((item) => (
                            <div key={item.id_propuesta} className="p-4 border rounded-lg bg-gray-50">
                                <div className="flex justify-between">
                                    <h4 className="font-medium">{item.categoria}</h4>
                                    <button 
                                        onClick={() => handleDelete(item.id_propuesta)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-700">{item.descripcion}</p>
                                {item.presupuesto_necesario > 0 && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Presupuesto: {item.presupuesto_necesario}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}