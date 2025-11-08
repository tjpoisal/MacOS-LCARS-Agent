import io from 'socket.io-client';

export interface AgentResponse {
  text: string;
  audio?: string;
  actions?: Array<{
    type: string;
    content: string;
    result?: string;
  }>;
}

export interface HealthStatus {
  status: 'operational' | 'offline';
  system: string;
  version: string;
}

class BackendServiceClass {
  private socket: any = null;
  private connected = false;
  private baseUrl = 'http://localhost:5000';

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Initialize socket connection
    this.socket = io(this.baseUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to LCARS Agent backend');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from LCARS Agent backend');
      this.connected = false;
    });

    this.socket.on('error', (error: any) => {
      console.error('Backend socket error:', error);
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      const checkConnection = setInterval(() => {
        if (this.connected) {
          clearInterval(checkConnection);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkConnection);
        if (!this.connected) {
          reject(new Error('Failed to connect to backend'));
        }
      }, 5000);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Failed to reach backend service');
    }
  }

  async processVoiceInput(audioData: string): Promise<AgentResponse> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Not connected to backend'));
        return;
      }

      this.socket.emit('voice-input', { audio: audioData });

      const responseHandler = (data: AgentResponse) => {
        this.socket.off('voice-response', responseHandler);
        this.socket.off('error', errorHandler);
        resolve(data);
      };

      const errorHandler = (data: { message: string }) => {
        this.socket.off('voice-response', responseHandler);
        this.socket.off('error', errorHandler);
        reject(new Error(data.message));
      };

      this.socket.on('voice-response', responseHandler);
      this.socket.on('error', errorHandler);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.socket.off('voice-response', responseHandler);
        this.socket.off('error', errorHandler);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }

  async processTextQuery(query: string): Promise<AgentResponse> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Not connected to backend'));
        return;
      }

      this.socket.emit('text-query', { query });

      const responseHandler = (data: AgentResponse) => {
        this.socket.off('response', responseHandler);
        this.socket.off('error', errorHandler);
        resolve(data);
      };

      const errorHandler = (data: { message: string }) => {
        this.socket.off('response', responseHandler);
        this.socket.off('error', errorHandler);
        reject(new Error(data.message));
      };

      this.socket.on('response', responseHandler);
      this.socket.on('error', errorHandler);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.socket.off('response', responseHandler);
        this.socket.off('error', errorHandler);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }

  async executeTask(task: string): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to execute task: ${error}`);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const BackendService = new BackendServiceClass();
