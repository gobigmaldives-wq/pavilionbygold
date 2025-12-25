import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Volume2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { SPACES, SpaceType } from "@/types/booking";

export interface ServiceSelections {
  washroomAttendant: boolean;
  decorPackage: string | null;
  avPackage: string | null;
  cateringPackage: string | null;
}

interface AdditionalServicesProps {
  selections: ServiceSelections;
  onSelectionChange: (selections: ServiceSelections) => void;
  guestCount: number;
  selectedSpace: SpaceType | null;
}

const DECOR_PACKAGES = [
  { id: "classic", name: "Classic", description: "Essential venue styling", priceRf: 20000, priceUsd: 1300 },
  { id: "standard", name: "Standard", description: "Premium floral arrangements & lighting", priceRf: 50000, priceUsd: 3240 },
  { id: "premium", name: "Premium", description: "Full venue transformation", priceRf: 100000, priceUsd: 6485 },
];

const AV_PACKAGES = [
  { id: "basic", name: "Basic AV", description: "Microphone & speakers", priceRf: 15000, priceUsd: 975 },
  { id: "standard", name: "Standard AV", description: "Full sound system & projector", priceRf: 30000, priceUsd: 1950 },
  { id: "premium", name: "Premium AV", description: "Professional setup with lighting", priceRf: 50000, priceUsd: 3245 },
];

const CATERING_PACKAGES = [
  { id: "silver", name: "Silver Package", description: "Per person", priceRf: 160, priceUsd: 9 },
  { id: "gold", name: "Gold Package", description: "Per person", priceRf: 190, priceUsd: 12.5 },
  { id: "platinum", name: "Platinum Package", description: "Per person", priceRf: 230, priceUsd: 15 },
];

const VENUE_UPGRADES = {
  washroomAttendant: { priceRf: 2000, priceUsd: 130 },
};

const AdditionalServices = ({ selections, onSelectionChange, guestCount, selectedSpace }: AdditionalServicesProps) => {
  const [currency, setCurrency] = useState<"rf" | "usd">("rf");

  const updateSelection = (key: keyof ServiceSelections, value: boolean | string | null) => {
    onSelectionChange({ ...selections, [key]: value });
  };

  const formatPrice = (priceRf: number, priceUsd: number) => {
    return currency === "rf" ? `Rf. ${priceRf.toLocaleString()}` : `$${priceUsd.toLocaleString()}`;
  };

  const calculateTotal = () => {
    let totalRf = 0;
    let totalUsd = 0;

    // Add space price
    if (selectedSpace) {
      const space = SPACES.find(s => s.id === selectedSpace);
      if (space) {
        totalRf += space.basePriceMVR;
        totalUsd += space.basePriceUSD;
      }
    }

    if (selections.washroomAttendant) {
      totalRf += VENUE_UPGRADES.washroomAttendant.priceRf;
      totalUsd += VENUE_UPGRADES.washroomAttendant.priceUsd;
    }

    if (selections.decorPackage) {
      const pkg = DECOR_PACKAGES.find(p => p.id === selections.decorPackage);
      if (pkg) {
        totalRf += pkg.priceRf;
        totalUsd += pkg.priceUsd;
      }
    }

    if (selections.avPackage) {
      const pkg = AV_PACKAGES.find(p => p.id === selections.avPackage);
      if (pkg) {
        totalRf += pkg.priceRf;
        totalUsd += pkg.priceUsd;
      }
    }

    if (selections.cateringPackage) {
      const pkg = CATERING_PACKAGES.find(p => p.id === selections.cateringPackage);
      if (pkg) {
        totalRf += pkg.priceRf * guestCount;
        totalUsd += pkg.priceUsd * guestCount;
      }
    }

    return { totalRf, totalUsd };
  };

  const { totalRf, totalUsd } = calculateTotal();
  const hasSelections = selectedSpace || selections.washroomAttendant || selections.decorPackage || selections.avPackage || selections.cateringPackage;

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif text-2xl text-foreground">Additional Services</h2>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            type="button"
            variant={currency === "rf" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setCurrency("rf")}
          >
            Rf.
          </Button>
          <Button
            type="button"
            variant={currency === "usd" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setCurrency("usd")}
          >
            USD
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-6">Enhance your event with our premium add-ons (Optional)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Washroom Attendant */}
        <Card className="border-border hover:border-gold/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <CardTitle className="text-base font-medium">Venue Upgrades</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="washroomAttendant"
                checked={selections.washroomAttendant}
                onCheckedChange={(checked) => updateSelection("washroomAttendant", checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="washroomAttendant" className="text-sm font-medium cursor-pointer">
                    Washroom Attendant
                  </Label>
                  <span className="text-sm font-medium text-gold">
                    {formatPrice(VENUE_UPGRADES.washroomAttendant.priceRf, VENUE_UPGRADES.washroomAttendant.priceUsd)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Professional attendant service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decor */}
        <Card className="border-border hover:border-gold/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Palette className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">Decor</CardTitle>
                <p className="text-xs text-muted-foreground">In-house packages</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selections.decorPackage || ""}
              onValueChange={(value) => updateSelection("decorPackage", value || null)}
            >
              {DECOR_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`decor-${pkg.id}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`decor-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                        {pkg.name}
                      </Label>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateSelection("decorPackage", null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                Clear selection
              </button>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* AV */}
        <Card className="border-border hover:border-gold/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Volume2 className="h-5 w-5 text-gold" />
              </div>
              <CardTitle className="text-base font-medium">Audio Visual</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selections.avPackage || ""}
              onValueChange={(value) => updateSelection("avPackage", value || null)}
            >
              {AV_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`av-${pkg.id}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`av-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                        {pkg.name}
                      </Label>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateSelection("avPackage", null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                Clear selection
              </button>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Catering */}
        <Card className="border-border hover:border-gold/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">Catering</CardTitle>
                <p className="text-xs text-muted-foreground">Gold Catering (in-house)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selections.cateringPackage || ""}
              onValueChange={(value) => updateSelection("cateringPackage", value || null)}
            >
              {CATERING_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`catering-${pkg.id}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`catering-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                        {pkg.name}
                      </Label>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateSelection("cateringPackage", null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                Clear selection
              </button>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Running Total */}
      {hasSelections && (
        <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">All Selected Services Total</span>
            <span className="text-lg font-semibold text-gold">
              {currency === "rf" ? `Rf. ${totalRf.toLocaleString()}` : `$${totalUsd.toLocaleString()}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServices;
