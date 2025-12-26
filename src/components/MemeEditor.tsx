import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Minus } from "lucide-react";
import { useMemeEditorLogic } from "@/hooks/useMemeEditorLogic";
import MemeCanvas from "./MemeCanvas";
import ElementControls from "./ElementControls";
import TextFieldControls from "./TextFieldControls";
import ImageFieldControls from "./ImageFieldControls";
import LineFieldControls from "./LineFieldControls";
import ActionToolbar from "./ActionToolbar";
import HamburgerMenu from "./HamburgerMenu";
import UndoRedoControls from "./UndoRedoControls";

const MemeEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the custom hook for all meme editor logic
  const {
    textFields,
    imageFields,
    lineFields,
    shapeFields,
    selectedTextId,
    selectedImageId,
    selectedLineId,
    selectedShapeId,
    templateImage,
    imageStyle,
    updateTextField,
    updateImageField,
    updateLineField,
    addTextField,
    addLineField,
    addShapeField,
    removeTextField,
    removeImageField,
    removeLineField,
    handleImageSelect,
    handleStyleApply,
    handleTemplateSelect,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    handleMouseUp,
    handleTouchEnd,
    rotateElement,
    scaleElementUp,
    scaleElementDown,
    setSelectedTextId,
    setSelectedImageId,
    setSelectedLineId,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory
  } = useMemeEditorLogic();

  const selectedText = textFields.find(field => field.id === selectedTextId);
  const selectedImage = imageFields.find(field => field.id === selectedImageId);
  const selectedLine = lineFields.find(field => field.id === selectedLineId);


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
              ← Back
            </Button>
            <span className="text-xl font-bold text-gray-800">Meme Editor</span>
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          </div>
          <div className="flex items-center space-x-4">
            <UndoRedoControls 
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            <HamburgerMenu />
          </div>
        </div>
      </header>

      {/* Action Toolbar - Moved outside the preview div */}
      <div className="p-4 flex justify-center bg-white border-b border-gray-100">
        <ActionToolbar 
          onImageGenerated={handleTemplateSelect}
          onImageSelect={handleImageSelect}
          onStyleApply={handleStyleApply}
          onTemplateSelect={handleTemplateSelect}
          onShapeSelect={addShapeField}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="min-h-full">
          {/* Meme Preview Section */}
          <div className="p-4 sm:p-6 flex items-center justify-center bg-gray-50 min-h-[50vh]">
            <div className="w-full max-w-lg">
              <MemeCanvas
                ref={containerRef}
                templateImage={templateImage}
                imageStyle={imageStyle}
                textFields={textFields}
                imageFields={imageFields}
                lineFields={lineFields}
                shapeFields={shapeFields}
                selectedTextId={selectedTextId}
                selectedImageId={selectedImageId}
                selectedLineId={selectedLineId}
                selectedShapeId={selectedShapeId}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>

          {/* Editor Controls Section */}
          <div className="bg-white border-t border-gray-200 p-4 sm:p-6 space-y-6">
            <ElementControls
              selectedText={selectedText}
              selectedImage={selectedImage}
              onRotate={rotateElement}
              onScaleUp={scaleElementUp}
              onScaleDown={scaleElementDown}
            />

            <TextFieldControls
              textFields={textFields}
              selectedTextId={selectedTextId}
              onUpdateField={(id, updates) => {
                updateTextField(id, updates);
                saveToHistory();
              }}
              onRemoveField={(id) => {
                removeTextField(id);
                saveToHistory();
              }}
              onSelectField={(id) => {
                setSelectedTextId(id);
                setSelectedImageId(null);
                setSelectedLineId(null);
              }}
            />

            <ImageFieldControls
              imageFields={imageFields}
              selectedImageId={selectedImageId}
              onUpdateField={(id, updates) => {
                updateImageField(id, updates);
                saveToHistory();
              }}
              onRemoveField={(id) => {
                removeImageField(id);
                saveToHistory();
              }}
              onSelectField={(id) => {
                setSelectedImageId(id);
                setSelectedTextId(0);
                setSelectedLineId(null);
              }}
            />

            <LineFieldControls
              lineFields={lineFields}
              selectedLineId={selectedLineId}
              onUpdateField={(id, updates) => {
                updateLineField(id, updates);
                saveToHistory();
              }}
              onRemoveField={(id) => {
                removeLineField(id);
                saveToHistory();
              }}
              onSelectField={(id) => {
                setSelectedLineId(id);
                setSelectedTextId(0);
                setSelectedImageId(null);
              }}
            />

            {/* Add New Elements */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => {
                  addTextField('text');
                  saveToHistory();
                }} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                + New text
              </Button>
              <Button 
                onClick={() => {
                  addTextField('header');
                  saveToHistory();
                }} 
                variant="outline" 
                className="border-purple-300 text-purple-700" 
                disabled={textFields.some(field => field.type === 'header')}
              >
                + Header
              </Button>
              <Button 
                onClick={() => {
                  addTextField('footer');
                  saveToHistory();
                }} 
                variant="outline" 
                className="border-purple-300 text-purple-700" 
                disabled={textFields.some(field => field.type === 'footer')}
              >
                + Footer
              </Button>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => {
                    addLineField('horizontal');
                    saveToHistory();
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 flex items-center space-x-1"
                >
                  <Minus className="h-4 w-4" />
                  <span>+ H-Line</span>
                </Button>
                <Button
                  onClick={() => {
                    addLineField('vertical');
                    saveToHistory();
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 flex items-center space-x-1"
                >
                  <span className="rotate-90 inline-block"><Minus className="h-4 w-4" /></span>
                  <span>+ V-Line</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemeEditor;
