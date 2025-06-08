// CameraFeed.jsx
import React, { useEffect, useRef } from 'react';

export default function CameraFeed({ onStream, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isActive && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            onStream?.(stream); // send stream to parent if needed
          }
        })
        .catch((err) => {
          console.error("Camera access error:", err);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
