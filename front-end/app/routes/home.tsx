import { Link } from "react-router";
import type { Route } from "./+types/home";
import { AlertCircle, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { serverUrl } from "utils/server-util";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type FormDataType = {
  username: string;
  password: string;
};

export default function Home() {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitHandler = async (data: FormDataType) => {
    const payload = {
      username: data.username,
      password: data.password,
    };

    const url = serverUrl + "/login";
    const response = await axios.post(url, payload, { withCredentials: true });
    console.log(response.data);

    reset({ username: "", password: "" });
    console.log(payload);
  };

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
            <form onSubmit={handleSubmit(submitHandler)}>
              <fieldset className="fieldset gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    className={`label ${errors.username ? "text-error" : ""}`}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className={`input w-full ${errors.username ? "border-error" : ""}`}
                    placeholder="Username"
                    {...register("username", {
                      required: "username is required",
                    })}
                  />
                  {errors.username && (
                    <p className="text-error text-xs">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className={`label ${errors.password ? "text-error" : ""}`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className={`input w-full ${errors.password ? "border-error" : ""}`}
                    placeholder="Password"
                    {...register("password", {
                      required: "password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-error text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-accent btn-outline btn-sm mt-4"
                >
                  Login
                </button>
              </fieldset>
            </form>

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
