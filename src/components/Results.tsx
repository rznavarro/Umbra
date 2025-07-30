import React from 'react';

interface ResultsProps {
  data: any;
}

export function Results({ data }: ResultsProps) {
  if (!data) {
    return (
      <div className="p-8 font-mono">
        <p className="text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-8 font-mono bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">INFORME LEGAL</h1>
          <p className="text-gray-400">Análisis completo de la propiedad</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">INFORMACIÓN DEL CASO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Dirección</p>
              <p className="text-white font-medium">{data.direccion || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tipo de Propiedad</p>
              <p className="text-white font-medium">{data.tipoPropiedad || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Superficie</p>
              <p className="text-white font-medium">{data.superficie ? `${data.superficie} m²` : 'No especificada'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Operación</p>
              <p className="text-white font-medium">{data.tipoOperacion || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Precio/Valor</p>
              <p className="text-white font-medium">{data.precio || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Vendedor/Propietario</p>
              <p className="text-white font-medium">{data.vendedor || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Correo Electrónico</p>
              <p className="text-white font-medium">{data.correo || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">País</p>
              <p className="text-white font-medium">{data.pais || 'No especificado'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">ANÁLISIS LEGAL</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold mb-2">Leyes Aplicables</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Código Civil Colombiano - Artículos 1849-1896</li>
                <li>• Ley 820 de 2003 - Arrendamiento urbano</li>
                <li>• Ley 675 de 2001 - Propiedad horizontal</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Documentación Requerida</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Certificado de libertad y tradición</li>
                <li>• Certificado de paz y salvo</li>
                <li>• Certificado de avalúo comercial</li>
                <li>• {data.tipoOperacion === 'Venta' ? 'Escritura pública' : 'Contrato de arrendamiento'}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Recomendaciones</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Realizar due diligence completo</li>
                <li>• Verificar antecedentes de las partes</li>
                <li>• Solicitar certificados actualizados</li>
                <li>• Revisar cláusulas contractuales</li>
              </ul>
            </div>
          </div>
        </div>

        {data.notas && (
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">NOTAS ADICIONALES</h2>
            <p className="text-gray-300">{data.notas}</p>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>UMBRA Legal Analysis System - {new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}