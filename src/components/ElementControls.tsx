import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { TextField, ImageField } from "@/types/meme";
interface ElementControlsProps {
  selectedText: TextField | undefined;
  selectedImage: ImageField | undefined;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
}
const ElementControls = ({
  selectedText,
  selectedImage,
  onRotate,
  onScaleUp,
  onScaleDown
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
        {selectedText ? `Selected: Text Element` : selectedImage ? `Selected: Image Element` : 'Transform tools available'}
      </p>
    </div>;
};
export default ElementControls;