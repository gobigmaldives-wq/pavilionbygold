import { format } from "date-fns";
import { Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

// Mock payments
const mockPayments = [
  {
    id: "1",
    receiptNumber: "PBG-RCPT-2025-0001",
    invoiceNumber: "PBG-INV-2025-0003",
    clientName: "Amira Hassan",
    amount: 2430,
    type: "deposit",
    method: "Credit Card",
    status: "completed",
    processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    receiptNumber: "PBG-RCPT-2025-0002",
    invoiceNumber: "PBG-INV-2025-0003",
    clientName: "Amira Hassan",
    amount: 2430,
    type: "balance",
    method: "Bank Transfer",
    status: "completed",
    processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    receiptNumber: "PBG-RCPT-2025-0003",
    invoiceNumber: "PBG-INV-2025-0002",
    clientName: "Michael Chen",
    amount: 2700,
    type: "deposit",
    method: "Credit Card",
    status: "completed",
    processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    receiptNumber: null,
    invoiceNumber: "PBG-INV-2025-0001",
    clientName: "Sarah Johnson",
    amount: 6480,
    type: "deposit",
    method: null,
    status: "pending",
    processedAt: null,
  },
];

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
};

const statusColors = {
  completed: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
};

const AdminPayments = () => {
  const completedPayments = mockPayments.filter(p => p.status === "completed");
  const totalReceived = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track all payment transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Received</p>
            <p className="text-3xl font-serif text-gold">${totalReceived.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-serif text-green-600">{completedPayments.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-serif text-yellow-600">
              {mockPayments.filter(p => p.status === "pending").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-3xl font-serif text-foreground">${totalReceived.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Receipt #</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Method</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockPayments.map((payment) => {
                  const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons];
                  
                  return (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <StatusIcon className={cn("h-5 w-5", statusColors[payment.status as keyof typeof statusColors])} />
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-foreground">
                        {payment.receiptNumber || "-"}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                        {payment.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {payment.clientName}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {payment.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {payment.method || "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gold">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {payment.processedAt 
                          ? format(new Date(payment.processedAt), "MMM d, yyyy")
                          : "-"
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          {payment.status === "completed" && (
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPayments;
