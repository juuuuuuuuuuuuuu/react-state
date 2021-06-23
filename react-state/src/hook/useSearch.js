// search가 호출되는 조건

// keyword변경시에

// 필터 선택시에 재호출

// 다음 페이지 호출시

// 받은 데이터중에 aiplus가 있으면 relations 호출해서 머지하기

import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { fetchSearch } from '../apis';

function useSearch({ keyword, activeFilter, onSuccessCallback }) {
  const { data, fetchNextPage, status, isError, ...other } = useInfiniteQuery(
    ['search', keyword, activeFilter],
    ({ pageParam = 1, perPage= 100}) => {
      if (pageParam > 1) {
        perPage = 20;
      }
      return fetchSearch({ keyword, activeFilter, pageParam, perPage })
    },
    {
      cacheTime: 0,
      staleTime: Infinity,
      refetchOnMount: false,
      enabled: keyword !== '',
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.data.pagination;

        if (pagination.perPage === 100) {
          return 6;
        }

        return pagination.page + 1;
      },
      onSuccess: (data) => onSuccessCallback(data),
    }
  );

  const searchList = useMemo(() => {
    // 비즈니스 로직에 맞게 데이터 세팅하기
    return data;
  }, [data]);

  return {
    searchList,
    searchInfo: data?.pages[0].data.searchInfo,
    fetchNextPage,
    isError,
    status,
    ...other,
  };
}
export default useSearch;
