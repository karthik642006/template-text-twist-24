import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut, Upload } from "lucide-react";
import { TextField, ImageField, ShapeField } from "@/types/meme";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface ElementControlsProps {
  selectedText: TextField | undefined;
  selectedImage: (ImageField & { isLogo?: boolean, borderColor?: string, borderWidth?: number, shadow?: boolean }) | undefined;
  selectedShape: ShapeField | undefined;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onUpdateElement: (updates: Partial<ImageField & { isLogo?: boolean, borderColor?: string, borderWidth?: number, shadow?: boolean }>) => void;
  onUploadImage: () => void;
}

const ElementControls = ({
  selectedText,
  selectedImage,
  selectedShape,
  onRotate,
  onScaleUp,
  onScaleDown,
  onUpdateElement,
  onUploadImage,
}: ElementControlsProps) => {
  return <div className="space-y-2 p-2 sm:p-3 bg-card border border-border rounded-lg">
      <h4 className="font-medium text-card-foreground text-xs sm:text-sm">Element Controls</h4>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        <Button onClick={onRotate} variant="outline" size="sm" className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm min-h-[32px] sm:min-h-auto">
          <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Rotate</span>
        </Button>
        <Button onClick={onScaleUp} variant="outline" size="sm" className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm min-h-[32px] sm:min-h-auto">
          <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Scale +</span>
        </Button>
        <Button onClick={onScaleDown} variant="outline" size="sm" className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-2 sm:text-sm min-h-[32px] sm:min-h-auto text-xs">
          <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Scale -</span>
        </Button>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        {selectedText ? `Selected: Text Element` : selectedImage ? `Selected: Image Element` : selectedShape ? `Selected: Shape Element` : 'Transform tools available'}
      </p>
      {selectedImage?.isLogo && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h5 className="font-medium text-card-foreground text-xs sm:text-sm">Logo Controls</h5>
          <div>
            <label className="text-sm text-gray-400">Border Color</label>
            <Input
              type="color"
              value={selectedImage.borderColor || '#000000'}
              onChange={(e) => onUpdateElement({ borderColor: e.target.value })}
              className="bg-gray-700 border-gray-600 mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Border Width</label>
            <Slider
              value={[selectedImage.borderWidth || 0]}
              onValueChange={([value]) => onUpdateElement({ borderWidth: value })}
              max={20}
              min={0}
              step={1}
              className="w-full mt-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shadow"
              checked={selectedImage.shadow}
              onCheckedChange={(checked) => onUpdateElement({ shadow: !!checked })}
            />
            <label
              htmlFor="shadow"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add Drop Shadow
            </label>
          </div>
        </div>
      )}
      {selectedShape && (
        <div className="space-y-4 pt-4 border-t border-border">
          <Button onClick={onUploadImage} className="w-full bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Image into Shape
          </Button>
        </div>
      )}
    </div>;
};
export default ElementControls;