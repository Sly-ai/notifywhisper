
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationServiceSettings from "@/components/NotificationServiceSettings";
import NotificationTemplates from "@/components/NotificationTemplates";
import NotificationQueue from "@/components/NotificationQueue";
import { 
  ArrowLeft, 
  Settings, 
  FileText, 
  ListChecks
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("queue");

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
              <TabsTrigger value="queue" className="flex items-center gap-2 py-3">
                <ListChecks className="h-4 w-4" />
                <span>Notification Queue</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2 py-3">
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 py-3">
                <Settings className="h-4 w-4" />
                <span>Service Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="queue" className="animate-scale-in">
            <NotificationQueue />
          </TabsContent>
          
          <TabsContent value="templates" className="animate-scale-in">
            <NotificationTemplates />
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
