const BASE_URL = 'http://localhost:3001/api';

export const api = {
    post: async (endpoint, data, token) => {
        const isFormData = data instanceof FormData;
        const headers = {};
        if (!isFormData) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: isFormData ? data : JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Request failed');
            return result;
        } catch (error) {
            throw error;
        }
    },

    get: async (endpoint, token) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Request failed');
            return result;
        } catch (error) {
            throw error;
        }
    }
};
