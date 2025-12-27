
import { Button } from "@/components/ui/button";
import { TextField, ImageField, ShapeField } from "@/types/meme";
import ElementControls from "@/components/ElementControls";
import TextFieldControls from "@/components/TextFieldControls";
import ImageFieldControls from "@/components/ImageFieldControls";

interface MemeEditorControlsProps {
  textFields: TextField[];
  imageFields: ImageField[];
  selectedText?: TextField;
  selectedImage?: ImageField;
  selectedShape?: ShapeField;
  selectedTextId: number;
  selectedImageId: number | null;
  onUpdateTextField: (id: number, updates: Partial<TextField>) => void;
  onUpdateImageField: (id: number, updates: Partial<ImageField>) => void;
  onRemoveTextField: (id: number) => void;
  onRemoveImageField: (id: number) => void;
  onSelectTextField: (id: number) => void;
  onSelectImageField: (id: number) => void;
  onAddTextField: (type?: 'text' | 'header' | 'footer') => void;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onUpdateElement?: (updates: Partial<ImageField>) => void;
  onUploadImage?: () => void;
}

const MemeEditorControls = ({
  textFields,
  imageFields,
  selectedText,
  selectedImage,
  selectedShape,
  selectedTextId,
  selectedImageId,
  onUpdateTextField,
  onUpdateImageField,
  onRemoveTextField,
  onRemoveImageField,
  onSelectTextField,
  onSelectImageField,
  onAddTextField,
  onRotate,
  onScaleUp,
  onScaleDown,
  onUpdateElement,
  onUploadImage
}: MemeEditorControlsProps) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 sm:p-6 space-y-6">
      <ElementControls
        selectedText={selectedText}
        selectedImage={selectedImage}
        selectedShape={selectedShape}
        onRotate={onRotate}
        onScaleUp={onScaleUp}
        onScaleDown={onScaleDown}
        onUpdateElement={onUpdateElement || (() => {})}
        onUploadImage={onUploadImage || (() => {})}
      />

      <TextFieldControls
        textFields={textFields}
        selectedTextId={selectedTextId}
        onUpdateField={onUpdateTextField}
        onRemoveField={onRemoveTextField}
        onSelectField={onSelectTextField}
      />

      <ImageFieldControls
        imageFields={imageFields}
        selectedImageId={selectedImageId}
        onUpdateField={onUpdateImageField}
        onRemoveField={onRemoveImageField}
        onSelectField={onSelectImageField}
      />

      {/* Add New Elements */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => onAddTextField('text')} className="bg-blue-600 hover:bg-blue-700 text-white">
          + New text
        </Button>
        <Button onClick={() => onAddTextField('header')} variant="outline" className="border-purple-300 text-purple-700" disabled={textFields.some(field => field.type === 'header')}>
          + Header
        </Button>
        <Button onClick={() => onAddTextField('footer')} variant="outline" className="border-purple-300 text-purple-700" disabled={textFields.some(field => field.type === 'footer')}>
          + Footer
        </Button>
      </div>
    </div>
  );
};

export default MemeEditorControls;
