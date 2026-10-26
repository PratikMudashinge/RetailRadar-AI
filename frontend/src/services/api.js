const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      const responseData = await response.json();
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (responseData && typeof responseData === 'object') {
          errorMessage = responseData.message || responseData.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return responseData;
    } catch (err) {
      if (err instanceof SyntaxError || (err.message && (err.message.includes('JSON') || err.message.includes('Unexpected')))) {
        throw new Error('Invalid JSON response from server', { cause: err });
      }
      throw err;
    }
  } else {
    let responseData = null;
    try {
      responseData = await response.text();
    } catch {
      // Ignore text parsing errors
    }
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      if (typeof responseData === 'string' && responseData) {
        errorMessage = responseData;
      }
      throw new Error(errorMessage);
    }
    return responseData;
  }
}

async function handleRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    return handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.', { cause: error });
    }
    throw error;
  }
}

export const api = {
  async health() {
    return handleRequest(`${API_BASE_URL}/api/health`);
  },

  async getLocations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/api/locations?${queryString}` : `${API_BASE_URL}/api/locations`;
    return handleRequest(url);
  },

  async createLocation(locationData) {
    return handleRequest(`${API_BASE_URL}/api/locations`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },

  async runAnalysis(analysisData) {
    return handleRequest(`${API_BASE_URL}/api/analysis/run`, {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
  },

  async getAnalysis(id) {
    return handleRequest(`${API_BASE_URL}/api/analysis/${id}`);
  },

  async compareAnalysis(comparisonData) {
    return handleRequest(`${API_BASE_URL}/api/analysis/compare`, {
      method: 'POST',
      body: JSON.stringify(comparisonData),
    });
  },

  async simulate(whatIfData) {
    return handleRequest(`${API_BASE_URL}/api/analysis/simulate`, {
      method: 'POST',
      body: JSON.stringify(whatIfData),
    });
  },

  async getReports() {
    return handleRequest(`${API_BASE_URL}/api/reports`);
  },
};

export { API_BASE_URL };
