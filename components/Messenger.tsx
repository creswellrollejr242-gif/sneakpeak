
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, PortfolioItem, Sneaker } from '../types';
import { ArrowLeft, Send, Image as ImageIcon, ArrowRightLeft, Check, X } from 'lucide-react';
import TradeProposalModal from './TradeProposalModal';

interface MessengerProps {
  conversations: Conversation[];
  allSneakers: Sneaker[];
  userPortfolio: PortfolioItem[];
  onSendMessage: (chatId: string, text: string) => void;
  onSendTrade: (chatId: string, item: PortfolioItem) => void;
  onBack: () => void;
}

const Messenger: React.FC<MessengerProps> = ({ conversations, allSneakers, userPortfolio, onSendMessage, onSendTrade, onBack }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChatId) return;
    onSendMessage(activeChatId, inputText);
    setInputText('');
  };

  const handleTradeSelect = (item: PortfolioItem) => {
    if (activeChatId) {
      onSendTrade(activeChatId, item);
      setShowTradeModal(false);
    }
  };

  if (activeChatId && activeChat) {
    return (
      <div className="h-full flex flex-col bg-zinc-950 pb-20">
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50 backdrop-blur-md">
          <button onClick={() => setActiveChatId(null)} className="text-zinc-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <img src={activeChat.userAvatar} className="w-10 h-10 rounded-full border border-zinc-700" />
          <div>
            <h3 className="text-white font-bold">{activeChat.withUser}</h3>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat.messages.map(msg => {
            if (msg.type === 'trade_offer' && msg.tradeDetails) {
              const sneaker = allSneakers.find(s => s.id === msg.tradeDetails!.offeredItem.sneakerId);
              return (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-64 shadow-lg">
                    <div className="bg-violet-600/20 p-2 flex items-center gap-2 border-b border-violet-500/20">
                      <ArrowRightLeft size={16} className="text-violet-500" />
                      <span className="text-xs font-bold text-violet-400 uppercase">Trade Offer</span>
                    </div>
                    {sneaker && (
                      <div className="p-3">
                        <img src={sneaker.image} className="w-full h-32 object-cover rounded-lg mb-2" />
                        <p className="font-bold text-white text-sm">{sneaker.name}</p>
                        <p className="text-xs text-zinc-500">Size: {msg.tradeDetails.offeredItem.size} • Cond: {msg.tradeDetails.offeredItem.condition}</p>
                        
                        {msg.sender !== 'me' && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <button className="bg-zinc-800 text-zinc-400 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-700">Decline</button>
                            <button className="bg-emerald-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500">Accept</button>
                          </div>
                        )}
                        {msg.sender === 'me' && <p className="text-[10px] text-zinc-500 text-center mt-2 italic">Waiting for response...</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-violet-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
          <button 
            onClick={() => setShowTradeModal(true)}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full"
            title="Make Trade Offer"
          >
            <ArrowRightLeft size={20} />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..." 
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-violet-500"
          />
          <button onClick={handleSend} disabled={!inputText.trim()} className="text-violet-500 p-2 disabled:opacity-50">
            <Send size={20} />
          </button>
        </div>

        {showTradeModal && (
          <TradeProposalModal 
            portfolio={userPortfolio} 
            allSneakers={allSneakers} 
            onClose={() => setShowTradeModal(false)}
            onSelect={handleTradeSelect}
          />
        )}
      </div>
    );
  }

  // Inbox View
  return (
    <div className="h-full overflow-y-auto pb-24 bg-zinc-950">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-3 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black italic tracking-tighter text-white">INBOX</h1>
      </div>

      <div className="divide-y divide-zinc-800">
        {conversations.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setActiveChatId(chat.id)}
            className="p-4 flex items-center gap-4 hover:bg-zinc-900 cursor-pointer transition-colors"
          >
            <div className="relative">
              <img src={chat.userAvatar} className="w-14 h-14 rounded-full object-cover" />
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                  {chat.unread}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-white font-bold">{chat.withUser}</h3>
                <span className="text-xs text-zinc-500">10m</span>
              </div>
              <p className={`text-sm truncate ${chat.unread > 0 ? 'text-white font-medium' : 'text-zinc-500'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messenger;
