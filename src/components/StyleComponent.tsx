
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Component, Palette, Sparkles } from "lucide-react";

interface StyleComponentProps {
  onStyleApply?: (style: string) => void;
}

const StyleComponent = ({ onStyleApply }: StyleComponentProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const styles = [
    { id: "ghibli", name: "Ghibli Style", desc: "Studio Ghibli anime look", effect: "saturate(120%) contrast(110%) brightness(105%) hue-rotate(10deg)", color: "from-green-300 to-blue-300" },
    { id: "anime", name: "Anime", desc: "Japanese animation style", effect: "saturate(150%) contrast(120%) brightness(110%) hue-rotate(15deg)", color: "from-pink-300 to-purple-300" },
    { id: "cartoon", name: "Cartoon", desc: "Animated cartoon style", effect: "contrast(150%) saturate(200%) brightness(110%)", color: "from-yellow-300 to-orange-300" },
    { id: "watercolor", name: "Watercolor", desc: "Soft watercolor painting", effect: "blur(0.5px) contrast(110%) saturate(130%) brightness(105%)", color: "from-blue-200 to-cyan-200" },
    { id: "pencil", name: "Pencil Sketch", desc: "Hand-drawn pencil effect", effect: "grayscale(80%) contrast(200%) brightness(120%)", color: "from-gray-200 to-gray-400" },
    { id: "oil", name: "Oil Painting", desc: "Classic oil painting look", effect: "blur(0.3px) contrast(130%) saturate(140%) brightness(105%)", color: "from-amber-200 to-orange-200" },
    { id: "vintage", name: "Vintage Film", desc: "Retro film aesthetic", effect: "sepia(40%) contrast(120%) brightness(110%) saturate(80%)", color: "from-amber-300 to-yellow-300" },
    { id: "cyberpunk", name: "Cyberpunk", desc: "Futuristic neon style", effect: "contrast(150%) saturate(200%) brightness(110%) hue-rotate(280deg)", color: "from-purple-300 to-pink-300" },
    { id: "blackwhite", name: "Black & White", desc: "Classic monochrome", effect: "grayscale(100%) contrast(110%)", color: "from-gray-300 to-gray-500" },
    { id: "neon", name: "Neon Glow", desc: "Bright neon effect", effect: "contrast(150%) saturate(200%) brightness(130%) drop-shadow(0 0 10px cyan)", color: "from-cyan-300 to-blue-300" },
    { id: "dreamy", name: "Dreamy", desc: "Soft dreamy atmosphere", effect: "blur(0.2px) saturate(120%) brightness(115%) contrast(90%)", color: "from-pink-200 to-purple-200" },
    { id: "gothic", name: "Gothic", desc: "Dark gothic aesthetic", effect: "contrast(140%) saturate(80%) brightness(80%) hue-rotate(240deg)", color: "from-purple-400 to-gray-600" }
  ];

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style.id);
    if (onStyleApply) {
      onStyleApply(style.effect);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none hover:from-blue-600 hover:to-cyan-600 text-xs px-2 h-8"
        >
          <Component className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Style</span>
          <span className="sm:hidden">Sty</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-500" />
            Choose Image Style
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                selectedStyle === style.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStyleSelect(style)}
            >
              <div className="space-y-3">
                {/* Style Preview */}
                <div 
                  className={`w-full h-20 bg-gradient-to-r ${style.color} rounded-lg`}
                  style={{ filter: style.effect }}
                />
                
                <div>
                  <h3 className="font-semibold text-gray-800">{style.name}</h3>
                  <p className="text-sm text-gray-600">{style.desc}</p>
                </div>

                {selectedStyle === style.id && (
                  <Badge className="bg-blue-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Component className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Style Information</h4>
              <p className="text-sm text-gray-600 mt-1">
                All styles use advanced CSS filters and are copyright-free. These effects transform your meme 
                in real-time without modifying the original image. Choose from anime, cartoon, watercolor, 
                and many more artistic styles!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StyleComponent;
