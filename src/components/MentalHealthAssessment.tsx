import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingDown, TrendingUp, Minus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssessmentQuestion {
  id: string;
  text: string;
  category: "depression" | "anxiety" | "stress";
}

interface AssessmentResult {
  depression: number;
  anxiety: number;
  stress: number;
}

const MentalHealthAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  const questions: AssessmentQuestion[] = [
    // Depression questions
    { id: "d1", text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?", category: "depression" },
    { id: "d2", text: "How often have you had little interest or pleasure in doing things?", category: "depression" },
    { id: "d3", text: "How often have you felt tired or had little energy?", category: "depression" },
    { id: "d4", text: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?", category: "depression" },
    { id: "d5", text: "How often have you felt bad about yourself or that you're a failure?", category: "depression" },
    
    // Anxiety questions  
    { id: "a1", text: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?", category: "anxiety" },
    { id: "a2", text: "How often have you not been able to stop or control worrying?", category: "anxiety" },
    { id: "a3", text: "How often have you worried too much about different things?", category: "anxiety" },
    { id: "a4", text: "How often have you had trouble relaxing?", category: "anxiety" },
    { id: "a5", text: "How often have you felt afraid that something awful might happen?", category: "anxiety" },
    
    // Stress questions
    { id: "s1", text: "How often have you felt overwhelmed by your responsibilities?", category: "stress" },
    { id: "s2", text: "How often have you felt unable to cope with all the things you have to do?", category: "stress" },
    { id: "s3", text: "How often have you felt irritated by things that are normally not bothersome?", category: "stress" },
    { id: "s4", text: "How often have you had difficulty concentrating?", category: "stress" },
    { id: "s5", text: "How often have you felt that stress has impacted your physical health?", category: "stress" }
  ];

  const answerOptions = [
    { value: 0, label: "Never", description: "Not at all" },
    { value: 1, label: "Rarely", description: "Several days" }, 
    { value: 2, label: "Sometimes", description: "More than half the days" },
    { value: 3, label: "Often", description: "Nearly every day" }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const depressionQuestions = questions.filter(q => q.category === "depression");
    const anxietyQuestions = questions.filter(q => q.category === "anxiety");
    const stressQuestions = questions.filter(q => q.category === "stress");

    const depressionScore = depressionQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const anxietyScore = anxietyQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const stressScore = stressQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);

    // Convert to percentage (max score per category is 15)
    const results: AssessmentResult = {
      depression: Math.round((depressionScore / 15) * 100),
      anxiety: Math.round((anxietyScore / 15) * 100),
      stress: Math.round((stressScore / 15) * 100)
    };

    setResults(results);
    setShowResults(true);
    
    toast({
      title: "Assessment Complete",
      description: "Your mental health assessment has been completed. Review your results below."
    });
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const getScoreLevel = (score: number) => {
    if (score <= 25) return { level: "Low", color: "bg-healing", icon: TrendingDown };
    if (score <= 50) return { level: "Mild", color: "bg-yellow-500", icon: Minus };
    if (score <= 75) return { level: "Moderate", color: "bg-orange-500", icon: TrendingUp };
    return { level: "Severe", color: "bg-destructive", icon: TrendingUp };
  };

  const getRecommendation = (category: string, score: number) => {
    const level = getScoreLevel(score).level;
    
    const recommendations = {
      depression: {
        Low: "Your depression levels appear to be low. Continue with healthy habits like regular exercise, good sleep, and social connections.",
        Mild: "You may be experiencing mild depression symptoms. Consider talking to friends, practicing mindfulness, or seeking professional guidance.",
        Moderate: "Your depression symptoms are at a moderate level. It's recommended to speak with a mental health professional for support.",
        Severe: "Your depression symptoms are severe. Please consider seeking immediate professional help and reaching out to your support network."
      },
      anxiety: {
        Low: "Your anxiety levels are low. Keep up with stress management techniques and maintain a balanced lifestyle.",
        Mild: "You may have mild anxiety. Try relaxation techniques, regular exercise, and consider mindfulness practices.",
        Moderate: "Your anxiety levels are moderate. Professional counseling could help you develop better coping strategies.",
        Severe: "Your anxiety is at a severe level. Please consider professional help and don't hesitate to reach out for immediate support if needed."
      },
      stress: {
        Low: "Your stress levels are manageable. Continue with your current stress management approach.",
        Mild: "You're experiencing mild stress. Focus on time management, regular breaks, and stress-reduction activities.",
        Moderate: "Your stress levels are moderate. Consider stress management techniques and possibly reducing some commitments.",
        Severe: "Your stress levels are high. It's important to address the sources of stress and seek professional guidance for coping strategies."
      }
    };

    return recommendations[category as keyof typeof recommendations][level as keyof typeof recommendations.depression];
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-calm p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-therapeutic border-0">
            <CardHeader className="bg-gradient-therapeutic text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Assessment Results</CardTitle>
                    <CardDescription className="text-white/80">
                      Your mental health assessment overview
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={resetAssessment}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {(["depression", "anxiety", "stress"] as const).map((category) => {
                  const score = results[category];
                  const { level, color, icon: Icon } = getScoreLevel(score);
                  
                  return (
                    <Card key={category} className="border-2 hover:shadow-gentle transition-gentle">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="capitalize text-lg">{category}</CardTitle>
                          <Badge className={`${color} text-white`}>
                            {level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">{score}%</span>
                          </div>
                          <Progress value={score} className="h-3" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getRecommendation(category, score)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-accent/20 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">Important Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    This assessment is for informational purposes only and is not a substitute for professional mental health diagnosis or treatment. 
                    If you're experiencing thoughts of self-harm or suicide, please contact a mental health crisis line immediately or visit your nearest emergency room.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm">
                      Find a Therapist
                    </Button>
                    <Button variant="outline" size="sm">
                      Crisis Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      Mental Health Tips
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-therapeutic border-0">
          <CardHeader className="bg-gradient-therapeutic text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl">Mental Health Assessment</CardTitle>
                <CardDescription className="text-white/80">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </CardDescription>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="bg-white/20" />
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 leading-relaxed">
                  {currentQuestion.text}
                </h3>
                
                <RadioGroup 
                  value={answers[currentQuestion.id]?.toString() || ""} 
                  onValueChange={handleAnswer}
                  className="space-y-4"
                >
                  {answerOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-gentle">
                      <RadioGroupItem value={option.value.toString()} id={option.value.toString()} />
                      <Label htmlFor={option.value.toString()} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={answers[currentQuestion.id] === undefined}
                  className="bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
                >
                  {currentQuestionIndex === questions.length - 1 ? "View Results" : "Next"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentalHealthAssessment;