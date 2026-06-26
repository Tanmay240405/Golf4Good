import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import GolfPathOverlay from '../components/landing/GolfPathOverlay';

export default function Landing() {
  return (
    <>
      <GolfPathOverlay />
      <Hero />
      <div className="section-divider relative z-10" />
      <HowItWorks />
      <div className="section-divider relative z-10" />
      <Pricing />
      <div className="section-divider relative z-10" />
      <Testimonials />
      <div className="section-divider relative z-10" />
      <FAQ />
    </>
  );
}
