import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye,
  ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDeals } from "@/mock/mockDb";
import type { Deal } from "@/lib/mockData";

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'docs_requested', label: 'Docs Requested' },
  { value: 'funded', label: 'Funded' },
  { value: 'paid', label: 'Paid' },
];

const scoreBandOptions = [
  { value: 'all', label: 'All Scores' },
  { value: 'high', label: 'High (75+)' },
  { value: 'medium', label: 'Medium (55-74)' },
  { value: 'low', label: 'Low (<55)' },
];

const getStatusBadgeType = (status: Deal['status']): 'approved' | 'pending' | 'rejected' | 'processing' => {
  switch (status) {
    case 'approved':
    case 'funded':
    case 'paid':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'pending_review':
    case 'docs_requested':
      return 'pending';
    default:
      return 'processing';
  }
};

const AdminDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreBand, setScoreBand] = useState("all");
  const [sortField, setSortField] = useState<keyof Deal>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = 
        deal.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.smeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.payerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      let matchesScore = true;
      if (scoreBand === 'high') matchesScore = deal.aiScore >= 75;
      else if (scoreBand === 'medium') matchesScore = deal.aiScore >= 55 && deal.aiScore < 75;
      else if (scoreBand === 'low') matchesScore = deal.aiScore < 55;
      return matchesSearch && matchesStatus && matchesScore;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const handleSort = (field: keyof Deal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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
          <h1 className="text-2xl font-bold">Deals</h1>
          <p className="text-muted-foreground">Review and manage invoice financing requests</p>
        </div>

        {/* Filters */}
        <GlassCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice, SME or payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={scoreBand} onValueChange={setScoreBand}>
                <SelectTrigger className="w-44">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Score band" />
                </SelectTrigger>
                <SelectContent>
                  {scoreBandOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Deals Table */}
        <GlassCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('invoiceNumber')}
                >
                  <div className="flex items-center gap-1">
                    Invoice
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>SME</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('aiScore')}
                >
                  <div className="flex items-center gap-1">
                    AI Score
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.invoiceNumber}</TableCell>
                  <TableCell>{deal.smeName}</TableCell>
                  <TableCell>{deal.payerName}</TableCell>
                  <TableCell>€{deal.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          deal.aiScore >= 75 
                            ? 'bg-success/20 text-success' 
                            : deal.aiScore >= 55 
                              ? 'bg-warning/20 text-warning'
                              : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {deal.aiScore}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${
                      deal.decision === 'APPROVE' ? 'text-success' :
                      deal.decision === 'REQUEST_DOCS' ? 'text-warning' :
                      deal.decision === 'REJECT' ? 'text-destructive' :
                      'text-muted-foreground'
                    }`}>
                      {deal.decision || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {deal.finalRate ? `${deal.finalRate}%` : `~${deal.suggestedRate}%`}
                  </TableCell>
                  <TableCell>{formatDate(deal.dueDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusBadgeType(deal.status)}>
                      {deal.status.replace('_', ' ')}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/admin/deals/${deal.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDeals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No deals found matching your criteria
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

export default AdminDeals;
