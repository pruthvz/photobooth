import { useState, useRef, useEffect } from "react";

interface PhotoEditorProps {
  photos: Array<{ id: string; dataUrl: string }>;
  onSave: () => void;
  onReset: () => void;
}

interface Template {
  id: string;
  name: string;
  className: string;
  preview: string;
  borderStyle?: string;
  overlayStyle?: string;
  defaultText?: Array<{
    id: string;
    text: string;
    style: string;
    placeholder: string;
  }>;
}

const templates: Template[] = [
  {
    id: "classic-strip",
    name: "Classic Strip",
    className: "grid grid-cols-1 gap-3 p-5",
    preview: "🖼️",
    borderStyle: "p-2 bg-gray-50 shadow-sm",
  },
  {
    id: "modern-grid",
    name: "Modern Grid",
    className: "grid grid-cols-1 gap-4 p-8",
    preview: "⊞",
    borderStyle: "p-3 bg-white rounded-xl shadow-xl",
  },
  {
    id: "polaroid",
    name: "Polaroid Style",
    className: "grid grid-cols-1 gap-6",
    preview: "📸",
    borderStyle: "p-4 bg-white shadow-xl rounded-sm transform rotate-1",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    className: "grid grid-cols-1 gap-3",
    preview: "▣",
    borderStyle: "p-5 bg-gray-50 shadow-sm",
  },
  {
    id: "vintage",
    name: "Vintage Frame",
    className: "grid grid-cols-1 gap-8",
    preview: "🎞️",
    borderStyle: "p-4 bg-sepia-100 border-8 border-double border-sepia-300",
  },

  {
    id: "magazine-cover",
    name: "Magazine Cover",
    className: "grid grid-cols-1 p-8",
    preview: "📖",
    borderStyle: "p-4 bg-gradient-to-b from-pink-500 to-purple-600",
    overlayStyle:
      "absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent",
    defaultText: [
      {
        id: "title",
        text: "VOGUE",
        style:
          "absolute top-8 left-0 right-0 text-center text-7xl font-bold text-white tracking-[0.2em] drop-shadow-lg",
        placeholder: "Magazine Title",
      },
      {
        id: "subtitle",
        text: "STYLE • FASHION • LIFE",
        style:
          "absolute top-28 left-0 right-0 text-center text-sm font-medium text-white tracking-[0.5em]",
        placeholder: "Subtitle",
      },
      {
        id: "headline",
        text: "The Next Icon",
        style:
          "absolute bottom-16 left-0 right-0 text-center text-4xl font-light text-white tracking-wider",
        placeholder: "Your Headline",
      },
    ],
  },
  {
    id: "comic-book",
    name: "Comic Book",
    className: "grid grid-cols-1",
    preview: "💥",
    borderStyle:
      "p-3 bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500 border-[6px] border-black rounded-sm",
    overlayStyle:
      "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.2)_70%)] after:absolute after:inset-0 after:bg-[url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")] after:opacity-50",
    defaultText: [
      {
        id: "pow",
        text: "KAPOW!",
        style:
          "absolute top-6 right-8 text-8xl font-black text-yellow-400 transform rotate-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:3px_#000]",
        placeholder: "Action Text",
      },
      {
        id: "speech",
        text: "This is epic!",
        style:
          "absolute top-1/3 left-8 text-3xl font-bold text-white bg-white rounded-3xl px-6 py-4 transform -rotate-6 border-4 border-black after:absolute after:w-6 after:h-6 after:bg-white after:border-b-4 after:border-r-4 after:border-black after:-bottom-6 after:left-6 after:transform after:rotate-45",
        placeholder: "Speech Bubble",
      },
      {
        id: "caption",
        text: "The Adventure Begins!",
        style:
          "absolute bottom-8 left-0 right-0 text-center text-3xl font-black text-white [-webkit-text-stroke:1px_#000] tracking-wider",
        placeholder: "Your Caption",
      },
    ],
  },
  {
    id: "movie-poster",
    name: "Movie Poster",
    className: "grid grid-cols-1",
    preview: "🎬",
    borderStyle: "p-3 bg-gradient-to-b from-gray-900 to-gray-800",
    overlayStyle:
      "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
    defaultText: [
      {
        id: "movie-title",
        text: "THE GREATEST STORY",
        style:
          "absolute bottom-24 left-0 right-0 text-center text-6xl font-black text-white tracking-widest drop-shadow-lg",
        placeholder: "Movie Title",
      },
      {
        id: "tagline",
        text: "Every moment counts",
        style:
          "absolute bottom-12 left-0 right-0 text-center text-2xl font-light text-white tracking-wider",
        placeholder: "Movie Tagline",
      },
    ],
  },
  {
    id: "polaroid-collage",
    name: "Polaroid Collage",
    className: "grid grid-cols-2 gap-8 p-8",
    preview: "📸",
    borderStyle:
      "relative p-6 bg-white shadow-xl rounded-sm transform rotate-2 border-[16px] border-white aspect-[4/5] flex items-center justify-center",
    overlayStyle:
      "absolute inset-0 bg-gradient-to-t from-black/10 to-transparent",
    defaultText: [
      {
        id: "caption1",
        text: "Memories",
        style:
          "absolute -bottom-4 left-0 right-0 text-center text-xl font-handwriting text-gray-700 transform -rotate-2",
        placeholder: "Your Caption",
      },
    ],
  },
  {
    id: "aesthetic-dream",
    name: "Dreamy Aesthetic",
    className: "grid grid-cols-1 gap-4",
    preview: "🌸",
    borderStyle:
      "p-6 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-2xl shadow-lg",
    overlayStyle:
      "absolute inset-0 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-[1px]",
    defaultText: [
      {
        id: "quote",
        text: "dream a little dream",
        style:
          "absolute bottom-8 left-0 right-0 text-center text-2xl font-serif text-white/90 tracking-widest",
        placeholder: "Your Quote",
      },
    ],
  },
  {
    id: "vintage-film",
    name: "Vintage Film",
    className: "grid grid-cols-1",
    preview: "🎞️",
    borderStyle: "p-3 bg-black",
    overlayStyle:
      "absolute inset-0 bg-gradient-to-b from-black/20 to-transparent after:absolute after:inset-0 after:bg-[url(\"data:image/svg+xml,%3Csvg width='44' height='12' viewBox='0 0 44 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12v-2L0 0v10l4 2h16zm18 0l4-2V0L22 10v2h16zM20 0v8L4 0h16zm18 0L22 8V0h16z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")] after:opacity-30",
    defaultText: [
      {
        id: "date",
        text: "1960s",
        style:
          "absolute top-4 right-6 text-base font-mono text-white/70 tracking-wider",
        placeholder: "Year",
      },
      {
        id: "title",
        text: "Timeless Beauty",
        style:
          "absolute bottom-6 left-0 right-0 text-center text-2xl font-serif text-white/90 tracking-[0.2em]",
        placeholder: "Title",
      },
    ],
  },
];

