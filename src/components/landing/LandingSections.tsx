import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Shield, ArrowRight, TrendingUp, Clock, CheckCircle } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            cred<span className="text-gradient">IA</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const steps = [
  {
    number: "01",
    title: "Upload Invoice",
    description: "Submit your unpaid invoices in seconds. Our OCR extracts all key data automatically.",
    icon: TrendingUp,
  },
  {
    number: "02",
    title: "AI Risk Assessment",
    description: "Our AI analyzes 100+ data points to assess invoice quality and payer reliability.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Instant Decision",
    description: "Get approval within minutes. No paperwork, no delays. Transparent pricing based on risk.",
    icon: Clock,
  },
  {
    number: "04",
    title: "Receive Funds",
    description: "Money hits your account immediately. We collect payment from your customer on due date.",
    icon: CheckCircle,
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scoring",
    description: "Multi-layer risk assessment using machine learning models trained on millions of invoices.",
  },
  {
    icon: Zap,
    title: "Instant Funding",
    description: "From upload to funding in under 24 hours. No lengthy approval processes.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Enterprise encryption, SOC2 compliant, and rigorous data protection protocols.",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-muted-foreground">AI-powered invoice financing</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Turn your invoices into{" "}
            <span className="text-gradient">instant liquidity</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your unpaid invoices. Our AI evaluates risk in real-time. 
            Get funded within 24 hours. It's that simple.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Check your invoice
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="heroOutline" size="xl">
                Get funded today
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span>€50M+ funded</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span>2,000+ businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span>24h funding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient">credIA</span> works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From invoice to funding in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}
              
              <div className="relative glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]">
                {/* Step number */}
                <span className="text-6xl font-bold text-primary/20 absolute top-4 right-4">
                  {step.number}
                </span>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why choose <span className="text-gradient">credIA</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Institutional-grade technology, designed for growing businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="gradient-border p-8 rounded-2xl text-center hover:scale-[1.02] transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PreScoringWidget() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pre-score your invoice
            </h2>
            <p className="text-xl text-muted-foreground">
              Get an instant estimate of your approval probability and rate
            </p>
          </div>

          <div className="glass rounded-2xl p-8 glow">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Invoice Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                    <input
                      type="number"
                      placeholder="50,000"
                      className="w-full h-12 pl-8 pr-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Days Until Due</label>
                  <input
                    type="number"
                    placeholder="30"
                    className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Payer Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Acme Corporation"
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <Button variant="hero" size="lg" className="w-full">
                Get instant estimate
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is an estimate only. Final terms based on full application review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              cred<span className="text-gradient">IA</span>
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 credIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
