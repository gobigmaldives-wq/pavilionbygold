import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, FileText, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import SpaceCard from "./SpaceCard";
import AdditionalServices, { ServiceSelections, PaymentOption } from "./AdditionalServices";
import { SPACES, EVENT_TYPES, SpaceType, getSpacesForDate } from "@/types/booking";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useBookedDates, isDateBlockedForSpace } from "@/hooks/useBookedDates";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().min(8, "Valid phone number is required").max(20),
  email: z.string().email("Valid email is required").max(255),
  companyName: z.string().max(100).optional(),
  eventType: z.enum(["wedding", "corporate", "private", "ramadan", "other"]),
  eventDate: z.date({ required_error: "Event date is required" }),
  spaces: z.array(z.enum(["floor1", "floor1_garden", "floor2", "entire_venue"])).min(1, "Please select at least one space"),
  guestCount: z.number().min(1, "Guest count is required").max(1000),
  notes: z.string().max(1000).optional(),
  agreedToRules: z.boolean().refine((val) => val === true, {
    message: "You must agree to the rules and regulations",
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpaces, setSelectedSpaces] = useState<SpaceType[]>([]);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [spaceCurrency, setSpaceCurrency] = useState<"rf" | "usd">("rf");
  const [serviceSelections, setServiceSelections] = useState<ServiceSelections>({
    decorPackage: null,
    avPackage: null,
    cateringPackage: null,
    bringOwnDecorAV: false,
  });
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("option1");
  const [transferSlip, setTransferSlip] = useState<File | null>(null);
  const { data: bookedDates = [] } = useBookedDates();
  const spaceSelectionRef = useRef<HTMLDivElement>(null);

  const handleGuestCountDone = () => {
    // Blur the input to close mobile keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Smooth scroll to space selection
    setTimeout(() => {
      spaceSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      notes: "",
      agreedToRules: false,
      spaces: [],
    },
  });

  // Use useWatch to avoid infinite re-renders with Radix Select
  const watchedEventDate = useWatch({ control: form.control, name: "eventDate" });
  const watchedGuestCount = useWatch({ control: form.control, name: "guestCount" });

  // Floor 1 Garden can only be selected if Floor 1 or Floor 2 is already selected
  const canSelectGarden = selectedSpaces.includes("floor1") || selectedSpaces.includes("floor2");

  const handleSpaceSelect = (spaceId: SpaceType, fieldOnChange: (value: SpaceType[]) => void) => {
    let newSelection: SpaceType[];
    
    if (spaceId === "entire_venue") {
      // If selecting entire venue, clear all others and select only entire venue
      newSelection = ["entire_venue"];
    } else {
      // If selecting individual floor
      if (selectedSpaces.includes("entire_venue")) {
        // If entire venue was selected, replace with just this floor
        newSelection = [spaceId];
      } else if (selectedSpaces.includes(spaceId)) {
        // If already selected, deselect it
        newSelection = selectedSpaces.filter(s => s !== spaceId);
        // If deselecting floor1 or floor2, also remove garden
        if ((spaceId === "floor1" || spaceId === "floor2") && 
            !newSelection.includes("floor1") && !newSelection.includes("floor2")) {
          newSelection = newSelection.filter(s => s !== "floor1_garden");
        }
      } else {
        // Add to selection
        newSelection = [...selectedSpaces, spaceId];
      }
    }
    
    setSelectedSpaces(newSelection);
    fieldOnChange(newSelection);
  };

  // Determine the space value for database storage
  const getSpaceForStorage = (spaces: SpaceType[]): "floor1" | "floor1_garden" | "floor2" | "entire_venue" => {
    if (spaces.includes("entire_venue")) return "entire_venue";
    // If all 3 floors are selected, treat as entire venue
    if (spaces.length === 3 && spaces.includes("floor1") && spaces.includes("floor1_garden") && spaces.includes("floor2")) {
      return "entire_venue";
    }
    // Return the first selected space for now (we'll store additional in notes)
    return spaces[0] || "floor1";
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const primarySpace = getSpaceForStorage(data.spaces);
      const additionalSpacesNote = data.spaces.length > 1 && primarySpace !== "entire_venue" 
        ? `Selected spaces: ${data.spaces.join(", ")}. ` 
        : "";
      
      // Upload transfer slip if provided
      let transferSlipUrl: string | null = null;
      if (transferSlip) {
        const fileExt = transferSlip.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('transfer-slips')
          .upload(fileName, transferSlip);
        
        if (uploadError) {
          console.error("Transfer slip upload error:", uploadError);
          // Continue with booking even if upload fails
        } else {
          transferSlipUrl = uploadData.path;
        }
      }
      
      const { error } = await supabase.from("bookings").insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        company_name: data.companyName || null,
        event_type: data.eventType,
        event_date: format(data.eventDate, "yyyy-MM-dd"),
        space: primarySpace,
        guest_count: data.guestCount,
        notes: additionalSpacesNote + (data.notes || ""),
        agreed_to_rules: data.agreedToRules,
        agreed_at: new Date().toISOString(),
        transfer_slip_url: transferSlipUrl,
      });

      if (error) throw error;

      // Send email notifications
      try {
        const notificationResponse = await supabase.functions.invoke("send-booking-notification", {
          body: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName,
            eventType: data.eventType,
            eventDate: format(data.eventDate, "MMMM d, yyyy"),
            space: primarySpace,
            guestCount: data.guestCount,
            notes: additionalSpacesNote + (data.notes || ""),
            adminEmail: "sales@pavilionbygold.com",
          },
        });
        
        if (notificationResponse.error) {
          console.error("Email notification error:", notificationResponse.error);
        } else {
          console.log("Email notifications sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
        // Don't fail the booking if email fails
      }

      // Send booking data to n8n webhook for Google Sheets, Calendar, WhatsApp
      try {
        const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
          await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify({
              fullName: data.fullName,
              email: data.email,
              phone: data.phone,
              companyName: data.companyName || "",
              eventType: data.eventType,
              eventDate: format(data.eventDate, "yyyy-MM-dd"),
              eventDateFormatted: format(data.eventDate, "MMMM d, yyyy"),
              space: primarySpace,
              guestCount: data.guestCount,
              notes: additionalSpacesNote + (data.notes || ""),
              submittedAt: new Date().toISOString(),
            }),
          });
          console.log("n8n webhook triggered successfully");
        }
      } catch (webhookError) {
        console.error("n8n webhook error:", webhookError);
        // Don't fail the booking if webhook fails
      }

      toast.success("Booking request submitted successfully!", {
        description: "We'll contact you shortly to confirm your reservation.",
      });
      
      navigate("/booking-success");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking request", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="font-serif text-2xl text-foreground mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number for WhatsApp *</FormLabel>
                  <FormControl>
                    <Input placeholder="+960 123-456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="font-serif text-2xl text-foreground mb-6">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          // Block past dates
                          if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
                          // Block dates that are already booked for any selected space
                          return selectedSpaces.some(space => isDateBlockedForSpace(date, space, bookedDates));
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Expected number of guests"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="flex-1"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGuestCountDone}
                      className="shrink-0"
                    >
                      Done
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Space Selection */}
          <div className="mb-6" ref={spaceSelectionRef}>
            <FormField
              control={form.control}
              name="spaces"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg">Select Your Space *</FormLabel>
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                      <Button
                        type="button"
                        variant={spaceCurrency === "rf" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setSpaceCurrency("rf")}
                      >
                        Rf.
                      </Button>
                      <Button
                        type="button"
                        variant={spaceCurrency === "usd" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setSpaceCurrency("usd")}
                      >
                        USD
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can select multiple spaces. Selecting "Entire Venue" will include all areas.
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {getSpacesForDate(watchedEventDate).map((space) => {
                        const isGardenDisabled = space.id === "floor1_garden" && !canSelectGarden;
                        return (
                          <SpaceCard
                            key={space.id}
                            space={space}
                            selected={selectedSpaces.includes(space.id)}
                            currency={spaceCurrency}
                            eventDate={watchedEventDate}
                            onSelect={() => handleSpaceSelect(space.id, field.onChange)}
                            disabled={isGardenDisabled}
                            disabledReason={isGardenDisabled ? "Select Floor 1 or Floor 2 first" : undefined}
                          />
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Services */}
          <AdditionalServices
            selections={serviceSelections}
            onSelectionChange={setServiceSelections}
            guestCount={watchedGuestCount || 0}
            selectedSpaces={selectedSpaces}
            eventType={form.watch("eventType") || "wedding"}
            eventDate={watchedEventDate}
            paymentOption={paymentOption}
            onPaymentOptionChange={setPaymentOption}
            transferSlip={transferSlip}
            onTransferSlipChange={setTransferSlip}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or requirements for your event..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Agreement & Submit */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <FormField
            control={form.control}
            name="agreedToRules"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    I accept the Pavilion by Gold Rules & Regulations and understand that this is a booking request pending confirmation.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Rules & Regulations Button */}
          <button
            type="button"
            onClick={() => setRulesDialogOpen(true)}
            className="w-full mb-6 p-4 rounded-lg border-2 border-dashed border-gold/40 bg-gold/5 hover:bg-gold/10 hover:border-gold/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Rules & Regulations</p>
                <p className="text-sm text-muted-foreground">Tap to read before submitting</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" />
          </button>

          <Button 
            type="submit" 
            size="lg"
            className="w-full md:w-auto bg-gold-gradient text-primary-foreground hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </div>

        {/* Rules & Regulations Dialog */}
        <Dialog open={rulesDialogOpen} onOpenChange={setRulesDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Pavilion by Gold Rules & Regulations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-xs italic">(Applicable to All Clients & Events)</p>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">1. Booking & Confirmation</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A booking is considered tentatively reserved only upon submission of the booking request form.</li>
                  <li>Bookings can be confirmed only after payment has been received.</li>
                  <li>The venue reserves the right to decline or cancel any booking that does not comply with venue policies, safety standards, or payment timelines. In such cases, no payment will be refunded.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">2. Venue Areas & Floor Usage</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The venue consists of multiple floors/areas which may be booked individually or collectively, subject to availability.</li>
                  <li>On days where different clients are booked on different floors, guests must strictly remain within their allocated floor/area.</li>
                  <li>Clients are responsible for ensuring their guests comply with this rule to avoid confusion or disruption.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">3. Guest Count & Capacity</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Each floor has a maximum seating and standing capacity.</li>
                  <li>Guest count must be finalized and communicated at least 72 hours prior to the event.</li>
                  <li>The venue reserves the right to restrict entry or charge additional fees if the guest count exceeds the agreed number.</li>
                  <li>Exceeding capacity is strictly prohibited due to safety and regulatory requirements.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">4. Event Timings</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Event setup, event time, and dismantling times must strictly follow the approved time slots.</li>
                  <li>Overtime usage is subject to availability and additional charges.</li>
                  <li>Any delay caused by the client or their vendors may result in reduced event time without refund.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">5. Payments & Financial Terms</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All payments must be made as per the agreed payment schedule.</li>
                  <li>Failure to meet payment deadlines may result in automatic cancellation of the booking.</li>
                  <li>Security deposits (if applicable) will be refunded after the event, subject to damage assessment.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">6. Cancellation & Rescheduling</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>In the event of cancellation, none of the paid amount can be refunded.</li>
                  <li>Rescheduling to a new date is possible only after confirming and discussing with the venue.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">7. Approved Vendors & Services</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The venue works with designated / contracted partners for catering services, decoration services, and audio-visual & technical services.</li>
                  <li>Only approved vendors are allowed to operate within the venue.</li>
                  <li>Any external vendor must receive prior written approval from venue management.</li>
                  <li>Unauthorized vendors will not be permitted entry.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">8. Decoration & Installations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All décor setups must be approved in advance.</li>
                  <li>No drilling, permanent fixing, nailing, or structural alterations are allowed.</li>
                  <li>Confetti, glitter, smoke effects, or hazardous materials are prohibited unless approved.</li>
                  <li>Any damage caused during installation or dismantling while using your own decorator, AV, or any other external vendor will be charged to the client.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">9. Food & Beverage Policy</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Outside food and beverages are not permitted unless approved in writing.</li>
                  <li>All food handling must comply with hygiene and safety regulations.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">10. Safety & Security</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clients must comply with all fire, safety, and emergency regulations.</li>
                  <li>Blocking exits, stairways, or emergency access points is strictly prohibited.</li>
                  <li>The venue is not responsible for loss or damage of personal belongings.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">11. Damages & Liability</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The client is fully responsible for any damage caused by guests, vendors, or contractors coming from the client side.</li>
                  <li>Repair or replacement costs will be deducted from the security deposit or billed separately.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">12. Noise & Conduct</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Music and sound levels must comply with venue guidelines and local regulations.</li>
                  <li>Any form of illegal, disruptive, or unsafe behavior may result in immediate event termination without refund.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">13. Force Majeure</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The venue shall not be held liable for cancellations or delays caused by events beyond its control, including but not limited to natural disasters, government restrictions, or emergencies.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">14. Management Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Venue management reserves the right to refuse entry, stop any activity, or terminate the event if venue rules are violated or safety is compromised.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-semibold text-foreground mb-2">15. Acceptance of Terms</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>By confirming a booking, the client acknowledges and agrees to all rules and regulations stated above.</li>
                  <li>These rules form an integral part of the booking agreement and invoice.</li>
                </ul>
              </section>
            </div>
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default BookingForm;
