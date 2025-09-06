
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShareComponent = () => {
  const { toast } = useToast();

  const handleShareClick = async () => {
    console.log("Share component clicked");
    
    const shareUrl = window.location.href;
    const shareText = "Check out this awesome meme I created!";
    
    try {
      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: 'My Awesome Meme',
          text: shareText,
          url: shareUrl,
        };
        
        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          console.log("Using Web Share API");
          await navigator.share(shareData);
          
          toast({
            title: "Shared successfully!",
            description: "Your meme has been shared."
          });
          return;
        }
      }
      
      // Fallback: try to copy to clipboard
      console.log("Falling back to clipboard copy");
      const textToCopy = `${shareText} ${shareUrl}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Link copied to clipboard!",
          description: "Share your meme by pasting the link anywhere."
        });
      } else {
        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast({
            title: "Link copied to clipboard!",
            description: "Share your meme by pasting the link anywhere."
          });
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast({
            title: "Share link",
            description: shareUrl,
            variant: "default"
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
    } catch (error) {
      console.error('Share error:', error);
      
      // If sharing was cancelled by user, don't show error
      if (error instanceof Error && error.name === 'AbortError') {
        console.log("Share was cancelled by user");
        return;
      }
      
      // Final fallback - just copy to clipboard
      try {
        const textToCopy = `${shareText} ${shareUrl}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          toast({
            title: "Link copied to clipboard!",
            description: "Share your meme by pasting the link anywhere."
          });
        } else {
          toast({
            title: "Share link",
            description: shareUrl,
            variant: "default"
          });
        }
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
        toast({
          title: "Share link",
          description: shareUrl,
          variant: "default"
        });
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none hover:from-green-600 hover:to-emerald-600 text-xs px-2 h-8"
      onClick={handleShareClick}
    >
      <Share className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">Share</span>
      <span className="sm:hidden">Shr</span>
    </Button>
  );
};

export default ShareComponent;
