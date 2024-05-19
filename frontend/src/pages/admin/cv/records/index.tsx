import React from "react";
import { useRouter } from "next/router";
import { AdminLayout, Grid } from "@/components";
import { clientRoutes } from "@/constants";

function CV() {
  const router = useRouter();
  return (
    <AdminLayout
      ctxButtons={[
        {
          children: "Create",
          onClick: () => router.push(clientRoutes.admin.cv.create),
        },
      ]}
    >
      <AdminLayout.Content>
        <Grid title="Resumes">hello</Grid>
      </AdminLayout.Content>
    </AdminLayout>
  );
}

export { CV };
