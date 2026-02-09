import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard, StatCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Upload,
  Brain,
  DollarSign,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDealsBySme } from "@/mock/mockDb";
import type { Deal } from "@/lib/mockData";

const howItWorksSteps = [
  {
    step: 1,
    title: "Complete Your Profile",
    description: "Provide company details, bank information, and verify your identity.",
    icon: CheckCircle,
    status: "current",
  },
  {
    step: 2,
    title: "Upload Your Invoices",
    description: "Submit unpaid invoices (30/60/90 days) from creditworthy customers.",
    icon: Upload,
    status: "upcoming",
  },
  {
    step: 3,
    title: "AI Risk Assessment",
    description: "Our AI analyzes your invoice, payer creditworthiness, and fraud signals.",
    icon: Brain,
    status: "upcoming",
  },
  {
    step: 4,
    title: "Receive Funds",
    description: "Approved invoices are funded within 24 hours. We handle collection.",
    icon: DollarSign,
    status: "upcoming",
  },
];

const getStatusBadgeType = (
  status: Deal["status"]
): "approved" | "pending" | "rejected" | "processing" => {
  switch (status) {
    case "approved":
    case "funded":
    case "paid":
      return "approved";
    case "rejected":
      return "rejected";
    case "pending_review":
    case "docs_requested":
      return "pending";
    default:
      return "processing";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (user) {
      setDeals(getDealsBySme(user.id));
    }
  }, [user]);

  const totalFunded = deals
    .filter((d) => d.status === "funded" || d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);
  const activeCount = deals.filter(
    (d) => d.status !== "rejected" && d.status !== "paid"
  ).length;
  const avgRate =
    deals.length > 0
      ? (
          deals.reduce((s, d) => s + (d.finalRate || d.suggestedRate), 0) /
          deals.length
        ).toFixed(1)
      : "--";

  const stats = [
    {
      label: "Total Funded",
      value: totalFunded > 0 ? `€${(totalFunded / 1000).toFixed(0)}K` : "€0",
      change: totalFunded > 0 ? "Active financing" : "Start uploading invoices",
      changeType: (totalFunded > 0 ? "positive" : "neutral") as
        | "positive"
        | "neutral",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      label: "Active Invoices",
      value: activeCount.toString(),
      change:
        activeCount > 0 ? `${deals.length} total submitted` : "No invoices yet",
      changeType: (activeCount > 0 ? "positive" : "neutral") as
        | "positive"
        | "neutral",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      label: "Avg. Fee Rate",
      value: avgRate === "--" ? "--" : `${avgRate}%`,
      change: "Based on risk profile",
      changeType: "neutral" as const,
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      label: "Profile Status",
      value: deals.length > 0 ? "Active" : "Incomplete",
      change: deals.length > 0 ? "Verified" : "Complete to get funded",
      changeType: (deals.length > 0 ? "positive" : "negative") as
        | "positive"
        | "negative",
      icon: <AlertCircle className="w-6 h-6" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* How It Works Section (show only when no deals) */}
        {deals.length === 0 && (
          <GlassCard glow className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to credIA</h2>
                  <p className="text-muted-foreground">
                    Let's get you set up for invoice financing
                  </p>
                </div>
                <StatusBadge status="pending">Setup in progress</StatusBadge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {howItWorksSteps.map((item, index) => (
                  <div
                    key={item.step}
                    className={`relative p-5 rounded-xl border transition-all ${
                      item.status === "current"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-muted/30"
                    }`}
                  >
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-border/50 -translate-y-1/2 z-0" />
                    )}

                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                        item.status === "current"
                          ? "bg-gradient-to-br from-primary to-secondary"
                          : "bg-muted"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          item.status === "current"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div className="text-xs font-medium text-primary mb-1">
                      Step {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {item.status === "current" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Invoice CTA */}
          <GlassCard
            gradient
            className="relative overflow-hidden group hover:border-secondary/50 transition-all cursor-pointer"
          >
            <Link to="/dashboard/submit" className="block">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {deals.length > 0
                        ? "Submit another invoice"
                        : "Upload your first invoice"}
                    </h3>
                    <p className="text-muted-foreground">
                      Submit an invoice and get an instant AI risk assessment and
                      funding estimate.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-medium">
                    Submit invoice
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="opacity-10">
                  <FileText className="w-24 h-24 text-secondary" />
                </div>
              </div>
            </Link>
          </GlassCard>

          {/* Complete Profile CTA */}
          <GlassCard
            gradient
            className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer"
          >
            <Link to="/dashboard" className="block">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Complete your profile
                    </h3>
                    <p className="text-muted-foreground">
                      Add company details, bank account, and verify your identity to
                      start financing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Start now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient">
                    {deals.length > 0 ? "80%" : "0%"}
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </Link>
          </GlassCard>
        </div>

        {/* Submitted Deals Table */}
        {deals.length > 0 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Invoices</h2>
              <Link to="/dashboard/submit">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit New
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{deal.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {deal.payerName} · {formatDate(deal.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">€{deal.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {deal.suggestedRate}% fee
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        deal.aiScore >= 75
                          ? "bg-success/20 text-success"
                          : deal.aiScore >= 55
                          ? "bg-warning/20 text-warning"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {deal.aiScore}
                    </div>
                    <StatusBadge status={getStatusBadgeType(deal.status)}>
                      {deal.status.replace("_", " ")}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Empty Activity State (only when no deals) */}
        {deals.length === 0 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="ghost" size="sm" disabled>
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Once you start uploading invoices and receiving funding, your
                activity will appear here.
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
