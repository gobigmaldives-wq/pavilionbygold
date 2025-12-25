import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, Palette, Volume2, UtensilsCrossed } from "lucide-react";

export interface ServiceSelections {
  washroomAttendant: boolean;
  decorPackage: string | null;
  avPackage: string | null;
  cateringPackage: string | null;
}

interface AdditionalServicesProps {
  selections: ServiceSelections;
  onSelectionChange: (selections: ServiceSelections) => void;
}

const DECOR_PACKAGES = [
  { id: "classic", name: "Classic", description: "Essential venue styling" },
  { id: "standard", name: "Standard", description: "Premium floral arrangements & lighting" },
  { id: "premium", name: "Premium", description: "Full venue transformation" },
];

const AV_PACKAGES = [
  { id: "basic", name: "Basic AV", description: "Microphone & speakers" },
  { id: "standard", name: "Standard AV", description: "Full sound system & projector" },
  { id: "premium", name: "Premium AV", description: "Professional setup with lighting" },
];

const CATERING_PACKAGES = [
  { id: "silver", name: "Silver Package", description: "Essential menu selection" },
  { id: "gold", name: "Gold Package", description: "Premium menu with variety" },
  { id: "platinum", name: "Platinum Package", description: "Luxury dining experience" },
];

const AdditionalServices = ({ selections, onSelectionChange }: AdditionalServicesProps) => {
  const updateSelection = (key: keyof ServiceSelections, value: boolean | string | null) => {
    onSelectionChange({ ...selections, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
      <h2 className="font-serif text-2xl text-foreground mb-2">Additional Services</h2>
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
              <div className="space-y-1">
                <Label htmlFor="washroomAttendant" className="text-sm font-medium cursor-pointer">
                  Washroom Attendant
                </Label>
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
                  <div>
                    <Label htmlFor={`decor-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                      {pkg.name}
                    </Label>
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
                  <div>
                    <Label htmlFor={`av-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                      {pkg.name}
                    </Label>
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
                  <div>
                    <Label htmlFor={`catering-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                      {pkg.name}
                    </Label>
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
    </div>
  );
};

export default AdditionalServices;
