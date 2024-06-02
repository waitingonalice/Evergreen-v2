import React from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { nanoid } from "nanoid";
import {
  Button,
  EmptyTable,
  Pagination,
  SpinnerV2,
  Table,
  Text,
  ToastContextBaseProps,
  useToast,
} from "@waitingonalice/design-system";
import { Grid, Link } from "@/components";
import { BucketTypeEnum, StatusEnum, clientRoutes } from "@/constants";
import { RecordsType } from "@/types/records";
import { formatBytes, toDDMMMYYYY } from "@/utils";
import { FilterInput, useDownloadRecord } from "../loaders/records";

export const columns = [
  {
    name: "File name",
    className: "w-1/4",
  },

  {
    name: "Status",
    className: "w-[100px]",
  },
  {
    name: "Created time",
  },
  {
    name: "Record type",
  },
  {
    name: "Actions",
  },
];

const statusIconMap: Record<StatusEnum, React.ReactNode> = {
  [StatusEnum.Success]: (
    <CheckCircleIcon className="w-6 h-6 text-success-main" />
  ),
  [StatusEnum.Pending]: (
    <SpinnerV2 className="w-6 h-6 text-warning-main animate-spin" />
  ),

  [StatusEnum.Failed]: <XCircleIcon className="w-6 h-6 text-error-main" />,
};

const recordTypeMap = {
  [BucketTypeEnum.Resume]: "Resume",
};
interface RecordsTableProps {
  records?: RecordsType[];
  limit?: number;
  index?: number;
  totalCount?: number;
  onFilter: (arg: FilterInput) => void;
}
function RecordsTable({
  records,
  limit,
  index,
  totalCount,
  onFilter,
}: RecordsTableProps) {
  const { renderToast } = useToast();
  const [downloadRecord] = useDownloadRecord();

  const handlePagination = (index: number) => {
    onFilter({ index, limit });
  };
  const handleDownloadRecord = async (
    bucket: BucketTypeEnum,
    filename: string,
  ) => {
    const toastProps: ToastContextBaseProps = {
      title: "",
      show: true,
      key: nanoid(),
      variant: "success",
      duration: 3000,
    };
    try {
      renderToast({
        ...toastProps,
        title: "Your download is starting",
        description: "Please wait a moment",
      });
      const { result } = await downloadRecord({ filename, bucket });
      window.open(result, "_blank");
    } catch (e) {
      console.error(e);
      renderToast({
        ...toastProps,
        title: "Download failed",
        description: "Please try again later",
        variant: "error",
      });
    }
  };

  return (
    <>
      {!records || records.length === 0 ? (
        <EmptyTable columns={columns} />
      ) : (
        <>
          <Table>
            <Table.Header>
              {columns.map((col) => (
                <Table.Thead key={col.name} className={col.className}>
                  {col.name}
                </Table.Thead>
              ))}
            </Table.Header>
            <Table.Body>
              {records?.map((data) => (
                <Table.Row key={data.id}>
                  <Table.Cell>
                    <Text
                      className="text-secondary-1 whitespace-nowrap"
                      type="caption"
                    >
                      {data.filename || "N/A"}
                    </Text>
                    {data.filename && (
                      <Text className="text-secondary-4" type="caption">
                        {formatBytes(data.filesize)}
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>{statusIconMap[data.status]}</Table.Cell>
                  <Table.Cell>
                    <Text className="text-secondary-1" type="caption">
                      {toDDMMMYYYY(data.created_at) || "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-secondary-1" type="caption">
                      {recordTypeMap[data.type] || "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="flex gap-x-4">
                    <Button
                      onClick={() =>
                        handleDownloadRecord(data.type, data.filename)
                      }
                      disabled={!data.filename}
                      size="small"
                    >
                      Download
                    </Button>
                    {data.type === BucketTypeEnum.Resume && (
                      <Link
                        variant="secondary"
                        size="small"
                        to={clientRoutes.admin.cv.edit(data.id)}
                      >
                        Edit
                      </Link>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {limit && index && totalCount && (
            <Grid className="px-4 py-1">
              <Pagination
                className="mb-2"
                currentIndex={index}
                currentLimit={limit}
                totalCount={totalCount}
                onClick={handlePagination}
              />
            </Grid>
          )}
        </>
      )}
    </>
  );
}

export { RecordsTable };
