import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile, useChangePassword } from "@/hooks/useSettings";

export default function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileDirty = name !== user?.name || email !== user?.email;

  const saveProfile = async () => {
    setProfileMessage("");
    setProfileError("");
    try {
      const updated = await updateProfile.mutateAsync({ name, email });
      setUser(updated);
      setProfileMessage("Profile updated");
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Couldn't update profile");
    }
  };

  const savePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password changed");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Couldn't change password");
    }
  };

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-ink">Profile</h2>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
        </div>

        {profileError && <p className="text-xs text-danger">{profileError}</p>}
        {profileMessage && <p className="text-xs text-success">{profileMessage}</p>}

        {profileDirty && (
          <button
            onClick={saveProfile}
            disabled={updateProfile.isPending}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving..." : "Save profile"}
          </button>
        )}
      </div>

      <div className="mt-5 border-t border-base-border pt-4">
        <p className="mb-3 text-xs font-medium text-ink-muted">Change password</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        {passwordError && <p className="mt-2 text-xs text-danger">{passwordError}</p>}
        {passwordMessage && <p className="mt-2 text-xs text-success">{passwordMessage}</p>}

        {currentPassword && newPassword && (
          <button
            onClick={savePassword}
            disabled={changePassword.isPending}
            className="mt-3 rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {changePassword.isPending ? "Updating..." : "Update password"}
          </button>
        )}
      </div>
    </div>
  );
}
