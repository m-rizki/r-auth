import { Link } from "react-router";
import type { Route } from "./+types/home";
import { AlertCircle, KeyRound } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center gap-4 lg:justify-start">
            <KeyRound size={32} />
            <h1 className="text-4xl font-bold">Auth Example</h1>
          </div>
          <div className="min-w-sm py-6">
            <p>list credentials (username: password)</p>
            <ul>
              <li>user1 : password1</li>
              <li>user2 : password2</li>
            </ul>
            <div className="mt-4">
              <Link to={"/protected"} className="btn btn-link px-0">
                Go to protected route
              </Link>
            </div>

            {/* <div
              role="alert"
              className="alert alert-outline alert-info mt-4 py-2"
            >
              <AlertCircle size={20} />
              <span>New software update available.</span>
            </div> */}
          </div>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">Username</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Username"
              />
              <label className="label">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Password"
              />
              <button
                type="button"
                className="btn btn-accent btn-outline btn-sm mt-4"
              >
                Login
              </button>
              {/* <button
                type="button"
                className="btn btn-error btn-outline btn-sm mt-4"
              >
                Logout
              </button> */}
            </fieldset>
            <p className="text-base-content/60 mt-4 text-center text-xs">
              <a className="link link-hover" href="/web_client_licenses.txt">
                GNU General Public License v3.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
