import React from "react";
import { TableSkeleton } from "@waitingonalice/design-system";
import { AdminLayout } from "@/components";
import { RecordsTable, columns } from "./components/RecordsTable";
import { useFetchRecords } from "./hooks/useRecords";

function Records() {
  const { handleFilter, data, loading, filter } = useFetchRecords();

  return (
    <AdminLayout>
      <AdminLayout.Header />
      <AdminLayout.Content>
        {loading ? (
          <TableSkeleton columns={columns} rows={10} />
        ) : (
          <RecordsTable
            records={data?.result}
            totalCount={data?.total_count}
            limit={filter?.limit}
            index={filter?.index}
            onFilter={handleFilter}
          />
        )}
      </AdminLayout.Content>
    </AdminLayout>
  );
}

export { Records };
