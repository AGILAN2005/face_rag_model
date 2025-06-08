// LiveRecognition.jsx

import React, { useState } from 'react';
import CameraFeed from './CameraFeed';

export default function LiveRecognition() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState('');
  const [recognitionStatus, setRecognitionStatus] = useState('Not started');
  const [videoTrack, setVideoTrack] = useState(null);

  const toggleRecognition = () => {
    if (isRecognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const startRecognition = () => {
    setIsRecognizing(true);
    setRecognitionStatus('Recognizing faces...');
    setError('');
    captureAndSend();
  };

  const stopRecognition = () => {
    setIsRecognizing(false);
    setRecognitionStatus('Recognition stopped');
  };

  const handleStream = (stream) => {
    const track = stream.getVideoTracks()[0];
    setVideoTrack(track);
  };

  const captureAndSend = async () => {
    if (!videoTrack) return;
    const imageCapture = new ImageCapture(videoTrack);

    try {
      const blob = await imageCapture.takePhoto();
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      const res = await fetch('http://localhost:8001/recognize', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setRecognitionStatus(`Result: ${data.result || 'No match'}`);
    } catch (err) {
      console.error('Recognition error:', err);
      setError('Recognition failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Live Face Recognition</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="relative bg-blue-50 rounded-lg overflow-hidden aspect-video mb-4 border border-blue-100">
        {isRecognizing ? (
          <CameraFeed isActive={isRecognizing} onStream={handleStream} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 p-4">
            <div className="text-5xl mb-2">👁️</div>
            <p>Recognition inactive</p>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
          Status: {recognitionStatus}
        </div>
      </div>

      <button
        onClick={toggleRecognition}
        className={`w-full py-2 rounded-md text-white font-medium ${
          isRecognizing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        } transition`}
      >
        {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
      </button>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-700 mb-2">Recognition Results</h3>
        <div className="text-sm text-gray-600">
          {isRecognizing ? (
            <div className="animate-pulse">Scanning for faces...</div>
          ) : (
            <p>No active recognition session</p>
          )}
        </div>
      </div>
    </div>
  );
}
