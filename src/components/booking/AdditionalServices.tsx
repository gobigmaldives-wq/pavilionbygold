import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Volume2, UtensilsCrossed, Info, AlertTriangle, Copy, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SpaceType, getSpacesForDate } from "@/types/booking";
import PackageDetailDialog from "./PackageDetailDialog";
import {
  DECOR_PACKAGE_DETAILS,
  AV_PACKAGE_DETAILS,
  CATERING_PACKAGE_DETAILS,
  CATERING_CANOPE_DETAILS,
  CATERING_IFTAR_DETAILS,
  CATERING_DINNER_DETAILS,
  CATERING_CANOPE_BY_EVENT,
  CATERING_DINNER_BY_EVENT,
  DECOR_PRICES_BY_EVENT,
  AV_PRICES_BY_EVENT,
  AV_DETAILS_BY_EVENT,
  DECOR_DETAILS_BY_EVENT,
  getPackageDetails,
  PackageDetail,
} from "./packageData";

export interface ServiceSelections {
  decorPackage: string | null;
  avPackage: string | null;
  cateringPackage: string | null;
  bringOwnDecorAV: boolean;
}

export type PaymentOption = "option1" | "option2" | "option3";

interface AdditionalServicesProps {
  selections: ServiceSelections;
  onSelectionChange: (selections: ServiceSelections) => void;
  guestCount: number;
  selectedSpaces: SpaceType[];
  eventType: string;
  eventDate?: Date;
  paymentOption: PaymentOption;
  onPaymentOptionChange: (option: PaymentOption) => void;
  transferSlip: File | null;
  onTransferSlipChange: (file: File | null) => void;
}

const BRING_OWN_FEE = { priceRf: 60000, priceUsd: 3900 };