const backgroundColors = [
  { id: "white", color: "bg-white", label: "Classic White" },
  { id: "black", color: "bg-black", label: "Dark Mode" },
  {
    id: "gradient1",
    color: "bg-gradient-to-r from-blue-400 to-purple-500",
    label: "Ocean Breeze",
  },
  {
    id: "gradient2",
    color: "bg-gradient-to-r from-pink-400 to-orange-500",
    label: "Sunset",
  },
  {
    id: "gradient3",
    color: "bg-gradient-to-r from-green-400 to-cyan-500",
    label: "Forest Mist",
  },
  {
    id: "gradient4",
    color: "bg-gradient-to-r from-pink-300 to-purple-400",
    label: "Cotton Candy",
  },
  {
    id: "gradient5",
    color: "bg-gradient-to-r from-rose-200 to-pink-300",
    label: "Rose Quartz",
  },
  {
    id: "gradient6",
    color: "bg-gradient-to-r from-violet-300 to-purple-300",
    label: "Lavender Dream",
  },
  {
    id: "gradient7",
    color: "bg-gradient-to-r from-yellow-200 to-pink-200",
    label: "Peach Blossom",
  },
  {
    id: "gradient8",
    color: "bg-gradient-to-r from-teal-300 to-blue-300",
    label: "Ocean Pearl",
  },
  {
    id: "gradient9",
    color: "bg-gradient-to-r from-fuchsia-300 to-purple-400",
    label: "Berry Bliss",
  },
  {
    id: "gradient10",
    color: "bg-gradient-to-r from-amber-200 to-yellow-100",
    label: "Golden Hour",
  },
];

