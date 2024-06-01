/* eslint-disable react/no-array-index-key */
import React from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { Button, Text, cn } from "@waitingonalice/design-system";

export interface TagProps {
  label: string;
  onClear?: () => void;
  size?: "small" | "default";
  type?: "success" | "fail" | "pending" | "default";
  rounded?: boolean;
}

export function Tag(props: TagProps) {
  const {
    label,
    onClear,
    size = "default",
    type = "default",
    rounded = false,
  } = props;

  const handleOnClear = () => {
    if (onClear) onClear();
  };

  const colorMapping: Record<NonNullable<TagProps["type"]>, string> = {
    default: "bg-white text-typography-1",
    success: "bg-success-1 text-typography-4",
    fail: "bg-danger-1 text-typography-4",
    pending: "bg-warning-3 text-typography-4",
  };

  return (
    <div
      className={cn(
        "border-dotted border-gray-500",
        "flex items-center gap-x-1 border w-fit h-fit rounded-md",
        size === "small" ? "px-2 py-1" : "p-2",
        colorMapping[type],
        rounded && "rounded-3xl",
      )}
    >
      {onClear && (
        <Button
          className="w-4 h-4 text-gray-500 cursor-pointer active:text-secondary-5 hover:text-typography-1"
          onClick={handleOnClear}
        >
          <XCircleIcon />
        </Button>
      )}

      <Text className="whitespace-nowrap" type="caption">
        {label}
      </Text>
    </div>
  );
}
