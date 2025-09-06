import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowRight, Download, X } from "lucide-react";
import { toast } from "sonner";
const GifGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGifs, setGeneratedGifs] = useState<Array<{
    id: number;
    url: string;
    effect: string;
  }>>([]);
  const gifEffects = [{
    id: 1,
    name: "Fade In/Out",
    preview: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
    description: "Smooth fade animation"
  }, {
    id: 2,
    name: "Zoom In/Out",
    preview: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    description: "Zoom effect animation"
  }, {
    id: 3,
    name: "Rotate",
    preview: "https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif",
    description: "Spinning rotation effect"
  }, {
    id: 4,
    name: "Bounce",
    preview: "https://media.giphy.com/media/3oEjHLzm4BCF8zfPy0/giphy.gif",
    description: "Bouncing animation"
  }, {
    id: 5,
    name: "Shake",
    preview: "https://media.giphy.com/media/3oEjHChKVxgKFLM3eq/giphy.gif",
    description: "Shaking movement"
  }, {
    id: 6,
    name: "Pulse",
    preview: "https://media.giphy.com/media/3oEjHQOeg7u6wsWGWY/giphy.gif",
    description: "Pulsing effect"
  }, {
    id: 7,
    name: "Slide Left",
    preview: "https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif",
    description: "Sliding from right to left"
  }, {
    id: 8,
    name: "Slide Right",
    preview: "https://media.giphy.com/media/3oEjHLTKKJRYKhGdUY/giphy.gif",
    description: "Sliding from left to right"
  }];
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGenerateGif = async () => {
    if (!selectedImage || !selectedEffect) {
      toast.error("Please select an image and animation effect");
      return;
    }
    setIsGenerating(true);

    // Simulate GIF generation process
    setTimeout(() => {
      const newGif = {
        id: Date.now(),
        url: selectedImage,
        // In a real app, this would be the generated GIF URL
        effect: selectedEffect
      };
      setGeneratedGifs(prev => [...prev, newGif]);
      setIsGenerating(false);
      toast.success(`GIF with ${selectedEffect} effect generated successfully!`);
    }, 3000);
  };
  const downloadGif = (gif: {
    id: number;
    url: string;
    effect: string;
  }) => {
    // Create a temporary link to download the GIF
    const link = document.createElement('a');
    link.href = gif.url;
    link.download = `animated-${gif.effect.toLowerCase().replace(/\s+/g, '-')}-${gif.id}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("GIF downloaded successfully!");
  };
  const removeGif = (id: number) => {
    setGeneratedGifs(prev => prev.filter(gif => gif.id !== id));
    toast.success("GIF removed");
  };
  return <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      
      
    </Card>;
};
export default GifGenerator;