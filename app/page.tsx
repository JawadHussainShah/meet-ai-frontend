import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import Demo from '@/components/landing/demo';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';
import FAQ from '@/components/landing/faq';
import CTA from '@/components/landing/cta';
import Footer from '@/components/landing/footer';
import Integrations from '@/components/landing/integrations';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Integrations/>
      <HowItWorks />
      <Demo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}