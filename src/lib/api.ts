import { QueryClient, queryOptions } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod";

const BASE_API_URL = "https://n3o-coding-task-react.azurewebsites.net/api/v1";

export type DonationItem = {
  id: string;
  reference: {
    number: number;
    text: string;
  };
  name: string;
  location: DonationLocation;
  theme: DonationTheme;
  price: {
    amount: number;
    text: string;
  } | null;
  status: DonationStatus;
};

export const donationListQuery = (status?: string) =>
  queryOptions({
    queryKey: ["donations", "list", status ?? "all"],
    queryFn: async () => {
      try {
        let url = `${BASE_API_URL}/donationItems/all`;
        if (status) {
          url = `${url}?status=${status}`;
        }
        const resp = await fetch(url);
        return (await resp.json()) as DonationItem[];
      } catch (err) {
        console.error("error fetching donation list", err);
        return [];
      }
    },
  });

export const donationItemsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "";
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    await queryClient.ensureQueryData(donationListQuery(status));
    return { status };
  };

type DonationLocation = {
  id: string;
  name: string;
};

export const getLocationsQuery = queryOptions({
  queryKey: ["locations", "list"],
  queryFn: async () => {
    const resp = await fetch(`${BASE_API_URL}/donationItems/locations`);
    return (await resp.json()) as DonationLocation[];
  },
  staleTime: 5 * 60 * 1000,
});

type DonationTheme = {
  id: string;
  name: string;
};

export const getThemesQuery = queryOptions({
  queryKey: ["themes", "list"],
  queryFn: async () => {
    const resp = await fetch(`${BASE_API_URL}/donationItems/themes`);
    return (await resp.json()) as DonationTheme[];
  },
  staleTime: 5 * 60 * 1000,
});

export const donationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  location: z.string().min(1, "Location is required"),
  theme: z.string().min(1, "Theme is required"),
  price: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Price must be a positive number",
    }),
});
export type CreateDonationItemDto = z.infer<typeof donationSchema>;

export async function createDonationItem(data: CreateDonationItemDto) {
  const resp = await fetch(`${BASE_API_URL}/donationItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      price: data.price ? { currencyCode: "gbp", amount: +data.price } : null,
    }),
  });
  return (await resp.json()) as DonationItem[];
}

type DonationStatus = {
  id: string;
  name: string;
};
