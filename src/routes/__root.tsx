import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import appCss from "~/lib/styles/app.css?url";
import { TRPCRouter } from "~/trpc/init/router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}>()({
  ssr: false,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "React TanStarter",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const isDev = import.meta.env.DEV;
const isErudaEnabled = import.meta.env.VITE_ERUDA_ENABLED === "true";

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  useEffect(() => {
    if (isDev && isErudaEnabled) {
      import("eruda").then((eruda) => {
        eruda.default.init();
      });
    }
  }, []);

  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        {isDev && <ReactQueryDevtools buttonPosition="bottom-left" />}
        {isDev && <TanStackRouterDevtools position="bottom-right" />}

        <Scripts />
      </body>
    </html>
  );
}
