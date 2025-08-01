import React, { useState } from 'react';

interface ConsultationData {
  direccion: string;
  tipoPropiedad: string;
  superficie: string;
  tipoOperacion: string;
  precio: string;
  vendedor: string;
  comprador: string;
  correo: string;
  pais: string;
  notas: string;
}

// Ya no necesitamos la prop onSubmit
export function ConsultationForm() {
  const [formData, setFormData] = useState<ConsultationData>({
    direccion: '',
    tipoPropiedad: '',
    superficie: '',
    tipoOperacion: '',
    precio: '',
    vendedor: '',
    comprador: '',
    correo: '',
    pais: '',
    notas: ''
  });

  // NUEVOS ESTADOS para manejar la respuesta de IA
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  const tiposPropiedad = [
    'Apartamento',
    'Casa',
    'Local Comercial',
    'Oficina',
    'Terreno',
    'Bodega',
    'Otro'
  ];

  const tiposOperacion = [
    'Compraventa',
    'Arrendamiento',
    'Hipoteca',
    'Due Diligence',
    'Consulta Legal'
  ];

  const paises = [
    'Colombia',
    'Chile',
    'Argentina',
    'México',
    'Perú',
    'Ecuador',
    'Venezuela',
    'Uruguay',
    'Paraguay',
    'Bolivia',
    'España',
    'Estados Unidos',
    'Otro'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.direccion || !formData.tipoPropiedad || !formData.correo || !formData.pais) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      alert('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Enviar datos al webhook de n8n
    sendToWebhook(formData);
  };

  // FUNCIÓN ACTUALIZADA para recibir respuesta de IA
  const sendToWebhook = async (data: ConsultationData) => {
    setIsSubmitting(true); // Activar loading state

    // URL del webhook - verificar que esté correcta
    const webhookUrl = 'https://n8n.srv880021.hstgr.cloud/webhook-test/Legal-Inmo';
    console.log('🔗 Conectando al webhook:', webhookUrl);

    try {
      // Preparar datos para n8n
      const webhookData = {
        direccion: data.direccion,
        tipoPropiedad: data.tipoPropiedad,
        superficie: data.superficie,
        tipoOperacion: data.tipoOperacion,
        precio: data.precio,
        vendedor: data.vendedor,
        comprador: data.comprador,
        correo: data.correo,
        pais: data.pais,
        notas: data.notas,
        sistema: 'UMBRA Legal Analysis v1.0'
      };

      console.log('📤 Enviando datos:', webhookData);
      console.log('📤 Datos JSON:', JSON.stringify(webhookData, null, 2));

      // Realizar petición con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'UMBRA-Legal-System/1.0'
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 Status de respuesta:', response.status);
      console.log('📥 Headers de respuesta:', Object.fromEntries(response.headers.entries()));
      console.log('📥 Response OK:', response.ok);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('📥 Content-Type:', contentType);

        try {
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            console.log('📥 Respuesta JSON:', result);
            
            // Buscar el informe en diferentes ubicaciones posibles
            const aiReportContent = result.output || 
                                   result.message || 
                                   result.data || 
                                   result.response ||
                                   result.informe ||
                                   result.analisis ||
                                   JSON.stringify(result, null, 2);

            setAiReport(aiReportContent);
            setSubmitSuccess(true);
          } else {
            // Si no es JSON, tratar como texto
            const textResult = await response.text();
            console.log('📥 Respuesta texto:', textResult);
            setAiReport(textResult);
            setSubmitSuccess(true);
          }
        } catch (parseError) {
          console.error('❌ Error parseando respuesta:', parseError);
          // Fallback: obtener como texto
          const textResult = await response.text();
          console.log('📥 Fallback texto:', textResult);
          setAiReport(textResult || 'Análisis completado - Respuesta recibida del servidor');
          setSubmitSuccess(true);
        }
      } else {
        // Error del servidor
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('❌ Error JSON:', errorData);
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          const errorText = await response.text();
          console.error('❌ Error texto:', errorText);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error completo:', error);
      
      if (error.name === 'AbortError') {
        alert('⏱️ Timeout: El servidor tardó demasiado en responder. Intenta nuevamente.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('🌐 Error de conexión: No se pudo conectar con el servidor n8n. Verifica:\n\n1. Tu conexión a internet\n2. Que el webhook esté activo en n8n\n3. Que la URL sea correcta');
      } else if (error.message.includes('500')) {
        alert('⚙️ Error del workflow n8n (500):\n\nEl workflow no pudo iniciarse. Verifica:\n\n1. Que el webhook esté activado\n2. Que el workflow esté guardado\n3. Que no haya errores en los nodos\n4. Los logs de n8n para más detalles');
      } else if (error.message.includes('404')) {
        alert('🔍 Webhook no encontrado (404):\n\nLa URL del webhook no existe. Verifica:\n\n1. La URL esté correcta\n2. El webhook esté publicado\n3. El path sea exacto');
      } else {
        alert(`❌ Error al enviar análisis:\n\n${error.message}\n\nRevisa la consola del navegador para más detalles.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para probar la conexión al webhook
  const testWebhookConnection = async () => {
    console.log('🧪 Probando conexión al webhook...');
    
    try {
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/Legal-Inmo', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin
        }
      });
      
      console.log('🧪 Test OPTIONS - Status:', response.status);
      console.log('🧪 Test OPTIONS - Headers:', Object.fromEntries(response.headers.entries()));
      
    } catch (error) {
      console.error('🧪 Test falló:', error);
    }
  };

  // Probar conexión al cargar el componente
  React.useEffect(() => {
    testWebhookConnection();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.direccion || !formData.tipoPropiedad || !formData.correo || !formData.pais) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      alert('Por favor ingrese un correo electrónico válido');
      return;
    }

    console.log('🚀 Iniciando envío de análisis...');
    sendToWebhook(formData);
  };
          
          // Buscar el informe en diferentes posibles ubicaciones
          const aiReportContent = result.output || 
                                 result.message || 
                                 result.data || 
                                 result.response ||
                                 JSON.stringify(result, null, 2);

          // Guardar el informe de IA y mostrar pantalla de éxito
          setAiReport(aiReportContent);
          setSubmitSuccess(true);
        } catch (jsonError) {
          // Si no es JSON válido, usar como texto plano
          const textResult = await response.text();
          console.log('Respuesta de texto recibida:', textResult);
          setAiReport(textResult);
          setSubmitSuccess(true);
        }

        // Limpiar formulario después de envío exitoso
        setFormData({
          direccion: '',
          tipoPropiedad: '',
          superficie: '',
          tipoOperacion: '',
          precio: '',
          vendedor: '',
          comprador: '',
          correo: '',
          pais: '',
          notas: ''
        });
      } else {
        let errorMessage;
        try {
          const errorData = await response.json();
          console.error('Error JSON response:', errorData);
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          const errorText = await response.text();
          console.error('Error text response:', errorText);
          errorMessage = errorText;
        }
        
        throw new Error(`Error del servidor (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error enviando al webhook:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Error de conexión: No se pudo conectar con el servidor de n8n. Verifique su conexión a internet.');
      } else if (error.message.includes('500')) {
        alert('Error del workflow de n8n: El workflow no pudo iniciarse. Verifique que el webhook esté activo y configurado correctamente en n8n.');
      } else {
        alert(`Error al enviar el análisis: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false); // Desactivar loading state
    }
  };

  // Mostrar el informe de IA cuando esté listo
  if (submitSuccess && aiReport) {
    return (
      <div className="p-8 font-mono">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-400 mb-4">✓ INFORME LEGAL GENERADO</h1>
            <p className="text-gray-400">Análisis completado por IA especializada en derecho inmobiliario</p>
          </div>

          {/* Contenedor del informe */}
          <div className="bg-gray-900 border border-gray-800 p-6 mb-6 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
              ANÁLISIS LEGAL DETALLADO
            </h2>
            <div className="whitespace-pre-wrap text-gray-100 font-mono text-sm leading-relaxed">
              {aiReport}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setAiReport('');
              }}
              className="bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors"
            >
              REALIZAR NUEVO ANÁLISIS
            </button>
            
            <button
              onClick={() => window.print()}
              className="bg-gray-700 text-white px-6 py-3 font-bold hover:bg-gray-600 transition-colors border border-gray-600"
            >
              IMPRIMIR INFORME
            </button>
          </div>

          <div className="mt-6 text-center text-gray-500 text-xs">
            <p>UMBRA Legal Analysis System - Informe generado el {new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">ANÁLISIS LEGAL DE PROPIEDADES</h1>
          <p className="text-gray-400">Sistema de consulta legal - Umbra v1.0</p>
          <div className="mt-4 text-green-400 text-sm">
            <span className="animate-pulse">●</span> Sistema listo para análisis
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dirección */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Ingresar dirección exacta *
            </label>
            <p className="text-gray-400 text-sm mb-3">Ej: Av. Providencia 1234, Providencia, Santiago</p>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="Ingrese la dirección completa"
              required
            />
          </div>

          {/* Tipo de Propiedad */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Definir tipo de propiedad *
            </label>
            <p className="text-gray-400 text-sm mb-3">Seleccionar tipo de propiedad</p>
            <select
              name="tipoPropiedad"
              value={formData.tipoPropiedad}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              required
            >
              <option value="">Seleccione tipo de propiedad</option>
              {tiposPropiedad.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Superficie */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Ingresar superficie en m²
            </label>
            <p className="text-gray-400 text-sm mb-3">Ej: 150</p>
            <input
              type="number"
              name="superficie"
              value={formData.superficie}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="Superficie en metros cuadrados"
            />
          </div>

          {/* Tipo de Operación */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Especificar tipo de operación
            </label>
            <p className="text-gray-400 text-sm mb-3">Seleccionar operación</p>
            <select
              name="tipoOperacion"
              value={formData.tipoOperacion}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
            >
              <option value="">Seleccione tipo de operación</option>
              {tiposOperacion.map(operacion => (
                <option key={operacion} value={operacion}>{operacion}</option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Establecer precio o valor
            </label>
            <p className="text-gray-400 text-sm mb-3">Ej: $250,000,000 CLP</p>
            <input
              type="text"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="Precio o valor de la propiedad"
            />
          </div>

          {/* Vendedor */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Identificar vendedor o propietario
            </label>
            <p className="text-gray-400 text-sm mb-3">Nombre completo o razón social</p>
            <input
              type="text"
              name="vendedor"
              value={formData.vendedor}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="Nombre del vendedor o propietario"
            />
          </div>

          {/* Comprador */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Identificar comprador o cliente
            </label>
            <p className="text-gray-400 text-sm mb-3">Nombre completo o razón social</p>
            <input
              type="text"
              name="comprador"
              value={formData.comprador}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="Nombre del comprador o cliente"
            />
          </div>

          {/* Correo Electrónico */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Correo electrónico *
            </label>
            <p className="text-gray-400 text-sm mb-3">Para notificaciones y seguimiento</p>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          {/* País */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; País de la propiedad *
            </label>
            <p className="text-gray-400 text-sm mb-3">Determina la jurisdicción legal aplicable</p>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono"
              required
            >
              <option value="">Seleccione país</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>

          {/* Notas Adicionales */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <label className="block text-white font-bold mb-2">
              &gt; Agregar notas adicionales
            </label>
            <p className="text-gray-400 text-sm mb-3">Información adicional relevante para el análisis legal...</p>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono resize-none"
              placeholder="Información adicional, observaciones especiales, documentos disponibles, etc."
            />
          </div>

          {/* Botón de Envío */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 font-bold transition-colors ${
                isSubmitting 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isSubmitting ? 'PROCESANDO...' : 'ANALIZAR SITUACIÓN LEGAL'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>UMBRA Legal Analysis System - Todos los campos marcados con * son obligatorios</p>
        </div>
      </div>
    </div>
  );
}
