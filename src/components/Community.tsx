import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageCircle, Heart, Plus, Send, Clock, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  likes: number;
  replies: number;
  isLiked: boolean;
}

interface ForumReply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

const Community = () => {
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [replyContent, setReplyContent] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();

  // Sample community posts
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      author: "Sarah M.",
      title: "Finding strength in small victories",
      content: "I wanted to share that today I managed to get out of bed before noon for the first time in weeks. It might seem small, but it feels huge to me. Sometimes we need to celebrate the little things.",
      category: "depression",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      replies: 8,
      isLiked: false
    },
    {
      id: "2", 
      author: "Alex K.",
      title: "Breathing exercises that actually help",
      content: "I've been struggling with panic attacks and found this 4-7-8 breathing technique really helpful. Inhale for 4, hold for 7, exhale for 8. Just wanted to share in case it helps someone else.",
      category: "anxiety",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 24,
      replies: 15,
      isLiked: true
    },
    {
      id: "3",
      author: "Maya L.",
      title: "Work stress is overwhelming me",
      content: "I'm struggling to balance everything at work and it's affecting my sleep and relationships. How do you all manage work-related stress? Any tips would be appreciated.",
      category: "stress",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 7,
      replies: 12,
      isLiked: false
    },
    {
      id: "4",
      author: "Jordan P.",
      title: "Gratitude practice changed my perspective",
      content: "I started writing down 3 things I'm grateful for each day. It seemed silly at first, but after a month, I notice I'm more aware of positive moments throughout my day.",
      category: "general",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 31,
      replies: 6,
      isLiked: false
    }
  ]);

  // Sample replies for demonstration
  const sampleReplies: ForumReply[] = [
    {
      id: "r1",
      author: "Chris T.",
      content: "Thank you for sharing this! You're absolutely right that small victories matter. I'm proud of you for taking that step.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 5,
      isLiked: false
    },
    {
      id: "r2",
      author: "Sam R.",
      content: "I relate to this so much. Some days just getting dressed feels like an accomplishment, and that's okay. We're all on our own journey.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 3,
      isLiked: true
    }
  ];

  const categories = [
    { id: "general", name: "General Support", color: "bg-primary" },
    { id: "depression", name: "Depression", color: "bg-blue-500" },
    { id: "anxiety", name: "Anxiety", color: "bg-green-500" },
    { id: "stress", name: "Stress", color: "bg-orange-500" },
    { id: "success", name: "Success Stories", color: "bg-healing" }
  ];

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content for your post.",
        variant: "destructive"
      });
      return;
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: "You",
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      isLiked: false
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setActiveTab("posts");
    
    toast({
      title: "Post Created",
      description: "Your post has been shared with the community."
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-calm p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setSelectedPost(null)}>
              ← Back to Posts
            </Button>
          </div>
          
          <Card className="shadow-therapeutic border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{selectedPost.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPost.author}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(selectedPost.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getCategoryInfo(selectedPost.category).color} text-white`}>
                    {getCategoryInfo(selectedPost.category).name}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikePost(selectedPost.id)}
                  className={selectedPost.isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 mr-1 ${selectedPost.isLiked ? "fill-current" : ""}`} />
                  {selectedPost.likes}
                </Button>
              </div>
              <CardTitle className="text-xl">{selectedPost.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {selectedPost.content}
              </p>
              
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Replies ({sampleReplies.length})
                </h3>
                
                <div className="space-y-4 mb-6">
                  {sampleReplies.map((reply) => (
                    <div key={reply.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{reply.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(reply.timestamp)}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {reply.likes}
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts or support..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    className="bg-gradient-therapeutic shadow-gentle hover:shadow-therapeutic transition-gentle"
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="shadow-therapeutic border-0">
          <CardHeader className="bg-gradient-community text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl">Community Support</CardTitle>
                <CardDescription className="text-white/80">
                  Connect, share, and support each other on your mental health journey
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Community Posts</TabsTrigger>
                <TabsTrigger value="create">Create Post</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="mt-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {posts.map((post) => {
                      const categoryInfo = getCategoryInfo(post.category);
                      return (
                        <Card 
                          key={post.id} 
                          className="hover:shadow-gentle transition-gentle cursor-pointer border-border/50"
                          onClick={() => setSelectedPost(post)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{post.author}</p>
                                    <p className="text-sm text-muted-foreground flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {formatTimeAgo(post.timestamp)}
                                    </p>
                                  </div>
                                </div>
                                <Badge className={`${categoryInfo.color} text-white`}>
                                  {categoryInfo.name}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikePost(post.id);
                                }}
                                className={post.isLiked ? "text-red-500" : ""}
                              >
                                <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                                {post.likes}
                              </Button>
                            </div>
                            <CardTitle className="text-lg hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                              {post.content}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {post.replies} replies
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="create" className="mt-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Share with the Community
                    </CardTitle>
                    <CardDescription>
                      Your post will be visible to all community members. Please be respectful and supportive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select 
                        value={newPostCategory} 
                        onChange={(e) => setNewPostCategory(e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-background"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="What would you like to share?"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        placeholder="Share your thoughts, experiences, or ask for support..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleCreatePost}
                      className="w-full bg-gradient-community shadow-gentle hover:shadow-therapeutic transition-gentle"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Share Post
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;