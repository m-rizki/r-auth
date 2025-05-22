import apiWithCredentials from "~/api/axios";
import { Link, useNavigate } from "react-router";
import { serverUrl } from "utils/server-util";

export default function ProtectedPage() {
  const navigate = useNavigate();

  const handleMe = async () => {
    try {
      const response = await apiWithCredentials.get(serverUrl + "/me");
      const data = response.data;
      alert("Name: " + data.user?.name);
    } catch (error) {
      alert("Error fetching user data");
      console.error("Error fetching user data:", error);
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await apiWithCredentials.post(serverUrl + "/logout");
      const data = response.data;
      alert(data.message);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      navigate("/");
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await apiWithCredentials.post(
        serverUrl + "/refresh-token",
      );
      const data = response.data;
      alert(data.message);
    } catch (error) {
      alert("Error refreshing token");
      navigate("/");
    }
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

        <div className="mt-8 space-y-0 text-center">
          <Link to={"/"} className="btn btn-link px-0">
            Back to login page
          </Link>
          <p className="text-xs">(not work if you are logged in)</p>
        </div>
      </div>
    </div>
  );
}
