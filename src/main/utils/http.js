const { net, netLog, app } = require('electron')

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
function httpRequest(config) {
  return new Promise((resolve, reject) => {
    const url = config.url
    const method = config.method
    const params = config?.params
    const data = config?.data
    const cookie = config?.cookie

    const request = net.request({
      method,
      url: params ? url + '?' + new URLSearchParams(params).toString() : url
    })

    console.log(url + '?' + new URLSearchParams(params).toString())

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

    if (cookie) {
      request.setHeader('Cookie', cookie)
    }

    if (method === 'POST' && data) {
      request.setHeader('Content-Type', 'application/json')
      request.write(JSON.stringify(data))
    }

    request.end()
  })
}

export { httpRequest, stopLogging, startLogging }
