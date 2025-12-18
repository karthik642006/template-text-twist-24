
import { useState, useRef, useEffect } from "react";
import { TextField, ImageField, LineField } from "@/types/meme";
import { toast } from "@/hooks/use-toast";

export const useMemeEditorLogic = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<number | null>(null);
  const [draggedElementType, setDraggedElementType] = useState<'text' | 'image' | 'line' | null>(null);
  const [imageStyle, setImageStyle] = useState<string>("");
  const [selectedElementTimeout, setSelectedElementTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // History for undo/redo
  const [history, setHistory] = useState<{ textFields: TextField[]; imageFields: ImageField[]; lineFields: LineField[] }[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const [textFields, setTextFields] = useState<TextField[]>([
    {
      id: 1,
      text: "Place your text here",
      x: 50,
      y: 8,
      fontSize: 28,
      color: "#000000",
      fontWeight: "bold",
      fontFamily: "Arial",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type: 'header'
    },
    {
      id: 2,
      text: "Meme text goes here",
      x: 50,
      y: 30,
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Impact",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type: 'text'
    },
    {
      id: 3,
      text: "Place your text here",
      x: 50,
      y: 92,
      fontSize: 28,
      color: "#000000",
      fontWeight: "bold",
      fontFamily: "Arial",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type: 'footer'
    }
  ]);

  const [imageFields, setImageFields] = useState<ImageField[]>([]);
  const [lineFields, setLineFields] = useState<LineField[]>([]);
  const [selectedTextId, setSelectedTextId] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [templateImage, setTemplateImage] = useState("/lovable-uploads/b545e16c-6275-4ed7-85e5-e200400ce2d2.png");

  // Auto-hide selection after 3 seconds
  useEffect(() => {
    if (selectedTextId || selectedImageId || selectedLineId) {
      if (selectedElementTimeout) {
        clearTimeout(selectedElementTimeout);
      }
      const timeout = setTimeout(() => {
        setSelectedTextId(0);
        setSelectedImageId(null);
        setSelectedLineId(null);
      }, 3000);
      setSelectedElementTimeout(timeout);
    }
    return () => {
      if (selectedElementTimeout) {
        clearTimeout(selectedElementTimeout);
      }
    };
  }, [selectedTextId, selectedImageId, selectedLineId]);

  // Load template from localStorage
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setTemplateImage(savedTemplate);
      localStorage.removeItem('selectedTemplate');
    }
  }, []);

  const updateTextField = (id: number, updates: Partial<TextField>) => {
    setTextFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const updateImageField = (id: number, updates: Partial<ImageField>) => {
    setImageFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const addTextField = (type: 'text' | 'header' | 'footer' = 'text') => {
    if (type === 'header' && textFields.some(field => field.type === 'header')) {
      return;
    }
    if (type === 'footer' && textFields.some(field => field.type === 'footer')) {
      return;
    }
    const newId = Math.max(...textFields.map(f => f.id), 0) + 1;
    let yPosition = 50;
    let xPosition = 50;
    if (type === 'header') {
      yPosition = 10;
    } else if (type === 'footer') {
      yPosition = 90;
    }
    setTextFields([...textFields, {
      id: newId,
      text: type === 'header' ? "Header text" : type === 'footer' ? "Footer text" : "New text",
      x: xPosition,
      y: yPosition,
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Impact",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type
    }]);
    setSelectedTextId(newId);
  };

  const removeTextField = (id: number) => {
    if (textFields.length > 1) {
      setTextFields(prev => prev.filter(field => field.id !== id));
      if (selectedTextId === id) {
        const remaining = textFields.filter(field => field.id !== id);
        setSelectedTextId(remaining[0]?.id || 0);
      }
    }
  };

  const removeImageField = (id: number) => {
    setImageFields(prev => prev.filter(field => field.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const handleImageSelect = (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => {
    const newId = Math.max(...imageFields.map(f => f.id), 0) + 1;
    setImageFields([...imageFields, {
      id: newId,
      src,
      x: 50,
      y: 50,
      width: type === 'emoji' ? 60 : 100,
      height: type === 'emoji' ? 60 : 100,
      opacity: 100,
      rotation: 0,
      scale: 1
    }]);
    setSelectedImageId(newId);
  };

  const handleStyleApply = (style: string) => {
    setImageStyle(style);
  };

  const handleTemplateSelect = (src: string) => {
    setTemplateImage(src);
    toast({
      title: "Template updated!",
      description: "Your new template has been loaded successfully."
    });
  };

  const updateLineField = (id: number, updates: Partial<LineField>) => {
    setLineFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const addLineField = (type: 'horizontal' | 'vertical') => {
    const newId = Math.max(...lineFields.map(f => f.id), ...textFields.map(f => f.id), ...imageFields.map(f => f.id), 0) + 1;
    const centerX = 50;
    const centerY = 50;
    
    setLineFields([...lineFields, {
      id: newId,
      x1: type === 'horizontal' ? centerX - 20 : centerX,
      y1: type === 'horizontal' ? centerY : centerY - 20,
      x2: type === 'horizontal' ? centerX + 20 : centerX,
      y2: type === 'horizontal' ? centerY : centerY + 20,
      color: "#000000",
      thickness: 2,
      opacity: 100,
      type
    }]);
    setSelectedLineId(newId);
  };

  const removeLineField = (id: number) => {
    setLineFields(prev => prev.filter(field => field.id !== id));
    if (selectedLineId === id) {
      setSelectedLineId(null);
    }
  };

  // Save state to history
  const saveToHistory = () => {
    const newState = { textFields, imageFields, lineFields };
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const undo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const state = history[newIndex];
      setTextFields(state.textFields);
      setImageFields(state.imageFields);
      setLineFields(state.lineFields);
      setCurrentHistoryIndex(newIndex);
    }
  };

  // Redo functionality
  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const state = history[newIndex];
      setTextFields(state.textFields);
      setImageFields(state.imageFields);
      setLineFields(state.lineFields);
      setCurrentHistoryIndex(newIndex);
    }
  };

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent, elementId: number, elementType: 'text' | 'image' | 'line') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggedElementId(elementId);
    setDraggedElementType(elementType);
    if (elementType === 'text') {
      setSelectedTextId(elementId);
      setSelectedImageId(null);
      setSelectedLineId(null);
    } else if (elementType === 'image') {
      setSelectedImageId(elementId);
      setSelectedTextId(0);
      setSelectedLineId(null);
    } else if (elementType === 'line') {
      setSelectedLineId(elementId);
      setSelectedTextId(0);
      setSelectedImageId(null);
    }
    const containerRef = document.querySelector('[data-meme-container]');
    if (containerRef) {
      const containerRect = containerRef.getBoundingClientRect();
      const elementRect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - elementRect.left - elementRect.width / 2,
        y: e.clientY - elementRect.top - elementRect.height / 2
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent, elementId: number, elementType: 'text' | 'image' | 'line') => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setDraggedElementId(elementId);
    setDraggedElementType(elementType);
    if (elementType === 'text') {
      setSelectedTextId(elementId);
      setSelectedImageId(null);
      setSelectedLineId(null);
    } else if (elementType === 'image') {
      setSelectedImageId(elementId);
      setSelectedTextId(0);
      setSelectedLineId(null);
    } else if (elementType === 'line') {
      setSelectedLineId(elementId);
      setSelectedTextId(0);
      setSelectedImageId(null);
    }
    const containerRef = document.querySelector('[data-meme-container]');
    if (containerRef) {
      const containerRect = containerRef.getBoundingClientRect();
      const elementRect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - elementRect.left - elementRect.width / 2,
        y: touch.clientY - elementRect.top - elementRect.height / 2
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType) return;
    const containerRef = document.querySelector('[data-meme-container]');
    if (!containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const x = (e.clientX - containerRect.left - dragOffset.x) / containerRect.width * 100;
    const y = (e.clientY - containerRect.top - dragOffset.y) / containerRect.height * 100;
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    if (draggedElementType === 'text') {
      updateTextField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else if (draggedElementType === 'image') {
      updateImageField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else if (draggedElementType === 'line') {
      const line = lineFields.find(f => f.id === draggedElementId);
      if (line) {
        const deltaX = boundedX - (line.x1 + line.x2) / 2;
        const deltaY = boundedY - (line.y1 + line.y2) / 2;
        updateLineField(draggedElementId, {
          x1: line.x1 + deltaX,
          y1: line.y1 + deltaY,
          x2: line.x2 + deltaX,
          y2: line.y2 + deltaY
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType) return;
    e.preventDefault();
    const touch = e.touches[0];
    const containerRef = document.querySelector('[data-meme-container]');
    if (!containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const x = (touch.clientX - containerRect.left - dragOffset.x) / containerRect.width * 100;
    const y = (touch.clientY - containerRect.top - dragOffset.y) / containerRect.height * 100;
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    if (draggedElementType === 'text') {
      updateTextField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else if (draggedElementType === 'image') {
      updateImageField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else if (draggedElementType === 'line') {
      const line = lineFields.find(f => f.id === draggedElementId);
      if (line) {
        const deltaX = boundedX - (line.x1 + line.x2) / 2;
        const deltaY = boundedY - (line.y1 + line.y2) / 2;
        updateLineField(draggedElementId, {
          x1: line.x1 + deltaX,
          y1: line.y1 + deltaY,
          x2: line.x2 + deltaX,
          y2: line.y2 + deltaY
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedElementId(null);
    setDraggedElementType(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedElementId(null);
    setDraggedElementType(null);
  };

  const rotateElement = () => {
    const selectedText = textFields.find(field => field.id === selectedTextId);
    const selectedImage = imageFields.find(field => field.id === selectedImageId);
    
    if (selectedText) {
      updateTextField(selectedText.id, {
        rotation: (selectedText.rotation + 15) % 360
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        rotation: (selectedImage.rotation + 15) % 360
      });
    }
  };

  const scaleElementUp = () => {
    const selectedText = textFields.find(field => field.id === selectedTextId);
    const selectedImage = imageFields.find(field => field.id === selectedImageId);
    
    if (selectedText) {
      updateTextField(selectedText.id, {
        scale: Math.min(selectedText.scale + 0.1, 3)
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        scale: Math.min(selectedImage.scale + 0.1, 3)
      });
    }
  };

  const scaleElementDown = () => {
    const selectedText = textFields.find(field => field.id === selectedTextId);
    const selectedImage = imageFields.find(field => field.id === selectedImageId);
    
    if (selectedText) {
      updateTextField(selectedText.id, {
        scale: Math.max(selectedText.scale - 0.1, 0.3)
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        scale: Math.max(selectedImage.scale - 0.1, 0.3)
      });
    }
  };

  return {
    textFields,
    imageFields,
    lineFields,
    selectedTextId,
    selectedImageId,
    selectedLineId,
    templateImage,
    imageStyle,
    isDragging,
    draggedElementId,
    draggedElementType,
    dragOffset,
    updateTextField,
    updateImageField,
    updateLineField,
    addTextField,
    addLineField,
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
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
    saveToHistory
  };
};
