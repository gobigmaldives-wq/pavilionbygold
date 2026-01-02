import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Image } from "lucide-react";

interface WeddingExample {
  name: string;
  date: string;
  guestCount: number;
}

interface PackageDetail {
  id: string;
  name: string;
  description: string;
  priceRf: number;
  priceUsd: number;
  includes: string[];
  weddings: WeddingExample[];
}

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageType: "decor" | "av" | "catering";
  packageData: PackageDetail;
}

const PackageDetailDialog = ({
  open,
  onOpenChange,
  packageType,
  packageData,
}: PackageDetailDialogProps) => {
  const getTypeLabel = () => {
    switch (packageType) {
      case "decor":
        return "Decor Package";
      case "av":
        return "Audio Visual Package";
      case "catering":
        return "Catering Package";
    }
  };

  const getTypeColor = () => {
    switch (packageType) {
      case "decor":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "av":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "catering":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getTypeColor()}>{getTypeLabel()}</Badge>
          </div>
          <DialogTitle className="font-serif text-2xl">
            {packageData.name}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">{packageData.description}</p>
          <div className="text-gold font-semibold text-lg">
            Rf. {packageData.priceRf.toLocaleString()} / ${packageData.priceUsd.toLocaleString()}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* What's Included */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-gold" />
              What's Included
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {packageData.includes.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Past Weddings / Menu Images */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Image className="h-4 w-4 text-gold" />
              {packageType === "catering" ? "Images of menus in catering" : "Weddings with this Package"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {packageData.weddings.map((wedding, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-3 border border-border"
                >
                  <div className="aspect-video bg-gradient-to-br from-gold/20 to-gold/5 rounded-md mb-2 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gold/40" />
                  </div>
                  <p className="font-medium text-sm text-foreground">{wedding.name}</p>
                  <p className="text-xs text-muted-foreground">{wedding.date}</p>
                  <p className="text-xs text-muted-foreground">{wedding.guestCount} guests</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailDialog;
