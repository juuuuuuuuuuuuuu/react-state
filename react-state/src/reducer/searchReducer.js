function searchReducer(state, action) {
  switch (action.type) {
    case 'changeInput':
      return { ...state, keyword: action.payload };
    case 'seachInfo':
      return {
        ...state,
        searchInfo: action.payload.searchInfo,
        relationKeyword: action.payload.relationKeyword,
      };
      default:
        return;
  }
}
export default searchReducer;
