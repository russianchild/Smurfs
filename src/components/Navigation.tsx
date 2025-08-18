import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  Menu, 
  X, 
  LayoutDashboard,
  Map,
  LogOut
} from "lucide-react";
import Logo from "./Logo";
import { User } from "@supabase/supabase-js";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

const Navigation = ({ activeTab, onTabChange, user }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chat", label: "AI Therapist", icon: MessageCircle },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "journey", label: "Journey", icon: Map },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <h1 className="text-xl font-bold bg-gradient-therapeutic bg-clip-text text-transparent">
              heAl
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className="flex items-center space-x-2 transition-smooth hover:shadow-gentle"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-therapeutic text-white text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">
                {user.email}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="hidden md:flex items-center space-x-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {/* Mobile User Info & Sign Out */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-2 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-therapeutic text-white text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start space-x-2 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;