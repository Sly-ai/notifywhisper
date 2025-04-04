
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationServiceSettings from "@/components/NotificationServiceSettings";
import NotificationComposer from "@/components/NotificationComposer";
import NotificationHistory from "@/components/notification/NotificationHistory";
import { 
  ArrowLeft, 
  Settings, 
  MessageSquare,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("composer");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-10">
      <div className="container mx-auto pt-8 px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="p-2">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-4xl font-extralight tracking-tight">
              Notification System
            </h1>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="composer" className="flex items-center gap-2 py-3">
                <MessageSquare className="h-4 w-4" />
                <span>Compose</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 py-3">
                <History className="h-4 w-4" />
                <span>Sent</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 py-3">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="composer" className="animate-scale-in">
            <NotificationComposer />
          </TabsContent>
          
          <TabsContent value="history" className="animate-scale-in">
            <NotificationHistory />
          </TabsContent>
          
          <TabsContent value="settings" className="animate-scale-in">
            <NotificationServiceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
