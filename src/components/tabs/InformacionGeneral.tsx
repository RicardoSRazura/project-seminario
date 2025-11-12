"use client"
import { useInformacionGeneral } from "@/hooks/useInformacionGeneral";

interface InformacionGeneralProps {
    partidoId?: number;
    candidatoId?: number;
}

export default function InformacionGeneral({partidoId, candidatoId}: InformacionGeneralProps) {
    const {
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
    } = useInformacionGeneral({
        partidoId,
        candidatoId,
        onSuccess: () => {
            // Función que se ejecuta después de guardar exitosamente
            alert('Información guardada exitosamente');
        }
    });

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-8">Información General</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {loading && !initialDataLoaded ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Cargando información...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="historia" className="block text-sm font-medium text-gray-700">Historia:</label>
                        <textarea 
                            id="historia"
                            value={historia}
                            onChange={handleHistoriaChange}
                            className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Escriba la historia del partido/candidato..."
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="block text-sm font-medium text-gray-700 mr-2">Objetivos:</label>
                            <button 
                                type="button"
                                onClick={agregarObjetivo}
                                className="p-1 rounded-full hover:bg-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        
                        <input 
                            type="text"
                            value={nuevoObjetivo}
                            onChange={(e) => setNuevoObjetivo(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Agregar nuevo objetivo..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    agregarObjetivo();
                                }
                            }}
                        />
                        
                        <div className="space-y-2 mt-2">
                            {objetivos.map((objetivo, index) => (
                                <div key={index} className="p-2 border rounded flex justify-between items-center">
                                    <span>{objetivo}</span>
                                    <button 
                                        type="button"
                                        onClick={() => eliminarObjetivo(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-8">
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Guardando...' : 'Guardar Información'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}