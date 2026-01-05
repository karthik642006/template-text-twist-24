import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle, Square, Triangle, Heart, Star, Type, Pencil, Image, Upload } from "lucide-react";
import { ShapeType } from "@/types/meme";

interface TextToShapeArtProps {
  onGenerateShapes: (shapes: GeneratedShapeData[]) => void;
}

export interface GeneratedShapeData {
  type: ShapeType | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  customShapeImage?: string;
}

const TextToShapeArt = ({ onGenerateShapes }: TextToShapeArtProps) => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('circle');
  const [inputText, setInputText] = useState('');
  const [shapeSize, setShapeSize] = useState(15);
  const [spacing, setSpacing] = useState(2);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<{x: number; y: number}[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customShapeImage, setCustomShapeImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const shapeInputRef = useRef<HTMLInputElement>(null);

  const shapes: { type: ShapeType; name: string; icon: React.ReactNode }[] = [
    { type: 'circle', name: 'Circle', icon: <Circle className="w-5 h-5" /> },
    { type: 'square', name: 'Square', icon: <Square className="w-5 h-5" /> },
    { type: 'triangle', name: 'Triangle', icon: <Triangle className="w-5 h-5" /> },
    { type: 'heart', name: 'Heart', icon: <Heart className="w-5 h-5" /> },
    { type: 'star', name: 'Star', icon: <Star className="w-5 h-5" /> },
  ];

  // Generate text as dots/points
  const generateTextPoints = (text: string, canvasWidth: number, canvasHeight: number): {x: number; y: number}[] => {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return [];

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    const fontSize = Math.min(canvasWidth / (text.length * 0.7), canvasHeight * 0.8);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), canvasWidth / 2, canvasHeight / 2);

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const points: {x: number; y: number}[] = [];
    const step = shapeSize + spacing;

    for (let y = 0; y < canvasHeight; y += step) {
      for (let x = 0; x < canvasWidth; x += step) {
        const i = (y * canvasWidth + x) * 4;
        if (imageData.data[i + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    return points;
  };

  // Generate points from uploaded image
  const generateImagePoints = (imageData: ImageData, canvasWidth: number, canvasHeight: number): {x: number; y: number; color: string}[] => {
    const points: {x: number; y: number; color: string}[] = [];
    const step = shapeSize + spacing;

    for (let y = 0; y < canvasHeight; y += step) {
      for (let x = 0; x < canvasWidth; x += step) {
        const i = (y * canvasWidth + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        
        if (a > 50) {
          const color = `rgb(${r},${g},${b})`;
          points.push({ x, y, color });
        }
      }
    }

    return points;
  };

  // Preview canvas for text/draw mode
  useEffect(() => {
    if (activeTab !== 'text') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let points: {x: number; y: number}[] = [];

    if (isDrawingMode && drawnPoints.length > 0) {
      points = drawnPoints;
    } else if (inputText) {
      points = generateTextPoints(inputText, canvas.width, canvas.height);
    }

    points.forEach(point => {
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      const size = shapeSize / 2;
      drawShapeAtPoint(ctx, point.x, point.y, size, selectedShape);
    });
  }, [inputText, selectedShape, shapeSize, spacing, fillColor, strokeColor, isDrawingMode, drawnPoints, activeTab]);

  // Preview canvas for image mode
  useEffect(() => {
    if (activeTab !== 'image' || !uploadedImage) return;
    
    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image to get pixel data
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      tempCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const points = generateImagePoints(imageData, canvas.width, canvas.height);

      points.forEach(point => {
        ctx.fillStyle = point.color;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.5;
        const size = shapeSize / 2;
        
        if (customShapeImage && activeTab === 'image') {
          // Draw custom shape
          const customImg = new window.Image();
          customImg.src = customShapeImage;
          ctx.drawImage(customImg, point.x, point.y, shapeSize, shapeSize);
        } else {
          drawShapeAtPoint(ctx, point.x, point.y, size, selectedShape);
        }
      });
    };
    img.src = uploadedImage;
  }, [uploadedImage, selectedShape, shapeSize, spacing, strokeColor, activeTab, customShapeImage]);

  const drawShapeAtPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: ShapeType) => {
    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + size, y + size, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'square':
        ctx.fillRect(x, y, size * 2, size * 2);
        ctx.strokeRect(x, y, size * 2, size * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size * 2, y + size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'heart':
        drawHeart(ctx, x + size, y + size, size);
        break;
      case 'star':
        drawStar(ctx, x + size, y + size, size);
        break;
      default:
        ctx.beginPath();
        ctx.arc(x + size, y + size, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size / 2);
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.2, x, y + size * 1.2);
    ctx.bezierCurveTo(x, y + size * 1.2, x + size, y + size, x + size, y + size / 2);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size / 4);
    ctx.fill();
    ctx.stroke();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Drawing mode handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    isDrawing.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawnPoints([{ x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !isDrawing.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const step = shapeSize + spacing;
    const lastPoint = drawnPoints[drawnPoints.length - 1];
    if (lastPoint && Math.hypot(x - lastPoint.x, y - lastPoint.y) >= step) {
      setDrawnPoints(prev => [...prev, { x, y }]);
    }
  };

  const handleCanvasMouseUp = () => {
    isDrawing.current = false;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomShapeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomShapeImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (activeTab === 'text') {
      generateFromText();
    } else if (activeTab === 'image') {
      generateFromImage();
    } else if (activeTab === 'customShape') {
      generateFromText(); // Uses custom shape with text
    }
  };

  const generateFromText = () => {
    let points: {x: number; y: number}[] = [];
    const canvas = canvasRef.current;
    
    if (isDrawingMode && drawnPoints.length > 0) {
      points = drawnPoints;
    } else if (inputText && canvas) {
      points = generateTextPoints(inputText, canvas.width, canvas.height);
    }

    if (points.length === 0) return;

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    
    const pointsWidth = maxX - minX + shapeSize;
    const pointsHeight = maxY - minY + shapeSize;
    
    const maxWidth = 600;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / pointsWidth, maxHeight / pointsHeight, 1.5);
    
    const offsetX = 20;
    const offsetY = 20;

    const generatedShapes: GeneratedShapeData[] = points.map(point => ({
      type: customShapeImage && activeTab === 'customShape' ? 'custom' as const : selectedShape,
      x: (point.x - minX) * scale + offsetX,
      y: (point.y - minY) * scale + offsetY,
      width: shapeSize * scale,
      height: shapeSize * scale,
      strokeColor,
      fillColor,
      strokeWidth: 1,
      customShapeImage: customShapeImage && activeTab === 'customShape' ? customShapeImage : undefined
    }));

    onGenerateShapes(generatedShapes);
  };

  const generateFromImage = () => {
    if (!uploadedImage) return;
    
    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    
    const img = new window.Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      tempCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const points = generateImagePoints(imageData, canvas.width, canvas.height);

      if (points.length === 0) return;

      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      const minY = Math.min(...points.map(p => p.y));
      const maxY = Math.max(...points.map(p => p.y));
      
      const pointsWidth = maxX - minX + shapeSize;
      const pointsHeight = maxY - minY + shapeSize;
      
      const maxWidth = 600;
      const maxHeight = 400;
      const scaleOutput = Math.min(maxWidth / pointsWidth, maxHeight / pointsHeight, 1.5);
      
      const outputOffsetX = 20;
      const outputOffsetY = 20;

      const generatedShapes: GeneratedShapeData[] = points.map(point => ({
        type: customShapeImage ? 'custom' as const : selectedShape,
        x: (point.x - minX) * scaleOutput + outputOffsetX,
        y: (point.y - minY) * scaleOutput + outputOffsetY,
        width: shapeSize * scaleOutput,
        height: shapeSize * scaleOutput,
        strokeColor,
        fillColor: point.color,
        strokeWidth: 0.5,
        customShapeImage: customShapeImage || undefined
      }));

      onGenerateShapes(generatedShapes);
    };
    img.src = uploadedImage;
  };

  const clearAll = () => {
    setDrawnPoints([]);
    setInputText('');
    setUploadedImage(null);
    setCustomShapeImage(null);
  };

  const renderShapeSelector = () => (
    <div className="space-y-2">
      <Label>Select Shape</Label>
      <div className="flex gap-2 flex-wrap">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            onClick={() => setSelectedShape(shape.type)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
              selectedShape === shape.type && !customShapeImage
                ? 'border-purple-500 bg-purple-100 text-purple-700'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {shape.icon}
            <span>{shape.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderControls = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Shape Size: {shapeSize}px</Label>
          <Slider
            value={[shapeSize]}
            onValueChange={(v) => setShapeSize(v[0])}
            min={5}
            max={30}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Spacing: {spacing}px</Label>
          <Slider
            value={[spacing]}
            onValueChange={(v) => setSpacing(v[0])}
            min={0}
            max={20}
            step={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fill Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Stroke Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-purple-900">Create Your Own Shapes</h4>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="text-xs">
            <Type className="w-3 h-3 mr-1" />
            Enter Text
          </TabsTrigger>
          <TabsTrigger value="image" className="text-xs">
            <Image className="w-3 h-3 mr-1" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="customShape" className="text-xs">
            <Upload className="w-3 h-3 mr-1" />
            Upload Shape
          </TabsTrigger>
        </TabsList>

        {/* Enter Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter text or draw to create art made from shapes!
          </p>

          <div className="flex gap-2">
            <Button
              variant={!isDrawingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDrawingMode(false)}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-1" />
              Text Mode
            </Button>
            <Button
              variant={isDrawingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDrawingMode(true)}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Draw Mode
            </Button>
          </div>

          {renderShapeSelector()}

          {!isDrawingMode ? (
            <div className="space-y-2">
              <Label>Enter Text</Label>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type letters (e.g., K, LOVE, HI)"
                className="text-lg font-bold"
                maxLength={10}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Draw Your Shape</Label>
              <p className="text-xs text-muted-foreground">Click and drag to draw</p>
            </div>
          )}

          <div className="border-2 border-dashed border-purple-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="w-full cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </div>

          {renderControls()}
        </TabsContent>

        {/* Upload Image Tab */}
        <TabsContent value="image" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload an image to create a mosaic made from shapes!
          </p>

          <div className="space-y-2">
            <Label>Upload Image</Label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              className="w-full"
            >
              <Image className="w-4 h-4 mr-2" />
              {uploadedImage ? 'Change Image' : 'Select Image'}
            </Button>
          </div>

          {renderShapeSelector()}

          {/* Optional: Use custom shape for mosaic */}
          <div className="space-y-2 p-3 bg-white/50 rounded-lg">
            <Label className="text-sm">Optional: Use Custom Shape</Label>
            <input
              ref={shapeInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomShapeUpload}
              className="hidden"
            />
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shapeInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-1" />
                {customShapeImage ? 'Change Shape' : 'Upload Shape Image'}
              </Button>
              {customShapeImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomShapeImage(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            {customShapeImage && (
              <div className="flex items-center gap-2 mt-2">
                <img src={customShapeImage} alt="Custom shape" className="w-10 h-10 object-contain border rounded" />
                <span className="text-xs text-muted-foreground">Using custom shape</span>
              </div>
            )}
          </div>

          <div className="border-2 border-dashed border-purple-300 rounded-lg overflow-hidden">
            <canvas
              ref={imageCanvasRef}
              width={400}
              height={200}
              className="w-full"
            />
          </div>

          {renderControls()}
        </TabsContent>

        {/* Upload Custom Shape Tab */}
        <TabsContent value="customShape" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your own shape image to use for creating text art!
          </p>

          <div className="space-y-2">
            <Label>Upload Your Shape</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomShapeUpload}
              className="hidden"
              id="customShapeInput"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('customShapeInput')?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {customShapeImage ? 'Change Shape Image' : 'Select Shape Image'}
            </Button>
            {customShapeImage && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-white/50 rounded-lg">
                <img src={customShapeImage} alt="Custom shape" className="w-12 h-12 object-contain border rounded" />
                <span className="text-sm text-muted-foreground">Your custom shape will be used</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={!isDrawingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDrawingMode(false)}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-1" />
              Text Mode
            </Button>
            <Button
              variant={isDrawingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDrawingMode(true)}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Draw Mode
            </Button>
          </div>

          {!isDrawingMode ? (
            <div className="space-y-2">
              <Label>Enter Text</Label>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type letters (e.g., K, LOVE, HI)"
                className="text-lg font-bold"
                maxLength={10}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Draw Your Shape</Label>
              <p className="text-xs text-muted-foreground">Click and drag to draw</p>
            </div>
          )}

          <div className="border-2 border-dashed border-purple-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="w-full cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shape Size: {shapeSize}px</Label>
              <Slider
                value={[shapeSize]}
                onValueChange={(v) => setShapeSize(v[0])}
                min={5}
                max={30}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Spacing: {spacing}px</Label>
              <Slider
                value={[spacing]}
                onValueChange={(v) => setSpacing(v[0])}
                min={0}
                max={20}
                step={1}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={clearAll}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={
            (activeTab === 'text' && !inputText && drawnPoints.length === 0) ||
            (activeTab === 'image' && !uploadedImage) ||
            (activeTab === 'customShape' && (!customShapeImage || (!inputText && drawnPoints.length === 0)))
          }
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Add to Template
        </Button>
      </div>
    </div>
  );
};

export default TextToShapeArt;
