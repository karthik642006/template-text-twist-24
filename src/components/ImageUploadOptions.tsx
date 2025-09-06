
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image, Sticker, Users, Palette, Star } from "lucide-react";

interface ImageUploadOptionsProps {
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
}

const ImageUploadOptions = ({ onImageSelect }: ImageUploadOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect(event.target.result as string, 'upload');
          setIsOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const popularEmojis = ['😂', '😭', '😍', '🤔', '😤', '🙄', '😎', '🤯', '😱', '🥺', '😏', '🤣'];
  
  const stickerCategories = [
    { name: 'Reactions', emojis: ['😂', '😭', '😱', '🤯', '😍', '🥺'] },
    { name: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'] },
    { name: 'Objects', emojis: ['💎', '🔥', '⭐', '💫', '🌟', '✨'] },
    { name: 'Gestures', emojis: ['👍', '👎', '👌', '✌️', '🤝', '👏'] }
  ];

  const handleEmojiSelect = (emoji: string) => {
    // Convert emoji to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    
    if (ctx) {
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 50, 50);
      const dataURL = canvas.toDataURL();
      onImageSelect(dataURL, 'emoji');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none hover:from-green-600 hover:to-emerald-600 text-xs px-2 h-8"
        >
          <Image className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Add Image</span>
          <span className="sm:hidden">Img</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-green-500" />
            Add Images & Stickers
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Image</h3>
              <p className="text-gray-600 mb-4">Add your own images, logos, or graphics</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="image-upload" 
              />
              <label htmlFor="image-upload">
                <Button className="cursor-pointer bg-green-600 hover:bg-green-700">
                  Choose File
                </Button>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Badge variant="secondary">JPG, PNG supported</Badge>
              <Badge variant="secondary">Max 10MB</Badge>
              <Badge variant="secondary">Auto-resize</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="emoji" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Popular Reactions
                </h4>
                <div className="grid grid-cols-6 gap-3">
                  {popularEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-4xl p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {stickerCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="font-medium mb-3">{category.name}</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-4xl p-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stickers" className="space-y-4">
            <div className="text-center py-8">
              <Sticker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Custom Stickers</h3>
              <p className="text-gray-600 mb-4">Create and use custom sticker packs</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="assets" className="space-y-4">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Community Assets</h3>
              <p className="text-gray-600 mb-4">Browse user-created graphics and elements</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadOptions;
