import useSWRInfinite from 'swr/infinite';

export function useInfiniteScroll<T>({
  fetcher,
  pageSize,
}: {
  fetcher: (page: number, pageSize: number) => Promise<{data: T[]; meta: any}>;
  pageSize: number;
}) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) {
      return null;
    }
    return ['getInfiniteData', pageIndex + 1, pageSize];
  };

  const {data, error, size, setSize} = useSWRInfinite(
    getKey,
    ([_, page, pageSize]) => fetcher(Number(page), Number(pageSize)),
    {revalidateFirstPage: false},
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < pageSize);

  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const flatData = data?.flatMap(page => page.data) || [];

  return {
    data: flatData,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    error,
  };
}
