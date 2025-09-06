import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import { LineField } from "@/types/meme";

interface LineFieldControlsProps {
  lineFields: LineField[];
  selectedLineId: number | null;
  onUpdateField: (id: number, updates: Partial<LineField>) => void;
  onRemoveField: (id: number) => void;
  onSelectField: (id: number) => void;
}

const LineFieldControls = ({
  lineFields,
  selectedLineId,
  onUpdateField,
  onRemoveField,
  onSelectField
}: LineFieldControlsProps) => {
  const selectedLine = lineFields.find(field => field.id === selectedLineId);

  if (lineFields.length === 0) {
    return null;
  }

  const calculateLength = (line: LineField) => {
    return Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
  };

  const updateLength = (line: LineField, newLength: number) => {
    const currentLength = calculateLength(line);
    if (currentLength === 0) return;
    
    const ratio = newLength / currentLength;
    const centerX = (line.x1 + line.x2) / 2;
    const centerY = (line.y1 + line.y2) / 2;
    
    const deltaX = (line.x2 - line.x1) * ratio / 2;
    const deltaY = (line.y2 - line.y1) * ratio / 2;
    
    onUpdateField(line.id, {
      x1: centerX - deltaX,
      y1: centerY - deltaY,
      x2: centerX + deltaX,
      y2: centerY + deltaY
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Line Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line List */}
        <div className="space-y-2">
          {lineFields.map((line) => (
            <div
              key={line.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedLineId === line.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectField(line.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  {line.type === 'horizontal' ? 'Horizontal' : 'Vertical'} Line #{line.id}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveField(line.id);
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Line Controls */}
        {selectedLine && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">
              Edit {selectedLine.type === 'horizontal' ? 'Horizontal' : 'Vertical'} Line
            </h4>
            
            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor={`line-color-${selectedLine.id}`} className="text-sm font-medium">
                Color
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={`line-color-${selectedLine.id}`}
                  type="color"
                  value={selectedLine.color}
                  onChange={(e) => onUpdateField(selectedLine.id, { color: e.target.value })}
                  className="w-16 h-10 border rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedLine.color}
                  onChange={(e) => onUpdateField(selectedLine.id, { color: e.target.value })}
                  className="flex-1 text-sm"
                />
              </div>
            </div>

            {/* Thickness */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thickness: {selectedLine.thickness}px</Label>
              <Slider
                value={[selectedLine.thickness]}
                onValueChange={([value]) => onUpdateField(selectedLine.id, { thickness: value })}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Length */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Length: {Math.round(calculateLength(selectedLine))}%
              </Label>
              <Slider
                value={[Math.round(calculateLength(selectedLine))]}
                onValueChange={([value]) => updateLength(selectedLine, value)}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Opacity: {selectedLine.opacity}%</Label>
              <Slider
                value={[selectedLine.opacity]}
                onValueChange={([value]) => onUpdateField(selectedLine.id, { opacity: value })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start X: {Math.round(selectedLine.x1)}%</Label>
                <Slider
                  value={[selectedLine.x1]}
                  onValueChange={([value]) => onUpdateField(selectedLine.id, { x1: value })}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Y: {Math.round(selectedLine.y1)}%</Label>
                <Slider
                  value={[selectedLine.y1]}
                  onValueChange={([value]) => onUpdateField(selectedLine.id, { y1: value })}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End X: {Math.round(selectedLine.x2)}%</Label>
                <Slider
                  value={[selectedLine.x2]}
                  onValueChange={([value]) => onUpdateField(selectedLine.id, { x2: value })}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Y: {Math.round(selectedLine.y2)}%</Label>
                <Slider
                  value={[selectedLine.y2]}
                  onValueChange={([value]) => onUpdateField(selectedLine.id, { y2: value })}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LineFieldControls;