import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Circle, Square, Triangle, Pentagon, Minus, Heart, Star, Type, Pencil } from "lucide-react";
import { ShapeType } from "@/types/meme";

interface TextToShapeArtProps {
  onGenerateShapes: (shapes: GeneratedShapeData[]) => void;
}

export interface GeneratedShapeData {
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

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

    // Calculate font size based on text length and canvas size
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

  // Preview canvas
  useEffect(() => {
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

    // Draw shapes at each point
    points.forEach(point => {
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;

      const size = shapeSize / 2;

      switch (selectedShape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(point.x + size, point.y + size, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'square':
          ctx.fillRect(point.x, point.y, shapeSize, shapeSize);
          ctx.strokeRect(point.x, point.y, shapeSize, shapeSize);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(point.x + size, point.y);
          ctx.lineTo(point.x + shapeSize, point.y + shapeSize);
          ctx.lineTo(point.x, point.y + shapeSize);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'heart':
          drawHeart(ctx, point.x + size, point.y + size, size);
          break;
        case 'star':
          drawStar(ctx, point.x + size, point.y + size, size);
          break;
        default:
          ctx.beginPath();
          ctx.arc(point.x + size, point.y + size, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
      }
    });
  }, [inputText, selectedShape, shapeSize, spacing, fillColor, strokeColor, isDrawingMode, drawnPoints]);

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

  const handleGenerate = () => {
    let points: {x: number; y: number}[] = [];
    const canvas = canvasRef.current;
    
    if (isDrawingMode && drawnPoints.length > 0) {
      points = drawnPoints;
    } else if (inputText && canvas) {
      points = generateTextPoints(inputText, canvas.width, canvas.height);
    }

    if (points.length === 0) return;

    // Scale points to fit template (1080x850)
    const scaleX = 800 / (canvas?.width || 400);
    const scaleY = 600 / (canvas?.height || 200);
    const offsetX = 140;
    const offsetY = 125;

    const generatedShapes: GeneratedShapeData[] = points.map(point => ({
      type: selectedShape,
      x: point.x * scaleX + offsetX,
      y: point.y * scaleY + offsetY,
      width: shapeSize * 2,
      height: shapeSize * 2,
      strokeColor,
      fillColor,
      strokeWidth: 1
    }));

    onGenerateShapes(generatedShapes);
  };

  const clearDrawing = () => {
    setDrawnPoints([]);
    setInputText('');
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-purple-900">Create Your Own Shapes</h4>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Enter text or draw to create art made from shapes!
      </p>

      {/* Mode Toggle */}
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

      {/* Shape Selection */}
      <div className="space-y-2">
        <Label>Select Shape</Label>
        <div className="flex gap-2 flex-wrap">
          {shapes.map((shape) => (
            <button
              key={shape.type}
              onClick={() => setSelectedShape(shape.type)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                selectedShape === shape.type
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

      {/* Text Input or Draw Canvas */}
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

      {/* Preview Canvas */}
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

      {/* Controls */}
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

      {/* Colors */}
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={clearDrawing}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!inputText && drawnPoints.length === 0}
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Add to Template
        </Button>
      </div>
    </div>
  );
};

export default TextToShapeArt;
