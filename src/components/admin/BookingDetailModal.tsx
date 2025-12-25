import { format } from "date-fns";
import { X, Phone, Mail, Building, Users, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingRequest, BookingStatus, getSpaceById } from "@/types/booking";
import { cn } from "@/lib/utils";

interface BookingDetailModalProps {
  booking: BookingRequest | null;
  open: boolean;
  onClose: () => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
}

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

const BookingDetailModal = ({ 
  booking, 
  open, 
  onClose, 
  onApprove, 
  onReject 
}: BookingDetailModalProps) => {
  if (!booking) return null;

  const space = getSpaceById(booking.space);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-2xl">Booking Details</DialogTitle>
            <Badge className={cn("capitalize", statusColors[booking.status])}>
              {booking.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Information */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-serif text-lg text-gold">
                    {booking.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{booking.fullName}</p>
                  {booking.companyName && (
                    <p className="text-sm text-muted-foreground">{booking.companyName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <span>{booking.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} />
                  <span>{booking.email}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Event Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar size={14} />
                  <span className="text-xs uppercase tracking-wide">Date</span>
                </div>
                <p className="font-medium text-foreground">
                  {format(new Date(booking.eventDate), "MMM d, yyyy")}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Building size={14} />
                  <span className="text-xs uppercase tracking-wide">Space</span>
                </div>
                <p className="font-medium text-foreground">{space?.name}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users size={14} />
                  <span className="text-xs uppercase tracking-wide">Guests</span>
                </div>
                <p className="font-medium text-foreground">{booking.guestCount}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock size={14} />
                  <span className="text-xs uppercase tracking-wide">Type</span>
                </div>
                <p className="font-medium text-foreground capitalize">{booking.eventType}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-foreground mb-2">Additional Notes</h3>
                <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                  {booking.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Pricing */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Pricing</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Venue Fee ({space?.name})</span>
                <span className="font-medium">MVR {space?.basePriceMVR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (8%)</span>
                <span className="font-medium">MVR {((space?.basePriceMVR || 0) * 0.08).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-serif text-gold">
                  MVR {((space?.basePriceMVR || 0) * 1.08).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="text-xs text-muted-foreground">
            <p>Request submitted: {format(new Date(booking.createdAt), "PPpp")}</p>
            <p>Terms accepted: {format(new Date(booking.agreedAt), "PPpp")}</p>
          </div>
        </div>

        {/* Actions */}
        {booking.status === "pending" && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onReject(booking.id)}
            >
              Reject
            </Button>
            <Button
              className="flex-1 bg-gold-gradient text-primary-foreground hover:opacity-90"
              onClick={() => onApprove(booking.id)}
            >
              Approve & Send Invoice
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
