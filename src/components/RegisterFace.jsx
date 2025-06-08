// RegisterFace.jsx

import React, { useState, useEffect } from 'react';
import CameraFeed from './CameraFeed';

export default function RegisterFace() {
  const [name, setName] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Please enter a valid name");
      return;
    }

    if (!isCameraOn || !videoTrack) {
      setError("Please start the camera first");
      return;
    }

    const imageCapture = new ImageCapture(videoTrack);
    try {
      const blob = await imageCapture.takePhoto();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', blob, `${name}.jpg`);

      const response = await fetch('http://localhost:8001/register', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert(`Face registered for: ${name}`);
        setName('');
        setError('');
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to register');
      }
    } catch (err) {
      setError('Image capture failed');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
      setStream(null);
      setVideoTrack(null);
    }
  };

  const handleStream = (s) => {
    setStream(s);
    const track = s.getVideoTracks()[0];
    setVideoTrack(track);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Register New Face</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-1">
          <div className="bg-blue-50 rounded-lg overflow-hidden aspect-video border border-blue-100">
            {isCameraOn ? (
              <CameraFeed onStream={handleStream} isActive={isCameraOn} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 p-4">
                <div className="text-5xl mb-2">📷</div>
                <p>Camera is off</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3 justify-center">
            {!isCameraOn ? (
              <button
                onClick={() => setIsCameraOn(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Stop Camera
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter person's name"
            />
          </div>

          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRegister}
            disabled={!name.trim() || !isCameraOn}
          >
            Register Face
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <p className="font-medium">Instructions:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-1">
              <li>Click "Start Camera" and allow access when prompted</li>
              <li>Position your face clearly in the frame</li>
              <li>Enter the person's name</li>
              <li>Click "Register Face"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
