import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">404</span>
          </div>
          <span className="text-xl font-bold">Page Not Found</span>
        </div>
        <HamburgerMenu />
      </header>

      <div className="flex items-center justify-center flex-1 p-4">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-2xl text-gray-300 mb-4">Oops! Page not found</p>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
