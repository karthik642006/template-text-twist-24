
import ImageGenerator from "./ImageGenerator";
import UploadComponent from "./UploadComponent";
import EmojiSelector from "./EmojiSelector";
import StyleComponent from "./StyleComponent";
import AddImageComponent from "./AddImageComponent";
import ShapesComponent from "./ShapesComponent";
import ShareComponent from "./ShareComponent";
import DownloadComponent from "./DownloadComponent";
import { ShapeType } from "@/types/meme";

interface ActionToolbarProps {
  onImageGenerated: (src: string) => void;
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onStyleApply: (style: string) => void;
  onTemplateSelect?: (src: string) => void;
  onShapeSelect?: (type: ShapeType, color: string, fillColor: string, strokeWidth: number) => void;
}

const ActionToolbar = ({ onImageGenerated, onImageSelect, onStyleApply, onTemplateSelect, onShapeSelect }: ActionToolbarProps) => {
  return (
    <div className="mb-4 flex gap-2 justify-center flex-wrap">
      <ImageGenerator onImageGenerated={onImageGenerated} />
      <UploadComponent onImageSelect={onImageSelect} onTemplateSelect={onTemplateSelect} />
      <EmojiSelector onEmojiSelect={(emoji) => onImageSelect(emoji, 'emoji')} />
      <StyleComponent onStyleApply={onStyleApply} />
      <AddImageComponent onImageSelect={onImageSelect} />
      {onShapeSelect && <ShapesComponent onShapeSelect={onShapeSelect} />}
      <ShareComponent />
      <DownloadComponent />
    </div>
  );
};

export default ActionToolbar;
