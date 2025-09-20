import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2, Edit, Download, Plus, Trash2, Smile, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HamburgerMenu from "@/components/HamburgerMenu";

const ImageEditor = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meme-image', {
        body: {
          prompt: prompt.trim(),
          layout: "single"
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Success!",
          description: "Your image has been generated"
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded!",
      description: "Image has been downloaded successfully"
    });
  };

  const handleEdit = (editType: string) => {
    if (!generatedImage) {
      toast({
        title: "No image",
        description: "Please generate an image first",
        variant: "destructive"
      });
      return;
    }

    // For now, show a placeholder toast for different edit types
    let editDescription = "";
    switch (editType) {
      case "add":
        editDescription = "Add components to the image";
        break;
      case "remove":
        editDescription = "Remove components from the image";
        break;
      case "emotion":
        editDescription = "Change emotions in the image";
        break;
      case "color":
        editDescription = "Adjust colors and style";
        break;
      default:
        editDescription = "Edit the image";
    }

    toast({
      title: "Edit Mode",
      description: `${editDescription} feature coming soon!`
    });
    setEditMode(true);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="border-b bg-blue-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Image Editor</h1>
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Prompt Section */}
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-lg font-medium text-card-foreground block mb-4">
                Prompt Box
              </label>
              <div className="space-y-4">
                <textarea
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[120px] p-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isGenerating}
                />
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Generated Image */}
        {generatedImage && (
          <Card className="p-6 mb-8">
            <div className="text-center mb-4">
              <h2 className="text-lg font-medium text-card-foreground">Generated Image</h2>
            </div>
            <div className="flex justify-center">
              <div className="max-w-2xl w-full">
                <img 
                  src={generatedImage} 
                  alt="Generated image" 
                  className="w-full h-auto rounded-lg border border-border"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Download Section */}
        {generatedImage && (
          <div className="flex justify-center">
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
          </div>
        )}

        {/* Placeholder when no image */}
        {!generatedImage && !isGenerating && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No image generated yet</h3>
              <p>Enter a prompt above and click Generate to create an image</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;