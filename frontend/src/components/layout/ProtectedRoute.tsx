import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Gate for authenticated routes. Waits for the initial fetchMe() call
 * (kicked off in App.tsx) to resolve before deciding — otherwise a page
 * refresh on a protected route would flash-redirect to /login before the
 * cookie session check has a chance to complete.
 */
export default function ProtectedRoute() {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
