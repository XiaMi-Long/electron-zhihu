import { httpRequest } from '../utils/http'

// 获取推荐文章
export const recommend = function (event, params) {
  return httpRequest('GET', '/feed/topstory/recommend', params)
}
