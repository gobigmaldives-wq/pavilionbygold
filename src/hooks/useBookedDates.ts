import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpaceType } from "@/types/booking";

interface BookedDate {
  event_date: string;
  space: SpaceType;
}

export const useBookedDates = () => {
  return useQuery({
    queryKey: ["booked-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("event_date, space")
        .in("status", ["approved", "confirmed", "completed"]);

      if (error) throw error;
      return data as BookedDate[];
    },
  });
};

// Helper function to check if a date is blocked for a specific space
export const isDateBlockedForSpace = (
  date: Date,
  space: SpaceType | null,
  bookedDates: BookedDate[]
): boolean => {
  const dateStr = date.toISOString().split("T")[0];

  // Check if entire venue is booked on this date (blocks all spaces)
  const entireVenueBooked = bookedDates.some(
    (booking) => booking.event_date === dateStr && booking.space === "entire_venue"
  );

  if (entireVenueBooked) return true;

  // If user selected entire venue, check if any space is booked
  if (space === "entire_venue") {
    return bookedDates.some((booking) => booking.event_date === dateStr);
  }

  // Check if the specific space is booked on this date
  if (space) {
    return bookedDates.some(
      (booking) => booking.event_date === dateStr && booking.space === space
    );
  }

  return false;
};

// Get all blocked dates regardless of space (for showing in calendar)
export const getBlockedDates = (bookedDates: BookedDate[]): Date[] => {
  const entireVenueDates = bookedDates
    .filter((booking) => booking.space === "entire_venue")
    .map((booking) => new Date(booking.event_date));

  return entireVenueDates;
};
