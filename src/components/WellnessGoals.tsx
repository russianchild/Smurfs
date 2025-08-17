import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar,
  Trophy,
  Star,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

const WellnessGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mental-health',
    target_value: 1,
    unit: 'days',
    deadline: ''
  });

  const categories = [
    { id: 'mental-health', name: 'Mental Health', color: 'bg-healing' },
    { id: 'physical-health', name: 'Physical Health', color: 'bg-blue-500' },
    { id: 'social', name: 'Social Connection', color: 'bg-purple-500' },
    { id: 'mindfulness', name: 'Mindfulness', color: 'bg-green-500' },
    { id: 'habits', name: 'Healthy Habits', color: 'bg-orange-500' },
    { id: 'learning', name: 'Learning & Growth', color: 'bg-pink-500' }
  ];

  const units = ['days', 'times', 'hours', 'minutes', 'sessions', 'books', 'activities'];

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('wellness_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      setGoals(data || []);
    }
  };

  const createGoal = async () => {
    if (!user || !formData.title.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('wellness_goals')
      .insert([{
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        target_value: formData.target_value,
        current_value: 0,
        unit: formData.unit,
        deadline: formData.deadline || null,
        status: 'active'
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Goal Created!",
        description: "Your wellness goal has been created successfully."
      });
      setFormData({
        title: '',
        description: '',
        category: 'mental-health',
        target_value: 1,
        unit: 'days',
        deadline: ''
      });
      setShowCreateForm(false);
      fetchGoals();
    }
    setLoading(false);
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedValue = Math.max(0, Math.min(newValue, goal.target_value));
    const newStatus = updatedValue >= goal.target_value ? 'completed' : 'active';

    const { error } = await supabase
      .from('wellness_goals')
      .update({ 
        current_value: updatedValue,
        status: newStatus
      })
      .eq('id', goalId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update goal progress.",
        variant: "destructive"
      });
    } else {
      if (newStatus === 'completed' && goal.status !== 'completed') {
        toast({
          title: "🎉 Goal Completed!",
          description: `Congratulations on completing "${goal.title}"!`
        });
      }
      fetchGoals();
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('wellness_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Goal Deleted",
        description: "Your goal has been removed."
      });
      fetchGoals();
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedGoals = goals.filter(g => g.status === 'completed');
  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-healing/10 rounded-lg">
                <Target className="h-6 w-6 text-healing" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wellness Goals</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Create Goal Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Goal</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  placeholder="e.g., Meditate daily for 30 days"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="1"
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value) || 1 })}
                    className="flex-1"
                  />
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="p-2 border border-input rounded-md bg-background"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Describe your goal and why it's important to you..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={createGoal}
                disabled={loading || !formData.title.trim()}
                className="bg-gradient-therapeutic"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Goal"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card className="border-0 shadow-gentle">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Set your first wellness goal to start tracking your progress!
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-therapeutic"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const categoryInfo = getCategoryInfo(goal.category);
            const progress = getProgressPercentage(goal.current_value, goal.target_value);
            const daysUntilDeadline = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;

            return (
              <Card key={goal.id} className="border-0 shadow-gentle">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={`${categoryInfo.color} text-white`}>
                          {categoryInfo.name}
                        </Badge>
                        {goal.status === 'completed' && (
                          <Badge className="bg-green-500 text-white">
                            <Trophy className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {daysUntilDeadline !== null && (
                          <Badge variant={daysUntilDeadline < 7 ? "destructive" : "secondary"}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGoal(editingGoal === goal.id ? null : goal.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress: {goal.current_value} / {goal.target_value} {goal.unit}</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />

                    {goal.status !== 'completed' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateGoalProgress(goal.id, goal.current_value - 1)}
                          disabled={goal.current_value <= 0}
                        >
                          -1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateGoalProgress(goal.id, goal.current_value + 1)}
                          disabled={goal.current_value >= goal.target_value}
                        >
                          +1
                        </Button>
                        {goal.current_value < goal.target_value && (
                          <Button
                            size="sm"
                            onClick={() => updateGoalProgress(goal.id, goal.target_value)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WellnessGoals;