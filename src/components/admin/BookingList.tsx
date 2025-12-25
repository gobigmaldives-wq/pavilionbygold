import { format } from "date-fns";
import { Eye, Check, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingRequest, BookingStatus, getSpaceById } from "@/types/booking";
import { cn } from "@/lib/utils";

interface BookingListProps {
  bookings: BookingRequest[];
  onViewBooking: (booking: BookingRequest) => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
}

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const BookingList = ({ bookings, onViewBooking, onApprove, onReject }: BookingListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Event Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Space</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Event Type</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Guests</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => {
              const space = getSpaceById(booking.space);
              
              return (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.fullName}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {format(new Date(booking.eventDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {space?.name || booking.space}
                  </td>
                  <td className="px-6 py-4 text-foreground capitalize">
                    {booking.eventType}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {booking.guestCount}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={cn("capitalize", statusColors[booking.status])}
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewBooking(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onApprove(booking.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onReject(booking.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewBooking(booking)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
