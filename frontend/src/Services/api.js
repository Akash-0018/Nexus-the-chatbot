const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async uploadFile(file, sessionId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (sessionId) {
        formData.append('session_id', sessionId);
      }

      console.log('Uploading file:', file.name, 'Session ID:', sessionId);

      // Use API_BASE_URL for the correct endpoint
      console.log('Sending request to:', `${API_BASE_URL}/files/upload`);
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Don't set Content-Type - let browser handle it for FormData
      });
      
      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }

  async sendMessage(message, sessionId, fileContent = null) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
        file_content: fileContent
      }),
    });
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async createNewSession() {
    return this.request('/new-session', { method: 'POST' });
  }

  async clearSession(sessionId) {
    return this.request('/clear-session', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getChatHistory() {
    return this.request('/history', {
      method: 'GET'
    });
  }
}

export default new ApiService();
 