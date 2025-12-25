import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SPACES, SpaceType } from "@/types/booking";
import heroImage from "@/assets/hero-venue.jpg";
import floor2Image from "@/assets/space-floor2.jpg";

const spaceImages: Record<SpaceType, string> = {
  floor1: heroImage,
  floor1_garden: heroImage,
  floor2: floor2Image,
  entire_venue: heroImage,
};

type Currency = 'MVR' | 'USD';

const SpacesPage = () => {
  const [currency, setCurrency] = useState<Currency>('MVR');

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'MVR' ? 'USD' : 'MVR');
  };

  const formatPrice = (priceMVR: number, priceUSD: number) => {
    if (currency === 'MVR') {
      return `Rf. ${priceMVR.toLocaleString()}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-20">
        <div 
          className="h-[40vh] md:h-[50vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div>
              <p className="text-gold-light text-sm tracking-[0.2em] uppercase mb-3">
                Our Venues
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-4">
                Discover Our Spaces
              </h1>
              <p className="text-cream/80 max-w-2xl mx-auto">
                Each space at Pavilion by Gold offers a unique atmosphere, 
                designed to make your event truly unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          {/* Currency Toggle */}
          <div className="flex justify-center mb-12">
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-gold/30 bg-card hover:bg-muted transition-colors"
            >
              <span className={`font-medium ${currency === 'MVR' ? 'text-gold' : 'text-muted-foreground'}`}>
                MVR
              </span>
              <span className="text-muted-foreground">/</span>
              <span className={`font-medium ${currency === 'USD' ? 'text-gold' : 'text-muted-foreground'}`}>
                USD
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            {SPACES.map((space, index) => (
              <div 
                key={space.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-64 md:h-auto bg-muted relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${spaceImages[space.id]})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                  </div>
                  
                  <div className="md:w-3/5 p-8 md:p-10">
                    <div className="flex items-center gap-2 text-gold text-sm mb-2">
                      <span className="w-8 h-px bg-gold" />
                      <span className="uppercase tracking-widest">Space {index + 1}</span>
                    </div>
                    
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                      {space.name}
                    </h2>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {space.description}. Perfect for events ranging from intimate gatherings 
                      to grand celebrations. Features elegant finishes and modern amenities.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                      <div className="flex items-center gap-2 text-foreground">
                        <Users size={18} className="text-gold" />
                        <span>{space.capacity} Pax Seating</span>
                      </div>
                      <div className="text-2xl font-serif text-gold">
                        {formatPrice(space.basePriceMVR, space.basePriceUSD)}
                        <span className="text-muted-foreground text-sm font-sans ml-1">/day</span>
                      </div>
                    </div>
                    
                    <Link to="/book">
                      <Button className="bg-gold-gradient text-primary-foreground hover:opacity-90">
                        Book This Space
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our events team is here to help you find the perfect space for your celebration.
          </p>
          <Link to="/book">
            <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpacesPage;
