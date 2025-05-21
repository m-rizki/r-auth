import axios from "axios";
import { serverUrl } from "utils/server-util";

export default function ProtectedPage() {
  const handleMe = () => {
    const response = axios.get(serverUrl + "/me", { withCredentials: true });
    console.log(response);
  };

  const handleLogout = () => {
    const response = axios.post(serverUrl + "/logout", null, {
      withCredentials: true,
    });
    console.log(response);
  };

  const handleRefreshToken = () => {
    const response = axios.post(serverUrl + "/refresh-token", null, {
      withCredentials: true,
    });
    console.log(response);
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <p className="text-2xl font-semibold">Protected Page</p>
        <div className="mt-8 flex flex-row gap-10">
          <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={handleMe}
          >
            me
          </button>
          <button
            className="btn btn-outline btn-accent btn-sm"
            onClick={handleRefreshToken}
          >
            refresh-token
          </button>
          <button
            className="btn btn-outline btn-error btn-sm"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
