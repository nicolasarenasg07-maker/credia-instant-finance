import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  UserCheck,
  UserX,
  RefreshCw,
  Building2
} from "lucide-react";
import { getSMEs, suspendSME, reactivateSME } from "@/mock/mockDb";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { SME } from "@/lib/mockData";

const getKYBStatusBadge = (status: SME['kybStatus']): 'approved' | 'pending' | 'rejected' | 'processing' => {
  switch (status) {
    case 'verified':
      return 'approved';
    case 'rejected':
    case 'suspended':
      return 'rejected';
    case 'pending':
      return 'pending';
    default:
      return 'processing';
  }
};

const getRiskColor = (tier: SME['riskTier']) => {
  switch (tier) {
    case 'low':
      return 'text-success';
    case 'medium':
      return 'text-warning';
    case 'high':
      return 'text-destructive';
  }
};

const AdminSMEs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [smes, setSMEs] = useState<SME[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setSMEs(getSMEs());
  }, []);

  const filteredSMEs = smes.filter(sme => 
    sme.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sme.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sme.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspend = async (sme: SME) => {
    setIsProcessing(sme.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    suspendSME(sme.id, user?.id || 'admin-1', user?.name || 'Admin');
    setSMEs(getSMEs()); // Refresh from localStorage
    toast({
      title: "SME Suspended",
      description: `${sme.companyName} has been suspended.`,
      variant: "destructive",
    });
    setIsProcessing(null);
  };

  const handleReactivate = async (sme: SME) => {
    setIsProcessing(sme.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    reactivateSME(sme.id, user?.id || 'admin-1', user?.name || 'Admin');
    setSMEs(getSMEs()); // Refresh from localStorage
    toast({
      title: "SME Reactivated",
      description: `${sme.companyName} has been reactivated.`,
    });
    setIsProcessing(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">SME Management</h1>
          <p className="text-muted-foreground">Manage registered businesses and their verification status</p>
        </div>

        {/* Search */}
        <GlassCard>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by company name, email, or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </GlassCard>

        {/* SME Stats */}
        <div className="grid grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <p className="text-3xl font-bold">{smes.length}</p>
            <p className="text-sm text-muted-foreground">Total SMEs</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-success">
              {smes.filter(s => s.kybStatus === 'verified').length}
            </p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-warning">
              {smes.filter(s => s.kybStatus === 'pending').length}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-destructive">
              {smes.filter(s => s.kybStatus === 'suspended').length}
            </p>
            <p className="text-sm text-muted-foreground">Suspended</p>
          </GlassCard>
        </div>

        {/* SME Table */}
        <GlassCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>KYB Status</TableHead>
                <TableHead>Risk Tier</TableHead>
                <TableHead>Total Funded</TableHead>
                <TableHead>Active Deals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSMEs.map((sme) => (
                <TableRow key={sme.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{sme.companyName}</p>
                        <p className="text-xs text-muted-foreground">{sme.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{sme.country}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{sme.profileCompleteness}%</span>
                      </div>
                      <Progress value={sme.profileCompleteness} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getKYBStatusBadge(sme.kybStatus)}>
                      {sme.kybStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium capitalize ${getRiskColor(sme.riskTier)}`}>
                      {sme.riskTier}
                    </span>
                  </TableCell>
                  <TableCell>€{sme.totalFunded.toLocaleString()}</TableCell>
                  <TableCell>{sme.activeDeals}</TableCell>
                  <TableCell className="text-right">
                    {sme.kybStatus === 'suspended' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-success hover:text-success">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Reactivate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reactivate SME</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reactivate {sme.companyName}? They will be able to submit new invoices.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              onClick={() => handleReactivate(sme)}
                              disabled={isProcessing === sme.id}
                            >
                              {isProcessing === sme.id ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <UserCheck className="w-4 h-4 mr-2" />
                              )}
                              Confirm Reactivate
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : sme.kybStatus === 'verified' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <UserX className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Suspend SME</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to suspend {sme.companyName}? They will not be able to submit new invoices.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleSuspend(sme)}
                              disabled={isProcessing === sme.id}
                            >
                              {isProcessing === sme.id ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <UserX className="w-4 h-4 mr-2" />
                              )}
                              Confirm Suspend
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending verification</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredSMEs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No SMEs found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminSMEs;
