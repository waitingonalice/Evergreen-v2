import { useState } from "react";

export const useSection = <T>(arg: T[]) => {
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState<{
    index: number;
    data: T;
  } | null>(null);

  const handleEdit = (index: number) => {
    setData({
      index,
      data: arg[index],
    });
    setShowDialog(true);
  };

  const handleModal = () => {
    setShowDialog((prev) => {
      if (prev === false) setData(null);
      return !prev;
    });
  };

  const handleRemove = (index: number) => {
    const updateData = [...arg];
    updateData.splice(index, 1);
    setData(null);
    return updateData;
  };

  const handleEditCommit = (val: T) => {
    const clone = [...arg];
    clone.splice(data?.index ?? 0, 1, val);
    return clone;
  };

  return {
    data,
    showDialog,
    handleEdit,
    handleEditCommit,
    handleModal,
    handleRemove,
  };
};
