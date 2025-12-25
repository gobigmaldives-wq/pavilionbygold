import { format } from "date-fns";
import { Download, Eye, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { PaymentStatus } from "@/types/booking";
import { cn } from "@/lib/utils";

// Mock invoices
const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "PBG-INV-2025-0001",
    clientName: "Sarah Johnson",
    clientEmail: "sarah.j@email.com",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    grandTotal: 12960,
    depositAmount: 6480,
    paymentStatus: "unpaid" as PaymentStatus,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    invoiceNumber: "PBG-INV-2025-0002",
    clientName: "Michael Chen",
    clientEmail: "m.chen@company.com",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    grandTotal: 5400,
    depositAmount: 2700,
    paymentStatus: "partially_paid" as PaymentStatus,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    invoiceNumber: "PBG-INV-2025-0003",
    clientName: "Amira Hassan",
    clientEmail: "amira.h@gmail.com",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    grandTotal: 4860,
    depositAmount: 2430,
    paymentStatus: "paid" as PaymentStatus,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const statusColors: Record<PaymentStatus, string> = {
  unpaid: "bg-red-100 text-red-800 border-red-200",
  partially_paid: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

const AdminInvoices = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Invoices</h1>
          <p className="text-muted-foreground">View and manage all invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
            <p className="text-3xl font-serif text-foreground">{mockInvoices.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Unpaid</p>
            <p className="text-3xl font-serif text-red-600">
              {mockInvoices.filter(i => i.paymentStatus === "unpaid").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Partially Paid</p>
            <p className="text-3xl font-serif text-yellow-600">
              {mockInvoices.filter(i => i.paymentStatus === "partially_paid").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Fully Paid</p>
            <p className="text-3xl font-serif text-green-600">
              {mockInvoices.filter(i => i.paymentStatus === "paid").length}
            </p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Event Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Deposit</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-foreground">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {format(new Date(invoice.eventDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ${invoice.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      ${invoice.depositAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={cn("capitalize", statusColors[invoice.paymentStatus])}
                      >
                        {invoice.paymentStatus.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Resend to Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminInvoices;
