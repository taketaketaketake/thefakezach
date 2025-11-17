const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_IP = 3; // 3 submissions per 15 minutes
const MAX_SUBMISSIONS_PER_CONTENT = 1; // 1 identical content per window

// Input validation limits (blog post equivalent)
const LIMITS = {
  name: {
    min: 1,
    max: 50
  },
  message: {
    min: 1,
    max: 2000 // Typical blog post paragraph length
  }
};

// Basic profanity filter (expand as needed)
const BLOCKED_WORDS = [
  // Add your blocked words here
  'spam', 'viagra', 'casino'
];

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .substring(0, 3000); // Hard limit
}

function validateInput(name, message) {
  const errors = [];
  
  // Validate name
  if (!name || name.length < LIMITS.name.min) {
    errors.push('Name is required');
  }
  if (name && name.length > LIMITS.name.max) {
    errors.push('Name must be less than ' + LIMITS.name.max + ' characters');
  }
  
  // Validate message
  if (!message || message.length < LIMITS.message.min) {
    errors.push('Message is required');
  }
  if (message && message.length > LIMITS.message.max) {
    errors.push('Message must be less than ' + LIMITS.message.max + ' characters');
  }
  
  // Content filtering
  const combinedText = (name + ' ' + message).toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (combinedText.includes(word.toLowerCase())) {
      errors.push('Content contains inappropriate language');
      break;
    }
  }
  
  return errors;
}

function getClientIP(event) {
  const forwarded = event.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return event.headers['x-real-ip'] || 
         event.headers['cf-connecting-ip'] || 
         'unknown';
}

function isRateLimited(ip, contentHash) {
  const now = Date.now();
  const ipKey = 'ip:' + ip;
  const contentKey = 'content:' + contentHash;
  
  // Clean old entries
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.firstSeen > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
  
  // Check IP rate limit
  const ipData = rateLimitStore.get(ipKey);
  if (ipData && ipData.count >= MAX_SUBMISSIONS_PER_IP) {
    return { 
      limited: true, 
      reason: 'Too many submissions from your IP address. Please wait 15 minutes.' 
    };
  }
  
  // Check content duplication
  const contentData = rateLimitStore.get(contentKey);
  if (contentData && contentData.count >= MAX_SUBMISSIONS_PER_CONTENT) {
    return { 
      limited: true, 
      reason: 'This content has already been submitted recently.' 
    };
  }
  
  return { limited: false };
}

function updateRateLimit(ip, contentHash) {
  const now = Date.now();
  const ipKey = 'ip:' + ip;
  const contentKey = 'content:' + contentHash;
  
  // Update IP counter
  const ipData = rateLimitStore.get(ipKey);
  if (ipData) {
    ipData.count++;
    ipData.lastSeen = now;
  } else {
    rateLimitStore.set(ipKey, { count: 1, firstSeen: now, lastSeen: now });
  }
  
  // Update content counter
  const contentData = rateLimitStore.get(contentKey);
  if (contentData) {
    contentData.count++;
    contentData.lastSeen = now;
  } else {
    rateLimitStore.set(contentKey, { count: 1, firstSeen: now, lastSeen: now });
  }
}

async function savePost(name, message) {
  try {
    const postsPath = path.join(process.cwd(), 'src', 'data', 'wall.json');
    
    // Read existing posts
    let posts = [];
    try {
      const data = await fs.readFile(postsPath, 'utf8');
      posts = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      posts = [];
    }
    
    // Create new post
    const newPost = {
      id: crypto.randomUUID(),
      name: name,
      message: message,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      timestamp: new Date().toISOString(),
      reactions: {
        '👍': 0,
        '❤️': 0,
        '🔥': 0,
        '😂': 0,
        '💡': 0
      }
    };
    
    // Add to beginning of posts array
    posts.unshift(newPost);
    
    // Keep only last 100 posts to prevent file from growing too large
    posts = posts.slice(0, 100);
    
    // Save back to file
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
    
    return newPost;
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save post');
  }
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Parse form data
    const body = event.body;
    const params = new URLSearchParams(body);
    
    // Check honeypot
    if (params.get('bot-field')) {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Bot detected' })
      };
    }
    
    const rawName = params.get('name') || '';
    const rawMessage = params.get('message') || '';
    
    // Sanitize inputs
    const name = sanitizeInput(rawName);
    const message = sanitizeInput(rawMessage);
    
    // Validate inputs
    const validationErrors = validateInput(name, message);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Validation failed', 
          details: validationErrors 
        })
      };
    }
    
    // Rate limiting
    const clientIP = getClientIP(event);
    const contentHash = crypto
      .createHash('sha256')
      .update(name + ':' + message)
      .digest('hex');
    
    const rateLimitCheck = isRateLimited(clientIP, contentHash);
    if (rateLimitCheck.limited) {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Rate limit exceeded', 
          message: rateLimitCheck.reason 
        })
      };
    }
    
    // Save the post
    const newPost = await savePost(name, message);
    
    // Update rate limit counters
    updateRateLimit(clientIP, contentHash);
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Post submitted successfully',
        post: newPost 
      })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to submit post' 
      })
    };
  }
};