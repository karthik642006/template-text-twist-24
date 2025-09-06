import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Advanced AI technology to generate unique memes instantly"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by meme lovers, for meme lovers worldwide"
    },
    {
      icon: Target,
      title: "Easy to Use",
      description: "Simple interface that anyone can master in minutes"
    },
    {
      icon: Heart,
      title: "Free Forever",
      description: "Core features remain free for all users always"
    }
  ];

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
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold">About Us</span>
        </div>
        <HamburgerMenu />
      </header>

      <main className="p-4 space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            About MemeGen
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're passionate about making meme creation accessible, fun, and lightning-fast for everyone.
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Our Story</h2>
              <p className="text-gray-300 leading-relaxed">
                MemeGen was born from a simple idea: memes should be easy to create and share. 
                We noticed that while memes are everywhere on the internet, creating original, 
                high-quality memes was still challenging for most people.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our team of developers, designers, and meme enthusiasts came together to build 
                the ultimate meme creation platform. Using cutting-edge AI technology, we've made 
                it possible for anyone to create professional-quality memes in seconds.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <feature.icon className="w-12 h-12 text-green-400" />
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              To democratize meme creation and help people express their creativity, humor, 
              and ideas through the universal language of memes. We believe laughter brings 
              people together, and we're here to make it easier to spread joy across the internet.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;
