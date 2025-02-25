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
    id: "film-strip",
    name: "Film Strip",
    className: "grid grid-cols-1 gap-0 p-4 bg-black",
    preview: "🎞️",
    borderStyle: "relative p-2 bg-transparent",
    overlayStyle: "absolute inset-0 pointer-events-none",
    defaultText: [
      {
        id: "date",
        text: new Date().toLocaleDateString(),
        style: "absolute bottom-2 right-2 text-xs font-mono text-white/70",
        placeholder: "Date",
      },
    ],
  },
  {
    id: "pink-gradient",
    name: "Pink Gradient",
    className: "grid grid-cols-1 gap-2 p-4",
    preview: "🎀",
    borderStyle: "bg-gradient-to-b from-pink-100 to-pink-200 shadow-sm",
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    className: "grid grid-cols-1 gap-2 p-4",
    preview: "💜",
    borderStyle: "bg-gradient-to-b from-purple-100 to-purple-200 shadow-sm",
  },
  {
    id: "santa-strip",
    name: "Santa Strip",
    className: "grid grid-cols-1 gap-2 p-4",
    preview: "🎅",
    borderStyle:
      "bg-gradient-to-b from-red-100 to-red-200 shadow-sm border-4 border-red-500",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    className: "grid grid-cols-1 gap-2 p-4",
    preview: "🌻",
    borderStyle:
      "bg-gradient-to-b from-yellow-100 to-yellow-200 shadow-sm border-4 border-yellow-400",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    className: "grid grid-cols-1 gap-2 p-4",
    preview: "🌊",
    borderStyle: "bg-gradient-to-b from-blue-100 to-blue-200 shadow-sm",
  },
  {
    id: "classic-strip",
    name: "Classic Strip",
    className: "grid grid-cols-1 gap-2 p-2",
    preview: "🖼️",
    borderStyle: "bg-white shadow-sm",
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
];

import testTemplateImage from "../assets/templates/testtemplate.png";
import cartemp from "../assets/templates/d.png";

const imageTemplates = [
  {
    id: "classic",
    src: testTemplateImage,
    label: "Classic Template",
  },
  {
    id: "car",
    src: cartemp,
    label: "car asdasd",
  },
];

const backgroundColors = [
  { id: "white", color: "bg-white", label: "Classic White" },
  { id: "black", color: "bg-black", label: "Dark Mode" },
  {
    id: "gradient1",
    color: "bg-gradient-to-r from-blue-400 to-purple-500 bg-blue-400",
    label: "Ocean Breeze",
  },
  {
    id: "gradient2",
    color: "bg-gradient-to-r from-pink-400 to-orange-500 bg-pink-400",
    label: "Sunset",
  },
  {
    id: "gradient3",
    color: "bg-gradient-to-r from-green-400 to-cyan-500 bg-green-400",
    label: "Forest Mist",
  },
  {
    id: "gradient4",
    color: "bg-gradient-to-r from-pink-300 to-purple-400 bg-pink-300",
    label: "Cotton Candy",
  },
  {
    id: "gradient5",
    color: "bg-gradient-to-r from-rose-200 to-pink-300 bg-rose-200",
    label: "Rose Quartz",
  },
  {
    id: "gradient6",
    color: "bg-gradient-to-r from-violet-300 to-purple-300 bg-violet-300",
    label: "Lavender Dream",
  },
  {
    id: "gradient7",
    color: "bg-gradient-to-r from-yellow-200 to-pink-200 bg-yellow-200",
    label: "Peach Blossom",
  },
  {
    id: "gradient8",
    color: "bg-gradient-to-r from-teal-300 to-blue-300 bg-teal-300",
    label: "Ocean Pearl",
  },
  {
    id: "gradient9",
    color: "bg-gradient-to-r from-fuchsia-300 to-purple-400 bg-fuchsia-300",
    label: "Berry Bliss",
  },
  {
    id: "gradient10",
    color: "bg-gradient-to-r from-amber-200 to-yellow-100 bg-amber-200",
    label: "Golden Hour",
  },
];

