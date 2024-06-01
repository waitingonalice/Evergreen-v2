/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import { AlignJustify, PlusIcon, X } from "lucide-react";
import { Button, Form, Input, Text } from "@waitingonalice/design-system";
import { BaseCVComponentProps, FormProps } from "../type";

interface FormWrapperProps {
  title: string;
  type: "languages" | "techstack";
  data: FormProps;
  placeholder: string;
  onRemove: (key: FormWrapperProps["type"], index: number) => void;
  onAdd: (key: FormWrapperProps["type"], value: string) => void;
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
}: FormWrapperProps) {
  const [field, setField] = useState(initField);

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

  return (
    <div className="flex flex-col gap-y-4 rounded-md">
      <Text type="subhead-2-bold">{title}</Text>
      {data[type]?.map((lang, index) => (
        <div
          key={lang}
          className="flex gap-x-4 items-center justify-between border-b border-b-gray-2 pb-4"
        >
          <Button variant="primaryLink" onClick={() => handleRemove(index)}>
            <X className={iconStyle} />
          </Button>
          <Text className="w-full" type="body">
            {lang}
          </Text>
          <AlignJustify className={iconStyle} />
        </div>
      ))}

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

  return (
    <div className="flex flex-col gap-y-8">
      <FormWrapper
        title="Languages"
        data={data}
        type="languages"
        placeholder="Languages (e.g. Typescript)"
        onAdd={handleAddSkill}
        onRemove={handleRemove}
      />
      <div className="w-full border-t border-gray-2" />
      <FormWrapper
        title="Technologies"
        data={data}
        type="techstack"
        placeholder="Technologies (e.g. React, NodeJS)"
        onAdd={handleAddSkill}
        onRemove={handleRemove}
      />
    </div>
  );
}

export { Skills };
