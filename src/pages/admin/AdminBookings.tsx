import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSidebar from "@/components/admin/AdminSidebar";
import BookingList from "@/components/admin/BookingList";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import { BookingRequest, SPACES, BookingStatus } from "@/types/booking";
import { toast } from "sonner";

// Mock data
const mockBookings: BookingRequest[] = [
  {
    id: "1",
    fullName: "Sarah Johnson",
    phone: "+1 555-123-4567",
    email: "sarah.j@email.com",
    companyName: "Johnson Events",
    eventType: "wedding",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    space: "entire_venue",
    guestCount: 350,
    notes: "Looking for full wedding package with outdoor ceremony.",
    agreedToRules: true,
    agreedAt: new Date().toISOString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    fullName: "Michael Chen",
    phone: "+1 555-987-6543",
    email: "m.chen@company.com",
    companyName: "Tech Corp",
    eventType: "corporate",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    space: "floor1",
    guestCount: 150,
    notes: "Annual company gala, need AV setup.",
    agreedToRules: true,
    agreedAt: new Date().toISOString(),
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    fullName: "Amira Hassan",
    phone: "+1 555-456-7890",
    email: "amira.h@gmail.com",
    eventType: "ramadan",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    space: "floor2",
    guestCount: 120,
    agreedToRules: true,
    agreedAt: new Date().toISOString(),
    status: "confirmed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [spaceFilter, setSpaceFilter] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSpace = spaceFilter === "all" || booking.space === spaceFilter;
    return matchesSearch && matchesStatus && matchesSpace;
  });

  const handleViewBooking = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleApprove = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "approved" as BookingStatus } : b)
    );
    setModalOpen(false);
    toast.success("Booking approved!");
  };

  const handleReject = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "rejected" as BookingStatus } : b)
    );
    setModalOpen(false);
    toast.info("Booking rejected");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all booking requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={spaceFilter} onValueChange={setSpaceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Space" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Spaces</SelectItem>
              {SPACES.map(space => (
                <SelectItem key={space.id} value={space.id}>{space.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <BookingList
          bookings={filteredBookings}
          onViewBooking={handleViewBooking}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <BookingDetailModal
          booking={selectedBooking}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </div>
  );
};

export default AdminBookings;
