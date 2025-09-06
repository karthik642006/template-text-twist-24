import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, X, Plus, ArrowLeft, Play, Pause, Sparkles, Zap, Heart, RotateCcw, Waves } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";
import { SimpleGifGenerator } from "@/utils/gifGenerator";
const ImageToGif = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [frameDuration, setFrameDuration] = useState([500]);
  const [isLooping, setIsLooping] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);

  // New AI animation features
  const [selectedAnimationStyle, setSelectedAnimationStyle] = useState<string>("");
  const [topCaption, setTopCaption] = useState("");
  const [bottomCaption, setBottomCaption] = useState("");
  const [textAnimationStyle, setTextAnimationStyle] = useState("bounce");
  const [exportFormat, setExportFormat] = useState("gif");
  const [aiPrompt, setAiPrompt] = useState("");
  const animationStyles = [{
    id: "zoom",
    name: "Zoom Meme",
    description: "Zoom in/out on face + flashing text",
    icon: <Zap className="w-4 h-4" />,
    prompt: "Zoom in and out dramatically on the main subject, add intensity with quick cuts"
  }, {
    id: "crying",
    name: "Crying Face",
    description: "Add cartoon tears dropping",
    icon: <Waves className="w-4 h-4" />,
    prompt: "Add animated cartoon tears falling from eyes, sad expression enhancement"
  }, {
    id: "dance",
    name: "Happy Dance",
    description: "Wiggle/rotate head + celebration vibes",
    icon: <RotateCcw className="w-4 h-4" />,
    prompt: "Add subtle head bobbing and wiggling motion, celebratory happy movement"
  }, {
    id: "reaction",
    name: "Reaction Loop",
    description: "Facial expressions loop (LOL, smirk)",
    icon: <Heart className="w-4 h-4" />,
    prompt: "Create looping facial expression changes, blinking, smiling, reaction emotions"
  }, {
    id: "glitch",
    name: "Glitch Effect",
    description: "Apply glitch + meme overlay",
    icon: <Sparkles className="w-4 h-4" />,
    prompt: "Add digital glitch effects, color distortion, static noise overlay"
  }, {
    id: "blink",
    name: "Blink & Nod",
    description: "Natural blinking and head movements",
    icon: <Play className="w-4 h-4" />,
    prompt: "Add natural blinking animation and subtle head nodding movements"
  }];
  const textAnimations = [{
    id: "bounce",
    name: "Bounce In",
    description: "Text bounces into view"
  }, {
    id: "typewriter",
    name: "Typewriter",
    description: "Text appears letter by letter"
  }, {
    id: "flash",
    name: "Flash",
    description: "Text flashes with animation style"
  }, {
    id: "slide",
    name: "Slide In",
    description: "Text slides from edges"
  }, {
    id: "fade",
    name: "Fade In",
    description: "Text fades in smoothly"
  }];
  const exportFormats = [{
    id: "gif",
    name: "GIF",
    description: "Classic animated format"
  }, {
    id: "mp4",
    name: "MP4",
    description: "Video format, smaller file"
  }, {
    id: "webm",
    name: "WebM",
    description: "Modern web format"
  }];
  const sampleGifs = [{
    id: 1,
    name: "Fire Effect",
    url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
    thumbnail: "https://media.giphy.com/media/13HgwGsXF0aiGY/200w.gif"
  }, {
    id: 2,
    name: "Sparkles",
    url: "https://media.giphy.com/media/26BRtW4zppkY5a5ry/giphy.gif",
    thumbnail: "https://media.giphy.com/media/26BRtW4zppkY5a5ry/200w.gif"
  }, {
    id: 3,
    name: "Rainbow",
    url: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
    thumbnail: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/200w.gif"
  }, {
    id: 4,
    name: "Hearts",
    url: "https://media.giphy.com/media/3o6Mb8Do5WbIoLhF60/giphy.gif",
    thumbnail: "https://media.giphy.com/media/3o6Mb8Do5WbIoLhF60/200w.gif"
  }];
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            setSelectedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleGifUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedGif(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  const generateAIPrompt = () => {
    const selectedStyle = animationStyles.find(style => style.id === selectedAnimationStyle);
    let prompt = "Convert this static image into a funny animated GIF. ";
    if (selectedStyle) {
      prompt += selectedStyle.prompt + ". ";
    }
    if (topCaption || bottomCaption) {
      prompt += `Add animated meme-style text: `;
      if (topCaption) prompt += `Top: "${topCaption}" `;
      if (bottomCaption) prompt += `Bottom: "${bottomCaption}" `;
      prompt += `with ${textAnimationStyle} animation. `;
    }
    prompt += "Maintain meme tone: sarcastic, relatable, or internet-trendy.";
    return prompt;
  };
  const generateGif = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setIsGenerating(true);
    try {
      console.log("Starting GIF generation with", selectedImages.length, "images");
      const gifGenerator = new SimpleGifGenerator();

      // Load all images and add them to the generator
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Handle CORS if needed
          img.onload = () => {
            console.log("Image loaded successfully:", img.width, "x", img.height);
            resolve(img);
          };
          img.onerror = error => {
            console.error("Error loading image:", error);
            reject(error);
          };
          img.src = src;
        });
      };
      console.log("Loading images...");
      for (let i = 0; i < selectedImages.length; i++) {
        const imageSrc = selectedImages[i];
        console.log(`Loading image ${i + 1}/${selectedImages.length}`);
        const img = await loadImage(imageSrc);
        gifGenerator.addFrame(img, frameDuration[0]);
      }
      console.log("Generating output...");
      let generatedUrl: string;
      if (exportFormat === "gif") {
        generatedUrl = await gifGenerator.generateGif();
      } else if (exportFormat === "webm") {
        generatedUrl = await gifGenerator.generateAnimatedWebP();
      } else {
        generatedUrl = await gifGenerator.generateMP4();
      }
      console.log("Generation complete, URL:", generatedUrl);
      setGeneratedGif(generatedUrl);
      setIsGenerating(false);
      toast.success(`${exportFormat.toUpperCase()} created successfully with ${selectedImages.length} frames!`);
    } catch (error) {
      console.error('Error generating GIF:', error);
      setIsGenerating(false);
      toast.error(`Failed to generate ${exportFormat.toUpperCase()}. Please try again.`);
    }
  };
  const downloadGif = () => {
    if (generatedGif) {
      const link = document.createElement('a');
      link.href = generatedGif;
      link.download = `animated-meme-${selectedAnimationStyle}-${Date.now()}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${exportFormat.toUpperCase()} downloaded successfully!`);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="text-xl font-bold">AI Image to GIF</span>
        </div>
        <div className="flex items-center">
          <HamburgerMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered Meme GIF Generator
          </h1>
          <p className="text-gray-400">Transform static images into hilarious animated memes with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload">
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700" asChild>
                      <span>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Images
                      </span>
                    </Button>
                  </label>
                  <p className="text-gray-400 text-sm mt-2">Upload face photos or meme base images</p>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && <div className="grid grid-cols-4 gap-2">
                    {selectedImages.map((image, index) => <div key={index} className="relative">
                        <img src={image} alt={`Frame ${index + 1}`} className="w-full h-16 object-cover rounded border border-gray-600" />
                        <Button size="sm" variant="ghost" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full">
                          <X className="w-3 h-3" />
                        </Button>
                        <Badge variant="secondary" className="absolute bottom-0 left-0 text-xs">
                          {index + 1}
                        </Badge>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>

            {/* Animation Style Selection */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Animation Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {animationStyles.map(style => <div key={style.id} onClick={() => setSelectedAnimationStyle(style.id)} className={`cursor-pointer p-3 rounded border transition-colors ${selectedAnimationStyle === style.id ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {style.icon}
                        <span className="font-medium text-sm">{style.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{style.description}</p>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Meme Captions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Meme Captions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Top Text
                  </label>
                  <Input placeholder="WHEN MONDAY HITS..." value={topCaption} onChange={e => setTopCaption(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Bottom Text
                  </label>
                  <Input placeholder="BUT YOU'RE STILL LOADING..." value={bottomCaption} onChange={e => setBottomCaption(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Text Animation
                  </label>
                  <Select value={textAnimationStyle} onValueChange={setTextAnimationStyle}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textAnimations.map(anim => <SelectItem key={anim.id} value={anim.id}>
                          <div>
                            <div className="font-medium">{anim.name}</div>
                            <div className="text-xs text-gray-500">{anim.description}</div>
                          </div>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Export Settings */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Output Format
                  </label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map(format => <SelectItem key={format.id} value={format.id}>
                          <div>
                            <div className="font-medium">{format.name}</div>
                            <div className="text-xs text-gray-500">{format.description}</div>
                          </div>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Frame Duration: {frameDuration[0]}ms
                  </label>
                  <Slider value={frameDuration} onValueChange={setFrameDuration} max={2000} min={100} step={100} className="w-full" />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="looping" checked={isLooping} onChange={e => setIsLooping(e.target.checked)} className="rounded" />
                  <label htmlFor="looping" className="text-sm text-gray-300">
                    Loop animation
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Generate */}
          <div className="space-y-6">
            {/* AI Prompt Preview */}
            {aiPrompt && <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Generation Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-300">{aiPrompt}</p>
                  </div>
                </CardContent>
              </Card>}

            {/* Preview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Preview
                  {generatedGif && <Button size="sm" variant="ghost" onClick={() => setIsPreviewPlaying(!isPreviewPlaying)} className="text-gray-400 hover:text-white">
                      {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700/50 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {isGenerating ? <div className="space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
                      <p className="text-gray-300">Creating your animated meme...</p>
                      <p className="text-gray-500 text-sm">Processing {selectedImages.length} frames</p>
                    </div> : generatedGif ? <div className="space-y-4">
                      <img src={generatedGif} alt="Generated GIF" className="max-w-full max-h-[250px] rounded border border-gray-600" style={{
                    display: isPreviewPlaying ? 'block' : 'none'
                  }} />
                      {!isPreviewPlaying && <div className="w-64 h-64 bg-gray-600 rounded flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-400" />
                        </div>}
                    </div> : selectedImages.length > 0 ? <div className="space-y-2">
                      <img src={selectedImages[0]} alt="Preview" className="max-w-full max-h-[200px] rounded border border-gray-600" />
                      <p className="text-gray-400 text-sm">
                        Ready for animation with {selectedAnimationStyle ? animationStyles.find(s => s.id === selectedAnimationStyle)?.name : 'selected style'}
                      </p>
                    </div> : <div className="text-gray-400">
                      <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Upload images to see preview</p>
                    </div>}
                </div>
              </CardContent>
            </Card>

            {/* Generate & Download */}
            <div className="space-y-4">
              {selectedImages.length > 0 && (
                <Button onClick={generateGif} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating AI Meme {exportFormat.toUpperCase()}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Animated Meme
                    </>
                  )}
                </Button>
              )}

              {generatedGif && (
                <Button onClick={downloadGif} className="w-full bg-green-600 hover:bg-green-700 h-12">
                  <Download className="w-4 h-4 mr-2" />
                  Download {exportFormat.toUpperCase()}
                </Button>
              )}

              {selectedImages.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed border-gray-600 rounded-lg">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">Upload images to see generation options</p>
                </div>
              )}
            </div>

            {/* Background GIF Selection */}
            <Card className="bg-gray-800/50 border-gray-700">
              
              
            </Card>
          </div>
        </div>
      </main>
    </div>;
};
export default ImageToGif;