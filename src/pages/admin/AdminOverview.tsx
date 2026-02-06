import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard, StatCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  FileText, 
  Users, 
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockDeals, mockSMEs } from "@/lib/mockData";

const AdminOverview = () => {
  const pendingDeals = mockDeals.filter(d => d.status === 'pending_review').length;
  const totalFunded = mockDeals
    .filter(d => d.status === 'funded' || d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);
  const activeSMEs = mockSMEs.filter(s => s.kybStatus === 'verified').length;
  const highRiskDeals = mockDeals.filter(d => d.aiScore < 50).length;

  const stats = [
    { 
      label: "Pending Review", 
      value: pendingDeals.toString(), 
      change: "Requires attention",
      changeType: pendingDeals > 0 ? "negative" as const : "positive" as const,
      icon: <Clock className="w-6 h-6" />
    },
    { 
      label: "Total Funded (MTD)", 
      value: `€${(totalFunded / 1000).toFixed(0)}K`, 
      change: "+12% vs last month",
      changeType: "positive" as const,
      icon: <DollarSign className="w-6 h-6" />
    },
    { 
      label: "Active SMEs", 
      value: activeSMEs.toString(), 
      change: `${mockSMEs.length} total registered`,
      changeType: "neutral" as const,
      icon: <Users className="w-6 h-6" />
    },
    { 
      label: "High Risk Alerts", 
      value: highRiskDeals.toString(), 
      change: highRiskDeals > 0 ? "Manual review needed" : "All clear",
      changeType: highRiskDeals > 0 ? "negative" as const : "positive" as const,
      icon: <AlertTriangle className="w-6 h-6" />
    },
  ];

  const recentDeals = mockDeals.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Alerts Section */}
        {(pendingDeals > 0 || highRiskDeals > 0) && (
          <GlassCard className="border-warning/30 bg-warning/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-warning mb-1">Action Required</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingDeals > 0 && `${pendingDeals} deals awaiting review. `}
                  {highRiskDeals > 0 && `${highRiskDeals} high-risk deals need manual assessment.`}
                </p>
              </div>
              <Link to="/admin/deals?status=pending_review">
                <Button variant="outline" size="sm">
                  Review Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Deals */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Deals</h2>
              <Link to="/admin/deals">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentDeals.map((deal) => (
                <Link 
                  key={deal.id}
                  to={`/admin/deals/${deal.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{deal.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{deal.smeName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{deal.amount.toLocaleString()}</p>
                    <StatusBadge 
                      status={
                        deal.status === 'approved' || deal.status === 'funded' || deal.status === 'paid' 
                          ? 'approved' 
                          : deal.status === 'rejected' 
                            ? 'rejected' 
                            : 'pending'
                      }
                    >
                      {deal.status.replace('_', ' ')}
                    </StatusBadge>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Portfolio Stats */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-6">Portfolio Overview</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Approval Rate</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-success">78%</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Avg. Interest Rate</p>
                    <p className="text-sm text-muted-foreground">Active deals</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">3.2%</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Total AUM</p>
                    <p className="text-sm text-muted-foreground">Assets under management</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">€1.2M</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Default Rate</p>
                    <p className="text-sm text-muted-foreground">Last 12 months</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-success">0.8%</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* SME Risk Distribution */}
        <GlassCard>
          <h2 className="text-lg font-semibold mb-6">SME Risk Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-3xl font-bold text-success">
                {mockSMEs.filter(s => s.riskTier === 'low').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Low Risk</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-3xl font-bold text-warning">
                {mockSMEs.filter(s => s.riskTier === 'medium').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Medium Risk</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-3xl font-bold text-destructive">
                {mockSMEs.filter(s => s.riskTier === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">High Risk</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
