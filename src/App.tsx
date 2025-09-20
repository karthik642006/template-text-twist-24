
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MemeEditor from "./pages/MemeEditor";
import TemplateEditor from "./pages/TemplateEditor";
import ImageToGif from "./pages/ImageToGif";
import ImageEditor from "./pages/ImageEditor";
import About from "./pages/About";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/editor/:templateId" element={<MemeEditor />} />
          <Route path="/template-editor" element={<TemplateEditor />} />
          <Route path="/image-to-gif" element={<ImageToGif />} />
          <Route path="/image-editor" element={<ImageEditor />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
