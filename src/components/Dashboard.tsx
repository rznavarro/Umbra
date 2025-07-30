import React from 'react';

interface DashboardProps {
  onStartConsultation: () => void;
}

export function Dashboard({ onStartConsultation }: DashboardProps) {
  return (
    <div className="p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">PANEL DE CONTROL</h1>
          <p className="text-gray-400">Sistema de Análisis Legal</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">INICIAR ANÁLISIS LEGAL</h2>
          <p className="text-gray-400 mb-6">
            Proporcione los datos de la propiedad para obtener un análisis legal completo.
          </p>
          <button
            onClick={onStartConsultation}
            className="bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors"
          >
            &gt; INICIAR ANÁLISIS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h3 className="text-white font-bold mb-2">COMPRAVENTA</h3>
            <p className="text-gray-400 text-sm">Contratos y títulos de propiedad</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h3 className="text-white font-bold mb-2">ARRENDAMIENTO</h3>
            <p className="text-gray-400 text-sm">Contratos de alquiler</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h3 className="text-white font-bold mb-2">FINANCIAMIENTO</h3>
            <p className="text-gray-400 text-sm">Hipotecas y créditos</p>
          </div>
        </div>
      </div>
    </div>
  );
}