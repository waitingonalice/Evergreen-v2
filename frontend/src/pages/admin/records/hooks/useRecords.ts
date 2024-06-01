import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePoll } from "@/hooks";
import { useUrlParams } from "@/hooks/useUrlParams";
import {
  DEFAULT_PAGINATION,
  FilterInput,
  ListRecordInput,
  useListRecords,
} from "../loaders/records";

export const useFetchRecords = () => {
  const router = useRouter();
  const [filterRecords, setFilterRecords] = useState<ListRecordInput>();
  const [listFileRecords, listRecordsOptions] = useListRecords();
  const urlHandler = useUrlParams();

  const { start, stop } = usePoll({ interval: 10e3 });

  const handleFilter = (input: FilterInput) => {
    urlHandler.updateUrl(input);
  };

  const fetchRecords = (arg: typeof filterRecords) => {
    listFileRecords(arg).catch(console.error);
  };

  useEffect(() => {
    const input = router.query as unknown as ListRecordInput;
    if (
      Object.keys(input).length === 0 ||
      input.index === undefined ||
      input.limit === undefined
    ) {
      urlHandler.updateUrl(DEFAULT_PAGINATION);
      return;
    }
    stop();
    setFilterRecords(input);
    fetchRecords(input);
    start(() => fetchRecords(input));
  }, [router.query]);

  return {
    data: listRecordsOptions.data,
    loading: listRecordsOptions.isLoading,
    filter: filterRecords,
    handleFilter,
  };
};
