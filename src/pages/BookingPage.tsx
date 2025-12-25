import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";

const BookingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">
              Reserve Your Date
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Request a Booking
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete the form below to submit your booking request. Our team will 
              review your request and contact you within 24 hours to confirm availability.
            </p>
          </div>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
