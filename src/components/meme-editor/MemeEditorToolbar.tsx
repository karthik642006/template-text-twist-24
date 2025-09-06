
import ActionToolbar from "@/components/ActionToolbar";

interface MemeEditorToolbarProps {
  onImageGenerated: (src: string) => void;
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onStyleApply: (style: string) => void;
  onTemplateSelect: (src: string) => void;
}

const MemeEditorToolbar = ({
  onImageGenerated,
  onImageSelect,
  onStyleApply,
  onTemplateSelect
}: MemeEditorToolbarProps) => {
  return (
    <div className="p-4 flex justify-center bg-white border-b border-gray-100">
      <ActionToolbar 
        onImageGenerated={onImageGenerated}
        onImageSelect={onImageSelect}
        onStyleApply={onStyleApply}
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
};

export default MemeEditorToolbar;
