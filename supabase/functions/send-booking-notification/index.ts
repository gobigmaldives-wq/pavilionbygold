import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

const formatEventType = (type: string): string => {
  const types: Record<string, string> = {
    wedding: "Wedding",
    corporate: "Corporate Event",
    private: "Private Party",
    ramadan: "Ramadan Event",
    other: "Other",
  };
  return types[type] || type;
};

const formatSpace = (space: string): string => {
  const spaces: Record<string, string> = {
    floor1: "Floor 1 - Grand Ballroom",
    floor1_garden: "Floor 1 - Outdoor Garden",
    floor2: "Floor 2 - Skyview Terrace",
    entire_venue: "Entire Venue",
  };
  return spaces[space] || space;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingNotificationRequest = await req.json();
    console.log("Received booking notification request:", booking);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Pavilion by Gold <onboarding@resend.dev>",
      to: [booking.adminEmail],
      subject: `🎉 New Booking Request: ${booking.fullName} - ${formatEventType(booking.eventType)}`,
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
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${booking.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${booking.email}" style="color: #D4AF37;">${booking.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${booking.phone}" style="color: #D4AF37;">${booking.phone}</a></td>
              </tr>
              ${booking.companyName ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Company:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.companyName}</td>
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
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${booking.eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Space:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formatSpace(booking.space)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.guestCount} people</td>
              </tr>
              ${booking.notes ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Notes:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.notes}</td>
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
            <p style="font-size: 16px; color: #333;">Dear ${booking.fullName},</p>
            
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
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${booking.eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Space:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formatSpace(booking.space)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${booking.guestCount} people</td>
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
