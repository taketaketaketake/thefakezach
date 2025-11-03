exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { NETLIFY_API_TOKEN } = process.env;
    
    if (!NETLIFY_API_TOKEN) {
      throw new Error('NETLIFY_API_TOKEN environment variable is required');
    }

    const siteId = context.clientContext?.custom?.netlify_site_id || process.env.NETLIFY_SITE_ID;
    
    if (!siteId) {
      throw new Error('Unable to determine site ID');
    }

    const { postId, emoji, action } = JSON.parse(event.body);
    
    if (!postId || !emoji || !action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: postId, emoji, action' }),
      };
    }

    // First, get the current submission to read existing reactions
    const getResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/submissions/${postId}`,
      {
        headers: {
          'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch submission: ${getResponse.status}`);
    }

    const submission = await getResponse.json();
    
    // Parse existing reactions or initialize
    let reactions = {
      '👍': 0,
      '❤️': 0,
      '🔥': 0,
      '😂': 0,
      '💡': 0
    };

    if (submission.data.reactions) {
      try {
        reactions = JSON.parse(submission.data.reactions);
      } catch (e) {
        console.warn('Failed to parse existing reactions, using defaults');
      }
    }

    // Update reaction count
    if (action === 'increment') {
      reactions[emoji] = (reactions[emoji] || 0) + 1;
    } else if (action === 'decrement') {
      reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0);
    }

    // Update the submission with new reactions
    const updateResponse = await fetch(
      `https://api.netlify.com/api/v1/submissions/${postId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...submission.data,
            reactions: JSON.stringify(reactions)
          }
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update submission: ${updateResponse.status}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        reactions 
      }),
    };
  } catch (error) {
    console.error('Error updating reactions:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to update reactions',
        message: error.message 
      }),
    };
  }
};