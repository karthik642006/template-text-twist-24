
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";

interface MemeEditorHeaderProps {
  navigate: (delta: number) => void;
}

const MemeEditorHeader = ({ navigate }: MemeEditorHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
          ← Back
        </Button>
        <span className="text-xl font-bold text-gray-800">Meme Editor</span>
        <Star className="h-5 w-5 text-yellow-500 fill-current" />
      </div>
      <div className="flex items-center">
        <HamburgerMenu />
      </div>
    </header>
  );
};

export default MemeEditorHeader;
