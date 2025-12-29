import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Volume2, UtensilsCrossed, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { SPACES, SpaceType } from "@/types/booking";
import PackageDetailDialog from "./PackageDetailDialog";
import {
  DECOR_PACKAGE_DETAILS,
  AV_PACKAGE_DETAILS,
  CATERING_PACKAGE_DETAILS,
  CATERING_CANOPE_DETAILS,
  CATERING_DINNER_DETAILS,
  DECOR_PRICES_BY_EVENT,
  AV_PRICES_BY_EVENT,
  getPackageDetails,
  PackageDetail,
} from "./packageData";

export interface ServiceSelections {
  decorPackage: string | null;
  avPackage: string | null;
  cateringPackage: string | null;
  bringOwnDecorAV: boolean;
}

interface AdditionalServicesProps {
  selections: ServiceSelections;
  onSelectionChange: (selections: ServiceSelections) => void;
  guestCount: number;
  selectedSpaces: SpaceType[];
  eventType: string;
}

const BRING_OWN_FEE = { priceRf: 60000, priceUsd: 3900 };

const AdditionalServices = ({ selections, onSelectionChange, guestCount, selectedSpaces, eventType }: AdditionalServicesProps) => {
  const [currency, setCurrency] = useState<"rf" | "usd">("rf");
  const [cateringType, setCateringType] = useState<"canope" | "dinner">("dinner");
  const [dialogOpen, setDialogOpen] = useState<{
    type: "decor" | "av" | "catering" | null;
    packageId: string | null;
  }>({ type: null, packageId: null });

  const currentCateringPackages = cateringType === "canope" ? CATERING_CANOPE_DETAILS : CATERING_DINNER_DETAILS;
  
  // Get event-specific pricing
  const decorPrices = DECOR_PRICES_BY_EVENT[eventType] || DECOR_PRICES_BY_EVENT.wedding;
  const avPrices = AV_PRICES_BY_EVENT[eventType] || AV_PRICES_BY_EVENT.wedding;

  const getDecorPrice = (pkgId: string) => {
    const priceKey = pkgId as keyof typeof decorPrices;
    return decorPrices[priceKey] || { rf: 0, usd: 0 };
  };

  const getAvPrice = (pkgId: string) => {
    const priceKey = pkgId as keyof typeof avPrices;
    return avPrices[priceKey] || { rf: 0, usd: 0 };
  };

  const updateSelection = (key: keyof ServiceSelections, value: boolean | string | null) => {
    const newSelections = { ...selections, [key]: value };
    
    // If "bring your own" is selected, clear decor and AV packages
    if (key === "bringOwnDecorAV" && value === true) {
      newSelections.decorPackage = null;
      newSelections.avPackage = null;
    }
    
    // If selecting a decor or AV package, turn off "bring your own"
    if ((key === "decorPackage" || key === "avPackage") && value !== null) {
      newSelections.bringOwnDecorAV = false;
    }
    
    onSelectionChange(newSelections);
  };

  const formatPrice = (priceRf: number, priceUsd: number) => {
    return currency === "rf" ? `Rf. ${priceRf.toLocaleString()}` : `$${priceUsd.toLocaleString()}`;
  };

  const calculateTotal = () => {
    let totalRf = 0;
    let totalUsd = 0;

    // Add all selected spaces' prices
    selectedSpaces.forEach(spaceId => {
      const space = SPACES.find(s => s.id === spaceId);
      if (space) {
        totalRf += space.basePriceMVR;
        totalUsd += space.basePriceUSD;
      }
    });


    if (selections.bringOwnDecorAV) {
      totalRf += BRING_OWN_FEE.priceRf;
      totalUsd += BRING_OWN_FEE.priceUsd;
    }

    if (selections.decorPackage && !selections.bringOwnDecorAV) {
      const price = getDecorPrice(selections.decorPackage);
      totalRf += price.rf;
      totalUsd += price.usd;
    }

    if (selections.avPackage && !selections.bringOwnDecorAV) {
      const price = getAvPrice(selections.avPackage);
      totalRf += price.rf;
      totalUsd += price.usd;
    }

    if (selections.cateringPackage) {
      const pkg = currentCateringPackages.find(p => p.id === selections.cateringPackage);
      if (pkg) {
        totalRf += pkg.priceRf * guestCount;
        totalUsd += pkg.priceUsd * guestCount;
      }
    }

    return { totalRf, totalUsd };
  };

  const openPackageDialog = (type: "decor" | "av" | "catering", packageId: string) => {
    setDialogOpen({ type, packageId });
  };

  const closePackageDialog = () => {
    setDialogOpen((prev) => (prev.type === null && prev.packageId === null ? prev : { type: null, packageId: null }));
  };

  const currentPackageData = dialogOpen.type && dialogOpen.packageId
    ? getPackageDetails(dialogOpen.type, dialogOpen.packageId)
    : null;

  const { totalRf, totalUsd } = calculateTotal();
  const hasSelections = selectedSpaces.length > 0 || selections.decorPackage || selections.avPackage || selections.cateringPackage || selections.bringOwnDecorAV;

  // Check if decor OR AV requirement is met
  const hasDecorOrAV = selections.decorPackage || selections.avPackage || selections.bringOwnDecorAV;

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
      <p className="text-muted-foreground text-sm mb-4">Enhance your event with our premium add-ons</p>

      {/* Mandatory requirement notice */}
      <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-200">Service Requirement</p>
          <p className="text-amber-700 dark:text-amber-300">
            Either a Decor or AV package is mandatory. Catering is exclusively by our partnered caterer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Decor */}
        <Card className={`border-border hover:border-gold/50 transition-colors ${selections.bringOwnDecorAV ? 'opacity-50' : ''}`}>
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
              disabled={selections.bringOwnDecorAV}
            >
              {DECOR_PACKAGE_DETAILS.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`decor-${pkg.id}`} disabled={selections.bringOwnDecorAV} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`decor-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                          {pkg.name}
                        </Label>
                        <button
                          type="button"
                          onClick={() => openPackageDialog("decor", pkg.id)}
                          className="text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(getDecorPrice(pkg.id).rf, getDecorPrice(pkg.id).usd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              {!selections.bringOwnDecorAV && selections.decorPackage && (
                <button
                  type="button"
                  onClick={() => updateSelection("decorPackage", null)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-1"
                >
                  Clear selection
                </button>
              )}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* AV */}
        <Card className={`border-border hover:border-gold/50 transition-colors ${selections.bringOwnDecorAV ? 'opacity-50' : ''}`}>
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
              disabled={selections.bringOwnDecorAV}
            >
              {AV_PACKAGE_DETAILS.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`av-${pkg.id}`} disabled={selections.bringOwnDecorAV} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`av-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                          {pkg.name}
                        </Label>
                        <button
                          type="button"
                          onClick={() => openPackageDialog("av", pkg.id)}
                          className="text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(getAvPrice(pkg.id).rf, getAvPrice(pkg.id).usd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              {!selections.bringOwnDecorAV && selections.avPackage && (
                <button
                  type="button"
                  onClick={() => updateSelection("avPackage", null)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-1"
                >
                  Clear selection
                </button>
              )}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Catering */}
        <Card className="border-border hover:border-gold/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <UtensilsCrossed className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Catering</CardTitle>
                  <p className="text-xs text-muted-foreground">Gold Catering (exclusive partner)</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  type="button"
                  variant={cateringType === "canope" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => setCateringType("canope")}
                >
                  Canopé
                </Button>
                <Button
                  type="button"
                  variant={cateringType === "dinner" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => setCateringType("dinner")}
                >
                  Dinner
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selections.cateringPackage || ""}
              onValueChange={(value) => updateSelection("cateringPackage", value || null)}
            >
              {currentCateringPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-start space-x-3 py-1">
                  <RadioGroupItem value={pkg.id} id={`catering-${cateringType}-${pkg.id}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`catering-${cateringType}-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                          {pkg.name}
                        </Label>
                        <button
                          type="button"
                          onClick={() => openPackageDialog("catering", pkg.id)}
                          className="text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </div>
                </div>
              ))}
              {selections.cateringPackage && (
                <button
                  type="button"
                  onClick={() => updateSelection("cateringPackage", null)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-1"
                >
                  Clear selection
                </button>
              )}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Bring Your Own Decorator/AV Banner */}
      <div className="mt-6">
        <div 
          className={`relative overflow-hidden rounded-xl border-2 transition-all ${
            selections.bringOwnDecorAV 
              ? 'border-gold bg-gold/10' 
              : 'border-border bg-gradient-to-r from-muted/50 to-muted hover:border-gold/50'
          }`}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-4">
              <Checkbox
                id="bringOwnDecorAV"
                checked={selections.bringOwnDecorAV}
                onCheckedChange={(checked) => updateSelection("bringOwnDecorAV", checked as boolean)}
                className="h-5 w-5"
              />
              <div>
                <h3 className="font-semibold text-foreground">Bring Your Own Decorator or AV Services</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Prefer to work with your own decorator or AV team? A venue coordination fee applies.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-gold">
                {formatPrice(BRING_OWN_FEE.priceRf, BRING_OWN_FEE.priceUsd)}
              </p>
              <p className="text-xs text-muted-foreground">Coordination fee</p>
            </div>
          </div>
          {selections.bringOwnDecorAV && (
            <div className="bg-gold/20 px-4 py-2 text-sm text-foreground">
              <span className="font-medium">Note:</span> This option replaces in-house Decor & AV packages. Catering remains exclusive to our partner.
            </div>
          )}
        </div>
      </div>

      {/* Validation message */}
      {!hasDecorOrAV && selectedSpaces.length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            Please select at least one Decor package, AV package, or choose to bring your own.
          </p>
        </div>
      )}

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

      {/* Package Detail Dialog */}
      {currentPackageData && dialogOpen.type && (
        <PackageDetailDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) closePackageDialog();
          }}
          packageType={dialogOpen.type}
          packageData={currentPackageData}
        />
      )}
    </div>
  );
};

export default AdditionalServices;
