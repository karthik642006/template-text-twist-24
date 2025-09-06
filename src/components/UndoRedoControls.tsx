import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";

interface UndoRedoControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedoControls = ({ onUndo, onRedo, canUndo, canRedo }: UndoRedoControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center space-x-1"
      >
        <Undo2 className="h-4 w-4" />
        <span>Undo</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRedo}
        disabled={!canRedo}
        className="flex items-center space-x-1"
      >
        <Redo2 className="h-4 w-4" />
        <span>Redo</span>
      </Button>
    </div>
  );
};

export default UndoRedoControls;