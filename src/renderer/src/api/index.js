import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5172'

// 获取推荐文章
export const recommend = function (params) {
  return axios({
    method: 'get',
    url: 'feed/topstory/recommend',
    params
  })
}
