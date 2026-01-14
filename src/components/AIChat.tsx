import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, ExternalLink, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithConcierge } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Executive Concierge active. I provide definitive intelligence on market movements, retail technicals, and silhouette directives. State your query." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithConcierge(history, input);
    
    const botMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response.text,
      sources: response.sources
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 pb-20">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center mr-2 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white rounded-tr-none font-medium' 
                  : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
              }`}
            >
              {msg.text}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                  {msg.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded-md flex items-center gap-1 transition-colors border border-white/5"
                    >
                      <ExternalLink size={10} />
                      {source.title || 'Source'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center mr-2">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-700 flex items-center">
                <Loader2 size={16} className="animate-spin text-violet-400 mr-2" />
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Accessing Market Nodes...</span>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-violet-500 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Request market analysis or sizing directive..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-zinc-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="ml-2 p-2 bg-violet-600 rounded-full text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;