import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname.includes('.replit.dev') || hostname.includes('.repl.co')) {
      const parts = hostname.split('.');
      const suffix = parts.slice(1).join('.');
      return `${protocol}//3000-${parts[0]}.${suffix}/api/gemini`;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3000/api/gemini`;
    }
    
    return `${protocol}//${hostname}:3000/api/gemini`;
  }
  return 'http://localhost:3000/api/gemini';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Generate Event Plan
 */
export const generateEventPlan = async (description, language = 'english') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-event-plan`, {
      description,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error generating event plan:', error);
    throw error;
  }
};

/**
 * Generate Poster Content
 */
export const generatePosterContent = async (description, language = 'english') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-poster`, {
      description,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error generating poster:', error);
    throw error;
  }
};

/**
 * Generate Email Draft
 */
export const generateEmailDraft = async (description, language = 'english', recipients = 'guests') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-email`, {
      description,
      language,
      recipients
    });
    return response.data;
  } catch (error) {
    console.error('Error generating email:', error);
    throw error;
  }
};

/**
 * Generate Instagram Caption
 */
export const generateInstagramCaption = async (description, language = 'english', style = 'engaging') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-caption`, {
      description,
      language,
      style
    });
    return response.data;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
};

/**
 * Generate All Marketing Materials
 */
export const generateAllMaterials = async (description, language = 'english') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-all`, {
      description,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error generating all materials:', error);
    throw error;
  }
};
