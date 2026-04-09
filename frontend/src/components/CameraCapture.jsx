import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Check, X, Download } from 'lucide-react';
import { Camera as CameraPro } from 'react-camera-pro';

const CameraCapture = ({ onPhotoCapture, initialPhoto = null }) => {
  const [image, setImage] = useState(initialPhoto);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleCapture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    setIsCameraOpen(false);
    onPhotoCapture(photo);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onPhotoCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setImage(null);
    onPhotoCapture(null);
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `entrevista_foto_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {isCameraOpen ? (
        <div className="relative w-full max-w-sm mx-auto aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
          <CameraPro ref={cameraRef} aspectRatio={4/3} />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6 z-10">
            <button
              type="button"
              onClick={handleCapture}
              className="bg-white text-blue-600 p-5 rounded-full shadow-2xl transition hover:scale-110 active:scale-95"
            >
              <Camera size={32} />
            </button>
            <button
              type="button"
              onClick={() => setIsCameraOpen(false)}
              className="bg-white/20 backdrop-blur-md text-white p-5 rounded-full shadow-2xl transition hover:bg-white/30"
            >
              <X size={32} />
            </button>
          </div>
        </div>
      ) : image ? (
        <div className="relative w-full aspect-[4/3] group max-w-sm mx-auto">
          <img src={image} alt="Captured" className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white" />
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all rounded-3xl">
            <button
              type="button"
              onClick={downloadImage}
              className="text-white bg-white/20 p-4 rounded-full backdrop-blur-md hover:bg-white/40 transition transition-transform hover:scale-110"
              title="Descargar Foto"
            >
              <Download size={24} />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-white bg-white/20 p-4 rounded-full backdrop-blur-md hover:bg-white/40 transition transition-transform hover:scale-110"
              title="Cambiar Foto"
            >
              <RefreshCw size={24} />
            </button>
          </div>
          <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-2xl border-4 border-white animate-bounce">
            <Check size={20} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto w-full aspect-[4/3] rounded-3xl border-4 border-dashed border-blue-900/10 bg-white/40 backdrop-blur-sm hover:border-blue-500/30 transition-all group overflow-hidden">
          <div className="text-blue-900/20 group-hover:text-blue-600 transition-colors mb-4">
            <Camera size={48} strokeWidth={1} />
          </div>
          
          <div className="flex flex-col space-y-4 w-full px-8">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-xl font-bold uppercase tracking-widest text-xs"
            >
              <Camera size={20} className="mr-3" /> Tomar Foto ahora
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center px-6 py-4 bg-white/80 text-blue-900 rounded-2xl hover:bg-white transition shadow-lg font-bold uppercase tracking-widest text-xs border border-blue-900/5"
            >
              <Upload size={20} className="mr-3" /> Subir de Galería
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
