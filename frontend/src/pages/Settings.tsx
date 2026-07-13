import AppearanceSection from "@/components/settings/AppearanceSection";
import TargetsSection from "@/components/settings/TargetsSection";
import ProfileSection from "@/components/settings/ProfileSection";
import DataSection from "@/components/settings/DataSection";

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>

      <div className="mt-6 max-w-2xl space-y-4">
        <AppearanceSection />
        <TargetsSection />
        <ProfileSection />
        <DataSection />
      </div>
    </div>
  );
}
