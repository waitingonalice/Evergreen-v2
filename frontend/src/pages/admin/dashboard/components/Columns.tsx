/* eslint-disable @typescript-eslint/no-empty-function */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { isNil } from "lodash";
import { ChevronsRight, Dot, Edit, GripHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Placeholder from "public/placeholder_img.svg";
import { Button, Spinner, Text, cn } from "@waitingonalice/design-system";
import { ServicesType, UpdateGroupInput } from "../loaders/selfhost";

function Rows(props: Partial<ServicesType>) {
  const { name, file, url } = props;

  const handleClickConfig = () => {};

  const handleClickService = () => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="bg-white px-4 py-3 flex flex-col rounded-md relative md:min-w-[300px]">
      <GripHorizontal className="cursor-move ml-auto mr-auto mb-4" />
      <div className="flex justify-between">
        <Button
          variant="primaryLink"
          onClick={handleClickConfig}
          className="flex !gap-4 items-center"
        >
          <Image
            alt="Service icon"
            src={file?.src ?? Placeholder}
            width={40}
            height={40}
            quality={50}
          />
          <Text type="subhead-2-bold">{name}</Text>
        </Button>
        <Button
          variant="primaryLink"
          onClick={handleClickService}
          className="ml-auto"
        >
          <ChevronsRight className="w-5 h-5" />
        </Button>
      </div>

      {/* {!isNil(status) && (
        <Dot
          className={cn(
            "right-0 top-0 h-12 w-12 absolute",
            status ? "text-success-main animate-pulse" : "text-error-main"
          )}
        />
      )} */}
    </div>
  );
}

interface ColumnsProps {
  id: number;
  name: string;
  onUpdate: ({ id, name }: UpdateGroupInput) => void;
  onDelete: (id: number) => void;
  services: ServicesType[];
  loading: boolean;
}

function Columns(props: ColumnsProps) {
  const { name, services, id, loading, onUpdate, onDelete } = props;
  const handleOnUpdate = () => {
    onUpdate({ id, name });
  };

  const handleOnDelete = () => {
    onDelete(id);
  };
  return (
    <div className="w-full md:min-w-[320px] md:max-w-sm ">
      <div className="bg-white p-4 rounded-t-md cursor-move flex items-center justify-between">
        <Text type="subhead-2-bold" className="text-primary">
          {name}
        </Text>
        <span className="flex gap-4">
          <Button variant="primaryLink" onClick={handleOnUpdate}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="errorLink" onClick={handleOnDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </span>
      </div>
      <div
        className={cn(
          "border-2 rounded-b-md border-white overflow-y-auto flex flex-col gap-4 py-4 px-2",
          "md:h-[calc(100vh-200px)] relative",
        )}
      >
        {loading && (
          <>
            <div className="absolute h-full w-full bg-black/80 z-10" />
            <Spinner className="z-10 absolute top-1/2 left-1/2" />
          </>
        )}
        {services?.map((service) => <Rows key={service.id} {...service} />)}
      </div>
    </div>
  );
}

export { Columns, Rows };
