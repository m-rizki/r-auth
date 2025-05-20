import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // issue (temporary solution) : https://github.com/remix-run/react-router/issues/13516
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "./routes/temporary/issue1.tsx",
  ),
] satisfies RouteConfig;
