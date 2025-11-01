
import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon } from './Icons';
import { FitnessPlan, DailyPlan, ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
  plan?: FitnessPlan;
  currentDayPlan?: DailyPlan;
}

const Chatbot: React.FC<ChatbotProps> = ({ plan, currentDayPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = plan
        ? "Hi! I'm your AI fitness coach. How can I help you with your plan today?"
        : "Hi! I'm your AI fitness coach. Ask me about fitness, or select a goal to get a personalized plan!";
      setMessages([{ role: 'model', content: initialMessage }]);
    }
  }, [isOpen, plan]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const planContext = plan ? { plan, currentDayPlan } : null;
        const botResponse = await getChatbotResponse(input, [...messages, userMessage], planContext);
        setMessages(prev => [...prev, { role: 'model', content: botResponse }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-500 transform hover:scale-110 transition-all duration-300 ease-in-out z-40"
        aria-label="Open AI Coach"
      >
        <ChatIcon className="w-8 h-8" />
      </button>

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
        ></div>

        {/* Chat Window */}
        <div className={`fixed bottom-0 right-0 top-0 sm:top-auto sm:bottom-24 sm:right-6 w-full sm:w-96 h-full sm:h-[70vh] max-h-screen sm:max-h-[600px] bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-none sm:rounded-xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">AI Fitness Coach</h2>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
          </header>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-sm ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <div className="flex items-center bg-slate-700 rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your plan..."
                className="flex-1 bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-3 text-sky-400 hover:text-sky-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
