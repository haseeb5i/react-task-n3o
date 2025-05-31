import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const FilterStatus = () => {
  const [searchParams, setSearchParms] = useSearchParams();
  const value = searchParams.get("status") ?? "all";

  return (
    <div className="flex gap-2 items-center text-sm font-medium">
      <span>Filter Status:</span>
      <Select
        value={value}
        onValueChange={(value) => {
          if (value !== "all") {
            setSearchParms({ status: value });
          } else {
            setSearchParms();
          }
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="opacity-50">
            Choose Status
          </SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="awaitingApproval">Awaiting Approval</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
