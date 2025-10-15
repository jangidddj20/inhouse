const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini 2.5 Flash model (stable version)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Generate Event Plan using Gemini AI
 */
exports.generateEventPlan = async (req, res) => {
  try {
    const { description, language = 'english' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Event description is required'
      });
    }

    const prompt = `You are an expert event planner. Based on the following event description, create a comprehensive event plan.

Event Description: ${description}
Language: ${language}

Please provide a detailed event plan including:
1. Event Overview
2. Target Audience
3. Venue Requirements
4. Timeline/Schedule
5. Key Activities
6. Required Resources
7. Budget Considerations
8. Success Metrics

${language.toLowerCase() === 'hindi' ? 'Please respond in Hindi (Devanagari script).' : 'Please respond in English.'}

Format the response in a clear, structured manner.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        eventPlan: text,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating event plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate event plan',
      error: error.message
    });
  }
};

/**
 * Generate Poster Content using Gemini AI
 */
exports.generatePosterContent = async (req, res) => {
  try {
    const { description, language = 'english' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Event description is required'
      });
    }

    const prompt = `You are a creative designer. Based on the following event description, create compelling poster content.

Event Description: ${description}
Language: ${language}

Please provide:
1. Main Headline (catchy and attention-grabbing)
2. Tagline/Subtitle
3. Key Details to Highlight
4. Call-to-Action Text
5. Visual Theme Suggestions
6. Color Scheme Recommendations

${language.toLowerCase() === 'hindi' ? 'Please respond in Hindi (Devanagari script) for all text content.' : 'Please respond in English.'}

Make it promotional and engaging!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        posterContent: text,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating poster content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate poster content',
      error: error.message
    });
  }
};

/**
 * Generate Email Draft using Gemini AI
 */
exports.generateEmailDraft = async (req, res) => {
  try {
    const { description, language = 'english', recipients = 'guests' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Event description is required'
      });
    }

    const prompt = `You are a professional email writer. Based on the following event information, create a professional email invitation.

Event Description: ${description}
Recipients: ${recipients}
Language: ${language}

Please provide:
1. Subject Line (compelling and clear)
2. Email Body with:
   - Warm greeting
   - Event introduction
   - Key details (date, time, venue if available)
   - What to expect
   - RSVP instructions
   - Professional closing
3. Signature template

${language.toLowerCase() === 'hindi' ? 'Please write the email in Hindi (Devanagari script).' : 'Please write the email in English.'}

Make it professional yet warm and inviting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        emailDraft: text,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating email draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate email draft',
      error: error.message
    });
  }
};

/**
 * Generate Instagram Caption using Gemini AI
 */
exports.generateInstagramCaption = async (req, res) => {
  try {
    const { description, language = 'english', style = 'engaging' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Event description is required'
      });
    }

    const prompt = `You are a social media expert. Based on the following event information, create engaging Instagram captions.

Event Description: ${description}
Style: ${style}
Language: ${language}

Please provide:
1. Main Caption (engaging, with emojis)
2. Alternative Caption (different tone)
3. Relevant Hashtags (15-20 hashtags)
4. Call-to-Action
5. Story Ideas (3-4 Instagram story suggestions)

${language.toLowerCase() === 'hindi' ? 'Please write in Hindi (Devanagari script) but keep hashtags in English for better reach.' : 'Please write in English.'}

Make it Instagram-ready with emojis and hashtags!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        instagramCaption: text,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating Instagram caption:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Instagram caption',
      error: error.message
    });
  }
};

/**
 * Generate All Marketing Materials at Once
 */
exports.generateAllMaterials = async (req, res) => {
  try {
    const { description, language = 'english' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Event description is required'
      });
    }

    // Generate all materials concurrently
    const [eventPlanResult, posterResult, emailResult, captionResult] = await Promise.all([
      model.generateContent(`Create a comprehensive event plan for: ${description}. ${language.toLowerCase() === 'hindi' ? 'Respond in Hindi.' : 'Respond in English.'}`),
      model.generateContent(`Create compelling poster content for: ${description}. ${language.toLowerCase() === 'hindi' ? 'Respond in Hindi.' : 'Respond in English.'}`),
      model.generateContent(`Create a professional email invitation for: ${description}. ${language.toLowerCase() === 'hindi' ? 'Respond in Hindi.' : 'Respond in English.'}`),
      model.generateContent(`Create engaging Instagram captions with hashtags for: ${description}. ${language.toLowerCase() === 'hindi' ? 'Respond in Hindi.' : 'Respond in English.'}`)
    ]);

    const eventPlan = await eventPlanResult.response;
    const poster = await posterResult.response;
    const email = await emailResult.response;
    const caption = await captionResult.response;

    res.json({
      success: true,
      data: {
        eventPlan: eventPlan.text(),
        posterContent: poster.text(),
        emailDraft: email.text(),
        instagramCaption: caption.text(),
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating all materials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate marketing materials',
      error: error.message
    });
  }
};
