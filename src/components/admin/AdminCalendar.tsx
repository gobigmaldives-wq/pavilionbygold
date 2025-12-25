import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingRequest, SpaceType } from "@/types/booking";

interface AdminCalendarProps {
  bookings: BookingRequest[];
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}

const spaceColors: Record<SpaceType, string> = {
  floor1: "bg-blue-500",
  floor1_garden: "bg-green-500",
  floor2: "bg-purple-500",
  entire_venue: "bg-gold",
};

const AdminCalendar = ({ bookings, onDateClick, selectedDate }: AdminCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for proper grid alignment
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.eventDate), date)
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div 
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-24 md:h-28" />
        ))}
        
        {daysInMonth.map((date) => {
          const dayBookings = getBookingsForDate(date);
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={cn(
                "h-24 md:h-28 p-2 border rounded-lg text-left transition-all hover:border-gold/50",
                isToday && "bg-gold/5",
                isSelected && "border-gold ring-1 ring-gold",
                !isSameMonth(date, currentMonth) && "opacity-50",
                "relative overflow-hidden"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isToday && "text-gold",
                !isToday && "text-foreground"
              )}>
                {format(date, "d")}
              </span>

              {/* Booking indicators */}
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded truncate",
                      spaceColors[booking.space],
                      "text-primary-foreground"
                    )}
                  >
                    {booking.fullName.split(" ")[0]}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
        {Object.entries(spaceColors).map(([space, color]) => (
          <div key={space} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", color)} />
            <span className="text-xs text-muted-foreground capitalize">
              {space.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCalendar;
