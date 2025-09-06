import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TemplateGallery from "@/components/TemplateGallery";
import GifGenerator from "@/components/GifGenerator";
import TemplateSearch from "@/components/TemplateSearch";
import HamburgerMenu from "@/components/HamburgerMenu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const Index = () => {
  const [textPrompt, setTextPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleGenerateImage = async () => {
    if (!textPrompt.trim()) {
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
          prompt: textPrompt.trim(),
          layout: "single"
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
  const handleUseTemplate = () => {
    if (generatedImage) {
      // Store the generated image in localStorage to pass to editor
      localStorage.setItem('selectedTemplate', generatedImage);
      navigate('/editor/generated');
    }
  };
  const popularTemplates = [{
    id: 1,
    name: "Distracted Boyfriend",
    image: "https://i.imgflip.com/1ur9b0.jpg"
  }, {
    id: 2,
    name: "Drake Pointing",
    image: "https://i.imgflip.com/30b1gx.jpg"
  }, {
    id: 3,
    name: "Woman Yelling at Cat",
    image: "https://i.imgflip.com/345v97.jpg"
  }, {
    id: 4,
    name: "Two Buttons",
    image: "https://i.imgflip.com/1g8my4.jpg"
  }];
  const animations = [{
    id: 1,
    name: "Curl Hair",
    preview: "https://i.imgflip.com/1g8my4.jpg"
  }, {
    id: 2,
    name: "Fly Up",
    preview: "https://i.imgflip.com/30b1gx.jpg"
  }];
  if (activeTab === "templates") {
    return <TemplateGallery />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-bold">MemeGen</span>
        </div>
        <HamburgerMenu />
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-8">
        {/* Text to Image Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Meme Generator
            </h1>
            <p className="text-gray-400">Create hilarious memes with AI-powered tools</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Text to Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Describe the meme you want to create..." value={textPrompt} onChange={e => setTextPrompt(e.target.value)} className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]" />
              <Button onClick={handleGenerateImage} disabled={isGenerating || !textPrompt.trim()} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                {isGenerating ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </> : <>
                    Generate Meme
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>}
              </Button>

              {/* Generated Image Display */}
              {generatedImage && <div className="space-y-3">
                  <img src={generatedImage} alt="Generated meme template" className="w-full h-64 object-cover rounded-lg border border-gray-600" />
                  <Button onClick={handleUseTemplate} className="w-full bg-green-600 hover:bg-green-700">
                    Use This Template
                  </Button>
                </div>}
            </CardContent>
          </Card>
        </section>

        {/* Template Search Section */}
        <TemplateSearch />

        {/* Image to GIF Section */}
        <section>
          <GifGenerator />
        </section>
      </main>
    </div>;
};
export default Index;