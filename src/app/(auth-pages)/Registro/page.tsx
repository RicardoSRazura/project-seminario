'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import InputComponent from '@/components/InputComponent';
import PrincipleButton from '@/components/PrincipleButton';

export default function RegistrationForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    rol: 'candidato', // Default role
    cargo_buscado: '',
    id_partido: null as number | null,
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Special handling for id_partido field to convert to number or null
      if (name === 'id_partido') {
        return { ...prev, [name]: value === '' ? null : parseInt(value, 10) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Preview the logo
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate fields
      if (!formData.email || !formData.password || !formData.nombre) {
        throw new Error('Por favor complete todos los campos obligatorios');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Register user based on role
      let result;
      if (formData.rol === 'partido') {
        result = await register({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          rol: 'partido',
          logo: logoFile
        });
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          cargo_buscado: formData.cargo_buscado,
          id_partido: formData.id_partido,
          rol: 'candidato',
          imagen: logoFile
        });
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      // Redirect to login
      router.push('/login?registered=true');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error desconocido durante el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <InputComponent
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Correo electrónico"
              className="text-gray-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <InputComponent
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña"
              className="text-gray-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <InputComponent
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirmar contraseña"
              className="text-gray-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="candidato">Candidato</option>
              <option value="partido">Partido Político</option>
            </select>
          </div>

          {formData.rol === 'partido' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Partido</label>
              <InputComponent
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del partido"
                className="text-gray-500"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <InputComponent
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="text-gray-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <InputComponent
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo al que aspira</label>
                <InputComponent
                  name="cargo_buscado"
                  value={formData.cargo_buscado}
                  onChange={handleInputChange}
                  placeholder="Cargo al que aspira"
                  className="text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Partido (opcional)</label>
                <InputComponent
                  name="id_partido"
                  type="number"
                  value={formData.id_partido?.toString() || ''}
                  onChange={handleInputChange}
                  placeholder="ID del partido político"
                  className="text-gray-500"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.rol === 'partido' ? 'Logo del partido' : 'Foto de perfil'}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition"
              >
                Seleccionar archivo
              </label>
              
              {logoUrl && (
                <div className="w-16 h-16 relative">
                  <img
                    src={logoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <PrincipleButton
            title={loading ? 'Registrando...' : 'Registrarse'}
            className="w-full mt-6"
            disabled={loading}
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}