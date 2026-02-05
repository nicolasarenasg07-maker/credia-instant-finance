import { AINetworkAnimation } from "@/components/AINetworkAnimation";
import {
  Navbar,
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  PreScoringWidget,
  Footer,
} from "@/components/landing/LandingSections";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* AI Network Animation Background */}
      <div className="fixed inset-0 pointer-events-none">
        <AINetworkAnimation />
      </div>

      <Navbar />
      
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PreScoringWidget />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
