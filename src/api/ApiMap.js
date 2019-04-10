import { callApi } from './ApiConstrant';
const METHOD = {
  GET: 'GET',
  POST: 'POST'
}
export const mapApi = ({ lat, lng, keyword, danhmucID }) => {
    // const config = {
    //     headers: { 'Content-Type': 'application/json' },
    // }
    let url = `Mobile_KD_GiayPhepKinhDoanh_ListBasic?${keyword ? `timGPKD=${keyword}` : 'timGPKD='}&PageIndex=1&PageSize=20&Orderby=0&Radius=10&Lat=${lat}&Long=${lng}`;
    if (danhmucID) {
      url = url + `&DanhMucId=${danhmucID}`;
    }

    return callApi[METHOD.GET](url);
}

export const categoryApi = () => {
  return callApi[METHOD.GET]('Mobile_DanhMuc_KinhDoanh_Getall');
}
