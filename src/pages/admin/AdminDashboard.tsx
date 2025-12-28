import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, List, Filter, Plus, Loader2, LogOut } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [spaceFilter, setSpaceFilter] = useState<string>("all");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (!authLoading && user && !isAdmin) {
      toast.error('Access denied', {
        description: 'You do not have admin privileges.',
      });
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Fetch bookings from database
  useEffect(() => {
    if (user && isAdmin) {
      fetchBookings();
    }
  }, [user, isAdmin]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings', {
        description: 'An error occurred. Please try again.',
      });
    } else if (data) {
      // Map database fields to BookingRequest type
      const mappedBookings: BookingRequest[] = data.map((booking) => ({
        id: booking.id,
        fullName: booking.full_name,
        phone: booking.phone,
        email: booking.email,
        companyName: booking.company_name || undefined,
        eventType: booking.event_type,
        eventDate: booking.event_date,
        space: booking.space,
        guestCount: booking.guest_count,
        notes: booking.notes || undefined,
        agreedToRules: booking.agreed_to_rules,
        agreedAt: booking.agreed_at || '',
        status: booking.status,
        createdAt: booking.created_at,
      }));
      setBookings(mappedBookings);
    }
    setLoading(false);
  };

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

  const handleApprove = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (error) {
      console.error('Failed to approve booking:', error);
      toast.error('Failed to approve booking', {
        description: 'An error occurred. Please try again.',
      });
    } else {
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: "approved" as BookingStatus } : b)
      );
      setModalOpen(false);
      toast.success("Booking approved!", {
        description: "Invoice will be sent to the client.",
      });
    }
  };

  const handleReject = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', bookingId);

    if (error) {
      console.error('Failed to reject booking:', error);
      toast.error('Failed to reject booking', {
        description: 'An error occurred. Please try again.',
      });
    } else {
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: "rejected" as BookingStatus } : b)
      );
      setModalOpen(false);
      toast.info("Booking rejected", {
        description: "The client has been notified.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

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
          
          <div className="flex items-center gap-3">
            <Button className="bg-gold-gradient text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
            <p className="text-3xl font-serif text-foreground">$0</p>
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