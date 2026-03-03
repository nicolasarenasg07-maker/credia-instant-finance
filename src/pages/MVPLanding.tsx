import { useState, type FormEvent } from "react";
import { Zap, ArrowRight, Brain, Clock, Shield, CheckCircle, AlertTriangle, XCircle, Send, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { scoreInvoice, type ScoreResult } from "@/scoring/scoreInvoice";
import { submitLead, type Lead } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Shared small components
// ---------------------------------------------------------------------------

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold">
        cred<span className="text-gradient">IA</span>
      </span>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  if (decision === "APPROVE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success border border-success/30">
        <CheckCircle className="w-4 h-4" /> Pre-aprobado
      </span>
    );
  }
  if (decision === "REQUEST_DOCS") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-warning/20 text-warning border border-warning/30">
        <AlertTriangle className="w-4 h-4" /> Requiere documentos
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-destructive/20 text-destructive border border-destructive/30">
      <XCircle className="w-4 h-4" /> Riesgo alto
    </span>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

function MVPNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Como funciona
          </a>
          <a href="#simular" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Simular
          </a>
          <a href="#contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contacto
          </a>
          <Link to="/nosotros" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Nosotros
          </Link>
        </div>
        <a href="#contacto">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
            Quiero financiar mis facturas
          </button>
        </a>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function MVPHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-muted-foreground">Financiamiento de facturas con IA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Convierte tus facturas en{" "}
            <span className="text-gradient">liquidez inmediata</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sube tus facturas por cobrar. Nuestra IA evalua el riesgo en tiempo real.
            Recibe financiamiento en menos de 24 horas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#simular">
              <button className="group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
                Simula tu factura
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#contacto">
              <button className="px-8 py-4 rounded-xl text-lg font-semibold border border-primary/50 text-foreground hover:bg-primary/10 transition-colors">
                Dejar mis datos
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

const steps = [
  {
    number: "01",
    title: "Sube tu factura",
    description: "Comparte los datos basicos de tu factura por cobrar: monto, plazo y pagador.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Evaluacion AI",
    description: "Nuestra inteligencia artificial analiza el riesgo del pagador y las condiciones de la factura.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Decision inmediata",
    description: "Recibe una pre-aprobacion en minutos con la tasa estimada de financiamiento.",
    icon: Clock,
  },
  {
    number: "04",
    title: "Recibe tu dinero",
    description: "Una vez aprobado, el dinero llega a tu cuenta. Nosotros cobramos al pagador en la fecha de vencimiento.",
    icon: CheckCircle,
  },
];

function MVPHowItWorks() {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Como funciona <span className="text-gradient">credIA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            De factura a liquidez en cuatro pasos simples
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}
              <div className="relative glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]">
                <span className="text-6xl font-bold text-primary/20 absolute top-4 right-4">{step.number}</span>
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

// ---------------------------------------------------------------------------
// Pre-scoring widget
// ---------------------------------------------------------------------------

