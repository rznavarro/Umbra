import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AILegalAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hola, soy tu asistente legal de UMBRA. Estoy aquí para ayudarte con consultas legales inmobiliarias las 24 horas del día. ¿En qué puedo asistirte?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respuestas específicas para temas legales inmobiliarios
    if (lowerMessage.includes('contrato') || lowerMessage.includes('compraventa')) {
      return 'Para contratos de compraventa inmobiliaria, es fundamental verificar: 1) Certificado de libertad y tradición actualizado, 2) Paz y salvo de impuestos, 3) Avalúo comercial vigente, 4) Verificación de linderos. ¿Necesitas información específica sobre alguno de estos documentos?';
    }
    
    if (lowerMessage.includes('arriendo') || lowerMessage.includes('alquiler')) {
      return 'En contratos de arrendamiento, según la Ley 820 de 2003, debes considerar: 1) Duración mínima de 1 año, 2) Incrementos anuales según IPC, 3) Cláusulas de terminación, 4) Garantías permitidas. ¿Tienes alguna situación específica de arrendamiento?';
    }
    
    if (lowerMessage.includes('escritura') || lowerMessage.includes('notaria')) {
      return 'Para escrituras públicas inmobiliarias necesitas: 1) Minuta del contrato, 2) Certificados actualizados, 3) Avalúo catastral, 4) Paz y salvos al día. El proceso toma aproximadamente 15-30 días. ¿Estás en proceso de escrituración?';
    }
    
    if (lowerMessage.includes('hipoteca') || lowerMessage.includes('credito')) {
      return 'Para créditos hipotecarios considera: 1) Capacidad de pago (30% máximo de ingresos), 2) Avalúo bancario, 3) Seguros obligatorios, 4) Gastos notariales y registro. ¿Necesitas calcular tu capacidad de endeudamiento?';
    }
    
    if (lowerMessage.includes('impuesto') || lowerMessage.includes('predial')) {
      return 'Los impuestos inmobiliarios incluyen: 1) Predial anual, 2) Impuesto de registro (1% del valor), 3) IVA en propiedades nuevas (19%), 4) Beneficio de vivienda VIS/VIP. ¿Qué tipo de impuesto necesitas calcular?';
    }
    
    if (lowerMessage.includes('propiedad horizontal') || lowerMessage.includes('condominio')) {
      return 'En propiedad horizontal (Ley 675/2001): 1) Reglamento de copropiedad, 2) Administración obligatoria, 3) Cuotas de administración, 4) Asambleas de copropietarios. ¿Tienes consultas sobre administración o conflictos?';
    }
    
    if (lowerMessage.includes('embargo') || lowerMessage.includes('judicial')) {
      return 'Para procesos judiciales inmobiliarios: 1) Verificar medidas cautelares, 2) Revisar procesos ejecutivos, 3) Consultar RUNT judicial, 4) Analizar cargas y gravámenes. ¿La propiedad tiene algún proceso judicial?';
    }
    
    if (lowerMessage.includes('avaluo') || lowerMessage.includes('valor')) {
      return 'Los avalúos inmobiliarios pueden ser: 1) Comercial (transacciones), 2) Catastral (impuestos), 3) Bancario (créditos), 4) Judicial (procesos). Cada uno tiene metodología específica. ¿Para qué propósito necesitas el avalúo?';
    }
    
    // Respuesta general
    return 'Entiendo tu consulta legal. Como asistente especializado en derecho inmobiliario, puedo ayudarte con temas como: contratos de compraventa, arrendamientos, escrituras públicas, hipotecas, impuestos prediales, propiedad horizontal, procesos judiciales y avalúos. ¿Podrías ser más específico sobre tu situación?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-8 font-mono h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">IA AGENTE LEGAL</h1>
          <p className="text-gray-400">Asistente legal especializado disponible 24/7</p>
          <div className="mt-4 text-green-400 text-sm flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            <span className="animate-pulse">●</span> Agente legal activo
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-gray-900 border border-gray-800 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-white border border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="w-4 h-4 mt-1 text-green-400" />}
                    {message.type === 'user' && <User className="w-4 h-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-green-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta legal aquí..."
                className="flex-1 bg-black border border-gray-700 text-white p-3 focus:border-white focus:outline-none font-mono text-sm resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`px-4 py-2 font-bold transition-colors ${
                  !inputMessage.trim() || isTyping
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-white font-bold mb-3">CONSULTAS FRECUENTES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Proceso de compraventa inmobiliaria',
              'Contratos de arrendamiento',
              'Escrituras públicas y notarización',
              'Créditos hipotecarios',
              'Impuestos prediales',
              'Propiedad horizontal'
            ].map((topic, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(topic)}
                className="text-left p-3 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>UMBRA IA Legal Agent - Respuestas basadas en legislación colombiana</p>
          <p className="mt-1">Para casos complejos, consulta con un abogado especializado</p>
        </div>
      </div>
    </div>
  );
}