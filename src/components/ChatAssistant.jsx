//ChatAssistant.jsx

import React, { useState, useEffect, useRef } from 'react';

export default function ChatAssistant() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help with face recognition today?', isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you with face registration and recognition tasks.",
        "Make sure you're in a well-lit environment for better face detection.",
        "Have you registered the faces you want to recognize?",
        "The recognition accuracy improves with higher quality images.",
        "You can switch between front and back cameras for different perspectives."
      ];
      
      const aiMessage = {
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">AI Chat Assistant</h2>
      
      <div className="bg-blue-50 rounded-lg p-4 h-64 overflow-y-auto mb-4 flex flex-col border border-blue-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.isUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-blue-800 border border-blue-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-blue-200 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about face recognition..."
          className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}