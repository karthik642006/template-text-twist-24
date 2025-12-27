import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, ZoomIn, ZoomOut, RotateCcw, Move, Image, Video, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { ShapeType } from '@/types/meme';

interface ImageInShapeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (imageUrl: string, isVideo?: boolean) => void;
  shapeType: ShapeType | null;
}

export const ImageInShapeEditor = ({ open, onOpenChange, onImageUpload, shapeType }: ImageInShapeEditorProps) => {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (isVideo) {
          setVideo(reader.result as string);
          setImage(null);
          setMediaType('video');
        } else {
          setImage(reader.result as string);
          setVideo(null);
          setMediaType('image');
        }
      });
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = useCallback((direction: 'up' | 'down' | 'left' | 'right', amount = 10) => {
    switch (direction) {
      case 'up':
        setPositionY(prev => prev - amount);
        break;
      case 'down':
        setPositionY(prev => prev + amount);
        break;
      case 'left':
        setPositionX(prev => prev - amount);
        break;
      case 'right':
        setPositionX(prev => prev + amount);
        break;
    }
  }, []);

  const handleUpload = () => {
    if (video) {
      onImageUpload(video, true);
      resetState();
      onOpenChange(false);
      return;
    }

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
        ctx.translate(canvas.width / 2 + positionX, canvas.height / 2 + positionY);
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
        onImageUpload(dataUrl, false);
        resetState();
        onOpenChange(false);
      }
    }
  };

  const resetState = () => {
    setImage(null);
    setVideo(null);
    setCrop(undefined);
    setZoom(1);
    setRotation(0);
    setPositionX(0);
    setPositionY(0);
  };

  const getShapeMask = () => {
    switch (shapeType) {
      case 'circle':
        return 'ellipse(50% 50% at 50% 50%)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'heart':
        return 'none';
      default:
        return 'none';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Media to Shape</DialogTitle>
        </DialogHeader>
        
        <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'image' | 'video')}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="image" className="data-[state=active]:bg-blue-600">
              <Image className="w-4 h-4 mr-2" />
              Image
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-blue-600">
              <Video className="w-4 h-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
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
              <div className="flex flex-col items-center space-y-4">
                {/* Shape Preview Mask */}
                <div 
                  className="relative overflow-hidden bg-gray-700 rounded-lg"
                  style={{ 
                    clipPath: getShapeMask(),
                    width: '300px',
                    height: '300px'
                  }}
                >
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
                        transform: `translate(${positionX}px, ${positionY}px) scale(${zoom}) rotate(${rotation}deg)`,
                        maxHeight: '400px',
                        transformOrigin: 'center'
                      }}
                    />
                  </ReactCrop>
                </div>

                {/* Position Controls */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Move className="w-4 h-4 mr-1" /> Reposition
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handlePositionChange('up')}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button size="sm" variant="outline" onClick={() => handlePositionChange('left')}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setPositionX(0); setPositionY(0); }}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePositionChange('right')}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handlePositionChange('down')}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Zoom Control */}
                <div className="flex items-center space-x-4 w-full">
                  <ZoomOut className="w-5 h-5 text-gray-400" />
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="w-5 h-5 text-gray-400" />
                </div>

                {/* Rotation Control */}
                <div className="flex items-center space-x-4 w-full">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <Slider
                    value={[rotation]}
                    onValueChange={([value]) => setRotation(value)}
                    min={0}
                    max={360}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-400 w-12">{rotation}°</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            {!video ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-in-shape-upload"
                />
                <label
                  htmlFor="video-in-shape-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Video className="w-12 h-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-400">Click to upload a video</span>
                </label>
              </div>
            ) : (
              <div 
                className="relative overflow-hidden bg-gray-700 rounded-lg mx-auto"
                style={{ 
                  clipPath: getShapeMask(),
                  width: '300px',
                  height: '300px'
                }}
              >
                <video
                  ref={videoRef}
                  src={video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetState();
              onOpenChange(false);
            }}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            className="bg-green-600 hover:bg-green-700" 
            disabled={!image && !video}
          >
            Upload Media
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
