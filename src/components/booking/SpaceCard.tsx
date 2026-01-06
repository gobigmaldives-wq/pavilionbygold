import { Space, PRE_OPENING_CUTOFF } from "@/types/booking";
import { Users, Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpaceCardProps {
  space: Space;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  disabledReason?: string;
  currency: "rf" | "usd";
  eventDate?: Date;
}

const SpaceCard = ({ space, selected, onSelect, disabled, disabledReason, currency, eventDate }: SpaceCardProps) => {
  const isPreOpeningRate = !eventDate || eventDate < PRE_OPENING_CUTOFF;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative w-full p-5 sm:p-6 rounded-lg border-2 text-left transition-all duration-300",
        "min-h-[160px] sm:min-h-[180px]",
        "hover:shadow-lg hover:border-gold/50",
        selected 
          ? "border-gold bg-gold/5 shadow-lg" 
          : "border-border bg-card",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:border-border"
      )}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
          <Check size={14} className="text-primary-foreground" />
        </div>
      )}
      
      <h3 className="font-serif text-lg text-foreground mb-2">{space.name}</h3>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {space.description}
      </p>
      {disabled && disabledReason && (
        <p className="text-xs text-amber-600 mb-3 italic">{disabledReason}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Seating: {space.capacity} pax</span>
          </div>
          <span className="ml-6">Max Capacity: {space.maxCapacity}</span>
        </div>
        <div className="text-right">
          <div className="text-gold font-semibold">
            {currency === "rf" 
              ? `Rf. ${space.basePriceMVR.toLocaleString()}` 
              : `$${space.basePriceUSD.toLocaleString()}`}
            <span className="text-xs text-muted-foreground font-normal ml-1">/24hrs</span>
          </div>
          {isPreOpeningRate && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
              <Tag size={10} />
              <span>Pre-opening rate</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default SpaceCard;
