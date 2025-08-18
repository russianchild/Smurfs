import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";

interface MoodEntry {
  id: string;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  anxiety_level: number;
  date: string;
}

interface AnalyticsData {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  anxiety: number;
  formattedDate: string;
}

const MoodAnalytics = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [user, timeRange]);

  const fetchMoodData = async () => {
    if (!user) return;

    setLoading(true);
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data, error } = await (supabase as any)
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching mood data:', error);
    } else {
      setMoodEntries(data || []);
      
      // Transform data for charts
      const chartData = (data || []).map(entry => ({
        date: entry.date,
        mood: entry.mood_score,
        energy: entry.energy_level,
        stress: entry.stress_level,
        anxiety: entry.anxiety_level,
        formattedDate: new Date(entry.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
      
      setAnalyticsData(chartData);
    }
    setLoading(false);
  };

  const calculateStats = () => {
    if (moodEntries.length === 0) return null;

    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length;
    const avgEnergy = moodEntries.reduce((sum, entry) => sum + entry.energy_level, 0) / moodEntries.length;
    const avgStress = moodEntries.reduce((sum, entry) => sum + entry.stress_level, 0) / moodEntries.length;
    const avgAnxiety = moodEntries.reduce((sum, entry) => sum + entry.anxiety_level, 0) / moodEntries.length;

    // Calculate trends (comparing first half vs second half)
    const midPoint = Math.floor(moodEntries.length / 2);
    const firstHalf = moodEntries.slice(0, midPoint);
    const secondHalf = moodEntries.slice(midPoint);

    const firstHalfMood = firstHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / firstHalf.length;
    const secondHalfMood = secondHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / secondHalf.length;
    const moodTrend = secondHalfMood - firstHalfMood;

    const firstHalfStress = firstHalf.reduce((sum, entry) => sum + entry.stress_level, 0) / firstHalf.length;
    const secondHalfStress = secondHalf.reduce((sum, entry) => sum + entry.stress_level, 0) / secondHalf.length;
    const stressTrend = secondHalfStress - firstHalfStress;

    return {
      avgMood: Math.round(avgMood * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgStress: Math.round(avgStress * 10) / 10,
      avgAnxiety: Math.round(avgAnxiety * 10) / 10,
      moodTrend,
      stressTrend,
      totalEntries: moodEntries.length
    };
  };

  const stats = calculateStats();

  // Data for mood distribution pie chart
  const moodDistribution = [
    { name: 'Great (8-10)', value: moodEntries.filter(e => e.mood_score >= 8).length, color: '#10B981' },
    { name: 'Good (6-7)', value: moodEntries.filter(e => e.mood_score >= 6 && e.mood_score < 8).length, color: '#3B82F6' },
    { name: 'Okay (4-5)', value: moodEntries.filter(e => e.mood_score >= 4 && e.mood_score < 6).length, color: '#F59E0B' },
    { name: 'Low (1-3)', value: moodEntries.filter(e => e.mood_score < 4).length, color: '#EF4444' }
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats || moodEntries.length === 0) {
    return (
      <Card className="border-0 shadow-gentle">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground text-center">
            Start tracking your mood daily to see analytics and insights here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Time Range:</span>
        <div className="flex space-x-1">
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' }
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Mood</p>
                <p className="text-2xl font-bold text-healing">{stats.avgMood}/10</p>
              </div>
              <div className={`p-2 rounded-full ${stats.moodTrend > 0 ? 'bg-green-100' : stats.moodTrend < 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                {stats.moodTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : stats.moodTrend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Activity className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Energy</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgEnergy}/10</p>
              </div>
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Stress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgStress}/10</p>
              </div>
              <div className={`p-2 rounded-full ${stats.stressTrend < 0 ? 'bg-green-100' : stats.stressTrend > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                {stats.stressTrend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : stats.stressTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <Activity className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Anxiety</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgAnxiety}/10</p>
              </div>
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends Line Chart */}
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Mood & Energy Trends</span>
            </CardTitle>
            <CardDescription>Track your mood and energy levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Mood"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Energy"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stress & Anxiety Area Chart */}
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Stress & Anxiety Levels</span>
            </CardTitle>
            <CardDescription>Monitor your stress and anxiety patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="stress" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  fillOpacity={0.6}
                  name="Stress"
                />
                <Area 
                  type="monotone" 
                  dataKey="anxiety" 
                  stackId="2"
                  stroke="#8B5CF6" 
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                  name="Anxiety"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution Pie Chart */}
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Mood Distribution</span>
            </CardTitle>
            <CardDescription>How often you experience different mood levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Pattern Bar Chart */}
        <Card className="border-0 shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Weekly Patterns</span>
            </CardTitle>
            <CardDescription>Average mood by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getWeeklyPattern()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="avgMood" fill="#10B981" name="Average Mood" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="border-0 shadow-gentle">
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>Based on your mood tracking data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generateInsights().map((insight, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                  <div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function getWeeklyPattern() {
    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      avgMood: 0,
      count: 0
    }));

    moodEntries.forEach(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      weeklyData[dayOfWeek].avgMood += entry.mood_score;
      weeklyData[dayOfWeek].count += 1;
    });

    return weeklyData.map(day => ({
      ...day,
      avgMood: day.count > 0 ? Math.round((day.avgMood / day.count) * 10) / 10 : 0
    }));
  }

  function generateInsights() {
    const insights = [];

    if (stats.moodTrend > 0.5) {
      insights.push({
        icon: TrendingUp,
        color: 'text-green-600',
        title: 'Mood Improving',
        description: 'Your mood has been trending upward recently. Keep up the great work!'
      });
    } else if (stats.moodTrend < -0.5) {
      insights.push({
        icon: TrendingDown,
        color: 'text-orange-600',
        title: 'Mood Declining',
        description: 'Your mood has been lower lately. Consider reaching out for support or trying stress-reduction techniques.'
      });
    }

    if (stats.avgStress > 7) {
      insights.push({
        icon: Activity,
        color: 'text-red-600',
        title: 'High Stress Levels',
        description: 'Your stress levels are quite high. Consider meditation, exercise, or talking to someone about what\'s causing stress.'
      });
    }

    if (stats.avgEnergy < 4) {
      insights.push({
        icon: Activity,
        color: 'text-blue-600',
        title: 'Low Energy',
        description: 'Your energy levels seem low. Make sure you\'re getting enough sleep, exercise, and proper nutrition.'
      });
    }

    if (stats.avgMood >= 7) {
      insights.push({
        icon: TrendingUp,
        color: 'text-green-600',
        title: 'Great Mental Health',
        description: 'You\'re maintaining excellent mental health! Continue with your current self-care practices.'
      });
    }

    return insights;
  }
};

export default MoodAnalytics;