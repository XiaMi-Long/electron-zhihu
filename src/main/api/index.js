import { httpRequest } from '../utils/http'

// 获取推荐文章
export const recommend = function (event, params) {
  return httpRequest({
    method: 'GET',
    url: 'https://www.zhihu.com/api/v3/feed/topstory/recommend',
    params
  })
}

// 获取该问题下的回答
export const getArticleDetails = function (event, questionId, params, cookie) {
  return httpRequest({
    method: 'GET',
    url: `https://www.zhihu.com/api/v4/questions/${questionId}/feeds`,
    params,
    cookie
  })
}

// 获取该问题下的回答分页
export const getArticleDetailsByPage = function (event, url, cookie) {
  return httpRequest({
    method: 'GET',
    url,
    cookie
  })
}
