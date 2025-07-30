import React from 'react';

export function History() {
  const consultations = [
    {
      id: 'UMB-001',
      type: 'COMPRAVENTA',
      property: 'Apartamento - Chapinero',
      date: '2025-01-15',
      status: 'COMPLETADO',
      value: '$180,000,000'
    },
    {
      id: 'UMB-002',
      type: 'ARRENDAMIENTO',
      property: 'Local - Zona T',
      date: '2025-01-14',
      status: 'EN REVISIÓN',
      value: '$2,500,000/mes'
    },
    {
      id: 'UMB-003',
      type: 'DUE DILIGENCE',
      property: 'Terreno - Puente Alto',
      date: '2025-01-12',
      status: 'COMPLETADO',
      value: '$450,000,000'
    }
  ];

  return (
    <div className="p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">REGISTRO DE ANÁLISIS</h1>
          <p className="text-gray-400">Historial de consultas legales</p>
        </div>

        <div className="bg-gray-900 border border-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">ID</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">TIPO</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">PROPIEDAD</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">FECHA</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">ESTADO</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="border-b border-gray-800">
                  <td className="py-4 px-6 text-white">{consultation.id}</td>
                  <td className="py-4 px-6 text-white">{consultation.type}</td>
                  <td className="py-4 px-6 text-gray-300">{consultation.property}</td>
                  <td className="py-4 px-6 text-gray-300">{consultation.date}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold ${
                      consultation.status === 'COMPLETADO' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white font-bold">{consultation.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}