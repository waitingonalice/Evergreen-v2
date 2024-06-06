import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  FormInput,
  Text,
  useForm,
} from "@waitingonalice/design-system";
import { useSection } from "../hooks/useSection";
import { BaseCVComponentProps, Certifications, FormProps } from "../type";
import { certificationSchema } from "../utils";
import { SectionWrapper } from "./SectionWrapper";

type CertificationType = FormProps["certifications"][number];

interface CertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CertificationType) => void;
  onEdit: (data: CertificationType) => void;
  data?: Certifications | null;
}
const init = {
  title: "",
  description: "",
};
function CertificationDialog({
  open,
  onClose,
  onAdd,
  onEdit,
  data,
}: CertificationDialogProps) {
  const [field, setField] = useState<CertificationType>(data ?? init);
  const form = useForm({ zod: certificationSchema, data: field });

  const handleClose = () => {
    setField(init);
    onClose();
  };

  const handleAdd = () => {
    if (!form.onSubmit()) return;
    onAdd(field);
    setField(init);
    onClose();
  };

  const handleEdit = () => {
    if (!form.onSubmit()) return;
    onEdit(field);
    handleClose();
  };

  const handleOnChangeFields = (
    key: keyof CertificationType,
    value: string,
  ) => {
    form.validate(key, value);
    setField((prev) => ({ ...prev, [key]: value }));
  };

  const handleAction = data ? handleEdit : handleAdd;
  return (
    <Dialog
      title="Add Certification"
      open={open}
      onClose={handleClose}
      withOverlay
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAction}>{data ? "Edit" : "Add"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-y-4">
        <FormInput
          label="Title"
          onChange={(val) => handleOnChangeFields("title", val)}
          value={field.title}
          size="small"
          errorMessage={form.errors.title}
          showError={!!form.errors.title}
        />
        <FormInput
          onChange={(val) => handleOnChangeFields("description", val)}
          value={field.description}
          as="textarea"
          label="Description"
          errorMessage={form.errors.description}
          showError={!!form.errors.description}
        />
      </div>
    </Dialog>
  );
}
function Certification({
  data,
  onChange,
}: BaseCVComponentProps<FormProps["certifications"]>) {
  const {
    data: certData,
    showDialog,
    handleEdit,
    handleEditCommit,
    handleModal,
    handleRemove,
  } = useSection(data.certifications);

  const handleAddCertification = (cert: CertificationType) => {
    onChange("certifications", [...data.certifications, cert]);
  };

  const handleRemoveCert = (index: number) => {
    onChange("certifications", handleRemove(index));
  };

  const handleCommitCertification = (cert: CertificationType) => {
    onChange("certifications", handleEditCommit(cert));
  };

  return (
    <SectionWrapper buttonLabel="Add Certification" onClick={handleModal}>
      {showDialog && (
        <CertificationDialog
          open={showDialog}
          onClose={handleModal}
          onAdd={handleAddCertification}
          onEdit={handleCommitCertification}
          data={certData?.data}
        />
      )}
      {data.certifications.length > 0 && (
        <ul className="mb-4 flex flex-col gap-y-4">
          {data.certifications.map((cert, index) => (
            <li key={cert.title} className="border-b border-b-gray-2 pb-4">
              <Text type="body-bold">{cert.title}</Text>
              <Text className="my-2" type="caption">
                {cert.description}
              </Text>

              <span className="flex gap-x-4 justify-end w-full">
                <Button onClick={() => handleEdit(index)} variant="primaryLink">
                  <Pencil className="w-4 h-4" />
                  <Text type="body">Edit</Text>
                </Button>
                <Button
                  variant="errorLink"
                  onClick={() => handleRemoveCert(index)}
                >
                  <Trash2 className="w-4 h-4" />
                  <Text type="body">Remove</Text>
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}

export { Certification };
