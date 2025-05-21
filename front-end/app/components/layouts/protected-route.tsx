import api from "../../api/axios";
import { data, Outlet } from "react-router";
import { serverUrl } from "utils/server-util";

export async function clientLoader() {
  try {
    await api.get(serverUrl + "/me");
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw data("Unauthorized", { status: 401 });
  }
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute() {
  return <Outlet />;
}
