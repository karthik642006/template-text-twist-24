
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { captureMemeContainer } from "@/utils/memeDownloadUtils";

const DownloadComponent = () => {
  const { toast } = useToast();

  const handleDownloadClick = async () => {
    console.log("Download component clicked");

    try {
      await captureMemeContainer({
        format: 'png',
        quality: 1.0,
        filename: `meme-${Date.now()}`
      });

      toast({
        title: "Download successful!",
        description: "Your meme has been downloaded as PNG with proper text positioning."
      });

    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unable to download meme. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 text-xs px-2 h-8"
      onClick={handleDownloadClick}
    >
      <Download className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">DL</span>
      <span className="sm:hidden">DL</span>
    </Button>
  );
};

export default DownloadComponent;
