import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Save, 
  TrendingUp, 
  Heart,
  Zap,
  Brain,
  Shield
} from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MoodEntry {
  id: string;
  date: string;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  anxiety_level: number;
  notes: string | null;
}

const DailyJournal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodScore, setMoodScore] = useState([7]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [anxietyLevel, setAnxietyLevel] = useState([3]);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  useEffect(() => {
    loadEntryForDate(selectedDate);
  }, [selectedDate, entries]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntryForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateString);
    
    if (entry) {
      setCurrentEntry(entry);
      setMoodScore([entry.mood_score]);
      setEnergyLevel([entry.energy_level]);
      setStressLevel([entry.stress_level]);
      setAnxietyLevel([entry.anxiety_level]);
      setNotes(entry.notes || "");
    } else {
      setCurrentEntry(null);
      setMoodScore([7]);
      setEnergyLevel([7]);
      setStressLevel([3]);
      setAnxietyLevel([3]);
      setNotes("");
    }
  };

  const saveEntry = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const entryData = {
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        mood_score: moodScore[0],
        energy_level: energyLevel[0],
        stress_level: stressLevel[0],
        anxiety_level: anxietyLevel[0],
        notes: notes.trim() || null
      };

      const { error } = await supabase
        .from('mood_entries')
        .upsert(entryData, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Entry Saved",
        description: `Your journal entry for ${format(selectedDate, 'MMM dd, yyyy')} has been saved.`
      });

      // Reload entries to update the list
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return "bg-red-500";
    if (score <= 5) return "bg-orange-500";
    if (score <= 7) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getMoodLabel = (score: number) => {
    if (score <= 2) return "Very Low";
    if (score <= 4) return "Low";
    if (score <= 6) return "Moderate";
    if (score <= 8) return "Good";
    return "Excellent";
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Journal Entry */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-therapeutic border-0">
              <CardHeader className="bg-gradient-therapeutic text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-2xl">Daily Journal</CardTitle>
                      <CardDescription className="text-white/80">
                        Track your daily mood and wellbeing
                      </CardDescription>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(selectedDate, 'MMM dd, yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Mood Tracking Sliders */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <Label className="text-lg font-semibold">Mood</Label>
                      <Badge className={`${getMoodColor(moodScore[0])} text-white`}>
                        {getMoodLabel(moodScore[0])}
                      </Badge>
                    </div>
                    <Slider
                      value={moodScore}
                      onValueChange={setMoodScore}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Very Low</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <Label className="text-lg font-semibold">Energy Level</Label>
                      <Badge variant="outline">{energyLevel[0]}/10</Badge>
                    </div>
                    <Slider
                      value={energyLevel}
                      onValueChange={setEnergyLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Exhausted</span>
                      <span>Energized</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-red-500" />
                      <Label className="text-lg font-semibold">Stress Level</Label>
                      <Badge variant="outline">{stressLevel[0]}/10</Badge>
                    </div>
                    <Slider
                      value={stressLevel}
                      onValueChange={setStressLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Very Calm</span>
                      <span>Very Stressed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <Label className="text-lg font-semibold">Anxiety Level</Label>
                      <Badge variant="outline">{anxietyLevel[0]}/10</Badge>
                    </div>
                    <Slider
                      value={anxietyLevel}
                      onValueChange={setAnxietyLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Very Calm</span>
                      <span>Very Anxious</span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Daily Reflection</Label>
                  <Textarea
                    placeholder="How was your day? What are you grateful for? Any thoughts or feelings you'd like to record... Take a moment to reflect on your experiences, emotions, and what brought you joy today."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={saveEntry}
                    disabled={isSaving}
                    className="bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-therapeutic border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Entries</span>
                </CardTitle>
                <CardDescription>
                  Your journal history
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {isLoading ? (
                    <div className="p-6 text-center text-muted-foreground">
                      Loading entries...
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No entries yet. Start journaling today!
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {entries.map((entry) => (
                        <Card 
                          key={entry.id}
                          className={`cursor-pointer transition-gentle hover:shadow-gentle ${
                            entry.date === format(selectedDate, 'yyyy-MM-dd') 
                              ? 'ring-2 ring-primary' 
                              : ''
                          }`}
                          onClick={() => setSelectedDate(parseISO(entry.date))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {format(parseISO(entry.date), 'MMM dd, yyyy')}
                              </span>
                              {isToday(parseISO(entry.date)) && (
                                <Badge variant="secondary">Today</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3 text-pink-500" />
                                <span>{entry.mood_score}/10</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span>{entry.energy_level}/10</span>
                              </div>
                            </div>
                            {entry.notes && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {entry.notes}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;