
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bell, Mail, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
        <h1 className="text-5xl sm:text-6xl font-extralight tracking-tight mb-6">
          Notification Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A complete solution for managing email and SMS communications throughout the loan collection process.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-slide-up">
        <Card className="glass-morphism overflow-hidden card-hover">
          <CardHeader className="pb-4">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Set up automated email notifications for payment reminders and updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Provide detailed information to borrowers through professional email templates with dynamic variables.
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full button-animation">
              <Link to="/notifications?tab=templates&type=email">
                Manage Email Templates
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-morphism overflow-hidden card-hover">
          <CardHeader className="pb-4">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>SMS Notifications</CardTitle>
            <CardDescription>
              Send time-sensitive alerts via SMS for immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure concise SMS messages for urgent reminders that reach customers instantly on their mobile devices.
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full button-animation">
              <Link to="/notifications?tab=templates&type=sms">
                Manage SMS Templates
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-morphism overflow-hidden card-hover">
          <CardHeader className="pb-4">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-primary icon-float" />
            </div>
            <CardTitle>Notification Queue</CardTitle>
            <CardDescription>
              Monitor and manage all outgoing communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View scheduled notifications, track delivery status, and manually trigger communications when needed.
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full button-animation">
              <Link to="/notifications">
                View Notification System
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-16 text-center text-muted-foreground text-sm max-w-2xl mx-auto animate-fade-in">
        <p>
          Our notification system seamlessly integrates with major email and SMS providers, 
          allowing you to communicate effectively with customers throughout the loan collection process.
        </p>
      </div>
    </div>
  );
};

export default Index;
