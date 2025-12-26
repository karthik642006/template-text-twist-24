import { forwardRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MemeCanvas from "@/components/MemeCanvas";
import { TextField, ImageField, ShapeField } from "@/types/meme";
interface MemeEditorCanvasProps {
  templateImage: string;
  imageStyle: string;
  textFields: TextField[];
  imageFields: ImageField[];
  shapeFields: ShapeField[];
  selectedTextId: number;
  selectedImageId: number | null;
  selectedShapeId: number | null;
  onMouseDown: (e: React.MouseEvent, elementId: number, elementType: 'text' | 'image' | 'shape') => void;
  onTouchStart: (e: React.TouchEvent, elementId: number, elementType: 'text' | 'image' | 'shape') => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

// Configuration object for easy editing of canvas styling
export const CANVAS_CONFIG = {
  // Container padding and margins - REMOVED EXTRA SPACING
  containerMargins: {
    left: '0px',
    right: '0px',
    // Fixed: removed extra right space
    top: '0px',
    // Fixed: removed top padding
    bottom: '0px' // Fixed: removed bottom padding
  },
  // Main canvas container padding - MINIMIZED FOR EXACT MATCH
  canvasContainer: {
    paddingX: '0px',
    // Fixed: removed horizontal padding
    paddingY: '0px' // Fixed: removed vertical padding
  },
  // Text area configuration
  textArea: {
    // Header text styling
    header: {
      padding: '3px 5px',
      textAlign: 'left' as const,
      borderWidth: '2px',
      fontSize: 0.4,
      // multiplier for fontSize
      fontWeight: '900'
    },
    // Footer text styling  
    footer: {
      padding: '3px 5px',
      textAlign: 'left' as const,
      borderWidth: '2px',
      fontSize: 0.4,
      // multiplier for fontSize
      fontWeight: '900'
    },
    // Regular text styling
    regular: {
      fontSize: 0.4,
      // multiplier for fontSize
      fontWeight: '900'
    }
  },
  // Canvas background and spacing - OPTIMIZED FOR DOWNLOAD MATCH
  canvas: {
    backgroundColor: 'bg-white',
    // Fixed: white background to match download
    minHeight: 'auto' // Fixed: auto height to fit content exactly
  }
};
const MemeEditorCanvas = forwardRef<HTMLDivElement, MemeEditorCanvasProps>(({
  templateImage,
  imageStyle,
  textFields,
  imageFields,
  shapeFields,
  selectedTextId,
  selectedImageId,
  selectedShapeId,
  onMouseDown,
  onTouchStart,
  onMouseMove,
  onMouseUp,
  onTouchMove,
  onTouchEnd
}, ref) => {
  return <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="rounded-sm">
        <div className={`flex items-center justify-center ${CANVAS_CONFIG.canvas.backgroundColor} p-4`} style={{
        minHeight: CANVAS_CONFIG.canvas.minHeight
      }}>
          <div className="w-full max-w-lg border-0">
            <MemeCanvas ref={ref} templateImage={templateImage} imageStyle={imageStyle} textFields={textFields} imageFields={imageFields} lineFields={[]} shapeFields={shapeFields} selectedTextId={selectedTextId} selectedImageId={selectedImageId} selectedLineId={null} selectedShapeId={selectedShapeId} onMouseDown={onMouseDown} onTouchStart={onTouchStart} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />
          </div>
        </div>
      </div>
    </ScrollArea>;
});
MemeEditorCanvas.displayName = "MemeEditorCanvas";
export default MemeEditorCanvas;