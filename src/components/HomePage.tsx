import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BarChart3, Users, Heart, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Therapist",
      description: "24/7 supportive conversations with our compassionate AI therapy assistant",
      action: () => onNavigate("chat"),
      gradient: "bg-gradient-therapeutic"
    },
    {
      icon: BarChart3,
      title: "Mental Health Assessment", 
      description: "Track your depression, anxiety, and stress levels with personalized insights",
      action: () => onNavigate("assessment"),
      gradient: "bg-gradient-healing"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys in a safe, supportive environment",
      action: () => onNavigate("community"),
      gradient: "bg-gradient-community"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations and data are completely confidential"
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Get support whenever you need it, day or night"
    },
    {
      icon: Heart,
      title: "Judgement-Free",
      description: "A compassionate space to explore your feelings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Mental Health{" "}
                  <span className="bg-gradient-therapeutic bg-clip-text text-transparent">
                    Companion
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Get personalized support through AI therapy, track your mental wellness,
                  and connect with a caring community. Your journey to better mental health starts here.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate("chat")}
                  className="bg-gradient-therapeutic shadow-therapeutic hover:shadow-elevated transition-gentle"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start AI Therapy
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate("assessment")}
                  className="border-primary/20 hover:bg-primary/5 transition-gentle"
                >
                  Take Assessment
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Peaceful wellness illustration"
                className="rounded-2xl shadow-elevated w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your mental wellness journey in one caring platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-therapeutic transition-gentle cursor-pointer border-0 shadow-gentle"
                  onClick={feature.action}
                >
                  <CardHeader className="text-center pb-6">
                    <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose heAl?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-therapeutic text-white border-0 shadow-elevated">
            <CardContent className="text-center p-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Take the first step towards better mental health with our compassionate AI support
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => onNavigate("chat")}
                className="bg-white text-primary hover:bg-gray-50 transition-gentle"
              >
                <Heart className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;