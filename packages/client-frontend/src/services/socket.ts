import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    this.socket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message', callback)
    }
  }

  offMessage(callback?: (message: any) => void) {
    if (this.socket) {
      this.socket.off('message', callback)
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
}

export const socketService = new SocketService()