const stickers = [
  // Hearts
  "❤️",
  "💙",
  "💚",
  "💛",
  "🧡",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💝",
  // Sparkles and Stars
  "✨",
  "⭐",
  "💫",
  "🌟",
  "⚡",
  "🌠",
  "🎇",
  "🎆",
  "💥",
  "🔥",
  // Flowers
  "🌸",
  "🌺",
  "🌹",
  "🌷",
  "🌻",
  "🌼",
  "🌿",
  "🍀",
  "🌱",
  "🌵",
  // Decorative
  "🦋",
  "🎀",
  "🌈",
  "🎨",
  "💖",
  "💕",
  "🎵",
  "🎶",
  "🎭",
  "🎪",
  // Additional
  "🌙",
  "🦄",
  "🎬",
  "🎸",
  "🍃",
];

export default function PhotoEditor({
  photos,
  onSave,
  onReset,
}: PhotoEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [selectedBg, setSelectedBg] = useState<string>("bg-white");
  const [selectedStickers, setSelectedStickers] = useState<Array<{ id: string; sticker: string; position: { x: number; y: number } }>>([]);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingColor, setDrawingColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isDoodleMode, setIsDoodleMode] = useState<boolean>(false);
  const templateRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = drawingColor;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  }, [drawingColor, brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!isDoodleMode || !contextRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !isDoodleMode || !contextRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    if (canvasRef.current && templateRef.current) {
      const template = templateRef.current;
      const { width, height } = template.getBoundingClientRect();
      const scale = window.devicePixelRatio;
      canvasRef.current.width = width * scale;
      canvasRef.current.height = height * scale;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.scale(scale, scale);
        context.lineCap = 'round';
        context.strokeStyle = drawingColor;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  }, [drawingColor, brushSize, selectedTemplate]);

  const addSticker = (sticker: string) => {
    setSelectedStickers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sticker,
        position: { x: 50, y: 50 },
      },
    ]);
  };

  const handleDragStart = (e: React.DragEvent, stickerId: string) => {
    e.dataTransfer.setData("text/plain", stickerId);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.style.cursor = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData("text/plain");
    const templateRect = templateRef.current?.getBoundingClientRect();

    if (templateRect) {
      const x = ((e.clientX - templateRect.left) / templateRect.width) * 100;
      const y = ((e.clientY - templateRect.top) / templateRect.height) * 100;

      // Ensure the sticker stays within the template boundaries
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setSelectedStickers((prev) =>
        prev.map((s) =>
          s.id === stickerId
            ? { ...s, position: { x: clampedX, y: clampedY } }
            : s
        )
      );
    }
  };

  const downloadPhotoStrip = async () => {
    if (!templateRef.current) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    // Get the template dimensions
    const template = templateRef.current;
    const { width, height } = template.getBoundingClientRect();

    // Set canvas size to match template with higher resolution
    const scale = window.devicePixelRatio * 4; // Increase resolution for better quality
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Use html2canvas to capture the exact preview
    const html2canvas = (await import("html2canvas")).default;
    const capturedCanvas = await html2canvas(template, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        const clonedTemplate = clonedDoc.querySelector("[data-template]");
        if (clonedTemplate) {
          clonedTemplate.style.transform = "none";
        }
      },
    });

    // Draw the captured content onto our canvas
    context.drawImage(capturedCanvas, 0, 0);

    // Convert canvas to blob and download with maximum quality
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.download = `photobooth-strip-${timestamp}.png`;
        link.style.display = "none";
        document.body.appendChild(link);
        requestAnimationFrame(() => {
          link.click();
          requestAnimationFrame(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          });
        });
      },
      "image/png",
      1.0
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl">
      <div className="flex gap-10">
        {/* Editor Panel */}
        <div className="w-96 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 space-y-8 shadow-lg border border-gray-200/50">
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-xl">
              Choose Template
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`flex flex-col items-center p-5 rounded-xl transition-all transform hover:scale-105
                    ${
                      selectedTemplate.id === template.id
                        ? "bg-gradient-to-br from-blue-50 to-indigo-100 ring-2 ring-blue-200 shadow-lg"
                        : "bg-white hover:bg-gray-50 shadow-md"
                    }`}
                >
                  <span className="text-4xl mb-3">{template.preview}</span>
                  <span className="text-gray-700 text-sm font-medium">
                    {template.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-xl">
              Background Style
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {backgroundColors.map(({ id, color, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedBg(color)}
                  className={`group relative h-20 rounded-xl transition-all transform hover:scale-105
                    ${color} ${
                    selectedBg === color
                      ? "ring-2 ring-blue-300 shadow-lg"
                      : "shadow-md"
                  }`}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center text-sm font-medium
                    text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-xl backdrop-blur-sm"
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-xl">
              Add Stickers
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {stickers.map((sticker) => (
                <button
                  key={sticker}
                  onClick={() => addSticker(sticker)}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl
                    hover:bg-gray-50 transition-all transform hover:scale-110 text-2xl shadow-md"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-xl">
              Drawing Tools
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Doodle Mode</label>
                <button
                  onClick={() => setIsDoodleMode(!isDoodleMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDoodleMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {isDoodleMode ? 'On' : 'Off'}
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-700 font-medium block">Brush Color</label>
                <input
                  type="color"
                  value={drawingColor}
                  onChange={(e) => setDrawingColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium block">Brush Size</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={clearCanvas}
                className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                disabled={!isDoodleMode}
              >
                Clear Drawing
              </button>
            </div>
          </div>
          
          <button
            onClick={downloadPhotoStrip}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-8 py-4
              rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-all transform hover:scale-[1.02]
              font-semibold shadow-lg mb-4 text-lg"
          >
            Download Photo Strip
          </button>
          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-violet-400 to-purple-500 text-white px-8 py-4
              rounded-xl hover:from-violet-500 hover:to-purple-600 transition-all transform hover:scale-[1.02]
              font-semibold shadow-lg text-lg"
          >
            Take New Photos
          </button>
        </div>

        {/* Preview Area */}
        <div
          className={`flex-1 rounded-2xl p-10 ${selectedBg} transition-all duration-300 shadow-2xl min-h-[800px] relative overflow-hidden ${selectedTemplate.className} border border-gray-200/20 backdrop-blur-sm`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          ref={templateRef}
          data-template
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
            style={{ display: isDoodleMode ? 'block' : 'none' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden ${selectedTemplate.borderStyle || ""}`}
            >
              <img
                src={photo.dataUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedTemplate.overlayStyle && (
                <div className={selectedTemplate.overlayStyle} />
              )}
            </div>
          ))}

          {selectedTemplate.defaultText?.map((textItem) => (
            <div key={textItem.id} className={textItem.style}>
              {customText[textItem.id] || textItem.text}
            </div>
          ))}

          {selectedStickers.map((sticker) => (
            <div
              key={sticker.id}
              draggable
              onDragStart={(e) => handleDragStart(e, sticker.id)}
              onDragEnd={handleDragEnd}
              style={{
                position: "absolute",
                left: `${sticker.position.x}%`,
                top: `${sticker.position.y}%`,
                transform: "translate(-50%, -50%)",
                fontSize: "2rem",
                cursor: "move",
                userSelect: "none",
              }}
            >
              {sticker.sticker}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
