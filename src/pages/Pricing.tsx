import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual meme creators",
      features: [
        "10 AI-generated memes per day",
        "Basic template library",
        "Standard image quality",
        "Community support",
        "Watermark on exports"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious meme creators and content creators",
      features: [
        "Unlimited AI-generated memes",
        "Premium template library",
        "HD image quality",
        "Priority support",
        "No watermarks",
        "Advanced editing tools",
        "Custom fonts and styles"
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "per month",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Brand kit integration",
        "API access",
        "Custom templates",
        "Analytics dashboard",
        "Dedicated account manager"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
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
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-bold">Pricing</span>
        </div>
        <HamburgerMenu />
      </header>

      <main className="p-4 space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your meme creation needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm relative ${
                plan.popular ? 'ring-2 ring-yellow-400 border-yellow-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-gray-900 flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4 pb-8">
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full h-12 text-lg ${
                    plan.popular 
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' 
                      : ''
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Can I change plans anytime?</h3>
                <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Is there a free trial?</h3>
                <p className="text-gray-300">Yes, Pro plans come with a 7-day free trial. No credit card required.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">What payment methods do you accept?</h3>
                <p className="text-gray-300">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Do you offer refunds?</h3>
                <p className="text-gray-300">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Pricing;