function MVPPreScoring({
  onScored,
}: {
  onScored: (result: ScoreResult, amount: number, days: number, payer: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [payerName, setPayerName] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleScore = () => {
    const invoiceAmount = parseFloat(amount) || 0;
    const daysToDue = parseInt(days) || 30;
    const payer = payerName.trim() || "Empresa desconocida";
    if (invoiceAmount <= 0) return;

    const r = scoreInvoice({ invoiceAmount, daysToDue, payerName: payer });
    setResult(r);
    onScored(r, invoiceAmount, daysToDue, payer);
  };

  const scoreColor = (s: number) => (s >= 75 ? "text-success" : s >= 55 ? "text-warning" : "text-destructive");

  return (
    <section id="simular" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simula tu factura</h2>
            <p className="text-lg text-muted-foreground">
              Obtiene un estimado inmediato de aprobacion y tasa
            </p>
          </div>

          <div className="glass rounded-2xl p-8 glow">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Monto de la factura</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="50,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-12 pl-8 pr-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Dias para vencimiento</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre de la empresa que paga</label>
                <input
                  type="text"
                  placeholder="Ej: PEMEX, Bimbo, etc."
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <button
                onClick={handleScore}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-lg text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
              >
                Obtener estimado
                <ArrowRight className="w-5 h-5" />
              </button>

              {result && (
                <div className="mt-6 space-y-4 p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Score AI</p>
                      <p className={`text-4xl font-bold ${scoreColor(result.score)}`}>
                        {result.score}
                        <span className="text-lg text-muted-foreground font-normal">/100</span>
                      </p>
                    </div>
                    <DecisionBadge decision={result.decision} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Tasa estimada</p>
                      <p className="text-xl font-bold">{result.pricing.feePercent}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">APR implicito</p>
                      <p className="text-xl font-bold">{result.pricing.impliedAPR}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Factores del score</p>
                    <ul className="space-y-1">
                      {result.explanation.slice(0, 3).map((line, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">&#8226;</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA to contact form */}
                  <a
                    href="#contacto"
                    className="block w-full text-center py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary font-medium hover:bg-primary/30 transition-colors"
                  >
                    Quiero financiar esta factura &rarr;
                  </a>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground">
                Este es un estimado preliminar. Los terminos finales se determinan tras la revision completa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Lead capture form
// ---------------------------------------------------------------------------

function MVPContactForm({ prefill }: { prefill: { amount: number; days: number; payer: string; score?: number; decision?: string; fee?: number } | null }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    seller_company: "",
    notes: "",
  });
  const [dataConsent, setDataConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company || !form.seller_company || !dataConsent) return;

    setStatus("sending");

    const lead: Lead = {
      name: form.name,
      email: form.email,
      company: form.company,
      phone: form.phone || undefined,
      seller_company: form.seller_company,
      data_consent: dataConsent,
      data_consent_at: new Date().toISOString(),
      invoice_amount: prefill?.amount || 0,
      days_to_due: prefill?.days || 30,
      payer_name: prefill?.payer || "",
      ai_score: prefill?.score,
      ai_decision: prefill?.decision,
      estimated_fee: prefill?.fee,
      notes: form.notes || undefined,
    };

    const res = await submitLead(lead);
    setStatus(res.ok ? "sent" : "error");
  };

  if (status === "sent") {
    return (
      <section id="contacto" className="py-24 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-3xl font-bold">Recibimos tu informacion</h2>
            <p className="text-lg text-muted-foreground">
              Nos pondremos en contacto contigo en las proximas 24 horas para discutir las opciones de financiamiento para tu factura.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Dejanos tus datos
            </h2>
            <p className="text-lg text-muted-foreground">
              Te contactamos para evaluar tu factura y darte una propuesta concreta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Juan Perez"
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="juan@empresa.com"
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Empresa *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Mi Empresa S.A."
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Telefono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Empresa que vende la factura *</label>
              <input
                type="text"
                required
                value={form.seller_company}
                onChange={(e) => update("seller_company", e.target.value)}
                placeholder="Nombre de la empresa vendedora"
                className="w-full h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            {prefill && prefill.amount > 0 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm space-y-1">
                <p className="font-medium text-primary">Datos de la simulacion</p>
                <p className="text-muted-foreground">
                  Monto: <span className="text-foreground font-medium">${prefill.amount.toLocaleString()}</span>
                  {" | "}Pagador: <span className="text-foreground font-medium">{prefill.payer}</span>
                  {" | "}Plazo: <span className="text-foreground font-medium">{prefill.days} dias</span>
                  {prefill.score != null && (
                    <>
                      {" | "}Score: <span className="text-foreground font-medium">{prefill.score}/100</span>
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Notas adicionales</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Cuentanos mas sobre tus necesidades de financiamiento..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={dataConsent}
                onChange={(e) => setDataConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Acepto el envio de mis datos personales y financieros para que credIA evalue opciones de financiamiento de facturas. *
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "sending" || !dataConsent}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-lg text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "sending" ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar informacion
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-sm text-center text-destructive">
                Hubo un error al enviar. Por favor intenta de nuevo.
              </p>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Tu informacion es confidencial y esta protegida. Solo la usaremos para evaluar opciones de financiamiento. Al enviar este formulario, tu consentimiento queda registrado.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Trust / Social proof
// ---------------------------------------------------------------------------

function MVPTrust() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Evaluacion con IA", desc: "Analisis de riesgo inteligente que evalua la calidad del pagador y las condiciones de la factura." },
            { icon: Clock, title: "Respuesta en minutos", desc: "Obtiene una pre-aprobacion y tasa estimada de forma inmediata, sin papeleos." },
            { icon: Shield, title: "Datos protegidos", desc: "Tu informacion financiera esta encriptada y se maneja con los mas altos estandares de seguridad." },
          ].map((f) => (
            <div key={f.title} className="gradient-border p-8 rounded-2xl text-center hover:scale-[1.02] transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <f.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function MVPFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#simular" className="hover:text-foreground transition-colors">Simular</a>
            <a href="#contacto" className="hover:text-foreground transition-colors">Contacto</a>
            <Link to="/nosotros" className="hover:text-foreground transition-colors">Nosotros</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 credIA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page composition
// ---------------------------------------------------------------------------

export default function MVPLanding() {
  const [scorePrefill, setScorePrefill] = useState<{
    amount: number;
    days: number;
    payer: string;
    score?: number;
    decision?: string;
    fee?: number;
  } | null>(null);

  const handleScored = (result: ScoreResult, amount: number, days: number, payer: string) => {
    setScorePrefill({
      amount,
      days,
      payer,
      score: result.score,
      decision: result.decision,
      fee: result.pricing.feePercent,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <MVPNavbar />
      <main>
        <MVPHero />
        <MVPHowItWorks />
        <MVPTrust />
        <MVPPreScoring onScored={handleScored} />
        <MVPContactForm prefill={scorePrefill} />
      </main>
      <MVPFooter />
    </div>
  );
}
