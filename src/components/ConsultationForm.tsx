import React, { useState } from 'react';

interface ConsultationFormProps {
  onSubmit: (data: any) => void;
}

export function ConsultationForm({ onSubmit }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    direccion: '',
    tipoPropiedad: '',
    superficie: '',
    tipoOperacion: '',
    precio: '',
    vendedor: '',
    comprador: '',
    notas: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiposPropiedad = [
    'Casa',
    'Apartamento',
    'Oficina',
    'Local Comercial',
    'Terreno',
    'Industrial',
    'Otro'
  ];

  const tiposOperacion = [
    'Venta',
    'Arriendo'
  ];

  const sendToWebhook = async (data: any) => {
    const webhookUrl = 'https://n8n.srv880021.hstgr.cloud/webhook-test/Legal-Inmo';
    
    const payload = {
      timestamp: new Date().toISOString(),
      source: 'UMBRA Legal System',
      data: {
        direccion: data.direccion,
        tipoPropiedad: data.tipoPropiedad,
        superficie: data.superficie,
        tipoOperacion: data.tipoOperacion,
        precio: data.precio,
        vendedor: data.vendedor,
        comprador: data.comprador,
        notas: data.notas
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Datos enviados exitosamente al webhook de n8n');
      } else {
        console.error('Error al enviar datos al webhook:', response.status);
      }
    } catch (error) {
      console.error('Error de conexión con el webhook:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar datos al webhook de n8n
      await sendToWebhook(formData);
      
      // Continuar con el flujo normal de la aplicación
      onSubmit(formData);
    } catch (error) {
      console.error('Error en el envío:', error);
      // Aún así continuar con el flujo normal
      onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">ANÁLISIS LEGAL DE PROPIEDADES</h2>
          <p className="text-gray-400 text-sm">Sistema de consulta legal - Umbra v1.0</p>
          <div className="mt-4 text-green-400 text-sm">
            <span className="animate-pulse">●</span> Sistema listo para análisis
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dirección Completa */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Ingresar dirección exacta
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Ej: Av. Providencia 1234, Providencia, Santiago"
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            />
          </div>

          {/* Tipo de Propiedad */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Definir tipo de propiedad
            </label>
            <select
              value={formData.tipoPropiedad}
              onChange={(e) => handleInputChange('tipoPropiedad', e.target.value)}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            >
              <option value="">Seleccionar tipo de propiedad</option>
              {tiposPropiedad.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Superficie */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Ingresar superficie en m²
            </label>
            <input
              type="number"
              value={formData.superficie}
              onChange={(e) => handleInputChange('superficie', e.target.value)}
              placeholder="Ej: 150"
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            />
          </div>

          {/* Tipo de Operación */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Especificar tipo de operación
            </label>
            <select
              value={formData.tipoOperacion}
              onChange={(e) => handleInputChange('tipoOperacion', e.target.value)}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            >
              <option value="">Seleccionar operación</option>
              {tiposOperacion.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Precio / Valor */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Establecer precio o valor
            </label>
            <input
              type="text"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              placeholder="Ej: $250,000,000 CLP"
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            />
          </div>

          {/* Vendedor o Propietario */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Identificar vendedor o propietario
            </label>
            <input
              type="text"
              value={formData.vendedor}
              onChange={(e) => handleInputChange('vendedor', e.target.value)}
              placeholder="Nombre completo o razón social"
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            />
          </div>

          {/* Comprador o Cliente */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Identificar comprador o cliente
            </label>
            <input
              type="text"
              value={formData.comprador}
              onChange={(e) => handleInputChange('comprador', e.target.value)}
              placeholder="Nombre completo o razón social"
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm"
              required
            />
          </div>

          {/* Notas Adicionales */}
          <div className="bg-black border border-gray-800 p-4">
            <label className="block text-green-400 text-sm font-bold mb-2">
              &gt; Agregar notas adicionales
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Información adicional relevante para el análisis legal..."
              rows={4}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-4 font-bold transition-colors font-mono text-sm border-2 ${
                isSubmitting 
                  ? 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200 border-white'
              }`}
            >
              {isSubmitting ? 'Enviando...' : '&gt; Analizar situación legal'}
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Umbra Legal Analysis System - Todos los datos son procesados de forma segura</p>
          <p className="mt-1">Datos enviados automáticamente a n8n para procesamiento</p>
        </div>
      </div>
    </div>
  );
}