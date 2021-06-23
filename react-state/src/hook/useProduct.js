import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { fetchProduct } from '../apis';

/**
 * 제휴 쇼핑몰
 */
function useProduct(activeFilter, keyword, searchInfo, status) {
  const {
    fetchNextPage,
    data,
  } = useInfiniteQuery(['product', keyword, activeFilter], ({ pageParam = 1 }) => {
    return fetchProduct(pageParam, keyword, activeFilter)
  }, {
    cacheTime: 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage) => {
      if (!lastPage) { return 1; }

      const pagination = lastPage.data.pagination;
      return pagination.page + 1;
    },
    // 다른 필터 설정한 경우 api호출하지 않음
    enabled: keyword !== '' && !hasOtherFilter(activeFilter) && !checkSearchType(searchInfo) && status !== 'loading'
  });

  const productList = useMemo(() => {
    // 기본필터 외 다른 필터 설정한 경우
    if (!data || !data?.pages[0]) { return []; }

    return data.pages.reduce((acc, cur) => acc.concat(cur.data.data), []);
  }, [data]);

  return {
    fetchNextPage,
    productList,
  };
}
export default useProduct;

// 다른 필터를 설정한 경우
function hasOtherFilter(activeFilter) {
  return Object.keys(activeFilter).some(key => {
  return key !== 'sort' && activeFilter[key]
  })
}

function checkSearchType(searchInfo) {
  return ['ID', 'MD', 'SELLER', 'CID'].indexOf(searchInfo?.searchType) > -1;
}