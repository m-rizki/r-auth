import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  ...prefix("protected", [
    layout("./components/layouts/protected-route.tsx", [
      index("./routes/protected-page.tsx"),
    ]),
  ]),

  // issue (temporary solution) : https://github.com/remix-run/react-router/issues/13516
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "./routes/temporary/issue1.tsx",
  ),
] satisfies RouteConfig;
