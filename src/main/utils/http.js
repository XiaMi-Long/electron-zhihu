const { net, netLog, app } = require('electron')
const baseUrl = 'https://www.zhihu.com/api/v3'

// 开始记录网络日志
async function startLogging() {
  const logPath = app.getPath('logs') + '/net-log.json'
  await netLog.startLogging(logPath)
  console.log('Started logging to', logPath)
}

// 停止记录网络日志
async function stopLogging() {
  const path = await netLog.stopLogging()
  console.log('Stopped logging to', path)
}

// 发送 HTTP 请求
function httpRequest(method, url, params = {}, data = null) {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method,
      url: baseUrl + url + '?' + new URLSearchParams(params).toString()
    })

    console.log(baseUrl + url + '&' + new URLSearchParams(params).toString())

    request.on('response', (response) => {
      let body = ''
      response.on('data', (chunk) => {
        body += chunk
      })
      response.on('end', () => {
        resolve(body)
      })
    })

    request.on('error', (error) => {
      reject(error)
    })

    if (method === 'POST' && data) {
      request.setHeader('Content-Type', 'application/json')
      request.write(JSON.stringify(data))
    }

    request.end()
  })
}

export { httpRequest, stopLogging, startLogging }
