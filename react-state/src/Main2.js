import { useDispatch } from 'react-redux';
import { resetFilter, changeInput } from './store/search';
import List2 from './components/List2';
import Filter2 from './components/Filter2';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import searchReducer from './reducer/searchReducer';
import filterReducer from './reducer/filterReducer';

export const MainContext = createContext(null);

export const initialState = {
  searchFilter: {},
    detailFilter: {},
    activeFilter: {
      sort: 'weight',
    },
}

function Main2() {
  const dispatch = useDispatch();

  const location = useLocation();

  const [input, setInput] = useState('');

  const [searchState, searchDispatch] = useReducer(searchReducer, {
    keyword: '',
    relationKeyword: [],
    searchInfo: {},
  });

  const [filterState, filterDispatch] = useReducer(filterReducer, initialState);

  useEffect(() => {
    searchDispatch({
      type: 'changeInput',
      payload: '테스트'
    })
  }, [])

  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const onClickSearch = () => {
    // 키워드 변경
    searchDispatch({
      type: 'changeInput',
      payload: input,
    })
    // 필터 초기화
    filterDispatch({
      type: 'resetFilter'
    })
  };

  return (
    <div>
      <MainContext.Provider
        value={{
          search: { searchState, searchDispatch },
          filter: { filterState, filterDispatch }
        }}
      >
        <input placeholder={'검색어 입력해줘'} onChange={onChangeInput} />
        <button onClick={onClickSearch}>검색</button>
        <Filter2 />
        <List2 />
      </MainContext.Provider>
    </div>
  );
}
export default Main2;
