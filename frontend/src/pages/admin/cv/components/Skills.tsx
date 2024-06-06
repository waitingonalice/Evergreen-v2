/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import { AlignJustify, PlusIcon, X } from "lucide-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Button, Form, Input, Text } from "@waitingonalice/design-system";
import { Sortable, useDragSensors } from "@/components";
import { BaseCVComponentProps, FormProps } from "../type";

interface FormWrapperProps {
  title: string;
  type: "languages" | "techstack";
  data: FormProps;
  placeholder: string;
  onRemove: (key: FormWrapperProps["type"], index: number) => void;
  onAdd: (key: FormWrapperProps["type"], value: string) => void;
  onSort: (
    key: FormWrapperProps["type"],
    startIndex: number,
    endIndex: number,
  ) => void;
}
const initField = {
  show: false,
  value: "",
};

const iconStyle = "w-4 h-4";

function FormWrapper({
  title,
  type,
  data,
  placeholder,
  onRemove,
  onAdd,
  onSort,
}: FormWrapperProps) {
  const [field, setField] = useState(initField);
  const sensors = useDragSensors();

  const handleSkillsChange = (value: string) => {
    setField((prev) => ({
      ...prev,
      value,
    }));
  };

  const handleClickAddLangField = () => {
    setField((prev) => ({
      ...prev,
      show: true,
    }));
  };

  const handleRemove = (index: number) => {
    onRemove(type, index);
  };

  const handleAddSkill = () => {
    onAdd(type, field.value);
    setField(initField);
  };

  const handleSort = (e: DragEndEvent) => {
    const { over, active } = e;
    const startIndex: number = active.data.current?.sortable.index;
    const endIndex: number = over?.data.current?.sortable.index;
    onSort(type, startIndex, endIndex);
  };

  return (
    <DndContext onDragEnd={handleSort} sensors={sensors}>
      <div className="flex flex-col gap-y-4 rounded-md">
        <Text type="subhead-2-bold">{title}</Text>
        <SortableContext items={data[type]}>
          {data[type]?.map((data, index) => (
            <Sortable key={data} id={data}>
              {({ attributes, listeners, isDragging }) => (
                <div className="flex gap-x-4 items-center border-b border-b-gray-2 pb-4">
                  <Button
                    variant="primaryLink"
                    onClick={() => handleRemove(index)}
                  >
                    <X className={iconStyle} />
                  </Button>
                  <Text className="w-full" type="body">
                    {data}
                  </Text>
                  <span {...attributes} {...listeners}>
                    <AlignJustify
                      className={iconStyle}
                      style={{
                        cursor: isDragging ? "grabbing" : "grab",
                      }}
                    />
                  </span>
                </div>
              )}
            </Sortable>
          ))}
        </SortableContext>

        {field.show ? (
          <Form className="gap-x-4 flex" onSubmit={handleAddSkill}>
            <Input
              value={field.value}
              size="small"
              placeholder={placeholder}
              onChange={handleSkillsChange}
            />
            <Button size="small" type="submit">
              <PlusIcon className={iconStyle} />
            </Button>
          </Form>
        ) : (
          <Button
            size="small"
            className="w-fit"
            onClick={handleClickAddLangField}
          >
            <PlusIcon className={iconStyle} />
            <Text type="body-bold">
              Add {type === "languages" ? "Languages" : "Technologies"}
            </Text>
          </Button>
        )}
      </div>
    </DndContext>
  );
}

function Skills({ onChange, data }: BaseCVComponentProps<string[]>) {
  const handleAddSkill = (key: FormWrapperProps["type"], value: string) => {
    const updateData = [...data[key]];
    updateData.push(value);
    onChange(key, updateData);
  };

  const handleRemove = (key: FormWrapperProps["type"], index: number) => {
    const updateData = [...data[key]];
    updateData.splice(index, 1);
    onChange(key, updateData);
  };

  const handleSort = (
    type: FormWrapperProps["type"],
    startIndex: number,
    endIndex: number,
  ) => {
    const updateData = [...data[type]];
    const value = updateData.splice(startIndex, 1);
    updateData.splice(endIndex, 0, value[0]);
    onChange(type, updateData);
  };

  return (
    <div className="flex flex-col gap-y-8">
      <FormWrapper
        title="Languages"
        data={data}
        type="languages"
        placeholder="Languages (e.g. Typescript)"
        onAdd={handleAddSkill}
        onRemove={handleRemove}
        onSort={handleSort}
      />
      <div className="w-full border-t border-gray-2" />
      <FormWrapper
        title="Technologies"
        data={data}
        type="techstack"
        placeholder="Technologies (e.g. React, NodeJS)"
        onAdd={handleAddSkill}
        onRemove={handleRemove}
        onSort={handleSort}
      />
    </div>
  );
}

export { Skills };
