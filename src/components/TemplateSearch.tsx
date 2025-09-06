
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  category: string;
  photographer?: string;
  photographer_url?: string;
}

const TemplateSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ["Animals", "Reactions", "Work", "Love", "Trending", "Funny", "Sports", "Technology"];

  const handleSearch = async (isLoadMore = false) => {
    if (!searchQuery.trim() && !selectedCategory) {
      toast({
        title: "Search Required",
        description: "Please enter a search term or select a category",
        variant: "destructive"
      });
      return;
    }

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsSearching(true);
      setTemplates([]);
      setCurrentPage(1);
    }
    
    try {
      const pageToFetch = isLoadMore ? currentPage + 1 : 1;
      const { data, error } = await supabase.functions.invoke('search-templates', {
        body: { 
          query: searchQuery.trim(), 
          category: selectedCategory,
          page: pageToFetch,
          per_page: 80 // Increased from 20 to 80 per page
        }
      });

      if (error) throw error;

      if (data?.templates) {
        if (isLoadMore) {
          setTemplates(prev => [...prev, ...data.templates]);
          setCurrentPage(pageToFetch);
        } else {
          setTemplates(data.templates);
          setCurrentPage(1);
        }
        
        setTotalResults(data.total_results || 0);
        setHasMore(data.next_page && templates.length + data.templates.length < 1000); // Cap at 1000 results
        
        const totalFound = isLoadMore ? templates.length + data.templates.length : data.templates.length;
        toast({
          title: "Search Complete",
          description: `Showing ${totalFound} of ${data.total_results || 0} templates`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search templates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    handleSearch(true);
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      localStorage.setItem('selectedTemplate', selectedTemplate.image);
      navigate('/editor/pexels-' + selectedTemplate.id);
      setShowPreview(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Find Your Perfect Template</h2>
        <p className="text-gray-400">Search thousands of copyright-free images</p>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <Input
              placeholder="Search meme templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
              className="text-xs"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results Info */}
          {templates.length > 0 && (
            <div className="text-center text-gray-400 text-sm">
              Showing {templates.length} of {totalResults} results
            </div>
          )}

          {/* Search Results */}
          {templates.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={`${template.id}-${template.category}`}
                    className="bg-gray-700/50 border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <CardContent className="p-0">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        className="w-full h-32 object-cover rounded-t-lg" 
                      />
                      <div className="p-2">
                        <span className="text-white text-sm truncate block">{template.name}</span>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && templates.length < 1000 && (
                <div className="text-center">
                  <Button 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      `Load More Templates (${templates.length}/${Math.min(totalResults, 1000)})`
                    )}
                  </Button>
                </div>
              )}

              {templates.length >= 1000 && (
                <div className="text-center text-gray-400 text-sm">
                  Maximum of 1000 results displayed. Try refining your search for more specific results.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Template Preview</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <img 
                src={selectedTemplate.image} 
                alt={selectedTemplate.name} 
                className="w-full max-h-96 object-contain rounded-lg"
              />
              <div className="text-center space-y-2">
                <h3 className="text-white font-semibold">{selectedTemplate.name}</h3>
                {selectedTemplate.photographer && (
                  <p className="text-gray-400 text-sm">
                    Photo by {selectedTemplate.photographer}
                  </p>
                )}
                <Button 
                  onClick={handleUseTemplate}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TemplateSearch;
