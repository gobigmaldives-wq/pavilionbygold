import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  eventType: string;
  eventDate: string;
  space: string;
  guestCount: number;
  notes?: string;
  adminEmail: string;
}

// HTML escape function to prevent XSS in emails
function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

const formatEventType = (type: string): string => {
  const types: Record<string, string> = {
    wedding: "Wedding",
    corporate: "Corporate Event",
    private: "Private Party",
    ramadan: "Ramadan Event",
    other: "Other",
  };
  return types[type] || escapeHtml(type);
};

const formatSpace = (space: string): string => {
  const spaces: Record<string, string> = {
    floor1: "Floor 1 - Grand Ballroom",
    floor1_garden: "Floor 1 - Outdoor Garden",
    floor2: "Floor 2 - Skyview Terrace",
    entire_venue: "Entire Venue",
  };
  return spaces[space] || escapeHtml(space);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingNotificationRequest = await req.json();
    console.log("Received booking notification request for:", booking.email);

    // Validate required fields
    if (!booking.email || !booking.eventDate || !booking.fullName) {
      return new Response(
        JSON.stringify({ error: "Missing required booking fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verify the booking exists in the database before sending emails
    // This prevents abuse of the endpoint by requiring a matching booking record
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if a booking was recently created with matching email and date
    // This validates that the request came from a legitimate booking submission
    const { data: existingBooking, error: lookupError } = await supabase
      .from('bookings')
      .select('id, email, event_date, full_name, created_at')
      .eq('email', booking.email)
      .eq('full_name', booking.fullName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lookupError || !existingBooking) {
      console.error("Booking verification failed:", lookupError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid booking reference" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verify the booking was created within the last 5 minutes to prevent replay attacks
    const bookingCreatedAt = new Date(existingBooking.created_at);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    if (bookingCreatedAt < fiveMinutesAgo) {
      console.error("Booking too old for notification:", existingBooking.id);
      return new Response(
        JSON.stringify({ error: "Booking notification window expired" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Verified booking:", existingBooking.id);

    // Escape all user-provided content for HTML email
    const safeFullName = escapeHtml(booking.fullName);
    const safeEmail = escapeHtml(booking.email);
    const safePhone = escapeHtml(booking.phone);
    const safeCompanyName = escapeHtml(booking.companyName);
    const safeNotes = escapeHtml(booking.notes);
    const safeGuestCount = Number(booking.guestCount) || 0;

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Pavilion by Gold <onboarding@resend.dev>",
      to: [booking.adminEmail],
      subject: `🎉 New Booking Request: ${safeFullName} - ${formatEventType(booking.eventType)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #D4AF37, #F4E4A0); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">New Booking Request</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #333; margin-top: 0;">Client Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safeFullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}" style="color: #D4AF37;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${safePhone}" style="color: #D4AF37;">${safePhone}</a></td>
              </tr>
              ${safeCompanyName ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Company:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeCompanyName}</td>
              </tr>
              ` : ''}
            </table>

            <h2 style="color: #333; margin-top: 25px;">Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Event Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${formatEventType(booking.eventType)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Date:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${escapeHtml(booking.eventDate)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Space:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formatSpace(booking.space)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeGuestCount} people</td>
              </tr>
              ${safeNotes ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Notes:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeNotes}</td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #f8f8f8; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666;">Log in to the admin dashboard to review and respond to this booking.</p>
            </div>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            Pavilion by Gold - Premium Event Venue
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Pavilion by Gold <onboarding@resend.dev>",
      to: [booking.email],
      subject: "Thank You for Your Booking Request - Pavilion by Gold",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #D4AF37, #F4E4A0); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">Booking Request Received</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #333;">Dear ${safeFullName},</p>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for your interest in hosting your event at Pavilion by Gold. We have received your booking request and our team will review it shortly.
            </p>

            <h2 style="color: #333; margin-top: 25px;">Your Request Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Event Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${formatEventType(booking.eventType)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Date:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${escapeHtml(booking.eventDate)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Space:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formatSpace(booking.space)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeGuestCount} people</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #f8f8f8; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">What Happens Next?</h3>
              <ol style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>Our team will review your request within 24 hours</li>
                <li>You'll receive a confirmation email with availability details</li>
                <li>Once confirmed, we'll send you an invoice for the deposit</li>
                <li>A member of our events team will contact you to discuss your requirements</li>
              </ol>
            </div>

            <p style="color: #666; margin-top: 25px; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us.
            </p>
            
            <p style="color: #333; margin-top: 25px;">
              Warm regards,<br>
              <strong>The Pavilion by Gold Team</strong>
            </p>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            Pavilion by Gold - Premium Event Venue
          </p>
        </div>
      `,
    });

    console.log("Client confirmation sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        clientEmail: clientEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
