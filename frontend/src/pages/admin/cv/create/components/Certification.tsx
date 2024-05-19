import React, { useState } from "react";
import { Button, Dialog, FormInput, Text } from "@waitingonalice/design-system";
import { BaseCVComponentProps, FormProps } from "../type";
import { SectionWrapper } from "./SectionWrapper";

type CertificationType = FormProps["certifications"][number];

interface CertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CertificationType) => void;
}
const init = {
  title: "",
  description: "",
};
function CertificationDialog({
  open,
  onClose,
  onAdd,
}: CertificationDialogProps) {
  const [field, setField] = useState<CertificationType>(init);
  const handleClose = () => {
    setField(init);
    onClose();
  };

  const handleAdd = () => {
    onAdd(field);
    setField(init);
    onClose();
  };

  const handleOnChangeFields = (
    key: keyof CertificationType,
    value: string,
  ) => {
    setField((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <Dialog
      title="Add Certification"
      open={open}
      onClose={handleClose}
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </>
      }
    >
      <div className="flex flex-col gap-y-4">
        <FormInput
          label="Title"
          onChange={(val) => handleOnChangeFields("title", val)}
          value={field.title}
          size="small"
        />
        <FormInput
          onChange={(val) => handleOnChangeFields("description", val)}
          value={field.description}
          as="textarea"
          label="Description"
        />
      </div>
    </Dialog>
  );
}
function Certification({
  data,
  onChange,
}: BaseCVComponentProps<FormProps["certifications"]>) {
  const [showDialog, setShowDialog] = useState(false);

  const handleModal = () => {
    setShowDialog((prev) => !prev);
  };

  const handleAddCertification = (cert: CertificationType) => {
    onChange("certifications", [...data.certifications, cert]);
  };

  const handleRemove = (index: number) => {
    const updateData = [...data.certifications];
    updateData.splice(index, 1);
    onChange("certifications", updateData);
  };

  return (
    <SectionWrapper buttonLabel="Add Certification" onClick={handleModal}>
      <CertificationDialog
        open={showDialog}
        onClose={handleModal}
        onAdd={handleAddCertification}
      />
      {data.certifications.length > 0 && (
        <ul className="mb-4 flex flex-col gap-y-4 mx-4">
          {data.certifications.map((cert, index) => (
            <li
              key={cert.title}
              className="list-disc border-b border-b-gray-2 pb-4"
            >
              <Text type="body">{cert.title}</Text>
              <Text type="caption">{cert.description}</Text>
              <Button
                className="ml-auto"
                variant="errorLink"
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}

export { Certification };
