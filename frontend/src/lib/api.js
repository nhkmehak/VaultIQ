const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const api = {
  // Auth
  signup: async (data) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getCurrentUser: async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  updateRiskAppetite: async (token, risk_appetite) => {
    const res = await fetch(`${API_URL}/auth/risk-appetite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ risk_appetite })
    });
    return res.json();
  },

  // Products
  getProducts: async (token, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/products?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getProduct: async (token, id) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getRecommendations: async (token) => {
    const res = await fetch(`${API_URL}/products/recommendations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Investments
  createInvestment: async (token, data) => {
    const res = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getPortfolio: async (token) => {
    const res = await fetch(`${API_URL}/investments/portfolio`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getPortfolioInsights: async (token) => {
    const res = await fetch(`${API_URL}/investments/insights`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Logs
  getLogs: async (token, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/logs?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getErrorSummary: async (token) => {
    const res = await fetch(`${API_URL}/logs/error-summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};