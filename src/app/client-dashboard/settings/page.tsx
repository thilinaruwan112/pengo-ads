
import { SettingsForm } from "@/components/settings-form";

export default function ClientSettingsPage() {
  return (
    <div className="container mx-auto py-2">
        <div className="flex justify-between items-center mb-4">
            <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
                Manage your account settings and preferences.
            </p>
            </div>
        </div>
        <SettingsForm isClient={true} />
    </div>
  );
}
