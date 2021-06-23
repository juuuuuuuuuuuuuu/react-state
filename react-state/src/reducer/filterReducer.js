import { initialState } from '../Main2';

function filterReducer(state, action) {
  switch (action.type) {
    case 'setSearchFilter':
      return {
        ...state,
        searchFilter: action.payload,
      };
    case 'setDetailFilter':
      return {
        ...state,
        detailFilter: action.payload,
      };
    case 'changeFilter':
      const payload = action.payload;

      return {
        ...state,
        activeFilter: { ...payload },
      }
    case 'resetFilter':
      return {
        ...initialState,
      }

    default:
      return;
  }
}
export default filterReducer;
