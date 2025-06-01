import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export const FilterStatus = () => {
  const [searchParams, setSearchParms] = useSearchParams();
  const value = searchParams.get("status") ?? "";

  return (
    <div className="sm:flex gap-2 items-center font-medium">
      <p className="mb-1 text-xs sm:text-sm">Filter Status:</p>
      <div className="flex gap-1 sm:gap-2">
        <Select
          value={value}
          onValueChange={(value) => {
            setSearchParms({ status: value });
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Choose Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="awaitingApproval">Awaiting Approval</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {value && (
          <Button size="sm" onClick={() => setSearchParms({})} variant="ghost">
            <X className="size" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
