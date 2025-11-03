exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
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
      // For local development, return empty posts
      if (process.env.NODE_ENV === 'development' || !process.env.NETLIFY) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ posts: [] }),
        };
      }
      throw new Error('Unable to determine site ID');
    }

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/submissions?form_name=wall`,
      {
        headers: {
          'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status} ${response.statusText}`);
    }

    const submissions = await response.json();
    
    const posts = submissions
      .filter(submission => submission.data && submission.data.name && submission.data.message)
      .map(submission => ({
        id: submission.id,
        name: submission.data.name,
        message: submission.data.message,
        date: new Date(submission.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        reactions: submission.data.reactions ? JSON.parse(submission.data.reactions) : {
          '👍': 0,
          '❤️': 0,
          '🔥': 0,
          '😂': 0,
          '💡': 0
        }
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts }),
    };
  } catch (error) {
    console.error('Error fetching wall posts:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch posts',
        message: error.message 
      }),
    };
  }
};