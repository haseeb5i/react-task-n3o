import { Outlet } from "react-router-dom";

import { CreateDonationItem } from "@/components/donation-items/create-item";
import { FilterStatus } from "@/components/donation-items/filter-status";

export default function Root() {
  return (
    <main className="container py-8 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Donation Items</h1>
      <div className="flex justify-between mb-4">
        <FilterStatus />
        <CreateDonationItem />
      </div>
      <Outlet />
    </main>
  );
}
