import { getSiteSettingsAdmin } from "@/actions/site-settings";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin();
  return <SettingsManager settings={settings} />;
}
