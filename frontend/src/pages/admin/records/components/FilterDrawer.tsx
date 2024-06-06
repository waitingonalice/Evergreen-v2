import { useState } from "react";
import { FormNativeSelect } from "@waitingonalice/design-system";
import { Drawer } from "@waitingonalice/design-system/components/drawer";
import { bucketOptions, statusOptions } from "@/utils";
import { DEFAULT_PAGINATION, FilterInput } from "../loaders/records";

interface FilterDrawerProps {
  onChangeFilter: (arg: FilterInput) => void;
  onClose: () => void;
  open: boolean;
  filters?: FilterInput;
}

function FilterDrawer(props: FilterDrawerProps) {
  const { onChangeFilter, onClose, open, filters } = props;
  const [filter, setFilter] = useState<FilterInput>({ ...filters });

  const handleOnChange = (
    key: keyof FilterInput,
    value: FilterInput[keyof FilterInput],
  ) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = () => {
    onChangeFilter({
      ...filter,
      ...DEFAULT_PAGINATION,
    });
    onClose();
  };

  const handleClear = () => {
    setFilter({});
    onChangeFilter({
      record_type: null,
      status: null,
      ...DEFAULT_PAGINATION,
    });
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter records"
      actionButtons={[
        {
          onClick: handleClear,
          children: "Clear",
          variant: "errorLink",
        },
        {
          onClick: handleFilter,
          children: "Apply",
        },
      ]}
    >
      <div className="flex flex-col gap-4">
        <FormNativeSelect
          label="Status"
          options={statusOptions}
          placeholder="Select status"
          value={filter?.status ?? ""}
          onChange={(val) => handleOnChange("status", val)}
        />
        <FormNativeSelect
          label="Record Type"
          options={bucketOptions}
          placeholder="Select Record type"
          value={filter?.record_type ?? ""}
          onChange={(val) => handleOnChange("record_type", val)}
        />
      </div>
    </Drawer>
  );
}

export { FilterDrawer };
