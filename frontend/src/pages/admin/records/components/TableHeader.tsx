import { useState } from "react";
import { FilterIcon } from "lucide-react";
import {
  Button,
  Input,
  Text,
  useDebouncedCallback,
} from "@waitingonalice/design-system";
import { Tag } from "@/components";
import {
  DEFAULT_PAGINATION,
  FilterInput,
  ListRecordInput,
} from "../loaders/records";

interface TableHeaderProps {
  onDisplayDrawer: () => void;
  filters?: FilterInput;
  onChangeFilter: (input: ListRecordInput) => void;
}

const filtersMap: Record<
  keyof Pick<FilterInput, "record_type" | "status" | "filename">,
  string
> = {
  status: "Status",
  record_type: "Type",
  filename: "Name",
};
function TableHeader({
  onDisplayDrawer,
  filters,
  onChangeFilter,
}: TableHeaderProps) {
  const [searchString, setSearchString] = useState("");
  const debounceSearch = useDebouncedCallback((val: string) => {
    onChangeFilter({ ...DEFAULT_PAGINATION, filename: val });
  }, 500);

  const handleRemoveFilter = (key?: string) => {
    if (!key) return;
    onChangeFilter({ ...DEFAULT_PAGINATION, [key]: null });
    if (key === "filename") setSearchString("");
  };

  const handleOnChangeSearch = (val: string) => {
    setSearchString(val);
    debounceSearch(val);
  };

  const renderFilters =
    filters &&
    Object.entries(filters).filter(
      ([key, val]) => filtersMap[key as keyof typeof filtersMap] && val,
    );
  return (
    <div className="mb-4 w-full">
      <div className="flex my-4 gap-4 items-center justify-end">
        <Input
          placeholder="Search filename"
          onChange={handleOnChangeSearch}
          value={searchString}
        />
        <Button onClick={onDisplayDrawer}>
          <FilterIcon className="w-5 h-5 text-secondary-1" />
        </Button>
      </div>
      {renderFilters && renderFilters.length > 0 && (
        <span className="flex gap-4 items-center">
          <Text type="body" className="text-secondary-1">
            Filters:&nbsp;
          </Text>
          {renderFilters.map(([key, val]) => (
            <Tag
              rounded
              size="small"
              key={key}
              label={`${filtersMap[key as keyof typeof filtersMap]} | ${val}`}
              value={key}
              onClear={handleRemoveFilter}
            />
          ))}
        </span>
      )}
    </div>
  );
}
export { TableHeader };
