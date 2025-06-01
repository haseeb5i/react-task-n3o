import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoaderData } from "react-router-dom";

import { donationListQuery } from "@/lib/api";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export function ShowDonationItems() {
  const { status } = useLoaderData() as { status?: string };
  const { data: donationItems } = useSuspenseQuery(donationListQuery(status));

  if (donationItems.length === 0) {
    return (
      <div className="flex justify-center min-h-[200px] items-center">
        <p className="font-medium text-lg">No Donations Found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {donationItems.map((item) => (
        <Card
          key={item.id}
          className="rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <CardHeader className="flex gap-2 items-center">
            <CardTitle>{item.name}</CardTitle>
            <Badge variant="outline">{item.status.name}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Reference:</strong> {item.reference.text}
            </div>
            <div>
              <strong>Price:</strong> {item.price?.text ?? "N/A"}
            </div>
            <div>
              <strong>Location:</strong> {item.location?.name ?? "N/A"}
            </div>
            <div>
              <strong>Theme:</strong> {item.theme.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const DonationItemsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

const CardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="w-[180px] h-6" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="w-[150px] h-5" />
      <Skeleton className="w-[150px] h-5" />
      <Skeleton className="w-[150px] h-5" />
      <Skeleton className="w-[150px] h-5" />
    </CardContent>
  </Card>
);
