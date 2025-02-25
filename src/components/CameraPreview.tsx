import { useEffect, useRef, useState } from 'react'

interface CapturedPhoto {
  id: string;
  dataUrl: string;
}

interface CameraPreviewProps {
  onTakePicture: (photos: Array<{ id: string; dataUrl: string }>) => void
  maxPhotos: number
  countdownTime: number
  setShowEditor: (show: boolean) => void
}

type FilterType = 'No Filter' | 'Grayscale' | 'Sepia' | 'Vintage' | 'Soft';

export default function CameraPreview({ onTakePicture, maxPhotos, countdownTime, setShowEditor }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('No Filter');

  // Filter styles mapping
  const filterStyles = {
    'No Filter': '',
    'Grayscale': 'grayscale(1)',
    'Sepia': 'sepia(1)',
    'Vintage': 'sepia(0.5) contrast(1.1) brightness(0.9)',
    'Soft': 'brightness(1.1) contrast(0.9) saturate(0.9)'
  };

  // Apply filter to canvas context
  const applyFilter = (context: CanvasRenderingContext2D) => {
    if (selectedFilter === 'No Filter') return;

    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      switch (selectedFilter) {
        case 'Grayscale':
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          data[i] = data[i + 1] = data[i + 2] = gray;
          break;
        case 'Sepia':
          data[i] = r * 0.393 + g * 0.769 + b * 0.189;
          data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
          data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
          break;
        case 'Vintage':
          data[i] = r * 0.5 + g * 0.5 + b * 0.1;
          data[i + 1] = r * 0.2 + g * 0.7 + b * 0.1;
          data[i + 2] = r * 0.1 + g * 0.3 + b * 0.6;
          break;
        case 'Soft':
          data[i] = r * 1.1;
          data[i + 1] = g * 1.1;
          data[i + 2] = b * 0.9;
          break;
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error starting camera:', error)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  const handleFlipCamera = async () => {
    try {
      // Create a promise that resolves when the video is ready to play
      const waitForVideoLoad = new Promise<void>((resolve) => {
        if (videoRef.current) {
          const handleLoadedMetadata = () => {
            videoRef.current?.play();
            resolve();
          };
          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        } else {
          resolve();
        }
      });

      // Get new stream before stopping old one
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode === 'user' ? 'environment' : 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      // Apply the new stream
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        // Wait for the video to be ready
        await waitForVideoLoad;
      }

      // Only after new stream is ready, stop the old one
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
      }
      
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    } catch (error) {
      console.error('Error flipping camera:', error);
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        if (facingMode === 'user') {
          context.translate(canvas.width, 0)
          context.scale(-1, 1)
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        if (facingMode === 'user') {
          context.setTransform(1, 0, 0, 1, 0, 0)
        }

        // Apply selected filter
        applyFilter(context);
        
        const dataUrl = canvas.toDataURL('image/jpeg')
        
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          dataUrl
        }
        
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
          <div className="text-center mb-4">
            <h3 className="text-gray-600 font-medium mb-3 text-sm uppercase tracking-wide">Choose a filter before starting capture!</h3>
            <div className="flex justify-center gap-2">
              {Object.keys(filterStyles).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as FilterType)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${selectedFilter === filter ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-150'}`}
                  disabled={isCapturing}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full aspect-video bg-white overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              style={{ filter: filterStyles[selectedFilter] }}
            />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                <span className="text-white text-8xl font-light">{countdown}</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleFlipCamera}
              className="px-6 py-3 bg-gray-100 text-gray-900
                hover:bg-gray-200 transition-all duration-300
                text-base font-light tracking-wide
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCapturing}
            >
              Flip Camera
            </button>
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