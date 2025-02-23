import { useState } from "react";
import CameraPreview from "./components/CameraPreview";
import PhotoEditor from "./components/PhotoEditor";

function App() {
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [capturedPhotos, setCapturedPhotos] = useState<
    Array<{ id: string; dataUrl: string }>
  >([]);
  const [showEditor, setShowEditor] = useState<boolean>(false);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      setShowInstructions(false);
      // Clean up the stream since we don't need it yet
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handlePhotoCapture = (
    photos: Array<{ id: string; dataUrl: string }>
  ) => {
    setCapturedPhotos(photos);
    if (photos.length === 4) {
      // Add a 2.5 second delay before showing the editor
      setTimeout(() => {
        setShowEditor(true);
      }, 2500);
    }
  };

  const handleSavePhotos = () => {
    // Here you can implement the save functionality
    console.log("Saving photos...");
  };

  const handleResetPhotos = () => {
    setCapturedPhotos([]);
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <a
            href="/"
            className="text-gray-800 hover:text-emerald-500 transition-colors duration-300 text-base sm:text-lg font-medium flex items-center gap-2"
          >
            <span className="text-xl sm:text-2xl">📸</span>
            <span>Photobooth</span>
          </a>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center w-full max-w-6xl px-4 py-8 sm:py-12">
          {!cameraPermission ? (
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-8 sm:mb-12">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 animate-bounce">
                  📸
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Photobooth App
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">
                  Create memorable photo strips with our modern photobooth
                  experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
                <div className="bg-white/80 backdrop-blur p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">⏱️</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Quick Shots
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    3 seconds for each shot – no retakes!
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🎬</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    4-Shot Series
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Strike your best poses in sequence
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">💫</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Instant Edit
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Customize and share your photos
                  </p>
                </div>
              </div>

              <button
                onClick={requestCameraPermission}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-semibold hover:from-emerald-500 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="relative">Get Started</span>
              </button>
            </div>
          ) : showEditor ? (
            <PhotoEditor
              photos={capturedPhotos}
              onSave={handleSavePhotos}
              onReset={handleResetPhotos}
            />
          ) : (
            <CameraPreview
              onTakePicture={handlePhotoCapture}
              maxPhotos={4}
              countdownTime={3}
            />
          )}
        </div>
      </div>
      <footer className="mt-auto py-6 sm:py-8 bg-white/90 backdrop-blur-sm shadow-sm px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-gray-600 text-sm sm:text-base">
            © {new Date().getFullYear()} Photobooth App.
          </p>
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Created with ❤️ by Pruthvi
            </p>
            <span className="text-gray-400">|</span>
            <a
              href="https://shopcrescent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 text-sm sm:text-base"
            >
              shopcrescent
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
