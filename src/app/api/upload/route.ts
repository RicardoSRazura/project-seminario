import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    
    // Obtener el archivo del FormData
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Obtener metadatos adicionales
    const tipoEntidad = formData.get('tipoEntidad') as 'partido' | 'candidato';
    const entidadId = formData.get('entidadId') as string;
    const campoImagen = formData.get('campoImagen') as 'logo' | 'imagen_url';
    const folder = (formData.get('folder') as string) || 'general';

    // Validar datos obligatorios
    if (!tipoEntidad || !entidadId || !campoImagen) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (tipoEntidad, entidadId, campoImagen)' },
        { status: 400 }
      );
    }

    // Validar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Validar el tamaño del archivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo no debe superar los 5MB' },
        { status: 400 }
      );
    }

    // Generar un nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExt}`;

    // Convertir el archivo a ArrayBuffer para subirlo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Subir el archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Error al subir la imagen: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Obtener la URL pública
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    // Actualizar el campo correspondiente en la base de datos
    try {
      let updateResult;
      
      if (tipoEntidad === 'partido') {
        const { data, error } = await supabase
          .from('partidos')
          .update({ [campoImagen]: urlData.publicUrl })
          .eq('id_partido', entidadId)
          .select()
          .single();
          
        if (error) throw error;
        updateResult = data;
      } else if (tipoEntidad === 'candidato') {
        const { data, error } = await supabase
          .from('candidatos')
          .update({ [campoImagen]: urlData.publicUrl })
          .eq('id_candidato', entidadId)
          .select()
          .single();
          
        if (error) throw error;
        updateResult = data;
      }

      return NextResponse.json({
        url: urlData.publicUrl,
        path: fileName,
        message: `${campoImagen === 'logo' ? 'Logo' : 'Imagen'} actualizado correctamente`,
        entidad: updateResult
      });
    } catch (dbError: any) {
      console.error('Error al actualizar la base de datos:', dbError);
      
      // Si falla la actualización en la BD, eliminamos la imagen subida para mantener consistencia
      await supabase.storage.from('images').remove([fileName]);
      
      return NextResponse.json(
        { error: `Error al actualizar la base de datos: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error en la ruta de subida:', error);
    return NextResponse.json(
      { error: `Error en el servidor: ${error.message}` },
      { status: 500 }
    );
  }
}

// Para manejar solicitudes de opciones (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}