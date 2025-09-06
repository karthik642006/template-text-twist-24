
import ImageGenerator from "./ImageGenerator";
import UploadComponent from "./UploadComponent";
import EmojiSelector from "./EmojiSelector";
import StyleComponent from "./StyleComponent";
import AddImageComponent from "./AddImageComponent";
import ShareComponent from "./ShareComponent";
import DownloadComponent from "./DownloadComponent";

interface ActionToolbarProps {
  onImageGenerated: (src: string) => void;
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onStyleApply: (style: string) => void;
  onTemplateSelect?: (src: string) => void;
}

const ActionToolbar = ({ onImageGenerated, onImageSelect, onStyleApply, onTemplateSelect }: ActionToolbarProps) => {
  return (
    <div className="mb-4 flex gap-2 justify-center">
      <ImageGenerator onImageGenerated={onImageGenerated} />
      <UploadComponent onImageSelect={onImageSelect} onTemplateSelect={onTemplateSelect} />
      <EmojiSelector onEmojiSelect={(emoji) => onImageSelect(emoji, 'emoji')} />
      <StyleComponent onStyleApply={onStyleApply} />
      <AddImageComponent onImageSelect={onImageSelect} />
      <ShareComponent />
      <DownloadComponent />
    </div>
  );
};

export default ActionToolbar;
