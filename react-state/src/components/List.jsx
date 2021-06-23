import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProduct from "../hook/useProduct";
import useSearch from "../hook/useSearch";
// import { MainContext } from "../Main";
import { setSearchFilter, setSearchData } from "../store/search";

function List() {
  const dispatch = useDispatch();

  // const value = useContext(MainContext);
  // console.log('****value', value)
  const { activeFilter, keyword, relationKeyword } = useSelector(state => state.search)

  // 검색 결과
  const {
    searchList,
    fetchNextPage: handleNext,
    status,
    searchInfo,
  } = useSearch({
    activeFilter,
    keyword,
    onSuccessCallback: (data) => {
      const {
        brandFilter,
        checkFilter,
        eventFilter,
        overseasPurchaseFilter,
        previousSearchInfo,
        priceBenefitFilter,
        recommendSort,
        relationKeyword,
        searchInfo,
        sort,
      } = data.pages[0].data;

      // 필터 데이터 업데이트
      dispatch(setSearchFilter({
        brandFilter,
        checkFilter,
        eventFilter,
        overseasPurchaseFilter,
        priceBenefitFilter,
        recommendSort,
        sort
      }));

      // 검색어, 연관 검색어 업데이트
      dispatch(setSearchData({
        searchInfo,
        relationKeyword,
      }));
    },
  });

  // 제휴 상품정보
  // searchInfo 데이터 참조시 store관리하는 값 참조하면 비동기이슈로 인해
  const { productList, fetchNextPage } = useProduct(activeFilter, keyword, searchInfo, status);

  console.log('제휴상품', productList)
  console.log('검색결과', searchList)

  const searchCount = searchList?.pages.reduce((acc, cur) => {

    acc += cur.data?.deals?.length;
    return acc;
  }, 0);

  return (
    <div>
      <div>검색리스트 {searchCount}</div>
      <div>제휴상품 {productList.length}</div>
      {relationKeyword?.map((keyword, i) => <span key={i} style={{ marginRight: '10px'}}>{keyword}</span>)}
      <button onClick={fetchNextPage}>다음페이지</button>
      <button onClick={handleNext}>검색 리스트 </button>
    </div>
  )
}
export default List;