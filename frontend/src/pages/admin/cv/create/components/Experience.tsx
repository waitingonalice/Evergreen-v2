import React, { useState } from "react";
import { XCircleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Dialog,
  Form,
  FormInput,
  FormNativeDatePicker,
  FormNativeSelect,
  Text,
  cn,
} from "@waitingonalice/design-system";
import { EmploymentEnum } from "@/constants";
import { toDDMMMYYYY } from "@/utils";
import { employmentOptions } from "@/utils/options";
import { BaseCVComponentProps, FormProps } from "../type";
import { SectionWrapper } from "./SectionWrapper";

type Experience = FormProps["experiences"][number];
interface ExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Experience) => void;
}

const init: Experience = {
  company_name: "",
  role: "",
  employment: "" as EmploymentEnum,
  start: null,
  end: null,
  job_description: [],
};
function ExperienceDialog({ open, onClose, onAdd }: ExperienceDialogProps) {
  const [field, setField] = useState(init);
  const [description, setDescription] = useState<string>("");

  const handleOnClose = () => {
    setField(init);
    onClose();
  };
  const handleAddExperience = () => {
    onAdd(field);
    handleOnClose();
  };

  const handleOnChange = <T,>(key: keyof Experience, val: T) => {
    setField((prev) => ({ ...prev, [key]: val }));
  };

  const handleRemoveDescription = (index: number) => {
    setField((prev) => {
      const updateDesc = [...prev.job_description];
      updateDesc.splice(index, 1);
      return {
        ...prev,
        job_description: updateDesc,
      };
    });
  };

  const handleAddDescription = () => {
    setField((prev) => {
      setDescription("");
      return {
        ...prev,
        job_description: [...prev.job_description, description],
      };
    });
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      title="Add Experience"
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button onClick={handleAddExperience}>Add</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="Company Name"
          onChange={(val) => handleOnChange("company_name", val)}
          value={field.company_name}
          size="small"
        />
        <FormNativeSelect
          label="Employment"
          placeholder="Select Employment Type"
          options={employmentOptions}
          value={field.employment}
          onChange={(val) => handleOnChange("employment", val)}
          size="small"
        />
        <FormInput
          label="Role"
          onChange={(val) => handleOnChange("role", val)}
          value={field.role}
          size="small"
          placeholder="E.g. Software Engineer"
        />
        <FormNativeDatePicker
          label="Start"
          onChange={(val) => handleOnChange("start", val)}
          value={field.start}
          placeholder="Select start date"
        />
        <FormNativeDatePicker
          label="End"
          placeholder="Select end date"
          onChange={(val) => handleOnChange("end", val)}
          value={field.end}
        />
        <Form
          onSubmit={handleAddDescription}
          className={cn(
            "flex flex-col gap-y-4",
            field.job_description.length > 0 && "mt-4",
          )}
        >
          {field.job_description.length > 0 && (
            <ul className="flex flex-col gap-y-4 p-4 border rounded-md">
              {field.job_description.map((desc, index, arr) => (
                <li
                  key={desc}
                  className={cn(
                    "flex gap-x-4 justify-between",
                    arr.length > 1 && " border-b pb-4",
                  )}
                >
                  <Text type="caption">{desc}</Text>
                  <Button
                    size="small"
                    variant="errorLink"
                    onClick={() => handleRemoveDescription(index)}
                  >
                    <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <FormInput
            label="Description"
            as="textarea"
            onChange={handleDescriptionChange}
            value={description}
            size="small"
          />
          <Button className="w-fit" type="submit" size="small">
            Add Description
          </Button>
        </Form>
      </div>
    </Dialog>
  );
}

export function Experience({
  data,
  onChange,
}: BaseCVComponentProps<FormProps["experiences"]>) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddExperience = (exp: Experience) => {
    onChange("experiences", [...data.experiences, exp]);
  };

  const handleModal = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleRemoveExperience = (index: number) => {
    onChange(
      "experiences",
      data.experiences.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionWrapper buttonLabel="Add Experience" onClick={handleModal}>
      <ExperienceDialog
        open={openDialog}
        onClose={handleModal}
        onAdd={handleAddExperience}
      />
      {data.experiences.map((exp, index) => (
        <div
          key={exp.company_name}
          className="border-b border-b-gray-2 mb-4 pb-4"
        >
          <div className="flex gap-x-4 items-center justify-between">
            <Text type="subhead-2-bold">{exp.company_name}</Text>
            {exp.start && exp.end && (
              <Text type="caption">
                {toDDMMMYYYY(exp.start)} -&nbsp;
                {toDDMMMYYYY(exp.end)}
              </Text>
            )}
          </div>
          <Text type="body">{exp.role}</Text>
          <ul className="flex flex-col gap-y-2 mx-4 mt-2 list-disc">
            {exp.job_description.map((desc) => (
              <li key={desc}>
                <Text type="caption">{desc}</Text>
              </li>
            ))}
          </ul>
          <Button
            className="ml-auto"
            size="small"
            variant="errorLink"
            onClick={() => handleRemoveExperience(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </SectionWrapper>
  );
}
