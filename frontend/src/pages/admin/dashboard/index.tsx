import React from "react";
import { Plus } from "lucide-react";
import { Button, cn } from "@waitingonalice/design-system";
import { AdminLayout, Link } from "@/components";
import { clientRoutes } from "@/constants";
import { GroupDialog } from "./components/Dialog";
import { SelfHostForm } from "./components/SelfHostForm";
import { useServices } from "./hooks/useServices";

function AdminDashboard() {
  const {
    data,
    openDialog,
    loadingGroup,
    handleDisplayGroupDialog,
    handleGroup,
    handleAddService,
    handleCloseServiceDialog,
  } = useServices();

  return (
    <AdminLayout>
      <AdminLayout.Header />
      <AdminLayout.Content>
        {openDialog.group.show && (
          <GroupDialog
            data={openDialog.group.data}
            open={openDialog.group.show}
            loading={loadingGroup}
            onClose={handleDisplayGroupDialog}
            onAdd={handleGroup}
          />
        )}

        <div className={cn("flex flex-col gap-4 mb-4", "md:px-4 md:mb-0")}>
          <Button
            onClick={handleDisplayGroupDialog}
            size="small"
            prefixIcon={<Plus className="h-4 w-4" />}
          >
            Add group
          </Button>

          <Link
            to={clientRoutes.admin.create}
            variant="primary"
            size="small"
            prefixIcon={<Plus className="h-4 w-4" />}
          >
            Add service
          </Link>

          <SelfHostForm
            show={openDialog.service}
            groups={data?.groups}
            onClose={handleCloseServiceDialog}
            onAddService={handleAddService}
          />
        </div>
      </AdminLayout.Content>
    </AdminLayout>
  );
}

export { AdminDashboard };
