import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/AuthPage";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import AITherapistChat from "@/components/AITherapistChat";
import MentalHealthAssessment from "@/components/MentalHealthAssessment";
import Community from "@/components/Community";
import MentalHealthJourney from "@/components/MentalHealthJourney";

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-therapeutic rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <AITherapistChat />;
      case "assessment":
        return <MentalHealthAssessment />;
      case "community":
        return <Community />;
      case "journey":
        return <MentalHealthJourney />;
      default:
        return <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      {renderContent()}
    </div>
  );
};

export default Index;
