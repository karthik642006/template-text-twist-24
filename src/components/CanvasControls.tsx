import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Palette } from "lucide-react";
interface CanvasControlsProps {
  onBackgroundChange: (background: string, type: 'color' | 'image') => void;
  currentBackground: string;
  backgroundType: 'color' | 'image';
}
const CanvasControls = ({
  onBackgroundChange,
  currentBackground,
  backgroundType
}: CanvasControlsProps) => {
  const [showColorPalette, setShowColorPalette] = useState(false);
  const predefinedColors = ['#FFFFFF',
  // White
  '#000000',
  // Black
  '#F87171',
  // Red
  '#FB923C',
  // Orange
  '#FBBF24',
  // Yellow
  '#34D399',
  // Green
  '#60A5FA',
  // Blue
  '#A78BFA',
  // Purple
  '#F472B6',
  // Pink
  '#6B7280',
  // Gray
  '#1F2937',
  // Dark Gray
  '#7C3AED' // Violet
  ];
  const gradients = ['linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'];
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageUrl = e.target?.result as string;
        onBackgroundChange(imageUrl, 'image');
      };
      reader.readAsDataURL(file);
    }
  };
  return <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-white text-sm sm:text-base flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Canvas Background
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:p-4">
        <Button onClick={() => setShowColorPalette(!showColorPalette)} className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm sm:py-2 min-h-[44px] sm:min-h-auto py-[6px]">
          <Palette className="w-4 h-4 mr-2" />
          {showColorPalette ? 'Hide Colors' : 'Show Colors'}
        </Button>

        {showColorPalette && <div className="space-y-4">
            {/* Solid Colors */}
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Solid Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map(color => <button key={color} className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${currentBackground === color && backgroundType === 'color' ? 'border-white ring-2 ring-purple-400' : 'border-gray-500'}`} style={{
              backgroundColor: color
            }} onClick={() => onBackgroundChange(color, 'color')} title={color} />)}
              </div>
            </div>

            {/* Gradients */}
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Gradients</h4>
              <div className="grid grid-cols-2 gap-2">
                {gradients.map((gradient, index) => <button key={index} className={`w-full h-10 rounded-lg border-2 transition-all hover:scale-105 ${currentBackground === gradient && backgroundType === 'color' ? 'border-white ring-2 ring-purple-400' : 'border-gray-500'}`} style={{
              background: gradient
            }} onClick={() => onBackgroundChange(gradient, 'color')} title={`Gradient ${index + 1}`} />)}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Custom Color</h4>
              <Input type="color" value={backgroundType === 'color' && !currentBackground.includes('gradient') ? currentBackground : '#FFFFFF'} onChange={e => onBackgroundChange(e.target.value, 'color')} className="w-full h-10 bg-gray-700 border-gray-600" />
            </div>
          </div>}

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center mx-0 py-[0.2px] px-[0.1px]">
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="background-upload" />
          <label htmlFor="background-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 text-sm">Upload Background Image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF supported</p>
          </label>
        </div>

        {/* Current Background Info */}
        
      </CardContent>
    </Card>;
};
export default CanvasControls;