"use client";

import { useForm, type Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  donationSchema,
  createDonationItem,
  getThemesQuery,
  getLocationsQuery,
} from "@/lib/api";

type DonationFormValues = z.infer<typeof donationSchema>;

export function DonationItemForm() {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createDonationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["donations", "list"],
      });
      form.reset({ name: "", price: "", location: "", theme: "" });
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    console.log("form data", data);
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        id="donation-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter donation name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectLocation control={form.control} />

        <SelectTheme control={form.control} />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (GBP £)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit">
            Submit
            {isPending && <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const SelectLocation = ({
  control,
}: {
  control: Control<DonationFormValues>;
}) => {
  const { data, isPending } = useQuery(getLocationsQuery);
  const locations = data ?? [];

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-[250px]" isPending={isPending}>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const SelectTheme = ({ control }: { control: Control<DonationFormValues> }) => {
  const { data, isPending } = useQuery(getThemesQuery);
  const themes = data ?? [];

  return (
    <FormField
      control={control}
      name="theme"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Theme</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-[250px]" isPending={isPending}>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CreateDonationItem = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Creat a new Donation item</DialogTitle>
        </DialogHeader>
        <DonationItemForm />
      </DialogContent>
    </Dialog>
  );
};
