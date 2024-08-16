/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from "react";
import { nanoid } from "nanoid";
import { ToastContextBaseProps, useToast } from "@waitingonalice/design-system";
import {
  UpdateGroupInput,
  useAddNewGroup,
  useDeleteGroup,
  useListSelfHostServices,
  useUpdateGroup,
} from "../loaders/selfhost";

interface DialogState {
  service: boolean;
  group: {
    show: boolean;
    data: UpdateGroupInput | null;
  };
}
export function useServices() {
  const [openDialog, setOpenDialog] = useState<DialogState>({
    service: false,
    group: {
      show: false,
      data: null,
    },
  });
  const {
    data,
    refetch: refetchServices,
    isLoading: loadingListServices,
  } = useListSelfHostServices();
  const [addNewGroup, addNewGroupOptions] = useAddNewGroup();
  const [updateGroup, updateGroupOptions] = useUpdateGroup();
  const [deleteGroup, deleteGroupOptions] = useDeleteGroup();
  const { renderToast } = useToast();
  const toastProps: ToastContextBaseProps = {
    key: nanoid(),
    title: "Internal server error",
    variant: "error",
    show: true,
  };

  const handleDisplayGroupDialog = () => {
    setOpenDialog((prevState) => ({
      ...prevState,
      group: {
        show: !prevState.group.show,
        data: null,
      },
    }));
  };

  const handleServiceDialog = () => {
    setOpenDialog((prevState) => ({
      ...prevState,
      service: !prevState.service,
    }));
  };

  const handleCloseServiceDialog = () => {
    setOpenDialog((prev) => ({ ...prev, service: false }));
  };

  const handleDisplayUpdateGroupDialog = (arg: UpdateGroupInput) => {
    setOpenDialog((prevState) => ({
      ...prevState,
      group: {
        show: !prevState.group.show,
        data: arg,
      },
    }));
  };

  const handleGroup = async (name: string) => {
    try {
      const data = openDialog.group.data?.id
        ? await updateGroup({
            id: openDialog.group.data.id,
            name,
          })
        : await addNewGroup({ name });
      if (!data.result) return;
      await refetchServices();
      handleDisplayGroupDialog();
    } catch (err) {
      renderToast({
        ...toastProps,
        description: `There was an error ${
          openDialog.group.data ? "updating" : "adding"
        } the group. Please try again later.`,
      });
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteGroup({
        id,
      });
      await refetchServices();
    } catch (err) {
      renderToast({
        ...toastProps,
        description:
          "There was an error deleting the group. Please try again later.",
      });
    }
  };

  const handleAddService = async () => {};

  return {
    handleServiceDialog,
    handleCloseServiceDialog,
    handleDisplayGroupDialog,
    handleDisplayUpdateGroupDialog,
    handleGroup,
    handleAddService,
    handleDeleteGroup,
    data: data?.result,
    openDialog,
    loadingGroup:
      loadingListServices ||
      addNewGroupOptions.isLoading ||
      updateGroupOptions.isLoading,
    loadingDeleteGroup: deleteGroupOptions.isLoading,
    loadingServices: loadingListServices,
  };
}
