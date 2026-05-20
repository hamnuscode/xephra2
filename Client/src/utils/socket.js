import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
        upgrade: true,
      });

      this.socket.on('connect', () => {
        if (userId) {
          this.socket.emit('join', userId);
        }
      });

      this.socket.on('disconnect', () => {
        // Handle disconnect
      });

      this.socket.on('connect_error', (error) => {
        // Handle connection error
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Helper method to join user room
  joinUserRoom(userId) {
    if (this.socket && userId) {
      this.socket.emit('join', userId);
    }
  }

  // Helper method to leave user room
  leaveUserRoom(userId) {
    if (this.socket && userId) {
      this.socket.emit('leave', userId);
    }
  }
}

export default new SocketService();
