import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname.includes('.replit.dev') || hostname.includes('.repl.co')) {
      const parts = hostname.split('.');
      const suffix = parts.slice(1).join('.');
      return `${protocol}//3000-${parts[0]}.${suffix}/api`;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3000/api`;
    }
    
    return `${protocol}//${hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

class PreferencesService {
  constructor() {
    this.storageKey = 'event_preferences_cache';
    this.useBackend = false;
  }

  async checkBackendConnection() {
    try {
      const response = await axios.get(`${API_BASE_URL}/preferences`, { timeout: 1000 });
      this.useBackend = true;
      return true;
    } catch (error) {
      this.useBackend = false;
      return false;
    }
  }

  async getLatestPreferences(userId = 1) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/preferences`, {
          params: { user_id: userId }
        });
        const preferences = response.data.data;

        if (preferences) {
          localStorage.setItem(this.storageKey, JSON.stringify(preferences));
        }

        return preferences;
      } else {
        const cached = localStorage.getItem(this.storageKey);
        return cached ? JSON.parse(cached) : null;
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async getAllPreferences(userId = 1) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/preferences/all`, {
          params: { user_id: userId }
        });
        return response.data.data || [];
      } else {
        const cached = localStorage.getItem(this.storageKey);
        return cached ? [JSON.parse(cached)] : [];
      }
    } catch (error) {
      console.error('Error fetching all preferences:', error);
      return [];
    }
  }

  async savePreferences(preferences, userId = 1) {
    try {
      await this.checkBackendConnection();

      const preferencesData = {
        user_id: userId,
        venue: preferences.venue || '',
        number_of_people: preferences.numberOfPeople || preferences.number_of_people || 0,
        budget: preferences.budget || 0,
        event_date: preferences.eventDate || preferences.event_date || '',
        event_time: preferences.eventTime || preferences.event_time || '',
        event_type: preferences.eventType || preferences.event_type || '',
        event_id: preferences.eventId || preferences.event_id || null
      };

      if (this.useBackend) {
        const response = await axios.post(`${API_BASE_URL}/preferences/save`, preferencesData);
        const savedPreferences = response.data.data;

        localStorage.setItem(this.storageKey, JSON.stringify(savedPreferences));

        return savedPreferences;
      } else {
        const cachedPreferences = {
          ...preferencesData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(cachedPreferences));

        return cachedPreferences;
      }
    } catch (error) {
      console.error('Error saving preferences:', error);

      const cachedPreferences = {
        user_id: userId,
        venue: preferences.venue || '',
        number_of_people: preferences.numberOfPeople || preferences.number_of_people || 0,
        budget: preferences.budget || 0,
        event_date: preferences.eventDate || preferences.event_date || '',
        event_time: preferences.eventTime || preferences.event_time || '',
        event_type: preferences.eventType || preferences.event_type || '',
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(cachedPreferences));

      return cachedPreferences;
    }
  }

  async deletePreferences(id) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        await axios.delete(`${API_BASE_URL}/preferences/${id}`);
      }

      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error deleting preferences:', error);
      throw error;
    }
  }
}

export const preferencesService = new PreferencesService();
