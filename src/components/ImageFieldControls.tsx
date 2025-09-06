
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageField } from "@/types/meme";

interface ImageFieldControlsProps {
  imageFields: ImageField[];
  selectedImageId: number | null;
  onUpdateField: (id: number, updates: Partial<ImageField>) => void;
  onRemoveField: (id: number) => void;
  onSelectField: (id: number) => void;
}

const ImageFieldControls = ({ 
  imageFields, 
  selectedImageId, 
  onUpdateField, 
  onRemoveField, 
  onSelectField 
}: ImageFieldControlsProps) => {
  if (imageFields.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Image Elements</h3>
      {imageFields.map(field => (
        <Card key={field.id} className={`border-gray-200 cursor-pointer transition-colors ${selectedImageId === field.id ? 'ring-2 ring-blue-400' : ''}`} onClick={() => onSelectField(field.id)}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <img src={field.src} alt="Uploaded" className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Image {field.id}</div>
                <div className="text-xs text-gray-400">Opacity: {field.opacity}%</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Opacity</div>
                <Slider 
                  value={[field.opacity]} 
                  onValueChange={([value]) => onUpdateField(field.id, { opacity: value })} 
                  max={100} 
                  min={0} 
                  step={5} 
                  className="w-16" 
                />
              </div>
              <Button variant="ghost" size="sm" onClick={e => {
                e.stopPropagation();
                onRemoveField(field.id);
              }} className="text-gray-400 hover:text-red-500">
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageFieldControls;
