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
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { 
    label: "Total Funded", 
    value: "€0", 
    change: "Start uploading invoices",
    changeType: "neutral" as const,
    icon: <Wallet className="w-6 h-6" />
  },
  { 
    label: "Active Invoices", 
    value: "0", 
    change: "No invoices yet",
    changeType: "neutral" as const,
    icon: <FileText className="w-6 h-6" />
  },
  { 
    label: "Avg. Interest Rate", 
    value: "--", 
    change: "Based on risk profile",
    changeType: "neutral" as const,
    icon: <TrendingUp className="w-6 h-6" />
  },
  { 
    label: "Profile Status", 
    value: "Incomplete", 
    change: "Complete to get funded",
    changeType: "negative" as const,
    icon: <AlertCircle className="w-6 h-6" />
  },
];

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

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* How It Works Section */}
        <GlassCard glow className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to credIA</h2>
                <p className="text-muted-foreground">Let's get you set up for invoice financing</p>
              </div>
              <StatusBadge status="pending">Setup in progress</StatusBadge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorksSteps.map((item, index) => (
                <div 
                  key={item.step}
                  className={`relative p-5 rounded-xl border transition-all ${
                    item.status === 'current' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/50 bg-muted/30'
                  }`}
                >
                  {/* Connection line */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-border/50 -translate-y-1/2 z-0" />
                  )}

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    item.status === 'current'
                      ? 'bg-gradient-to-br from-primary to-secondary'
                      : 'bg-muted'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.status === 'current' ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>

                  <div className="text-xs font-medium text-primary mb-1">Step {item.step}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                  {item.status === 'current' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Complete Profile CTA */}
          <GlassCard gradient className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
            <Link to="/dashboard/profile" className="block">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Complete your profile</h3>
                    <p className="text-muted-foreground">Add company details, bank account, and verify your identity to start financing.</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Start now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient">0%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </Link>
          </GlassCard>

          {/* Upload Invoice CTA */}
          <GlassCard gradient className="relative overflow-hidden group hover:border-secondary/50 transition-all cursor-pointer">
            <Link to="/dashboard/upload" className="block">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upload your first invoice</h3>
                    <p className="text-muted-foreground">Submit an invoice and get an instant AI risk assessment and funding estimate.</p>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-medium">
                    Upload invoice
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Icon decoration */}
                <div className="opacity-10">
                  <FileText className="w-24 h-24 text-secondary" />
                </div>
              </div>
            </Link>
          </GlassCard>
        </div>

        {/* Understanding Invoice Financing */}
        <GlassCard>
          <h2 className="text-xl font-semibold mb-6">Understanding Invoice Financing</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium">What is Invoice Financing?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sell your unpaid invoices to get immediate cash flow instead of waiting 30, 60, or 90 days for payment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-medium">AI Risk Scoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI evaluates invoice quality, payer creditworthiness, and fraud signals to determine approval and pricing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-medium">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interest rates are dynamically calculated based on risk. Lower risk = lower rates. No hidden fees.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Recent Activity - Empty State */}
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
              Once you start uploading invoices and receiving funding, your activity will appear here.
            </p>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
