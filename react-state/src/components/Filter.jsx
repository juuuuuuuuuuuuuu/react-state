import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeFilter, getDetailFilter } from "../store/search";

function Filter() {
  const dispatch = useDispatch();

  const { detailFilter, searchFilter, keyword } = useSelector(state => state.search)

  const handleFilter = (e, type) => {
    dispatch(changeFilter({ type, value: e.target.value }));
  }

  useEffect(() => {
    // 키워드 바뀔땨마다 상세필터 호출
    dispatch(getDetailFilter({ keyword }))
  }, [keyword]);

  return (
    <div>
      <select onChange={(e) => handleFilter(e, 'sort')}>
        {searchFilter?.sort?.map(value => (<option key={value.type} value={value.type}>{value.type}</option>))}
      </select>

      <select onChange={(e) => handleFilter(e, 'price')}>
        {detailFilter?.price?.map(value => (<option key={value.type} value={value.type}>{value.type}</option>))}
      </select>

      <button onClick={handleFilter}>필터변경</button>
    </div>
  )
}
export default Filter;