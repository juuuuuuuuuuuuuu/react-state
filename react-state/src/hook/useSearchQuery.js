import { useEffect, useMemo, useState } from 'react';
import { useQueries } from 'react-query';
import { useDispatch } from 'react-redux';
import { fetchFilter, fetchRelation, fetchSearch } from '../apis';
import activeFilter, { setFilter } from '../store/search';

function useSearchQuery(keyword = '테스트') {
  // 활성화된 필터링 정보
  //  const [activeFilter, setFilter] = useState({});
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);

  const [test, setTest] = useState(0);
  const dispatch = useDispatch();

  // search + relation - 최초, 필터링 누를시
  // search  - 페이징처리
  // filter - 최초에 호출만으로 ( 검색어 바뀌는거 외에는 호출되지 않음)
  const [searchQuery, filterQuery, relationQuery] = useQueries([
    { queryKey: ['search', keyword, page, activeFilter], queryFn: fetchSearch },
    { queryKey: ['relation', keyword, activeFilter], queryFn: fetchRelation },
  ]);

  const deals = useMemo(() => {
    if (!searchQuery.isSuccess) { return; }
    return searchQuery.data.data.data.deals;
  }, [searchQuery]);

  console.log('##da', deals)

  useEffect(() => {
    if (!searchQuery.isSuccess) { return; }
    console.log('%%searchQuery', searchQuery)
    /**
     * @todo 예외처리 및 비즈니스 로직에 맞춰서 작업이 필요함 -- 리스트 api가 최초호출이랑 데이터 구조가 달라 분기처리해야하는 작업이 필요함
     */
    const { pagination, deals, adAiPlus, adTargetClick } = searchQuery.data.data.data;

    setTest(1)
    // 최초 호출할때만 페이지 정보 저장이 필요함
    // setPage(pagination);
    // setList((prev) => [...prev, deals]);
  }, [searchQuery]);


  useEffect(() => {
    // if (searchQuery.isLoading || filterQuery.isLoading) {
    //   return;
    // }

    // // 필터정보 (필터정보 바뀔때만 업데이트 필요 - 키워드 변경되지 않는이상 필요없으)
    // const {
    //   brandFilter,
    //   checkFilter,
    //   eventFilter,
    //   overseasPurchaseFilter,
    //   priceBenefitFilter,
    //   recommendSort,
    //   sort,
    // } = searchQuery.data.data.data;

    // // dispatch 사용하여 업데이트 요청
    // dispatch(
    //   setFilter({
    //     ...filterQuery.data.data.data,
    //     brandFilter,
    //     checkFilter,
    //     eventFilter,
    //     overseasPurchaseFilter,
    //     priceBenefitFilter,
    //     recommendSort,
    //     sort,
    //   })
    // );

  }, [searchQuery, filterQuery]);

  const totalPage = useMemo(() => {
    if (searchQuery.isLoading) {
      return;
    }
    return searchQuery.data.data.data.pagination.totalPage;
  }, [searchQuery]);

  // 다음 페이지 이동시
  const addNextPage = () => {
    // nextPage에 맞게 세팅
    setPage((prev) => prev + 1);
  };

  return {
    list,
    addNextPage,
  };
}
export default useSearchQuery;

// 느낀점 쿼리 개편함 ㅋㅋㅋ
