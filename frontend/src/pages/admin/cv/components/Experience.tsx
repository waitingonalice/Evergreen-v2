import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  FormInput,
  FormNativeDatePicker,
  FormNativeSelect,
  Switch,
  Text,
  useForm,
} from "@waitingonalice/design-system";
import { EmploymentEnum } from "@/constants";
import { toMMMMYYYY } from "@/utils";
import { employmentOptions } from "@/utils/options";
import { useSection } from "../hooks/useSection";
import type { BaseCVComponentProps, Experience, FormProps } from "../type";
import { experienceSchema } from "../utils";
import { SectionWrapper } from "./SectionWrapper";

interface ExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Experience) => void;
  onEdit: (data: Experience) => void;
  data?: Experience;
}

interface AdditionalFieldsProps {
  currently_employed: boolean;
}

type AllFields = Experience & AdditionalFieldsProps;

const init: AllFields = {
  company_name: "",
  role: "",
  employment: "" as EmploymentEnum,
  start: null,
  end: null,
  job_description: "",
  currently_employed: false,
};

function ExperienceDialog({
  open,
  onClose,
  onAdd,
  onEdit,
  data,
}: ExperienceDialogProps) {
  const [field, setField] = useState<AllFields>({
    ...init,
    ...data,
    currently_employed: Boolean(data && !data?.end),
  });

  const form = useForm({
    zod: experienceSchema,
    data: field,
  });

  const handleOnClose = () => {
    setField(init);
    onClose();
    form.clearErrors();
  };

  const handleCommitExperience = () => {
    const success = form.onSubmit();
    if (!success) return;
    if (data) {
      onEdit(field);
    } else {
      onAdd(field);
    }
    handleOnClose();
  };

  const handleOnChange = <T extends string | Date | boolean | null>(
    key: keyof AllFields,
    val: T,
  ) => {
    form.validate(key, val);
    if (key === "currently_employed" && val && typeof val === "boolean") {
      setField((prev) => ({ ...prev, end: null, [key]: val }));
    } else {
      setField((prev) => ({ ...prev, [key]: val }));
    }
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
          <Button onClick={handleCommitExperience}>
            {data ? "Edit" : "Add"}
          </Button>
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
          calenderView="month"
        />

        <FormNativeDatePicker
          label="End"
          placeholder="Select end date"
          onChange={(val) => handleOnChange("end", val)}
          value={field.end}
          showError={Boolean(form.errors.end)}
          errorMessage={form.errors.end}
          calenderView="month"
          disabled={field.currently_employed}
        />
        <Switch
          label="I am currently working here"
          checked={field.currently_employed}
          onCheckedChange={(val) => handleOnChange("currently_employed", val)}
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
  const {
    data: experienceData,
    showDialog,
    handleEdit,
    handleEditCommit,
    handleModal,
    handleRemove,
  } = useSection(data.experiences);

  const handleAddExperience = (exp: Experience) => {
    onChange("experiences", [...data.experiences, exp]);
  };

  const handleCommitExperience = (exp: Experience) => {
    onChange("experiences", handleEditCommit(exp));
  };

  const handleRemoveExperience = (index: number) => {
    onChange("experiences", handleRemove(index));
  };
  return (
    <SectionWrapper buttonLabel="Add Experience" onClick={handleModal}>
      {showDialog && (
        <ExperienceDialog
          open={showDialog}
          onClose={handleModal}
          onAdd={handleAddExperience}
          onEdit={handleCommitExperience}
          data={experienceData?.data}
        />
      )}

      {data.experiences.map((exp, index) => (
        <div
          key={exp.company_name}
          className="border-b border-b-gray-2 mb-4 pb-4"
        >
          <div className="flex gap-x-4 items-center justify-between">
            <Text type="subhead-2-bold">{exp.company_name}</Text>
            {exp.start && (
              <Text type="caption">
                {toMMMMYYYY(exp.start)} -&nbsp;
                {exp.end ? toMMMMYYYY(exp.end) : "Present"}
              </Text>
            )}
          </div>
          <Text type="body">{exp.role}</Text>
          <Text className="whitespace-pre-line mt-2" type="caption">
            {exp.job_description}
          </Text>
          <div className="flex w-full items-center gap-x-2 justify-end">
            <Button onClick={() => handleEdit(index)} variant="primaryLink">
              <Pencil className="w-4 h-4" />
              <Text type="body">Edit</Text>
            </Button>
            <Button
              size="small"
              variant="errorLink"
              onClick={() => handleRemoveExperience(index)}
            >
              <Trash2 className="w-4 h-4" />
              <Text type="body">Remove</Text>
            </Button>
          </div>
        </div>
      ))}
    </SectionWrapper>
  );
}
