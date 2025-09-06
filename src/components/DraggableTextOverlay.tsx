import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCw, ZoomIn, ZoomOut, Edit3 } from "lucide-react";

interface TextElement {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
  scale: number;
}

const DraggableTextOverlay = () => {
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 1,
      text: "Drag me around!",
      x: 50,
      y: 50,
      fontSize: 32,
      rotation: 0,
      scale: 1
    }
  ]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedElementId, setSelectedElementId] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("https://via.placeholder.com/600x400/4a5568/ffffff?text=Background+Image");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedElement = textElements.find(el => el.id === selectedElementId);

  const updateTextElement = (id: number, updates: Partial<TextElement>) => {
    setTextElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: number) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedElementId(elementId);
    setSelectedElementId(elementId);
    setIsEditing(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent, elementId: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDraggedElementId(elementId);
    setSelectedElementId(elementId);
    setIsEditing(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDragOffset({
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    // Keep within boundaries (with some padding for text size)
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    
    updateTextElement(draggedElementId, { x: boundedX, y: boundedY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedElementId) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const x = ((touch.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((touch.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    
    updateTextElement(draggedElementId, { x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedElementId(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedElementId(null);
  };

  const handleDoubleClick = (elementId: number) => {
    setSelectedElementId(elementId);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const rotateElement = () => {
    if (!selectedElement) return;
    updateTextElement(selectedElement.id, { 
      rotation: (selectedElement.rotation + 15) % 360 
    });
  };

  const scaleUp = () => {
    if (!selectedElement) return;
    updateTextElement(selectedElement.id, { 
      scale: Math.min(selectedElement.scale + 0.1, 3) 
    });
  };

  const scaleDown = () => {
    if (!selectedElement) return;
    updateTextElement(selectedElement.id, { 
      scale: Math.max(selectedElement.scale - 0.1, 0.3) 
    });
  };

  const increaseFontSize = () => {
    if (!selectedElement) return;
    updateTextElement(selectedElement.id, { 
      fontSize: Math.min(selectedElement.fontSize + 4, 72) 
    });
  };

  const decreaseFontSize = () => {
    if (!selectedElement) return;
    updateTextElement(selectedElement.id, { 
      fontSize: Math.max(selectedElement.fontSize - 4, 12) 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Draggable Text Overlay</h1>
        
        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Background Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              {/* Text Controls */}
              {selectedElement && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button onClick={rotateElement} variant="outline" size="sm">
                    <RotateCw className="w-4 h-4 mr-1" />
                    Rotate
                  </Button>
                  <Button onClick={scaleUp} variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4 mr-1" />
                    Scale +
                  </Button>
                  <Button onClick={scaleDown} variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4 mr-1" />
                    Scale -
                  </Button>
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}

              {/* Font Size Controls */}
              {selectedElement && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Font Size:</span>
                  <Button onClick={decreaseFontSize} variant="outline" size="sm">-</Button>
                  <span className="text-sm font-medium w-12 text-center">{selectedElement.fontSize}px</span>
                  <Button onClick={increaseFontSize} variant="outline" size="sm">+</Button>
                </div>
              )}

              {/* Text Input */}
              {isEditing && selectedElement && (
                <Input
                  ref={inputRef}
                  value={selectedElement.text}
                  onChange={(e) => updateTextElement(selectedElement.id, { text: e.target.value })}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  placeholder="Enter your text"
                  className="max-w-xs"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Container with Text Overlay */}
        <div className="relative max-w-2xl mx-auto">
          <div
            ref={containerRef}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Image */}
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-auto block"
              draggable={false}
            />

            {/* Text Elements */}
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move select-none font-bold text-white ${
                  selectedElementId === element.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  fontSize: `${element.fontSize}px`,
                  transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale})`,
                  textShadow: '2px 2px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000',
                  fontFamily: 'Arial, sans-serif',
                  userSelect: 'none',
                  touchAction: 'none',
                  zIndex: selectedElementId === element.id ? 10 : 1
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onTouchStart={(e) => handleTouchStart(e, element.id)}
                onDoubleClick={() => handleDoubleClick(element.id)}
              >
                {element.text}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>• Click and drag to move text</p>
            <p>• Double-click to edit text</p>
            <p>• Use controls above to rotate, scale, and adjust font size</p>
            <p>• Upload your own background image</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableTextOverlay;
