import React from 'react';

type ActiveSection = 'dashboard' | 'consultation' | 'results' | 'history';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'INICIO' },
    { id: 'consultation' as const, label: 'ANÁLISIS LEGAL' },
    { id: 'results' as const, label: 'INFORMES' },
    { id: 'history' as const, label: 'SALIR' },
  ];

  const handleSectionChange = (section: ActiveSection) => {
    if (section === 'history') {
      if (confirm('¿Confirmar salida?')) {
        window.location.reload();
      }
      return;
    }
    onSectionChange(section);
  };

  return (
    <aside className="w-64 bg-black border-r border-gray-800 font-mono">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">UMBRA</h1>
        <p className="text-gray-500 text-xs">Sistema Legal</p>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const isLogout = item.id === 'history';
          
          return (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full text-left p-3 mb-2 transition-colors ${
                isActive 
                  ? 'bg-white text-black' 
                  : isLogout
                  ? 'text-red-400 hover:text-red-300 hover:bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
        <p>Acceso: Clave Personal</p>
        <p>v2.1.0</p>
      </div>
    </aside>
  );
}