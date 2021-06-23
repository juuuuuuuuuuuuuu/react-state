import { useContext, useEffect } from "react";
import { fetchFilter } from "../apis";
import { MainContext } from "../Main2";

function Filter2() {
  const { search: { searchState }, filter: { filterState, filterDispatch } } = useContext(MainContext);

  const handleFilter = (e, filter) => {
    filterDispatch({
      type: 'changeFilter',
      payload: { [filter]: e.target.value }
    })
  }

  useEffect(() => {
    if (!searchState.keyword) { return; }

    const getFilter = async () => {
      // 키워드 바뀔땨마다 상세필터 호출
      const response = await fetchFilter(searchState.keyword)
      filterDispatch({
        type: 'setDetailFilter',
        payload: response.data
      })
    }
    getFilter();

  }, [searchState.keyword]);

  return (
    <div>
      <select onChange={(e) => handleFilter(e, 'sort')}>
        {filterState.searchFilter?.sort?.map(value => (<option key={value.type} value={value.type}>{value.type}</option>))}
      </select>

      <select onChange={(e) => handleFilter(e, 'price')}>
        {filterState.detailFilter?.price?.map(value => (<option key={value.type} value={value.type}>{value.type}</option>))}
      </select>

      <button onClick={handleFilter}>필터변경</button>
    </div>
  )
}
export default Filter2;