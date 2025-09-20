import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2, Edit, Download, Plus, Trash2, Smile, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ImageEditor = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-card-foreground">Image Editor</h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Prompt Section */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Enter your image prompt
              </label>
              <div className="flex gap-4">
                <Input
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Image Display and Edit Tools */}
        {generatedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Generated Image */}
            <div className="lg:col-span-3">
              <Card className="p-4">
                <div className="aspect-square relative">
                  <img 
                    src={generatedImage} 
                    alt="Generated image" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ display: editMode ? 'block' : 'none' }}
                  />
                </div>
              </Card>
            </div>

            {/* Edit Tools Panel */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-4 text-card-foreground">Edit Tools</h3>
                <div className="space-y-3">
                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>

                  {/* Edit Buttons */}
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground mb-3">Edit Options</p>
                    
                    <Button
                      onClick={() => handleEdit("add")}
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Components
                    </Button>

                    <Button
                      onClick={() => handleEdit("remove")}
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Elements
                    </Button>

                    <Button
                      onClick={() => handleEdit("emotion")}
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      <Smile className="w-4 h-4 mr-2" />
                      Change Emotions
                    </Button>

                    <Button
                      onClick={() => handleEdit("color")}
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Adjust Colors
                    </Button>

                    <Button
                      onClick={() => setEditMode(!editMode)}
                      variant={editMode ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
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