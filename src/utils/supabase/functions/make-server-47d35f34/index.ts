import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
const app = new Hono();
// Apply middleware
app.use("*", cors({
  origin: '*',
  credentials: true
}));
app.use("*", logger());
// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Helper to verify auth
async function verifyAuth(c: any) {
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  if (!accessToken) {
    return {
      user: null,
      error: 'No access token provided'
    };
  }
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  return {
    user,
    error
  };
}
// Debug middleware to log all requests
app.use('*', async (c, next)=>{
  console.log('=== REQUEST DEBUG ===');
  console.log('Method:', c.req.method);
  console.log('URL:', c.req.url);
  console.log('Path:', c.req.path);
  console.log('Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  await next();
});
// Health check route - MUST BE FIRST
app.get('/', (c)=>{
  console.log('✅ Health check endpoint hit successfully');
  return c.json({
    status: 'ok',
    message: 'BoardMap API is running',
    timestamp: new Date().toISOString(),
    receivedPath: c.req.path,
    receivedUrl: c.req.url,
    routes: [
      'GET /',
      'POST /signup',
      'GET /properties',
      'GET /properties/owner/:ownerId',
      'POST /properties',
      'GET /occupants/owner/:ownerId',
      'GET /inquiries/owner/:ownerId'
    ]
  });
});

app.get('/debug/*', (c) => {
  console.log('=== DEBUG ROUTE HIT ===');
  console.log('Full URL:', c.req.url);
  console.log('Path:', c.req.path);
  console.log('Method:', c.req.method);
  console.log('Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  
  return c.json({
    status: 'debug',
    url: c.req.url,
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString()
  });
});

// Also add a simple test endpoint
app.get('/test-messages', (c) => {
  return c.json({
    status: 'ok',
    message: 'Messages endpoint is reachable',
    timestamp: new Date().toISOString()
  });
});

// Sign up route
app.post('/signup', async (c)=>{
  try {
    console.log('Signup endpoint hit');
    const { email, password, name, userType } = await c.req.json();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        userType
      },
      email_confirm: true
    });
    if (error) {
      console.error('Signup error:', error.message);
      return c.json({
        error: error.message
      }, 400);
    }
    return c.json({
      user: data.user
    });
  } catch (error) {
    console.error('Signup exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json({
      error: 'Internal server error',
      details: errorMessage
    }, 500);
  }
});
// --- PROPERTIES ---
app.get('/properties', async (c)=>{
  try {
    console.log('GET /properties hit');
    const { data: properties, error } = await supabase.from('properties').select('*').eq('availability', 'Available').order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Database error:', error);
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    console.log(`Found ${properties?.length || 0} properties`);
    return c.json({
      properties: properties || []
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.get('/properties/owner/:ownerId', async (c)=>{
  try {
    const { ownerId } = c.req.param();
    console.log(`GET /properties/owner/${ownerId} hit`);
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { data: properties, error } = await supabase.from('properties').select('*').eq('owner_id', ownerId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Database error:', error);
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    console.log(`Found ${properties?.length || 0} properties for owner ${ownerId}`);
    return c.json({
      properties: properties || []
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.post('/properties', async (c)=>{
  try {
    console.log('POST /properties hit');
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const propertyData = await c.req.json();
    console.log('Creating property:', propertyData.title);
    const { data: property, error } = await supabase.from('properties').insert({
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      address: propertyData.address,
      location: propertyData.location,
      amenities: propertyData.amenities || [],
      type: propertyData.type,
      availability: propertyData.availability || 'Available',
      gender: propertyData.gender,
      images: propertyData.images || [],
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      owner_id: propertyData.ownerId,
      owner_name: propertyData.ownerName,
      owner_email: propertyData.ownerEmail,
      owner_phone: propertyData.ownerPhone,
      rooms: propertyData.rooms || []
    }).select().single();
    if (error) {
      console.error('Database error:', error);
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    console.log('Property created successfully');
    return c.json({
      property
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.put('/properties/:id', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const updates = await c.req.json();
    const { data: property, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      property
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.delete('/properties/:id', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      success: true
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
// --- OCCUPANTS ---
app.get('/occupants/owner/:ownerId', async (c)=>{
  try {
    const { ownerId } = c.req.param();
    console.log(`GET /occupants/owner/${ownerId} hit`);
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { data: occupants, error } = await supabase.from('occupants').select('*').eq('owner_id', ownerId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Database error:', error);
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    console.log(`Found ${occupants?.length || 0} occupants`);
    return c.json({
      occupants: occupants || []
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.post('/occupants', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const occupantData = await c.req.json();
    const { data: occupant, error } = await supabase.from('occupants').insert({
      property_id: occupantData.propertyId,
      property_title: occupantData.propertyTitle,
      room_number: occupantData.roomNumber,
      name: occupantData.name,
      email: occupantData.email,
      phone: occupantData.phone,
      monthly_rent: occupantData.monthlyRent,
      paid_until: occupantData.paidUntil,
      status: occupantData.status || 'active',
      owner_id: occupantData.ownerId
    }).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      occupant
    });
  } catch (error) {
    console.error('Error creating occupant:', error);
    return c.json({
      error: 'Failed to create occupant',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.put('/occupants/:id', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const updates = await c.req.json();
    const { data: occupant, error } = await supabase.from('occupants').update(updates).eq('id', id).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      occupant
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.delete('/occupants/:id', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const { error } = await supabase.from('occupants').delete().eq('id', id);
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting occupant:', error);
    return c.json({
      error: 'Failed to delete occupant',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
// --- INQUIRIES ---
app.get('/inquiries/owner/:ownerId', async (c)=>{
  try {
    const { ownerId } = c.req.param();
    console.log(`GET /inquiries/owner/${ownerId} hit`);
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { data: inquiries, error } = await supabase.from('inquiries').select('*').eq('owner_id', ownerId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Database error:', error);
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    console.log(`Found ${inquiries?.length || 0} inquiries`);
    return c.json({
      inquiries: inquiries || []
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return c.json({
      error: 'Failed to fetch inquiries',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.post('/inquiries', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const inquiryData = await c.req.json();
    const { data: inquiry, error } = await supabase.from('inquiries').insert({
      property_id: inquiryData.propertyId,
      property_title: inquiryData.propertyTitle,
      student_id: inquiryData.studentId,
      student_name: inquiryData.studentName,
      message: inquiryData.message,
      owner_id: inquiryData.ownerId,
      status: inquiryData.status || 'active'
    }).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      inquiry
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return c.json({
      error: 'Failed to create inquiry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.put('/inquiries/:id', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const updates = await c.req.json();
    const { data: inquiry, error } = await supabase.from('inquiries').update(updates).eq('id', id).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return c.json({
      error: 'Failed to update inquiry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.put('/inquiries/:id/archive', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { id } = c.req.param();
    const { data: inquiry, error } = await supabase.from('inquiries').update({
      status: 'archived',
      archived_at: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      inquiry
    });
  } catch (error) {
    console.error('Error archiving inquiry:', error);
    return c.json({
      error: 'Failed to archive inquiry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
// --- MESSAGES ---
app.get('/messages/:userId1/:userId2', async (c)=>{
  try {
    const { userId1, userId2 } = c.req.param();
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { data: messages, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`).order('timestamp', {
      ascending: true
    });
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      messages: messages || []
    });
  } catch (error) {
console.error('Error fetching properties:', error);
    return c.json({
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.post('/messages', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const { recipientId, message, propertyId } = await c.req.json();
    const { data: newMessage, error } = await supabase.from('messages').insert({
      sender_id: auth.user.id,
      sender_name: auth.user.user_metadata?.name || 'User',
      recipient_id: recipientId,
      message: message,
      property_id: propertyId,
      timestamp: new Date().toISOString()
    }).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
// --- REVIEWS ---
app.get('/reviews/property/:propertyId', async (c)=>{
  try {
    const { propertyId } = c.req.param();
    const { data: reviews, error } = await supabase.from('reviews').select('*').eq('property_id', propertyId).order('created_at', {
      ascending: false
    });
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      reviews: reviews || []
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
app.post('/reviews', async (c)=>{
  try {
    const auth = await verifyAuth(c);
    if (auth.error || !auth.user) {
      return c.json({
        error: 'Unauthorized'
      }, 401);
    }
    const reviewData = await c.req.json();
    const { data: review, error } = await supabase.from('reviews').insert({
      property_id: reviewData.propertyId,
      user_id: reviewData.userId,
      user_name: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment
    }).select().single();
    if (error) {
      return c.json({
        error: 'Database error',
        details: error.message
      }, 500);
    }
    return c.json({
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({
      error: 'Failed to create review',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
// Catch-all 404 handler
app.notFound((c)=>{
  console.log('404 Not Found:', c.req.url);
  return c.json({
    error: 'Not Found',
    path: c.req.url,
    message: 'The requested endpoint does not exist'
  }, 404);
});
// Export for Supabase Edge Functions
Deno.serve(app.fetch);
