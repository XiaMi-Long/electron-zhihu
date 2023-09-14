import axios from 'axios'

// axios.defaults.baseURL = 'https://www.zhihu.com/api/v3/'

// 获取推荐文章
export const recommend = function (params) {
  return axios({
    method: 'get',
    url: '/api/zhihu/feed/topstory/recommend',
    params
  })
}
