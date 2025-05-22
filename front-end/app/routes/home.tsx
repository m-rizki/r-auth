import { Link, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { serverUrl } from "utils/server-util";
import apiWithCredentials from "~/api/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth Example" },
    { name: "description", content: "Welcome to Auth Example!" },
  ];
}

type FormDataType = {
  username: string;
  password: string;
  accessTokenMaxAge: string;
};

export async function clientLoader() {
  try {
    await apiWithCredentials.get(serverUrl + "/me");
    return redirect("/protected");
  } catch (error) {
    console.error("Error fetching user data:", error);
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

export default function Home() {
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      username: "",
      password: "",
      accessTokenMaxAge: "15",
    },
  });

  const submitHandler = async (data: FormDataType) => {
    const payload = {
      username: data.username,
      password: data.password,
      accessTokenMaxAge: parseInt(data.accessTokenMaxAge),
    };

    try {
      const url = serverUrl + "/login";
      await apiWithCredentials.post(url, payload);
      reset({ username: "", password: "", accessTokenMaxAge: "15" });
      navigate("/protected");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;
        if (status === 401) {
          alert("Invalid username or password");
        } else if (status === 400) {
          alert("Bad request: " + data);
        } else {
          alert("An error occurred: " + data);
        }
      }
    }
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
                    placeholder="username"
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
                    placeholder="password"
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

                <div className="flex flex-col gap-1">
                  <label
                    className={`label ${errors.accessTokenMaxAge ? "text-error" : ""}`}
                  >
                    Access token duration (minutes)
                  </label>

                  <input
                    type="number"
                    className={`input w-full ${errors.accessTokenMaxAge ? "border-error" : ""}`}
                    placeholder="access token duration"
                    {...register("accessTokenMaxAge", {
                      required: "Access token duration (minutes) is required",
                      min: {
                        value: 1,
                        message: "Minimum value is 1 minute",
                      },
                      max: {
                        value: 60,
                        message: "Maximum value is 60 minutes",
                      },
                    })}
                  />

                  {errors.accessTokenMaxAge && (
                    <p className="text-error text-xs">
                      {errors.accessTokenMaxAge.message}
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
