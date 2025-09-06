
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Meme Editor", path: "/editor/blank" },
    { title: "Template Editor", path: "/template-editor" },
    { title: "Image to GIF", path: "/image-to-gif" },
    { title: "About Us", path: "/about" },
    { title: "Pricing", path: "/pricing" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 p-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-white border-l border-gray-200">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          </div>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-12 text-lg"
              onClick={() => handleNavigation(item.path)}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
