
import ActionToolbar from "@/components/ActionToolbar";
import { ShapeType } from "@/types/meme";

interface MemeEditorToolbarProps {
  onImageGenerated: (src: string) => void;
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onStyleApply: (style: string) => void;
  onTemplateSelect: (src: string) => void;
  onShapeSelect?: (type: ShapeType, color: string, fillColor: string, strokeWidth: number) => void;
}

const MemeEditorToolbar = ({
  onImageGenerated,
  onImageSelect,
  onStyleApply,
  onTemplateSelect,
  onShapeSelect
}: MemeEditorToolbarProps) => {
  return (
    <div className="p-4 flex justify-center bg-white border-b border-gray-100">
      <ActionToolbar 
        onImageGenerated={onImageGenerated}
        onImageSelect={onImageSelect}
        onStyleApply={onStyleApply}
        onTemplateSelect={onTemplateSelect}
        onShapeSelect={onShapeSelect}
      />
    </div>
  );
};

export default MemeEditorToolbar;
