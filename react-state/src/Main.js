import { useDispatch } from 'react-redux';
import { resetFilter, changeInput } from './store/search';
import List from './components/List';
import Filter from './components/Filter';
import { createContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


function Main() {
  const dispatch = useDispatch();

  const location = useLocation();

  const [input, setInput] = useState('');

  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const onClickSearch = () => {
    dispatch(resetFilter());
    dispatch(changeInput(input));
  };

  return (
    <div>
      <Link to={'/context'}>이동하기</Link>
      <input placeholder={'검색어 입력해줘'} onChange={onChangeInput} />
      <button onClick={onClickSearch}>검색</button>
      <Filter />
      <List />
    </div>
  );
}
export default Main;
