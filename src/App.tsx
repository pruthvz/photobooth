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
  const [isGlowVisible, setIsGlowVisible] = useState<boolean>(true);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      setShowInstructions(false);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handlePhotoCapture = (
    photos: Array<{ id: string; dataUrl: string }>
  ) => {
    setCapturedPhotos(photos);
  };

  const handleSavePhotos = () => {
    console.log("Saving photos...");
  };

  const handleResetPhotos = () => {
    setCapturedPhotos([]);
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <nav className="fixed top-0 w-full z-50 py-4 bg-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-8">
          <a
            href="/"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300 text-sm font-light tracking-wide"
          >
            home
          </a>
          <a
            href="https://shopcrescent.uk"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300 text-sm font-light tracking-wide"
            target="_blank"
            rel="noopener noreferrer"
          >
            shop
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="text-center">
          {!cameraPermission ? (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-5xl font-light mb-4 tracking-wide relative text-gray-900">
                    <span className="mx-3 relative inline-block">
                      photobooth app
                      {isGlowVisible && (
                        <span className="absolute inset-0 blur-lg bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 opacity-70 -z-10"></span>
                      )}
                    </span>
                  </h1>
                  <p className="text-gray-500 text-sm mb-6 font-light tracking-wider">
                    Create beautiful memories with a click,
                    <br />
                    share moments that last forever
                  </p>
                  <button
                    onClick={requestCameraPermission}
                    className="mt-4 px-8 py-2.5 bg-white text-black border-2 border-gray-200 rounded-full
                      hover:bg-gray-50 hover:border-pink-300 hover:text-pink-500 transition-all duration-300 text-sm tracking-wide font-light"
                  >
                    START
                  </button>
                </div>
              </div>
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
              setShowEditor={setShowEditor}
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400">
        <p className="font-light tracking-wide">
          made by{" "}
          <a
            href="#"
            className="text-pink-400 hover:text-pink-500 transition-colors duration-300"
          >
            pruthvi
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
