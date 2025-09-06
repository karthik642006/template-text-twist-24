
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TextField } from "@/types/meme";

interface TextFieldControlsProps {
  textFields: TextField[];
  selectedTextId: number;
  onUpdateField: (id: number, updates: Partial<TextField>) => void;
  onRemoveField: (id: number) => void;
  onSelectField: (id: number) => void;
}

const TextFieldControls = ({ 
  textFields, 
  selectedTextId, 
  onUpdateField, 
  onRemoveField, 
  onSelectField 
}: TextFieldControlsProps) => {
  const fontFamilies = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Comic Sans MS"];
  const fontWeights = ["normal", "bold", "bolder", "lighter"];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Text Elements</h3>
      {textFields.map(field => (
        <Card key={field.id} className={`border-gray-200 cursor-pointer transition-colors ${selectedTextId === field.id ? 'ring-2 ring-blue-400' : ''}`} onClick={() => onSelectField(field.id)}>
          <CardContent className="p-3 py-0 px-[12px]">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder={field.type === 'header' ? "Enter header text" : field.type === 'footer' ? "Enter footer text" : "Enter text"} 
                value={field.text} 
                onChange={e => onUpdateField(field.id, { text: e.target.value })} 
                className="flex-1 border-gray-300" 
              />
              {/* Color Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-6 h-6 rounded cursor-pointer border border-gray-300" style={{ backgroundColor: field.color }} />
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-white">
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-2">
                      {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'].map(color => (
                        <button key={color} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: color }} onClick={() => onUpdateField(field.id, { color })} />
                      ))}
                    </div>
                    <Input type="color" value={field.color} onChange={e => onUpdateField(field.id, { color: e.target.value })} className="w-full h-8" />
                  </div>
                </PopoverContent>
              </Popover>
              {/* Font Controls */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Aa
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-white">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Font Size</label>
                      <Slider value={[field.fontSize]} onValueChange={([value]) => onUpdateField(field.id, { fontSize: value })} max={72} min={12} step={2} className="w-full" />
                      <span className="text-xs text-gray-500">{field.fontSize}px</span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Font Family</label>
                      <select value={field.fontFamily} onChange={e => onUpdateField(field.id, { fontFamily: e.target.value })} className="w-full p-2 border border-gray-300 rounded">
                        {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Font Weight</label>
                      <select value={field.fontWeight} onChange={e => onUpdateField(field.id, { fontWeight: e.target.value })} className="w-full p-2 border border-gray-300 rounded">
                        {fontWeights.map(weight => <option key={weight} value={weight}>{weight}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Opacity</label>
                      <Slider value={[field.opacity]} onValueChange={([value]) => onUpdateField(field.id, { opacity: value })} max={100} min={0} step={5} className="w-full" />
                      <span className="text-xs text-gray-500">{field.opacity}%</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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

export default TextFieldControls;
