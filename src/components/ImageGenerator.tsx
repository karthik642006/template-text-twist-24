import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}
const ImageGenerator = ({
  onImageGenerated
}: ImageGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [layout, setLayout] = useState("single");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const {
    toast
  } = useToast();
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your meme image",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-meme-image', {
        body: {
          prompt: prompt.trim(),
          layout
        }
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Success!",
          description: "Your meme image has been generated"
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
  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      setIsOpen(false);
      setGeneratedImage("");
      setPrompt("");
      toast({
        title: "Image Applied",
        description: "Generated image is now your meme template"
      });
    }
  };
  const layoutOptions = [{
    value: "single",
    label: "Single Scene",
    desc: "One unified image"
  }, {
    value: "split-horizontal",
    label: "Top/Bottom Split",
    desc: "Two horizontal sections"
  }, {
    value: "split-vertical",
    label: "Left/Right Split",
    desc: "Two vertical sections"
  }, {
    value: "quad",
    label: "Four Panels",
    desc: "Four equal sections"
  }];
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 text-xs px-2 h-8">
          <Wand2 className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">AI</span>
          <span className="sm:hidden">AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generate Meme Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Describe your meme image
            </label>
            <Input placeholder="e.g., cat looking confused, two people arguing..." value={prompt} onChange={e => setPrompt(e.target.value)} className="border-gray-300" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Layout Style
            </label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {layoutOptions.map(option => <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.desc}</span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">No text in image</Badge>
            <Badge variant="secondary" className="text-xs">Copyright safe</Badge>
            <Badge variant="secondary" className="text-xs">Meme optimized</Badge>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            {isGenerating ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </> : <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </>}
          </Button>

          {generatedImage && <div className="space-y-3">
              <img src={generatedImage} alt="Generated meme" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
              <Button onClick={handleUseImage} className="w-full bg-green-600 hover:bg-green-700">
                Use This Image
              </Button>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};
export default ImageGenerator;