"use client"
import { usePresupuesto } from "@/hooks/usePresupuestos";

interface PresupuestoProps {
    partidoId?: number;
    candidatoId?: number;
}

export default function Presupuestos({partidoId, candidatoId}: PresupuestoProps) {
    const {
        formData,
        loading,
        error,
        handleChange,
        handleSubmit
    } = usePresupuesto({
        partidoId,
        candidatoId,
        onSuccess: () => {
            alert('Presupesto guardado exitosamente');
        }
    });

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-8">Presupuesto</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad:</label>
                    <input
                        id="cantidad"
                        name="cantidad" 
                        type="text" 
                        value={formData.cantidad}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese la cantidad"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción del presupuesto:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese la descripcion del presupuesto"
                    />
                </div>
                
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}