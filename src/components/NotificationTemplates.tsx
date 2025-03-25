
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { NotificationType, NotificationTemplate, getTemplates } from "@/services/notificationService";

const NotificationTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationType>("email");
  const [templates, setTemplates] = useState(() => getTemplates());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    name: "",
    type: "email",
    subject: "",
    body: "",
    variables: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  
  const filteredTemplates = templates.filter(template => template.type === activeTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as NotificationType);
  };

  const handlePreview = (template: NotificationTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setNewTemplate({
      ...template,
      variables: template.variables
    });
    setEditingTemplateId(template.id);
    setIsDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    toast.success("Template deleted successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const variables = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
    setNewTemplate(prev => ({
      ...prev,
      variables
    }));
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    const now = new Date();
    
    if (editingTemplateId) {
      // Update existing template
      const updatedTemplates = templates.map(template => 
        template.id === editingTemplateId 
          ? { 
              ...template, 
              ...newTemplate, 
              updatedAt: now 
            } as NotificationTemplate
          : template
      );
      setTemplates(updatedTemplates);
      toast.success("Template updated successfully");
    } else {
      // Create new template
      const id = String(Math.max(...templates.map(t => Number(t.id)), 0) + 1);
      const newTemplateWithId = {
        ...newTemplate,
        id,
        createdAt: now,
        updatedAt: now,
      } as NotificationTemplate;
      
      setTemplates([...templates, newTemplateWithId]);
      toast.success("Template created successfully");
    }
    
    // Reset form and close dialog
    setNewTemplate({
      name: "",
      type: activeTab,
      subject: "",
      body: "",
      variables: []
    });
    setEditingTemplateId(null);
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    setNewTemplate({
      name: "",
      type: activeTab,
      subject: activeTab === "email" ? "" : undefined,
      body: "",
      variables: []
    });
    setEditingTemplateId(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-light">Notification Templates</h1>
          <p className="text-muted-foreground">
            Create and manage templates for emails and SMS messages.
          </p>
        </div>
        <Button onClick={handleAddNew} className="button-animation">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Template
        </Button>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6 animate-slide-up">
          {filteredTemplates.length === 0 ? (
            <div className="text-center p-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No email templates found</p>
              <Button onClick={handleAddNew} variant="outline" className="button-animation">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden card-hover">
                <CardHeader className="bg-secondary/50 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Subject: {template.subject}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handlePreview(template)} className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditTemplate(template)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteTemplate(template.id)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.body.length > 100 
                      ? `${template.body.substring(0, 100)}...` 
                      : template.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sms" className="space-y-6 animate-slide-up">
          {filteredTemplates.length === 0 ? (
            <div className="text-center p-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No SMS templates found</p>
              <Button onClick={handleAddNew} variant="outline" className="button-animation">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden card-hover">
                <CardHeader className="bg-secondary/50 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle>{template.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handlePreview(template)} className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditTemplate(template)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteTemplate(template.id)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Template Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTemplateId ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplateId 
                ? "Update your notification template." 
                : "Create a new template for your notifications."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newTemplate.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            {activeTab === "email" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={newTemplate.subject || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Body
              </Label>
              <Textarea
                id="body"
                name="body"
                value={newTemplate.body || ""}
                onChange={handleInputChange}
                className="col-span-3 min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variables" className="text-right">
                Variables
              </Label>
              <div className="col-span-3">
                <Input
                  id="variables"
                  placeholder="name, amount, dueDate (comma separated)"
                  value={newTemplate.variables?.join(", ") || ""}
                  onChange={handleVariablesChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {{variableName}} in your template text.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Template</DialogTitle>
            <DialogDescription>
              {previewTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate?.type === "email" && (
            <div className="border rounded-md p-4 bg-card">
              <div className="mb-2 pb-2 border-b">
                <span className="font-semibold">Subject:</span> {previewTemplate.subject}
              </div>
              <div className="whitespace-pre-line">
                {previewTemplate.body}
              </div>
            </div>
          )}
          
          {previewTemplate?.type === "sms" && (
            <div className="border rounded-md p-4 bg-card max-w-sm mx-auto">
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-sm whitespace-pre-line">
                  {previewTemplate.body}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Variables:</h4>
            <div className="flex flex-wrap gap-2">
              {previewTemplate?.variables.map(variable => (
                <Badge key={variable} variant="secondary">
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationTemplates;
