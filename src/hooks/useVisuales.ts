import { useState } from 'react';
import { createClient } from '../../utils/supabase/client';

export default function useVisuales() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  /**
   * Obtiene la URL pública de una imagen almacenada en el bucket de Supabase
   * @param path Ruta del archivo en el bucket
   * @returns URL pública de la imagen
   */
  const getPublicUrl = (path: string): string => {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  /**
   * Elimina una imagen del bucket 'images' de Supabase
   * @param filePath Ruta del archivo a eliminar
   */
  const deleteImage = async (filePath: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la imagen');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene todas las imágenes de una carpeta específica
   * @param folder Carpeta de la cual obtener imágenes
   * @returns Lista de objetos con las imágenes y sus URLs
   */
  const getImagesByFolder = async (folder: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: listError } = await supabase.storage
        .from('images')
        .list(folder);

      if (listError) {
        throw new Error(listError.message);
      }

      // Obtener las URLs públicas de cada imagen
      const imagesList = data.map(item => {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`${folder}/${item.name}`);
        
        return {
          name: item.name,
          path: `${folder}/${item.name}`,
          url: urlData.publicUrl,
          size: item.metadata?.size,
          created_at: item.created_at,
        };
      });

      return imagesList;
    } catch (err: any) {
      setError(err.message || 'Error al obtener las imágenes');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPublicUrl,
    deleteImage,
    getImagesByFolder,
    isLoading,
    error
  };
}