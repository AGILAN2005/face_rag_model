//App.jsx
import React, { useState, useEffect } from 'react';
import RegisterFace from './components/RegisterFace';
import LiveRecognition from './components/LiveRecognition';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [tab, setTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'register';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', tab);
  }, [tab]);

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Face Recognition Platform
        </h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setTab('register')}
            className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base rounded-full font-medium ${
              tab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-blue-600 border border-blue-200'
            }`}
          >
            Register Face
          </button>
          <button
            onClick={() => setTab('recognition')}
            className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base rounded-full font-medium ${
              tab === 'recognition'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-blue-600 border border-blue-200'
            }`}
          >
            Live Recognition
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base rounded-full font-medium ${
              tab === 'chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-blue-600 border border-blue-200'
            }`}
          >
            AI Chat
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 md:p-6">
          {tab === 'register' && <RegisterFace />}
          {tab === 'recognition' && <LiveRecognition />}
          {tab === 'chat' && <ChatAssistant />}
        </div>
      </div>
    </div>
  );
}

export default App;