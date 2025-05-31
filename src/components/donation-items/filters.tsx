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
    <div className="flex gap-2 items-center text-sm font-medium">
      <span>Filter Status:</span>
      <Select
        value={value}
        onValueChange={(value) => {
          setSearchParms({ status: value });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="awaitingApproval">Awaiting Approval</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      {value && (
        <Button onClick={() => setSearchParms({})} variant="ghost">
          <X className="size" />
          Reset
        </Button>
      )}
    </div>
  );
};
