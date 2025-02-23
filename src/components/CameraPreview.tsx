import { useEffect, useRef, useState } from 'react'

interface CameraPreviewProps {
  onTakePicture: (photos: Array<{ id: string; dataUrl: string }>) => void
  maxPhotos: number
  countdownTime: number
  setShowEditor: (show: boolean) => void
}

export default function CameraPreview({ onTakePicture, maxPhotos, countdownTime, setShowEditor }: CameraPreviewProps) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f8f8] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="w-full max-w-6xl mx-auto flex gap-8 relative z-10">
        {/* Camera Preview */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-white overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                <span className="text-white text-8xl font-light">{countdown}</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {photos.length >= maxPhotos ? (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setPhotos([]);
                    setCurrentPhotoIndex(0);
                    setIsCapturing(false);
                  }}
                  className="px-12 py-3 bg-gray-100 text-gray-900
                    hover:bg-gray-200 transition-all duration-300
                    text-base font-light tracking-wide"
                >
                  Retake
                </button>
                <button
                  onClick={() => {
                    onTakePicture(photos);
                    setShowEditor(true);
                  }}
                  className="px-12 py-3 bg-gray-100 text-gray-900
                    hover:bg-gray-200 transition-all duration-300
                    text-base font-light tracking-wide"
                >
                  DONE
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartCountdown}
                className="px-12 py-3 bg-gray-100 text-gray-900
                  hover:bg-gray-200 transition-all duration-300
                  text-base font-light tracking-wide
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCapturing || photos.length >= maxPhotos}
              >
                {isCapturing ? `Taking Photo ${currentPhotoIndex + 1}` : 'Start Session'}
              </button>
            )}
          </div>
        </div>

        {/* Photo Strip */}
        <div className="w-48 p-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-light text-gray-900 mb-2">photobooth</h2>
            <div className="flex justify-center gap-1">
              {[...Array(maxPhotos)].map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 transition-all ${index < photos.length ? 'bg-gray-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-video bg-white overflow-hidden shadow-sm">
                <img
                  src={photo.dataUrl}
                  alt="Captured photo"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}