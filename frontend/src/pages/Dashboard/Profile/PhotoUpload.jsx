import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const PhotoUpload = ({ currentPhoto, onPhotoUpdate, onPhotoRemove }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access is blocked by your browser. This usually happens if you're not using HTTPS or localhost.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowCamera(true);
      setShowOptions(false);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        toast.error("Camera permission denied. Please allow camera access in your browser settings.");
      } else {
        toast.error("Unable to access camera. Please check permissions.");
      }
      console.error("Camera error:", err);
    }
  };

  React.useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onPhotoUpdate(file);
        stopCamera();
      }, "image/jpeg");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpdate(file);
      setShowOptions(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <>
      <div className="relative group flex flex-col items-center">
        <div 
          className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
        >
          {currentPhoto ? (
            <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-10 h-10 text-white" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white mb-1" />
            <span className="text-white text-xs font-semibold">Edit</span>
          </div>
        </div>

        {showOptions && !showCamera && (
          <div className="absolute top-34 z-20 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
            <button
              onClick={startCamera}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4 text-blue-600" /> Capture from Camera
            </button>
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowOptions(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-purple-600" /> Choose from Gallery
            </button>
            {currentPhoto && (
              <button
                onClick={() => {
                  onPhotoRemove();
                  setShowOptions(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove Photo
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Take a Photo</h3>
              <button 
                onClick={stopCamera} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black mb-6 aspect-square flex items-center justify-center shadow-inner">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
            </div>
            <div className="flex justify-center pb-2">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoUpload;
