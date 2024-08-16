/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import {
  Button,
  Dialog,
  FormInput,
  Spinner,
  useForm,
} from "@waitingonalice/design-system";
import { Maybe } from "@/types";
import { UpdateGroupInput } from "../loaders/selfhost";
import { groupNameSchema } from "../utils/validation";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
}
interface GroupDialogProps extends DialogProps {
  onAdd: (name: string) => Promise<void>;
  data?: Maybe<UpdateGroupInput>;
}
function GroupDialog({
  open,
  onClose,
  onAdd,
  loading,
  data,
}: GroupDialogProps) {
  const [name, setName] = useState(data?.name ?? "");

  const validation = useForm({
    zod: groupNameSchema,
    data: { name },
  });

  const handleOnAdd = () => {
    const success = validation.onSubmit();
    if (!success) return;
    onAdd(name);
  };

  const handleOnCancel = () => {
    setName("");
    onClose();
  };

  const handleOnChange = (val: string) => {
    validation.validate("name", val);
    setName(val);
  };

  return (
    <Dialog
      withOverlay
      open={open}
      onClose={handleOnCancel}
      title="Add group"
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button onClick={handleOnAdd} disabled={loading}>
            {loading ? <Spinner /> : data ? "Update" : "Add"}
          </Button>
        </>
      }
    >
      <FormInput
        label="Group Name"
        required
        onChange={handleOnChange}
        value={name}
        showError={Boolean(validation.errors.name)}
        errorMessage={validation.errors.name}
      />
    </Dialog>
  );
}

export { GroupDialog };
