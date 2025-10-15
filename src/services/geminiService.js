import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/gemini';

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
