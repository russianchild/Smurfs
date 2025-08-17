import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AITherapistChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to provide you with a safe space to talk about your feelings and thoughts. How are you feeling today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const therapeuticResponses = [
    "I hear you, and I want you to know that your feelings are completely valid. Can you tell me more about what's been weighing on your mind?",
    "Thank you for sharing that with me. It takes courage to open up about difficult feelings. How has this been affecting your daily life?",
    "What you're experiencing sounds really challenging. Remember that seeking support is a sign of strength. What coping strategies have you tried before?",
    "I'm here to listen without judgment. Your mental health matters, and it's okay to take things one day at a time. What would help you feel more supported right now?",
    "It sounds like you're going through a lot. Sometimes just talking about our feelings can help us process them better. What emotions have been most present for you lately?",
    "I appreciate you trusting me with your thoughts. Everyone's journey is different, and there's no pressure to have everything figured out. What small step could we focus on today?",
    "Your willingness to seek help shows real self-awareness. Mental health is just as important as physical health. What activities or thoughts usually bring you some peace?",
    "Thank you for being so open with me. Remember that healing isn't linear, and it's okay to have difficult days. What support systems do you have in your life?",
    "I can sense that you're working hard to understand your feelings. That's really commendable. What would you like to explore more deeply in our conversation?",
    "Your experiences matter, and I'm grateful you're sharing them with me. Sometimes progress comes in small steps. What's one thing you're looking forward to, even if it's small?"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    // Simple keyword-based responses for demo purposes
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      return "I'm sorry you're feeling sad. It's completely natural to have these feelings, and I'm here to support you through this. What has been contributing to these feelings of sadness?";
    }
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("anxiety")) {
      return "Anxiety can feel overwhelming, but you're taking a positive step by talking about it. What situations or thoughts tend to trigger your anxiety the most?";
    }
    
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed")) {
      return "Stress can really impact our well-being. It's important to acknowledge when we're feeling overwhelmed. What are the main sources of stress in your life right now?";
    }
    
    if (lowerMessage.includes("better") || lowerMessage.includes("good") || lowerMessage.includes("happy")) {
      return "I'm so glad to hear you're feeling better! It's wonderful when we have those positive moments. What do you think has been helping you feel this way?";
    }
    
    // Default to a random therapeutic response
    return therapeuticResponses[Math.floor(Math.random() * therapeuticResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-therapeutic border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-therapeutic text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Therapist</CardTitle>
                <p className="text-white/80 text-sm">Your compassionate mental health companion</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user"
                            ? "bg-primary"
                            : "bg-accent"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Heart className="w-4 h-4 text-accent-foreground" />
                        )}
                      </div>
                      
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="bg-muted px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t bg-card/50">
              <div className="flex space-x-3">
                <Input
                  placeholder="Share what's on your mind... This is a safe space."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-border/50 focus:border-primary transition-gentle"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Remember: This is an AI companion for support, not a replacement for professional therapy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITherapistChat;