import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import { ShapeType } from "@/types/meme";

interface TemplateElement {
  id: number;
  type: 'text' | 'image' | 'line' | 'shape';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  // Line-specific properties
  x2?: number;
  y2?: number;
  thickness?: number;
  lineType?: 'horizontal' | 'vertical';
  // Shape-specific properties
  shapeType?: ShapeType;
  fillColor?: string;
  strokeWidth?: number;
}

interface TemplateLineControlsProps {
  elements: TemplateElement[];
  selectedElement: number | null;
  onUpdateElement: (id: number, updates: Partial<TemplateElement>) => void;
  onRemoveElement: (id: number) => void;
  onSelectElement: (id: number) => void;
}

const TemplateLineControls = ({
  elements,
  selectedElement,
  onUpdateElement,
  onRemoveElement,
  onSelectElement
}: TemplateLineControlsProps) => {
  const lineElements = elements.filter(el => el.type === 'line');
  const selectedLine = lineElements.find(el => el.id === selectedElement);

  if (lineElements.length === 0) {
    return null;
  }

  const calculateLength = (line: TemplateElement) => {
    if (!line.x2 || !line.y2) return 0;
    return Math.sqrt(Math.pow(line.x2 - line.x, 2) + Math.pow(line.y2 - line.y, 2));
  };

  const updateLength = (line: TemplateElement, newLength: number) => {
    if (!line.x2 || !line.y2) return;
    
    const currentLength = calculateLength(line);
    if (currentLength === 0) return;
    
    const ratio = newLength / currentLength;
    const centerX = (line.x + line.x2) / 2;
    const centerY = (line.y + line.y2) / 2;
    
    const deltaX = (line.x2 - line.x) * ratio / 2;
    const deltaY = (line.y2 - line.y) * ratio / 2;
    
    onUpdateElement(line.id, {
      x: centerX - deltaX,
      y: centerY - deltaY,
      x2: centerX + deltaX,
      y2: centerY + deltaY
    });
  };

  const increaseLength = () => {
    if (selectedLine) {
      const currentLength = calculateLength(selectedLine);
      updateLength(selectedLine, currentLength + 20);
    }
  };

  const decreaseLength = () => {
    if (selectedLine) {
      const currentLength = calculateLength(selectedLine);
      updateLength(selectedLine, Math.max(currentLength - 20, 20));
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg font-semibold">Line Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line List */}
        <div className="space-y-2">
          {lineElements.map((line) => (
            <div
              key={line.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedElement === line.id 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onSelectElement(line.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-white">
                  {line.lineType === 'horizontal' ? 'Horizontal' : 'Vertical'} Line #{line.id}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveElement(line.id);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Length: {Math.round(calculateLength(line))}px • 
                Thickness: {line.thickness || 2}px
              </div>
            </div>
          ))}
        </div>

        {/* Selected Line Controls */}
        {selectedLine && (
          <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
            <h4 className="font-medium text-sm text-white">
              Edit {selectedLine.lineType === 'horizontal' ? 'Horizontal' : 'Vertical'} Line
            </h4>
            
            {/* Quick Length Controls */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Quick Length Adjust</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseLength}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-300 min-w-[80px] text-center">
                  {Math.round(calculateLength(selectedLine))}px
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseLength}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Precise Length Control */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Precise Length: {Math.round(calculateLength(selectedLine))}px
              </Label>
              <Slider
                value={[Math.round(calculateLength(selectedLine))]}
                onValueChange={([value]) => updateLength(selectedLine, value)}
                max={500}
                min={20}
                step={10}
                className="w-full"
              />
            </div>
            
            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor={`line-color-${selectedLine.id}`} className="text-sm font-medium text-white">
                Color
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={`line-color-${selectedLine.id}`}
                  type="color"
                  value={selectedLine.color || '#000000'}
                  onChange={(e) => onUpdateElement(selectedLine.id, { color: e.target.value })}
                  className="w-16 h-10 border border-gray-600 bg-gray-700 cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedLine.color || '#000000'}
                  onChange={(e) => onUpdateElement(selectedLine.id, { color: e.target.value })}
                  className="flex-1 text-sm bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Thickness */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Thickness: {selectedLine.thickness || 2}px
              </Label>
              <Slider
                value={[selectedLine.thickness || 2]}
                onValueChange={([value]) => onUpdateElement(selectedLine.id, { thickness: value })}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateLineControls;