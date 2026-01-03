import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (resets when function cold starts)
// Key: IP address, Value: array of timestamps
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_MAX = 3; // Maximum requests
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

function isRateLimited(clientIP: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  // Get existing timestamps for this IP
  let timestamps = rateLimitMap.get(clientIP) || [];
  
  // Filter to only keep timestamps within the window
  timestamps = timestamps.filter(ts => ts > windowStart);
  
  if (timestamps.length >= RATE_LIMIT_MAX) {
    // Calculate when the oldest request will expire
    const oldestTimestamp = Math.min(...timestamps);
    const retryAfterSeconds = Math.ceil((oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }
  
  // Add current timestamp and store
  timestamps.push(now);
  rateLimitMap.set(clientIP, timestamps);
  
  return { limited: false };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from various headers
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("x-real-ip") ||
                     req.headers.get("cf-connecting-ip") ||
                     "unknown";

    console.log(`Booking request from IP: ${clientIP}`);

    // Check rate limit
    const rateLimitCheck = isRateLimited(clientIP);
    if (rateLimitCheck.limited) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `Too many booking requests. Please try again in ${rateLimitCheck.retryAfterSeconds} seconds.`,
          retryAfterSeconds: rateLimitCheck.retryAfterSeconds,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ["full_name", "phone", "email", "event_type", "event_date", "space", "guest_count"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Basic input validation
    if (body.full_name.length < 2 || body.full_name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Full name must be between 2 and 100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.phone.length < 8 || body.phone.length > 20) {
      return new Response(
        JSON.stringify({ error: "Phone number must be between 8 and 20 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(body.email) || body.email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.notes && body.notes.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Notes must be less than 1000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert booking
    const { data, error } = await supabase.from("bookings").insert({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      company_name: body.company_name || null,
      event_type: body.event_type,
      event_date: body.event_date,
      space: body.space,
      guest_count: body.guest_count,
      notes: body.notes || null,
      agreed_to_rules: body.agreed_to_rules || false,
      agreed_at: body.agreed_at || null,
      transfer_slip_url: body.transfer_slip_url || null,
    }).select().single();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create booking", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Booking created successfully: ${data.id}`);

    return new Response(
      JSON.stringify({ success: true, booking: data }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
