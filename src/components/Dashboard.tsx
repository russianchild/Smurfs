import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageCircle, 
  BarChart3, 
  Users, 
  Map, 
  TrendingUp, 
  Calendar,
  Award,
  Heart,
  Target,
  Clock
} from "lucide-react";

interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Journey {
  journey_name: string;
  current_stage: string;
  progress_percentage: number;
  unlocked_features: string[];
  completed_sessions: number;
  created_at: string;
}

interface RecentAssessment {
  depression_score: number;
  anxiety_score: number;
  stress_score: number;
  created_at: string;
}

const Dashboard = ({ activeTab, onTabChange }: DashboardProps) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [recentAssessment, setRecentAssessment] = useState<RecentAssessment | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch mental health journey
    const { data: journeyData } = await supabase
      .from('mental_health_journeys')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (journeyData) {
      setJourney(journeyData);
    }

    // Fetch recent assessment
    const { data: assessmentData } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assessmentData) {
      setRecentAssessment(assessmentData);
    }

    // Fetch completed sessions count
    const { data: sessionsData } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (sessionsData) {
      setCompletedSessions(sessionsData.length);
    }
  };

  const quickActions = [
    {
      title: "Start AI Chat",
      description: "Continue your therapy session",
      icon: MessageCircle,
      action: () => onTabChange("chat"),
      gradient: "bg-gradient-therapeutic",
      enabled: true
    },
    {
      title: "Take Assessment",
      description: "Check your mental health",
      icon: BarChart3,
      action: () => onTabChange("assessment"),
      gradient: "bg-gradient-healing",
      enabled: true
    },
    {
      title: "Join Community",
      description: "Connect with others",
      icon: Users,
      action: () => onTabChange("community"),
      gradient: "bg-gradient-community",
      enabled: true
    },
    {
      title: "Mental Health Journey",
      description: "Explore your wellness path",
      icon: Map,
      action: () => onTabChange("journey"),
      gradient: "bg-gradient-therapeutic",
      enabled: journey && journey.unlocked_features?.includes('journey')
    }
  ];

  const getStageDisplay = (stage: string) => {
    const stages = {
      'beginning': { label: 'Getting Started', color: 'bg-blue-100 text-blue-800' },
      'exploring': { label: 'Exploring', color: 'bg-green-100 text-green-800' },
      'growing': { label: 'Growing', color: 'bg-purple-100 text-purple-800' },
      'thriving': { label: 'Thriving', color: 'bg-yellow-100 text-yellow-800' }
    };
    return stages[stage as keyof typeof stages] || stages.beginning;
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your mental health journey overview
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-therapeutic/10 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
                  <p className="text-2xl font-bold">{completedSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-healing/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-healing" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{journey?.progress_percentage || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-community/10 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Days Active</p>
                  <p className="text-2xl font-bold">
                    {journey ? Math.floor((new Date().getTime() - new Date(journey.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent rounded-xl">
                  <Award className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Stage</p>
                  <Badge className={`${getStageDisplay(journey?.current_stage || 'beginning').color} mt-1`}>
                    {getStageDisplay(journey?.current_stage || 'beginning').label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Continue your mental health journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Card 
                        key={index}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-therapeutic border-0 ${
                          !action.enabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={action.enabled ? action.action : undefined}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 ${action.gradient} rounded-xl`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{action.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {action.description}
                              </p>
                              {!action.enabled && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  Complete more sessions to unlock
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress & Recent Activity */}
          <div className="space-y-6">
            {/* Journey Progress */}
            <Card className="border-0 shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5" />
                  <span>Journey Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {journey?.progress_percentage || 0}%
                    </span>
                  </div>
                  <Progress value={journey?.progress_percentage || 0} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Unlocked Features</p>
                  <div className="flex flex-wrap gap-2">
                    {journey?.unlocked_features?.length ? (
                      journey.unlocked_features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Complete more sessions to unlock features
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Assessment */}
            {recentAssessment && (
              <Card className="border-0 shadow-gentle">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Latest Assessment</span>
                  </CardTitle>
                  <CardDescription>
                    <Clock className="h-4 w-4 inline mr-1" />
                    {new Date(recentAssessment.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Depression</span>
                      <span className={`text-sm font-medium ${getMoodColor(recentAssessment.depression_score)}`}>
                        {recentAssessment.depression_score}/10
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Anxiety</span>
                      <span className={`text-sm font-medium ${getMoodColor(recentAssessment.anxiety_score)}`}>
                        {recentAssessment.anxiety_score}/10
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stress</span>
                      <span className={`text-sm font-medium ${getMoodColor(recentAssessment.stress_score)}`}>
                        {recentAssessment.stress_score}/10
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onTabChange("assessment")}
                  >
                    Take New Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;