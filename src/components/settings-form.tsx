
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  notifications: z.object({
    performanceReports: z.boolean().default(false),
    securityAlerts: z.boolean().default(true),
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  isClient?: boolean;
}

export function SettingsForm({ isClient = false }: SettingsFormProps) {
  const { toast } = useToast();

  const defaultValues: Partial<SettingsFormValues> = {
    name: isClient ? "Alice Johnson" : "Admin User",
    email: isClient ? "alice@example.com" : "admin@advision.com",
    notifications: {
      performanceReports: true,
      securityAlerts: true,
    },
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    console.log("Settings updated:", data);
    toast({
      title: "Settings Saved",
      description: "Your new settings have been successfully saved.",
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormDescription>
                        We will use this email for all communication.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Separator />
                <div>
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure how you receive notifications.
                    </p>
                </div>
                <FormField
                    control={form.control}
                    name="notifications.performanceReports"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                            Weekly Performance Reports
                            </FormLabel>
                            <FormDescription>
                            Receive a summary of your campaign performance every week.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notifications.securityAlerts"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                            Security Alerts
                            </FormLabel>
                            <FormDescription>
                            Receive emails about any unusual activity in your account.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit">Update settings</Button>
            </form>
            </Form>
        </CardContent>
    </Card>

  );
}
