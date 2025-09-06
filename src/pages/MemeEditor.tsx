
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, ImageField } from "@/types/meme";
import MemeEditorHeader from "@/components/meme-editor/MemeEditorHeader";
import MemeEditorToolbar from "@/components/meme-editor/MemeEditorToolbar";
import MemeEditorCanvas from "@/components/meme-editor/MemeEditorCanvas";
import MemeEditorControls from "@/components/meme-editor/MemeEditorControls";
import { useMemeEditorLogic } from "@/hooks/useMemeEditorLogic";

const MemeEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    textFields,
    imageFields,
    selectedTextId,
    selectedImageId,
    templateImage,
    imageStyle,
    isDragging,
    draggedElementId,
    draggedElementType,
    dragOffset,
    updateTextField,
    updateImageField,
    addTextField,
    removeTextField,
    removeImageField,
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
    setSelectedImageId
  } = useMemeEditorLogic();

  const selectedText = textFields.find(field => field.id === selectedTextId);
  const selectedImage = imageFields.find(field => field.id === selectedImageId);

  return (
    <div className="min-h-screen bg-white">
      <MemeEditorHeader navigate={navigate} />
      
      <MemeEditorToolbar 
        onImageGenerated={handleTemplateSelect}
        onImageSelect={handleImageSelect}
        onStyleApply={handleStyleApply}
        onTemplateSelect={handleTemplateSelect}
      />

      <MemeEditorCanvas
        ref={containerRef}
        templateImage={templateImage}
        imageStyle={imageStyle}
        textFields={textFields}
        imageFields={imageFields}
        selectedTextId={selectedTextId}
        selectedImageId={selectedImageId}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <MemeEditorControls
        textFields={textFields}
        imageFields={imageFields}
        selectedText={selectedText}
        selectedImage={selectedImage}
        selectedTextId={selectedTextId}
        selectedImageId={selectedImageId}
        onUpdateTextField={updateTextField}
        onUpdateImageField={updateImageField}
        onRemoveTextField={removeTextField}
        onRemoveImageField={removeImageField}
        onSelectTextField={(id) => {
          setSelectedTextId(id);
          setSelectedImageId(null);
        }}
        onSelectImageField={(id) => {
          setSelectedImageId(id);
          setSelectedTextId(0);
        }}
        onAddTextField={addTextField}
        onRotate={rotateElement}
        onScaleUp={scaleElementUp}
        onScaleDown={scaleElementDown}
      />
    </div>
  );
};

export default MemeEditor;
