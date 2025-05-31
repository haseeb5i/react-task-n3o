import { ShowDonationItems } from "@/components/donation-items/list";
import { CreateDonationItem } from "@/components/donation-items/create";
import { FilterStatus } from "@/components/donation-items/filters";

export default function Root() {
  return (
    <main className="container py-8 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Donation Items</h1>
      <div className="flex justify-between mb-4">
        <FilterStatus />
        <CreateDonationItem />
      </div>
      <ShowDonationItems />
    </main>
  );
}
