import { httpRequest } from '../utils/http'

// 获取推荐文章
export const recommend = function (event, params) {
  return httpRequest('GET', '/feed/topstory/recommend', params)
}

// 获取该问题下的回答
export const getArticleDetails = function (event, questionId, params, cookie) {
  return httpRequest(
    'GET',
    `/questions/${questionId}/feeds`,
    params,
    null,
    'https://www.zhihu.com/api/v4',
    cookie
  )
}
