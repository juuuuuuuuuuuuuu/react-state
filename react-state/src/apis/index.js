import axios from "axios";

export async function fetchSearch(options) {
  const data = await getSearch(options);
  const { activeFilter, pageParam } = options;

  // w추천순 && 1페이지인 경우 && 다른 필터 선택 안된경우(체크해야함) - 연관상품 api 호출
  if (activeFilter.sort === 'weight' && pageParam === 1 && !hasOtherFilter(activeFilter)) {
    const relation = await fetchRelation();
    return { data: data.data.data, relation: relation.data.data }
  }
  return { data: data.data.data };
}

export async function fetchFilter(keyword) {
  const data = await getFilter(keyword);
  return data.data;
}

export async function fetchRelation() {
  const data = await getRelation();
  return data;
}

export async function fetchProduct(page, keyword) {
  const data = await getProduct(page, keyword);
  return data;
}


function getRelation() {
  const data = axios.get('https://wmars-client.wemakeprice.com/search-result/relations?keyword=%ED%85%8C%EC%8A%A4%ED%8A%B8&positions=41,61,81')
  return data;
}

 async function getSearch(options) {
  const { keyword, activeFilter: { price, sort }, pageParam, perPage } = options;

  const data = axios.get(`https://msearch.wemakeprice.com/api/wmpsearch/api/v3.0/wmp-search/search.json?keyword=${keyword}&os=mweb&page=${pageParam}&perPage=${perPage}&isRec=1&_service=5&price=${price}&sort=${sort}`)
  return data;
}

function getFilter(keyword) {
  const data = axios.get(`https://msearch.wemakeprice.com/api/wmpsearch/api/v3.0/wmp-search/filter.json?keyword=${keyword}`)
  return data;
}


function getProduct(page, keyword) {
  const data = axios.get(`https://api-search.wonders.app/api/wmp/product?q=${keyword}&limit=20&svc=mweb&page=${page}`)
  return data;
}

// 기본필터외에 다른 필터를 설정한 경우
function hasOtherFilter(activeFilter) {
  return Object.keys(activeFilter).some(key => {
  return key !== 'sort' && activeFilter[key]
  })
}