import { useState } from "react";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import AITherapistChat from "@/components/AITherapistChat";
import MentalHealthAssessment from "@/components/MentalHealthAssessment";
import Community from "@/components/Community";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <AITherapistChat />;
      case "assessment":
        return <MentalHealthAssessment />;
      case "community":
        return <Community />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