export default function PhotoEditor({ photos, onReset }: PhotoEditorProps) {
  const [customText] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    templates[0]
  );
  const [selectedBg, setSelectedBg] = useState<string>("bg-white");
  const [selectedImageTemplate, setSelectedImageTemplate] =
    useState<string>("");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingColor, setDrawingColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isDoodleMode, setIsDoodleMode] = useState<boolean>(false);
  const [brushType] = useState<string>("regular");
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);
  const [redoHistory, setRedoHistory] = useState<ImageData[]>([]);

  const templateRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = drawingColor;
        context.lineWidth = brushSize;
        context.globalCompositeOperation = "source-over";
        context.shadowBlur = 0;
        context.globalAlpha = 1;

        // Apply brush effects based on type
        switch (brushType) {
          case "marker":
            context.globalAlpha = 0.4;
            context.lineJoin = "round";
            context.lineWidth = brushSize * 1.5;
            context.globalCompositeOperation = "multiply";
            break;
          case "neon":
            context.shadowBlur = 20;
            context.shadowColor = drawingColor;
            context.globalAlpha = 0.8;
            context.lineWidth = brushSize * 0.8;
            context.globalCompositeOperation = "screen";
            break;
          case "highlighter":
            context.globalAlpha = 0.2;
            context.lineWidth = brushSize * 3;
            context.globalCompositeOperation = "overlay";
            break;
          case "spray":
            context.globalAlpha = 0.2;
            context.lineWidth = brushSize * 0.5;
            context.globalCompositeOperation = "source-over";
            break;
          default: // regular pen
            context.globalAlpha = 1;
            context.shadowBlur = 0;
            context.lineWidth = brushSize;
            context.globalCompositeOperation = "source-over";
            break;
        }

        contextRef.current = context;
      }
    }
  }, [drawingColor, brushSize, brushType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDoodleMode || !contextRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Save the current state before starting a new stroke
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setDrawHistory((prev) => [...prev, imageData]);
    setRedoHistory([]);

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      !isDrawing ||
      !isDoodleMode ||
      !contextRef.current ||
      !canvasRef.current
    )
      return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    saveDrawingState();
  };

  const saveDrawingState = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setDrawHistory((prev) => [...prev, imageData]);
    setRedoHistory([]);
  };

  const undo = () => {
    if (!contextRef.current || !canvasRef.current || drawHistory.length === 0)
      return;
    const previousState = drawHistory[drawHistory.length - 1];
    const currentState = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setRedoHistory((prev) => [...prev, currentState]);
    setDrawHistory((prev) => prev.slice(0, -1));
    contextRef.current.putImageData(previousState, 0, 0);
  };

  const redo = () => {
    if (!contextRef.current || !canvasRef.current || redoHistory.length === 0)
      return;
    const nextState = redoHistory[redoHistory.length - 1];
    const currentState = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setDrawHistory((prev) => [...prev, currentState]);
    setRedoHistory((prev) => prev.slice(0, -1));
    contextRef.current.putImageData(nextState, 0, 0);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setDrawHistory([]);
    setRedoHistory([]);
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

      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.scale(scale, scale);
        context.lineCap = "round";
        context.strokeStyle = drawingColor;
        context.lineWidth = brushSize;

        // Apply brush effects based on type
        switch (brushType) {
          case "marker":
            context.globalAlpha = 0.6;
            context.lineJoin = "round";
            break;
          case "neon":
            context.shadowBlur = 15;
            context.shadowColor = drawingColor;
            context.globalAlpha = 0.8;
            break;
          case "highlighter":
            context.globalAlpha = 0.3;
            context.lineWidth = brushSize * 2;
            break;
          case "spray":
            context.globalAlpha = 0.3;
            context.lineJoin = "round";
            context.lineCap = "butt";
            break;
          default: // regular pen
            context.globalAlpha = 1;
            context.shadowBlur = 0;
            break;
        }

        contextRef.current = context;
      }
    }
  }, [drawingColor, brushSize, selectedTemplate]);

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
          (clonedTemplate as HTMLElement).style.transform = "none";
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-[#f8f8f8] relative overflow-x-hidden mt-10">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 rounded-[50%] blur-[64px] opacity-70"></div>
      </div>
      <div className="w-full max-w-[1400px] mx-auto flex gap-8 relative z-10">
        {/* Preview Area - Made more compact */}
        <div className="flex-1 max-w-[400px]">
          <div
            className={`w-full transition-all duration-300 relative overflow-hidden ${
              selectedTemplate.className
            } ${selectedImageTemplate ? "" : selectedBg}`}
            style={{
              maxWidth: "250px",
              margin: "0 auto",
              backgroundImage: selectedImageTemplate
                ? `url(${selectedImageTemplate})`
                : "none",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: selectedImageTemplate
                ? "transparent"
                : undefined,
            }}
            ref={templateRef}
            data-template
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
              style={{ display: isDoodleMode ? "block" : "none" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;

                const syntheticEvent = {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                  preventDefault: () => {},
                  stopPropagation: () => {},
                  nativeEvent: new MouseEvent("mousedown"),
                  isDefaultPrevented: () => false,
                  isPropagationStopped: () => false,
                  persist: () => {},
                  target: e.target,
                  currentTarget: e.currentTarget,
                  bubbles: true,
                  cancelable: true,
                  timeStamp: e.timeStamp,
                  type: "mousedown",
                } as React.MouseEvent<HTMLCanvasElement>;

                startDrawing(syntheticEvent);
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;

                const syntheticEvent = {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                  preventDefault: () => {},
                  stopPropagation: () => {},
                  nativeEvent: new MouseEvent("mousemove"),
                  isDefaultPrevented: () => false,
                  isPropagationStopped: () => false,
                  persist: () => {},
                  target: e.target,
                  currentTarget: e.currentTarget,
                  bubbles: true,
                  cancelable: true,
                  timeStamp: e.timeStamp,
                  type: "mousemove",
                } as React.MouseEvent<HTMLCanvasElement>;

                draw(syntheticEvent);
              }}
              onTouchEnd={() => stopDrawing()}
            />
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`relative overflow-hidden mb-3 ${
                  selectedTemplate.borderStyle || ""
                }`}
                style={{ aspectRatio: "4/3" }}
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
          </div>
        </div>

        {/* Editor Panel - Single-column layout */}
        <div className="w-[400px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
          <div className="space-y-8">
            {/* Templates */}
            <div>
              <h3 className="text-gray-600 font-medium mb-3 text-sm uppercase tracking-wide">
                frame
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {templates.slice(0, 8).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-2 transition-all rounded-md
                      ${
                        selectedTemplate.id === template.id
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-xl">{template.preview}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h3 className="text-gray-600 font-medium mb-3 text-sm uppercase tracking-wide">
                background
              </h3>
              <div className="grid grid-cols-6 gap-2 p-2">
                {backgroundColors.slice(0, 10).map(({ id, color, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedBg(color);
                      setSelectedImageTemplate("");
                    }}
                    className={`group relative h-10 w-10 rounded-lg transition-all transform hover:scale-105
                      ${color} ${
                      selectedBg === color
                        ? "ring-2 ring-gray-400 scale-105"
                        : ""
                    }`}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Image Templates */}
            <div>
              <h3 className="text-gray-600 font-medium mb-3 text-sm uppercase tracking-wide">
                image templates
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {imageTemplates.map(({ id, src, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedImageTemplate(src);
                      setSelectedBg("");
                    }}
                    className={`relative h-12 w-12 rounded-md transition-all transform overflow-hidden
                      ${
                        selectedImageTemplate === src
                          ? "ring-2 ring-gray-400"
                          : ""
                      }`}
                    title={label}
                  >
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawing Tools */}
            <div>
              <h3 className="text-gray-600 font-medium mb-3 text-sm uppercase tracking-wide">
                draw
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 text-sm">Doodle Mode</label>
                  <button
                    onClick={() => setIsDoodleMode(!isDoodleMode)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      isDoodleMode
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isDoodleMode ? "On" : "Off"}
                  </button>
                </div>

                {isDoodleMode && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={undo}
                        disabled={drawHistory.length === 0}
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Undo
                      </button>
                      <button
                        onClick={redo}
                        disabled={redoHistory.length === 0}
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Redo
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-600 text-sm block">
                        Color
                      </label>
                      <input
                        type="color"
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                        className="w-full h-8 cursor-pointer rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-600 text-sm block">
                        Brush Size
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={downloadPhotoStrip}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={onReset}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                Take more pictures
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
