import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchFilter } from '../apis';

// 필터 api
export const getDetailFilter = createAsyncThunk(
  '/api/filter',
  async ({ keyword }) => {
    const response = await fetchFilter(keyword);
    return response['data'];
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    keyword: '테스트',
    relationKeyword: [],
    searchInfo: {},
    activeFilter: {
      sort: 'weight',
      price: '',
    },
    // 페이지에서 보이는 필터
    searchFilter: {},
    // 숨겨진 필터
    detailFilter: {},
  },
  reducers: {
    // 키워드 변경시
    changeInput: (state, { payload }) => {
      state.keyword = payload;
    },
    resetFilter: (state) => {
      state.activeFilter = { sort: 'weight' };
      state.searchFilter = {};
      state.detailFilter = {};
    },
    // 필터변경시
    changeFilter: (state, { payload }) => {
      state.activeFilter[payload.type] = payload.value;
    },
    // 페이지에서 보이는 필터
    setSearchFilter: (state, { payload }) => {
      state.searchFilter = payload;
    },
    // search api 호출 후 정보 업데이트
    setSearchData: (state, { payload }) => {
      state.searchInfo = payload.searchInfo;
      state.relationKeyword = payload.relationKeyword;
    },
  },
  extraReducers: {
    [getDetailFilter.fulfilled]: (state, { payload }) => {
      state.detailFilter = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFilter, changeFilter, setSearchFilter, changeInput, setDetailFilter, resetFilter, setSearchData } =
  searchSlice.actions;

export const activeFilter = (state) => state.search.activeFilter;

export default searchSlice.reducer;
