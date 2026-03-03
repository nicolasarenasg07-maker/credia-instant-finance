import { Zap, Target, Eye, Heart, Users, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Shared components (mirrors MVPLanding style)
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

function AboutNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link to="/nosotros" className="text-sm text-foreground font-medium transition-colors">
            Nosotros
          </Link>
        </div>
        <Link to="/#contacto">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
            Quiero financiar mis facturas
          </button>
        </Link>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-muted-foreground">Conoce nuestra historia</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Impulsamos el{" "}
            <span className="text-gradient">crecimiento</span>{" "}
            de las PYMEs colombianas
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Somos una plataforma de financiamiento de facturas que usa inteligencia artificial
            para dar liquidez rapida a las pequenas y medianas empresas de Colombia.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Who we are
// ---------------------------------------------------------------------------

function AboutWhoWeAre() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Quienes <span className="text-gradient">somos</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                credIA es una plataforma de financiamiento de facturas que forma parte de una empresa
                dedicada a impulsar el crecimiento de las PYMEs en el mercado colombiano.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Combinamos tecnologia de inteligencia artificial con un profundo conocimiento del
                ecosistema empresarial colombiano para ofrecer soluciones de liquidez rapidas,
                transparentes y accesibles.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nacimos con la conviccion de que las pequenas y medianas empresas son el motor
                del desarrollo economico y social de Colombia, y que merecen acceso a herramientas
                financieras que antes solo estaban disponibles para las grandes corporaciones.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "PYMEs", label: "Enfoque exclusivo", icon: Building2 },
                { value: "Colombia", label: "Mercado principal", icon: Users },
                { value: "IA", label: "Tecnologia avanzada", icon: TrendingUp },
                { value: "24h", label: "Tiempo de respuesta", icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6 text-center hover:border-primary/50 transition-all">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mission, Vision, Values
// ---------------------------------------------------------------------------

function AboutMissionVision() {
  const items = [
    {
      icon: Target,
      title: "Nuestra Mision",
      description:
        "Mejorar los resultados financieros de las PYMEs colombianas a traves de soluciones de financiamiento accesibles e impulsadas por inteligencia artificial, permitiendoles crecer, generar empleo y contribuir al desarrollo del pais.",
    },
    {
      icon: Eye,
      title: "Nuestra Vision",
      description:
        "Ser la plataforma lider de financiamiento de facturas en Colombia, reconocida por democratizar el acceso al capital de trabajo y por ser el aliado tecnologico de confianza de las PYMEs.",
    },
    {
      icon: Heart,
      title: "Lo que creemos",
      description:
        "Creemos firmemente que las empresas generan desarrollo en la sociedad. Cada PYME que crece crea empleos, fortalece comunidades y transforma vidas. Nuestro trabajo es asegurarnos de que la falta de liquidez nunca sea un obstaculo para ese crecimiento.",
    },
  ];

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nuestro <span className="text-gradient">proposito</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada decision que tomamos esta guiada por nuestra mision de impactar positivamente el ecosistema empresarial colombiano
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((item) => (
            <div key={item.title} className="gradient-border p-8 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why PYMEs matter
// ---------------------------------------------------------------------------

function AboutWhyPYMEs() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Por que las <span className="text-gradient">PYMEs</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            En Colombia, las PYMEs representan mas del 90% del tejido empresarial y generan
            cerca del 80% del empleo. Sin embargo, muchas enfrentan barreras para acceder a
            financiamiento tradicional: procesos lentos, requisitos excesivos y tasas elevadas.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            En credIA, usamos inteligencia artificial para evaluar el riesgo de las facturas de
            forma justa y eficiente. Esto nos permite ofrecer financiamiento rapido a empresas que
            el sistema tradicional muchas veces ignora, ayudandolas a convertir sus cuentas por
            cobrar en liquidez inmediata para seguir operando y creciendo.
          </p>
          <Link to="/#contacto">
            <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity mt-4">
              Quiero financiar mis facturas
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function AboutFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
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

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AboutNavbar />
      <main>
        <AboutHero />
        <AboutWhoWeAre />
        <AboutMissionVision />
        <AboutWhyPYMEs />
      </main>
      <AboutFooter />
    </div>
  );
}
