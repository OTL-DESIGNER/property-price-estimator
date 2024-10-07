const axios = require('axios');

exports.handler = async function(event, context) {
  const code = event.queryStringParameters.code;
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code is required' })
    };
  }
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to exchange code for token' })
    };
  }
};