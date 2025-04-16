export default class SocketService {
  /**
   * 单例
   */
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  // 存储回调函数
  callBackMapping = {}

  // 标识是否连接成功
  connected = false

  // 记录重试的次数
  sendRetryCount = 0

  // 重新连接尝试的次数
  connectRetryCount = 0

  //  定义连接服务器的方法
  connect() {
    if (!window.WebSocket) {
      console.warn('当前浏览器不支持WebSocket')
      return
    }
    if (this.connected) {
      console.warn('WebSocket已连接')
      return
    }
    
    try {
      this.ws = new WebSocket('ws://localhost:9998')
      this.connected = false
      this.connectRetryCount = 0
      
      this.ws.onopen = () => {
        console.log('WebSocket连接成功')
        this.connected = true
        this.connectRetryCount = 0
      }
      
      this.ws.onclose = () => {
        console.warn('WebSocket连接断开')
        this.connected = false
        this.connectRetryCount++
        if (this.connectRetryCount <= 3) {
          setTimeout(() => {
            this.connect()
          }, 500 * this.connectRetryCount)
        }
      }
      
      this.ws.onerror = () => {
        console.error('WebSocket连接错误')
        this.connected = false
        this.connectRetryCount++
      }
      
      this.ws.onmessage = msg => {
        const recvData = JSON.parse(msg.data)
        const socketType = recvData.socketType
        if (this.callBackMapping[socketType]) {
          const action = recvData.action
          if (action === 'getData') {
            const realData = JSON.parse(recvData.data)
            this.callBackMapping[socketType].call(this, realData)
          } else if (action === 'fullScreen') {
            this.callBackMapping[socketType].call(this, recvData)
          } else if (action === 'themeChange') {
            this.callBackMapping[socketType].call(this, recvData)
          }
        }
      }
    } catch (error) {
      console.warn('WebSocket连接失败，使用模拟数据')
      this.connected = false
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消某一个回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      if (this.sendRetryCount <= 3) {
        setTimeout(() => {
          this.send(data)
        }, 500 * this.sendRetryCount)
      }
    }
  }
}
