import { useState } from "react";
import {
  Button,
  Dialog,
  Form,
  FormInput,
  FormNativeSelect,
  FormUpload,
} from "@waitingonalice/design-system";
import { FileContentTypeEnum, PrimitiveType } from "@waitingonalice/utilities";
import { MediaGrid } from "@/components";
import { useFileHandler } from "@/hooks";
import { ValidationType } from "@/utils";
import { GroupsType } from "../loaders/selfhost";
import FormWrapper from "./FormWrapper";

interface FormProps {
  group: string;
  url: string;
  name: string;
}
interface SelfHostFormProps {
  show: boolean;
  onClose: () => void;
  onAddService: () => void;
  groups?: GroupsType[];
}

const uploadValidation: ValidationType = {
  supportedFileTypes: [
    FileContentTypeEnum.JPEG,
    FileContentTypeEnum.PNG,
    FileContentTypeEnum.CSV,
    FileContentTypeEnum.SVG,
  ],
  maxFileCount: 4,
};

function SelfHostForm({
  show,
  onClose,
  // onAddService,
  groups,
}: SelfHostFormProps) {
  const [form, setForm] = useState<FormProps>({
    group: "",
    url: "",
    name: "",
  });

  const { files, onClearAllFiles, onClearFile, registerFileUpload } =
    useFileHandler({
      rules: uploadValidation,
      initFiles: [],
    });

  const groupOptions =
    groups?.map((group) => ({
      label: group.name,
      value: group.id,
    })) ?? [];

  const handleCloseServiceDialog = () => {
    setForm({
      group: "",
      url: "",
      name: "",
    });
    onClearAllFiles();
    onClose();
  };

  const handleOnChange = (key: keyof typeof form, value: PrimitiveType) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddService = () => {
    // onAddService(form);
  };
  return (
    <Dialog
      isModal
      size="xl"
      open={show}
      onClose={handleCloseServiceDialog}
      rightFooterChildren={
        <>
          <Button onClick={handleCloseServiceDialog} variant="secondary">
            Close
          </Button>
          <Button onClick={handleAddService}>Add service</Button>
        </>
      }
    >
      <Form onSubmit={handleAddService}>
        <FormWrapper title="Add new service">
          <FormInput
            label="Name"
            required
            placeholder="Enter service name"
            onChange={(value) => handleOnChange("name", value)}
            value={form.name}
          />
          <FormInput
            label="URL"
            required
            placeholder="Enter service URL"
            onChange={(value) => handleOnChange("url", value)}
            value={form.url}
          />
          <FormNativeSelect
            placeholder="Choose a group"
            label="Group"
            options={groupOptions}
            value={form.group}
            onChange={(value) => handleOnChange("group", value)}
          />
          <FormUpload
            {...registerFileUpload}
            label="Service Image"
            subtext="Accepted file types: JPEG, PNG"
            multiple
          />
          {files?.map((file, idx) => (
            <MediaGrid
              key={file.src}
              file={file}
              onDelete={() => onClearFile(idx)}
            />
          ))}
        </FormWrapper>
      </Form>
    </Dialog>
  );
}

export { SelfHostForm };
