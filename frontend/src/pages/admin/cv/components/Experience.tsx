import React, { useState } from "react";
import {
  Button,
  Dialog,
  FormInput,
  FormNativeDatePicker,
  FormNativeSelect,
  Text,
  useForm,
} from "@waitingonalice/design-system";
import { EmploymentEnum } from "@/constants";
import { toDDMMMYYYY } from "@/utils";
import { employmentOptions } from "@/utils/options";
import type { BaseCVComponentProps, Experience, FormProps } from "../type";
import { experienceSchema } from "../utils";
import { SectionWrapper } from "./SectionWrapper";

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
  job_description: "",
};
function ExperienceDialog({ open, onClose, onAdd }: ExperienceDialogProps) {
  const [field, setField] = useState(init);

  const form = useForm({
    zod: experienceSchema(field),
    data: field,
  });

  const handleOnClose = () => {
    setField(init);
    onClose();
    form.clearErrors();
  };
  const handleAddExperience = () => {
    const success = form.onSubmit();
    if (!success) return;
    onAdd(field);
    handleOnClose();
  };

  const handleOnChange = <T extends string | Date | null>(
    key: keyof Experience,
    val: T,
  ) => {
    form.validate(key, val);
    setField((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      title="Add Experience"
      withOverlay
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
          showError={Boolean(form.errors.company_name)}
          errorMessage={form.errors.company_name}
        />
        <FormNativeSelect
          label="Employment"
          placeholder="Select Employment Type"
          options={employmentOptions}
          value={field.employment}
          onChange={(val) => handleOnChange("employment", val)}
          size="small"
          showError={Boolean(form.errors.employment)}
          errorMessage={form.errors.employment}
        />
        <FormInput
          label="Role"
          onChange={(val) => handleOnChange("role", val)}
          value={field.role}
          size="small"
          placeholder="E.g. Software Engineer"
          showError={Boolean(form.errors.role)}
          errorMessage={form.errors.role}
        />
        <FormNativeDatePicker
          label="Start"
          onChange={(val) => handleOnChange("start", val)}
          value={field.start}
          placeholder="Select start date"
          showError={Boolean(form.errors.start)}
          errorMessage={form.errors.start}
        />
        <FormNativeDatePicker
          label="End"
          placeholder="Select end date"
          onChange={(val) => handleOnChange("end", val)}
          value={field.end}
          showError={Boolean(form.errors.end)}
          errorMessage={form.errors.end}
        />
        <FormInput
          label="Description"
          as="textarea"
          onChange={(val) => handleOnChange("job_description", val)}
          value={field.job_description}
          size="small"
          showError={Boolean(form.errors.job_description)}
          errorMessage={form.errors.job_description}
        />
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
          <Text className="whitespace-pre-line" type="caption">
            {exp.job_description}
          </Text>
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
