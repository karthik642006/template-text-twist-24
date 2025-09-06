
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadComponentProps {
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onTemplateSelect?: (src: string) => void;
}

const UploadComponent = ({ onImageSelect, onTemplateSelect }: UploadComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isTemplate: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result && typeof result === 'string') {
        console.log("File read successfully, data URL length:", result.length);
        
        if (isTemplate && onTemplateSelect) {
          onTemplateSelect(result);
          toast({
            title: "Template uploaded!",
            description: "Your image has been set as the new meme template."
          });
        } else {
          onImageSelect(result, 'upload');
          toast({
            title: "Upload successful!",
            description: "Your image has been added to the meme editor."
          });
        }
        
        setIsOpen(false);
      } else {
        console.error('Failed to read file - no result');
        toast({
          title: "Upload failed",
          description: "Failed to read the image file. Please try again.",
          variant: "destructive"
        });
      }
      setIsUploading(false);
      // Reset the input value
      e.target.value = '';
    };

    reader.onerror = () => {
      console.error('FileReader error');
      toast({
        title: "Upload failed",
        description: "Error reading the image file. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 text-xs px-2 h-8"
        >
          <Upload className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Upload</span>
          <span className="sm:hidden">Up</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-500" />
            Upload Image or Template
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">New Template</TabsTrigger>
            <TabsTrigger value="image">Add Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="template" className="space-y-4">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Replace Template</h3>
              <p className="text-gray-600 mb-4">Upload a new image to use as your meme template</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, true)} 
                className="hidden" 
                id="template-upload-input"
                disabled={isUploading}
              />
              <label htmlFor="template-upload-input">
                <Button 
                  className="cursor-pointer bg-orange-600 hover:bg-orange-700"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    {isUploading ? "Uploading..." : "Choose Template"}
                  </span>
                </Button>
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Image Element</h3>
              <p className="text-gray-600 mb-4">Add an image as an element on top of your meme</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, false)} 
                className="hidden" 
                id="image-upload-input"
                disabled={isUploading}
              />
              <label htmlFor="image-upload-input">
                <Button 
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    {isUploading ? "Uploading..." : "Choose Image"}
                  </span>
                </Button>
              </label>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Supported formats: JPG, PNG, GIF • Max size: 10MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadComponent;
