import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Mic } from "lucide-react";

const AITherapistChat = () => {
  useEffect(() => {
    // Initialize ElevenLabs widget after component mounts
    const initializeWidget = () => {
      if (window.ElevenLabsWidget) {
        // Widget is already loaded
        return;
      }
      
      // Wait for the script to load
      const checkWidget = setInterval(() => {
        if (window.ElevenLabsWidget) {
          clearInterval(checkWidget);
        }
      }, 100);
    };

    initializeWidget();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-therapeutic border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-therapeutic text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Voice Therapist</CardTitle>
                <p className="text-white/80 text-sm">Your compassionate voice-enabled mental health companion</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-therapeutic rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Voice Session</h3>
              <p className="text-muted-foreground mb-6">
                Experience natural conversation with our AI therapist. Simply speak your thoughts and feelings, 
                and receive compassionate, personalized support through voice interaction.
              </p>
            </div>

            {/* ElevenLabs Voice Agent Embedding */}
            <div className="flex justify-center">
              <elevenlabs-convai agent-id="agent_3901k2ygh2h3em1t6bx4jxk7hv0m"></elevenlabs-convai>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Privacy Notice:</strong> Your voice conversations are processed securely. 
                This AI companion provides support but is not a replacement for professional therapy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITherapistChat;