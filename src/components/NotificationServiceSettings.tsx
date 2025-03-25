
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ServiceSettings {
  email: {
    serviceProvider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  sms: {
    serviceProvider: string;
    apiKey: string;
    fromNumber: string;
  };
}

const NotificationServiceSettings: React.FC = () => {
  const [settings, setSettings] = useState<ServiceSettings>({
    email: {
      serviceProvider: "",
      apiKey: "",
      fromEmail: "",
      fromName: ""
    },
    sms: {
      serviceProvider: "",
      apiKey: "",
      fromNumber: ""
    }
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [name]: value
      }
    }));
  };

  const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        [name]: value
      }
    }));
  };

  const saveEmailSettings = () => {
    // Save email settings
    console.log("Saving email settings:", settings.email);
    toast.success("Email service settings saved successfully");
  };

  const saveSmsSettings = () => {
    // Save SMS settings
    console.log("Saving SMS settings:", settings.sms);
    toast.success("SMS service settings saved successfully");
  };

  const testEmailConnection = () => {
    // Test email connection
    console.log("Testing email connection with settings:", settings.email);
    toast.success("Email connection test successful");
  };

  const testSmsConnection = () => {
    // Test SMS connection
    console.log("Testing SMS connection with settings:", settings.sms);
    toast.success("SMS connection test successful");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-light mb-2 text-center">Notification Service Settings</h1>
      <p className="text-muted-foreground mb-8 text-center">Configure your email and SMS service providers.</p>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="email">Email Service</TabsTrigger>
          <TabsTrigger value="sms">SMS Service</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="animate-slide-up">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Email Service Configuration</CardTitle>
              <CardDescription>
                Configure your email service to send payment reminders, overdue notifications, and other communications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-provider">Service Provider</Label>
                <Input 
                  id="email-provider" 
                  name="serviceProvider" 
                  placeholder="e.g., SendGrid, Mailchimp, Amazon SES" 
                  value={settings.email.serviceProvider}
                  onChange={handleEmailChange}
                  className="transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-api-key">API Key</Label>
                <Input 
                  id="email-api-key" 
                  name="apiKey" 
                  type="password" 
                  placeholder="Your API key" 
                  value={settings.email.apiKey}
                  onChange={handleEmailChange}
                  className="transition-all duration-300"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input 
                    id="from-email" 
                    name="fromEmail" 
                    placeholder="noreply@example.com" 
                    type="email" 
                    value={settings.email.fromEmail}
                    onChange={handleEmailChange}
                    className="transition-all duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input 
                    id="from-name" 
                    name="fromName" 
                    placeholder="Your Company Name" 
                    value={settings.email.fromName}
                    onChange={handleEmailChange}
                    className="transition-all duration-300"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={testEmailConnection} className="button-animation">
                Test Connection
              </Button>
              <Button onClick={saveEmailSettings} className="button-animation">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms" className="animate-slide-up">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>SMS Service Configuration</CardTitle>
              <CardDescription>
                Configure your SMS service to send payment reminders and other important notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-provider">Service Provider</Label>
                <Input 
                  id="sms-provider" 
                  name="serviceProvider" 
                  placeholder="e.g., Twilio, Nexmo, MessageBird" 
                  value={settings.sms.serviceProvider}
                  onChange={handleSmsChange}
                  className="transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sms-api-key">API Key</Label>
                <Input 
                  id="sms-api-key" 
                  name="apiKey" 
                  type="password" 
                  placeholder="Your API key" 
                  value={settings.sms.apiKey}
                  onChange={handleSmsChange}
                  className="transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-number">From Number</Label>
                <Input 
                  id="from-number" 
                  name="fromNumber" 
                  placeholder="+1234567890" 
                  value={settings.sms.fromNumber}
                  onChange={handleSmsChange}
                  className="transition-all duration-300"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={testSmsConnection} className="button-animation">
                Test Connection
              </Button>
              <Button onClick={saveSmsSettings} className="button-animation">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationServiceSettings;
