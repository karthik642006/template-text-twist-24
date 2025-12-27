import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ShapeType } from '@/types/meme';

interface ImageInShapeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (imageUrl: string) => void;
  shapeType: ShapeType | null;
}

export const ImageInShapeEditor = ({ open, onOpenChange, onImageUpload, shapeType }: ImageInShapeEditorProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image && imgRef.current) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const cropWidth = crop ? crop.width * scaleX : imgRef.current.naturalWidth;
      const cropHeight = crop ? crop.height * scaleY : imgRef.current.naturalHeight;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(
          imgRef.current,
          crop ? crop.x * scaleX : 0,
          crop ? crop.y * scaleY : 0,
          crop ? crop.width * scaleX : imgRef.current.naturalWidth,
          crop ? crop.height * scaleY : imgRef.current.naturalHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        onImageUpload(dataUrl);
        onOpenChange(false);
        // Reset state for next use
        setImage(null);
        setCrop(undefined);
        setZoom(1);
        setRotation(0);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Upload and Edit Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!image ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-in-shape-upload"
              />
              <label
                htmlFor="image-in-shape-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-400">Click to upload an image</span>
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                circularCrop={shapeType === 'circle'}
                aspect={shapeType === 'circle' || shapeType === 'square' ? 1 : undefined}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Image preview"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    maxHeight: '400px',
                  }}
                />
              </ReactCrop>
              <div className="flex items-center space-x-4 mt-4">
                <ZoomOut className="w-6 h-6" />
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-48"
                />
                <ZoomIn className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <RotateCcw className="w-6 h-6" />
                <Slider
                  value={[rotation]}
                  onValueChange={([value]) => setRotation(value)}
                  min={0}
                  max={360}
                  step={1}
                  className="w-48"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700" disabled={!image}>
            Upload Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
