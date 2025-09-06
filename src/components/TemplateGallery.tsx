import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Library, MoreHorizontal, Image, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";

const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Extended list of popular meme templates
  const templates = [
    { id: 1, name: "Distracted Boyfriend", image: "https://i.imgflip.com/1ur9b0.jpg", category: "reaction" },
    { id: 2, name: "Drake Pointing", image: "https://i.imgflip.com/30b1gx.jpg", category: "choice" },
    { id: 3, name: "Woman Yelling at Cat", image: "https://i.imgflip.com/345v97.jpg", category: "reaction" },
    { id: 4, name: "Two Buttons", image: "https://i.imgflip.com/1g8my4.jpg", category: "choice" },
    { id: 5, name: "Expanding Brain", image: "https://i.imgflip.com/1jwhww.jpg", category: "progression" },
    { id: 6, name: "Surprised Pikachu", image: "https://i.imgflip.com/2kbn1e.jpg", category: "reaction" },
    { id: 7, name: "This Is Fine", image: "https://i.imgflip.com/26am.jpg", category: "situation" },
    { id: 8, name: "Change My Mind", image: "https://i.imgflip.com/20o2ml.jpg", category: "opinion" },
    { id: 9, name: "Mocking SpongeBob", image: "https://i.imgflip.com/1otk96.jpg", category: "reaction" },
    { id: 10, name: "Ancient Aliens", image: "https://i.imgflip.com/26am.jpg", category: "conspiracy" },
    { id: 11, name: "Success Kid", image: "https://i.imgflip.com/1bhk.jpg", category: "success" },
    { id: 12, name: "Philosoraptor", image: "https://i.imgflip.com/s9o.jpg", category: "thinking" },
    { id: 13, name: "One Does Not Simply", image: "https://i.imgflip.com/1bij.jpg", category: "statement" },
    { id: 14, name: "Grumpy Cat", image: "https://i.imgflip.com/30b1gx.jpg", category: "grumpy" },
    { id: 15, name: "Bad Luck Brian", image: "https://i.imgflip.com/1bhk.jpg", category: "unlucky" },
    { id: 16, name: "First World Problems", image: "https://i.imgflip.com/s9o.jpg", category: "problems" },
  ];

  const categories = ["all", "reaction", "choice", "progression", "situation", "opinion"];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-bold">Template Gallery</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            {filteredTemplates.length} templates
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <HamburgerMenu />
        </div>
      </header>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
        />
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <main className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="bg-gray-800/50 border-gray-700 cursor-pointer hover:scale-105 transition-all duration-200 hover:bg-gray-700/50"
              onClick={() => navigate(`/editor/${template.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-black/70 text-white text-xs"
                    >
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-white text-sm font-medium truncate">
                    {template.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No templates found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-around p-4">
          <button 
            className="flex flex-col items-center space-y-1 text-gray-400"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Image className="h-5 w-5" />
            <span className="text-xs">Generate</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-blue-400">
            <Library className="h-5 w-5" />
            <span className="text-xs">Library</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TemplateGallery;
