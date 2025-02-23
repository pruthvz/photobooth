import { useEffect, useRef, useState } from 'react'

interface CameraPreviewProps {
  onTakePicture: (photos: Array<{ id: string; dataUrl: string }>) => void
  maxPhotos: number
  countdownTime: number
}

interface CapturedPhoto {
  id: string
  dataUrl: string
}

export default function CameraPreview({ onTakePicture, maxPhotos, countdownTime }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error starting camera:', error)
      }
    }

    startCamera()

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Draw the current frame from video to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg')
        
        // Create new photo object
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          dataUrl
        }
        
        // Update photos state and notify parent
        const updatedPhotos = [...photos, newPhoto]
        setPhotos(updatedPhotos)
        onTakePicture(updatedPhotos)
      }
    }
  }

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    let sequenceTimeout: NodeJS.Timeout;

    const startNextPhoto = () => {
      if (currentPhotoIndex < maxPhotos - 1) {
        sequenceTimeout = setTimeout(() => {
          setCurrentPhotoIndex(prev => prev + 1);
          setCountdown(countdownTime);
        }, 2000); // Wait 2 seconds before starting next countdown
      } else {
        setIsCapturing(false);
      }
    };

    if (countdown === 1) {
      countdownInterval = setTimeout(() => {
        capturePhoto();
        setCountdown(null); // Reset countdown after capture
        startNextPhoto();
      }, 1000); // Wait full second on 1 before capture
    } else if (countdown !== null && countdown > 1) {
      countdownInterval = setTimeout(() => {
        setCountdown(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    }

    // Force start next countdown if it's not the last photo
    if (countdown === null && currentPhotoIndex < maxPhotos - 1 && photos.length < maxPhotos && isCapturing) {
      sequenceTimeout = setTimeout(() => {
        setCountdown(countdownTime);
      }, 1000);
    }

    return () => {
      clearTimeout(countdownInterval);
      clearTimeout(sequenceTimeout);
    };
  }, [countdown, currentPhotoIndex, maxPhotos, countdownTime]);

  const handleStartCountdown = () => {
    if (photos.length >= maxPhotos || isCapturing) return;
    setIsCapturing(true);
    setCurrentPhotoIndex(0);
    setCountdown(countdownTime);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/20">
      <div className="flex-1 space-y-8">
        <div className="relative w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden ring-1 ring-gray-200/50 shadow-xl transform transition-transform hover:scale-[1.01] duration-500">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-all duration-300">
              <div className="relative">
                <span className="absolute inset-0 flex items-center justify-center text-white text-[12rem] font-bold blur-2xl opacity-10">
                  {countdown}
                </span>
                <span className="relative text-white text-[12rem] font-bold drop-shadow-lg">
                  {countdown}
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px]">
            <p className="text-white/95 text-lg font-medium">
              {photos.length >= maxPhotos ? '✨ All photos captured!' : 
               isCapturing ? `📸 Photo ${photos.length + 1} of ${maxPhotos}` : 
               '🎬 Ready to capture memories'}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleStartCountdown}
            className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-12 py-5 rounded-2xl text-xl font-semibold
              hover:from-emerald-500 hover:to-teal-600 transition-all transform hover:scale-105 hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              shadow-lg relative overflow-hidden group"
            disabled={isCapturing || photos.length >= maxPhotos}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            <span className="relative">
              {photos.length >= maxPhotos ? '✨ Photo Session Complete' : 
               isCapturing ? `📸 Taking Photo ${currentPhotoIndex + 1} of ${maxPhotos}` : 
               '🎬 Start Photo Session'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Photo strip side panel */}
      <div className="w-full lg:w-80 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-6 space-y-6 lg:max-h-[85vh] shadow-lg border border-gray-200/50 transform transition-transform hover:scale-[1.01] duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Captured Photos</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            {[...Array(maxPhotos)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index < photos.length ? 'bg-emerald-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto">
          {photos.map(photo => (
            <div key={photo.id} className="group relative transform transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={photo.dataUrl}
                alt="Captured photo"
                className="w-full rounded-xl shadow-md ring-1 ring-gray-200/50 transform transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/95 text-sm font-medium">Photo {photos.indexOf(photo) + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}