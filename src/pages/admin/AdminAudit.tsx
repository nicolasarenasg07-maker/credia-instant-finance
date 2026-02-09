import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Users,
  User,
  Settings
} from "lucide-react";
import { getAuditLogs } from "@/mock/mockDb";
import type { AuditLog } from "@/lib/mockData";

const resourceTypeIcons: Record<AuditLog['resourceType'], React.ReactNode> = {
  deal: <FileText className="w-4 h-4" />,
  sme: <Users className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />,
};

const actionColors: Record<string, string> = {
  'DEAL_APPROVED': 'bg-success/20 text-success border-success/30',
  'DEAL_REJECTED': 'bg-destructive/20 text-destructive border-destructive/30',
  'DEAL_FUNDED': 'bg-primary/20 text-primary border-primary/30',
  'INVOICE_SUBMITTED': 'bg-secondary/20 text-secondary border-secondary/30',
  'SME_SUSPENDED': 'bg-destructive/20 text-destructive border-destructive/30',
  'SME_REACTIVATED': 'bg-success/20 text-success border-success/30',
  'SME_VERIFIED': 'bg-success/20 text-success border-success/30',
  'PROFILE_UPDATED': 'bg-muted text-foreground border-border',
  'RATE_OVERRIDE': 'bg-warning/20 text-warning border-warning/30',
  'DOCS_REQUESTED': 'bg-warning/20 text-warning border-warning/30',
  'PAYER_NOTICE_SENT': 'bg-primary/20 text-primary border-primary/30',
};

const AdminAudit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  // Refresh on focus (so newly created events show immediately)
  useEffect(() => {
    const handleFocus = () => setAuditLogs(getAuditLogs());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResource = resourceFilter === "all" || log.resourceType === resourceFilter;
    const matchesRole = roleFilter === "all" || log.userRole === roleFilter;
    return matchesSearch && matchesResource && matchesRole;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">Complete history of all platform actions (append-only)</p>
        </div>

        {/* Filters */}
        <GlassCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-4">
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="deal">Deals</SelectItem>
                  <SelectItem value="sme">SMEs</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SME">SME</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Log Stats */}
        <div className="grid grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <p className="text-3xl font-bold">{auditLogs.length}</p>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-primary">
              {auditLogs.filter(l => l.resourceType === 'deal').length}
            </p>
            <p className="text-sm text-muted-foreground">Deal Events</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-secondary">
              {auditLogs.filter(l => l.userRole === 'ADMIN').length}
            </p>
            <p className="text-sm text-muted-foreground">Admin Actions</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-3xl font-bold text-warning">
              {auditLogs.filter(l => l.userRole === 'SME').length}
            </p>
            <p className="text-sm text-muted-foreground">SME Actions</p>
          </GlassCard>
        </div>

        {/* Audit Table */}
        <GlassCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const { date, time } = formatTimestamp(log.timestamp);
                return (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <p className="font-medium">{time}</p>
                        <p className="text-xs text-muted-foreground">{date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              log.userRole === 'ADMIN' 
                                ? 'border-primary/30 text-primary' 
                                : 'border-secondary/30 text-secondary'
                            }`}
                          >
                            {log.userRole}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={actionColors[log.action] || 'bg-muted text-foreground'}
                      >
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {resourceTypeIcons[log.resourceType]}
                        </span>
                        <span className="capitalize">{log.resourceType}</span>
                        <span className="text-xs text-muted-foreground">
                          ({log.resourceId})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate" title={log.details}>
                        {log.details}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audit logs found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GlassCard>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center">
          Audit logs are immutable and cannot be modified or deleted. All actions are permanently recorded for compliance purposes.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminAudit;
