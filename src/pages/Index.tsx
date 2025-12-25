import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SPACES } from "@/types/booking";
import heroImage from "@/assets/hero-venue.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <p className="text-gold-light text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            Where Elegance Meets Excellence
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream mb-6 leading-tight">
            Pavilion by Gold
          </h1>
          <p className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            An exquisite venue for life's most memorable celebrations. 
            From intimate gatherings to grand galas, create unforgettable moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button 
                size="lg" 
                className="bg-gold-gradient text-primary-foreground hover:opacity-90 px-8 py-6 text-lg"
              >
                Request Booking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/spaces">
              <Button 
                size="lg" 
                variant="outline"
                className="border-charcoal/50 bg-background/80 text-charcoal hover:bg-background px-8 py-6 text-lg"
              >
                Explore Spaces
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/60">
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-px h-8 bg-cream/40 animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">Why Choose Us</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              The Perfect Venue Awaits
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With unparalleled elegance and impeccable service, Pavilion by Gold 
              transforms your vision into an extraordinary reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Luxury Spaces</h3>
              <p className="text-muted-foreground">
                Multiple elegant venues featuring crystal chandeliers, 
                marble floors, and stunning outdoor gardens.
              </p>
            </div>

            <div className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Flexible Capacity</h3>
              <p className="text-muted-foreground">
                From intimate gatherings of 50 to grand celebrations 
                of 500+, we accommodate events of all sizes.
              </p>
            </div>

            <div className="text-center p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">Easy Booking</h3>
              <p className="text-muted-foreground">
                Seamless online booking with instant confirmation, 
                transparent pricing, and dedicated event support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Preview */}
      <section className="py-20 md:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">Our Venues</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Discover Our Spaces
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each space offers its own unique ambiance, designed to complement 
              your vision and create lasting memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SPACES.map((space, index) => (
              <div 
                key={space.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-gold/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-serif text-xl text-foreground mb-2">{space.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{space.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Up to {space.capacity} guests
                  </span>
                  <span className="text-gold font-semibold">
                    From Rf. {space.basePriceMVR.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/book">
              <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90">
                Book Your Event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-charcoal">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold-light text-sm tracking-[0.2em] uppercase mb-3">
            Ready to Begin?
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-6">
            Let's Create Something Extraordinary
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto mb-10">
            Submit your booking request today and our dedicated team will 
            work with you to bring your vision to life.
          </p>
          <Link to="/book">
            <Button 
              size="lg" 
              className="bg-gold-gradient text-primary-foreground hover:opacity-90 px-10 py-6 text-lg"
            >
              Start Your Booking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
