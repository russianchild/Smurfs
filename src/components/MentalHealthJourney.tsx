import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Map, 
  MapPin, 
  Compass, 
  Mountain, 
  Sunrise, 
  Star,
  Lock,
  CheckCircle,
  ArrowRight,
  Heart,
  Brain,
  Users,
  Award
} from "lucide-react";

interface Journey {
  id: string;
  journey_name: string;
  current_stage: string;
  progress_percentage: number;
  unlocked_features: string[];
  completed_sessions: number;
  created_at: string;
  updated_at: string;
}

const MentalHealthJourney = () => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJourney();
    }
  }, [user]);

  const fetchJourney = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('mental_health_journeys')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setJourney(data);
    }
    setLoading(false);
  };

  const stages = [
    {
      id: 'beginning',
      title: 'Getting Started',
      description: 'Beginning your mental health journey with self-awareness',
      icon: Sunrise,
      color: 'bg-blue-100 text-blue-800',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      requirements: 'Complete your first assessment',
      unlocks: ['Basic chat features', 'Community access']
    },
    {
      id: 'exploring',
      title: 'Exploring',
      description: 'Discovering coping strategies and building habits',
      icon: Compass,
      color: 'bg-green-100 text-green-800',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      requirements: '5 chat sessions + 2 assessments',
      unlocks: ['Advanced chat features', 'Mood tracking', 'Goal setting']
    },
    {
      id: 'growing',
      title: 'Growing',
      description: 'Developing resilience and emotional intelligence',
      icon: Mountain,
      color: 'bg-purple-100 text-purple-800',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      requirements: '15 chat sessions + 5 assessments',
      unlocks: ['Personalized insights', 'Progress analytics', 'Mentor connection']
    },
    {
      id: 'thriving',
      title: 'Thriving',
      description: 'Maintaining wellness and helping others',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      requirements: '30 chat sessions + 10 assessments',
      unlocks: ['Community leadership', 'Advanced tools', 'Wellness coaching']
    }
  ];

  const milestones = [
    {
      title: 'First Chat Session',
      description: 'Started your first conversation with the AI therapist',
      icon: Heart,
      completed: journey && journey.completed_sessions >= 1
    },
    {
      title: 'Mental Health Assessment',
      description: 'Completed your first comprehensive assessment',
      icon: Brain,
      completed: journey && journey.unlocked_features?.includes('assessment')
    },
    {
      title: 'Community Engagement',
      description: 'Joined the community and made your first post',
      icon: Users,
      completed: journey && journey.unlocked_features?.includes('community')
    },
    {
      title: 'Progress Tracking',
      description: 'Consistently tracking your mental health journey',
      icon: Award,
      completed: journey && journey.progress_percentage >= 25
    }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === journey?.current_stage) || 0;
  };

  const getStageStatus = (stageIndex: number) => {
    const currentIndex = getCurrentStageIndex();
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'locked';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-therapeutic rounded-full flex items-center justify-center mx-auto mb-6">
            <Map className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Your Mental Health Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress through different stages of mental wellness and unlock new features along the way
          </p>
        </div>

        {/* Current Progress */}
        <Card className="mb-12 border-0 shadow-therapeutic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Current Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {journey?.progress_percentage || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-healing mb-2">
                  {journey?.completed_sessions || 0}
                </div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
              <div className="text-center">
                <Badge className={stages[getCurrentStageIndex()].color}>
                  {stages[getCurrentStageIndex()].title}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Current Stage</p>
              </div>
            </div>
            <Progress value={journey?.progress_percentage || 0} className="h-3" />
          </CardContent>
        </Card>

        {/* Journey Stages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Journey Stages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const status = getStageStatus(index);
              
              return (
                <Card 
                  key={stage.id}
                  className={`border-0 transition-all duration-300 ${
                    status === 'current' 
                      ? 'shadow-therapeutic scale-105' 
                      : status === 'completed'
                      ? 'shadow-gentle'
                      : 'opacity-75'
                  }`}
                >
                  <CardHeader className={`${stage.bgColor} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      {status === 'completed' && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                      {status === 'locked' && (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                      {status === 'current' && (
                        <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{stage.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {stage.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Requirements:
                        </p>
                        <p className="text-xs">{stage.requirements}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Unlocks:
                        </p>
                        <div className="space-y-1">
                          {stage.unlocks.map((unlock, i) => (
                            <Badge key={i} variant="secondary" className="text-xs mr-1">
                              {unlock}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-primary" />
              <span>Milestones</span>
            </CardTitle>
            <CardDescription>
              Track your key achievements along the journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                      milestone.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-full ${
                      milestone.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        milestone.completed ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-sm ${
                        milestone.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                    {milestone.completed && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentalHealthJourney;