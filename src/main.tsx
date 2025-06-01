import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";

import ErrorPage from "./error-page";
import { Toaster } from "./components/ui/sonner";
import { donationItemsLoader } from "./lib/api";
import Root from "./components/donation-items/layout";
import {
  DonationItemsSkeleton,
  ShowDonationItems,
} from "./components/donation-items/list-items";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <Root />,
      children: [
        {
          index: true,
          loader: donationItemsLoader(queryClient),
          hydrateFallbackElement: <DonationItemsSkeleton />,
          element: <ShowDonationItems />,
        },
      ],
    },
  ],
  {
    future: {
      v7_partialHydration: true,
    },
  },
);

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
