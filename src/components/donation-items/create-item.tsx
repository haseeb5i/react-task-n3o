"use client";

import { useForm, type Control, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, Plus, PoundSterling } from "lucide-react";

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
  donationListQuery,
} from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertTitle } from "../ui/alert";

type DonationFormValues = z.infer<typeof donationSchema>;

type DonationItemFormProps = {
  form: UseFormReturn<DonationFormValues>;
  onSubmitSuccess: () => void;
};

const defaultValues = {
  name: "",
  price: "",
  location: "",
  theme: "",
};

export function DonationItemForm({
  form,
  onSubmitSuccess,
}: DonationItemFormProps) {
  const [errMsg, setErrMsg] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createDonationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["donations", "list"],
      });
      form.reset(defaultValues);
      toast.success("Donation item created successfully");
      onSubmitSuccess();
    },
    onError: (error) => {
      setErrMsg(error.message);
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md w-full"
      >
        {errMsg && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{errMsg}</AlertTitle>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <PoundSterling className="size-4 absolute left-2 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Enter price"
                    className="pl-8"
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </div>
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
          <FormLabel>Location*</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            name={field.name}
          >
            <FormControl>
              <SelectTrigger
                ref={field.ref}
                className="w-[250px]"
                isPending={isPending}
              >
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              {locations.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <FormLabel>Theme*</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            name={field.name}
          >
            <FormControl>
              <SelectTrigger className="w-[250px]" isPending={isPending}>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CreateDonationItem = () => {
  const [open, setOpen] = useState(false);
  const { data: donationItems } = useSuspenseQuery(donationListQuery());
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(
      donationSchema.refine(
        (data) =>
          !donationItems.find((item) => item.name.trim() === data.name.trim()),
        { message: "Name must be unique", path: ["name"] },
      ),
    ),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Creat a new Donation item</DialogTitle>
        </DialogHeader>
        <DonationItemForm
          form={form}
          onSubmitSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
