import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Brain, 
  Zap,
  Calendar as CalendarIcon,
  TrendingUp,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: string;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  anxiety_level: number;
  notes: string;
  date: string;
  created_at: string;
}

const MoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMood, setCurrentMood] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [notes, setNotes] = useState("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const moodEmojis = [
    { score: 1, emoji: "😢", label: "Very Sad", color: "text-red-500" },
    { score: 2, emoji: "😞", label: "Sad", color: "text-orange-500" },
    { score: 3, emoji: "😐", label: "Neutral", color: "text-yellow-500" },
    { score: 4, emoji: "🙂", label: "Good", color: "text-green-400" },
    { score: 5, emoji: "😊", label: "Happy", color: "text-green-500" },
    { score: 6, emoji: "😄", label: "Very Happy", color: "text-emerald-500" },
    { score: 7, emoji: "🤗", label: "Joyful", color: "text-teal-500" },
    { score: 8, emoji: "😍", label: "Excited", color: "text-blue-500" },
    { score: 9, emoji: "🥰", label: "Blissful", color: "text-purple-500" },
    { score: 10, emoji: "🌟", label: "Euphoric", color: "text-pink-500" }
  ];

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;

    const { data, error } = await (supabase as any)
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching mood entries:', error);
    } else {
      setMoodEntries(data || []);
    }
  };

  const saveMoodEntry = async () => {
    if (!user) return;

    setLoading(true);
    const dateString = selectedDate.toISOString().split('T')[0];

    const moodEntry = {
      user_id: user.id,
      date: dateString,
      mood_score: currentMood,
      energy_level: energyLevel,
      stress_level: stressLevel,
      anxiety_level: anxietyLevel,
      notes: notes.trim()
    };

    // Check if entry exists for this date
    const { data: existingEntry } = await (supabase as any)
      .from('mood_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', dateString)
      .maybeSingle();

    let error;
    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await (supabase as any)
        .from('mood_entries')
        .update(moodEntry)
        .eq('id', existingEntry.id);
      error = updateError;
    } else {
      // Insert new entry
      const { error: insertError } = await (supabase as any)
        .from('mood_entries')
        .insert([moodEntry]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Mood Saved!",
        description: "Your mood entry has been recorded successfully."
      });
      fetchMoodEntries();
      // Reset form
      setNotes("");
    }

    setLoading(false);
  };

  const getSelectedDateEntry = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return moodEntries.find(entry => entry.date === dateString);
  };

  const selectedEntry = getSelectedDateEntry();

  // Load existing entry data when date changes
  useEffect(() => {
    if (selectedEntry) {
      setCurrentMood(selectedEntry.mood_score);
      setEnergyLevel(selectedEntry.energy_level);
      setStressLevel(selectedEntry.stress_level);
      setAnxietyLevel(selectedEntry.anxiety_level);
      setNotes(selectedEntry.notes || "");
    } else {
      // Reset to defaults for new entries
      setCurrentMood(5);
      setEnergyLevel(5);
      setStressLevel(3);
      setAnxietyLevel(3);
      setNotes("");
    }
  }, [selectedDate, selectedEntry]);

  const currentMoodData = moodEmojis.find(m => m.score === currentMood);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mood Entry Form */}
      <Card className="border-0 shadow-gentle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-healing" />
            <span>Daily Mood Check-in</span>
          </CardTitle>
          <CardDescription>
            Track your daily mood, energy, and stress levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Select Date</span>
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              disabled={(date) => date > new Date()}
            />
          </div>

          {selectedEntry && (
            <Badge variant="secondary" className="mb-4">
              Editing entry for {selectedDate.toLocaleDateString()}
            </Badge>
          )}

          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">How are you feeling today?</label>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => setCurrentMood(mood.score)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    currentMood === mood.score
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.score}</div>
                </button>
              ))}
            </div>
            {currentMoodData && (
              <div className="text-center">
                <span className={`text-lg font-medium ${currentMoodData.color}`}>
                  {currentMoodData.label}
                </span>
              </div>
            )}
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Energy Level: {energyLevel}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Stress Level: {stressLevel}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Very Stressed</span>
            </div>
          </div>

          {/* Anxiety Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Anxiety Level: {anxietyLevel}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={anxietyLevel}
              onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relaxed</span>
              <span>Very Anxious</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="How was your day? What affected your mood?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={saveMoodEntry}
            disabled={loading}
            className="w-full bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : selectedEntry ? "Update Entry" : "Save Entry"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="border-0 shadow-gentle">
        <CardHeader>
          <CardTitle>Recent Mood Entries</CardTitle>
          <CardDescription>
            Your mood tracking history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {moodEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No mood entries yet.</p>
                <p className="text-sm">Start tracking your daily mood!</p>
              </div>
            ) : (
              moodEntries.map((entry) => {
                const moodData = moodEmojis.find(m => m.score === entry.mood_score);
                return (
                  <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{moodData?.emoji}</span>
                        <div>
                          <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className={`text-sm ${moodData?.color}`}>{moodData?.label}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Energy: {entry.energy_level}/10</div>
                        <div>Stress: {entry.stress_level}/10</div>
                        <div>Anxiety: {entry.anxiety_level}/10</div>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;