"use client"

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Visuales({ 
  entidadId, 
  tipoEntidad,  // 'partido' o 'candidato'
  campoImagen,  // 'logo' o 'imagen_url'
  imagenActual  // URL de la imagen actual si existe
}: { 
  entidadId: string;
  tipoEntidad: 'partido' | 'candidato';
  campoImagen: 'logo' | 'imagen_url';
  imagenActual?: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(imagenActual || null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    // Manejar la selección de archivo
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (!file) return;

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('La imagen no debe superar los 5MB.');
            return;
        }

        setErrorMessage(null);
        setSelectedImage(file);
        
        // Crear una URL para previsualizar la imagen
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSuccessMessage(null);
    };

    // Manejar la acción de arrastrar y soltar
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        
        const file = event.dataTransfer.files?.[0];
        
        if (!file) return;

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Por favor arrastra un archivo de imagen válido.');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('La imagen no debe superar los 5MB.');
            return;
        }

        setErrorMessage(null);
        setSelectedImage(file);
        
        // Crear una URL para previsualizar la imagen
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSuccessMessage(null);
    };

    // Abrir el selector de archivos cuando se hace clic en el área de arrastrar y soltar
    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    // Manejar la subida de la imagen
    const handleUpload = async () => {
        if (!selectedImage) {
            setErrorMessage('Por favor selecciona una imagen primero.');
            return;
        }

        try {
            setIsUploading(true);
            setErrorMessage(null);
            setSuccessMessage(null);
            
            // Crear FormData para enviar la imagen
            const formData = new FormData();
            formData.append('file', selectedImage);
            formData.append('tipoEntidad', tipoEntidad);
            formData.append('entidadId', entidadId);
            formData.append('campoImagen', campoImagen);
            
            // Determinar la carpeta según el tipo de entidad y campo
            const folder = tipoEntidad === 'partido' 
                ? (campoImagen === 'logo' ? 'logos_partidos' : 'imagenes_partidos')
                : (campoImagen === 'logo' ? 'logos_candidatos' : 'imagenes_candidatos');
            formData.append('folder', folder);
            
            // Enviar la imagen al endpoint
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al subir la imagen');
            }
            
            const data = await response.json();
            
            setSuccessMessage('Imagen subida correctamente');
            // Mantener la previsualización con la nueva imagen subida
            setPreviewUrl(data.url);
            setSelectedImage(null);
            
            // Refrescar la página para mostrar la imagen actualizada
            setTimeout(() => {
                router.refresh();
            }, 1500);
            
        } catch (error: any) {
            console.error('Error al subir la imagen:', error);
            setErrorMessage(error.message || 'Ocurrió un error al subir la imagen. Por favor intenta de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-8">
                {campoImagen === 'logo' ? 'Logo' : 'Imagen'} de {tipoEntidad === 'partido' ? 'Partido' : 'Candidato'}
            </h2>
            
            <div className="mt-8">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                
                <div 
                    className={`border-2 border-dashed rounded-lg p-6 ${
                        previewUrl ? 'border-blue-300' : 'border-gray-300'
                    } flex flex-col items-center justify-center cursor-pointer`}
                    onClick={handleAreaClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {previewUrl ? (
                        <div className="relative w-full max-w-md h-64">
                            <Image
                                src={previewUrl}
                                alt="Vista previa"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <p className="text-sm text-center text-gray-400">Arrastre una imagen aquí o haga clic</p>
                        </>
                    )}
                </div>
                
                {errorMessage && (
                    <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
                )}
                
                {successMessage && (
                    <p className="mt-2 text-sm text-green-500">{successMessage}</p>
                )}
                
                <div className="flex justify-end mt-4">
                    <button 
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                            isUploading || !selectedImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleUpload}
                        disabled={isUploading || !selectedImage}
                    >
                        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                    </button>
                </div>
            </div>
        </div>
    );
}