const AdditionalServices = ({ selections, onSelectionChange, guestCount, selectedSpaces, eventType, eventDate, paymentOption, onPaymentOptionChange, transferSlip, onTransferSlipChange }: AdditionalServicesProps) => {
  const { toast } = useToast();
  const [currency, setCurrency] = useState<"rf" | "usd">("rf");
  const [cateringType, setCateringType] = useState<"canope" | "dinner" | "iftar">("dinner");
  const [dialogOpen, setDialogOpen] = useState<{
    type: "decor" | "av" | "catering" | null;
    packageId: string | null;
  }>({ type: null, packageId: null });

  // For Ramadan, use Iftar packages; otherwise use selected catering type based on event
  const isRamadan = eventType === "ramadan";
  const currentCateringPackages = isRamadan 
    ? CATERING_IFTAR_DETAILS 
    : (cateringType === "canope" 
        ? (CATERING_CANOPE_BY_EVENT[eventType] || CATERING_CANOPE_DETAILS)
        : (CATERING_DINNER_BY_EVENT[eventType] || CATERING_DINNER_DETAILS));
  
  // Get event-specific pricing and package details
  const decorPrices = DECOR_PRICES_BY_EVENT[eventType] || DECOR_PRICES_BY_EVENT.wedding;
  const avPrices = AV_PRICES_BY_EVENT[eventType] || AV_PRICES_BY_EVENT.wedding;
  const currentAvPackages = AV_DETAILS_BY_EVENT[eventType] || AV_PACKAGE_DETAILS;
  const currentDecorPackages = DECOR_DETAILS_BY_EVENT[eventType] || DECOR_PACKAGE_DETAILS;

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

  const calculateCategoryTotals = () => {
    let venueRf = 0, venueUsd = 0;
    let decorRf = 0, decorUsd = 0;
    let avRf = 0, avUsd = 0;
    let cateringRf = 0, cateringUsd = 0;

    // Venue charges (spaces)
    const spacesForDate = getSpacesForDate(eventDate);
    selectedSpaces.forEach(spaceId => {
      const space = spacesForDate.find(s => s.id === spaceId);
      if (space) {
        venueRf += space.basePriceMVR;
        venueUsd += space.basePriceUSD;
      }
    });

    // Bring own fee counts as venue coordination
    if (selections.bringOwnDecorAV) {
      venueRf += BRING_OWN_FEE.priceRf;
      venueUsd += BRING_OWN_FEE.priceUsd;
    }

    // Decor charges
    if (selections.decorPackage && !selections.bringOwnDecorAV) {
      const price = getDecorPrice(selections.decorPackage);
      decorRf += price.rf;
      decorUsd += price.usd;
    }

    // AV charges
    if (selections.avPackage && !selections.bringOwnDecorAV) {
      const price = getAvPrice(selections.avPackage);
      avRf += price.rf;
      avUsd += price.usd;
    }

    // Catering charges
    if (selections.cateringPackage) {
      const pkg = currentCateringPackages.find(p => p.id === selections.cateringPackage);
      if (pkg) {
        cateringRf += pkg.priceRf * guestCount;
        cateringUsd += pkg.priceUsd * guestCount;
      }
    }

    return {
      venue: { rf: venueRf, usd: venueUsd },
      decor: { rf: decorRf, usd: decorUsd },
      av: { rf: avRf, usd: avUsd },
      catering: { rf: cateringRf, usd: cateringUsd },
      total: {
        rf: venueRf + decorRf + avRf + cateringRf,
        usd: venueUsd + decorUsd + avUsd + cateringUsd
      }
    };
  };

  const calculatePaymentAmount = (option: PaymentOption) => {
    const cats = calculateCategoryTotals();
    let payRf = 0, payUsd = 0;

    switch (option) {
      case "option1":
        // 100% Venue only
        payRf = cats.venue.rf;
        payUsd = cats.venue.usd;
        break;
      case "option2":
        // 50% of all selected services
        payRf = cats.total.rf * 0.5;
        payUsd = cats.total.usd * 0.5;
        break;
      case "option3":
        // 100% all selected services
        payRf = cats.total.rf;
        payUsd = cats.total.usd;
        break;
    }

    return { rf: Math.round(payRf), usd: Math.round(payUsd) };
  };

  const calculateTotal = () => {
    const cats = calculateCategoryTotals();
    return { totalRf: cats.total.rf, totalUsd: cats.total.usd };
  };

  const openPackageDialog = (type: "decor" | "av" | "catering", packageId: string) => {
    setDialogOpen({ type, packageId });
  };

  const closePackageDialog = () => {
    setDialogOpen((prev) => (prev.type === null && prev.packageId === null ? prev : { type: null, packageId: null }));
  };

  const currentPackageData = dialogOpen.type && dialogOpen.packageId
    ? (() => {
        if (dialogOpen.type === "catering") {
          return currentCateringPackages.find((p) => p.id === dialogOpen.packageId);
        }
        return getPackageDetails(dialogOpen.type, dialogOpen.packageId, eventType);
      })()
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

      {/* For Ramadan: Iftar full-width on top, then Decor/AV below */}
      {isRamadan && (
        <Card className="border-border hover:border-gold/50 transition-colors mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">Iftar Packages</CardTitle>
                <p className="text-xs text-muted-foreground">Per person Iftar pricing</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {currentCateringPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => updateSelection("cateringPackage", selections.cateringPackage === pkg.id ? null : pkg.id)}
                  className={`relative p-2 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[140px] sm:min-h-[180px] ${
                    selections.cateringPackage === pkg.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50 bg-muted/30'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-1 sm:gap-2 h-full justify-between">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm">{pkg.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-1">{pkg.description}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm sm:text-lg font-bold text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPackageDialog("catering", pkg.id);
                        }}
                        className="mt-1 sm:mt-2 h-auto px-2 sm:px-3 py-1 sm:py-0 text-[10px] sm:text-xs whitespace-normal leading-tight flex-col sm:flex-row gap-0.5 sm:gap-1"
                      >
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden text-center">View<br />Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selections.cateringPackage && (
              <button
                type="button"
                onClick={() => updateSelection("cateringPackage", null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-3"
              >
                Clear selection
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decor - Full width */}
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
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {currentDecorPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => !selections.bringOwnDecorAV && updateSelection("decorPackage", selections.decorPackage === pkg.id ? null : pkg.id)}
                className={`relative p-2 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[140px] sm:min-h-[180px] ${
                  selections.decorPackage === pkg.id
                    ? 'border-gold bg-gold/10'
                    : 'border-border hover:border-gold/50 bg-muted/30'
                } ${selections.bringOwnDecorAV ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2 h-full justify-between">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm">{pkg.name}</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-1">{pkg.description}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-lg font-bold text-gold">
                      {formatPrice(getDecorPrice(pkg.id).rf, getDecorPrice(pkg.id).usd)}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPackageDialog("decor", pkg.id);
                      }}
                      className="mt-1 sm:mt-2 h-auto px-2 sm:px-3 py-1 sm:py-0 text-[10px] sm:text-xs whitespace-normal leading-tight flex-col sm:flex-row gap-0.5 sm:gap-1"
                    >
                      <Eye className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden text-center">View<br />Details</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!selections.bringOwnDecorAV && selections.decorPackage && (
            <button
              type="button"
              onClick={() => updateSelection("decorPackage", null)}
              className="text-xs text-muted-foreground hover:text-foreground mt-3"
            >
              Clear selection
            </button>
          )}
        </CardContent>
      </Card>

      {/* AV - Full width */}
      <Card className={`border-border hover:border-gold/50 transition-colors mt-4 ${selections.bringOwnDecorAV ? 'opacity-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Volume2 className="h-5 w-5 text-gold" />
            </div>
            <CardTitle className="text-base font-medium">Audio Visual</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {currentAvPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => !selections.bringOwnDecorAV && updateSelection("avPackage", selections.avPackage === pkg.id ? null : pkg.id)}
                className={`relative p-2 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[140px] sm:min-h-[180px] ${
                  selections.avPackage === pkg.id
                    ? 'border-gold bg-gold/10'
                    : 'border-border hover:border-gold/50 bg-muted/30'
                } ${selections.bringOwnDecorAV ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2 h-full justify-between">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm">{pkg.name}</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-1">{pkg.description}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-lg font-bold text-gold">
                      {formatPrice(getAvPrice(pkg.id).rf, getAvPrice(pkg.id).usd)}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPackageDialog("av", pkg.id);
                      }}
                      className="mt-1 sm:mt-2 h-auto px-2 sm:px-3 py-1 sm:py-0 text-[10px] sm:text-xs whitespace-normal leading-tight flex-col sm:flex-row gap-0.5 sm:gap-1"
                    >
                      <Eye className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden text-center">View<br />Details</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!selections.bringOwnDecorAV && selections.avPackage && (
            <button
              type="button"
              onClick={() => updateSelection("avPackage", null)}
              className="text-xs text-muted-foreground hover:text-foreground mt-3"
            >
              Clear selection
            </button>
          )}
        </CardContent>
      </Card>

      {/* Catering - only for non-Ramadan events - Full width */}
      {!isRamadan && (
        <Card className="border-border hover:border-gold/50 transition-colors mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <UtensilsCrossed className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Catering</CardTitle>
                  <p className="text-xs text-muted-foreground">Exclusive partner</p>
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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {currentCateringPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => updateSelection("cateringPackage", selections.cateringPackage === pkg.id ? null : pkg.id)}
                  className={`relative p-2 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[140px] sm:min-h-[180px] ${
                    selections.cateringPackage === pkg.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50 bg-muted/30'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-1 sm:gap-2 h-full justify-between">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm">{pkg.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-1">{pkg.description}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm sm:text-lg font-bold text-gold">
                        {formatPrice(pkg.priceRf, pkg.priceUsd)}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPackageDialog("catering", pkg.id);
                        }}
                        className="mt-1 sm:mt-2 h-auto px-2 sm:px-3 py-1 sm:py-0 text-[10px] sm:text-xs whitespace-normal leading-tight flex-col sm:flex-row gap-0.5 sm:gap-1"
                      >
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden text-center">View<br />Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selections.cateringPackage && (
              <button
                type="button"
                onClick={() => updateSelection("cateringPackage", null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-3"
              >
                Clear selection
              </button>
            )}
          </CardContent>
        </Card>
      )}

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
                  <span className="font-medium text-foreground">External Vendor Access & Operations Fee:</span> If you choose to engage your own decorator or AV service provider, this fee applies to cover controlled venue access, scheduling and setup windows, power and utility usage, and required on-site operational support during installation, the event, and dismantling.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-gold">
                {formatPrice(BRING_OWN_FEE.priceRf, BRING_OWN_FEE.priceUsd)}
              </p>
              <p className="text-xs text-muted-foreground">External Vendor Access<br />& Operations Fee</p>
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

      {/* Choose Booking Amount to Pay */}
      {hasSelections && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Choose Booking Amount to Pay</h3>
          <RadioGroup value={paymentOption} onValueChange={(val) => onPaymentOptionChange(val as PaymentOption)} className="space-y-3">
            <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${paymentOption === "option1" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}>
              <RadioGroupItem value="option1" id="payOption1" className="mt-1" />
              <Label htmlFor="payOption1" className="flex-1 cursor-pointer">
                <div className="font-medium text-foreground">Option 1 – Venue Only Deposit</div>
                <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <li>• 100% Venue Charges now</li>
                  <li className="text-amber-600 dark:text-amber-400">• Remaining services balance due 7 days before event</li>
                </ul>
                <div className="text-sm font-semibold text-gold mt-2">
                  Amount: {formatPrice(calculatePaymentAmount("option1").rf, calculatePaymentAmount("option1").usd)}
                </div>
              </Label>
            </div>
            
            <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${paymentOption === "option2" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}>
              <RadioGroupItem value="option2" id="payOption2" className="mt-1" />
              <Label htmlFor="payOption2" className="flex-1 cursor-pointer">
                <div className="font-medium text-foreground">Option 2 – 50% Deposit</div>
                <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <li>• 50% of all selected services now</li>
                  <li className="text-amber-600 dark:text-amber-400">• Remaining 50% due 7 days before event</li>
                </ul>
                <div className="text-sm font-semibold text-gold mt-2">
                  Amount: {formatPrice(calculatePaymentAmount("option2").rf, calculatePaymentAmount("option2").usd)}
                </div>
              </Label>
            </div>
            
            <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${paymentOption === "option3" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}>
              <RadioGroupItem value="option3" id="payOption3" className="mt-1" />
              <Label htmlFor="payOption3" className="flex-1 cursor-pointer">
                <div className="font-medium text-foreground">Option 3 – Full Payment</div>
                <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <li>• 100% of all selected services now</li>
                  <li className="text-green-600 dark:text-green-400">• No balance remaining</li>
                </ul>
                <div className="text-sm font-semibold text-gold mt-2">
                  Amount: {formatPrice(calculatePaymentAmount("option3").rf, calculatePaymentAmount("option3").usd)}
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Pay for Booking */}
      {hasSelections && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pay for Booking</h3>
          
          {/* Selected Payment Amount */}
          <div className="mb-4 p-3 bg-gold/10 rounded-lg border border-gold/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Amount to Pay</span>
              <span className="text-lg font-bold text-gold">
                {formatPrice(calculatePaymentAmount(paymentOption).rf, calculatePaymentAmount(paymentOption).usd)}
              </span>
            </div>
          </div>
          
          {/* Bank Account Details */}
          <div className="space-y-4 mb-4">
            <p className="text-sm text-muted-foreground">Bank Account Details for Transfer:</p>
            
            {/* BML Account */}
            <div className="p-3 bg-background rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">BML (Bank of Maldives)</h4>
              <p className="text-sm text-muted-foreground mb-2">Account Name: <span className="text-foreground font-medium">Gold Company Pvt Ltd</span></p>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded">
                  <div className="text-sm">
                    <span className="text-muted-foreground">MVR: </span>
                    <span className="font-mono text-foreground">7730000755659</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("7730000755659");
                      toast({ title: "Copied!", description: "BML MVR account number copied to clipboard" });
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded">
                  <div className="text-sm">
                    <span className="text-muted-foreground">USD: </span>
                    <span className="font-mono text-foreground">7730000755660</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("7730000755660");
                      toast({ title: "Copied!", description: "BML USD account number copied to clipboard" });
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* MIB Account */}
            <div className="p-3 bg-background rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">MIB (Maldives Islamic Bank)</h4>
              <p className="text-sm text-muted-foreground mb-2">Account Name: <span className="text-foreground font-medium">GOLD COMPANY</span></p>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded">
                  <div className="text-sm">
                    <span className="text-muted-foreground">MVR: </span>
                    <span className="font-mono text-foreground">90101480043431000</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("90101480043431000");
                      toast({ title: "Copied!", description: "MIB MVR account number copied to clipboard" });
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded">
                  <div className="text-sm">
                    <span className="text-muted-foreground">USD: </span>
                    <span className="font-mono text-foreground">90101480043432000</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("90101480043432000");
                      toast({ title: "Copied!", description: "MIB USD account number copied to clipboard" });
                    }}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Slip Upload */}
          <div className="pt-4 border-t border-border">
            <Label htmlFor="transferSlip" className="text-sm font-medium text-foreground">
              Attach Transfer Slip
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              After making payment, upload your transfer slip as proof of payment.
            </p>
            
            {transferSlip ? (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{transferSlip.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(transferSlip.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onTransferSlipChange(null)}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <input
                type="file"
                id="transferSlip"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onTransferSlipChange(file);
                }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
              />
            )}
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
