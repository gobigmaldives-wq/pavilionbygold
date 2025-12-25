import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BookingSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-gold" />
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Booking Request Received!
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your interest in Pavilion by Gold. We've received your 
              booking request and our team will review it shortly.
            </p>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8">
              <h2 className="font-serif text-xl text-foreground mb-6">What Happens Next?</h2>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Review Process</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team will review your request and check availability within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Confirmation Email</h3>
                    <p className="text-muted-foreground text-sm">
                      You'll receive an email with your booking details and an invoice for the deposit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Personal Consultation</h3>
                    <p className="text-muted-foreground text-sm">
                      A member of our events team will contact you to discuss your requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" size="lg">
                  Return Home
                </Button>
              </Link>
              <Link to="/spaces">
                <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90">
                  Explore Our Spaces
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccess;
