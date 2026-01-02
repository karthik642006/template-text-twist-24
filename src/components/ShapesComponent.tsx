import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shapes, Circle, Square, Triangle, Pentagon, Minus, Palette, Sparkles } from "lucide-react";
import { ShapeType } from "@/types/meme";
import TextToShapeArt, { GeneratedShapeData } from "./TextToShapeArt";

interface ShapesComponentProps {
  onShapeSelect: (type: ShapeType, color: string, fillColor: string, strokeWidth: number) => void;
  onBulkShapeAdd?: (shapes: GeneratedShapeData[]) => void;
}

const ShapesComponent = ({ onShapeSelect, onBulkShapeAdd }: ShapesComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const shapes: { type: ShapeType; name: string; icon: React.ReactNode }[] = [
    { type: 'line', name: 'Line', icon: <Minus className="w-8 h-8" /> },
    { type: 'circle', name: 'Circle', icon: <Circle className="w-8 h-8" /> },
    { type: 'square', name: 'Square', icon: <Square className="w-8 h-8" /> },
    { type: 'rectangle', name: 'Rectangle', icon: <div className="w-10 h-6 border-2 border-current rounded-sm" /> },
    { type: 'triangle', name: 'Triangle', icon: <Triangle className="w-8 h-8" /> },
    { type: 'pentagon', name: 'Pentagon', icon: <Pentagon className="w-8 h-8" /> },
  ];

  const handleShapeClick = (type: ShapeType) => {
    setSelectedShape(type);
  };

  const handleAddShape = () => {
    if (selectedShape) {
      onShapeSelect(selectedShape, strokeColor, fillColor, strokeWidth);
      setIsOpen(false);
      setSelectedShape(null);
    }
  };

  const handleQuickAdd = (type: ShapeType) => {
    onShapeSelect(type, strokeColor, fillColor, strokeWidth);
    setIsOpen(false);
  };

  const handleBulkShapeGenerate = (shapes: GeneratedShapeData[]) => {
    if (onBulkShapeAdd) {
      onBulkShapeAdd(shapes);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none hover:from-blue-600 hover:to-cyan-600 text-xs px-2 h-8"
        >
          <Shapes className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Shapes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shapes className="w-5 h-5 text-blue-500" />
            Add Shapes
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Customized Shapes
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create Your Own
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-6">
            {/* Shape Selection Grid */}
            <div>
              <h4 className="font-medium mb-3">Choose a Shape</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {shapes.map((shape) => (
                  <button
                    key={shape.type}
                    onClick={() => handleShapeClick(shape.type)}
                    onDoubleClick={() => handleQuickAdd(shape.type)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                      selectedShape === shape.type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    {shape.icon}
                    <span className="text-xs mt-2">{shape.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to select, double-click to quick add</p>
            </div>

            {/* Shape Customization */}
            {selectedShape && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Customize Shape</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strokeColor">Stroke Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="strokeColor"
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

                  <div className="space-y-2">
                    <Label htmlFor="fillColor">Fill Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="fillColor"
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
                </div>

                <div className="space-y-2">
                  <Label>Stroke Width: {strokeWidth}px</Label>
                  <Slider
                    value={[strokeWidth]}
                    onValueChange={(value) => setStrokeWidth(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h5 className="text-sm font-medium mb-2">Preview</h5>
                  <div className="flex items-center justify-center h-24">
                    <svg width="100" height="80" viewBox="0 0 100 80">
                      {selectedShape === 'line' && (
                        <line x1="10" y1="40" x2="90" y2="40" stroke={strokeColor} strokeWidth={strokeWidth} />
                      )}
                      {selectedShape === 'circle' && (
                        <circle cx="50" cy="40" r="30" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                      )}
                      {selectedShape === 'square' && (
                        <rect x="20" y="10" width="60" height="60" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                      )}
                      {selectedShape === 'rectangle' && (
                        <rect x="10" y="20" width="80" height="40" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                      )}
                      {selectedShape === 'triangle' && (
                        <polygon points="50,5 90,75 10,75" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                      )}
                      {selectedShape === 'pentagon' && (
                        <polygon 
                          points="50,5 95,32 77,75 23,75 5,32" 
                          fill={fillColor} 
                          stroke={strokeColor} 
                          strokeWidth={strokeWidth} 
                        />
                      )}
                    </svg>
                  </div>
                </div>

                <Button 
                  onClick={handleAddShape}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Add {shapes.find(s => s.type === selectedShape)?.name} to Template
                </Button>
              </div>
            )}

            {/* Custom Shape Creator Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Tips</h4>
              <p className="text-sm text-gray-600">
                After adding a shape, you can drag it to position, resize using the controls, 
                and rotate it to create unique designs. Combine multiple shapes to create complex graphics!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <TextToShapeArt onGenerateShapes={handleBulkShapeGenerate} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShapesComponent;
