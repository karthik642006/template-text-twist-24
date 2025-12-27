import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Pencil, Eraser, Undo2, Trash2, Check, X } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface FreehandDrawingProps {
  onSave: (strokes: Stroke[], svgPath: string) => void;
  onCancel: () => void;
  width: number;
  height: number;
  initialStrokes?: Stroke[];
}

export const FreehandDrawing = ({
  onSave,
  onCancel,
  width,
  height,
  initialStrokes = []
}: FreehandDrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const drawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all completed strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach((point, i) => {
        if (i > 0) ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Draw current stroke
    if (currentStroke.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : strokeColor;
      ctx.lineWidth = tool === 'eraser' ? strokeWidth * 2 : strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach((point, i) => {
        if (i > 0) ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [strokes, currentStroke, strokeColor, strokeWidth, tool]);

  useEffect(() => {
    drawStrokes();
  }, [drawStrokes]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCoordinates(e);
    if (point) {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const point = getCoordinates(e);
    if (point) {
      setCurrentStroke(prev => [...prev, point]);
    }
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentStroke.length >= 2) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: tool === 'eraser' ? '#FFFFFF' : strokeColor,
        width: tool === 'eraser' ? strokeWidth * 2 : strokeWidth
      };
      setStrokes(prev => [...prev, newStroke]);
    }
    setCurrentStroke([]);
  };

  const handleUndo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  const generateSVGPath = (): string => {
    if (strokes.length === 0) return '';
    
    let pathData = '';
    strokes.forEach(stroke => {
      if (stroke.points.length >= 2) {
        pathData += `M ${stroke.points[0].x},${stroke.points[0].y} `;
        stroke.points.slice(1).forEach(p => {
          pathData += `L ${p.x},${p.y} `;
        });
      }
    });
    return pathData.trim();
  };

  const handleSave = () => {
    const svgPath = generateSVGPath();
    onSave(strokes, svgPath);
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className={tool === 'pen' ? 'bg-blue-600' : ''}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Draw
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className={tool === 'eraser' ? 'bg-blue-600' : ''}
          >
            <Eraser className="w-4 h-4 mr-1" />
            Erase
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={strokes.length === 0}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={strokes.length === 0}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-400">Color:</label>
          <Input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-10 h-8 p-0 border-0 cursor-pointer"
            disabled={tool === 'eraser'}
          />
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <label className="text-sm text-gray-400 whitespace-nowrap">Width:</label>
          <Slider
            value={[strokeWidth]}
            onValueChange={([value]) => setStrokeWidth(value)}
            min={1}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-6">{strokeWidth}</span>
        </div>
      </div>

      <div className="border-2 border-gray-600 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-1" />
          Save Drawing
        </Button>
      </div>
    </div>
  );
};

export default FreehandDrawing;
