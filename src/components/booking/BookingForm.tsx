import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import AdditionalServices, { ServiceSelections } from "./AdditionalServices";
import { SPACES, EVENT_TYPES, SpaceType } from "@/types/booking";
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
  space: z.enum(["floor1", "floor1_garden", "floor2", "entire_venue"]),
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
  const [selectedSpace, setSelectedSpace] = useState<SpaceType | null>(null);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [serviceSelections, setServiceSelections] = useState<ServiceSelections>({
    washroomAttendant: false,
    valetParking: false,
    decorPackage: null,
    avPackage: null,
    cateringPackage: null,
  });
  const { data: bookedDates = [] } = useBookedDates();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      notes: "",
      agreedToRules: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("bookings").insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        company_name: data.companyName || null,
        event_type: data.eventType,
        event_date: format(data.eventDate, "yyyy-MM-dd"),
        space: data.space,
        guest_count: data.guestCount,
        notes: data.notes || null,
        agreed_to_rules: data.agreedToRules,
        agreed_at: new Date().toISOString(),
      });

      if (error) throw error;

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
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          // Block dates that are already booked for the selected space
                          return isDateBlockedForSpace(date, selectedSpace, bookedDates);
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
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Expected number of guests"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Space Selection */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="space"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Select Your Space *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {SPACES.map((space) => (
                        <SpaceCard
                          key={space.id}
                          space={space}
                          selected={selectedSpace === space.id}
                          onSelect={() => {
                            setSelectedSpace(space.id);
                            field.onChange(space.id);
                          }}
                        />
                      ))}
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
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={() => setRulesDialogOpen(true)}
                      className="text-gold hover:underline"
                    >
                      Pavilion by Gold Rules & Regulations
                    </button>{" "}
                    and understand that this is a booking request pending confirmation.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

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
              <section>
                <h3 className="font-semibold text-foreground mb-2">1. Booking & Confirmation</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All bookings are subject to availability and confirmation by management.</li>
                  <li>A deposit is required to secure your booking.</li>
                  <li>Full payment must be made at least 7 days before the event date.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-foreground mb-2">2. Cancellation Policy</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cancellations made 30+ days before the event: Full refund minus processing fee.</li>
                  <li>Cancellations made 14-29 days before: 50% refund.</li>
                  <li>Cancellations made less than 14 days before: No refund.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-foreground mb-2">3. Venue Usage</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The venue must be vacated by the agreed end time.</li>
                  <li>No alterations to the venue structure without prior approval.</li>
                  <li>All decorations must be approved and removed after the event.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-foreground mb-2">4. Conduct & Safety</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The client is responsible for the behavior of all guests.</li>
                  <li>Smoking is only permitted in designated areas.</li>
                  <li>Fire safety regulations must be strictly followed.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-foreground mb-2">5. Damages & Liability</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The client is liable for any damages caused during the event.</li>
                  <li>A security deposit may be required for certain events.</li>
                  <li>Pavilion by Gold is not responsible for personal belongings.</li>
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
