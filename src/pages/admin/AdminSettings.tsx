import { useState } from "react";
import { Save, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SPACES, ADD_ONS } from "@/types/booking";
import { toast } from "sonner";

const AdminSettings = () => {
  const [taxRate, setTaxRate] = useState(8);
  const [depositPercentage, setDepositPercentage] = useState(50);
  const [splitEventAllowed, setSplitEventAllowed] = useState(false);
  const [spacePrices, setSpacePrices] = useState<Record<string, number>>(
    Object.fromEntries(SPACES.map(s => [s.id, s.basePrice]))
  );
  const [addOnPrices, setAddOnPrices] = useState<Record<string, number>>(
    Object.fromEntries(ADD_ONS.map(a => [a.id, a.price]))
  );

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure venue pricing and booking rules</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure tax rates and deposit requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">GST Rate (%)</Label>
                  <div className="relative">
                    <Input
                      id="taxRate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                  <div className="relative">
                    <Input
                      id="depositPercentage"
                      type="number"
                      value={depositPercentage}
                      onChange={(e) => setDepositPercentage(Number(e.target.value))}
                      className="pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="splitEvent" className="text-base">Allow Split Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow Floor 1 and Floor 2 to be booked by different clients on the same date
                  </p>
                </div>
                <Switch
                  id="splitEvent"
                  checked={splitEventAllowed}
                  onCheckedChange={setSplitEventAllowed}
                />
              </div>
            </CardContent>
          </Card>

          {/* Space Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Space Pricing</CardTitle>
              <CardDescription>Set base prices for each venue space (per day)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPACES.map((space) => (
                  <div key={space.id} className="space-y-2">
                    <Label htmlFor={`price-${space.id}`}>{space.name}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id={`price-${space.id}`}
                        type="number"
                        value={spacePrices[space.id]}
                        onChange={(e) => setSpacePrices(prev => ({
                          ...prev,
                          [space.id]: Number(e.target.value)
                        }))}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Capacity: {space.capacity} guests
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-on Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Add-on Services</CardTitle>
              <CardDescription>Configure pricing for additional services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ADD_ONS.map((addon) => (
                  <div key={addon.id} className="space-y-2">
                    <Label htmlFor={`addon-${addon.id}`}>{addon.name}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id={`addon-${addon.id}`}
                        type="number"
                        value={addOnPrices[addon.id]}
                        onChange={(e) => setAddOnPrices(prev => ({
                          ...prev,
                          [addon.id]: Number(e.target.value)
                        }))}
                        className="pl-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure invoice numbering and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input id="invoicePrefix" defaultValue="PBG-INV" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptPrefix">Receipt Number Prefix</Label>
                  <Input id="receiptPrefix" defaultValue="PBG-RCPT" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-gold-gradient text-primary-foreground hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
