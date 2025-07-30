const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async authenticate(caseNumber, accessCode) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_number: caseNumber,
        access_code: accessCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }

    return response.json();
  }

  async getCaseDetails(caseNumber) {
    const response = await fetch(`${API_BASE_URL}/case/${caseNumber}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch case details');
    }

    return response.json();
  }

  async getCaseTimeline(caseNumber) {
    const response = await fetch(`${API_BASE_URL}/case/${caseNumber}/timeline`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch case timeline');
    }

    return response.json();
  }

  async getCaseDocuments(caseNumber) {
    const response = await fetch(`${API_BASE_URL}/case/${caseNumber}/documents`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch case documents');
    }

    return response.json();
  }

  async updateCaseStatus(caseNumber, statusData) {
    const response = await fetch(`${API_BASE_URL}/case/${caseNumber}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update case status');
    }

    return response.json();
  }
}

export default new ApiService();

