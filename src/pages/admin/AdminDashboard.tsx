import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, List, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminCalendar from "@/components/admin/AdminCalendar";
import BookingList from "@/components/admin/BookingList";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import { BookingRequest, SPACES, BookingStatus } from "@/types/booking";
import { toast } from "sonner";

// Mock data for demonstration
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
  {
    id: "4",
    fullName: "David Miller",
    phone: "+1 555-321-0987",
    email: "david.m@email.com",
    eventType: "private",
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    space: "floor1_garden",
    guestCount: 80,
    notes: "Birthday celebration, outdoor preferred.",
    agreedToRules: true,
    agreedAt: new Date().toISOString(),
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [spaceFilter, setSpaceFilter] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSpace = spaceFilter === "all" || booking.space === spaceFilter;
    const matchesDate = !selectedDate || isSameDay(new Date(booking.eventDate), selectedDate);
    return matchesStatus && matchesSpace && matchesDate;
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
    toast.success("Booking approved!", {
      description: "Invoice has been sent to the client.",
    });
  };

  const handleReject = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "rejected" as BookingStatus } : b)
    );
    setModalOpen(false);
    toast.info("Booking rejected", {
      description: "The client has been notified.",
    });
  };

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Manage venue bookings and events</p>
          </div>
          
          <Button className="bg-gold-gradient text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
            <p className="text-3xl font-serif text-gold">{pendingCount}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Confirmed Events</p>
            <p className="text-3xl font-serif text-foreground">{confirmedCount}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
            <p className="text-3xl font-serif text-foreground">{bookings.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">This Month Revenue</p>
            <p className="text-3xl font-serif text-foreground">$24,500</p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
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

              {selectedDate && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear Date
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="calendar" className="space-y-6">
            <AdminCalendar 
              bookings={bookings} 
              onDateClick={setSelectedDate}
              selectedDate={selectedDate}
            />
            
            {selectedDate && (
              <div>
                <h3 className="font-serif text-xl mb-4">
                  Bookings for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <BookingList
                  bookings={filteredBookings}
                  onViewBooking={handleViewBooking}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <BookingList
              bookings={filteredBookings}
              onViewBooking={handleViewBooking}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        </Tabs>
      </main>

      <BookingDetailModal
        booking={selectedBooking}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminDashboard;
